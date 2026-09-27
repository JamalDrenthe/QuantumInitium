import { createClient } from '@supabase/supabase-js';
import { AuthUser } from '../types/auth';

interface SupabaseAuthResponse {
  access_token?: string;
  user?: SupabaseUser;
  error_description?: string;
  msg?: string;
}

interface SupabaseUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
}

export type OAuthProvider = 'google' | 'linkedin_oidc' | 'facebook';
export type OAuthIntent = 'login' | 'register';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);
const demoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';
const sessionStorageKey = 'qi_supabase_access_token';
const oauthIntentStorageKey = 'qi_oauth_intent';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const isDemoModeEnabled = demoModeEnabled || !isSupabaseConfigured;
const supabaseClient =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey, {
        auth: {
          autoRefreshToken: false,
          detectSessionInUrl: true,
          persistSession: false
        }
      })
    : null;

const authHeaders = {
  apikey: supabaseKey || '',
  'Content-Type': 'application/json'
};

const getAuthError = (response: SupabaseAuthResponse): string =>
  response.error_description || response.msg || 'Authenticatie mislukt.';

export const getAccessToken = (): string | null => {
  try {
    return sessionStorage.getItem(sessionStorageKey);
  } catch {
    return null;
  }
};

const saveAccessToken = (accessToken: string): void => {
  try {
    sessionStorage.setItem(sessionStorageKey, accessToken);
  } catch {
    // Private browsing modes may block session storage; the in-memory flow still works.
  }
};

const saveOAuthIntent = (intent: OAuthIntent): void => {
  try {
    sessionStorage.setItem(oauthIntentStorageKey, intent);
  } catch {
    // Ignore storage failures; the OAuth flow still works without intent recovery.
  }
};

export const consumeOAuthIntent = (): OAuthIntent => {
  try {
    const intent = sessionStorage.getItem(oauthIntentStorageKey);
    sessionStorage.removeItem(oauthIntentStorageKey);
    return intent === 'register' ? 'register' : 'login';
  } catch {
    return 'login';
  }
};

export const signInWithOAuth = async (
  provider: OAuthProvider,
  intent: OAuthIntent
): Promise<void> => {
  if (!supabaseClient) {
    throw new Error('Supabase Auth is niet geconfigureerd.');
  }

  saveOAuthIntent(intent);
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}${window.location.pathname}`
    }
  });

  if (error) {
    throw new Error(error.message);
  }
};

export const signInWithPassword = async (
  email: string,
  password: string
): Promise<{ accessToken: string; userId: string; email: string }> => {
  if (!isSupabaseConfigured || !supabaseUrl) {
    throw new Error('Supabase Auth is niet geconfigureerd.');
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ email, password })
  });
  const data = (await response.json()) as SupabaseAuthResponse;

  if (!response.ok || !data.access_token || !data.user?.email) {
    throw new Error(getAuthError(data));
  }

  saveAccessToken(data.access_token);
  return { accessToken: data.access_token, userId: data.user.id, email: data.user.email };
};

export const signUpWithPassword = async (
  email: string,
  password: string,
  metadata?: { name: string; requestedShares: number }
): Promise<{ accessToken: string | null; userId: string }> => {
  if (!isSupabaseConfigured || !supabaseUrl) {
    throw new Error('Supabase Auth is niet geconfigureerd.');
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      email,
      password,
      data: metadata
        ? { name: metadata.name, role: 'investor', requestedShares: metadata.requestedShares }
        : undefined
    })
  });
  const data = (await response.json()) as SupabaseAuthResponse;

  if (!response.ok || !data.user?.id) {
    throw new Error(getAuthError(data));
  }

  if (data.access_token) {
    saveAccessToken(data.access_token);
  }

  return { accessToken: data.access_token || null, userId: data.user.id };
};

export const clearAuthSession = async (): Promise<void> => {
  const accessToken = getAccessToken();
  if (accessToken && supabaseUrl && supabaseKey) {
    await fetch(`${supabaseUrl}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        ...authHeaders,
        Authorization: `Bearer ${accessToken}`
      }
    }).catch(() => undefined);
  }

  try {
    sessionStorage.removeItem(sessionStorageKey);
  } catch {
    // Ignore storage cleanup failures during logout.
  }
};

export const getCurrentAuthIdentity = async (
  accessToken = getAccessToken()
): Promise<{ id: string; email: string; name?: string } | null> => {
  let resolvedAccessToken = accessToken;
  let oauthUser: SupabaseUser | undefined;

  if (!resolvedAccessToken && supabaseClient) {
    const { data } = await supabaseClient.auth.getSession();
    if (data.session?.access_token) {
      resolvedAccessToken = data.session.access_token;
      oauthUser = data.session.user;
      saveAccessToken(resolvedAccessToken);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  if (!isSupabaseConfigured || !supabaseUrl || !resolvedAccessToken) {
    return null;
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      ...authHeaders,
      Authorization: `Bearer ${resolvedAccessToken}`
    }
  });
  if (!response.ok) {
    await clearAuthSession();
    return null;
  }

  const data = (await response.json()) as SupabaseUser | SupabaseAuthResponse;
  const user = 'id' in data ? data : data.user || oauthUser;
  if (!user?.email) {
    return null;
  }

  const metadata = user.user_metadata;
  const metadataName =
    typeof metadata?.full_name === 'string'
      ? metadata.full_name
      : typeof metadata?.name === 'string'
        ? metadata.name
        : undefined;

  return {
    id: user.id,
    email: user.email,
    ...(metadataName ? { name: metadataName } : {})
  };
};

export const buildRegisteredInvestor = (
  userId: string,
  name: string,
  email: string,
  desiredShares: number
): AuthUser => ({
  id: `inv_${userId}`,
  name,
  email,
  role: 'investor',
  requestedShares: desiredShares,
  sharesOwned: 0,
  purchasePrice: 8.2,
  currentPrice: 8.2,
  certificateId: `QI INV ${Math.floor(1000 + Math.random() * 9000)} NL`,
  joinDate: new Date().toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }),
  title: 'Geregistreerd Participatiehouder'
});
