import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  Award,
  Menu,
  X,
  Cpu,
  Network,
  Bot,
  Calculator,
  BookOpen,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Search,
  Sliders,
  Zap,
  PlayCircle,
  ShieldCheck,
  Layers,
  Wallet,
  Server,
  Home,
  Users,
  Crown,
  Info,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Eye,
  EyeOff,
  PanelLeftClose,
  PanelLeftOpen,
  Building2,
  Sparkles,
  ChevronDown,
  Check,
  LayoutGrid,
  ExternalLink,
  LogIn,
  UserPlus,
  LogOut,
  TrendingUp,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import EcosystemCanvas, { EcosystemCanvasHandle } from './components/EcosystemCanvas';
import DossierReader from './components/DossierReader';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import InvestorDashboard from './components/InvestorDashboard';
import AdminDashboard from './components/AdminDashboard';
import { AuthUser, DEMO_INVESTOR, DEMO_ADMIN, SHARE_PRICE_CURRENT } from './types/auth';
import { authUserFromSupabaseUser, supabase } from './lib/supabase';
import { ecosystemData } from './data/ecosystem';
import quantumInitiumLogo from './assets/images/quantum_initium_logo_1790097745176.jpg';

interface EntityItem {
  name: string;
  holdingKey: string;
  holdingName: string;
  category: 'tech' | 'fintech' | 'talent' | 'compute' | 'proptech' | 'holding' | 'media';
  type: string;
  role: string;
  color: string;
}

const allEntitiesList: EntityItem[] = [
  {
    name: 'QuantumInitium Ltd',
    holdingKey: 'mother',
    holdingName: 'QuantumInitium Ltd (Moederholding)',
    category: 'holding',
    type: 'Moederholding',
    role: 'Fysiek hoofdkantoor Londen, twee UK resident bestuurders, centrale kapitaalallocatie & IFRS beursvoorbereiding.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    name: 'CRMos Ltd',
    holdingKey: 'sub1',
    holdingName: 'Subholding 1: IP & Tech',
    category: 'tech',
    type: 'SaaS & Enablement',
    role: 'Enterprise ATS, AI outreach dialers en geautomatiseerd contractbeheer.',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  },
  {
    name: 'Investbotiq Ltd',
    holdingKey: 'sub1',
    holdingName: 'Subholding 1: IP & Tech',
    category: 'tech',
    type: 'AI Executie Engine',
    role: 'IQ Bot & Agent voor autonome kapitaal- en orderdistributie over sectoren.',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  },
  {
    name: 'Xabi World Ltd',
    holdingKey: 'sub2',
    holdingName: 'Subholding 2: Fintech & Liquidity',
    category: 'fintech',
    type: 'Clearing & Escrow',
    role: 'Fintech clearing hub (SABI rails), BaaS en EMI integraties en realtime split payments.',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  },
  {
    name: 'VVC Ltd',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'talent',
    type: 'Gateway & Community',
    role: 'Centrale onboarding portal en strategisch partnernetwerk voor talentstromen.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    name: 'DJOBBA Ltd',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'talent',
    type: 'Recruitment Marketplace',
    role: 'B2B IT detacherings en resourcingplatform voor internationale experts.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    name: 'Immigratiepunt Ltd',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'talent',
    type: 'Expat Logistics',
    role: 'Visumaanvragen, kennismigranten en complete relocatieservice.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    name: 'Zheavenzy Ltd',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'media',
    type: 'Muzieklabel & Talentportaal',
    role: 'Muzieklabel en digitaal talentportaal voor artiesten, streaming distributie en creatieve rechten monetarisering.',
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/30'
  },
  {
    name: 'Boostplug Ltd',
    holdingKey: 'sub4',
    holdingName: 'Subholding 4: Compute & Media',
    category: 'compute',
    type: 'Hardware & Mining',
    role: 'Exclusieve GPU mining clusters en stream point bandbreedte monetarisering.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    name: 'Logs.rent',
    holdingKey: 'sub4',
    holdingName: 'Subholding 4: Compute & Media',
    category: 'compute',
    type: 'Account Marketplace',
    role: 'Geautomatiseerd verhuur en handelsplatform voor compute accounts.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    name: 'Spontiva Ltd',
    holdingKey: 'sub4',
    holdingName: 'Subholding 4: Compute & Media',
    category: 'compute',
    type: 'Fintech Cashflow Motor',
    role: 'Working Capital Optimization (WCO) en Time Gap Cashflow structuren.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    name: 'WoningVry Ltd',
    holdingKey: 'sub5',
    holdingName: 'Subholding 5: Real Estate & Operations',
    category: 'proptech',
    type: 'PropTech Huisvesting',
    role: 'LongStay residentiële huur en dynamische BnB exploitatie voor IT expats.',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
  },
  {
    name: 'Afterstudenthousing Ltd',
    holdingKey: 'sub5',
    holdingName: 'Subholding 5: Real Estate & Operations',
    category: 'proptech',
    type: 'Student & Expat Transit',
    role: 'Doorstroomhuisvesting voor IT trainees en young professionals.',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
  }
];

interface SubholdingNode {
  title: string;
  subtitle: string;
  badge: string;
  desc: string;
  entities: { name: string; type: string; role: string }[];
}

const subholdingMatrix: Record<string, SubholdingNode> = {
  mother: {
    title: 'QuantumInitium Ltd (Moederholding)',
    subtitle: 'Centrale Directie & Holding • Londen, UK Substance',
    badge: 'Moederholding',
    desc: 'Centrale holding direct verantwoordelijk voor de overall kapitaalallocatie, geconsolideerde IFRS verslaglegging, intellectueel eigendom en LSE Main Market beursgang.',
    entities: [
      {
        name: 'QuantumInitium Ltd',
        type: 'Moederholding',
        role: 'Fysiek hoofdkantoor Londen, twee UK resident bestuurders, Raad van Commissarissen.'
      }
    ]
  },
  sub1: {
    title: 'IP & Tech Subholding',
    subtitle: 'Gespecialiseerde Tak 01',
    badge: 'Subholding 1',
    desc: 'Eigenaar en beheerder van alle intellectuele eigendommen, AI modellen, CRMos B2B SaaS en de Investbotiq centrale executiemotor.',
    entities: [
      {
        name: 'CRMos Ltd',
        type: 'SaaS & Enablement',
        role: 'Enterprise ATS, AI outreach dialers en geautomatiseerd contractbeheer.'
      },
      {
        name: 'Investbotiq Ltd',
        type: 'AI Executie Engine',
        role: 'IQ Bot & Agent voor autonome kapitaal en orderdistributie.'
      }
    ]
  },
  sub2: {
    title: 'Fintech & Liquidity Subholding',
    subtitle: 'Gespecialiseerde Tak 02',
    badge: 'Subholding 2',
    desc: 'Clearing, betaalinfrastructuur en beveiligde liquiditeitsretentie voor de gehele groep zonder traditioneel bancair balansrisico.',
    entities: [
      {
        name: 'Xabi World Ltd',
        type: 'Clearing & Escrow',
        role: 'Fintech clearing hub (SABI rails), BaaS en EMI integraties en realtime split payments.'
      }
    ]
  },
  sub3: {
    title: 'Talent & Gateway Subholding',
    subtitle: 'Gespecialiseerde Tak 03',
    badge: 'Subholding 3',
    desc: 'Onboarding hub en recruitment motor voor de frictieloze instroom van gekwalificeerd internationaal IT talent.',
    entities: [
      {
        name: 'VVC Ltd',
        type: 'Gateway & Community',
        role: 'Centrale onboarding portal en strategisch partnernetwerk.'
      },
      {
        name: 'DJOBBA Ltd',
        type: 'Recruitment Marketplace',
        role: 'B2B IT detacherings en resourcingplatform.'
      },
      {
        name: 'Immigratiepunt Ltd',
        type: 'Expat Logistics',
        role: 'Visumaanvragen, kennismigranten en relocatieservice.'
      },
      {
        name: 'Zheavenzy Ltd',
        type: 'Muzieklabel & Talentportaal',
        role: 'Muzieklabel en digitaal talentportaal voor artiesten, muziekdistributie en rechtenbeheer.'
      }
    ]
  },
  sub4: {
    title: 'Compute & Media Subholding',
    subtitle: 'Gespecialiseerde Tak 04',
    badge: 'Subholding 4',
    desc: 'Infrastructuur voor high performance GPU AI inferentie, bandbreedte monetarisering, accountverhuur en Time Gap Cashflow.',
    entities: [
      {
        name: 'Boostplug Ltd',
        type: 'Hardware & Mining',
        role: 'Exclusieve GPU mining clusters en stream point bandbreedte.'
      },
      {
        name: 'Logs.rent',
        type: 'Account Marketplace',
        role: 'Geautomatiseerd verhuur en handelsplatform voor compute accounts.'
      },
      {
        name: 'Spontiva Ltd',
        type: 'Fintech Cashflow Motor',
        role: 'Working Capital Optimization (WCO) en Time Gap Cashflow structuren.'
      }
    ]
  },
  sub5: {
    title: 'Real Estate & Operations Subholding',
    subtitle: 'Gespecialiseerde Tak 05',
    badge: 'Subholding 5',
    desc: 'PropTech oplossingen voor residentiële huisvesting, short stay BnB verhuur en expat doorstroom.',
    entities: [
      {
        name: 'WoningVry Ltd',
        type: 'PropTech & Living',
        role: 'Geautomatiseerde verhuur LongStay (€750 per maand) en BnB (€375 per maand).'
      },
      {
        name: 'Afterstudenthousing Ltd',
        type: 'Upscale Housing',
        role: 'Doorstroomhuisvesting voor young professionals en afgestudeerden.'
      }
    ]
  }
};

const chapterList = [
  { num: 1, tag: '01', title: 'EXECUTIEF', desc: 'Strategisch Perspectief' },
  { num: 2, tag: '02', title: 'ORGANISATIE', desc: '5 Subholdings & 12 Entiteiten' },
  { num: 3, tag: '03', title: 'TECHNOLOGIE', desc: 'Investbotiq AI Executie Engine' },
  { num: 4, tag: '04', title: 'INTEGRATIE', desc: 'Operationele Synergie Matrix' },
  { num: 5, tag: '05', title: 'REKENMODEL', desc: 'Gauss Model (€2.625 Motor)' },
  { num: 6, tag: '06', title: 'GROEI', desc: 'Schaalbaarheid 2026 tot 2029' },
  { num: 7, tag: '07', title: 'LIQUIDITEIT', desc: 'Time Gap Cashflow & Xabi World' },
  { num: 8, tag: '08', title: 'KAPITAALMARKT', desc: 'LSE Beursgang & Cap Table' },
  { num: 9, tag: '09', title: 'ALLOCATIE', desc: 'Kapitaalallocatie (€22M)' },
  { num: 10, tag: '10', title: 'TOEZICHT', desc: 'Governance & Substance' }
];

const holdcoKeyToArchKey: Record<string, string> = {
  Moederholding: 'mother',
  mother: 'mother',
  IP_Tech: 'sub1',
  sub1: 'sub1',
  Fintech: 'sub2',
  sub2: 'sub2',
  Talent: 'sub3',
  sub3: 'sub3',
  Compute: 'sub4',
  sub4: 'sub4',
  RealEstate: 'sub5',
  sub5: 'sub5'
};

const archKeyToHoldcoKey: Record<string, string> = {
  mother: 'Moederholding',
  Moederholding: 'Moederholding',
  sub1: 'IP_Tech',
  IP_Tech: 'IP_Tech',
  sub2: 'Fintech',
  Fintech: 'Fintech',
  sub3: 'Talent',
  Talent: 'Talent',
  sub4: 'Compute',
  Compute: 'Compute',
  sub5: 'RealEstate',
  RealEstate: 'RealEstate'
};

export interface SubholdingCardData {
  id: string;
  archKey: string;
  numberTag: string;
  title: string;
  subTitle: string;
  sector: string;
  desc: string;
  colorHex: string;
  textColor: string;
  badgeClass: string;
  borderClass: string;
  hoverBorderClass: string;
  activeClass: string;
  iconName: 'Crown' | 'Cpu' | 'Wallet' | 'Users' | 'Server' | 'Home';
  entitiesCount: number;
  entityNames: string[];
  focus: string;
  firewall: string;
  substance: string;
  model: string;
}

