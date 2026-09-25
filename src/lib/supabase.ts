import { createClient, type User } from '@supabase/supabase-js';
import type { AuthUser } from '../types/auth';
import { DEMO_INVESTOR } from '../types/auth';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export function authUserFromSupabaseUser(user: User): AuthUser {
  const name = typeof user.user_metadata.name === 'string'
    ? user.user_metadata.name
    : DEMO_INVESTOR.name;

  return {
    ...DEMO_INVESTOR,
    id: user.id,
    name,
    email: user.email ?? DEMO_INVESTOR.email,
    role: 'investor'
  };
}
