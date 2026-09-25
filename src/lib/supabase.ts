import { createClient, type User } from '@supabase/supabase-js';
import type { AuthUser } from '../types/auth';
import { DEMO_INVESTOR, SHARE_PRICE_CURRENT } from '../types/auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function authUserFromSupabaseUser(user: User): AuthUser {
  const isDemoInvestor = user.email?.toLowerCase() === DEMO_INVESTOR.email;
  const requestedShares = typeof user.user_metadata.desiredShares === 'number'
    && Number.isFinite(user.user_metadata.desiredShares)
    ? user.user_metadata.desiredShares
    : undefined;
  const name = typeof user.user_metadata.name === 'string'
    ? user.user_metadata.name
    : isDemoInvestor ? DEMO_INVESTOR.name : 'Nieuwe investeerder';

  if (isDemoInvestor) {
    return {
      ...DEMO_INVESTOR,
      id: user.id,
      name,
      email: user.email ?? DEMO_INVESTOR.email
    };
  }

  return {
    ...DEMO_INVESTOR,
    id: user.id,
    name,
    email: user.email ?? '',
    role: 'investor',
    sharesOwned: 0,
    purchasePrice: SHARE_PRICE_CURRENT,
    requestedShares,
    certificateId: `QI PENDING ${user.id.slice(0, 8).toUpperCase()}`,
    joinDate: new Date(user.created_at).toLocaleDateString('nl-NL'),
    walletAddress: undefined,
    title: 'Nieuwe investeerder',
    cashBalance: 0,
    phone: undefined,
    address: undefined,
    postalCode: undefined,
    city: undefined,
    country: undefined,
    iban: undefined,
    taxId: undefined,
    pinCode: undefined,
    authorizedPersons: [],
    notifications: undefined
  };
}
