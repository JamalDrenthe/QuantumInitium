import { AuthUser, DEMO_INVESTOR, NotificationSettings } from '../types/auth';
import { getAccessToken, isDemoModeEnabled, isSupabaseConfigured } from './authStore';

interface AccountRow {
  id: string;
  name: string;
  email: string;
  role: 'investor' | 'shareholder' | 'admin';
  shares_owned: number;
  purchase_price: number;
  current_price: number;
  certificate_id: string;
  join_date: string;
  wallet_address: string | null;
  title: string | null;
  cash_balance: number | null;
  phone: string | null;
  address: string | null;
  postal_code: string | null;
  city: string | null;
  country: string | null;
  iban: string | null;
  tax_id: string | null;
  pin_code: string | null;
  authorized_persons: AuthUser['authorizedPersons'];
  notifications: NotificationSettings;
}

const demoAccountsStorageKey = 'qi_demo_accounts';

const fallbackAccounts: AuthUser[] = [
  DEMO_INVESTOR,
  {
    id: 'inv_vanderbilt',
    name: 'Vanderbilt Capital Partners',
    email: 'partners@vanderbiltcap.com',
    role: 'shareholder',
    sharesOwned: 120000,
    purchasePrice: 8.2,
    currentPrice: 8.2,
    certificateId: 'QI INV 1009 UK',
    joinDate: '02 december 2024',
    title: 'Institutionele aandeelhouder',
    country: 'Verenigd Koninkrijk'
  },
  {
    id: 'inv_hendrikus',
    name: 'Dr. Hendrikus van der Meer',
    email: 'h.vandermeer@neurotech.nl',
    role: 'investor',
    sharesOwned: 8000,
    purchasePrice: 8.2,
    currentPrice: 8.2,
    certificateId: 'QI INV 4421 NL',
    joinDate: '28 januari 2025',
    title: 'Serie A Investeerder',
    country: 'Nederland'
  },
  {
    id: 'inv_geneva',
    name: 'Geneva Wealth Trust SA',
    email: 'familyoffice@genevatrust.ch',
    role: 'shareholder',
    sharesOwned: 250000,
    purchasePrice: 8.2,
    currentPrice: 8.2,
    certificateId: 'QI INV 7731 CH',
    joinDate: '19 november 2024',
    title: 'Family Office aandeelhouder',
    country: 'Zwitserland'
  },
  {
    id: 'inv_sophie',
    name: 'Sophie de Boer MSc',
    email: 's.deboer@amsterdamfin.nl',
    role: 'investor',
    sharesOwned: 5000,
    purchasePrice: 8.2,
    currentPrice: 8.2,
    certificateId: 'QI INV 9904 NL',
    joinDate: '11 februari 2025',
    title: 'Particuliere Investeerder',
    country: 'Nederland'
  }
];

const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL as string | undefined,
  key:
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined)
};

const readDemoAccounts = (): AuthUser[] => {
  try {
    const stored = localStorage.getItem(demoAccountsStorageKey);
    return stored ? (JSON.parse(stored) as AuthUser[]) : fallbackAccounts;
  } catch {
    return fallbackAccounts;
  }
};

const writeDemoAccounts = (accounts: AuthUser[]): void => {
  localStorage.setItem(demoAccountsStorageKey, JSON.stringify(accounts));
};