export const subholdingCardsData: SubholdingCardData[] = [
  {
    id: 'Moederholding',
    archKey: 'mother',
    numberTag: 'MOEDER',
    title: 'QuantumInitium Ltd',
    subTitle: 'Centrale Moederholding & Directie',
    sector: 'Top Holding & Governance',
    desc: 'Centrale moederholding direct verantwoordelijk voor de overall kapitaalallocatie, IP beheer, geconsolideerde IFRS verslaglegging en LSE Main Market beursgang.',
    colorHex: '#ffd700',
    textColor: 'text-amber-400',
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    borderClass: 'border-amber-500/30',
    hoverBorderClass: 'hover:border-amber-400/60',
    activeClass: 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/20 text-amber-200',
    iconName: 'Crown',
    entitiesCount: 1,
    entityNames: ['QuantumInitium Ltd'],
    focus: 'Overkoepelend toezicht, M&A strategie, kapitaalallocatie en LSE beursgang',
    firewall: '100% juridische en financiële scheiding van operationele risicos',
    substance: 'Fysiek hoofdkantoor Londen, twee UK resident bestuurders, 3 RvC commissarissen',
    model: 'Holdingstructuur, geconsolideerde deelnemingen en dividendinkomsten'
  },
  {
    id: 'IP_Tech',
    archKey: 'sub1',
    numberTag: 'SUB 01',
    title: 'IP & Tech Holdco',
    subTitle: 'Intellectual Property & Software Portfolio',
    sector: 'AI & Enterprise SaaS',
    desc: 'Eigenaar en beheerder van alle intellectuele eigendommen, softwarepatenten, AI modellen, CRMos B2B SaaS en de Investbotiq centrale executiemotor.',
    colorHex: '#00f0ff',
    textColor: 'text-cyan-400',
    badgeClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    borderClass: 'border-cyan-500/30',
    hoverBorderClass: 'hover:border-cyan-400/60',
    activeClass: 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/20 text-cyan-200',
    iconName: 'Cpu',
    entitiesCount: 2,
    entityNames: ['CRMos Ltd', 'Investbotiq Ltd'],
    focus: 'Softwareontwikkeling, intellectueel eigendom en enterprise cloud software',
    firewall: 'Strikte IP licenties, zero operationele schulden besmetting',
    substance: 'UK Ltd met eigen IP beheer en software auteursrechten',
    model: 'B2B SaaS abonnementen, enterprise licenties en API integraties'
  },
  {
    id: 'Fintech',
    archKey: 'sub2',
    numberTag: 'SUB 02',
    title: 'Fintech & Liquidity Holdco',
    subTitle: 'Financiële Infrastructuur & Transactieverwerking',
    sector: 'Clearing & Escrow',
    desc: 'Faciliteert geavanceerde clearing, liquiditeitsretentie en embedded financing zonder blootstelling aan traditioneel bancair balansrisico.',
    colorHex: '#10b981',
    textColor: 'text-emerald-400',
    badgeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    borderClass: 'border-emerald-500/30',
    hoverBorderClass: 'hover:border-emerald-400/60',
    activeClass: 'bg-emerald-500/15 border-emerald-400 ring-2 ring-emerald-400/30 shadow-lg shadow-emerald-500/20 text-emerald-200',
    iconName: 'Wallet',
    entitiesCount: 1,
    entityNames: ['Xabi World Ltd'],
    focus: 'Robuuste SABI betaalrails, geautomatiseerde clearing en veilige derdengeldenscheiding',
    firewall: 'Geen eigen bankbalansrisico, 100% escrow gescheiden via Stichting Derdengelden',
    substance: 'Gecertificeerde BaaS en EMI partners zoals Wallester en Swan',
    model: 'Transactievergoedingen, clearingcontracten en liquiditeitsretentie'
  },
  {
    id: 'Talent',
    archKey: 'sub3',
    numberTag: 'SUB 03',
    title: 'Talent & Gateway Holdco',
    subTitle: 'Human Capital, Resourcing & Talent Onboarding',
    sector: 'Recruitment & Media Gateway',
    desc: 'Centrale onboarding portal en strategische recruitment marketplace voor de frictieloze instroom van gekwalificeerd internationaal IT talent.',
    colorHex: '#eab308',
    textColor: 'text-yellow-400',
    badgeClass: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30',
    borderClass: 'border-yellow-500/30',
    hoverBorderClass: 'hover:border-yellow-400/60',
    activeClass: 'bg-yellow-500/15 border-yellow-400 ring-2 ring-yellow-400/30 shadow-lg shadow-yellow-500/20 text-yellow-200',
    iconName: 'Users',
    entitiesCount: 4,
    entityNames: ['VVC Ltd', 'DJOBBA Ltd', 'Immigratiepunt Ltd', 'Zheavenzy Ltd'],
    focus: 'Onboarding hub, IT detacheringsresourcing, expat relocatie en artiestenportaal',
    firewall: 'Afzonderlijke service level agreements en contractuele risico isolatie',
    substance: 'Geregistreerde UK recruitment en gateway entiteiten',
    model: 'Plaatsingsfees, abonnementsgelden, relocatiemarges en streaming royalties'
  },
  {
    id: 'Compute',
    archKey: 'sub4',
    numberTag: 'SUB 04',
    title: 'Compute & Media Holdco',
    subTitle: 'High Performance GPU AI & Stream Monetarisering',
    sector: 'Hardware & Compute Marketplace',
    desc: 'Infrastructuur voor high performance GPU AI inferentie, hardware mining clusters, streaming bandbreedte, accountverhuur en Time Gap Cashflow.',
    colorHex: '#a855f7',
    textColor: 'text-purple-400',
    badgeClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    borderClass: 'border-purple-500/30',
    hoverBorderClass: 'hover:border-purple-400/60',
    activeClass: 'bg-purple-500/15 border-purple-400 ring-2 ring-purple-400/30 shadow-lg shadow-purple-500/20 text-purple-200',
    iconName: 'Server',
    entitiesCount: 3,
    entityNames: ['Boostplug Ltd', 'Logs.rent', 'Spontiva Ltd'],
    focus: 'GPU rekenkracht, accountverhuur marketplace en Time Gap Cashflow motor',
    firewall: 'Hardware activa en verhuurcontracten afzonderlijk geborgd per werkmaatschappij',
    substance: 'Eigen fysieke en cloud compute clusters met geregistreerde hardware contracten',
    model: 'Compute verhuur, hash rate commissies en werkkapitaal optimalisatie marges'
  },
  {
    id: 'RealEstate',
    archKey: 'sub5',
    numberTag: 'SUB 05',
    title: 'Real Estate & Operations Holdco',
    subTitle: 'PropTech Huisvesting & Expat Accommodatie',
    sector: 'PropTech & Living',
    desc: 'PropTech platforms voor longstay residentiële verhuur en dynamische short stay BnB exploitatie voor IT expats en trainees.',
    colorHex: '#6366f1',
    textColor: 'text-indigo-400',
    badgeClass: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    borderClass: 'border-indigo-500/30',
    hoverBorderClass: 'hover:border-indigo-400/60',
    activeClass: 'bg-indigo-500/15 border-indigo-400 ring-2 ring-indigo-400/30 shadow-lg shadow-indigo-500/20 text-indigo-200',
    iconName: 'Home',
    entitiesCount: 2,
    entityNames: ['WoningVry Ltd', 'Afterstudenthousing Ltd'],
    focus: 'Geautomatiseerde woonverhuur, expat doorstroom en hospitality optimalisatie',
    firewall: 'Vastgoed passiva en huurovereenkomsten 100% afgeschermd van de tech modules',
    substance: 'PropTech software met gecontracteerde vastgoedeenheden en residentiële exploitatie',
    model: 'Maandelijkse huurstromen (LongStay €750 per maand, BnB €375 per maand)'
  }
];

function renderHoldcoIcon(iconName: string, className: string = 'w-4 h-4') {
  switch (iconName) {
    case 'Crown':
      return <Crown className={className} />;
    case 'Cpu':
      return <Cpu className={className} />;
    case 'Wallet':
      return <Wallet className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Server':
      return <Server className={className} />;
    case 'Home':
      return <Home className={className} />;
    default:
      return <Building2 className={className} />;
  }
}

