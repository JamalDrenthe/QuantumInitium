import React, { useState, useRef, useEffect } from 'react';
import {
  TrendingUp,
  Award,
  Wallet,
  Calculator,
  Download,
  LogOut,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  PlusCircle,
  RefreshCw,
  Bell,
  Activity,
  History,
  FileCheck,
  DollarSign,
  Send,
  CreditCard,
  User,
  Settings,
  ChevronDown,
  Trash2,
  Edit3,
  Lock,
  Shield,
  Check,
  X,
  Menu,
  Smartphone,
  Mail,
  AlertCircle,
  Building,
  Globe,
  ArrowRight,
  Sliders,
  Network,
  Layers,
  Cpu,
  Zap,
  Key,
  Radio,
  Terminal,
  CheckSquare,
  Share2,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  AuthUser,
  SHARE_PRICE_CURRENT,
  SHARE_PRICE_IPO_TARGET,
  ANNUAL_DIVIDEND_PERCENT,
  TOTAL_SHARES_ISSUED,
  ShareTransaction,
  OrderBookEntry,
  AuthorizedPerson,
  NotificationSettings,
  INITIAL_TRANSACTIONS,
  INITIAL_ORDER_BOOK,
  DEMO_INVESTOR
} from '../types/auth';
import { QuantumWalletCards } from './QuantumParallaxCard';

interface InvestorDashboardProps {
  user: AuthUser;
  onLogout: () => void;
  onNavigateHome: (tab?: 'architecture' | '3d' | 'dossier' | 'calculator' | 'simulator') => void;
  onUpdateShares: (newTotal: number) => void;
  onUpdateUser?: (updated: AuthUser) => void;
  theme?: 'dark' | 'light';
}

type InternalView = 'overview' | 'wallet' | 'koers' | 'history' | 'calculator' | 'certificate' | 'account' | 'integrations' | 'settings';

