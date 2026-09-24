export type UserRole = 'investor' | 'admin';

export interface ShareTransaction {
  id: string;
  type: 'BUY' | 'SELL' | 'DIVIDEND' | 'ALLOCATION' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'DEPOSIT';
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  timestamp: string;
  status: 'COMPLETED' | 'SETTLED' | 'PENDING';
  reference: string;
  recipient?: string;
}

export interface AuthorizedPerson {
  id: string;
  name: string;
  relation: string;
  email: string;
  phone: string;
}

export interface OrderBookEntry {
  id: string;
  type: 'BUY' | 'SELL';
  shares: number;
  price: number;
  total: number;
  time: string;
  trader: string;
}

export interface NotificationSettings {
  emailTransactions: boolean;
  emailDividends: boolean;
  emailReports: boolean;
  priceAlerts: boolean;
  twoFactorEnabled: boolean;
  smsAlerts: boolean;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sharesOwned: number;
  purchasePrice: number;
  currentPrice: number;
  certificateId: string;
  joinDate: string;
  walletAddress?: string;
  title?: string;
  cashBalance?: number;
  phone?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  iban?: string;
  taxId?: string;
  pinCode?: string;
  authorizedPersons?: AuthorizedPerson[];
  notifications?: NotificationSettings;
}

export const SHARE_PRICE_CURRENT = 8.20;
export const SHARE_PRICE_IPO_TARGET = 14.50;
export const TOTAL_SHARES_ISSUED = 10000000;
export const ANNUAL_DIVIDEND_PERCENT = 7.4;

export const INITIAL_TRANSACTIONS: ShareTransaction[] = [
  {
    id: 'TXN 9042',
    type: 'BUY',
    shares: 10000,
    pricePerShare: 6.40,
    totalAmount: 64000,
    timestamp: '14 Jan 2025 • 10:14',
    status: 'SETTLED',
    reference: 'NOTARIËLE SERIE A TOWIJZING'
  },
  {
    id: 'TXN 9188',
    type: 'DIVIDEND',
    shares: 10000,
    pricePerShare: 0.15,
    totalAmount: 1520,
    timestamp: '28 Feb 2025 • 09:00',
    status: 'SETTLED',
    reference: 'Q1 PRE IPO INTERIM DIVIDEND'
  },
  {
    id: 'TXN 9450',
    type: 'BUY',
    shares: 2500,
    pricePerShare: 8.20,
    totalAmount: 20500,
    timestamp: '12 Mrt 2025 • 14:32',
    status: 'SETTLED',
    reference: 'INTERNAL DESK CONVERSIE'
  }
];

export const INITIAL_ORDER_BOOK: OrderBookEntry[] = [
  { id: 'OB 101', type: 'SELL', shares: 5000, price: 8.40, total: 42000, time: '14:22', trader: 'Instituut NL 04' },
  { id: 'OB 102', type: 'SELL', shares: 2500, price: 8.35, total: 20875, time: '14:18', trader: 'Tranche B Pool' },
  { id: 'OB 103', type: 'SELL', shares: 1200, price: 8.25, total: 9900, time: '14:05', trader: 'Privé Aandeelhouder' },
  { id: 'OB 104', type: 'BUY', shares: 3500, price: 8.20, total: 28700, time: '14:28', trader: 'Investbotiq Liquidity' },
  { id: 'OB 105', type: 'BUY', shares: 7000, price: 8.15, total: 57050, time: '14:12', trader: 'Family Office BE' },
  { id: 'OB 106', type: 'BUY', shares: 15000, price: 8.10, total: 121500, time: '13:50', trader: 'QI Treasury Buyback' }
];

export const DEMO_INVESTOR: AuthUser = {
  id: 'inv_alexander',
  name: 'Alexander van Heemstra',
  email: 'investor@quantuminitium.com',
  role: 'investor',
  sharesOwned: 12500,
  purchasePrice: 6.40,
  currentPrice: SHARE_PRICE_CURRENT,
  certificateId: 'QI INV 8842 NL',
  joinDate: '14 januari 2025',
  walletAddress: '0x71C84B29E30A149F',
  title: 'Particuliere Serie A Investeerder',
  cashBalance: 18450.00,
  phone: '+31 6 12345678',
  address: 'Keizersgracht 421',
  postalCode: '1016 EK',
  city: 'Amsterdam',
  country: 'Nederland',
  iban: 'NL91 ABNA 0412 8891 00',
  taxId: 'NL884291882B01',
  pinCode: '4821',
  authorizedPersons: [
    {
      id: 'AP 1',
      name: 'Eleonora van Heemstra',
      relation: 'Echtgenote / Mede rekeninghouder',
      email: 'e.vanheemstra@quantuminitium.com',
      phone: '+31 6 87654321'
    }
  ],
  notifications: {
    emailTransactions: true,
    emailDividends: true,
    emailReports: true,
    priceAlerts: true,
    twoFactorEnabled: true,
    smsAlerts: false
  }
};

export const DEMO_ADMIN: AuthUser = {
  id: 'admin_directie',
  name: 'Directie QuantumInitium',
  email: 'admin@quantuminitium.com',
  role: 'admin',
  sharesOwned: 450000,
  purchasePrice: 2.50,
  currentPrice: SHARE_PRICE_CURRENT,
  certificateId: 'QI ADM 0001 LSE',
  joinDate: '1 september 2024',
  walletAddress: '0x10A...99FF',
  title: 'Managing Director & Systeembeheer',
  cashBalance: 2450000.00
};