export function App() {
  const [activeTab, setActiveTab] = useState<
    'architecture' | 'simulator' | 'calculator' | 'dossier' | '3d' | 'login' | 'register' | 'investor_dashboard' | 'admin_dashboard'
  >('architecture');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (mounted && data.session?.user) {
        setCurrentUser(authUserFromSupabaseUser(data.session.user));
        setActiveTab('investor_dashboard');
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) {
        return;
      }

      if (session?.user) {
        setCurrentUser(authUserFromSupabaseUser(session.user));
        setActiveTab('investor_dashboard');
      } else {
        setCurrentUser(null);
        setActiveTab('architecture');
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setActiveTab('admin_dashboard');
    } else {
      setActiveTab('investor_dashboard');
    }
  };

  const handleRegisterSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setActiveTab('investor_dashboard');
  };

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    setCurrentUser(null);
    setActiveTab('architecture');
  };

  // Theme (Dark/Light) en Taal (NL/EN) state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      return (localStorage.getItem('qi_theme') as 'dark' | 'light') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [language, setLanguage] = useState<'nl' | 'en'>(() => {
    try {
      return (localStorage.getItem('qi_lang') as 'nl' | 'en') || 'nl';
    } catch {
      return 'nl';
    }
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
      document.body.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
      document.body.classList.remove('light-mode');
    }
  }, [theme]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('qi_theme', next);
    } catch {}
  };

  const toggleLanguage = () => {
    const next = language === 'nl' ? 'en' : 'nl';
    setLanguage(next);
    try {
      localStorage.setItem('qi_lang', next);
    } catch {}
  };

  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [selectedArchNode, setSelectedArchNode] = useState<string>('mother');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Upgraded Menu & Sidebar State
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [sidebarView, setSidebarView] = useState<'modules' | 'chapters' | 'entities'>('modules');
  const [entitySearchQuery, setEntitySearchQuery] = useState<string>('');
  const [entityCategoryFilter, setEntityCategoryFilter] = useState<string>('all');

  // Simulator state
  const [talentType, setTalentType] = useState<string>('expat_it');
  const [simLogs, setSimLogs] = useState<string[]>([
    '[SYSTEM READY] Investbotiq IQ Agent v2.4 initialized.',
    '[GATEWAY] Waiting for VVC talent trigger event...'
  ]);

  // Calculator state
  const [calcMembers, setCalcMembers] = useState<number>(100);

  // 3D Canvas state
  const canvasRef = useRef<EcosystemCanvasHandle>(null);
  const [selected3dKey, setSelected3dKey] = useState<string>('Moederholding');
  const [selected3dEntity, setSelected3dEntity] = useState<string | null>(null);
  const [mobile3dPanelOpen, setMobile3dPanelOpen] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [cameraPreset, setCameraPreset] = useState<'orbit' | 'topdown' | 'cinematic'>('orbit');
  const [showSubholdingsModal, setShowSubholdingsModal] = useState<boolean>(false);
  const [dockViewMode, setDockViewMode] = useState<'cards' | 'compact'>('cards');
  const [show3dCards, setShow3dCards] = useState<boolean>(true);

  const handleSelectNodeFrom3D = useCallback((key: string, entity?: string | null) => {
    const canonicalKey = archKeyToHoldcoKey[key] || key;
    setSelected3dKey(canonicalKey);
    setSelected3dEntity(entity || null);
    setMobile3dPanelOpen(true);
    if (holdcoKeyToArchKey[canonicalKey]) {
      setSelectedArchNode(holdcoKeyToArchKey[canonicalKey]);
    }
  }, []);

  const activeSubholdingNode = subholdingMatrix[selectedArchNode] || subholdingMatrix.mother;

  const filteredChapters = chapterList.filter(
    (ch) =>
      ch.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.tag.includes(searchQuery)
  );

  const filteredEntities = allEntitiesList.filter((item) => {
    const matchesCategory =
      entityCategoryFilter === 'all' ||
      item.category === entityCategoryFilter ||
      (entityCategoryFilter === 'compute' && (item.category === 'compute' || item.category === 'media')) ||
      (entityCategoryFilter === 'talent' && (item.category === 'talent' || item.category === 'media'));
    const matchesSearch =
      item.name.toLowerCase().includes(entitySearchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(entitySearchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(entitySearchQuery.toLowerCase()) ||
      item.holdingName.toLowerCase().includes(entitySearchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const filteredSubholdings = subholdingCardsData.filter((sub) => {
    const q = entitySearchQuery.toLowerCase();
    const matchesSearch =
      sub.title.toLowerCase().includes(q) ||
      sub.subTitle.toLowerCase().includes(q) ||
      sub.sector.toLowerCase().includes(q) ||
      sub.desc.toLowerCase().includes(q) ||
      sub.entityNames.some((en) => en.toLowerCase().includes(q));
    const matchesCategory =
      entityCategoryFilter === 'all' ||
      entityCategoryFilter === 'subholdings' ||
      (entityCategoryFilter === 'holding' && sub.id === 'Moederholding') ||
      (entityCategoryFilter === 'tech' && sub.id === 'IP_Tech') ||
      (entityCategoryFilter === 'fintech' && sub.id === 'Fintech') ||
      (entityCategoryFilter === 'talent' && sub.id === 'Talent') ||
      (entityCategoryFilter === 'compute' && sub.id === 'Compute') ||
      (entityCategoryFilter === 'media' && (sub.id === 'Compute' || sub.id === 'Talent')) ||
      (entityCategoryFilter === 'proptech' && sub.id === 'RealEstate');
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      const isFs = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    try {
      const doc = document as any;
      const docEl = document.documentElement as any;
      const isCurrentlyFullscreen = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isCurrentlyFullscreen) {
        if (typeof docEl?.requestFullscreen === 'function') {
          docEl.requestFullscreen().catch(() => {});
          setIsFullscreen(true);
        } else if (typeof docEl?.webkitRequestFullscreen === 'function') {
          docEl.webkitRequestFullscreen();
          setIsFullscreen(true);
        } else if (typeof docEl?.mozRequestFullScreen === 'function') {
          docEl.mozRequestFullScreen();
          setIsFullscreen(true);
        } else if (typeof docEl?.msRequestFullscreen === 'function') {
          docEl.msRequestFullscreen();
          setIsFullscreen(true);
        } else {
          setIsFullscreen((prev) => !prev);
        }
      } else {
        if (typeof doc?.exitFullscreen === 'function') {
          doc.exitFullscreen().catch(() => {});
          setIsFullscreen(false);
        } else if (typeof doc?.webkitExitFullscreen === 'function') {
          doc.webkitExitFullscreen();
          setIsFullscreen(false);
        } else if (typeof doc?.mozCancelFullScreen === 'function') {
          doc.mozCancelFullScreen();
          setIsFullscreen(false);
        } else if (typeof doc?.msExitFullscreen === 'function') {
          doc.msExitFullscreen();
          setIsFullscreen(false);
        } else {
          setIsFullscreen(false);
        }
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  const handleRunSimulation = () => {
    const timestamp = new Date().toLocaleTimeString();
    const newLogs: string[] = [];

    newLogs.push(`[${timestamp}] [INFLOW] New talent entry detected via VVC Hub...`);

    if (talentType === 'expat_it') {
      newLogs.push(
        `[${timestamp}] [SPONTIVA] Triggered TGC cashflow advance for relocation package.`,
        `[${timestamp}] [BOOSTPLUG] Assigned 5x GPU node cluster to Logs.rent account.`,
        `[${timestamp}] [WONINGVRY] Automated LongStay tenancy agreement generated.`
      );
    } else if (talentType === 'gpu_engineer') {
      newLogs.push(
        `[${timestamp}] [BOOSTPLUG] High density GPU cluster initialized with stream point mining.`,
        `[${timestamp}] [XABI WORLD] Clearing account activated for compute rental payouts.`,
        `[${timestamp}] [WONINGVRY] BnB short stay assigned during onboarding phase.`
      );
    } else if (talentType === 'artist_talent') {
      newLogs.push(
        `[${timestamp}] [ZHEAVENZY] Digital artist onboarding en music rights contract registered.`,
        `[${timestamp}] [BOOSTPLUG] Stream point bandwidth allocated for global track release.`,
        `[${timestamp}] [XABI WORLD] Royalty clearing split rails activated.`
      );
    } else {
      newLogs.push(
        `[${timestamp}] [XABI WORLD] B2B API payment split rules activated.`,
        `[${timestamp}] [CRMOS] Automated ATS recruitment pipeline linked with DJOBBA.`,
        `[${timestamp}] [INVESTBOTIQ] All 4 output components active (€ 2.625 per maand yield).`
      );
    }

    setSimLogs((prev) => [...newLogs, ...prev]);
  };

  // Gauss calculation outputs
  const revPerMember = 204750; // 78 cycli * €2.625
  const totalRevenue = calcMembers * revPerMember;
  const valuation = totalRevenue * 4.0;
  const sharePrice = valuation / 10000000;

  // Monthly trajectory for live chart
  const monthlyYield = 2625;
  const trajectoryPoints: number[] = [];
  let cumulativeCycles = 0;
  for (let m = 1; m <= 12; m++) {
    cumulativeCycles += m;
    trajectoryPoints.push(cumulativeCycles * calcMembers * monthlyYield);
  }
  const maxPoint = trajectoryPoints[11] || 1;

  const handleSelectChapter = (chNum: number) => {
    setCurrentChapter(chNum);
    setActiveTab('dossier');
    setMobileMenuOpen(false);
  };

  const handleSelectEntity = (item: EntityItem, targetView: 'architecture' | '3d') => {
    setSelectedArchNode(item.holdingKey);
    const mapped3dKey = archKeyToHoldcoKey[item.holdingKey] || 'Moederholding';
    setSelected3dKey(mapped3dKey);
    setSelected3dEntity(item.name);
    setMobile3dPanelOpen(true);
    setActiveTab(targetView);
    setMobileMenuOpen(false);
  };

  const handleSelectSubholding = (holdcoKey: string, targetView: 'architecture' | '3d' = '3d') => {
    const canonicalHoldcoKey = archKeyToHoldcoKey[holdcoKey] || holdcoKey;
    const archKey = holdcoKeyToArchKey[canonicalHoldcoKey] || 'mother';
    setSelectedArchNode(archKey);
    setSelected3dKey(canonicalHoldcoKey);
    setSelected3dEntity(null);
    setMobile3dPanelOpen(true);
    setActiveTab(targetView);
    setMobileMenuOpen(false);
  };

  const handlePrevChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < 10) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  // Selected entity lookup across ecosystemData
  const selectedEntityData = React.useMemo(() => {
    if (!selected3dEntity) return null;
    const cleanSearch = selected3dEntity.trim().toLowerCase();
    for (const [holdcoKey, node] of Object.entries(ecosystemData)) {
      const found = node.entities.find((e) => {
        const eName = e.name.trim().toLowerCase();
        return eName === cleanSearch || eName.startsWith(cleanSearch) || cleanSearch.startsWith(eName);
      });
      if (found) {
        return {
          entity: found,
          holdcoKey,
          holdcoNode: node
        };
      }
    }
    return null;
  }, [selected3dEntity]);

  useEffect(() => {
    if (selectedEntityData && selectedEntityData.holdcoKey !== selected3dKey) {
      setSelected3dKey(selectedEntityData.holdcoKey);
    }
  }, [selectedEntityData, selected3dKey]);

  // Node details for 3D inspector panel
  const subholdingsList = Object.values(ecosystemData).filter((node) => node.id !== 'Moederholding');
  const current3dNode =
    selectedEntityData?.holdcoNode ||
    ecosystemData[selected3dKey] ||
    ecosystemData[archKeyToHoldcoKey[selected3dKey]] ||
    ecosystemData.Moederholding ||
    Object.values(ecosystemData)[0];

  const navTabs = [
    {
      id: 'architecture' as const,
      label: language === 'en' ? 'Flow Architecture' : 'Flow Architectuur',
      shortLabel: language === 'en' ? 'Architecture' : 'Architectuur',
      description: language === 'en'
        ? '5 Ring-fenced Subholdings & legal capital routing flow'
        : '5 Ring-fenced Subholdings & juridische kapitaalstromen',
      icon: Network,
      badge: language === 'en' ? '5 Hold.' : '5 Hold.',
      badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25',
      activeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20',
      iconColor: 'text-cyan-400'
    },
    {
      id: 'simulator' as const,
      label: language === 'en' ? 'Investbotiq Execution Engine' : 'Investbotiq Executie Engine',
      shortLabel: 'IQ Bot',
      description: language === 'en'
        ? 'Real-time agentic execution engine & high-tech talent broker'
        : 'Real-time autonome executiemotor & high-tech talent broker',
      icon: Bot,
      badge: 'Live',
      pulse: true,
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
      activeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20',
      iconColor: 'text-emerald-400'
    },
    {
      id: 'calculator' as const,
      label: language === 'en' ? 'Gauss Financial Model' : 'Gauss Rekenmodel',
      shortLabel: language === 'en' ? 'Gauss Model' : 'Gauss Model',
      description: language === 'en'
        ? 'Mathematical compound scaling model over 78 strategic cycles'
        : 'Wiskundig samengesteld groeimodel over 78 strategische cycli',
      icon: Calculator,
      badge: language === 'en' ? '78 Cycles' : '78 Cycli',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/25',
      activeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20',
      iconColor: 'text-amber-400'
    },
    {
      id: 'dossier' as const,
      label: language === 'en' ? 'Institutional Dossier' : 'Institutioneel Dossier',
      shortLabel: language === 'en' ? 'Dossier' : 'Dossier',
      description: language === 'en'
        ? '10 Detailed chapters of the official LSE Main Market prospectus'
        : '10 Uitgebreide hoofdstukken van het officiële LSE beursprospectus',
      icon: BookOpen,
      badge: language === 'en' ? '10 Ch.' : '10 Ch.',
      badgeColor: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
      activeClass: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm shadow-indigo-500/20',
      iconColor: 'text-indigo-400'
    },
    {
      id: '3d' as const,
      label: language === 'en' ? 'Visual Ecosystem' : 'Visueel Ecosysteem',
      shortLabel: language === 'en' ? 'Visual' : 'Visueel',
      description: language === 'en'
        ? 'Interactive WebGL 3D spatial orbit visualization'
        : 'Interactieve WebGL 3D ruimtelijke ecosysteem visualisatie',
      icon: Layers,
      badge: 'WebGL',
      badgeColor: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/25',
      activeClass: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40 shadow-sm shadow-yellow-500/20',
      iconColor: 'text-yellow-400'
    },
    ...(currentUser
      ? [
          {
            id: (currentUser.role === 'admin' ? 'admin_dashboard' : 'investor_dashboard') as any,
            label: currentUser.role === 'admin'
              ? (language === 'en' ? 'Executive Dashboard' : 'Admin Dashboard')
              : (language === 'en' ? 'Investor Dashboard' : 'Investor Dashboard'),
            shortLabel: 'Dashboard',
            description: currentUser.role === 'admin'
              ? (language === 'en' ? 'Executive governance, audits & investor control' : 'Bestuurlijk beheer, audits & aandeelhouderscontrole')
              : (language === 'en' ? 'Share wallet, market quote, transfers & integration' : 'Aandelenwallet, koers, transfers & entiteitenintegratie'),
            icon: currentUser.role === 'admin' ? ShieldCheck : TrendingUp,
            badge: currentUser.role === 'admin'
              ? (language === 'en' ? 'Board' : 'Directie')
              : (language === 'en' ? 'Portfolio' : 'Portefeuille'),
            badgeColor:
              currentUser.role === 'admin'
                ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/25'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/25',
            activeClass:
              currentUser.role === 'admin'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20',
            iconColor: currentUser.role === 'admin' ? 'text-cyan-400' : 'text-amber-400'
          }
        ]
      : [])
  ];

  return (
    <div
      className={`min-h-screen flex flex-col antialiased transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-[#fafdff] text-[#133b5c] selection:bg-sky-200 selection:text-sky-900'
          : 'bg-[#05070d] text-slate-100 selection:bg-cyan-500 selection:text-black'
      }`}
    >
      {/* Top Header conform zakelijke pitch esthetiek */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 px-4 lg:px-7 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left Area: Mobile Drawer Trigger / Desktop Sidebar Toggle + Brand */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Mobile Drawer Trigger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-all cursor-pointer"
              title="Open hoofdmenu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Brand Logo & Name */}
            <div
              onClick={() => setActiveTab('architecture')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-yellow-500 to-blue-700 p-0.5 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0 group-hover:shadow-amber-500/40 transition-all overflow-hidden">
                <img
                  src={quantumInitiumLogo}
                  alt="QuantumInitium Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[10px]"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-base lg:text-lg font-extrabold tracking-tight text-white flex items-center gap-1">
                    QuantumInitium <span className="text-xs text-amber-400 font-mono font-bold">Ltd</span>
                  </h1>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                    <Award className="w-3 h-3 mr-1" /> LSE Prospectus
                  </span>
                </div>
                <p className="text-xs text-slate-400 hidden lg:block leading-tight mt-0.5">
                  5 Subholdings • Executiemotor • Gauss Reeks
                </p>
              </div>
            </div>
          </div>

          {/* Right: Auth Buttons & Target Metrics & Toggles & Fullscreen Button */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* NL / EN Taal Toggle Knop */}
            <button
              onClick={toggleLanguage}
              className={`px-2.5 py-1.5 rounded-xl border transition-all flex items-center gap-1.5 cursor-pointer text-xs font-mono font-bold shadow-sm ${
                theme === 'light'
                  ? 'bg-sky-50/90 hover:bg-sky-100 border-sky-200 text-sky-800'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300'
              }`}
              title={language === 'nl' ? 'Switch to English (EN)' : 'Wissel naar Nederlands (NL)'}
            >
              <Globe className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-sky-600' : 'text-cyan-400'}`} />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Licht / Donker Modus Toggle Knop */}
            <button
              onClick={toggleTheme}
              className={`p-2 sm:px-2.5 sm:py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer text-xs shadow-sm border ${
                theme === 'light'
                  ? 'bg-amber-50 hover:bg-amber-100/80 border-amber-200 text-amber-900 shadow-amber-500/10'
                  : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800 hover:border-amber-500/40 text-slate-300 hover:text-amber-300'
              }`}
              title={
                theme === 'dark'
                  ? (language === 'nl' ? 'Schakel over naar lichte modus' : 'Switch to light mode')
                  : (language === 'nl' ? 'Schakel over naar donkere modus' : 'Switch to dark mode')
              }
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span className="hidden xl:inline text-xs font-mono text-slate-300 font-medium">
                    {language === 'nl' ? 'Licht' : 'Light'}
                  </span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-cyan-600" />
                  <span className="hidden xl:inline text-xs font-mono text-sky-800 font-semibold">
                    {language === 'nl' ? 'Donker' : 'Dark'}
                  </span>
                </>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab(currentUser.role === 'admin' ? 'admin_dashboard' : 'investor_dashboard')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'investor_dashboard' || activeTab === 'admin_dashboard'
                      ? theme === 'light'
                        ? 'bg-amber-100 border-amber-300 text-amber-950 shadow-sm shadow-amber-500/10'
                        : 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-sm'
                      : theme === 'light'
                      ? 'bg-white border-sky-200 text-sky-950 hover:bg-sky-50 hover:border-sky-300 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                  title={language === 'en' ? 'To Dashboard' : 'Naar uw Dashboard'}
                >
                  {currentUser.role === 'admin' ? (
                    <ShieldCheck className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`} />
                  ) : (
                    <TrendingUp className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                  )}
                  <span className="hidden sm:inline font-mono">{currentUser.name.split(' ')[0]}</span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    theme === 'light'
                      ? 'bg-sky-100 text-sky-800 font-semibold'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {currentUser.role === 'admin'
                      ? (language === 'en' ? 'Admin' : 'Admin')
                      : (language === 'en' ? 'Investor' : 'Investeerder')}
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    theme === 'light'
                      ? 'bg-white border-sky-200 text-slate-500 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 shadow-sm'
                      : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/30'
                  }`}
                  title={language === 'en' ? 'Log out' : 'Uitloggen'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* LOGIN KNOP VOLGENS OPDRACHT */}
                <button
                  onClick={() => setActiveTab('login')}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? theme === 'light'
                        ? 'bg-amber-100 border-amber-300 text-amber-950 shadow-sm shadow-amber-500/10'
                        : 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-sm shadow-amber-500/20'
                      : theme === 'light'
                      ? 'bg-white border-sky-200 text-sky-950 hover:bg-sky-50 shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                  title={language === 'en' ? 'Sign In' : 'Inloggen'}
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'en' ? 'Sign In' : 'Login'}</span>
                </button>

                {/* REGISTREER KNOP VOLGENS OPDRACHT */}
                <button
                  onClick={() => setActiveTab('register')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-cyan-400 text-slate-950 shadow-md shadow-cyan-400/25'
                      : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-sm shadow-amber-500/20'
                  }`}
                  title={language === 'en' ? 'Register as shareholder' : 'Registreer als aandeelhouder'}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Register' : 'Registreer'}</span>
                </button>
              </div>
            )}

            <div className="text-right hidden xl:block">
              <span className="text-slate-500 block text-[9px] font-mono tracking-wider uppercase">
                {language === 'en' ? 'TARGET IPO' : 'BEOOGDE IPO'}
              </span>
              <span className="text-amber-400 font-mono font-bold text-xs">Medio 2027 • €82M</span>
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={language === 'en' ? 'Toggle Fullscreen' : 'Volledig scherm wisselen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Horizontal Quick Tab Bar (< md) - Alleen zichtbaar op algemene presentatie pagina's */}
        {!['investor_dashboard', 'admin_dashboard', 'login', 'register'].includes(activeTab) && (
          <div className="md:hidden mt-2.5 pt-2 border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-1.5">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 flex items-center gap-1.5 border transition-all cursor-pointer ${
                    isActive
                      ? tab.activeClass
                      : 'text-slate-400 bg-slate-900/60 border-slate-800 hover:text-white'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{tab.shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex overflow-hidden relative">
        {/* Mobile Drawer Overlay */}
        {mobileMenuOpen && (
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 md:hidden"
          />
        )}

        {/* Mobile Slide-Over Drawer Panel */}
        <div
          className={`fixed inset-y-0 left-0 z-50 w-full max-w-xs flex flex-col transition-transform duration-300 md:hidden shadow-2xl ${
            theme === 'light'
              ? 'bg-white border-r border-sky-200 text-sky-950'
              : 'bg-slate-950 border-r border-slate-800 text-slate-100'
          } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* Mobile Drawer Header */}
          <div className={`p-4 border-b flex items-center justify-between ${
            theme === 'light' ? 'bg-sky-50/90 border-sky-200' : 'bg-slate-900/60 border-slate-800'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-400 to-blue-700 p-0.5 flex items-center justify-center shrink-0 overflow-hidden shadow-md">
                <img
                  src={quantumInitiumLogo}
                  alt="QuantumInitium Logo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[7px]"
                />
              </div>
              <div>
                <div className={`font-extrabold text-sm ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>QuantumInitium Ltd</div>
                <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-amber-700 font-semibold' : 'text-amber-400'}`}>LSE Main Market Prospectus</div>
              </div>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className={`p-2 rounded-lg cursor-pointer transition-colors ${
                theme === 'light'
                  ? 'bg-sky-100 text-sky-800 hover:bg-sky-200 hover:text-sky-950'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Drawer Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {/* Quick Preferences: Theme & Language */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleLanguage}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-mono font-bold ${
                  theme === 'light'
                    ? 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-900'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-cyan-300'
                }`}
              >
                <Globe className="w-4 h-4 text-cyan-500" />
                <span>Taal: {language.toUpperCase()}</span>
              </button>
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl border transition-all flex items-center justify-center gap-2 cursor-pointer text-xs font-mono ${
                  theme === 'light'
                    ? 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-900'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-300'
                }`}
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Licht</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-cyan-600" />
                    <span className="font-semibold text-sky-900">Donker</span>
                  </>
                )}
              </button>
            </div>

            {/* Auth Block in Mobile Drawer */}
            <div className={`p-3 rounded-xl border space-y-2 ${
              theme === 'light'
                ? 'bg-sky-50/80 border-sky-200 text-sky-950 shadow-sm'
                : 'bg-slate-900/90 border-slate-800'
            }`}>
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-bold truncate ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>{currentUser.name}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      theme === 'light'
                        ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}>
                      {currentUser.role === 'admin' ? 'Admin' : 'Investeerder'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => {
                        setActiveTab(currentUser.role === 'admin' ? 'admin_dashboard' : 'investor_dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>Dashboard</span>
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer border transition-colors ${
                        theme === 'light'
                          ? 'bg-white hover:bg-rose-50 text-rose-700 border-rose-200 shadow-sm'
                          : 'bg-slate-800 text-rose-300 hover:text-white border-slate-700'
                      }`}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Uitloggen</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setActiveTab('login');
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border cursor-pointer transition-colors ${
                      theme === 'light'
                        ? 'bg-white hover:bg-sky-50 text-sky-950 border-sky-200 shadow-sm'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                    }`}
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-500" />
                    <span>Inloggen</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('register');
                      setMobileMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Registreren</span>
                  </button>
                </div>
              )}
            </div>

            {/* Primary Views */}
            <div className="space-y-2">
              <div className={`text-[11px] font-mono uppercase tracking-wider font-bold px-1 ${
                theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'
              }`}>
                Hoofdweergaves
              </div>
              <div className="space-y-1.5">
                {navTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const IconComponent = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                        isActive
                          ? tab.activeClass
                          : theme === 'light'
                          ? 'bg-white border-sky-200/80 text-sky-950 hover:bg-sky-50 shadow-sm'
                          : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className={`w-4 h-4 ${tab.iconColor}`} />
                        <span>{tab.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${tab.badgeColor}`}>
                        {tab.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chapter Quick Selector */}
            <div className="space-y-2">
              <div className={`text-[11px] font-mono uppercase tracking-wider font-bold px-1 flex items-center justify-between ${
                theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'
              }`}>
                <span>Dossier Hoofdstukken</span>
                <span className={`text-[10px] font-bold ${theme === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`}>10 Ch.</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {chapterList.map((ch) => (
                  <button
                    key={ch.num}
                    onClick={() => handleSelectChapter(ch.num)}
                    className={`p-2 rounded-lg text-left border transition-all cursor-pointer text-xs ${
                      activeTab === 'dossier' && currentChapter === ch.num
                        ? theme === 'light'
                          ? 'bg-cyan-100 border-cyan-300 text-cyan-950 font-bold shadow-sm'
                          : 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                        : theme === 'light'
                        ? 'bg-white border-sky-200 text-sky-900 hover:bg-sky-50'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className={`font-mono text-[10px] font-bold ${theme === 'light' ? 'text-sky-700' : 'text-slate-400'}`}>CH {ch.tag}</div>
                    <div className={`truncate font-medium text-[11px] ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>{ch.title}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile Drawer Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900/80 text-xs text-slate-400">
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> UK Substance Verified
              </span>
              <span className="text-slate-400 font-mono text-[11px]">Medio 2027</span>
            </div>
            <div className="text-[11px] text-slate-400">Beoogde IPO Waardering: € 82.000.000</div>
          </div>
        </div>

        {/* Upgraded Desktop Sidebar Navigation (Open / Collapsed Mode) */}
        {sidebarOpen ? (
          <aside className="hidden md:flex flex-col w-80 bg-slate-950/90 border-r border-slate-800 transition-all duration-300 h-[calc(100vh-61px)] shrink-0 z-30">
            {/* Sidebar Top: Navigator Title & Mode Switcher */}
            <div className="p-3.5 border-b border-slate-800 space-y-3 bg-slate-900/40 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 font-mono uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span>Quantum Navigator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                    LSE v2.4
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors cursor-pointer"
                    title={language === 'en' ? 'Collapse sidebar' : 'Zijpaneel inklappen'}
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mode Tabs: Modules vs Dossier Hoofdstukken vs Entiteiten Index */}
              <div className="grid grid-cols-3 p-1 bg-slate-900/90 rounded-xl border border-slate-800/80 text-xs shadow-inner">
                <button
                  onClick={() => setSidebarView('modules')}
                  className={`py-1.5 px-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    sidebarView === 'modules'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Modules' : 'Modules'}</span>
                </button>
                <button
                  onClick={() => setSidebarView('chapters')}
                  className={`py-1.5 px-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    sidebarView === 'chapters'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Dossier' : 'Dossier'} ({chapterList.length})</span>
                </button>
                <button
                  onClick={() => setSidebarView('entities')}
                  className={`py-1.5 px-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    sidebarView === 'entities'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Entities' : 'Entiteiten'} ({allEntitiesList.length})</span>
                </button>
              </div>
            </div>

            {/* VIEW 0: ECOSYSTEEM HOOFDMENU (VERPLAATST UIT DE HEADER) */}
            {sidebarView === 'modules' && (
              <div className="flex-1 overflow-y-auto p-3.5 space-y-2.5">
                <div className="px-1 pb-1 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {language === 'en' ? 'Ecosystem Modules' : 'Ecosysteem Navigatie'} ({navTabs.length})
                  </span>
                  <span className="text-[10px] font-mono text-cyan-400">QuantumInitium</span>
                </div>

                <div className="space-y-2">
                  {navTabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          if (tab.id === 'dossier') setSidebarView('chapters');
                          if (tab.id === 'architecture') setSidebarView('entities');
                        }}
                        className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3 group ${
                          theme === 'light'
                            ? isActive
                              ? 'bg-sky-50/90 border-sky-400 shadow-md shadow-sky-500/10 ring-1 ring-sky-400/40'
                              : 'bg-white border-sky-100 hover:bg-sky-50/70 hover:border-sky-300'
                            : isActive
                              ? 'bg-slate-900 border-cyan-500/50 shadow-md shadow-cyan-500/10 ring-1 ring-cyan-500/20'
                              : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/80 hover:border-slate-700'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg shrink-0 mt-0.5 transition-colors ${
                            theme === 'light'
                              ? isActive
                                ? 'bg-sky-100 text-sky-700 border border-sky-300'
                                : 'bg-sky-50 text-sky-800 group-hover:bg-sky-100'
                              : isActive
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                                : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                          }`}
                        >
                          <IconComponent className={`w-4 h-4 ${theme === 'light' ? 'text-sky-700' : (isActive ? tab.iconColor : 'text-slate-400')}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className={`font-bold text-xs truncate ${
                              theme === 'light'
                                ? 'text-sky-950 font-semibold'
                                : (isActive ? 'text-white' : 'text-slate-300 group-hover:text-white')
                            }`}>
                              {tab.label}
                            </span>
                            {tab.pulse ? (
                              <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0 ${tab.badgeColor}`}>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                {tab.badge}
                              </span>
                            ) : (
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border shrink-0 ${tab.badgeColor}`}>
                                {tab.badge}
                              </span>
                            )}
                          </div>
                          <p className={`text-[11px] leading-snug line-clamp-2 ${theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'}`}>
                            {tab.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Snelkoppeling naar Investeerders Account */}
                <div className={`pt-3 border-t ${theme === 'light' ? 'border-sky-100' : 'border-slate-800/80'}`}>
                  <div
                    className={`p-3.5 rounded-2xl border transition-all space-y-2.5 ${
                      theme === 'light'
                        ? 'bg-gradient-to-br from-amber-50 via-white to-amber-50/80 border-amber-300/80 shadow-md shadow-amber-500/10'
                        : 'bg-gradient-to-br from-slate-900 via-slate-900 to-amber-950/20 border border-amber-500/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${theme === 'light' ? 'text-amber-800' : 'text-amber-400'}`}>
                        {language === 'en' ? 'Investor Gateway' : 'Investeerders Portaal'}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                          theme === 'light'
                            ? 'bg-amber-100 text-amber-800 border-amber-300 font-semibold'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        }`}
                      >
                        €82M IPO
                      </span>
                    </div>
                    <p className={`text-[11px] leading-tight ${theme === 'light' ? 'text-amber-950/80' : 'text-slate-300'}`}>
                      {language === 'en'
                        ? 'Wallet, stock quotes, shares transfer, account CRUD and 12-Entity integration.'
                        : 'Wallet, koersen, aandelentransfer, account CRUD en verplichte integratie met 12 Entiteiten.'}
                    </p>
                    <button
                      onClick={() => {
                        if (currentUser) {
                          setActiveTab(currentUser.role === 'admin' ? 'admin_dashboard' : 'investor_dashboard');
                        } else {
                          setActiveTab('login');
                        }
                      }}
                      className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-amber-100/90 hover:bg-amber-200/90 text-amber-900 border-amber-300 shadow-sm'
                          : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      <TrendingUp className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`} />
                      <span>
                        {currentUser
                          ? (language === 'en' ? 'Open Dashboard' : 'Open Dashboard')
                          : (language === 'en' ? 'Login as Investor' : 'Inloggen als Investeerder')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW 1: DOSSIER HOOFDSTUKKEN */}
            {sidebarView === 'chapters' && (
              <>
                {/* Search & Reading Progress Bar */}
                <div className="p-3.5 border-b border-slate-800/80 space-y-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Zoek in dossier hoofdstukken..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Reading Status Progress */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>Hoofdstuk 0{currentChapter} van 10</span>
                      <span className="text-cyan-400 font-bold">{currentChapter * 10}% voltooid</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-300"
                        style={{ width: `${currentChapter * 10}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Chapter List */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
                  {filteredChapters.map((ch) => {
                    const isSelected = activeTab === 'dossier' && currentChapter === ch.num;
                    return (
                      <button
                        key={ch.num}
                        onClick={() => handleSelectChapter(ch.num)}
                        className={`toc-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-left transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/15 text-cyan-300 font-semibold border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border-transparent'
                        }`}
                      >
                        <span
                          className={`font-mono text-xs px-2 py-0.5 rounded-md font-bold shrink-0 ${
                            isSelected ? 'bg-cyan-500/25 text-cyan-200' : 'bg-slate-800/90 text-slate-300'
                          }`}
                        >
                          {ch.tag}
                        </span>
                        <div className="truncate flex-1">
                          <div className="font-bold truncate text-white text-xs tracking-tight flex items-center justify-between">
                            <span>{ch.title}</span>
                            {isSelected && (
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{ch.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </>
            )}

            {/* VIEW 2: ENTITEITEN & SUBHOLDINGS DIRECTORY */}
            {sidebarView === 'entities' && (
              <>
                <div className="p-3.5 border-b border-slate-800/80 space-y-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      value={entitySearchQuery}
                      onChange={(e) => setEntitySearchQuery(e.target.value)}
                      placeholder="Zoek op entiteit, tech of rol..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-8 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                    {entitySearchQuery && (
                      <button
                        onClick={() => setEntitySearchQuery('')}
                        className="absolute right-2.5 top-2 text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter Chips */}
                  <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5 text-[10px]">
                    {[
                      { id: 'all', label: 'Alle' },
                      { id: 'subholdings', label: 'Subholdings' },
                      { id: 'holding', label: 'Moeder' },
                      { id: 'tech', label: 'Tech' },
                      { id: 'fintech', label: 'Fintech' },
                      { id: 'talent', label: 'Talent' },
                      { id: 'compute', label: 'Compute' },
                      { id: 'media', label: 'Media' },
                      { id: 'proptech', label: 'PropTech' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setEntityCategoryFilter(cat.id)}
                        className={`px-2 py-0.5 rounded-md font-mono shrink-0 transition-colors cursor-pointer border ${
                          entityCategoryFilter === cat.id
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Entity & Subholding Cards List */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {/* Toon Subholding Kaarten indien filter 'all' of 'subholdings' is */}
                  {(entityCategoryFilter === 'all' || entityCategoryFilter === 'subholdings') && filteredSubholdings.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between px-1">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <LayoutGrid className="w-3 h-3" />
                          <span>Subholding Kaarten ({filteredSubholdings.length})</span>
                        </span>
                        <button
                          onClick={() => {
                            setActiveTab('3d');
                            setShowSubholdingsModal(true);
                            setMobileMenuOpen(false);
                          }}
                          className="text-[10px] text-cyan-400 hover:underline font-mono cursor-pointer"
                        >
                          Matrix
                        </button>
                      </div>

                      {filteredSubholdings.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-400/50 transition-all space-y-2"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${sub.badgeClass}`}>
                                {sub.numberTag}
                              </span>
                              <span className="font-bold text-white text-xs tracking-tight truncate">{sub.title}</span>
                            </div>
                            {renderHoldcoIcon(sub.iconName, `w-3.5 h-3.5 shrink-0 ${sub.textColor}`)}
                          </div>

                          <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                            {sub.desc}
                          </p>

                          <div className="flex flex-wrap gap-1 pt-1">
                            {sub.entityNames.map((eName) => (
                              <span
                                key={eName}
                                className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60"
                              >
                                {eName}
                              </span>
                            ))}
                          </div>

                          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                            <span className="text-emerald-400 font-mono font-semibold text-[10px]">
                              100% Ring Fenced
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleSelectSubholding(sub.id, '3d')}
                                className="px-2 py-0.5 rounded bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 font-mono font-bold transition-colors cursor-pointer"
                                title="Open Subholding Kaart in 3D"
                              >
                                Kaart
                              </button>
                              <button
                                onClick={() => handleSelectSubholding(sub.id, 'architecture')}
                                className="px-2 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 font-mono transition-colors cursor-pointer"
                                title="Bekijk in Flow Architectuur"
                              >
                                Flow
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Werkmaatschappijen Lijst */}
                  {entityCategoryFilter !== 'subholdings' && (
                    <div className="space-y-2">
                      {entityCategoryFilter === 'all' && (
                        <div className="px-1 pt-1">
                          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                            Werkmaatschappijen ({filteredEntities.length})
                          </span>
                        </div>
                      )}
                      {filteredEntities.map((item) => (
                    <div
                      key={item.name}
                      className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-white text-xs tracking-tight">{item.name}</span>
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${item.color}`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                        {item.role}
                      </p>
                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span className="truncate max-w-[140px]">{item.holdingName.split(':')[0]}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleSelectEntity(item, 'architecture')}
                            className="px-1.5 py-0.5 rounded bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 font-mono transition-colors cursor-pointer"
                            title="Bekijk in Flow Architectuur"
                          >
                            Flow
                          </button>
                          <button
                            onClick={() => handleSelectEntity(item, '3d')}
                            className="px-1.5 py-0.5 rounded bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-300 border border-yellow-500/20 font-mono transition-colors cursor-pointer"
                            title="Bekijk in 3D Ecosysteem"
                          >
                            3D
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Sidebar Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-900/60 text-xs text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> UK Substance
              </span>
              <span className="font-mono text-slate-400 text-[11px]">LSE Beursrijp</span>
            </div>
          </aside>
        ) : (
          /* Slim Collapsed Rail (Desktop) */
          <aside className="hidden md:flex flex-col w-14 border-r border-slate-800 bg-slate-950/90 py-3 items-center justify-between shrink-0 h-[calc(100vh-61px)] z-30">
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40 transition-colors cursor-pointer"
                title="Zijpaneel uitklappen"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>

              <div className="w-6 h-[1px] bg-slate-800 my-1" />

              {/* Module Icons in Slim Rail */}
              {navTabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer relative group ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={tab.label}
                  >
                    <IconComponent className="w-4 h-4" />
                    {isActive && (
                      <span className="absolute -right-1 top-1 w-2 h-2 rounded-full bg-cyan-400"></span>
                    )}
                  </button>
                );
              })}

              <div className="w-6 h-[1px] bg-slate-800 my-1" />

              <button
                onClick={() => {
                  setSidebarView('chapters');
                  setSidebarOpen(true);
                }}
                className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-cyan-400 hover:bg-slate-800 transition-colors cursor-pointer font-mono text-xs font-bold"
                title={`Huidig hoofdstuk: 0${currentChapter}`}
              >
                0{currentChapter}
              </button>

              <button
                onClick={() => {
                  setSidebarView('entities');
                  setSidebarOpen(true);
                }}
                className="p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-amber-400 hover:bg-slate-800 transition-colors cursor-pointer"
                title="Entiteiten & Subholdings"
              >
                <Building2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="UK Substance Verified"></span>
            </div>
          </aside>
        )}

        {/* Main Workspace Body */}
        <main className="flex-1 flex flex-col h-[calc(100vh-61px)] overflow-hidden bg-slate-950/40 relative">
          {/* TAB 1: VISUAL FLOW ARCHITECTURE MAP */}
          {activeTab === 'architecture' && (
            <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-8">
              <div className="glass-panel p-7 rounded-2xl border border-yellow-500/30 gold-glow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-yellow-400 font-mono text-xs font-bold uppercase tracking-widest">
                    <Network className="w-4 h-4" /> Strategische Architectuur
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    Vijf Gespecialiseerde Subholdings & Firewalling
                  </h2>
                  <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                    Geconsolideerde holdingstructuur rondom <strong>QuantumInitium Ltd (Moederholding)</strong>. Strikte juridische entiteitsscheiding (firewalling) elimineert kruisbesmetting van passiva tussen sectoren.
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/90 p-4 rounded-xl border border-slate-800 text-xs shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-mono tracking-wider">RISICO ISOLATIE</span>
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
                      <ShieldCheck className="w-4 h-4" /> 100% Gefirewalled
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Network Diagram Container */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-cyan-400" /> Interactief Entiteiten Netwerk
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] font-mono">
                    <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                      Moederholding
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                      5 Subholdings
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                      12 Werkmaatschappijen
                    </span>
                  </div>
                </div>

                {/* Flow Diagram Grid */}
                <div className="relative bg-slate-950/90 rounded-2xl p-6 border border-slate-800/80 overflow-hidden">
                  {/* Top Motherholding Cube */}
                  <div className="flex justify-center mb-8 relative z-10">
                    <div
                      onClick={() => setSelectedArchNode('mother')}
                      className={`p-5 rounded-2xl border-2 shadow-xl gold-glow text-center max-w-sm w-full cursor-pointer transform hover:scale-105 transition-all ${
                        theme === 'light'
                          ? selectedArchNode === 'mother'
                            ? 'bg-gradient-to-br from-amber-100 via-yellow-50 to-white border-amber-400 ring-2 ring-amber-400/50 shadow-amber-500/15'
                            : 'bg-gradient-to-br from-amber-50 via-yellow-50/60 to-white border-amber-300/80 shadow-amber-500/10'
                          : selectedArchNode === 'mother'
                            ? 'bg-gradient-to-br from-yellow-500/40 via-amber-600/30 to-slate-900 border-yellow-400 ring-2 ring-yellow-400/40'
                            : 'bg-gradient-to-br from-yellow-500/30 via-amber-600/20 to-slate-900 border-yellow-500/60'
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2.5">
                        <div
                          className={`w-12 h-12 rounded-xl p-1 shadow-lg flex items-center justify-center overflow-hidden border ${
                            theme === 'light'
                              ? 'bg-white border-amber-300 shadow-amber-500/10'
                              : 'bg-slate-950 border-amber-400/40'
                          }`}
                        >
                          <img
                            src={quantumInitiumLogo}
                            alt="QuantumInitium Emblem"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      </div>
                      <div
                        className={`text-[10px] font-mono uppercase font-bold tracking-widest mb-1 flex items-center justify-center gap-1 ${
                          theme === 'light' ? 'text-amber-800' : 'text-yellow-400'
                        }`}
                      >
                        <Crown className="w-3.5 h-3.5" /> Centrale Holding (Londen)
                      </div>
                      <div className={`text-lg font-black ${theme === 'light' ? 'text-amber-950' : 'text-white'}`}>
                        QuantumInitium Ltd
                      </div>
                      <p className={`text-[11px] mt-1 ${theme === 'light' ? 'text-amber-900/80' : 'text-slate-300'}`}>
                        Overkoepelende kapitaalallocatie, IP beheer, M&A en LSE governance
                      </p>
                    </div>
                  </div>

                  {/* Connecting SVG Data Cables */}
                  <svg className="w-full h-12 mb-2 hidden md:block" viewBox="0 0 1000 50" fill="none" preserveAspectRatio="none">
                    <path d="M 500 0 L 500 20 L 100 20 L 100 50" stroke="#06b6d4" strokeWidth="2" className="flow-line" />
                    <path d="M 500 0 L 500 20 L 300 20 L 300 50" stroke="#06b6d4" strokeWidth="2" className="flow-line" />
                    <path d="M 500 0 L 500 50" stroke="#facc15" strokeWidth="2" className="flow-line" />
                    <path d="M 500 0 L 500 20 L 700 20 L 700 50" stroke="#10b981" strokeWidth="2" className="flow-line" />
                    <path d="M 500 0 L 500 20 L 900 20 L 900 50" stroke="#6366f1" strokeWidth="2" className="flow-line" />
                  </svg>

                  {/* 5 Subholding Cubes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
                    {/* Subholding 1: IP & Tech */}
                    <div
                      onClick={() => setSelectedArchNode('sub1')}
                      className={`glass-card p-4 rounded-xl border-t-4 border-t-cyan-500 space-y-2 cursor-pointer transition-all ${
                        theme === 'light'
                          ? selectedArchNode === 'sub1'
                            ? 'bg-gradient-to-b from-cyan-50/90 via-white to-sky-50/60 border-cyan-400 ring-2 ring-cyan-400/40 shadow-lg shadow-cyan-500/10'
                            : 'bg-white hover:bg-cyan-50/40 border-sky-100 hover:border-cyan-300 shadow-sm'
                          : selectedArchNode === 'sub1'
                            ? 'bg-slate-900 border-cyan-400 ring-2 ring-cyan-500/30'
                            : 'hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-cyan-400">
                        <span>SUB 01</span>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <h4 className={`font-bold text-sm ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>IP & Tech</h4>
                      <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-cyan-700 font-semibold' : 'text-cyan-300'}`}>CRMos Ltd • Investbotiq Ltd</div>
                      <p className={`text-[11px] ${theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'}`}>
                        Centraal beheer van AI modellen, softwarepatenten en B2B SaaS engines.
                      </p>
                    </div>

                    {/* Subholding 2: Fintech & Liquidity */}
                    <div
                      onClick={() => setSelectedArchNode('sub2')}
                      className={`glass-card p-4 rounded-xl border-t-4 border-t-blue-500 space-y-2 cursor-pointer transition-all ${
                        theme === 'light'
                          ? selectedArchNode === 'sub2'
                            ? 'bg-gradient-to-b from-blue-50/90 via-white to-sky-50/60 border-blue-400 ring-2 ring-blue-400/40 shadow-lg shadow-blue-500/10'
                            : 'bg-white hover:bg-blue-50/40 border-sky-100 hover:border-blue-300 shadow-sm'
                          : selectedArchNode === 'sub2'
                            ? 'bg-slate-900 border-blue-400 ring-2 ring-blue-500/30'
                            : 'hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-blue-400">
                        <span>SUB 02</span>
                        <Wallet className="w-4 h-4" />
                      </div>
                      <h4 className={`font-bold text-sm ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>Fintech & Liquidity</h4>
                      <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-blue-700 font-semibold' : 'text-blue-300'}`}>Xabi World Ltd</div>
                      <p className={`text-[11px] ${theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'}`}>
                        Clearing infrastructuur, liquiditeitsretentie en B2B API licenties.
                      </p>
                    </div>

                    {/* Subholding 3: Talent & Gateway */}
                    <div
                      onClick={() => setSelectedArchNode('sub3')}
                      className={`glass-card p-4 rounded-xl border-t-4 border-t-yellow-400 space-y-2 cursor-pointer transition-all ${
                        theme === 'light'
                          ? selectedArchNode === 'sub3'
                            ? 'bg-gradient-to-b from-amber-50/90 via-white to-yellow-50/60 border-amber-400 ring-2 ring-amber-400/40 shadow-lg shadow-amber-500/10'
                            : 'bg-white hover:bg-amber-50/40 border-sky-100 hover:border-amber-300 shadow-sm'
                          : selectedArchNode === 'sub3'
                            ? 'bg-slate-900 border-yellow-400 ring-2 ring-yellow-500/30'
                            : 'hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-yellow-400">
                        <span>SUB 03</span>
                        <Users className="w-4 h-4" />
                      </div>
                      <h4 className={`font-bold text-sm ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>Talent & Gateway</h4>
                      <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-amber-800 font-semibold' : 'text-yellow-300'}`}>VVC • DJOBBA • Immigratiepunt • Zheavenzy</div>
                      <p className={`text-[11px] ${theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'}`}>
                        Community onboarding, resourcing, IT recruitment marketplace en artiestentalent portaal.
                      </p>
                    </div>

                    {/* Subholding 4: Compute & Media */}
                    <div
                      onClick={() => setSelectedArchNode('sub4')}
                      className={`glass-card p-4 rounded-xl border-t-4 border-t-emerald-500 space-y-2 cursor-pointer transition-all ${
                        theme === 'light'
                          ? selectedArchNode === 'sub4'
                            ? 'bg-gradient-to-b from-emerald-50/90 via-white to-teal-50/60 border-emerald-400 ring-2 ring-emerald-400/40 shadow-lg shadow-emerald-500/10'
                            : 'bg-white hover:bg-emerald-50/40 border-sky-100 hover:border-emerald-300 shadow-sm'
                          : selectedArchNode === 'sub4'
                            ? 'bg-slate-900 border-emerald-400 ring-2 ring-emerald-500/30'
                            : 'hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-emerald-400">
                        <span>SUB 04</span>
                        <Server className="w-4 h-4" />
                      </div>
                      <h4 className={`font-bold text-sm ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>Compute & Media</h4>
                      <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-emerald-700 font-semibold' : 'text-emerald-300'}`}>Boostplug • Logs.rent • Spontiva</div>
                      <p className={`text-[11px] ${theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'}`}>
                        GPU rekenkracht, account supply en fintech kasstroommotor.
                      </p>
                    </div>

                    {/* Subholding 5: Real Estate & Ops */}
                    <div
                      onClick={() => setSelectedArchNode('sub5')}
                      className={`glass-card p-4 rounded-xl border-t-4 border-t-indigo-500 space-y-2 cursor-pointer transition-all ${
                        theme === 'light'
                          ? selectedArchNode === 'sub5'
                            ? 'bg-gradient-to-b from-indigo-50/90 via-white to-blue-50/60 border-indigo-400 ring-2 ring-indigo-400/40 shadow-lg shadow-indigo-500/10'
                            : 'bg-white hover:bg-indigo-50/40 border-sky-100 hover:border-indigo-300 shadow-sm'
                          : selectedArchNode === 'sub5'
                            ? 'bg-slate-900 border-indigo-400 ring-2 ring-indigo-500/30'
                            : 'hover:bg-slate-900/90'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono font-bold text-indigo-400">
                        <span>SUB 05</span>
                        <Home className="w-4 h-4" />
                      </div>
                      <h4 className={`font-bold text-sm ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>Real Estate & Ops</h4>
                      <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-indigo-700 font-semibold' : 'text-indigo-300'}`}>WoningVry • Afterstudenthousing</div>
                      <p className={`text-[11px] ${theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'}`}>
                        PropTech automatisering, short stay BnB en young professional huisvesting.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Node Inspector Details Panel */}
              <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30">
                <div className={`flex items-center justify-between border-b pb-4 mb-4 ${theme === 'light' ? 'border-sky-100' : 'border-slate-800'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${theme === 'light' ? 'bg-sky-100 text-sky-700' : 'bg-cyan-500/20 text-cyan-400'}`}>
                      <Info className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`text-base font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>{activeSubholdingNode.title}</h4>
                      <p className={`text-xs font-mono ${theme === 'light' ? 'text-sky-700' : 'text-cyan-400'}`}>{activeSubholdingNode.subtitle}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                    theme === 'light' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}>
                    {activeSubholdingNode.badge}
                  </span>
                </div>
                <p className={`text-xs leading-relaxed ${theme === 'light' ? 'text-sky-900/80' : 'text-slate-300'}`}>{activeSubholdingNode.desc}</p>
                <div className={`mt-4 pt-4 border-t ${theme === 'light' ? 'border-sky-100' : 'border-slate-800'}`}>
                  <h5 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'light' ? 'text-sky-900/60' : 'text-slate-400'}`}>
                    Subholding Entiteiten & Strikte Risico Isolatie (Firewall)
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {activeSubholdingNode.entities.map((e, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border space-y-1 transition-all ${
                          theme === 'light'
                            ? 'bg-white border-sky-100 shadow-sm hover:border-sky-300'
                            : 'bg-slate-900/90 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`font-bold text-xs ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>{e.name}</span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            theme === 'light'
                              ? 'bg-sky-100 text-sky-800 border border-sky-200'
                              : 'bg-cyan-500/20 text-cyan-300'
                          }`}>
                            {e.type}
                          </span>
                        </div>
                        <p className={`text-[11px] ${theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'}`}>{e.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INVESTBOTIQ AI ENGINE SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-8">
              <div className="glass-panel p-7 rounded-2xl border border-cyan-500/30 cyan-glow space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-widest">
                  <Cpu className="w-4 h-4" /> De Algoritmische Executiemotor
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  Investbotiq Ltd (IQ Bot & Agent) Workflow
                </h2>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Zodra talentstromen door de VVC Hub zijn geautoriseerd, neemt de IQ Bot & Agent autonoom de regie over. Kapitaal triggers en opdrachten worden direct gedistribueerd over Fintech, Compute en Vastgoed.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Control Panel & Input */}
                <div className="glass-card p-7 rounded-2xl space-y-5">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
                    <PlayCircle className="w-4 h-4 text-emerald-400" /> Simuleer Talent Activatie
                  </h3>
                  <div className="space-y-3.5">
                    <label className="text-xs font-bold text-slate-300">Selecteer Inkomende Talentstroom:</label>
                    <select
                      value={talentType}
                      onChange={(e) => setTalentType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="expat_it">Internationale IT Expat (Senior Fullstack)</option>
                      <option value="gpu_engineer">AI & Compute Infrastructure Specialist</option>
                      <option value="fintech_dev">Fintech API & Clearing Specialist</option>
                      <option value="artist_talent">Creatief Muziektalent & Artiest (Zheavenzy Ltd)</option>
                    </select>
                    <button
                      onClick={handleRunSimulation}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
                    >
                      <Zap className="w-4 h-4" /> Trigger IQ Bot Executie Sequence
                    </button>
                  </div>

                  {/* Status Monitor */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">IQ Bot Status:</span>
                      <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ACTIEF / AUTONOOM
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 leading-normal">
                      Latency: <span className="text-cyan-400">12ms</span> • Verification Gate:{' '}
                      <span className="text-emerald-400">PASSED</span>
                    </div>
                  </div>
                </div>

                {/* Visual Execution Flow Outputs */}
                <div className="lg:col-span-2 glass-card p-7 rounded-2xl space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
                      <Network className="w-4 h-4 text-amber-400" /> Autonoom Verdeelde Executie Sporen
                    </h3>
                    <span className="text-xs font-mono text-amber-400 font-bold">€ 2.625 Output / mnd</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Spoor 1: Fintech */}
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-amber-400 font-bold tracking-wider">1. FINTECH</span>
                        <Wallet className="w-4 h-4 text-amber-400" />
                      </div>
                      <h4 className="font-bold text-white text-xs tracking-tight">Spontiva Ltd</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Activeert kasstromen en TGC structuren; levert directe financiering aan clearing (Xabi World Ltd) en recruitment (DJOBBA Ltd).
                      </p>
                      <div className="pt-2 border-t border-slate-800 text-xs font-mono text-amber-300 font-bold">
                        Working Capital Executie
                      </div>
                    </div>

                    {/* Spoor 2: Compute */}
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">2. COMPUTE</span>
                        <Cpu className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h4 className="font-bold text-white text-xs tracking-tight">Boostplug Ltd</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Initieert 5 GPU nodes rekenkracht; gegenereerde capaciteit voedt exclusief accountmarktplaats Logs.rent.
                      </p>
                      <div className="pt-2 border-t border-slate-800 text-xs font-mono text-cyan-300 font-bold">
                        € 1.500 / mnd (GPU + Stream)
                      </div>
                    </div>

                    {/* Spoor 3: Vastgoed */}
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold tracking-wider">3. VASTGOED</span>
                        <Home className="w-4 h-4 text-emerald-400" />
                      </div>
                      <h4 className="font-bold text-white text-xs tracking-tight">WoningVry Ltd</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Start geautomatiseerde workflows voor bezetting van huurwoningen, met doorstroom naar Afterstudenthousing Ltd.
                      </p>
                      <div className="pt-2 border-t border-slate-800 text-xs font-mono text-emerald-300 font-bold">
                        € 1.125 / mnd (LongStay + BnB)
                      </div>
                    </div>
                  </div>

                  {/* Executie Log Box */}
                  <div className="mt-4 p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">
                      Autonome Logging Console (Realtime)
                    </div>
                    <div className="text-slate-300 space-y-1.5 h-36 overflow-y-auto pr-2 leading-relaxed">
                      {simLogs.map((log, idx) => (
                        <div
                          key={idx}
                          className={
                            log.includes('[SYSTEM READY]')
                              ? 'text-emerald-400'
                              : log.includes('[GATEWAY]')
                              ? 'text-cyan-400'
                              : log.includes('[SPONTIVA]')
                              ? 'text-amber-400'
                              : log.includes('[BOOSTPLUG]')
                              ? 'text-cyan-300'
                              : log.includes('[WONINGVRY]')
                              ? 'text-emerald-300'
                              : 'text-slate-300'
                          }
                        >
                          {log}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GAUSS CALCULATOR & FINANCIAL ENGINE */}
          {activeTab === 'calculator' && (
            <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-8">
              <div className="glass-panel p-7 rounded-2xl border border-amber-500/30 gold-glow space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
                  <Calculator className="w-4 h-4" /> Wiskundige Cumulatie
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">De Reeks van Gauss Simulator</h2>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Formule: <span className="font-mono text-amber-400 font-bold">n × (n + 1) / 2</span>. Over 12 maanden genereert één actief lid <strong>78 cumulatieve maandcycli</strong> (12 × 13 / 2 = 78), wat neerkomt op exact <strong>€ 204.750 jaaromzet per lid</strong>.
                </p>
              </div>

              {/* 4 Component Breakdown Cards conform bijlage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-xl border-l-4 border-l-cyan-500 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">COMPUTE (GPU)</span>
                  <div className="font-bold text-white text-sm">Boostplug Mining</div>
                  <div className="text-2xl font-black text-cyan-400 font-mono">€ 1.000 / mnd</div>
                  <p className="text-xs text-slate-400 leading-normal">Inzet van 5 GPU nodes voor AI inferentie.</p>
                </div>

                <div className="glass-card p-5 rounded-xl border-l-4 border-l-emerald-500 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">COMPUTE (STREAM)</span>
                  <div className="font-bold text-white text-sm">Boostplug Stream Point</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono">€ 500 / mnd</div>
                  <p className="text-xs text-slate-400 leading-normal">Datastroom & bandbreedte monetarisering.</p>
                </div>

                <div className="glass-card p-5 rounded-xl border-l-4 border-l-amber-500 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">VASTGOED (LONG)</span>
                  <div className="font-bold text-white text-sm">WoningVry LongStay</div>
                  <div className="text-2xl font-black text-amber-400 font-mono">€ 750 / mnd</div>
                  <p className="text-xs text-slate-400 leading-normal">Structurele huisvesting IT professionals.</p>
                </div>

                <div className="glass-card p-5 rounded-xl border-l-4 border-l-yellow-400 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-yellow-400 font-bold tracking-wider">VASTGOED (SHORT)</span>
                  <div className="font-bold text-white text-sm">WoningVry BnB</div>
                  <div className="text-2xl font-black text-yellow-400 font-mono">€ 375 / mnd</div>
                  <p className="text-xs text-slate-400 leading-normal">Short stay dynamische dagtarieven.</p>
                </div>
              </div>

              {/* Controls & Live Trajectory Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="glass-card p-7 rounded-2xl space-y-6">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
                    <Sliders className="w-4 h-4 text-cyan-400" /> Parameters Instellen
                  </h3>
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-center text-xs">
                      <label className="font-bold text-slate-300">Aantal Actieve Leden:</label>
                      <span className="text-lg font-black text-cyan-400 font-mono">
                        {calcMembers.toLocaleString('nl-NL')} Leden
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10000"
                      value={calcMembers}
                      onChange={(e) => setCalcMembers(parseInt(e.target.value, 10))}
                      className="w-full"
                    />
                  </div>

                  {/* Presets */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Strategische Mijlpalen:</span>
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => setCalcMembers(100)}
                        className="px-3.5 py-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold text-left border border-cyan-500/30 flex justify-between cursor-pointer"
                      >
                        <span>Jaar 1 (Beursbasis Target):</span>
                        <span>100 Leden</span>
                      </button>
                      <button
                        onClick={() => setCalcMembers(6000)}
                        className="px-3.5 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold text-left border border-emerald-500/30 flex justify-between cursor-pointer"
                      >
                        <span>Jaar 2 (Europese Schaal):</span>
                        <span>6.000 Leden</span>
                      </button>
                      <button
                        onClick={() => setCalcMembers(9150)}
                        className="px-3.5 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono font-bold text-left border border-amber-500/30 flex justify-between cursor-pointer"
                      >
                        <span>Jaar 3 (Max Capaciteit):</span>
                        <span>9.150 Leden</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5 font-mono">
                    <div className="text-slate-400">
                      P/S Valuation Multiple: <span className="text-amber-400 font-bold">4,0x</span>
                    </div>
                    <div className="text-slate-400">
                      Totaal Aandelen: <span className="text-white font-bold">10.000.000</span>
                    </div>
                  </div>
                </div>

                {/* Calculated Outputs & Chart */}
                <div className="lg:col-span-2 glass-card p-7 rounded-2xl space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">GECONSOLIDEERDE OMZET</span>
                      <div className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono mt-1 tracking-tight">
                        € {totalRevenue.toLocaleString('nl-NL')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Jaarbasis via Gauss</div>
                    </div>
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">BEOOGDE WAARDERING (4.0x)</span>
                      <div className="text-2xl lg:text-3xl font-black text-amber-400 font-mono mt-1 tracking-tight">
                        € {valuation.toLocaleString('nl-NL')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Marktkapitalisatie op LSE</div>
                    </div>
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">KOERS PER AANDEEL</span>
                      <div className="text-2xl lg:text-3xl font-black text-cyan-400 font-mono mt-1 tracking-tight">
                        € {sharePrice.toFixed(2).replace('.', ',')}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Introductiekoers IPO</div>
                    </div>
                  </div>

                  {/* Revenue Trajectory Chart */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300">
                      Cumulatieve Maandelijkse Omzetopbouw over 12 Maanden
                    </h4>
                    <div className="h-56 w-full relative pt-4">
                      {/* Responsive SVG Line Chart */}
                      <svg className="w-full h-full" viewBox="0 0 600 200" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>

                        {/* Horizontal Grid lines */}
                        <line x1="40" y1="20" x2="590" y2="20" stroke="rgba(255,255,255,0.06)" />
                        <line x1="40" y1="65" x2="590" y2="65" stroke="rgba(255,255,255,0.06)" />
                        <line x1="40" y1="110" x2="590" y2="110" stroke="rgba(255,255,255,0.06)" />
                        <line x1="40" y1="155" x2="590" y2="155" stroke="rgba(255,255,255,0.06)" />

                        {/* Area Polygon */}
                        <polygon
                          fill="url(#chartGrad)"
                          points={`40,165 ${trajectoryPoints
                            .map((val, idx) => {
                              const x = 40 + (idx * (550 / 11));
                              const y = 165 - (val / maxPoint) * 145;
                              return `${x},${y}`;
                            })
                            .join(' ')} 590,165`}
                        />

                        {/* Polyline Path */}
                        <polyline
                          fill="none"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                          points={trajectoryPoints
                            .map((val, idx) => {
                              const x = 40 + (idx * (550 / 11));
                              const y = 165 - (val / maxPoint) * 145;
                              return `${x},${y}`;
                            })
                            .join(' ')}
                        />

                        {/* Data dots */}
                        {trajectoryPoints.map((val, idx) => {
                          const x = 40 + (idx * (550 / 11));
                          const y = 165 - (val / maxPoint) * 145;
                          return (
                            <circle
                              key={idx}
                              cx={x}
                              cy={y}
                              r={idx === 11 ? '5' : '3'}
                              fill={idx === 11 ? '#facc15' : '#06b6d4'}
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                          );
                        })}

                        {/* Month labels */}
                        {['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11', 'M12'].map((m, idx) => (
                          <text
                            key={idx}
                            x={40 + idx * (550 / 11)}
                            y="185"
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="10"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {m}
                          </text>
                        ))}
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: FULL EXECUTIVE CHAPTER DOSSIER READER */}
          {activeTab === 'dossier' && (
            <div className="flex-1 overflow-y-auto scroll-smooth">
              <DossierReader currentChapter={currentChapter} />
            </div>
          )}

          {/* TAB 5: 3D ECOSYSTEEM (BEHOUDEN VOLGENS OPDRACHT) */}
          {activeTab === '3d' && (
            <div className="flex-1 relative w-full h-full overflow-hidden">
              <EcosystemCanvas
                ref={canvasRef}
                selectedNodeKey={selected3dKey}
                selectedLtdName={selected3dEntity}
                onSelectNode={handleSelectNodeFrom3D}
                autoRotate={autoRotate}
                theme={theme}
              />

              {/* Zwevende Ecosysteem Titelkaart linksboven */}
              <div className="header-card">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
                  <span className={`text-[11px] font-mono uppercase tracking-widest font-bold ${theme === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`}>
                    3D Holografische Ruimte
                  </span>
                </div>
                <h1 className={`text-xl font-extrabold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>QuantumInitium Ltd</h1>
                <p className={`text-xs ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-300'}`}>
                  Vijf Subholdings • 12 Werkmaatschappijen • Volledig Geïsoleerde Brandmuren
                </p>

                {selectedEntityData && (
                  <div className={`mt-2.5 pt-2.5 border-t flex items-center justify-between gap-3 ${theme === 'light' ? 'border-sky-100' : 'border-slate-800/80'}`}>
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
                      <span className={`text-xs truncate ${theme === 'light' ? 'text-sky-900' : 'text-slate-300'}`}>
                        Geselecteerd: <strong className={theme === 'light' ? 'text-amber-800 font-bold' : 'text-amber-300'}>{selectedEntityData.entity.name}</strong>
                      </span>
                    </div>
                    <button
                      onClick={() => setSelected3dEntity(null)}
                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors shrink-0 cursor-pointer ${
                        theme === 'light'
                          ? 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 hover:border-sky-300'
                          : 'text-slate-400 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      Reset
                    </button>
                  </div>
                )}

                {/* 3D Camera Controls Toolbar */}
                <div className={`flex items-center gap-1.5 mt-3 pt-3 border-t ${theme === 'light' ? 'border-sky-100' : 'border-slate-800/80'}`}>
                  <button
                    onClick={() => canvasRef.current?.resetView()}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-sky-50 text-sky-800 hover:text-sky-950 hover:bg-sky-100 border border-sky-200 shadow-sm'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Herstel weergave"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => canvasRef.current?.zoomIn()}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-sky-50 text-sky-800 hover:text-sky-950 hover:bg-sky-100 border border-sky-200 shadow-sm'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Zoom in"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => canvasRef.current?.zoomOut()}
                    className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                      theme === 'light'
                        ? 'bg-sky-50 text-sky-800 hover:text-sky-950 hover:bg-sky-100 border border-sky-200 shadow-sm'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                    title="Zoom uit"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setAutoRotate((prev) => !prev)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                      autoRotate
                        ? theme === 'light'
                          ? 'bg-cyan-100 text-cyan-900 border border-cyan-400 shadow-sm'
                          : 'bg-cyan-500/30 text-cyan-300 border border-cyan-400/50 shadow-sm shadow-cyan-500/20'
                        : theme === 'light'
                        ? 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 shadow-sm'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                    title={autoRotate ? 'Stop autorotatie' : 'Start autorotatie'}
                    aria-label={autoRotate ? 'Stop autorotatie' : 'Start autorotatie'}
                  >
                    <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => setShow3dCards((prev) => !prev)}
                    className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                      !show3dCards
                        ? theme === 'light'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-sm shadow-amber-500/20'
                        : theme === 'light'
                        ? 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200 shadow-sm'
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800'
                    }`}
                    title={show3dCards ? 'Verberg alle kaarten' : 'Toon alle kaarten'}
                    aria-label={show3dCards ? 'Verberg alle kaarten' : 'Toon alle kaarten'}
                  >
                    {show3dCards ? (
                      <Eye className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-sky-700' : 'text-cyan-300'}`} />
                    ) : (
                      <EyeOff className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'}`} />
                    )}
                  </button>

                  <div className={`h-4 w-px mx-1 ${theme === 'light' ? 'bg-sky-200' : 'bg-slate-800'}`} />

                  <button
                    onClick={() => {
                      canvasRef.current?.setCameraPreset('orbit');
                      setCameraPreset('orbit');
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      cameraPreset === 'orbit'
                        ? theme === 'light'
                          ? 'bg-cyan-100 text-cyan-900 border border-cyan-400 shadow-sm'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : theme === 'light'
                        ? 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    Orbit
                  </button>
                  <button
                    onClick={() => {
                      canvasRef.current?.setCameraPreset('topdown');
                      setCameraPreset('topdown');
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      cameraPreset === 'topdown'
                        ? theme === 'light'
                          ? 'bg-cyan-100 text-cyan-900 border border-cyan-400 shadow-sm'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : theme === 'light'
                        ? 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    Topdown
                  </button>
                  <button
                    onClick={() => {
                      canvasRef.current?.setCameraPreset('cinematic');
                      setCameraPreset('cinematic');
                    }}
                    className={`px-2 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      cameraPreset === 'cinematic'
                        ? theme === 'light'
                          ? 'bg-cyan-100 text-cyan-900 border border-cyan-400 shadow-sm'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : theme === 'light'
                        ? 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200'
                        : 'bg-slate-900/80 text-slate-400 hover:text-white'
                    }`}
                  >
                    Cinematic
                  </button>

                  <div className={`h-4 w-px mx-1 ${theme === 'light' ? 'bg-sky-200' : 'bg-slate-800'}`} />

                  <button
                    onClick={() => setShowSubholdingsModal(true)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'bg-amber-100/90 hover:bg-amber-100 text-amber-900 border border-amber-300 shadow-sm'
                        : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 shadow-sm shadow-amber-500/10'
                    }`}
                    title="Subholding Kaarten Overzicht"
                  >
                    <LayoutGrid className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-amber-800' : 'text-amber-400'}`} />
                    <span>Subholding Kaarten</span>
                  </button>
                </div>
              </div>

              {/* Mobiele knop om de informatiekaart te openen */}
              {show3dCards && !mobile3dPanelOpen && (
                <button
                  onClick={() => setMobile3dPanelOpen(true)}
                  className={`md:hidden absolute top-20 right-4 z-30 px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer backdrop-blur-md ${
                    theme === 'light'
                      ? 'bg-white/95 border border-amber-300 text-amber-900 shadow-lg'
                      : 'bg-slate-900/95 border border-amber-400/40 text-amber-300 shadow-2xl'
                  }`}
                >
                  <Info className={`w-4 h-4 ${theme === 'light' ? 'text-sky-700' : 'text-cyan-400'}`} />
                  <span className="truncate max-w-[140px]">
                    {selectedEntityData ? selectedEntityData.entity.name : (selected3dKey ? `${selected3dKey} Kaart` : 'Informatiekaart')}
                  </span>
                </button>
              )}

              {/* Subholding Navigatie Dock onderin met Kaarten Weergave */}
              {show3dCards && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 max-w-[96vw] flex flex-col items-center gap-2 pointer-events-auto">
                  {/* Header bar van het dock */}
                  <div className={`flex items-center justify-between gap-3 px-3.5 py-1.5 rounded-full backdrop-blur-xl text-[11px] font-mono ${
                    theme === 'light'
                      ? 'bg-white/95 border border-sky-200 shadow-xl text-sky-900'
                      : 'bg-slate-950/90 border border-slate-800/90 shadow-lg text-slate-300'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                      <span className={`font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>Subholding Kaarten</span>
                      <span className={`text-[10px] hidden sm:inline ${theme === 'light' ? 'text-sky-700/70' : 'text-slate-500'}`}>(5 Takken & Moederholding)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setDockViewMode(dockViewMode === 'cards' ? 'compact' : 'cards')}
                        className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer text-[10px] ${
                          theme === 'light'
                            ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 hover:text-sky-950 border border-sky-200'
                            : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
                        }`}
                      >
                        {dockViewMode === 'cards' ? 'Compact' : 'Kaarten'}
                      </button>
                      <button
                        onClick={() => setShowSubholdingsModal(true)}
                        className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer flex items-center gap-1 text-[10px] font-bold ${
                          theme === 'light'
                            ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-300'
                            : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30'
                        }`}
                      >
                        <LayoutGrid className="w-3 h-3" />
                        <span>Matrix</span>
                      </button>
                    </div>
                  </div>

                  {/* Subholding Kaarten Strook */}
                  {dockViewMode === 'cards' ? (
                    <div className={`flex items-stretch gap-2.5 p-2 backdrop-blur-2xl rounded-2xl max-w-[95vw] overflow-x-auto no-scrollbar ${
                      theme === 'light'
                        ? 'bg-white/95 border border-sky-200 shadow-2xl'
                        : 'bg-slate-950/95 border border-slate-800/90 shadow-2xl'
                    }`}>
                      {subholdingCardsData.map((sub) => {
                        const isSelected = selected3dKey === sub.id && !selected3dEntity;
                        return (
                          <div
                            key={sub.id}
                            onClick={() => handleSelectSubholding(sub.id, '3d')}
                            className={`w-52 shrink-0 p-3 rounded-xl border transition-all cursor-pointer text-left flex flex-col justify-between group ${
                              isSelected
                                ? theme === 'light'
                                  ? 'bg-gradient-to-b from-amber-50 via-white to-sky-50/60 border-amber-400 ring-2 ring-amber-400/40 shadow-lg text-amber-950'
                                  : sub.activeClass
                                : theme === 'light'
                                ? 'bg-white border-sky-100 hover:border-sky-300 hover:bg-sky-50/50 shadow-sm'
                                : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-800/80 hover:border-slate-700'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${sub.badgeClass}`}>
                                  {sub.numberTag}
                                </span>
                                {renderHoldcoIcon(sub.iconName, `w-3.5 h-3.5 ${sub.textColor}`)}
                              </div>
                              <h4 className={`text-xs font-bold transition-colors truncate ${
                                theme === 'light' ? 'text-sky-950 group-hover:text-amber-800' : 'text-white group-hover:text-amber-300'
                              }`}>
                                {sub.title}
                              </h4>
                              <p className={`text-[10px] line-clamp-1 mt-0.5 ${
                                theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'
                              }`}>
                                {sub.sector}
                              </p>
                            </div>

                            <div className={`mt-2.5 pt-2 border-t flex items-center justify-between text-[10px] ${
                              theme === 'light' ? 'border-sky-100' : 'border-slate-800/60'
                            }`}>
                              <span className={`font-mono ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-500'}`}>
                                {sub.entitiesCount} {sub.entitiesCount === 1 ? 'entiteit' : 'entiteiten'}
                              </span>
                              <span className={`font-mono font-semibold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>
                                Gefirewalled
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Compacte Dock Knoppen */
                    <div className="nav-dock relative bottom-0 left-0 translate-x-0">
                      {subholdingCardsData.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSelectSubholding(sub.id, '3d')}
                          className={`dock-btn ${selected3dKey === sub.id && !selected3dEntity ? 'active' : ''}`}
                        >
                          {renderHoldcoIcon(sub.iconName, 'w-3.5 h-3.5')}
                          <span>{sub.title.replace(' Holdco', '')}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Zwevende herstelknop wanneer kaarten verborgen zijn */}
              {!show3dCards && (
                <button
                  onClick={() => setShow3dCards(true)}
                  className={`absolute bottom-5 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 cursor-pointer backdrop-blur-xl transition-all ${
                    theme === 'light'
                      ? 'bg-white/95 hover:bg-sky-50 border border-amber-300 text-amber-900 shadow-xl'
                      : 'bg-slate-950/90 hover:bg-slate-900 border border-amber-500/40 text-amber-300 shadow-2xl'
                  }`}
                  title="Toon alle kaarten"
                >
                  <Eye className={`w-4 h-4 ${theme === 'light' ? 'text-amber-700' : 'text-amber-400'}`} />
                  <span>Kaarten tonen</span>
                </button>
              )}

              {/* Rechter Informatiepaneel (Kaart) */}
              {show3dCards && (
                <div
                  className={`info-panel ${
                    mobile3dPanelOpen ? 'block' : 'hidden md:block'
                  }`}
                  onWheel={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onTouchMove={(e) => e.stopPropagation()}
                >
                {selectedEntityData ? (
                  /* GESELECTEERD BEDRIJF (WERKMAATSCHAPPIJ) DETAILS OP DE KAART */
                  <div className="space-y-4 pb-6">
                    {/* Header badge & sluiten knop */}
                    <div className={`flex items-center justify-between pb-3 border-b ${theme === 'light' ? 'border-sky-100' : 'border-slate-800'}`}>
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider truncate ${theme === 'light' ? 'text-amber-800' : 'text-amber-400'}`}>
                          Bedrijfsprofiel
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold shrink-0 ${
                          theme === 'light'
                            ? 'bg-sky-100 text-sky-800 border-sky-200'
                            : 'text-cyan-300 bg-cyan-500/15 border-cyan-500/30'
                        }`}>
                          {selectedEntityData.entity.type}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelected3dEntity(null);
                          setMobile3dPanelOpen(false);
                        }}
                        className={`text-xs font-mono px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 cursor-pointer shrink-0 ml-2 ${
                          theme === 'light'
                            ? 'bg-sky-50 text-sky-800 hover:text-sky-950 hover:bg-sky-100 border-sky-200'
                            : 'text-slate-400 hover:text-white bg-slate-900 border-slate-800 hover:border-slate-700'
                        }`}
                        title="Sluit bedrijf en toon holding overzicht"
                      >
                        <span className="text-[11px]">Holding</span>
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bedrijfsidentiteit */}
                    <div>
                      <div className={`text-[11px] font-mono flex items-center gap-1.5 mb-1 truncate ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
                        <span>Behoort tot:</span>
                        <span className={`font-semibold truncate ${theme === 'light' ? 'text-cyan-700' : 'text-cyan-400'}`}>{selectedEntityData.holdcoNode.title}</span>
                      </div>
                      <h3 className={`panel-title text-2xl font-black flex items-center gap-2 ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                        {selectedEntityData.entity.name}
                      </h3>
                      <h4 className={`panel-subtitle text-sm font-semibold mt-1 ${theme === 'light' ? 'text-amber-800' : 'text-amber-300'}`}>
                        {selectedEntityData.entity.role}
                      </h4>
                    </div>

                    {/* Uitgebreide omschrijving van het geselecteerde bedrijf */}
                    <div className={`p-3.5 rounded-xl border ${
                      theme === 'light'
                        ? 'bg-gradient-to-b from-sky-50/70 via-white to-sky-50/40 border-sky-100 shadow-sm'
                        : 'bg-slate-900/95 border-slate-800/90 shadow-inner'
                    }`}>
                      <span className={`text-[10px] font-mono uppercase tracking-wider block mb-1.5 font-bold ${
                        theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'
                      }`}>
                        Operationele Beschrijving
                      </span>
                      <p className={`text-xs leading-relaxed ${theme === 'light' ? 'text-sky-900/85' : 'text-slate-300'}`}>
                        {selectedEntityData.entity.desc}
                      </p>
                    </div>

                    {/* Financiële kasstroom / output */}
                    {selectedEntityData.entity.financialContribution && (
                      <div className={`p-3.5 rounded-xl border ${
                        theme === 'light'
                          ? 'bg-emerald-50/80 border-emerald-200'
                          : 'bg-emerald-950/40 border-emerald-500/30'
                      }`}>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                          theme === 'light' ? 'text-emerald-800' : 'text-emerald-400'
                        }`}>
                          Financiële Kasstroom & Output
                        </span>
                        <p className={`text-xs font-mono leading-relaxed ${
                          theme === 'light' ? 'text-emerald-950 font-semibold' : 'text-emerald-200'
                        }`}>
                          {selectedEntityData.entity.financialContribution}
                        </p>
                      </div>
                    )}

                    {/* Synergie Matrix */}
                    {selectedEntityData.entity.synergyWith && (
                      <div className={`p-3.5 rounded-xl border space-y-2 ${
                        theme === 'light'
                          ? 'bg-sky-50/70 border-sky-200'
                          : 'bg-blue-950/40 border-blue-500/30'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                            theme === 'light' ? 'text-sky-900' : 'text-blue-400'
                          }`}>
                            Directe Ecosysteem Synergie
                          </span>
                          <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border font-semibold ${
                            theme === 'light'
                              ? 'text-amber-900 bg-amber-100 border-amber-300'
                              : 'text-amber-300 bg-amber-500/10 border-amber-500/30'
                          }`}>
                            3D Lijnen Actief
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {selectedEntityData.entity.synergyWith.split(',').map((partner) => {
                            const trimmed = partner.trim();
                            return (
                              <button
                                key={trimmed}
                                onClick={() => {
                                  setSelected3dEntity(trimmed);
                                }}
                                className={`text-xs font-bold transition-colors cursor-pointer text-left block w-full py-1.5 px-2.5 rounded-lg border ${
                                  theme === 'light'
                                    ? 'bg-white hover:bg-sky-50 text-amber-900 hover:text-amber-950 border-sky-200 hover:border-amber-300 shadow-sm'
                                    : 'bg-slate-900/80 hover:bg-slate-900 text-amber-300 hover:text-white border-slate-800 hover:border-amber-400/40'
                                }`}
                                title={`Klik om direct naar ${trimmed} te navigeren`}
                              >
                                Gekoppeld aan: {trimmed} ➔
                              </button>
                            );
                          })}
                        </div>
                        {selectedEntityData.entity.synergyEffect && (
                          <p className={`text-[11px] mt-1 leading-relaxed ${theme === 'light' ? 'text-sky-900/80' : 'text-slate-300'}`}>
                            {selectedEntityData.entity.synergyEffect}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Regulering & Compliance */}
                    {selectedEntityData.entity.compliance && (
                      <div className={`p-3.5 rounded-xl border ${
                        theme === 'light'
                          ? 'bg-amber-50/80 border-amber-200'
                          : 'bg-amber-950/30 border-amber-500/30'
                      }`}>
                        <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block mb-1 ${
                          theme === 'light' ? 'text-amber-800' : 'text-amber-400'
                        }`}>
                          Regulering & Compliance
                        </span>
                        <p className={`text-xs leading-relaxed ${
                          theme === 'light' ? 'text-amber-950' : 'text-amber-200/90'
                        }`}>
                          {selectedEntityData.entity.compliance}
                        </p>
                      </div>
                    )}

                    {/* 3D Visualisatie parameters */}
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-white border-sky-100 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
                        <span className={`text-[10px] block ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>3D GEOMETRIE</span>
                        <span className={`font-bold capitalize ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                          {selectedEntityData.entity.shape || 'Orb'}
                        </span>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-white border-sky-100 shadow-sm' : 'bg-slate-900 border-slate-800'}`}>
                        <span className={`text-[10px] block ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>BRANDMUUR</span>
                        <span className={`font-bold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>Ring-fenced</span>
                      </div>
                    </div>

                    {/* Snelle actieknoppen */}
                    <div className="pt-2 flex items-center gap-2">
                      <button
                        onClick={() => {
                          const archKey = holdcoKeyToArchKey[selectedEntityData.holdcoKey] || 'mother';
                          setSelectedArchNode(archKey);
                          setActiveTab('architecture');
                        }}
                        className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                          theme === 'light'
                            ? 'bg-cyan-50 hover:bg-cyan-100 border-cyan-300 text-cyan-950 font-bold'
                            : 'bg-cyan-500/20 hover:bg-cyan-500/30 border-cyan-500/40 text-cyan-300'
                        }`}
                      >
                        <Network className="w-3.5 h-3.5" />
                        <span>Bekijk in Architectuur</span>
                      </button>
                      <button
                        onClick={() => setSelected3dEntity(null)}
                        className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                          theme === 'light'
                            ? 'bg-white hover:bg-sky-50 border-sky-200 text-sky-900 font-bold shadow-sm'
                            : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300'
                        }`}
                      >
                        Holding Details
                      </button>
                    </div>

                    {/* Sibling bedrijven switcher */}
                    <div className={`pt-3 border-t ${theme === 'light' ? 'border-sky-100' : 'border-slate-800'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                          theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'
                        }`}>
                          Overige bedrijven in {selectedEntityData.holdcoNode.id}
                        </span>
                        <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-sky-700/60' : 'text-slate-500'}`}>
                          {selectedEntityData.holdcoNode.entities.length} totaal
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {selectedEntityData.holdcoNode.entities.map((e) => {
                          const isCur = e.name.toLowerCase() === selectedEntityData.entity.name.toLowerCase();
                          return (
                            <button
                              key={e.name}
                              onClick={() => setSelected3dEntity(e.name)}
                              className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between cursor-pointer border ${
                                isCur
                                  ? theme === 'light'
                                    ? 'bg-amber-100 border-amber-400 text-amber-950 font-bold shadow-sm'
                                    : 'bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold shadow-md'
                                  : theme === 'light'
                                  ? 'bg-white border-sky-100 text-sky-950 hover:bg-sky-50 hover:border-sky-300 shadow-sm'
                                  : 'bg-slate-900/70 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                              }`}
                            >
                              <div className="truncate mr-2">
                                <span className="font-semibold block truncate">{e.name}</span>
                                <span className={`text-[10px] font-normal block truncate ${
                                  theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'
                                }`}>
                                  {e.role}
                                </span>
                              </div>
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                                theme === 'light'
                                  ? 'text-cyan-800 bg-cyan-50 border-cyan-200'
                                  : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
                              }`}>
                                {e.type}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* SUBHOLDING / MOEDERHOLDING PROFIELKAART */
                  (() => {
                    const currentSubCard = subholdingCardsData.find((s) => s.id === current3dNode.id) || subholdingCardsData[0];
                    return (
                      <div className="space-y-4 pb-6">
                        {/* Header badge & status */}
                        <div className={`flex items-center justify-between pb-3 border-b ${theme === 'light' ? 'border-sky-100' : 'border-slate-800'}`}>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${
                              theme === 'light' ? 'text-amber-800' : 'text-amber-400'
                            }`}>
                              Subholding Profielkaart
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${currentSubCard.badgeClass}`}>
                              {currentSubCard.numberTag}
                            </span>
                            {mobile3dPanelOpen && (
                              <button
                                onClick={() => setMobile3dPanelOpen(false)}
                                className={`md:hidden p-1 rounded border ${
                                  theme === 'light'
                                    ? 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100'
                                    : 'text-slate-400 hover:text-white bg-slate-900 border-slate-800'
                                }`}
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Hoofdprofiel Kaart */}
                        <div className={`p-4 rounded-2xl border relative overflow-hidden ${
                          theme === 'light'
                            ? 'bg-gradient-to-br from-white via-sky-50/50 to-amber-50/30 border-sky-200 shadow-md'
                            : `bg-gradient-to-br from-slate-900/90 to-slate-950/90 ${currentSubCard.borderClass} shadow-xl`
                        }`}>
                          <div className="flex items-start gap-3.5">
                            {current3dNode.id === 'Moederholding' ? (
                              <div className={`w-14 h-14 rounded-2xl p-1 shrink-0 overflow-hidden shadow-lg ${
                                theme === 'light'
                                  ? 'bg-white border border-amber-300 shadow-amber-500/10'
                                  : 'bg-slate-900 border border-amber-400/50 shadow-amber-500/10'
                              }`}>
                                <img
                                  src={quantumInitiumLogo}
                                  alt="QuantumInitium Emblem"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover rounded-xl"
                                />
                              </div>
                            ) : (
                              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-lg ${
                                theme === 'light'
                                  ? 'bg-white border-sky-200 shadow-sm'
                                  : `bg-slate-900/90 ${currentSubCard.borderClass}`
                              }`}>
                                {renderHoldcoIcon(currentSubCard.iconName, `w-7 h-7 ${currentSubCard.textColor}`)}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-mono uppercase tracking-wider ${
                                  theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'
                                }`}>
                                  {currentSubCard.sector}
                                </span>
                              </div>
                              <h3 className={`text-base font-extrabold tracking-tight leading-snug ${
                                theme === 'light' ? 'text-sky-950 font-black' : 'text-white'
                              }`}>
                                {currentSubCard.title}
                              </h3>
                              <h4 className={`text-xs font-medium mt-0.5 ${
                                theme === 'light' ? 'text-amber-800 font-bold' : 'text-amber-300/90'
                              }`}>
                                {currentSubCard.subTitle}
                              </h4>
                            </div>
                          </div>

                          <div className={`mt-3.5 pt-3.5 border-t ${theme === 'light' ? 'border-sky-100' : 'border-slate-800/80'}`}>
                            <p className={`text-xs leading-relaxed font-sans ${
                              theme === 'light' ? 'text-sky-900/80' : 'text-slate-300'
                            }`}>
                              {currentSubCard.desc}
                            </p>
                          </div>
                        </div>

                        {/* 4 Kernstatistieken Raster */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className={`p-3 rounded-xl border ${
                            theme === 'light' ? 'bg-white border-sky-100 shadow-sm' : 'bg-slate-900/80 border-slate-800/80'
                          }`}>
                            <div className={`text-[10px] font-mono uppercase flex items-center justify-between ${
                              theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'
                            }`}>
                              <span>Entiteiten</span>
                              <Building2 className={`w-3 h-3 ${theme === 'light' ? 'text-cyan-600' : 'text-cyan-400'}`} />
                            </div>
                            <div className={`text-sm font-bold mt-1 ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                              {currentSubCard.entitiesCount} {currentSubCard.entitiesCount === 1 ? 'Dochter' : 'Dochters'}
                            </div>
                            <div className={`text-[10px] mt-0.5 truncate ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
                              {currentSubCard.entityNames.join(', ')}
                            </div>
                          </div>

                          <div className={`p-3 rounded-xl border ${
                            theme === 'light' ? 'bg-white border-sky-100 shadow-sm' : 'bg-slate-900/80 border-slate-800/80'
                          }`}>
                            <div className={`text-[10px] font-mono uppercase flex items-center justify-between ${
                              theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'
                            }`}>
                              <span>Brandmuur</span>
                              <ShieldCheck className={`w-3 h-3 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                            </div>
                            <div className={`text-sm font-bold mt-1 ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'}`}>
                              100% Ring Fenced
                            </div>
                            <div className={`text-[10px] mt-0.5 ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
                              Geen kruisbesmetting
                            </div>
                          </div>

                          <div className={`p-3 rounded-xl border ${
                            theme === 'light' ? 'bg-white border-sky-100 shadow-sm' : 'bg-slate-900/80 border-slate-800/80'
                          }`}>
                            <div className={`text-[10px] font-mono uppercase flex items-center justify-between ${
                              theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'
                            }`}>
                              <span>Substance</span>
                              <Crown className={`w-3 h-3 ${theme === 'light' ? 'text-amber-600' : 'text-amber-400'}`} />
                            </div>
                            <div className={`text-sm font-bold mt-1 ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                              Londen UK
                            </div>
                            <div className={`text-[10px] mt-0.5 ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
                              IFRS en UK GAAP
                            </div>
                          </div>

                          <div className={`p-3 rounded-xl border ${
                            theme === 'light' ? 'bg-white border-sky-100 shadow-sm' : 'bg-slate-900/80 border-slate-800/80'
                          }`}>
                            <div className={`text-[10px] font-mono uppercase flex items-center justify-between ${
                              theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'
                            }`}>
                              <span>Motor</span>
                              <Zap className={`w-3 h-3 ${theme === 'light' ? 'text-amber-600' : 'text-yellow-400'}`} />
                            </div>
                            <div className={`text-sm font-bold mt-1 truncate ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                              {currentSubCard.sector.split('&')[0].trim()}
                            </div>
                            <div className={`text-[10px] mt-0.5 ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
                              Volledig operationeel
                            </div>
                          </div>
                        </div>

                        {/* Corporate Structuur & Details Kaart */}
                        <div className={`p-3.5 rounded-xl border space-y-2 text-xs ${
                          theme === 'light' ? 'bg-white border-sky-100 shadow-sm' : 'bg-slate-900/70 border-slate-800/90'
                        }`}>
                          <div>
                            <span className={`text-[10px] font-mono uppercase block mb-0.5 ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>Strategische Focus</span>
                            <span className={theme === 'light' ? 'text-sky-950' : 'text-slate-200'}>{currentSubCard.focus}</span>
                          </div>
                          <div className={`pt-2 border-t ${theme === 'light' ? 'border-sky-100' : 'border-slate-800/60'}`}>
                            <span className={`text-[10px] font-mono uppercase block mb-0.5 ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>Verdienmodel</span>
                            <span className={theme === 'light' ? 'text-sky-950' : 'text-slate-200'}>{currentSubCard.model}</span>
                          </div>
                          <div className={`pt-2 border-t ${theme === 'light' ? 'border-sky-100' : 'border-slate-800/60'}`}>
                            <span className={`text-[10px] font-mono uppercase block mb-0.5 ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>Juridische Risico Isolatie</span>
                            <span className={`font-semibold ${theme === 'light' ? 'text-emerald-700' : 'text-emerald-300'}`}>{currentSubCard.firewall}</span>
                          </div>
                        </div>

                        {/* Aangesloten Werkmaatschappijen Kaarten */}
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between px-1">
                            <h5 className={`text-xs font-bold uppercase tracking-wider font-mono ${
                              theme === 'light' ? 'text-sky-950' : 'text-slate-300'
                            }`}>
                              Werkmaatschappijen in deze Holding
                            </h5>
                            <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-sky-700/60' : 'text-slate-500'}`}>
                              Klik op een kaart voor details
                            </span>
                          </div>

                          <div className="space-y-2">
                            {current3dNode.entities.map((e) => (
                              <div
                                key={e.name}
                                onClick={() => {
                                  setSelected3dEntity(e.name);
                                  setMobile3dPanelOpen(true);
                                }}
                                className={`p-3 rounded-xl border transition-all cursor-pointer group space-y-1.5 ${
                                  theme === 'light'
                                    ? 'bg-white border-sky-100 hover:border-amber-400 hover:bg-amber-50/20 shadow-sm'
                                    : 'bg-slate-900/90 border-slate-800 hover:border-amber-400/60 hover:bg-slate-800/70'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className={`font-bold text-xs transition-colors ${
                                    theme === 'light' ? 'text-sky-950 group-hover:text-amber-900' : 'text-white group-hover:text-amber-300'
                                  }`}>
                                    {e.name}
                                  </span>
                                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                                    theme === 'light'
                                      ? 'bg-sky-100 text-sky-800 border-sky-200'
                                      : 'text-cyan-300 bg-cyan-500/20 border-cyan-500/30'
                                  }`}>
                                    {e.type}
                                  </span>
                                </div>
                                <div className={`text-[11px] font-semibold ${theme === 'light' ? 'text-amber-800 font-bold' : 'text-amber-300/90'}`}>{e.role}</div>
                                <div className={`text-[10px] leading-relaxed ${theme === 'light' ? 'text-sky-900/75' : 'text-slate-400'}`}>{e.desc}</div>
                                <div className="pt-1.5 flex items-center justify-end">
                                  <span className={`text-[10px] font-mono group-hover:underline flex items-center gap-1 ${
                                    theme === 'light' ? 'text-sky-700 font-semibold' : 'text-cyan-400'
                                  }`}>
                                    <span>Open Bedrijfsprofiel</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Quick Acties */}
                        <div className="pt-2 flex items-center gap-2">
                          <button
                            onClick={() => {
                              const archKey = holdcoKeyToArchKey[current3dNode.id] || 'mother';
                              setSelectedArchNode(archKey);
                              setActiveTab('architecture');
                            }}
                            className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all text-center cursor-pointer border ${
                              theme === 'light'
                                ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-300'
                                : 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border-cyan-500/30'
                            }`}
                          >
                            Bekijk in Flow Architectuur
                          </button>
                          <button
                            onClick={() => setShowSubholdingsModal(true)}
                            className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                              theme === 'light'
                                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 shadow-sm'
                                : 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border-amber-500/30'
                            }`}
                            title="Alle Subholding Kaarten"
                          >
                            <LayoutGrid className="w-3.5 h-3.5" />
                            <span>Kaarten</span>
                          </button>
                        </div>
                      </div>
                    );
                  })()
                )}
              </div>
              )}

              {/* SUBHOLDING KAARTEN OVERZICHT MODAL */}
              {showSubholdingsModal && (
                <div
                  className={`fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-md ${
                    theme === 'light' ? 'bg-sky-950/35' : 'bg-slate-950/85'
                  }`}
                  onClick={() => setShowSubholdingsModal(false)}
                >
                  <div
                    className={`relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border ${
                      theme === 'light' ? 'bg-white border-sky-200' : 'bg-slate-950 border-slate-800'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className={`p-5 md:p-6 border-b flex items-center justify-between ${
                      theme === 'light' ? 'border-sky-100 bg-sky-50/70' : 'border-slate-800 bg-slate-900/60'
                    }`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                          theme === 'light'
                            ? 'bg-amber-100 border-amber-300 text-amber-800'
                            : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                        }`}>
                          <LayoutGrid className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                            <span className={`text-[11px] font-mono uppercase tracking-wider font-bold ${
                              theme === 'light' ? 'text-cyan-700' : 'text-cyan-400'
                            }`}>
                              Holding Structuur Kaarten
                            </span>
                          </div>
                          <h2 className={`text-lg md:text-xl font-extrabold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                            Subholding Kaarten Overzicht
                          </h2>
                          <p className={`text-xs mt-0.5 ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
                            Vijf operationele subholdings en centrale moederholding met 100% brandmuurisolatie
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowSubholdingsModal(false)}
                        className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                          theme === 'light'
                            ? 'bg-white hover:bg-sky-100 text-sky-800 border-sky-200'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                        }`}
                        title="Sluiten"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Grid Cards */}
                    <div className="flex-1 overflow-y-auto p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subholdingCardsData.map((sub) => {
                        const isSelected = selected3dKey === sub.id && !selected3dEntity;
                        return (
                          <div
                            key={sub.id}
                            className={`p-4 rounded-2xl border transition-all flex flex-col justify-between group ${
                              isSelected
                                ? theme === 'light'
                                  ? 'bg-gradient-to-b from-amber-50 via-white to-sky-50/60 border-amber-400 ring-2 ring-amber-400/40 shadow-lg text-amber-950'
                                  : sub.activeClass
                                : theme === 'light'
                                ? 'bg-white border-sky-100 hover:border-sky-300 hover:bg-sky-50/50 shadow-sm'
                                : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                            }`}
                          >
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${sub.badgeClass}`}>
                                  {sub.numberTag}
                                </span>
                                <div className="flex items-center gap-1.5">
                                  <span className={`text-[10px] font-mono font-semibold ${
                                    theme === 'light' ? 'text-emerald-700' : 'text-emerald-400'
                                  }`}>
                                    100% Ring Fenced
                                  </span>
                                  {renderHoldcoIcon(sub.iconName, `w-4 h-4 ${sub.textColor}`)}
                                </div>
                              </div>

                              <div>
                                <h3 className={`text-sm font-bold transition-colors ${
                                  theme === 'light' ? 'text-sky-950 group-hover:text-amber-800' : 'text-white group-hover:text-amber-300'
                                }`}>
                                  {sub.title}
                                </h3>
                                <p className={`text-xs mt-0.5 ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
                                  {sub.subTitle}
                                </p>
                              </div>

                              <p className={`text-xs leading-relaxed line-clamp-3 ${
                                theme === 'light' ? 'text-sky-900/80' : 'text-slate-300/90'
                              }`}>
                                {sub.desc}
                              </p>

                              <div className={`pt-2 border-t space-y-1.5 ${theme === 'light' ? 'border-sky-100' : 'border-slate-800/80'}`}>
                                <span className={`text-[10px] font-mono uppercase tracking-wider block ${
                                  theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'
                                }`}>
                                  Werkmaatschappijen ({sub.entitiesCount})
                                </span>
                                <div className="flex flex-wrap gap-1">
                                  {sub.entityNames.map((eName) => (
                                    <span
                                      key={eName}
                                      className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                        theme === 'light'
                                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                                          : 'bg-slate-800 text-slate-300 border-slate-700'
                                      }`}
                                    >
                                      {eName}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className={`mt-4 pt-3 border-t flex items-center gap-2 ${
                              theme === 'light' ? 'border-sky-100' : 'border-slate-800'
                            }`}>
                              <button
                                onClick={() => {
                                  handleSelectSubholding(sub.id, '3d');
                                  setShowSubholdingsModal(false);
                                }}
                                className={`flex-1 py-1.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all text-center cursor-pointer ${
                                  theme === 'light'
                                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                                    : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border-amber-500/40'
                                }`}
                              >
                                Focus in 3D & Kaart
                              </button>
                              <button
                                onClick={() => {
                                  handleSelectSubholding(sub.id, 'architecture');
                                  setShowSubholdingsModal(false);
                                }}
                                className={`py-1.5 px-3 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                                  theme === 'light'
                                    ? 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-300'
                                    : 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                                }`}
                                title="Bekijk in Flow"
                              >
                                Flow
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Modal Footer */}
                    <div className={`p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
                      theme === 'light'
                        ? 'border-sky-100 bg-sky-50/50 text-sky-800/80'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400'
                    }`}>
                      <div className="flex items-center gap-2">
                        <ShieldCheck className={`w-4 h-4 shrink-0 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                        <span>Alle subholdings functioneren als onafhankelijke juridische entiteiten zonder aansprakelijkheidsdoorslag.</span>
                      </div>
                      <button
                        onClick={() => setShowSubholdingsModal(false)}
                        className={`px-4 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                          theme === 'light'
                            ? 'bg-sky-100 hover:bg-sky-200 text-sky-950 border border-sky-300'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        Sluiten
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: LOGIN PAGINA */}
          {activeTab === 'login' && (
            <div className="flex-1 overflow-y-auto h-full w-full">
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onNavigateRegister={() => setActiveTab('register')}
                onNavigateHome={(t) => setActiveTab(t || 'architecture')}
              />
            </div>
          )}

          {/* TAB: REGISTREER PAGINA */}
          {activeTab === 'register' && (
            <div className="flex-1 overflow-y-auto h-full w-full">
              <RegisterPage
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateLogin={() => setActiveTab('login')}
                onNavigateHome={(t) => setActiveTab(t || 'architecture')}
              />
            </div>
          )}

          {/* TAB: INVESTOR DASHBOARD */}
          {activeTab === 'investor_dashboard' && (
            <div className="flex-1 overflow-y-auto h-full w-full">
              <InvestorDashboard
                key={currentUser?.id ?? 'investor-dashboard'}
                user={currentUser && currentUser.role === 'investor' ? currentUser : DEMO_INVESTOR}
                onLogout={handleLogout}
                onNavigateHome={(t) => setActiveTab(t || 'architecture')}
                onUpdateShares={(newTotal) => {
                  if (currentUser) {
                    setCurrentUser({ ...currentUser, sharesOwned: newTotal });
                  }
                }}
                theme={theme}
              />
            </div>
          )}

          {/* TAB: ADMIN DASHBOARD */}
          {activeTab === 'admin_dashboard' && (
            <div className="flex-1 overflow-y-auto h-full w-full">
              <AdminDashboard
                user={currentUser && currentUser.role === 'admin' ? currentUser : DEMO_ADMIN}
                onLogout={handleLogout}
                onNavigateHome={(t) => setActiveTab(t || 'architecture')}
                onSwitchRole={() => {
                  setCurrentUser(DEMO_INVESTOR);
                  setActiveTab('investor_dashboard');
                }}
              />
            </div>
          )}

          {/* Dossier Hoofdstukken Toolbar (alleen zichtbaar op de dossier pagina) */}
          {activeTab === 'dossier' && (
            <footer className="glass-panel border-t border-slate-800 px-6 py-3.5 flex items-center justify-between text-xs z-30 shrink-0">
              <button
                onClick={handlePrevChapter}
                disabled={currentChapter <= 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-bold text-xs transition-all ${
                  currentChapter <= 1
                    ? 'opacity-40 cursor-not-allowed bg-slate-900/60 border-slate-800 text-slate-500'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer shadow-sm'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Vorig Hoofdstuk</span>
              </button>

              <div className="text-slate-400 text-center font-mono text-xs">
                Dossier Hoofdstuk{' '}
                <span className="text-cyan-400 font-bold">
                  {currentChapter < 10 ? `0${currentChapter}` : currentChapter}
                </span>{' '}
                van 10
              </div>

              <button
                onClick={handleNextChapter}
                disabled={currentChapter >= 10}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  currentChapter >= 10
                    ? 'opacity-40 cursor-not-allowed bg-slate-800 text-slate-500'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer shadow-md shadow-cyan-500/20'
                }`}
              >
                <span>Volgend Hoofdstuk</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </footer>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