export default function InvestorDashboard({
  user: initialUser,
  onLogout,
  onNavigateHome,
  onUpdateShares,
  onUpdateUser,
  theme = 'dark'
}: InvestorDashboardProps) {
  // Lokale kopie van de gebruiker voor directe CRUD updates
  const [currentUser, setCurrentUser] = useState<AuthUser>(initialUser || DEMO_INVESTOR);

  // Actieve interne app tab / pagina
  const [internalView, setInternalView] = useState<InternalView>('overview');
  const [isHamburgerOpen, setIsHamburgerOpen] = useState<boolean>(false);
  const hamburgerDrawerRef = useRef<HTMLDivElement>(null);

  // Modals
  const [showTransferModal, setShowTransferModal] = useState<boolean>(false);
  const [showNotificationModal, setShowNotificationModal] = useState<boolean>(false);
  const [showCertificateModal, setShowCertificateModal] = useState<boolean>(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState<boolean>(false);
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState<string | null>(null);

  // Financiële states
  const [transactions, setTransactions] = useState<ShareTransaction[]>(INITIAL_TRANSACTIONS);
  const [cashBalance, setCashBalance] = useState<number>(currentUser.cashBalance || 18450);

  // Wallet Storten / Opladen State
  const [depositAmount, setDepositAmount] = useState<number>(2500);
  const [depositMethod, setDepositMethod] = useState<'ideal' | 'sepa' | 'card' | 'crypto'>('ideal');
  const [selectedBank, setSelectedBank] = useState<string>('ING Bank');

  // Wallet Aandelen Bijkopen State
  const [walletBuyShares, setWalletBuyShares] = useState<number>(500);

  // Transfer Wizard State
  const [transferType, setTransferType] = useState<'shares' | 'cash'>('shares');
  const [transferRecipient, setTransferRecipient] = useState<string>('QI INV 9921 NL');
  const [transferAmount, setTransferAmount] = useState<number>(250);
  const [transferNote, setTransferNote] = useState<string>('Overdracht tranche Serie A');
  const [transferPin, setTransferPin] = useState<string>('4821');

  // Koers Tijdframe State
  const [koersTimeframe, setKoersTimeframe] = useState<'1U' | '1D' | '1W' | '1M' | '1J' | 'MAX'>('1D');

  // Calculator State
  const [calcShares, setCalcShares] = useState<number>(currentUser.sharesOwned || 12500);

  // Account CRUD State
  const [accountFormData, setAccountFormData] = useState({
    name: currentUser.name || '',
    email: currentUser.email || '',
    phone: currentUser.phone || '+31 6 12345678',
    address: currentUser.address || 'Keizersgracht 421',
    postalCode: currentUser.postalCode || '1016 EK',
    city: currentUser.city || 'Amsterdam',
    country: currentUser.country || 'Nederland',
    iban: currentUser.iban || 'NL91 ABNA 0412 8891 00',
    taxId: currentUser.taxId || 'NL884291882B01'
  });
  const [authorizedPersons, setAuthorizedPersons] = useState<AuthorizedPerson[]>(
    currentUser.authorizedPersons || [
      {
        id: 'AP 1',
        name: 'Eleonora van Heemstra',
        relation: 'Echtgenote / Mede rekeninghouder',
        email: 'e.vanheemstra@quantuminitium.com',
        phone: '+31 6 87654321'
      }
    ]
  );
  const [newPersonData, setNewPersonData] = useState({
    name: '',
    relation: 'Mede aandeelhouder',
    email: '',
    phone: ''
  });

  // Instellingen State (Notificaties & Beveiliging)
  const [settingsState, setSettingsState] = useState<NotificationSettings>(
    currentUser.notifications || {
      emailTransactions: true,
      emailDividends: true,
      emailReports: true,
      priceAlerts: true,
      twoFactorEnabled: true,
      smsAlerts: false
    }
  );

  // 12 ENTITEITEN INTEGRATIE STATE
  const [entityFilter, setEntityFilter] = useState<string>('all');
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);
  const [pingingEntityId, setPingingEntityId] = useState<string | null>(null);
  const [selectedEntityModal, setSelectedEntityModal] = useState<any | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [entitiesIntegrations, setEntitiesIntegrations] = useState([
    {
      id: 'ent_1',
      name: 'QuantumInitium Ltd',
      holdingKey: 'mother',
      holdingName: 'QuantumInitium Ltd (Moederholding Londen)',
      category: 'holding',
      type: 'Centrale Moederholding & IFRS Governance',
      obligationReason: 'Statutair verplichte aandeelhoudersregistratie, centrale IFRS Cap Table synchronisatie en notariële deponeringen in het Verenigd Koninkrijk.',
      protocol: 'REST API v3 (TLS 1.3)',
      endpoint: 'https://api.quantuminitium.uk/v3/captable/sync',
      status: 'connected',
      lastSync: '1 minuut geleden',
      latency: '11ms',
      apiKey: 'QI_LIVE_KEY_8842_UK_AUTH',
      dataStreams: ['Aandeelhoudersregister', 'Cap Table Audit', 'IFRS Jaarrekening Sync', 'Stemrecht Verificatie'],
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      autoSync: true
    },
    {
      id: 'ent_2',
      name: 'CRMos Ltd',
      holdingKey: 'sub1',
      holdingName: 'Subholding 1: IP & Tech',
      category: 'tech',
      type: 'Enterprise SaaS & Contract Engine',
      obligationReason: 'Verplichte koppeling voor enterprise licentie inkomsten, software royalty split en geautomatiseerde contractregistratie.',
      protocol: 'GraphQL & Webhooks',
      endpoint: 'https://api.crmos.io/graphql/investor',
      status: 'connected',
      lastSync: '4 minuten geleden',
      latency: '14ms',
      apiKey: 'CRMOS_SEC_9918_API_V2',
      dataStreams: ['SaaS Licentie Inkomsten', 'Contract Validatie', 'Enterprise Revenue Split'],
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      autoSync: true
    },
    {
      id: 'ent_3',
      name: 'Investbotiq Ltd',
      holdingKey: 'sub1',
      holdingName: 'Subholding 1: IP & Tech',
      category: 'tech',
      type: 'AI Executie Engine & IQ Bot',
      obligationReason: 'Autonome kapitaalallocatie en realtime orderstroom synchronisatie voor optimale tranche waarderingen.',
      protocol: 'WSS Secure Streaming',
      endpoint: 'wss://feed.investbotiq.ai/stream/orders',
      status: 'connected',
      lastSync: 'Realtime',
      latency: '4ms',
      apiKey: 'BOTIQ_WSS_7720_TOKEN',
      dataStreams: ['AI Order Matching', 'Autonome Dividend Feed', 'Tranche Prijsfluctuaties'],
      color: 'border-cyan-500/40 text-cyan-400 bg-cyan-500/10',
      autoSync: true
    },
    {
      id: 'ent_4',
      name: 'Xabi World Ltd',
      holdingKey: 'sub2',
      holdingName: 'Subholding 2: Fintech & SABI Liquidity',
      category: 'fintech',
      type: 'Clearing & SABI Escrow Rails',
      obligationReason: 'Cruciale clearing hub voor SABI rails, escrow split payments, BaaS EMI integraties en directe SEPA dividend transfers.',
      protocol: 'SABI Rails / ISO 20022',
      endpoint: 'https://clearing.sabi.xabiworld.com/v2/escrow',
      status: 'connected',
      lastSync: '2 minuten geleden',
      latency: '9ms',
      apiKey: 'XABI_SABI_CLEARING_8842',
      dataStreams: ['SABI Escrow Clearing', 'Directe SEPA Dividend Rails', 'Liquidity Pool Verificatie'],
      color: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
      autoSync: true
    },
    {
      id: 'ent_5',
      name: 'VVC Ltd',
      holdingKey: 'sub3',
      holdingName: 'Subholding 3: Talent & Gateway',
      category: 'talent',
      type: 'Gateway Hub & Community Portal',
      obligationReason: 'Verplichte aandeelhouders onboarding verificatie, governance community toegang en strategisch partnernetwerk.',
      protocol: 'OAuth 2.0 / REST',
      endpoint: 'https://gateway.vvc.holdings/api/v1/auth',
      status: 'connected',
      lastSync: '12 minuten geleden',
      latency: '18ms',
      apiKey: 'VVC_GATEWAY_AUTH_3310',
      dataStreams: ['Investeerder Identiteit', 'Partnernetwerk Toegang', 'Strategische Dealfeed'],
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      autoSync: true
    },
    {
      id: 'ent_6',
      name: 'DJOBBA Ltd',
      holdingKey: 'sub3',
      holdingName: 'Subholding 3: Talent & Gateway',
      category: 'talent',
      type: 'B2B IT Recruitment Marketplace',
      obligationReason: 'Directe feed van internationale IT plaatsingen en resourcing marges voor aandeelhouders dividend allocatie.',
      protocol: 'REST Event Webhook',
      endpoint: 'https://feed.djobba.com/v1/placements',
      status: 'connected',
      lastSync: '6 minuten geleden',
      latency: '15ms',
      apiKey: 'DJOBBA_RECRUIT_FEED_9941',
      dataStreams: ['Plaatsingen Feed', 'Detachering Cashflow', 'Marge Dividend Registratie'],
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      autoSync: true
    },
    {
      id: 'ent_7',
      name: 'Immigratiepunt Ltd',
      holdingKey: 'sub3',
      holdingName: 'Subholding 3: Talent & Gateway',
      category: 'talent',
      type: 'Expat Logistics & Compliance',
      obligationReason: 'Relocatie settlement auditing en kennismigranten compliance monitoring voor internationale expansie.',
      protocol: 'JSON RPC 2.0 (TLS)',
      endpoint: 'https://compliance.immigratiepunt.nl/rpc/v1',
      status: 'connected',
      lastSync: '15 minuten geleden',
      latency: '22ms',
      apiKey: 'IMMIG_EXP_AUDIT_4401',
      dataStreams: ['Relocatie Settlements', 'Expat Compliance Audits', 'Service Fee Cashflow'],
      color: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
      autoSync: true
    },
    {
      id: 'ent_8',
      name: 'Zheavenzy Ltd',
      holdingKey: 'sub3',
      holdingName: 'Subholding 3: Talent & Gateway',
      category: 'media',
      type: 'Muzieklabel & Creative Rights Hub',
      obligationReason: 'Smart contract gestuurde distributie van streaming royalties en intellectuele eigendoms monetarisering.',
      protocol: 'Smart Contract Event Bus',
      endpoint: 'https://royalty.zheavenzy.media/sync/investors',
      status: 'connected',
      lastSync: '8 minuten geleden',
      latency: '16ms',
      apiKey: 'ZHEAVEN_ROYALTY_BUS_1102',
      dataStreams: ['Streaming Royalties', 'Muziekrechten Yield', 'Catalogus Waardering'],
      color: 'border-pink-500/40 text-pink-400 bg-pink-500/10',
      autoSync: true
    },
    {
      id: 'ent_9',
      name: 'Boostplug Ltd',
      holdingKey: 'sub4',
      holdingName: 'Subholding 4: Compute & Media',
      category: 'compute',
      type: 'Hardware & GPU Mining Clusters',
      obligationReason: 'Realtime hashrate data feed en bandbreedte monetarisering yield verificatie van high performance compute clusters.',
      protocol: 'Stratum v2 / Telemetry API',
      endpoint: 'https://telemetry.boostplug.cloud/v1/yield',
      status: 'connected',
      lastSync: '3 minuten geleden',
      latency: '8ms',
      apiKey: 'BOOST_GPU_CLUSTER_9948',
      dataStreams: ['GPU Hashrate Yield', 'Bandbreedte Opbrengsten', 'Cluster Status Telemetrie'],
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      autoSync: true
    },
    {
      id: 'ent_10',
      name: 'Logs.rent',
      holdingKey: 'sub4',
      holdingName: 'Subholding 4: Compute & Media',
      category: 'compute',
      type: 'Compute Account Marketplace',
      obligationReason: 'Geautomatiseerde settlement van cloud compute verhuur contracten en broker marge reconciliatie.',
      protocol: 'REST API v2 / Webhook',
      endpoint: 'https://api.logs.rent/v2/settlements',
      status: 'connected',
      lastSync: '9 minuten geleden',
      latency: '12ms',
      apiKey: 'LOGS_RENT_BROKER_7731',
      dataStreams: ['Compute Verhuur Yield', 'Broker Marges', 'Cloud Settlement Feeds'],
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      autoSync: true
    },
    {
      id: 'ent_11',
      name: 'Spontiva Ltd',
      holdingKey: 'sub4',
      holdingName: 'Subholding 4: Compute & Media',
      category: 'compute',
      type: 'Working Capital Optimization (WCO)',
      obligationReason: 'Fintech werkkapitaal structurering, Time Gap cashflow optimalisatie en debiteuren escrow audits.',
      protocol: 'SABI Treasury Direct API',
      endpoint: 'https://treasury.spontiva.io/v1/wco/stream',
      status: 'connected',
      lastSync: '5 minuten geleden',
      latency: '10ms',
      apiKey: 'SPONTIVA_WCO_ESCROW_6619',
      dataStreams: ['WCO Cashflow Yield', 'Time Gap Escrow Data', 'Debiteuren Rendement'],
      color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
      autoSync: true
    },
    {
      id: 'ent_12',
      name: 'WoningVry Ltd & Afterstudenthousing',
      holdingKey: 'sub5',
      holdingName: 'Subholding 5: PropTech & Real Estate',
      category: 'proptech',
      type: 'PropTech Huisvesting & Expat Transit',
      obligationReason: 'Residentiële vastgoed exploitatie, LongStay huurinkomsten aggregatie en transit housing dividend stromen.',
      protocol: 'PropTech Open Data API',
      endpoint: 'https://portal.woningvry.nl/api/v1/yields',
      status: 'connected',
      lastSync: '7 minuten geleden',
      latency: '19ms',
      apiKey: 'WONING_PROP_YIELD_5504',
      dataStreams: ['Huurinkomsten Dividend', 'Vastgoed Exploitatie Marge', 'Bezettingsgraad Feeds'],
      color: 'border-indigo-500/40 text-indigo-400 bg-indigo-500/10',
      autoSync: true
    }
  ]);

  const [ecosystemLogs, setEcosystemLogs] = useState([
    {
      id: 'log_1',
      entity: 'QuantumInitium Ltd',
      action: 'IFRS Cap Table Certificering gesynchroniseerd',
      timestamp: '1 minuut geleden',
      status: 'success',
      badge: 'Moederholding'
    },
    {
      id: 'log_2',
      entity: 'Xabi World Ltd',
      action: 'SABI Escrow dividend clearing geverifieerd (€1.520,00)',
      timestamp: '2 minuten geleden',
      status: 'success',
      badge: 'Fintech Clearing'
    },
    {
      id: 'log_3',
      entity: 'Investbotiq Ltd',
      action: 'IQ Bot AI order matching data feed live heartbeat',
      timestamp: '3 minuten geleden',
      status: 'success',
      badge: 'AI Executie'
    },
    {
      id: 'log_4',
      entity: 'Boostplug Ltd',
      action: 'GPU cluster hashrate yield registratie verwerkt',
      timestamp: '5 minuten geleden',
      status: 'success',
      badge: 'Compute Mining'
    },
    {
      id: 'log_5',
      entity: 'CRMos Ltd',
      action: 'Enterprise SaaS contracten audit trail bijgewerkt',
      timestamp: '7 minuten geleden',
      status: 'success',
      badge: 'IP & Tech'
    }
  ]);

  // Handler: Synchroniseer alle 12 entiteiten
  const handleSyncAllEntities = () => {
    setIsSyncingAll(true);
    setTimeout(() => {
      setEntitiesIntegrations((prev) =>
        prev.map((ent) => ({
          ...ent,
          status: 'connected',
          lastSync: 'Zojuist geverifieerd',
          latency: `${Math.floor(Math.random() * 12) + 4}ms`
        }))
      );
      setEcosystemLogs((prev) => [
        {
          id: `log_${Date.now()}`,
          entity: 'QuantumInitium Ecosysteem',
          action: 'Batch synchronisatie van alle 12 entiteiten met succes afgerond',
          timestamp: 'Zojuist',
          status: 'success',
          badge: 'Cluster Sync'
        },
        ...prev
      ]);
      setIsSyncingAll(false);
      setPurchaseSuccessMsg('Alle 12 operationele entiteiten zijn met succes gesynchroniseerd met uw aandeelhoudersaccount.');
      setTimeout(() => setPurchaseSuccessMsg(null), 5000);
    }, 900);
  };

  // Handler: Ping specifieke entiteit
  const handlePingEntity = (entityId: string) => {
    setPingingEntityId(entityId);
    setTimeout(() => {
      const newLatency = `${Math.floor(Math.random() * 10) + 5}ms`;
      setEntitiesIntegrations((prev) =>
        prev.map((ent) =>
          ent.id === entityId
            ? { ...ent, status: 'connected', lastSync: 'Zojuist', latency: newLatency }
            : ent
        )
      );
      const targetEntity = entitiesIntegrations.find((e) => e.id === entityId);
      if (targetEntity) {
        setEcosystemLogs((prev) => [
          {
            id: `log_${Date.now()}`,
            entity: targetEntity.name,
            action: `Handshake test geslaagd (${newLatency}) via ${targetEntity.protocol}`,
            timestamp: 'Zojuist',
            status: 'success',
            badge: targetEntity.type
          },
          ...prev
        ]);
      }
      setPingingEntityId(null);
    }, 600);
  };

  // Handler: Toggle auto sync
  const handleToggleEntityAutoSync = (entityId: string) => {
    setEntitiesIntegrations((prev) =>
      prev.map((ent) =>
        ent.id === entityId ? { ...ent, autoSync: !ent.autoSync } : ent
      )
    );
  };

  // Handler: Kopieer API key
  const handleCopyKey = (keyString: string) => {
    navigator.clipboard.writeText(keyString);
    setCopiedKey(keyString);
    setTimeout(() => setCopiedKey(null), 3000);
  };

  // Sluit hamburger menu bij klik buiten paneel of bij Escape toets
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (hamburgerDrawerRef.current && !hamburgerDrawerRef.current.contains(event.target as Node)) {
        setIsHamburgerOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsHamburgerOpen(false);
      }
    }
    if (isHamburgerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHamburgerOpen]);

  // Live berekeningen
  const currentTotalValue = currentUser.sharesOwned * SHARE_PRICE_CURRENT;
  const initialCost = currentUser.sharesOwned * currentUser.purchasePrice;
  const unrealizedProfit = currentTotalValue - initialCost;
  const profitPercentage = initialCost > 0 ? (unrealizedProfit / initialCost) * 100 : 0;
  const targetIpoValue = currentUser.sharesOwned * SHARE_PRICE_IPO_TARGET;
  const annualDividend = (currentTotalValue * ANNUAL_DIVIDEND_PERCENT) / 100;
  const monthlyDividend = annualDividend / 12;
  const ownershipPercentage = ((currentUser.sharesOwned / TOTAL_SHARES_ISSUED) * 100);

  // Live berekeningen voor calculator
  const calcTotalCost = calcShares * SHARE_PRICE_CURRENT;
  const calcTargetIpoValue = calcShares * SHARE_PRICE_IPO_TARGET;
  const calcIpoProfit = calcTargetIpoValue - calcTotalCost;
  const calcIpoProfitPercent = calcTotalCost > 0 ? (calcIpoProfit / calcTotalCost) * 100 : 0;
  const calcAnnualDividend = (calcTotalCost * ANNUAL_DIVIDEND_PERCENT) / 100;

  // Handler: Saldo Opladen / Storten
  const handleDepositCash = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;

    const newCash = cashBalance + depositAmount;
    setCashBalance(newCash);

    const newTxn: ShareTransaction = {
      id: `DEP ${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'DEPOSIT',
      shares: 0,
      pricePerShare: 1,
      totalAmount: depositAmount,
      timestamp: 'Zojuist • ' + new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
      status: 'SETTLED',
      reference: `STORTING VIA ${depositMethod.toUpperCase()} (${selectedBank})`
    };

    setTransactions([newTxn, ...transactions]);
    setPurchaseSuccessMsg(`Succesvol €${depositAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} opgeladen op uw werkkapitaal.`);
    setTimeout(() => setPurchaseSuccessMsg(null), 4500);
  };

  // Handler: Aandelen Kopen vanuit Wallet Saldo
  const handleBuyFromWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const totalCost = walletBuyShares * SHARE_PRICE_CURRENT;

    if (cashBalance < totalCost) {
      setPurchaseSuccessMsg(`Onvoldoende werkkapitaal (€${cashBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}). Laad eerst extra saldo op via de Wallet.`);
      setTimeout(() => setPurchaseSuccessMsg(null), 4500);
      return;
    }

    const updatedShares = currentUser.sharesOwned + walletBuyShares;
    const updatedCash = cashBalance - totalCost;

    setCashBalance(updatedCash);
    setCurrentUser({ ...currentUser, sharesOwned: updatedShares });
    onUpdateShares(updatedShares);

    const newTxn: ShareTransaction = {
      id: `TXN ${Math.floor(1000 + Math.random() * 9000)}`,
      type: 'BUY',
      shares: walletBuyShares,
      pricePerShare: SHARE_PRICE_CURRENT,
      totalAmount: totalCost,
      timestamp: 'Zojuist • ' + new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
      status: 'SETTLED',
      reference: 'WALLET AANKOOP SERIE A'
    };

    setTransactions([newTxn, ...transactions]);
    setPurchaseSuccessMsg(`Gefeliciteerd: ${walletBuyShares.toLocaleString('nl-NL')} aandelen direct aangekocht tegen €${SHARE_PRICE_CURRENT.toFixed(2)}.`);
    setTimeout(() => setPurchaseSuccessMsg(null), 4500);
  };

  // Handler: Transfer Uitvoeren (Aandelen of Geld naar ander account)
  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();

    if (transferType === 'shares') {
      if (transferAmount > currentUser.sharesOwned) {
        setPurchaseSuccessMsg(`U bezit slechts ${currentUser.sharesOwned.toLocaleString('nl-NL')} aandelen. Transfer kan niet worden voltooid.`);
        setTimeout(() => setPurchaseSuccessMsg(null), 4000);
        return;
      }

      const updatedShares = currentUser.sharesOwned - transferAmount;
      setCurrentUser({ ...currentUser, sharesOwned: updatedShares });
      onUpdateShares(updatedShares);

      const newTxn: ShareTransaction = {
        id: `TRF ${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'TRANSFER_OUT',
        shares: transferAmount,
        pricePerShare: SHARE_PRICE_CURRENT,
        totalAmount: transferAmount * SHARE_PRICE_CURRENT,
        timestamp: 'Zojuist • ' + new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
        status: 'SETTLED',
        reference: `OVERDRACHT NAAR ${transferRecipient}`,
        recipient: transferRecipient
      };

      setTransactions([newTxn, ...transactions]);
      setPurchaseSuccessMsg(`Succesvol ${transferAmount.toLocaleString('nl-NL')} aandelen overgedragen naar ${transferRecipient}.`);
    } else {
      if (transferAmount > cashBalance) {
        setPurchaseSuccessMsg(`Onvoldoende liquide saldo (€${cashBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}).`);
        setTimeout(() => setPurchaseSuccessMsg(null), 4000);
        return;
      }

      const updatedCash = cashBalance - transferAmount;
      setCashBalance(updatedCash);

      const newTxn: ShareTransaction = {
        id: `TRF ${Math.floor(1000 + Math.random() * 9000)}`,
        type: 'TRANSFER_OUT',
        shares: 0,
        pricePerShare: 1,
        totalAmount: transferAmount,
        timestamp: 'Zojuist • ' + new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' }),
        status: 'SETTLED',
        reference: `KAPITAAL OVERBOEKING NAAR ${transferRecipient}`,
        recipient: transferRecipient
      };

      setTransactions([newTxn, ...transactions]);
      setPurchaseSuccessMsg(`Succesvol €${transferAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })} overgeboekt naar ${transferRecipient}.`);
    }

    setShowTransferModal(false);
    setTimeout(() => setPurchaseSuccessMsg(null), 4500);
  };

  // Handler: Account Gegevens Opslaan (Update)
  const handleSaveAccountData = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedUser: AuthUser = {
      ...currentUser,
      ...accountFormData,
      authorizedPersons
    };
    setCurrentUser(updatedUser);
    if (onUpdateUser) {
      onUpdateUser(updatedUser);
    }
    setPurchaseSuccessMsg('Uw accountgegevens zijn succesvol bijgewerkt en opgeslagen.');
    setTimeout(() => setPurchaseSuccessMsg(null), 4000);
  };

  // Handler: Gemachtigde Toevoegen (Create)
  const handleAddAuthorizedPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonData.name) return;

    const newPerson: AuthorizedPerson = {
      id: `AP ${authorizedPersons.length + 1}`,
      name: newPersonData.name,
      relation: newPersonData.relation,
      email: newPersonData.email,
      phone: newPersonData.phone
    };

    setAuthorizedPersons([...authorizedPersons, newPerson]);
    setNewPersonData({ name: '', relation: 'Mede aandeelhouder', email: '', phone: '' });
    setShowAddPersonModal(false);
    setPurchaseSuccessMsg('Nieuwe gemachtigde succesvol toegevoegd aan uw account.');
    setTimeout(() => setPurchaseSuccessMsg(null), 4000);
  };

  // Handler: Gemachtigde Verwijderen (Delete)
  const handleDeleteAuthorizedPerson = (id: string) => {
    setAuthorizedPersons(authorizedPersons.filter(p => p.id !== id));
    setPurchaseSuccessMsg('Gemachtigde succesvol verwijderd uit uw account.');
    setTimeout(() => setPurchaseSuccessMsg(null), 4000);
  };

  // Handler: Instellingen Opslaan
  const handleToggleSetting = (key: keyof NotificationSettings) => {
    const updated = {
      ...settingsState,
      [key]: !settingsState[key]
    };
    setSettingsState(updated);
    setPurchaseSuccessMsg('Voorkeur direct bijgewerkt.');
    setTimeout(() => setPurchaseSuccessMsg(null), 3000);
  };

  // Lijst van menu items voor het dropdown menu
  const menuItems = [
    {
      id: 'overview' as InternalView,
      title: 'Portefeuille & Overzicht',
      subtitle: 'Actueel aandelenbezit, koers en kerncijfers',
      icon: Activity,
      color: 'text-amber-400'
    },
    {
      id: 'wallet' as InternalView,
      title: 'Wallet',
      subtitle: 'Saldo beheer, geld opladen en aandelen versturen',
      icon: Wallet,
      color: 'text-emerald-400'
    },
    {
      id: 'koers' as InternalView,
      title: 'Koers',
      subtitle: 'Grafiek per uur, dag, week, maand en jaar',
      icon: TrendingUp,
      color: 'text-cyan-400'
    },
    {
      id: 'history' as InternalView,
      title: 'Transactiegeschiedenis',
      subtitle: 'Audit trail van mutaties en dividend',
      icon: History,
      color: 'text-blue-400'
    },
    {
      id: 'calculator' as InternalView,
      title: 'Rendement & Dividend Calculator',
      subtitle: 'Projecties en herberekeningen',
      icon: Calculator,
      color: 'text-yellow-400'
    },
    {
      id: 'certificate' as InternalView,
      title: 'Digitaal Aandelenbewijs',
      subtitle: 'Officieel aandeelhouderscertificaat',
      icon: FileCheck,
      color: 'text-purple-400'
    },
    {
      id: 'integrations' as InternalView,
      title: '12 Entiteiten Integratie',
      subtitle: 'Verplichte API en escrow koppelingen met alle 12 entiteiten',
      icon: Network,
      color: 'text-teal-400'
    },
    {
      id: 'account' as InternalView,
      title: 'Account',
      subtitle: 'Persoonsgegevens, IBAN en gemachtigden',
      icon: User,
      color: 'text-indigo-400'
    },
    {
      id: 'settings' as InternalView,
      title: 'Instellingen',
      subtitle: 'E-mails, notificaties en 2FA beveiliging',
      icon: Settings,
      color: 'text-slate-300'
    }
  ];

  const currentMenuItem = menuItems.find(m => m.id === internalView) || menuItems[0];
  const CurrentIcon = currentMenuItem.icon;

  // Koers grafiek data generator op basis van timeframe
  const getKoersData = () => {
    switch (koersTimeframe) {
      case '1U':
        return {
          title: 'Afgelopen Uur (1U)',
          change: '+0,12%',
          isPositive: true,
          low: '€8,18',
          high: '€8,22',
          volume: '4.850 aandelen',
          points: [
            { label: '14:00', price: 8.18 },
            { label: '14:10', price: 8.19 },
            { label: '14:20', price: 8.19 },
            { label: '14:30', price: 8.21 },
            { label: '14:40', price: 8.20 },
            { label: '14:50', price: 8.22 },
            { label: '15:00', price: 8.20 }
          ]
        };
      case '1D':
        return {
          title: 'Vandaag (1D)',
          change: '+2,50%',
          isPositive: true,
          low: '€8,00',
          high: '€8,35',
          volume: '142.500 aandelen',
          points: [
            { label: '09:00', price: 8.00 },
            { label: '11:00', price: 8.10 },
            { label: '13:00', price: 8.15 },
            { label: '15:00', price: 8.30 },
            { label: '17:00', price: 8.25 },
            { label: '19:00', price: 8.20 }
          ]
        };
      case '1W':
        return {
          title: 'Deze Week (1W)',
          change: '+5,13%',
          isPositive: true,
          low: '€7,80',
          high: '€8,25',
          volume: '580.000 aandelen',
          points: [
            { label: 'Ma', price: 7.80 },
            { label: 'Di', price: 7.90 },
            { label: 'Wo', price: 8.05 },
            { label: 'Do', price: 8.10 },
            { label: 'Vr', price: 8.25 },
            { label: 'Za', price: 8.20 }
          ]
        };
      case '1M':
        return {
          title: 'Deze Maand (1M)',
          change: '+13,89%',
          isPositive: true,
          low: '€7,20',
          high: '€8,25',
          volume: '1.950.000 aandelen',
          points: [
            { label: 'Week 1', price: 7.20 },
            { label: 'Week 2', price: 7.50 },
            { label: 'Week 3', price: 7.90 },
            { label: 'Week 4', price: 8.20 }
          ]
        };
      case '1J':
        return {
          title: 'Dit Jaar (1J)',
          change: '+228,00%',
          isPositive: true,
          low: '€2,50',
          high: '€8,20',
          volume: '6.200.000 aandelen',
          points: [
            { label: 'Q1 2024', price: 2.50 },
            { label: 'Q2 2024', price: 3.80 },
            { label: 'Q3 2024', price: 4.90 },
            { label: 'Q4 2024', price: 6.40 },
            { label: 'Q1 2025', price: 8.20 }
          ]
        };
      case 'MAX':
      default:
        return {
          title: 'Volledig Traject (Oprichting tot IPO)',
          change: '+480,00%',
          isPositive: true,
          low: '€2,50',
          high: '€14,50',
          volume: '10.000.000 aandelen',
          points: [
            { label: 'Pre Seed', price: 2.50 },
            { label: 'Seed', price: 4.20 },
            { label: 'Serie A (Heden)', price: 8.20 },
            { label: 'Tranche B (2026)', price: 12.50 },
            { label: 'LSE IPO (2027)', price: 14.50 }
          ]
        };
    }
  };

  const koersData = getKoersData();

  return (
    <div className={`w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-16 transition-colors duration-200 ${
      theme === 'light' ? 'bg-[#fafdff] text-[#133b5c]' : 'bg-[#05070d] text-slate-100'
    }`}>
      {/* BOVENSTE HOOFDBALK MET GEBRUIKERSSTATUS EN HAMBURGER MENU KNOP */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 shadow-xl relative z-30 transition-all ${
        theme === 'light'
          ? 'bg-white/95 border-sky-200 text-sky-950 shadow-sky-500/5 backdrop-blur-md'
          : 'glass-panel border-slate-800 text-white'
      }`}>
        {/* Linkerzijde: Gebruikersbadge, Certificaat en Actieve Pagina */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-extrabold text-sm ${
              theme === 'light' ? 'bg-white text-amber-700' : 'bg-slate-950 text-amber-400'
            }`}>
              QI
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-base font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>{currentUser.name}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border flex items-center gap-1 ${
                theme === 'light'
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}>
                <CurrentIcon className={`w-3 h-3 ${theme === 'light' ? 'text-amber-800' : currentMenuItem.color}`} />
                <span>{currentMenuItem.title}</span>
              </span>
            </div>
            <p className={`text-xs font-mono ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}`}>
              Certificaat: <strong className={theme === 'light' ? 'text-sky-950' : 'text-slate-200'}>{currentUser.certificateId}</strong> • Portefeuille: <strong className={theme === 'light' ? 'text-amber-800 font-bold' : 'text-amber-300'}>{ownershipPercentage.toFixed(4)}%</strong>
            </p>
          </div>
        </div>

        {/* Rechterzijde: HAMBURGER MENU KNOP + SNELLE SYSTEEMACTIES */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Uitloggen */}
          <button
            type="button"
            onClick={onLogout}
            className={`hidden sm:flex px-3 py-2.5 rounded-xl border text-xs font-semibold items-center gap-1.5 transition-colors cursor-pointer ${
              theme === 'light'
                ? 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-800'
                : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300'
            }`}
            title="Uitloggen uit Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Uitloggen</span>
          </button>

          {/* HET HAMBURGER MENU KNOP */}
          <button
            type="button"
            onClick={() => setIsHamburgerOpen(true)}
            className={`px-4 py-2.5 rounded-xl text-slate-950 font-black text-xs flex items-center gap-2 transition-all cursor-pointer relative shadow-lg ${
              theme === 'light'
                ? 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-amber-500/20'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/25'
            }`}
            aria-label="Open Hamburger Menu"
          >
            <Menu className="w-4 h-4 text-slate-950 stroke-[2.5]" />
            <span>Menu</span>
            <span className={`w-2 h-2 rounded-full bg-emerald-500 animate-pulse absolute -top-1 -right-1 ring-2 ${
              theme === 'light' ? 'ring-white' : 'ring-slate-950'
            }`} />
          </button>
        </div>
      </div>

      {/* HET VOLLEDIGE HAMBURGER MENU DRAWER OVERLAY */}
      {isHamburgerOpen && (
        <div className={`fixed inset-0 z-50 flex justify-end backdrop-blur-sm animate-in fade-in duration-200 ${
          theme === 'light' ? 'bg-sky-950/20' : 'bg-slate-950/80'
        }`}>
          <div
            ref={hamburgerDrawerRef}
            className={`w-full max-w-md h-full overflow-y-auto flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-300 ${
              theme === 'light'
                ? 'bg-white border-l border-sky-200 text-sky-950'
                : 'bg-[#070a12] border-l border-slate-800 text-slate-100'
            }`}
          >
            {/* Drawer Header */}
            <div>
              <div className={`p-5 border-b flex items-center justify-between ${
                theme === 'light'
                  ? 'bg-sky-50/90 border-sky-200'
                  : 'bg-slate-900/60 border-slate-800/80'
              }`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-600 p-0.5 flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
                    <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-extrabold text-xs ${
                      theme === 'light' ? 'bg-white text-amber-700' : 'bg-slate-950 text-amber-400'
                    }`}>
                      QI
                    </div>
                  </div>
                  <div>
                    <h3 className={`text-sm font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                      Investeerders Portaal
                    </h3>
                    <p className={`text-[11px] font-mono ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
                      {currentUser.name} • {currentUser.certificateId}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHamburgerOpen(false)}
                  className={`p-2 rounded-xl transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'bg-sky-100 hover:bg-sky-200 text-sky-800 hover:text-sky-950'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white'
                  }`}
                  title="Sluit Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Inhoud van Hamburger Menu */}
              <div className="p-5 space-y-6">
                {/* SECTIE 1: SNELLE ACTIES (TRANSFER, CERTIFICAAT, PDF, NOTIFICATIES) */}
                <div className="space-y-2">
                  <div className={`text-[10px] font-mono uppercase tracking-wider font-bold px-1 ${
                    theme === 'light' ? 'text-amber-800' : 'text-amber-400'
                  }`}>
                    Snelle Acties & Documenten
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    {/* Transfer Knop */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsHamburgerOpen(false);
                        setShowTransferModal(true);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all group cursor-pointer ${
                        theme === 'light'
                          ? 'bg-emerald-50/80 hover:bg-emerald-100/80 border-emerald-200 text-emerald-950 shadow-sm'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-lg w-fit mb-2 group-hover:scale-110 transition-transform ${
                        theme === 'light' ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        <Send className="w-4 h-4" />
                      </div>
                      <div className={`text-xs font-bold ${theme === 'light' ? 'text-emerald-950' : 'text-white'}`}>Transfer</div>
                      <p className={`text-[10px] truncate ${theme === 'light' ? 'text-emerald-800 font-medium' : 'text-emerald-300'}`}>Aandelen & Geld</p>
                    </button>

                    {/* Digitaal Aandelenbewijs Knop */}
                    <button
                      type="button"
                      onClick={() => {
                        setInternalView('certificate');
                        setIsHamburgerOpen(false);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all group cursor-pointer ${
                        theme === 'light'
                          ? 'bg-purple-50/80 hover:bg-purple-100/80 border-purple-200 text-purple-950 shadow-sm'
                          : 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30 text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-lg w-fit mb-2 group-hover:scale-110 transition-transform ${
                        theme === 'light' ? 'bg-purple-100 text-purple-800' : 'bg-purple-500/20 text-purple-400'
                      }`}>
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div className={`text-xs font-bold ${theme === 'light' ? 'text-purple-950' : 'text-white'}`}>Certificaat</div>
                      <p className={`text-[10px] truncate ${theme === 'light' ? 'text-purple-800 font-medium' : 'text-purple-300'}`}>Aandelenbewijs</p>
                    </button>

                    {/* Download PDF Knop */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsHamburgerOpen(false);
                        setShowCertificateModal(true);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all group cursor-pointer ${
                        theme === 'light'
                          ? 'bg-cyan-50/80 hover:bg-cyan-100/80 border-cyan-200 text-cyan-950 shadow-sm'
                          : 'bg-cyan-500/10 hover:bg-cyan-500/20 border-cyan-500/30 text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-lg w-fit mb-2 group-hover:scale-110 transition-transform ${
                        theme === 'light' ? 'bg-cyan-100 text-cyan-800' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        <Download className="w-4 h-4" />
                      </div>
                      <div className={`text-xs font-bold ${theme === 'light' ? 'text-cyan-950' : 'text-white'}`}>PDF Akte</div>
                      <p className={`text-[10px] truncate ${theme === 'light' ? 'text-cyan-800 font-medium' : 'text-cyan-300'}`}>Downloaden</p>
                    </button>

                    {/* Notificaties Knop */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsHamburgerOpen(false);
                        setShowNotificationModal(true);
                      }}
                      className={`p-3 rounded-xl border text-left transition-all group cursor-pointer relative ${
                        theme === 'light'
                          ? 'bg-amber-50/80 hover:bg-amber-100/80 border-amber-200 text-amber-950 shadow-sm'
                          : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-white'
                      }`}
                    >
                      <div className={`p-2 rounded-lg w-fit mb-2 group-hover:scale-110 transition-transform ${
                        theme === 'light' ? 'bg-amber-100 text-amber-800' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        <Bell className="w-4 h-4" />
                      </div>
                      <div className={`text-xs font-bold flex items-center justify-between ${
                        theme === 'light' ? 'text-amber-950' : 'text-white'
                      }`}>
                        <span>Notificaties</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      <p className={`text-[10px] truncate ${theme === 'light' ? 'text-amber-800 font-medium' : 'text-amber-300'}`}>Meldingen & Alerts</p>
                    </button>
                  </div>
                </div>

                {/* SECTIE 2: ALLE PAGINA'S & PORTEFEUILLE NAVIGATIE */}
                <div className="space-y-2">
                  <div className={`text-[10px] font-mono uppercase tracking-wider font-bold px-1 ${
                    theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'
                  }`}>
                    Portefeuille Pagina's & Modules
                  </div>

                  <div className="space-y-1">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      const isSelected = internalView === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setInternalView(item.id);
                            setIsHamburgerOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition-all cursor-pointer ${
                            isSelected
                              ? theme === 'light'
                                ? 'bg-gradient-to-r from-amber-50 to-amber-100/70 border border-amber-300 text-amber-950 shadow-sm'
                                : 'bg-amber-500/15 border border-amber-500/30 text-white shadow-md shadow-amber-500/10'
                              : theme === 'light'
                              ? 'hover:bg-sky-50/80 border border-transparent text-sky-950'
                              : 'hover:bg-slate-900 border border-transparent text-slate-300 hover:text-white'
                          }`}
                        >
                          <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                            isSelected
                              ? theme === 'light'
                                ? 'bg-amber-200/70 text-amber-900'
                                : 'bg-amber-500/20'
                              : theme === 'light'
                              ? 'bg-sky-100/70 text-sky-800'
                              : 'bg-slate-900'
                          }`}>
                            <Icon className={`w-4 h-4 ${theme === 'light' && isSelected ? 'text-amber-800' : item.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold flex items-center justify-between">
                              <span className={theme === 'light' ? 'text-sky-950' : 'text-white'}>{item.title}</span>
                              {isSelected && <Check className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`} />}
                            </div>
                            <p className={`text-[11px] truncate mt-0.5 ${
                              theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'
                            }`}>
                              {item.subtitle}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer: Systeemacties & Uitloggen */}
            <div className={`p-5 border-t space-y-2 ${
              theme === 'light' ? 'bg-sky-50/70 border-sky-200' : 'bg-slate-950/80 border-slate-800/80'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setIsHamburgerOpen(false);
                  onLogout();
                }}
                className={`w-full py-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-rose-50 hover:bg-rose-100/90 border-rose-300 text-rose-950 shadow-sm'
                    : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span>Veilig Uitloggen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK BERICHT BIJ ACTIES */}
      {purchaseSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{purchaseSuccessMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setPurchaseSuccessMsg(null)}
            className="text-xs text-emerald-400 hover:text-white underline cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      )}

      {/* TICKER MET LIVE MARKTSTATUS VAN HET INTERNE AANDEEL */}
      <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>INTERNE BEURS: OPEN</span>
          </div>
          <div className="text-slate-400">
            Ticker: <strong className="text-white">QI.NL</strong>
          </div>
          <div className="text-slate-400">
            Laatste Koers: <strong className="text-cyan-300 font-bold">€{SHARE_PRICE_CURRENT.toFixed(2)}</strong>
          </div>
          <div className="text-slate-400">
            24u Verandering: <strong className="text-emerald-400 font-bold">+2,5%</strong>
          </div>
          <div className="text-slate-400">
            Dagvolume: <strong className="text-amber-300">142.500 aandelen</strong>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span>Beschikbaar Werkkapitaal:</span>
          <span className="text-emerald-300 font-bold font-mono">
            €{cashBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. TAB: PORTEFEUILLE & OVERZICHT                                          */}
      {/* ========================================================================= */}
      {internalView === 'overview' && (
        <div className="space-y-6">
          {/* HOOFD STATISTIEKEN GRID: AANDELEN, KOERS, WAARDE ETC. */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Kaart 1: Aantal aandelen in bezit */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Aantal Aandelen in Bezit</span>
                <Award className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                {currentUser.sharesOwned.toLocaleString('nl-NL')}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span className="text-amber-400 font-semibold font-mono">Serie A Tranche</span>
                <span className="text-slate-500 font-mono">{ownershipPercentage.toFixed(4)}% van totaal</span>
              </div>
            </div>

            {/* Kaart 2: De actuele koers van het aandeel */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Koers van het Aandeel</span>
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
                €{SHARE_PRICE_CURRENT.toFixed(2)}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="text-emerald-400 font-semibold font-mono">+28,1%</span>
                <span>sinds nominale uitgifte</span>
              </div>
            </div>

            {/* Kaart 3: Totale actuele waarde van uw aandeel */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Totale Portefeuillewaarde</span>
                <Wallet className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-mono">
                €{currentTotalValue.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="text-emerald-400 font-semibold font-mono">
                  +€{unrealizedProfit.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </span>
                <span>ongerealiseerde winst</span>
              </div>
            </div>

            {/* Kaart 4: Beoogde IPO Waarde medio 2027 */}
            <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span>Beoogde IPO Waarde (2027)</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono">
                €{targetIpoValue.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span className="text-purple-400 font-semibold font-mono">€{SHARE_PRICE_IPO_TARGET.toFixed(2)} per aandeel</span>
                <span>bij LSE beursgang</span>
              </div>
            </div>
          </div>

          {/* EXTRA STATISTIEKEN BALK */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-mono uppercase block">Jaarlijks Dividend (7,4%)</span>
                <span className="text-xl font-bold font-mono text-cyan-300">
                  €{annualDividend.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / jr
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono block">Maandelijks</span>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  €{monthlyDividend.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-mono uppercase block">Gemiddelde Aankoopprijs</span>
                <span className="text-xl font-bold font-mono text-amber-300">
                  €{currentUser.purchasePrice.toFixed(2)} / aandeel
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-500 font-mono block">Rendement tot heden</span>
                <span className="text-xs font-mono text-emerald-400 font-bold">
                  +{profitPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-mono uppercase block">Beschikbare Liquiditeit</span>
                <span className="text-xl font-bold font-mono text-emerald-300">
                  €{cashBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setInternalView('wallet')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors cursor-pointer"
              >
                Naar Wallet
              </button>
            </div>
          </div>

          {/* SNELKOPPELINGEN NAAR BELANGRIJKE MODULES */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setInternalView('wallet')}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Wallet & Saldo Opladen</h4>
              <p className="text-xs text-slate-400">Bekijk uw aandelen saldo, stort werkkapitaal of verstuur aandelen.</p>
            </button>

            <button
              type="button"
              onClick={() => setInternalView('koers')}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-cyan-500/50 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Koersgrafiek Analyse</h4>
              <p className="text-xs text-slate-400">Bekijk de historische koers en tranches per uur, dag, week en jaar.</p>
            </button>

            <button
              type="button"
              onClick={() => setShowTransferModal(true)}
              className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-amber-500/50 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">Directe Aandelen Transfer</h4>
              <p className="text-xs text-slate-400">Draag direct aandelen of werkkapitaal over aan een ander account.</p>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. TAB: WALLET (SALDO, OPLADEN, AANDELEN VERSTUREN & BIJKOPEN)             */}
      {/* ========================================================================= */}
      {internalView === 'wallet' && (
        <div className="space-y-6">
          {/* WALLET SALDO OVERZICHT */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 to-slate-950 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400">
                <span>Aandelen Saldo</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-extrabold text-white font-mono">
                {currentUser.sharesOwned.toLocaleString('nl-NL')} <span className="text-sm font-normal text-slate-400">aandelen</span>
              </div>
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Totale Waarde:</span>
                <span className="text-emerald-300 font-bold">€{currentTotalValue.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 to-slate-950 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                <span>Beschikbaar Werkkapitaal</span>
                <Wallet className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-3xl font-extrabold text-amber-300 font-mono">
                €{cashBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Status:</span>
                <span className="text-emerald-400 font-bold">Direct Beschikbaar</span>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-cyan-950/20 to-slate-950 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>Geverifieerd Wallet Adres</span>
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-sm font-extrabold text-cyan-200 font-mono break-all py-1.5">
                {currentUser.walletAddress || '0x71C84B29E30A149F'}
              </div>
              <div className="text-xs font-mono text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                <span>Netwerk:</span>
                <span className="text-cyan-300">Quantum Vault Ledger</span>
              </div>
            </div>
          </div>

          {/* QUANTUMINITIUM 3D PARALLAX INVESTEERDERS PAS (atvImg MULTI-LAYER ENGINE) */}
          <QuantumWalletCards
            holderName={currentUser.name}
            shares={currentUser.sharesOwned}
            cashBalance={cashBalance}
            theme={theme}
          />

          {/* TWEE KOLOMMEN: GELD OPLADEN & AANDELEN BIJKOPEN / VERSTUREN */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LINKER PANEEL: GELD OPLADEN / STORTEN */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-emerald-400" />
                    <span>Geld op Account Zetten / Opladen</span>
                  </h3>
                  <p className="text-xs text-slate-400">Voeg werkkapitaal toe om direct extra aandelen aan te kopen.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                  Instant
                </span>
              </div>

              <form onSubmit={handleDepositCash} className="space-y-4">
                {/* Snelknoppen Bedrag */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Kies Stortingsbedrag:</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[500, 1000, 2500, 5000, 10000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmount(amt)}
                        className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                          depositAmount === amt
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850'
                        }`}
                      >
                        €{amt.toLocaleString('nl-NL')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Handmatig Bedrag Invoeren */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Of voer specifiek bedrag in:</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-sm font-mono text-slate-500">€</span>
                    <input
                      type="number"
                      min={50}
                      step={50}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(Math.max(1, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Betaalmethode Selectie */}
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Selecteer Betaalmethode:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => setDepositMethod('ideal')}
                      className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        depositMethod === 'ideal'
                          ? 'bg-pink-500/15 border-pink-500 text-pink-300 shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>iDEAL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDepositMethod('sepa')}
                      className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        depositMethod === 'sepa'
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Building className="w-4 h-4" />
                      <span>SEPA Bank</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDepositMethod('card')}
                      className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        depositMethod === 'card'
                          ? 'bg-blue-500/15 border-blue-500 text-blue-300 shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Creditcard</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDepositMethod('crypto')}
                      className={`p-2.5 rounded-xl text-xs font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                        depositMethod === 'crypto'
                          ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-lg'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      <span>USDT / Crypto</span>
                    </button>
                  </div>
                </div>

                {/* Bank Selectie voor iDEAL */}
                {depositMethod === 'ideal' && (
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Kies uw bank:</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none cursor-pointer"
                    >
                      <option value="ING Bank">ING Bank</option>
                      <option value="ABN AMRO">ABN AMRO</option>
                      <option value="Rabobank">Rabobank</option>
                      <option value="ASN Bank">ASN Bank</option>
                      <option value="Bunq">Bunq</option>
                      <option value="Knab">Knab</option>
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Direct €{depositAmount.toLocaleString('nl-NL')} Opladen</span>
                </button>
              </form>
            </div>

            {/* RECHTER PANEEL: AANDELEN BIJKOPEN MET WANDELEND WERKKAPITAAL */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <span>Aandelen Bijkopen vanuit Saldo</span>
                  </h3>
                  <p className="text-xs text-slate-400">Converteer direct opgeladen werkkapitaal naar Serie A aandelen.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-mono font-bold border border-amber-500/30">
                  €{SHARE_PRICE_CURRENT.toFixed(2)} / aandeel
                </span>
              </div>

              <form onSubmit={handleBuyFromWallet} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Aantal Aandelen om aan te schaffen:</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={10}
                      step={10}
                      value={walletBuyShares}
                      onChange={(e) => setWalletBuyShares(Math.max(1, Number(e.target.value)))}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-base focus:border-amber-400 focus:outline-none"
                    />
                    <span className="absolute right-4 top-3.5 text-xs font-mono text-slate-500">Aandelen</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {[250, 500, 1000, 2500].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setWalletBuyShares(amt)}
                      className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 font-mono text-xs cursor-pointer"
                    >
                      {amt.toLocaleString('nl-NL')}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Benodigd Bedrag:</span>
                    <span className="text-white font-bold">€{(walletBuyShares * SHARE_PRICE_CURRENT).toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Beschikbaar Saldo:</span>
                    <span className="text-emerald-300 font-bold">€{cashBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Nieuw Aandelen Totaal:</span>
                    <span className="text-amber-300 font-bold">{(currentUser.sharesOwned + walletBuyShares).toLocaleString('nl-NL')} aandelen</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all cursor-pointer"
                  >
                    <Award className="w-4 h-4" />
                    <span>Aankoop Bevestigen</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTransferModal(true)}
                    className="py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-cyan-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Versturen</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TAB: KOERS (INTERACTIEVE GRAFIEK PER UUR, DAG, WEEK, MAAND, JAAR)       */}
      {/* ========================================================================= */}
      {internalView === 'koers' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            {/* Header met Timeframe Knoppen */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-cyan-400" />
                    <span>Live Koers & Tranche Analyse</span>
                  </h3>
                  <span className="text-2xl font-extrabold font-mono text-cyan-300">
                    €{SHARE_PRICE_CURRENT.toFixed(2)}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    {koersData.change}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Weergave: {koersData.title} • Volume: {koersData.volume}
                </p>
              </div>

              {/* Tijdframe Selectie Knoppen */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-900 border border-slate-800 font-mono text-xs">
                {(['1U', '1D', '1W', '1M', '1J', 'MAX'] as const).map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setKoersTimeframe(tf)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                      koersTimeframe === tf
                        ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-850'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* INTERACTIEVE SVG GRAFIEK */}
            <div className="p-4 sm:p-6 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-4">
              <div className="flex justify-between items-center text-xs font-mono text-slate-500">
                <span>Hoogste Punt: <strong className="text-slate-300">{koersData.high}</strong></span>
                <span>Laagste Punt: <strong className="text-slate-300">{koersData.low}</strong></span>
              </div>

              {/* SVG Curve Weergave */}
              <div className="relative h-64 w-full flex items-end">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                  <defs>
                    <linearGradient id="koersGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Gradient fill */}
                  <path
                    d={`M 0 150 ${koersData.points.map((p, i) => {
                      const x = (i / (koersData.points.length - 1)) * 500;
                      const min = 2.0;
                      const max = 15.0;
                      const y = 140 - ((p.price - min) / (max - min)) * 120;
                      return `L ${x} ${y}`;
                    }).join(' ')} L 500 150 Z`}
                    fill="url(#koersGradient)"
                  />

                  {/* Hoofdlijn */}
                  <path
                    d={`${koersData.points.map((p, i) => {
                      const x = (i / (koersData.points.length - 1)) * 500;
                      const min = 2.0;
                      const max = 15.0;
                      const y = 140 - ((p.price - min) / (max - min)) * 120;
                      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#06b6d4"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Punten op de curve */}
                  {koersData.points.map((p, i) => {
                    const x = (i / (koersData.points.length - 1)) * 500;
                    const min = 2.0;
                    const max = 15.0;
                    const y = 140 - ((p.price - min) / (max - min)) * 120;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="5" fill="#05070d" stroke="#06b6d4" strokeWidth="2.5" />
                        <circle cx={x} cy={y} r="2" fill="#fbbf24" />
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* As Labels */}
              <div className="flex justify-between items-center text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                {koersData.points.map((p, i) => (
                  <div key={i} className="text-center">
                    <span className="block text-slate-300 font-bold">€{p.price.toFixed(2)}</span>
                    <span className="text-slate-500 text-[10px]">{p.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* DIEPTE STATISTIEKEN GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Dag Range</span>
                <span className="text-base font-bold font-mono text-white">€8,00 tot €8,35</span>
                <span className="text-[10px] text-slate-500 block">Spread €0,05</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">52 Weken Range</span>
                <span className="text-base font-bold font-mono text-amber-300">€2,50 tot €8,20</span>
                <span className="text-[10px] text-emerald-400 block">+228% Groei</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Volgende Tranche (B)</span>
                <span className="text-base font-bold font-mono text-cyan-300">€12,50</span>
                <span className="text-[10px] text-slate-500 block">Verwacht Q4 2025</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Beoogde IPO Waarde</span>
                <span className="text-base font-bold font-mono text-purple-300">€14,50</span>
                <span className="text-[10px] text-purple-400 block">LSE Listing Target</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. TAB: TRANSACTIEGESCHIEDENIS                                            */}
      {/* ========================================================================= */}
      {internalView === 'history' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <span>Interne Mutaties & Transactieregister</span>
              </h3>
              <p className="text-xs text-slate-400">Audit trail van al uw transacties, stortingen, transfers en dividenden.</p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Totaal mutaties: <strong className="text-white">{transactions.length}</strong>
            </span>
          </div>

          {/* Tabel met transacties */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Referentie & ID</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Aandelen</th>
                  <th className="pb-3 font-semibold">Koers / Stuk</th>
                  <th className="pb-3 font-semibold">Totaalbedrag</th>
                  <th className="pb-3 font-semibold">Tijdstip</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5">
                      <div className="font-bold text-white">{tx.id}</div>
                      <div className="text-[10px] text-slate-500">{tx.reference}</div>
                    </td>
                    <td className="py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tx.type === 'BUY'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : tx.type === 'SELL'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : tx.type === 'DIVIDEND'
                          ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                          : tx.type === 'DEPOSIT'
                          ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                          : tx.type === 'TRANSFER_OUT'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className="py-3.5 font-bold text-slate-200">
                      {tx.shares > 0 ? tx.shares.toLocaleString('nl-NL') : '-'}
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {tx.pricePerShare > 0 ? `€${tx.pricePerShare.toFixed(2)}` : '-'}
                    </td>
                    <td className="py-3.5 font-bold text-emerald-300">
                      €{tx.totalAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 text-slate-400">
                      {tx.timestamp}
                    </td>
                    <td className="py-3.5">
                      <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{tx.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TAB: RENDEMENT & DIVIDEND CALCULATOR                                   */}
      {/* ========================================================================= */}
      {internalView === 'calculator' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-amber-400" />
              <span>Rendement & Dividend Calculator</span>
            </h3>
            <p className="text-xs text-slate-400">Bereken uw dividenduitkeringen en vermogensgroei bij toekomstige tranches en beursintroductie.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Aantal Aandelen om te Simuleren:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={100}
                    step={100}
                    value={calcShares}
                    onChange={(e) => setCalcShares(Math.max(1, Number(e.target.value)))}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-lg focus:border-amber-400 focus:outline-none"
                  />
                  <span className="absolute right-4 top-3.5 text-xs font-mono text-slate-500">Aandelen</span>
                </div>
              </div>

              <div className="flex gap-2">
                {[5000, 12500, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setCalcShares(amt)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 text-xs font-mono cursor-pointer"
                  >
                    {amt.toLocaleString('nl-NL')}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Huidige Koers (Serie A):</span>
                  <span className="text-white font-bold">€{SHARE_PRICE_CURRENT.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Jaarlijks Dividendrendement:</span>
                  <span className="text-cyan-400 font-bold">{ANNUAL_DIVIDEND_PERCENT}%</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Beoogde LSE Richtprijs:</span>
                  <span className="text-purple-400 font-bold">€{SHARE_PRICE_IPO_TARGET.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Totale Inlegwaarde</span>
                <div className="text-2xl font-bold font-mono text-white">
                  €{calcTotalCost.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-500">Tegen huidige marktprijs</span>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Jaarlijks Dividend</span>
                <div className="text-2xl font-bold font-mono text-cyan-300">
                  €{calcAnnualDividend.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-cyan-400">€{(calcAnnualDividend / 12).toLocaleString('nl-NL', { minimumFractionDigits: 2 })} per maand</span>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Verwachte IPO Waarde</span>
                <div className="text-2xl font-bold font-mono text-purple-300">
                  €{calcTargetIpoValue.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <span className="text-[10px] text-purple-400">Bij LSE Beursgang</span>
              </div>

              <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                <span className="text-[11px] font-mono text-slate-400 uppercase">Geprojecteerde Meerwaarde</span>
                <div className="text-2xl font-bold font-mono text-emerald-300">
                  +€{calcIpoProfit.toLocaleString('nl-NL', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </div>
                <span className="text-[10px] text-emerald-400">+{calcIpoProfitPercent.toFixed(0)}% ROI</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. TAB: DIGITAAL AANDELENBEWIJS                                           */}
      {/* ========================================================================= */}
      {internalView === 'certificate' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-400" />
                <span>Digitaal Aandeelhouderscertificaat</span>
              </h3>
              <p className="text-xs text-slate-400">Officieel digitaal eigendomsbewijs conform notariële akte Serie A.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowCertificateModal(true)}
              className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Bewijs</span>
            </button>
          </div>

          {/* Certificaat Kaart */}
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/40 shadow-2xl relative overflow-hidden space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase block">QuantumInitium Ltd</span>
                <h2 className="text-xl font-bold text-white">AANDEELHOUDERSBEWIJS</h2>
                <p className="text-xs text-slate-400 font-mono mt-0.5">Certificaat Referentie: {currentUser.certificateId}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Award className="w-6 h-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs font-mono">
              <div>
                <span className="text-slate-500 block">Tenaamstelling:</span>
                <span className="text-white font-bold text-sm">{currentUser.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Aantal Aandelen:</span>
                <span className="text-amber-300 font-bold text-sm">{currentUser.sharesOwned.toLocaleString('nl-NL')}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Tranche:</span>
                <span className="text-emerald-400 font-bold text-sm">Serie A Participatie</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap justify-between items-center gap-2">
              <span>Notariële Deponering: 14 januari 2025</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Geldig en Onherroepelijk
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. TAB: ACCOUNT (CRUD GEGEVENS BEHEER)                                     */}
      {/* ========================================================================= */}
      {internalView === 'account' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" />
                  <span>Account & Persoonsgegevens (CRUD)</span>
                </h3>
                <p className="text-xs text-slate-400">Bekijk, wijzig of beheer uw contactgegevens, bankrekening en gemachtigden.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold">
                Status: Geverifieerd
              </span>
            </div>

            {/* FORMULIER VOOR PROFIELUPDATE (UPDATE) */}
            <form onSubmit={handleSaveAccountData} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Volledige Naam:</label>
                  <input
                    type="text"
                    value={accountFormData.name}
                    onChange={(e) => setAccountFormData({ ...accountFormData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">E-mailadres:</label>
                  <input
                    type="email"
                    value={accountFormData.email}
                    onChange={(e) => setAccountFormData({ ...accountFormData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Telefoonnummer:</label>
                  <input
                    type="text"
                    value={accountFormData.phone}
                    onChange={(e) => setAccountFormData({ ...accountFormData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">IBAN Bankrekeningnummer:</label>
                  <input
                    type="text"
                    value={accountFormData.iban}
                    onChange={(e) => setAccountFormData({ ...accountFormData, iban: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Adres & Huisnummer:</label>
                  <input
                    type="text"
                    value={accountFormData.address}
                    onChange={(e) => setAccountFormData({ ...accountFormData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Postcode:</label>
                    <input
                      type="text"
                      value={accountFormData.postalCode}
                      onChange={(e) => setAccountFormData({ ...accountFormData, postalCode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1.5">Woonplaats:</label>
                    <input
                      type="text"
                      value={accountFormData.city}
                      onChange={(e) => setAccountFormData({ ...accountFormData, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Land:</label>
                  <input
                    type="text"
                    value={accountFormData.country}
                    onChange={(e) => setAccountFormData({ ...accountFormData, country: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">BSN / Fiscaal ID:</label>
                  <input
                    type="text"
                    value={accountFormData.taxId}
                    onChange={(e) => setAccountFormData({ ...accountFormData, taxId: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-indigo-400 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Gegevens Opslaan (Update)</span>
                </button>
              </div>
            </form>
          </div>

          {/* GEMACHTIGDEN & CONTACTPERSONEN (CREATE & DELETE) */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Gemachtigden & Mede Rekeninghouders</span>
                </h4>
                <p className="text-xs text-slate-400">Personen die bevoegd zijn tot inzage of medeondertekening.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddPersonModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Nieuwe Toevoegen (Create)</span>
              </button>
            </div>

            <div className="space-y-3">
              {authorizedPersons.map((person) => (
                <div key={person.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-white">{person.name}</div>
                    <div className="text-xs text-amber-400 font-mono">{person.relation}</div>
                    <div className="text-xs text-slate-400 font-mono mt-1">
                      {person.email} • {person.phone}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteAuthorizedPerson(person.id)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
                    title="Verwijderen uit account"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Verwijderen (Delete)</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. TAB: INSTELLINGEN (E-MAILS, NOTIFICATIES & 2FA BEVEILIGING)            */}
      {/* ========================================================================= */}
      {internalView === 'settings' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-slate-300" />
              <span>Instellingen & Notificatievoorkeuren</span>
            </h3>
            <p className="text-xs text-slate-400">Beheer uw e-mailnotificaties, koers alerts en beveiligingsopties.</p>
          </div>

          <div className="space-y-6">
            {/* E-mail & Communicatie Notificaties */}
            <div className="space-y-4">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                E-mail & Communicatie Notificaties
              </h4>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white block">Transactie & Transfer Notificaties</span>
                    <span className="text-xs text-slate-400">Ontvang direct een e-mailbevestiging bij elke aankoop, verkoop of overdracht.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSetting('emailTransactions')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settingsState.emailTransactions ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settingsState.emailTransactions ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white block">Dividend Uitkeringsberichten</span>
                    <span className="text-xs text-slate-400">Melding per mail zodra een kwartaal- of jaardividend is gereserveerd.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSetting('emailDividends')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settingsState.emailDividends ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settingsState.emailDividends ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white block">Maandelijkse Financiële Rapportages</span>
                    <span className="text-xs text-slate-400">Ontvang maandelijks de geconsolideerde aandeelhoudersrapportage per mail.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSetting('emailReports')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settingsState.emailReports ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settingsState.emailReports ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Systeem & Koers Alerts */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                Koers & Beveiligingsalerts
              </h4>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white block">Koersverandering Alerts (&gt;2%)</span>
                    <span className="text-xs text-slate-400">Ontvang realtime alerts bij significante tranche of referentiekoers stijgingen.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSetting('priceAlerts')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settingsState.priceAlerts ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settingsState.priceAlerts ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white block">Twee Factor Authenticatie (2FA)</span>
                    <span className="text-xs text-slate-400">Vereis extra pincode of SMS verificatie bij elke transfer en inlogpoging.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSetting('twoFactorEnabled')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settingsState.twoFactorEnabled ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settingsState.twoFactorEnabled ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold text-white block">SMS Beveiligingsalerts</span>
                    <span className="text-xs text-slate-400">Verstuur direct een SMS bij grote overboekingen of IP adres wijziging.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleToggleSetting('smsAlerts')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      settingsState.smsAlerts ? 'bg-emerald-500' : 'bg-slate-800'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      settingsState.smsAlerts ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 12 ENTITEITEN INTEGRATIE PAGINA (VERPLICHTE KOPPELINGEN VOOR INVESTEERDERS) */}
      {/* ========================================================================= */}
      {internalView === 'integrations' && (
        <div className="space-y-6">
          {/* HOOFD COMPLIANCE & GOVERNANCE BANNER */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-teal-500/30 bg-gradient-to-br from-slate-950 via-slate-900/90 to-teal-950/20 relative overflow-hidden shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2 max-w-3xl">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                    Statutair Verplichte Ecosysteem Integratie
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30">
                    12 van 12 Entiteiten Actief
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  12 Entiteiten Ecosysteem Integratie Hub
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Conform de statuten en aandeelhoudersovereenkomst van QuantumInitium Ltd zijn alle gecertificeerde aandeelhouders verplicht een actieve data en escrow koppeling te onderhouden met alle 12 operationele entiteiten. Dit garandeert geautomatiseerde dividenduitkeringen, realtime SABI escrow clearing, IFRS cap table synchronisatie en transparante audit trails.
                </p>
              </div>

              {/* Globale Sync & Actieknoppen */}
              <div className="flex flex-wrap lg:flex-col gap-3 shrink-0">
                <button
                  type="button"
                  onClick={handleSyncAllEntities}
                  disabled={isSyncingAll}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncingAll ? 'animate-spin' : ''}`} />
                  <span>{isSyncingAll ? 'Bezig met Synchroniseren...' : 'Synchroniseer Alle 12 Entiteiten'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopyKey(currentUser.certificateId + '_SEC_AES256')}
                  className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-300 hover:text-white font-mono text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>{copiedKey ? 'Sleutel Gekopieerd!' : 'Kopieer Ecosysteem Sleutel'}</span>
                </button>
              </div>
            </div>

            {/* KPI Tegels voor de 12 Entiteiten Status */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 relative z-10">
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-teal-500/20">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Koppeling Status</span>
                <span className="text-base sm:text-lg font-black text-teal-300 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  12 / 12 Entiteiten
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">100% Geverifieerd</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-blue-500/20">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">Gemiddelde Latency</span>
                <span className="text-base sm:text-lg font-black text-blue-300 mt-0.5 block">
                  11 ms
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Ultra Fast TLS 1.3</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-amber-500/20">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">SABI Escrow Clearing</span>
                <span className="text-base sm:text-lg font-black text-amber-300 mt-0.5 block">
                  Actief & Live
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">ISO 20022 Protocol</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-purple-500/20">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">IFRS Audit Deponering</span>
                <span className="text-base sm:text-lg font-black text-purple-300 mt-0.5 block">
                  Gesynchroniseerd
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Londen UK Notariaat</span>
              </div>
            </div>
          </div>

          {/* FILTER KNOPPEN VOOR SUBHOLDINGS EN CATEGORIEËN */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Alle 12 Entiteiten (12)' },
              { id: 'mother', label: 'Moederholding UK (1)' },
              { id: 'sub1', label: 'Subholding 1: IP & Tech (2)' },
              { id: 'sub2', label: 'Subholding 2: Fintech (1)' },
              { id: 'sub3', label: 'Subholding 3: Talent & Media (4)' },
              { id: 'sub4', label: 'Subholding 4: Compute & Media (3)' },
              { id: 'sub5', label: 'Subholding 5: PropTech (1)' }
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setEntityFilter(f.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  entityFilter === f.id
                    ? 'bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* HET 12 ENTITEITEN INTERACTIEF KAARTENROOSTER */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {entitiesIntegrations
              .filter((ent) => entityFilter === 'all' || ent.holdingKey === entityFilter)
              .map((ent) => {
                const isPinging = pingingEntityId === ent.id;
                return (
                  <div
                    key={ent.id}
                    className="glass-panel p-5 rounded-2xl border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group relative overflow-hidden"
                  >
                    {/* Bovenste rij: Naam, Holding badge & Status */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${ent.color}`}>
                            {ent.holdingName}
                          </span>
                          <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                            {ent.name}
                          </h4>
                          <p className="text-xs text-slate-400 font-medium">{ent.type}</p>
                        </div>

                        {/* Status badge */}
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Actief
                        </span>
                      </div>

                      {/* Statutaire Verplichting Uitleg */}
                      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                        <strong className="text-amber-400 block mb-0.5 font-mono text-[10px] uppercase">
                          Verplichte Koppeling Reden:
                        </strong>
                        {ent.obligationReason}
                      </div>

                      {/* Technische Protocol & Endpoint Gegevens */}
                      <div className="space-y-1.5 font-mono text-[10px]">
                        <div className="flex justify-between text-slate-400">
                          <span>Protocol:</span>
                          <span className="text-teal-300 font-semibold">{ent.protocol}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Endpoint:</span>
                          <span className="text-slate-300 truncate max-w-[180px]">{ent.endpoint}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Latency & Sync:</span>
                          <span className="text-slate-200">{ent.latency} • {ent.lastSync}</span>
                        </div>
                      </div>

                      {/* Data Streams Tags */}
                      <div className="flex flex-wrap gap-1 pt-1">
                        {ent.dataStreams.map((ds, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[9px] font-mono bg-slate-900 border border-slate-800 text-slate-400"
                          >
                            {ds}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Onderste Actiebalk: Ping Test, Details & Auto Sync */}
                    <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        {/* Ping Test Knop */}
                        <button
                          type="button"
                          onClick={() => handlePingEntity(ent.id)}
                          disabled={isPinging}
                          className="px-2.5 py-1.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 text-teal-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                          title="Test live handshake en latency"
                        >
                          <Zap className={`w-3 h-3 ${isPinging ? 'animate-bounce text-amber-400' : ''}`} />
                          <span>{isPinging ? 'Testen...' : 'Ping Test'}</span>
                        </button>

                        {/* Details Modal Knop */}
                        <button
                          type="button"
                          onClick={() => setSelectedEntityModal(ent)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-[11px] font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>
                      </div>

                      {/* Auto Sync Schakelaar */}
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-mono text-slate-500">Auto Sync</span>
                        <button
                          type="button"
                          onClick={() => handleToggleEntityAutoSync(ent.id)}
                          className={`w-7 h-4 rounded-full transition-colors relative cursor-pointer ${
                            ent.autoSync ? 'bg-emerald-500' : 'bg-slate-800'
                          }`}
                        >
                          <span className={`w-3 h-3 rounded-full bg-white absolute top-0.5 transition-transform ${
                            ent.autoSync ? 'right-0.5' : 'left-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* REALTIME AUDIT & WEBHOOK EVENT FEED VOOR ALLE 12 ENTITEITEN */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Realtime Ecosysteem Webhook & Audit Feed</h4>
                  <p className="text-xs text-slate-400">Live synchronisatie events tussen certificaat {currentUser.certificateId} en de 12 entiteiten</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Feed
              </span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {ecosystemLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="font-bold text-white">{log.entity}:</span>
                    <span className="text-slate-300 text-[11px]">{log.action}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[9px] bg-slate-900 border border-slate-800 text-teal-300">
                      {log.badge}
                    </span>
                    <span className="text-[10px] text-slate-500">{log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ENTITEIT DETAILS & HANDSHAKE INSPECTIE                            */}
      {/* ========================================================================= */}
      {selectedEntityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-teal-500/30 shadow-2xl space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                  <Network className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{selectedEntityModal.name}</h3>
                  <p className="text-xs text-slate-400">{selectedEntityModal.holdingName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEntityModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <span className="text-slate-400 text-[10px] uppercase block">Statutaire Reden & Doel</span>
                <p className="text-slate-200 text-xs leading-relaxed font-sans">
                  {selectedEntityModal.obligationReason}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Endpoint:</span>
                  <span className="text-teal-300 font-bold">{selectedEntityModal.endpoint}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Protocol:</span>
                  <span className="text-slate-200">{selectedEntityModal.protocol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">API Sleutel:</span>
                  <span className="text-amber-300">{selectedEntityModal.apiKey}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Latency:</span>
                  <span className="text-emerald-400 font-bold">{selectedEntityModal.latency}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase block">Simulatie Handshake Payload</span>
                <pre className="text-[10px] text-emerald-400 overflow-x-auto p-2 bg-slate-900 rounded-lg">
{`{
  "investorCertificate": "${currentUser.certificateId}",
  "entity": "${selectedEntityModal.name}",
  "status": "AUTHORIZED",
  "ifrsCompliance": "CONFIRMED",
  "encryption": "AES_256_GCM",
  "timestamp": "${new Date().toISOString()}"
}`}
                </pre>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  handlePingEntity(selectedEntityModal.id);
                  setSelectedEntityModal(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-teal-500/20"
              >
                Direct Handshake Testen
              </button>
              <button
                type="button"
                onClick={() => setSelectedEntityModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: TRANSFER (AANDELEN OF WANDELEND GELD OVERBOEKEN)                   */}
      {/* ========================================================================= */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 relative">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Directe Transfer Desk</h3>
                  <p className="text-xs text-slate-400">Overboeking naar ander geverifieerd account</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteTransfer} className="space-y-4">
              {/* Transfer Type Selectie */}
              <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-900 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setTransferType('shares')}
                  className={`py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    transferType === 'shares'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Aandelen Overdragen
                </button>
                <button
                  type="button"
                  onClick={() => setTransferType('cash')}
                  className={`py-2 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                    transferType === 'cash'
                      ? 'bg-emerald-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Werkkapitaal (€)
                </button>
              </div>

              {/* Ontvanger Certificaat of Account ID */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Ontvanger Account of Certificaat ID:
                </label>
                <input
                  type="text"
                  value={transferRecipient}
                  onChange={(e) => setTransferRecipient(e.target.value)}
                  placeholder="Bijv. QI INV 9921 NL"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              {/* Aantal of Bedrag */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  {transferType === 'shares' ? 'Aantal Aandelen:' : 'Bedrag in Euro (€):'}
                </label>
                <input
                  type="number"
                  min={1}
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm focus:border-emerald-400 focus:outline-none"
                  required
                />
                <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                  {transferType === 'shares'
                    ? `Beschikbaar: ${currentUser.sharesOwned.toLocaleString('nl-NL')} aandelen`
                    : `Beschikbaar: €${cashBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}`}
                </span>
              </div>

              {/* Notitie */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Referentie / Notitie:</label>
                <input
                  type="text"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                />
              </div>

              {/* Pincode Beveiliging */}
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Beveiligingspincode (2FA):</label>
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={transferPin}
                    onChange={(e) => setTransferPin(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-sm tracking-widest focus:border-emerald-400 focus:outline-none"
                    required
                  />
                  <span className="absolute right-4 top-3 text-[10px] font-mono text-slate-500">Demo Code: 4821</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transfer Bevestigen</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NIEUWE GEMACHTIGDE TOEVOEGEN                                      */}
      {/* ========================================================================= */}
      {showAddPersonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
            <div className="flex justify-between items-start pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">Nieuwe Gemachtigde Toevoegen</h3>
              <button
                type="button"
                onClick={() => setShowAddPersonModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAuthorizedPerson} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Volledige Naam:</label>
                <input
                  type="text"
                  value={newPersonData.name}
                  onChange={(e) => setNewPersonData({ ...newPersonData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Rol of Relatie:</label>
                <input
                  type="text"
                  value={newPersonData.relation}
                  onChange={(e) => setNewPersonData({ ...newPersonData, relation: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">E-mailadres:</label>
                <input
                  type="email"
                  value={newPersonData.email}
                  onChange={(e) => setNewPersonData({ ...newPersonData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Telefoonnummer:</label>
                <input
                  type="text"
                  value={newPersonData.phone}
                  onChange={(e) => setNewPersonData({ ...newPersonData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:border-emerald-400 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPersonModal(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-900 text-slate-300 text-xs font-bold"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 text-xs font-bold"
                >
                  Toevoegen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: NOTIFICATIE OVERZICHT                                             */}
      {/* ========================================================================= */}
      {showNotificationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Systeem & Aandeelhoudersberichten</h3>
                  <p className="text-xs text-slate-400">Actuele meldingen voor {currentUser.certificateId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNotificationModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>Dividend Reservering Q1 2025</span>
                  <span className="text-[10px] text-slate-400">Vandaag</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Uw kwartaaldividend van €1.520,00 is met succes gereserveerd en gekoppeld aan certificaat {currentUser.certificateId}.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>Serie A Tranche Koersgroei (+2,5%)</span>
                  <span className="text-[10px] text-slate-400">Gisteren</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  De interne referentiekoers van QuantumInitium is verhoogd naar €8,20 per aandeel na uitbreiding van de brandmuren.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span>Notariële Deponering Bevestigd</span>
                  <span className="text-[10px] text-slate-400">14 Jan</span>
                </div>
                <p className="text-slate-300 text-[11px]">
                  Uw aandelenallocatie is notarieel bekrachtigd en gedeponeerd bij het handelsregister.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowNotificationModal(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-850 text-white font-bold text-xs cursor-pointer"
              >
                Sluiten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: DOWNLOAD CERTIFICAAT PDF                                          */}
      {/* ========================================================================= */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-5">
            <div className="flex justify-between items-start pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Certificaat Downloaden</h3>
                  <p className="text-xs text-slate-400">Officiële PDF met digitale zegel en notariële registratie</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Eigenaar:</span>
                <span className="text-white font-bold">{currentUser.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Certificaat ID:</span>
                <span className="text-amber-300 font-bold">{currentUser.certificateId}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Aantal Aandelen:</span>
                <span className="text-white font-bold">{currentUser.sharesOwned.toLocaleString('nl-NL')} aandelen</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Huidige Waarde:</span>
                <span className="text-emerald-400 font-bold">€{currentTotalValue.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex gap-3">
              <button
                type="button"
                onClick={() => setShowCertificateModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold text-xs cursor-pointer"
              >
                Sluiten
              </button>
              <button
                type="button"
                onClick={() => {
                  window.print();
                  setShowCertificateModal(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-purple-500/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PDF / Print</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
