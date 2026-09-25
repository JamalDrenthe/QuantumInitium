import { AuthUser } from '../types/auth';

interface SupabaseAuthResponse {
  access_token?: string;
  user?: {
    id: string;
    email?: string;
  };
  error_description?: string;
  msg?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined);
const demoModeEnabled = import.meta.env.VITE_ENABLE_DEMO_MODE === 'true';
const sessionStorageKey = 'qi_supabase_access_token';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);
export const isDemoModeEnabled = demoModeEnabled || !isSupabaseConfigured;

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
): Promise<{ id: string; email: string } | null> => {
  if (!isSupabaseConfigured || !supabaseUrl || !accessToken) {
    return null;
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: {
      ...authHeaders,
      Authorization: `Bearer ${accessToken}`
    }
  });
  if (!response.ok) {
    await clearAuthSession();
    return null;
  }

  const data = (await response.json()) as SupabaseAuthResponse;
  return data.user?.email ? { id: data.user.id, email: data.user.email } : null;
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
