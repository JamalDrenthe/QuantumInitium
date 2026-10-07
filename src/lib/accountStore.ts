import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import {
  AuthUser,
  AuthorizedPerson,
  DEMO_ADMIN,
  DEMO_INVESTOR,
  NotificationSettings,
  UserRole
} from '../types/auth';
import { firebaseAuth, firestoreDb } from './firebase';
import { isDemoModeEnabled } from './authStore';

const DEMO_ACCOUNTS_STORAGE_KEY = 'qi_demo_accounts';
const ACCOUNT_COLLECTION = 'user_accounts';

const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  emailTransactions: true,
  emailDividends: true,
  emailReports: true,
  priceAlerts: true,
  twoFactorEnabled: false,
  smsAlerts: false
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function readDemoAccounts(): AuthUser[] {
  try {
    const stored = localStorage.getItem(DEMO_ACCOUNTS_STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isRecord) as unknown as AuthUser[] : [];
  } catch {
    return [];
  }
}

function writeDemoAccounts(accounts: AuthUser[]) {
  localStorage.setItem(DEMO_ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
}

function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}

function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function isUserRole(value: unknown): value is UserRole {
  return value === 'investor' || value === 'shareholder' || value === 'admin';
}

function isAuthorizedPerson(value: unknown): value is AuthorizedPerson {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string'
    && typeof value.name === 'string'
    && typeof value.relation === 'string'
    && typeof value.email === 'string'
    && typeof value.phone === 'string';
}

function isNotificationSettings(value: unknown): value is NotificationSettings {
  if (!isRecord(value)) return false;
  return typeof value.emailTransactions === 'boolean'
    && typeof value.emailDividends === 'boolean'
    && typeof value.emailReports === 'boolean'
    && typeof value.priceAlerts === 'boolean'
    && typeof value.twoFactorEnabled === 'boolean'
    && typeof value.smsAlerts === 'boolean';
}

function mapAccount(documentId: string, value: unknown): AuthUser | null {
  if (!isRecord(value)) return null;

  const email = asString(value.email);
  const name = asString(value.name);
  const role = isUserRole(value.role) ? value.role : null;
  if (!email || !name || !role) return null;

  const authorizedPersons = Array.isArray(value.authorizedPersons)
    ? value.authorizedPersons.filter(isAuthorizedPerson)
    : [];

  return {
    id: asString(value.id) ?? documentId,
    authUserId: documentId,
    name,
    email,
    role,
    requestedShares: asNumber(value.requestedShares),
    sharesOwned: asNumber(value.sharesOwned) ?? 0,
    purchasePrice: asNumber(value.purchasePrice) ?? 0,
    currentPrice: asNumber(value.currentPrice) ?? 0,
    certificateId: asString(value.certificateId) ?? '',
    joinDate: asString(value.joinDate) ?? '',
    walletAddress: asString(value.walletAddress),
    title: asString(value.title),
    cashBalance: asNumber(value.cashBalance),
    phone: asString(value.phone),
    address: asString(value.address),
    postalCode: asString(value.postalCode),
    city: asString(value.city),
    country: asString(value.country),
    iban: asString(value.iban),
    taxId: asString(value.taxId),
    authorizedPersons,
    notifications: isNotificationSettings(value.notifications)
      ? value.notifications
      : DEFAULT_NOTIFICATIONS
  };
}

function serializeAccount(user: AuthUser, authUserId: string) {
  const data: Record<string, unknown> = {
    id: user.id,
    authUserId,
    name: user.name,
    email: user.email,
    role: user.role,
    sharesOwned: user.sharesOwned,
    purchasePrice: user.purchasePrice,
    currentPrice: user.currentPrice,
    certificateId: user.certificateId,
    joinDate: user.joinDate,
    cashBalance: user.cashBalance ?? 0,
    authorizedPersons: user.authorizedPersons ?? [],
    notifications: user.notifications ?? DEFAULT_NOTIFICATIONS,
    updatedAt: serverTimestamp()
  };

  if (user.requestedShares !== undefined) data.requestedShares = user.requestedShares;

  const optionalFields: Array<keyof AuthUser> = [
    'walletAddress', 'title', 'phone', 'address', 'postalCode', 'city',
    'country', 'iban', 'taxId'
  ];
  for (const field of optionalFields) {
    const value = user[field];
    if (value !== undefined) data[field] = value;
  }

  return data;
}

function requireFirestore() {
  if (!firestoreDb || !firebaseAuth?.currentUser) {
    throw new Error('Een actieve Firebase-sessie is vereist.');
  }
  return { db: firestoreDb, user: firebaseAuth.currentUser };
}

export const loadManagedAccounts = async (): Promise<AuthUser[]> => {
  if (isDemoModeEnabled) {
    const storedAccounts = readDemoAccounts();
    const accounts = [DEMO_INVESTOR, DEMO_ADMIN, ...storedAccounts];
    return accounts.filter((account, index) =>
      accounts.findIndex((candidate) => candidate.id === account.id) === index
    );
  }

  const { db } = requireFirestore();
  const accountsQuery = query(
    collection(db, ACCOUNT_COLLECTION),
    orderBy('name')
  );
  const snapshot = await getDocs(accountsQuery);
  return snapshot.docs
    .map((document) => mapAccount(document.id, document.data()))
    .filter((account): account is AuthUser => account !== null);
};

export const loadAccountForSession = async (
  identity: { id: string; email: string }
): Promise<AuthUser> => {
  const { db, user } = requireFirestore();
  if (user.uid !== identity.id) {
    throw new Error('De Firebase-sessie is gewijzigd. Log opnieuw in.');
  }

  const accountSnapshot = await getDoc(doc(db, ACCOUNT_COLLECTION, identity.id));
  if (!accountSnapshot.exists()) {
    throw new Error('Er is geen accountprofiel gekoppeld aan deze Firebase-gebruiker.');
  }

  const account = mapAccount(accountSnapshot.id, accountSnapshot.data());
  if (!account || account.email.toLowerCase() !== identity.email.toLowerCase()) {
    throw new Error('De Firebase-gebruiker en het accountprofiel komen niet overeen.');
  }

  const token = await user.getIdTokenResult();
  return {
    ...account,
    role: token.claims.admin === true
      ? 'admin'
      : account.role === 'shareholder'
        ? 'shareholder'
        : 'investor'
  };
};

export const createManagedAccount = async (
  account: AuthUser,
  authUserId: string
): Promise<void> => {
  const { db, user } = requireFirestore();
  if (user.uid !== authUserId || account.email.toLowerCase() !== user.email?.toLowerCase()) {
    throw new Error('Het accountprofiel moet bij de aangemelde Firebase-gebruiker horen.');
  }

  await setDoc(doc(db, ACCOUNT_COLLECTION, authUserId), {
    ...serializeAccount(account, authUserId),
    createdAt: serverTimestamp()
  });
};

export const saveManagedAccount = async (account: AuthUser): Promise<void> => {
  if (isDemoModeEnabled) {
    const accounts = readDemoAccounts();
    const updatedAccounts = accounts.some((existing) => existing.id === account.id)
      ? accounts.map((existing) => existing.id === account.id ? account : existing)
      : [...accounts, account];
    writeDemoAccounts(updatedAccounts);
    return;
  }

  const { db, user } = requireFirestore();
  const authUserId = account.authUserId ?? user.uid;
  await updateDoc(
    doc(db, ACCOUNT_COLLECTION, authUserId),
    serializeAccount(account, authUserId)
  );
};
