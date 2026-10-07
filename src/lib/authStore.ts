import {
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getRedirectResult,
  GoogleAuthProvider,
  OAuthProvider as FirebaseOAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithRedirect,
  signOut,
  updateProfile,
  type User
} from 'firebase/auth';
import { AuthUser, SHARE_PRICE_CURRENT } from '../types/auth';
import { firebaseAuth, isFirebaseConfigured } from './firebase';

export type OAuthProvider = 'google' | 'linkedin_oidc' | 'facebook';
export type OAuthIntent = 'login' | 'register';

const OAUTH_INTENT_STORAGE_KEY = 'qi_auth_oauth_intent';

export const isDemoModeEnabled =
  import.meta.env.VITE_ENABLE_DEMO_MODE === 'true' || !isFirebaseConfigured;

export { isFirebaseConfigured };

function requireFirebaseAuth() {
  if (!firebaseAuth) {
    throw new Error('Firebase Authentication is niet geconfigureerd.');
  }
  return firebaseAuth;
}

function toIdentity(user: User) {
  if (!user.email) {
    throw new Error('Het Firebase-account bevat geen e-mailadres.');
  }
  return {
    id: user.uid,
    email: user.email,
    name: user.displayName ?? undefined
  };
}

export const getCurrentAuthIdentity = async () => {
  const auth = requireFirebaseAuth();
  const redirectResult = await getRedirectResult(auth);
  const user = redirectResult?.user ?? auth.currentUser ?? await new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      unsubscribe();
      resolve(currentUser);
    }, () => {
      unsubscribe();
      resolve(null);
    });
  });

  if (!user) return null;

  if (redirectResult) {
    window.history.replaceState(null, document.title, window.location.pathname);
  }

  return toIdentity(user);
};

export const signInWithPassword = async (email: string, password: string) => {
  const auth = requireFirebaseAuth();
  await setPersistence(auth, browserSessionPersistence);
  const credential = await signInWithEmailAndPassword(auth, email, password);
  return toIdentity(credential.user);
};

export const signUpWithPassword = async (
  email: string,
  password: string,
  profile: { name: string }
) => {
  const auth = requireFirebaseAuth();
  await setPersistence(auth, browserSessionPersistence);
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(credential.user, { displayName: profile.name });
  return toIdentity(credential.user);
};

export const signInWithOAuth = async (provider: OAuthProvider, intent: OAuthIntent) => {
  const auth = requireFirebaseAuth();
  await setPersistence(auth, browserSessionPersistence);
  sessionStorage.setItem(OAUTH_INTENT_STORAGE_KEY, intent);

  const authProvider = provider === 'google'
    ? new GoogleAuthProvider()
    : provider === 'facebook'
      ? new FacebookAuthProvider()
      : new FirebaseOAuthProvider('oidc.linkedin');

  authProvider.setCustomParameters({ prompt: 'select_account' });
  await signInWithRedirect(auth, authProvider);
};

export const consumeOAuthIntent = (): OAuthIntent | null => {
  const intent = sessionStorage.getItem(OAUTH_INTENT_STORAGE_KEY);
  sessionStorage.removeItem(OAUTH_INTENT_STORAGE_KEY);
  return intent === 'login' || intent === 'register' ? intent : null;
};

export const clearAuthSession = async () => {
  if (!firebaseAuth) return;
  await signOut(firebaseAuth);
};

export const buildRegisteredInvestor = (
  userId: string,
  name: string,
  email: string,
  requestedShares = 0
): AuthUser => ({
  id: `inv_${userId}`,
  authUserId: userId,
  name,
  email,
  role: 'investor',
  requestedShares,
  sharesOwned: 0,
  purchasePrice: SHARE_PRICE_CURRENT,
  currentPrice: SHARE_PRICE_CURRENT,
  certificateId: `QI-${userId.slice(0, 8).toUpperCase()}`,
  joinDate: new Date().toISOString().slice(0, 10),
  cashBalance: 0,
  authorizedPersons: [],
  notifications: {
    emailTransactions: true,
    emailDividends: true,
    emailReports: true,
    priceAlerts: true,
    twoFactorEnabled: false,
    smsAlerts: false
  }
});