const requestHeaders = (accessToken: string) => ({
  apikey: supabaseConfig.key || '',
  Authorization: `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
});

const mapRowToUser = (row: AccountRow): AuthUser => ({
  id: row.id,
  name: row.name,
  email: row.email,
  role: row.role,
  sharesOwned: Number(row.shares_owned),
  purchasePrice: Number(row.purchase_price),
  currentPrice: Number(row.current_price),
  certificateId: row.certificate_id,
  joinDate: row.join_date,
  walletAddress: row.wallet_address || undefined,
  title: row.title || undefined,
  cashBalance: row.cash_balance === null ? undefined : Number(row.cash_balance),
  phone: row.phone || undefined,
  address: row.address || undefined,
  postalCode: row.postal_code || undefined,
  city: row.city || undefined,
  country: row.country || undefined,
  iban: row.iban || undefined,
  taxId: row.tax_id || undefined,
  pinCode: row.pin_code || undefined,
  authorizedPersons: row.authorized_persons || [],
  notifications: row.notifications
});

const mapUserToRow = (user: AuthUser): Partial<AccountRow> => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role === 'admin' ? 'investor' : user.role,
  shares_owned: user.sharesOwned,
  purchase_price: user.purchasePrice,
  current_price: user.currentPrice,
  certificate_id: user.certificateId,
  join_date: user.joinDate,
  wallet_address: user.walletAddress || null,
  title: user.title || null,
  cash_balance: user.cashBalance ?? null,
  phone: user.phone || null,
  address: user.address || null,
  postal_code: user.postalCode || null,
  city: user.city || null,
  country: user.country || null,
  iban: user.iban || null,
  tax_id: user.taxId || null,
  pin_code: user.pinCode || null,
  authorized_persons: user.authorizedPersons || [],
  notifications: user.notifications
});

export const loadManagedAccounts = async (accessToken = getAccessToken()): Promise<AuthUser[]> => {
  if (!isSupabaseConfigured || (isDemoModeEnabled && !accessToken)) {
    return readDemoAccounts();
  }
  if (!accessToken) {
    return isDemoModeEnabled ? readDemoAccounts() : [];
  }

  try {
    const response = await fetch(
      `${supabaseConfig.url}/rest/v1/user_accounts?select=*&role=in.(investor,shareholder)&order=name.asc`,
      {
        headers: requestHeaders(accessToken)
      }
    );

    if (!response.ok) {
      return [];
    }

    const rows = (await response.json()) as AccountRow[];
    return rows.map(mapRowToUser);
  } catch {
    return [];
  }
};

export const loadAccountForSession = async (
  identity: { id: string; email: string },
  accessToken = getAccessToken()
): Promise<AuthUser> => {
  if (!supabaseConfig.url || !supabaseConfig.key || !accessToken) {
    throw new Error('Er is geen actieve Supabase-sessie.');
  }

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/user_accounts?select=*&auth_user_id=eq.${encodeURIComponent(identity.id)}&limit=1`,
    {
      headers: requestHeaders(accessToken)
    }
  );

  if (!response.ok) {
    throw new Error('Accountgegevens konden niet worden geladen.');
  }

  const rows = (await response.json()) as AccountRow[];
  if (!rows[0]) {
    throw new Error('Er is nog geen QuantumInitium-account aan dit e-mailadres gekoppeld.');
  }

  return mapRowToUser(rows[0]);
};

export const createManagedAccount = async (
  user: AuthUser,
  authUserId: string,
  accessToken = getAccessToken()
): Promise<void> => {
  if (!supabaseConfig.url || !supabaseConfig.key || !accessToken) {
    throw new Error('Er is geen actieve Supabase-sessie.');
  }

  const response = await fetch(`${supabaseConfig.url}/rest/v1/user_accounts`, {
    method: 'POST',
    headers: {
      ...requestHeaders(accessToken),
      Prefer: 'return=minimal'
    },
    body: JSON.stringify({
      ...mapUserToRow(user),
      auth_user_id: authUserId
    })
  });

  if (!response.ok) {
    throw new Error('Accountprofiel kon niet worden aangemaakt.');
  }
};

export const saveManagedAccount = async (
  user: AuthUser,
  accessToken = getAccessToken()
): Promise<void> => {
  if (!isSupabaseConfigured || (isDemoModeEnabled && !accessToken)) {
    const accounts = readDemoAccounts();
    const nextAccounts = accounts.some((account) => account.id === user.id)
      ? accounts.map((account) => (account.id === user.id ? user : account))
      : [...accounts, user];
    writeDemoAccounts(nextAccounts);
    return;
  }

  if (!supabaseConfig.url || !supabaseConfig.key || !accessToken) {
    throw new Error('Er is geen actieve Supabase-sessie.');
  }

  const response = await fetch(
    `${supabaseConfig.url}/rest/v1/user_accounts?id=eq.${encodeURIComponent(user.id)}`,
    {
      method: 'PATCH',
      headers: {
        ...requestHeaders(accessToken),
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(mapUserToRow(user))
    }
  );

  if (!response.ok) {
    throw new Error('Account opslaan mislukt.');
  }
};
