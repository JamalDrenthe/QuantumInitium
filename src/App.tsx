import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Award,
  Menu,
  X,
  Cpu,
  Network,
  Bot,
  Calculator,
  BookOpen,
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
  Route as RouteIcon,
  LogIn,
  UserPlus,
  LogOut,
  TrendingUp,
  Sun,
  Moon,
  Globe,
  Mail,
  Briefcase
} from 'lucide-react';
import EcosystemCanvas, { EcosystemCanvasHandle } from './components/EcosystemCanvas';
import OnboardingRoutesPanel from './components/OnboardingRoutesPanel';
import DossierReader from './components/DossierReader';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import InvestorDashboard from './components/InvestorDashboard';
import AdminDashboard from './components/AdminDashboard';
import CareersPage from './components/CareersPage';
import LandingPage from './components/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthUser, DEMO_INVESTOR, DEMO_ADMIN, SHARE_PRICE_CURRENT } from './types/auth';
import { createManagedAccount, loadAccountForSession, loadManagedAccounts, saveManagedAccount } from './lib/accountStore';
import {
  buildRegisteredInvestor,
  clearAuthSession,
  consumeOAuthIntent,
  getCurrentAuthIdentity,
  isDemoModeEnabled,
  isFirebaseConfigured
} from './lib/authStore';
import { ecosystemData } from './data/ecosystem';
import { AmountPrivacyProvider, PrivateAmount, maskAmounts } from './lib/amountPrivacy';
import quantumInitiumLogo from './assets/images/quantum_initium_logo_1790097745176.jpg';

interface EntityItem {
  name: string;
  holdingKey: string;
  holdingName: string;
  category: 'tech' | 'fintech' | 'talent' | 'compute' | 'proptech' | 'holding' | 'media';
  type: string;
  role: string;
  tagline?: string;
  color: string;
  website?: string;
  domain?: string;
  email?: string;
}

const allEntitiesList: EntityItem[] = [
  {
    name: 'QuantumInitium Ltd',
    website: 'https://quantuminitium.com',
    domain: 'quantuminitium.com',
    email: 'info@quantuminitium.com',
    holdingKey: 'mother',
    holdingName: 'QuantumInitium Ltd (Moederholding)',
    category: 'holding',
    type: 'Moederholding',
    tagline: 'Holdingstructuur en strategisch deelnemingenoverzicht voor QuantumInitium Ltd',
    role: 'Fysiek hoofdkantoor Londen, twee UK resident bestuurders, centrale kapitaalallocatie & IFRS beursvoorbereiding.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    name: 'CRMos Ltd',
    website: 'https://crmos.one',
    domain: 'crmos.one',
    email: 'info@crmos.one',
    holdingKey: 'sub1',
    holdingName: 'Subholding 1: IP & Tech',
    category: 'tech',
    type: 'Hybride CRM & SaaS',
    tagline: 'One Platform. Three Disciplines. One Connected Workflow. — From People to Performance',
    role: 'Verbindt Field Sales (door-to-door), Callcenters en Recruitment in één centraal platform (alternatief voor Salesdock, LeadDesk en Recruit CRM).',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  },
  {
    name: 'Investbotiq Ltd',
    website: 'https://investbotiq.com',
    domain: 'investbotiq.com',
    email: 'info@investbotiq.com',
    holdingKey: 'sub1',
    holdingName: 'Subholding 1: IP & Tech',
    category: 'tech',
    type: 'AI Executie Engine',
    tagline: 'Automated Cashflow Platform & Autonome Executie Engine',
    role: 'IQ Bot & centrale executie engine voor realtime order matching en geautomatiseerde dividend/cashflow distributie.',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  },
  {
    name: 'Xabi World Ltd',
    website: 'https://xabi.world',
    domain: 'xabi.world',
    email: 'info@xabi.world',
    holdingKey: 'sub2',
    holdingName: 'Subholding 2: Fintech & Liquidity',
    category: 'fintech',
    type: 'Clearing & Escrow',
    tagline: 'Meer overzicht voor de volgende stap — Financiële helderheid en Xabi World clearing',
    role: 'Fintech clearing hub (Xabi World rails), BaaS/EMI integraties en Stichting Derdengelden escrow voor realtime split payments.',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30'
  },
  {
    name: 'VVC Ltd',
    website: 'https://vvc.works',
    domain: 'vvc.works',
    email: 'info@vvc.works',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'talent',
    type: 'Gateway & Partnernetwerk',
    tagline: 'Commercieel Partner- & Groeinetwerk — Prestatiegerichte sales en partnermodellen',
    role: 'Verdienende Vrienden Club: exclusief netwerk voor high-ticket sales professionals, deal sourcing en ondernemende groeipartners.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    name: 'DJOBBA Ltd',
    website: 'https://djobba.works',
    domain: 'djobba.works',
    email: 'info@djobba.works',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'talent',
    type: 'B2B IT Detachering',
    tagline: 'Next-Gen B2B IT Detachering & Flexibele Pool — Directe Xabi World Rails clearing',
    role: 'Supabase-achtig B2B IT platform voor flexibele gigs en vaste IT detachering met directe uitbetaling en Xabi World Rails clearing.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    name: 'Immigratiepunt Ltd',
    website: 'https://immigratiepunt.nl',
    domain: 'immigratiepunt.nl',
    email: 'info@immigratiepunt.nl',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'talent',
    type: 'Expat Logistics & Helpers',
    tagline: 'Start je leven in Nederland — Bankzaken, huisvesting, werk en postadres helpers',
    role: 'Ondersteunt nieuwkomers en IT expats met visa, bankzaken, huisvesting en postadreskoppeling in NL, EN en AR.',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
  },
  {
    name: 'Zheavenzy Ltd',
    website: 'https://zheavenzy.one',
    domain: 'zheavenzy.one',
    email: 'info@zheavenzy.one',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'media',
    type: 'Muzieklabel & Artiestenplatform',
    tagline: 'Het platform voor independent artiesten — Muziekdistributie & studio zonder wurgcontracten',
    role: 'Alles-in-één platform voor independent artiesten: wereldwijde streaming distributie, studiosessies, marketing en smart contract royalties.',
    color: 'text-pink-400 bg-pink-500/10 border-pink-500/30'
  },
  {
    name: 'Boostplug Ltd',
    website: 'https://boostplug.one',
    domain: 'boostplug.one',
    email: 'info@boostplug.one',
    holdingKey: 'sub4',
    holdingName: 'Subholding 4: Compute & Media',
    category: 'compute',
    type: 'Streaming & Reviews Platform',
    tagline: 'Streaming & Reviews Growth Platform — Klanten Kopen, Leden Genereren',
    role: 'Combinatie van verkoop en generatie: Zakelijke klanten kopen streaminggroei en reviews (Spotify, Apple Music, Trustpilot, Google Maps); aangesloten leden genereren de streams en engagement met drip-feed bescherming.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    name: 'Logs.rent',
    website: 'https://logs.rent',
    domain: 'logs.rent',
    email: 'info@logs.rent',
    holdingKey: 'sub4',
    holdingName: 'Subholding 4: Compute & Media',
    category: 'compute',
    type: 'Digital Asset Exchange',
    tagline: 'Digital Asset Exchange — Professionele accountverhuur, orderboeken & escrow',
    role: 'Digitale beurs en marktplaats voor accountverhuur, realtime orderboeken, escrow-afhandeling en geautomatiseerde compute settlements.',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  },
  {
    name: 'Spontiva Ltd',
    website: 'https://spontiva.nl',
    domain: 'spontiva.nl',
    email: 'info@spontiva.nl',
    holdingKey: 'sub1',
    holdingName: 'Subholding 1: IP & Tech',
    category: 'tech',
    type: 'Time Gap Cashflow (TGC)',
    tagline: 'TIME GAP CASHFLOW — Sluit direct aan op hoe geld door jouw bedrijf beweegt',
    role: 'Working Capital Optimization (WCO) en Time Gap Cashflow structuren om kapitaalrotatie tussen T=0 en T=1 te versnellen.',
    color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
  },
  {
    name: 'WoningVry Ltd',
    website: 'https://woningvry.nl',
    domain: 'woningvry.nl',
    email: 'info@woningvry.nl',
    holdingKey: 'sub5',
    holdingName: 'Subholding 5: Real Estate & Operations',
    category: 'proptech',
    type: 'Non-Hypotheek PropTech',
    tagline: 'Zonder BKR. Zonder hypotheek. Wél een woning — Woningen van €200k tot €650k',
    role: 'Non-hypotheekmodel voor woningen van €200k tot €650k (500 plekken in 4 rondes) plus LongStay en dynamische BnB exploitatie.',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
  },
  {
    name: 'Afterstudenthousing Ltd',
    website: 'https://woningvry.nl',
    domain: 'woningvry.nl',
    email: 'info@woningvry.nl',
    holdingKey: 'sub5',
    holdingName: 'Subholding 5: Real Estate & Operations',
    category: 'proptech',
    type: 'Young Professional Living',
    tagline: 'Young Professional Living — Doorgroeiwoningen voor afgestudeerden en starters',
    role: 'Doorstroomhuisvesting voor afgestudeerden en young professionals met structureel hoge bezetting en huurdersretentie.',
    color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30'
  }
];

interface SubholdingNode {
  title: string;
  desc: string;
  entities: { name: string; type: string; role: string }[];
}

const subholdingMatrix: Record<string, SubholdingNode> = {
  mother: {
    title: 'QuantumInitium Ltd',
    desc: 'Centrale holding direct verantwoordelijk voor de overall kapitaalallocatie, geconsolideerde IFRS verslaglegging, intellectueel eigendom en beursgangsvoorbereiding.',
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
      },
      {
        name: 'Spontiva Ltd',
        type: 'Fintech Cashflow Motor',
        role: 'Working Capital Optimization (WCO) en Time Gap Cashflow structuren.'
      }
    ]
  },
  sub2: {
    title: 'Fintech & Liquidity Subholding',
    desc: 'Clearing, betaalinfrastructuur en beveiligde liquiditeitsretentie voor de gehele groep zonder traditioneel bancair balansrisico.',
    entities: [
      {
        name: 'Xabi World Ltd',
        type: 'Clearing & Escrow',
        role: 'Fintech clearing hub (Xabi World rails), BaaS en EMI integraties en realtime split payments.'
      }
    ]
  },
  sub3: {
    title: 'Talent & Gateway Subholding',
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
    desc: 'Infrastructuur voor high performance GPU AI inferentie, bandbreedte monetarisering en accountverhuur.',
    entities: [
      {
        name: 'Boostplug Ltd',
        type: 'Streaming & Reviews',
        role: 'Verkoop & generatie: Klanten kopen streaminggroei & reviews; leden genereren de streams en geverifieerde interacties.'
      },
      {
        name: 'Logs.rent',
        type: 'Account Marketplace',
        role: 'Geautomatiseerd verhuur en handelsplatform voor compute accounts.'
      }
    ]
  },
  sub5: {
    title: 'Real Estate & Operations Subholding',
    desc: 'PropTech oplossingen voor residentiële huisvesting, short stay BnB verhuur en expat doorstroom.',
    entities: [
      {
        name: 'WoningVry Ltd',
        type: 'PropTech & Living',
        role: 'Geautomatiseerde verhuur LongStay en BnB short stay.'
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
  { num: 5, tag: '05', title: 'REKENMODEL', desc: 'Cohort Rekenmodel' },
  { num: 6, tag: '06', title: 'GROEI', desc: 'Schaalbaarheid en groeiprojecties' },
  { num: 7, tag: '07', title: 'LIQUIDITEIT', desc: 'Time Gap Cashflow & Xabi World' },
  { num: 8, tag: '08', title: 'KAPITAALMARKT', desc: 'Beursgang & Cap Table' },
  { num: 9, tag: '09', title: 'ALLOCATIE', desc: 'Kapitaalallocatie' },
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
    desc: 'Centrale moederholding direct verantwoordelijk voor de overall kapitaalallocatie, IP beheer, geconsolideerde IFRS verslaglegging en beursgangsvoorbereiding.',
    colorHex: '#ffd700',
    textColor: 'text-amber-400',
    badgeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    borderClass: 'border-amber-500/30',
    hoverBorderClass: 'hover:border-amber-400/60',
    activeClass: 'bg-amber-500/15 border-amber-400 ring-2 ring-amber-400/30 shadow-lg shadow-amber-500/20 text-amber-200',
    iconName: 'Crown',
    entitiesCount: 1,
    entityNames: ['QuantumInitium Ltd'],
    focus: 'Overkoepelend toezicht, M&A strategie, kapitaalallocatie en beursgang',
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
    desc: 'Eigenaar en beheerder van alle intellectuele eigendommen, softwarepatenten, AI modellen, CRMos B2B SaaS, de Investbotiq centrale executiemotor en de Spontiva kasstroommotor.',
    colorHex: '#00f0ff',
    textColor: 'text-cyan-400',
    badgeClass: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    borderClass: 'border-cyan-500/30',
    hoverBorderClass: 'hover:border-cyan-400/60',
    activeClass: 'bg-cyan-500/15 border-cyan-400 ring-2 ring-cyan-400/30 shadow-lg shadow-cyan-500/20 text-cyan-200',
    iconName: 'Cpu',
    entitiesCount: 3,
    entityNames: ['CRMos Ltd', 'Investbotiq Ltd', 'Spontiva Ltd'],
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
    focus: 'Robuuste Xabi World betaalrails, geautomatiseerde clearing en veilige derdengeldenscheiding',
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
    subTitle: 'Streaming Aggregatie & Digital Asset Marketplace',
    sector: 'Media Distributie & Asset Exchange',
    desc: 'Infrastructuur voor streaming aggregatie, geverifieerde reviewbundels, veilige accountverhuur en geautomatiseerde marktplaats settlements.',
    colorHex: '#a855f7',
    textColor: 'text-purple-400',
    badgeClass: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    borderClass: 'border-purple-500/30',
    hoverBorderClass: 'hover:border-purple-400/60',
    activeClass: 'bg-purple-500/15 border-purple-400 ring-2 ring-purple-400/30 shadow-lg shadow-purple-500/20 text-purple-200',
    iconName: 'Server',
    entitiesCount: 2,
    entityNames: ['Boostplug Ltd', 'Logs.rent'],
    focus: 'Streamingverkoop aan klanten en netwerkgeneratie van streams en accounts',
    firewall: 'Digitale assets en verhuurcontracten juridisch geïsoleerd per werkmaatschappij',
    substance: 'Geregistreerde platforms, API integraties en formele exploitatiecontracten',
    model: 'Duaal model: Commerciële klantverkoop van streaming & reviewcampagnes gecombineerd met netwerkkracht van leden die de streams en reviews genereren'
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
    model: 'Maandelijkse huurstromen uit LongStay en BnB verhuur'
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
    'landing' | 'architecture' | 'simulator' | 'calculator' | 'dossier' | '3d' | 'careers' | 'login' | 'register' | 'investor_dashboard' | 'admin_dashboard'
  >('landing');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [amountsVisible, setAmountsVisible] = useState<boolean>(false);
  const [managedAccounts, setManagedAccounts] = useState<AuthUser[]>([]);
  const [accountsLoading, setAccountsLoading] = useState<boolean>(false);
  const [accountSaveError, setAccountSaveError] = useState<string | null>(null);

  const toggleAmounts = () => {
    if (!currentUser) {
      setActiveTab('login');
      return;
    }
    setAmountsVisible((v) => !v);
  };

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

  const handleLogout = () => {
    void clearAuthSession();
    setCurrentUser(null);
    setActiveTab('landing');
  };

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let isMounted = true;
    void getCurrentAuthIdentity().then(async (identity) => {
      if (!identity || !isMounted) {
        return;
      }
      consumeOAuthIntent();
      try {
        const account = await loadAccountForSession(identity);
        if (isMounted) {
          handleLoginSuccess(account);
        }
      } catch {
        const normalizedEmail = identity.email.toLowerCase();
        const isInfoAdmin = normalizedEmail === 'info@quantuminitium.com' || normalizedEmail === 'info@jamaldrenthe.com';
        const newUser = buildRegisteredInvestor(
          identity.id,
          identity.name || (isInfoAdmin ? 'Directie QuantumInitium' : identity.email.split('@')[0] || 'Investeerder'),
          identity.email,
          isInfoAdmin ? 0 : 2500
        );
        if (isInfoAdmin) {
          newUser.role = 'admin';
        }
        try {
          await createManagedAccount(newUser, identity.id);
          const account = await loadAccountForSession(identity);
          if (isMounted) {
            handleLoginSuccess(account);
          }
        } catch (createError) {
          console.warn('Account synchronisatie Firestore fallback:', createError);
          if (isMounted) {
            handleLoginSuccess(newUser);
          }
        }
      }
    }).catch((error: unknown) => {
      if (isMounted) {
        console.warn('Firebase-sessie herstel melding:', error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (currentUser?.role !== 'admin') {
      return;
    }

    let isMounted = true;
    setAccountsLoading(true);
    loadManagedAccounts()
      .then((accounts) => {
        if (isMounted) {
          setManagedAccounts(accounts);
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setAccountSaveError(error instanceof Error ? error.message : 'Accounts laden mislukt.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setAccountsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [currentUser?.role]);

  const handleManagedAccountUpdate = (updatedAccount: AuthUser) => {
    setAccountSaveError(null);
    void saveManagedAccount(updatedAccount)
      .then(() => {
        setManagedAccounts((accounts) => {
          const exists = accounts.some((account) => account.id === updatedAccount.id);
          return exists
            ? accounts.map((account) => (account.id === updatedAccount.id ? updatedAccount : account))
            : [...accounts, updatedAccount];
        });
      })
      .catch((error: unknown) => {
        setAccountSaveError(error instanceof Error ? error.message : 'Account opslaan mislukt.');
      });
  };

  const handleCurrentUserUpdate = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    void saveManagedAccount(updatedUser).catch((error: unknown) => {
      setAccountSaveError(error instanceof Error ? error.message : 'Profiel opslaan mislukt.');
    });
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
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const mobileMenuOpen = menuOpen;
  const setMobileMenuOpen = setMenuOpen;

  // Keyboard dismiss (Escape) & scroll-lock for Hamburger Menu (`modern-web-guidance`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [menuOpen]);

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
  const [showRoutesPanel, setShowRoutesPanel] = useState<boolean>(false);
  const [dockViewMode, setDockViewMode] = useState<'cards' | 'compact'>('cards');
  const [show3dCards, setShow3dCards] = useState<boolean>(false);

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

  const handleRunSimulation = () => {
    const timestamp = new Date().toLocaleTimeString();
    const newLogs: string[] = [];

    newLogs.push(`[${timestamp}] [INFLOW] New talent entry detected via VVC Hub...`);

    if (talentType === 'expat_it') {
      newLogs.push(
        `[${timestamp}] [SPONTIVA] Triggered TGC cashflow advance for relocation package.`,
        `[${timestamp}] [BOOSTPLUG] Streaming & review distributiecampagne gekoppeld via Logs.rent account.`,
        `[${timestamp}] [WONINGVRY] Automated LongStay tenancy agreement generated.`
      );
    } else if (talentType === 'gpu_engineer') {
      newLogs.push(
        `[${timestamp}] [BOOSTPLUG] Groeicampagne en geautomatiseerde streamallocatie geactiveerd.`,
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
        `[${timestamp}] [INVESTBOTIQ] All 4 output components active.`
      );
    }

    setSimLogs((prev) => [...newLogs, ...prev]);
  };

  // 12-Month Cohort calculation outputs (78 cycles * €2.625)
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
      id: 'landing' as const,
      label: language === 'en' ? 'Overview & 3D Hero' : 'Overzicht & 3D Hero',
      shortLabel: language === 'en' ? 'Overview' : 'Overzicht',
      description: language === 'en'
        ? 'Interactive 3D spatial core, Bento architecture & motion pipeline'
        : 'Interactieve 3D spatial core, Bento-architectuur & motion pipeline',
      icon: Sparkles,
      badge: 'Home',
      badgeColor: 'text-[#2997ff] bg-[#0071e3]/15 border-[#2997ff]/30',
      activeClass: 'bg-[#0071e3]/25 text-white border-[#2997ff]/50 shadow-sm',
      iconColor: 'text-[#2997ff]'
    },
    {
      id: 'architecture' as const,
      label: language === 'en' ? 'Architecture' : 'Architectuur',
      shortLabel: language === 'en' ? 'Architecture' : 'Architectuur',
      description: language === 'en'
        ? '5 Ring-fenced Subholdings & legal capital routing flow'
        : '5 Ring-fenced Subholdings & juridische kapitaalstromen',
      icon: Network,
      badge: '12 Ent.',
      badgeColor: 'text-[#2997ff] bg-[#0071e3]/15 border-[#2997ff]/30',
      activeClass: 'bg-[#0071e3]/25 text-white border-[#2997ff]/50 shadow-sm',
      iconColor: 'text-[#2997ff]'
    },
    {
      id: 'simulator' as const,
      label: 'IQ Bot / Agent',
      shortLabel: 'IQ Bot',
      description: language === 'en'
        ? 'Real-time agentic execution engine & high-tech talent broker'
        : 'Real-time autonome executiemotor & high-tech talent broker',
      icon: Bot,
      badge: 'Sim',
      pulse: true,
      badgeColor: 'text-[#30d158] bg-[#30d158]/15 border-[#30d158]/30',
      activeClass: 'bg-[#0071e3]/25 text-white border-[#2997ff]/50 shadow-sm',
      iconColor: 'text-[#30d158]'
    },
    {
      id: 'calculator' as const,
      label: language === 'en' ? 'Cohort Financial Model' : 'Cohort Rekenmodel',
      shortLabel: language === 'en' ? 'Cohort Model' : 'Rekenmodel',
      description: language === 'en'
        ? 'Strategic cohort compounding model over 12 rolling months'
        : 'Strategisch cohort-accumulatiemodel over 12 opeenvolgende maanden',
      icon: Calculator,
      badge: language === 'en' ? '78 Cycles' : '78 Cycli',
      badgeColor: 'text-[#2997ff] bg-[#0071e3]/15 border-[#2997ff]/30',
      activeClass: 'bg-[#0071e3]/25 text-white border-[#2997ff]/50 shadow-sm',
      iconColor: 'text-[#2997ff]'
    },
    {
      id: 'dossier' as const,
      label: 'Dossier',
      shortLabel: language === 'en' ? 'Dossier' : 'Dossier',
      description: language === 'en'
        ? '10 Detailed chapters of the institutional dossier'
        : '10 Uitgebreide hoofdstukken van het institutionele dossier',
      icon: BookOpen,
      badge: language === 'en' ? '10 Ch.' : '10 Ch.',
      badgeColor: 'text-[#2997ff] bg-[#0071e3]/15 border-[#2997ff]/30',
      activeClass: 'bg-[#0071e3]/25 text-white border-[#2997ff]/50 shadow-sm',
      iconColor: 'text-[#2997ff]'
    },
    {
      id: '3d' as const,
      label: language === 'en' ? 'Ecosystem' : 'Ecosysteem',
      shortLabel: language === 'en' ? '3D Space' : '3D Ecosysteem',
      description: language === 'en'
        ? 'Interactive WebGL 3D spatial orbit visualization'
        : 'Interactieve WebGL 3D ruimtelijke ecosysteem visualisatie',
      icon: Layers,
      badge: '3D',
      badgeColor: 'text-[#30d158] bg-[#30d158]/15 border-[#30d158]/30',
      activeClass: 'bg-[#0071e3]/25 text-white border-[#2997ff]/50 shadow-sm',
      iconColor: 'text-[#2997ff]'
    },
    {
      id: 'careers' as const,
      label: language === 'en' ? 'Careers' : 'Vacatures',
      shortLabel: language === 'en' ? 'Careers' : 'Vacatures',
      description: language === 'en'
        ? '13 open positions across tech, AI and real estate'
        : '13 vacatures — tech, AI & vastgoedgroep',
      icon: Briefcase,
      badge: language === 'en' ? '13 Roles' : '13 Posities',
      badgeColor: 'text-[#30d158] bg-[#30d158]/15 border-[#30d158]/30',
      activeClass: 'bg-[#0071e3]/25 text-white border-[#2997ff]/50 shadow-sm',
      iconColor: 'text-[#30d158]'
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
            badgeColor: 'text-[#2997ff] bg-[#0071e3]/15 border-[#2997ff]/30',
            activeClass: 'bg-[#0071e3]/25 text-white border-[#2997ff]/50 shadow-sm',
            iconColor: 'text-[#2997ff]'
          }
        ]
      : [])
  ];

  return (
    <AmountPrivacyProvider amountsVisible={amountsVisible} toggleAmounts={toggleAmounts}>
    <div
      className={`min-h-screen min-w-0 flex flex-col antialiased transition-colors duration-200 ${
        theme === 'light'
          ? 'bg-[#f5f5f7] text-[#1d1d1f] selection:bg-[#0071e3]/20 selection:text-[#0071e3]'
          : 'bg-black text-[#f5f5f7] selection:bg-[#0071e3] selection:text-white'
      }`}
    >
      {/* Serene Apple Glass Minimalist Header (`uiuxapple`) */}
      <header className="sticky top-0 z-40 apple-glass border-b border-white/[0.08] px-4 sm:px-6 lg:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left Area: Brand Identity */}
          <div
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
            title="QuantumInitium Ltd — Hoofdpagina"
          >
            <div className="w-9 h-9 rounded-2xl p-[1.5px] bg-gradient-to-b from-white/40 to-white/10 flex items-center justify-center shadow-lg shrink-0 overflow-hidden ring-1 ring-white/15 group-hover:scale-105 transition-transform">
              <img
                src={quantumInitiumLogo}
                alt="QuantumInitium Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-[14px]"
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-sm sm:text-base font-semibold tracking-[-0.02em] text-white flex items-center gap-1.5">
                  <span>QuantumInitium</span>
                  <span className="text-[10px] text-[#2997ff] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/12">
                    Ltd
                  </span>
                </h1>
                <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono text-[#30d158] bg-[#30d158]/10 border border-[#30d158]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#30d158] animate-pulse"></span>
                  UK Substance Verified
                </span>
              </div>
              <p className="text-[11px] text-[#86868b] hidden sm:block leading-tight">
                5 Subholdings • 12 Entiteiten • Londen UK
              </p>
            </div>
          </div>

          {/* Right Area: Minimal Active Section Indicator & Apple Hamburger Button */}
          <div className="flex items-center gap-2.5">
            {/* Contextual Active Module Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs text-[#86868b]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2997ff]"></span>
              <span className="text-white font-medium">
                {navTabs.find((t) => t.id === activeTab)?.label || 'Overzicht'}
              </span>
            </div>

            {/* Apple Pro Hamburger Menu Button */}
            <button
              id="main-hamburger-menu-btn"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 cursor-pointer transition-all duration-200 border ${
                menuOpen
                  ? 'bg-white text-black border-white shadow-lg scale-95 font-semibold'
                  : 'bg-white/[0.08] hover:bg-white/[0.14] text-white border-white/15'
              }`}
              aria-label={menuOpen ? 'Sluit hoofdmenu' : 'Open hoofdmenu'}
              aria-expanded={menuOpen}
            >
              <div className="w-4 h-4 flex items-center justify-center">
                {menuOpen ? (
                  <X className="w-4 h-4 text-black" />
                ) : (
                  <Menu className="w-4 h-4 text-[#2997ff]" />
                )}
              </div>
              <span className="font-medium tracking-tight">
                {menuOpen ? (language === 'en' ? 'Close' : 'Sluiten') : 'Menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Modern Accessible Hamburger Navigation Drawer (`modern-web-guidance`) */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Dimming Backdrop Overlay with Light Dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 cursor-pointer"
              aria-hidden="true"
            />

            {/* Slide-over Apple Glass Flyout Panel */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-md sm:max-w-lg apple-glass border-l border-white/[0.12] flex flex-col shadow-2xl overflow-hidden"
              role="dialog"
              aria-modal="true"
              aria-label={language === 'en' ? 'Main Menu' : 'Hoofdmenu'}
            >
              {/* Drawer Top Header */}
              <div className="p-4 sm:p-5 border-b border-white/[0.10] flex items-center justify-between shrink-0 bg-white/[0.02]">
                <div
                  onClick={() => {
                    setActiveTab('landing');
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-2xl p-[1.5px] bg-gradient-to-b from-white/40 to-white/10 flex items-center justify-center shadow-lg shrink-0 overflow-hidden ring-1 ring-white/15">
                    <img
                      src={quantumInitiumLogo}
                      alt="QuantumInitium Logo"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-semibold text-sm sm:text-base text-white tracking-tight">QuantumInitium</h2>
                      <span className="text-[10px] text-[#2997ff] font-mono font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/12">
                        Ltd
                      </span>
                    </div>
                    <p className="text-[11px] text-[#86868b] leading-tight">
                      {language === 'en' ? 'Ecosystem Directory & Portal' : 'Ecosysteem Directory & Portaal'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  className="p-2.5 rounded-full apple-btn-secondary text-white cursor-pointer hover:bg-white/[0.12] transition-colors"
                  aria-label={language === 'en' ? 'Close menu' : 'Sluit menu'}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Structured Drawer Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 no-scrollbar">
                {/* 1. Account & Authenticatie Blok */}
                <div className="apple-glass-card p-4 rounded-2xl border border-white/[0.12] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-semibold text-[#86868b] uppercase tracking-wider">
                      {language === 'en' ? 'Shareholder & Executive Portal' : 'Aandeelhouders- & Directieportaal'}
                    </span>
                    <span className="text-[10px] font-mono text-[#2997ff] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" />
                      Secured
                    </span>
                  </div>

                  {currentUser ? (
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#0071e3]/20 border border-[#2997ff]/40 flex items-center justify-center text-xs font-bold text-[#2997ff]">
                            {currentUser.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-white">{currentUser.name}</div>
                            <div className="text-[10px] text-[#86868b]">{currentUser.email}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#0071e3]/20 text-[#2997ff] border border-[#2997ff]/30">
                          {currentUser.role === 'admin' ? (language === 'en' ? 'Director' : 'Directie') : (language === 'en' ? 'Shareholder' : 'Aandeelhouder')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab(currentUser.role === 'admin' ? 'admin_dashboard' : 'investor_dashboard');
                            setMenuOpen(false);
                          }}
                          className="apple-btn-primary px-3 py-2 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Dashboard' : 'Naar Dashboard'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleLogout();
                            setMenuOpen(false);
                          }}
                          className="apple-btn-secondary px-3 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Sign Out' : 'Uitloggen'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <p className="text-xs text-[#86868b] leading-relaxed">
                        {language === 'en'
                          ? 'Access verified shareholder ledger, real-time EBITDA metrics, and executive documentation.'
                          : 'Toegang tot het geconsolideerde aandeelhoudersregister, EBITDA analyses en executiedossiers.'}
                      </p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('login');
                            setMenuOpen(false);
                          }}
                          className="apple-btn-secondary px-3 py-2 rounded-full text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <LogIn className="w-3.5 h-3.5 text-[#2997ff]" />
                          <span>{language === 'en' ? 'Sign In' : 'Inloggen'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveTab('register');
                            setMenuOpen(false);
                          }}
                          className="apple-btn-primary px-3 py-2 rounded-full font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>{language === 'en' ? 'Register' : 'Registreren'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Systeemvoorkeuren & Privacy Controles (voorheen de header clutter) */}
                <div className="apple-glass-card p-4 rounded-2xl border border-white/[0.12] space-y-3.5">
                  <span className="text-[10px] font-mono font-semibold text-[#86868b] uppercase tracking-wider block">
                    {language === 'en' ? 'System Controls & Privacy' : 'Systeemvoorkeuren & Privacy'}
                  </span>

                  {/* Privacy Toggle Row */}
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08]">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-white/[0.06] text-[#2997ff]">
                        {amountsVisible ? <Eye className="w-4 h-4 text-[#30d158]" /> : <EyeOff className="w-4 h-4 text-[#2997ff]" />}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-white">
                          {amountsVisible
                            ? (language === 'en' ? 'Amounts Visible' : 'Bedragen Zichtbaar')
                            : (language === 'en' ? 'Amounts Masked' : 'Bedragen Gemaskeerd')}
                        </div>
                        <div className="text-[10px] text-[#86868b]">
                          {amountsVisible
                            ? (language === 'en' ? 'Financial figures in plain view' : 'Waarderingen en saldi openbaar')
                            : (language === 'en' ? 'Private discreet display mode' : 'Privacy modus (••••••)')}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleAmounts}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 cursor-pointer transition-all border ${
                        amountsVisible
                          ? 'bg-[#30d158]/20 text-[#30d158] border-[#30d158]/40 shadow-sm'
                          : 'bg-white/[0.08] text-[#2997ff] border-white/15 hover:bg-white/[0.15]'
                      }`}
                    >
                      <span>👁️</span>
                      <span>{amountsVisible ? (language === 'en' ? 'Mask' : 'Maskeer') : (language === 'en' ? 'Reveal' : 'Toon')}</span>
                    </button>
                  </div>

                  {/* Theme & Language Dual Segmented Switches */}
                  <div className="grid grid-cols-2 gap-2 pt-0.5">
                    {/* Theme Switcher */}
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-[#86868b]">
                        {language === 'en' ? 'Appearance' : 'Weergave'}
                      </span>
                      <button
                        type="button"
                        onClick={toggleTheme}
                        className="apple-btn-secondary py-1.5 px-2.5 rounded-full text-xs flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-white font-medium">
                          {theme === 'dark' ? 'OLED Dark' : 'Light Mode'}
                        </span>
                        {theme === 'dark' ? (
                          <Sun className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <Moon className="w-3.5 h-3.5 text-[#0071e3]" />
                        )}
                      </button>
                    </div>

                    {/* Language Switcher */}
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] flex flex-col gap-2">
                      <span className="text-[10px] font-mono text-[#86868b]">
                        {language === 'en' ? 'Language' : 'Taal'}
                      </span>
                      <button
                        type="button"
                        onClick={toggleLanguage}
                        className="apple-btn-secondary py-1.5 px-2.5 rounded-full text-xs flex items-center justify-between cursor-pointer"
                      >
                        <span className="text-white font-medium">
                          {language === 'nl' ? 'Nederlands' : 'English'}
                        </span>
                        <Globe className="w-3.5 h-3.5 text-[#2997ff]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 3. Hoofdnavigatie & Modules (Alle opties uit de header) */}
                <div className="space-y-2.5">
                  <span className="text-[10px] font-mono font-semibold text-[#86868b] uppercase tracking-wider block px-1">
                    {language === 'en' ? 'Platform Navigation' : 'Hoofdnavigatie & Modules'}
                  </span>

                  <div className="space-y-1.5">
                    {navTabs.map((tab) => {
                      const isActive = activeTab === tab.id;
                      const IconComp = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(tab.id);
                            setMenuOpen(false);
                          }}
                          className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center justify-between group cursor-pointer ${
                            isActive
                              ? 'bg-[#0071e3]/20 border-[#2997ff]/50 shadow-md ring-1 ring-[#2997ff]/30 text-white'
                              : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-[#86868b] hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                              isActive
                                ? 'bg-[#0071e3] text-white shadow-sm'
                                : 'bg-white/[0.06] text-[#2997ff] group-hover:text-white'
                            }`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-[#f5f5f7]'}`}>
                                  {tab.label}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#86868b] truncate max-w-[210px] sm:max-w-xs">
                                {tab.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0 ml-2">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tab.badgeColor}`}>
                              {tab.badge}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-[#86868b] group-hover:translate-x-0.5 transition-transform" />
                          </div>
                        </button>
                      );
                    })}

                    {/* Careers item (specifiek met vacatures badge) */}
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('careers');
                        setMenuOpen(false);
                      }}
                      className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center justify-between group cursor-pointer ${
                        activeTab === 'careers'
                          ? 'bg-[#0071e3]/20 border-[#2997ff]/50 shadow-md ring-1 ring-[#2997ff]/30 text-white'
                          : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-[#86868b] hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                          activeTab === 'careers'
                            ? 'bg-[#0071e3] text-white shadow-sm'
                            : 'bg-white/[0.06] text-[#30d158] group-hover:text-white'
                        }`}>
                          <Briefcase className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-semibold ${activeTab === 'careers' ? 'text-white' : 'text-[#f5f5f7]'}`}>
                              {language === 'en' ? 'Careers & Vacancies' : 'Carrière & Vacatures'}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#86868b] truncate max-w-[210px] sm:max-w-xs">
                            {language === 'en' ? '13 Open positions across 5 subholdings' : '13 Open posities binnen 5 subholdings'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border text-[#30d158] bg-[#30d158]/15 border-[#30d158]/30">
                          13 Posities
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#86868b] group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </button>
                  </div>
                </div>

                {/* 4. Dossier Hoofdstukken Directe Snelsprong */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] font-mono font-semibold text-[#86868b] uppercase tracking-wider">
                      {language === 'en' ? 'Syllabus Dossier (10 Chapters)' : 'Syllabus Dossier (10 Hoofdstukken)'}
                    </span>
                    <span className="text-[10px] font-mono text-[#2997ff]">CH 01 - 10</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    {chapterList.map((ch) => {
                      const isSelected = activeTab === 'dossier' && currentChapter === ch.num;
                      return (
                        <button
                          key={ch.num}
                          type="button"
                          onClick={() => {
                            handleSelectChapter(ch.num);
                            setMenuOpen(false);
                          }}
                          className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer text-xs ${
                            isSelected
                              ? 'bg-[#0071e3]/25 border-[#2997ff] text-white font-semibold shadow-sm'
                              : 'bg-white/[0.04] border-white/[0.08] text-[#86868b] hover:text-white hover:bg-white/[0.08]'
                          }`}
                        >
                          <div className="font-mono text-[10px] text-[#2997ff] font-semibold">
                            CH {ch.tag}
                          </div>
                          <div className="font-medium text-[11px] text-white truncate mt-0.5">
                            {ch.title}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 5. Menu Footer: Substance & Governance Verification */}
              <div className="p-4 sm:p-5 border-t border-white/[0.10] bg-white/[0.02] flex items-center justify-between text-xs text-[#86868b] shrink-0">
                <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#30d158] font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>UK Substance Verified</span>
                </div>
                <div className="font-mono text-[11px] text-[#86868b]">
                  London EC2A • v2.4
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace Layout */}
      <div className="flex min-h-0 min-w-0 flex-1 w-full mx-auto overflow-hidden relative">

        {/* Upgraded Desktop Sidebar Navigation (Open / Collapsed Mode) — Omitted on Landing & Auth */}
        {(activeTab !== 'landing' && activeTab !== 'login' && activeTab !== 'register') && (
          sidebarOpen ? (
          <aside className="hidden md:flex flex-col w-80 border-r border-white/[0.08] apple-glass transition-all duration-300 h-[calc(100vh-61px)] shrink-0 z-30">
            {/* Sidebar Top: Navigator Title & Mode Switcher */}
            <div className="p-3.5 border-b border-white/[0.08] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold font-mono uppercase tracking-wider text-white">
                  <span className="w-2 h-2 rounded-full bg-[#30d158]"></span>
                  <span>Quantum Navigator</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-[#2997ff] border border-white/10">
                    v2.4
                  </span>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 rounded-full text-[#86868b] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    title={language === 'en' ? 'Collapse sidebar' : 'Zijpaneel inklappen'}
                  >
                    <PanelLeftClose className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Segmented Pill-Switcher (`uiuxapple` 4.3) */}
              <div className="grid grid-cols-3 bg-white/[0.06] p-1 rounded-full border border-white/10 text-xs">
                <button
                  onClick={() => setSidebarView('modules')}
                  className={`py-1.5 px-1.5 rounded-full font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    sidebarView === 'modules'
                      ? 'bg-[#0071e3] text-white font-semibold shadow-sm'
                      : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Modules</span>
                </button>
                <button
                  onClick={() => setSidebarView('chapters')}
                  className={`py-1.5 px-1.5 rounded-full font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    sidebarView === 'chapters'
                      ? 'bg-[#0071e3] text-white font-semibold shadow-sm'
                      : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Dossier</span>
                </button>
                <button
                  onClick={() => setSidebarView('entities')}
                  className={`py-1.5 px-1.5 rounded-full font-medium flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    sidebarView === 'entities'
                      ? 'bg-[#0071e3] text-white font-semibold shadow-sm'
                      : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>12 Ltd’s</span>
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
                        <PrivateAmount value="IPO" />
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
                  {false && (entityCategoryFilter === 'all' || entityCategoryFilter === 'subholdings') && filteredSubholdings.length > 0 && (
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
                        {amountsVisible ? item.role : maskAmounts(item.role ?? '')}
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
                      {item.website && (
                        <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono">
                          <a
                            href={item.website}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 hover:underline truncate max-w-[125px]"
                            title={`Open ${item.website}`}
                          >
                            <Globe className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{item.domain || item.website.replace(/^https?:\/\//, '')}</span>
                          </a>
                          {item.email && (
                            <a
                              href={`mailto:${item.email}`}
                              className="inline-flex items-center gap-1 text-slate-400 hover:text-amber-300 transition-colors truncate max-w-[120px]"
                              title={`Mail naar ${item.email}`}
                            >
                              <Mail className="w-2.5 h-2.5 shrink-0" />
                              <span className="truncate">{item.email}</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Sidebar Footer */}
            <div className={`p-3 border-t text-xs flex items-center justify-between ${
              theme === 'light'
                ? 'border-sky-200 bg-sky-50/80 text-sky-800'
                : 'border-slate-800 bg-slate-900/60 text-slate-400'
            }`}>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-emerald-500 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" /> UK Substance
              </span>
              <span className={`font-mono text-[11px] ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
                <PrivateAmount value="Beursrijp" />
              </span>
            </div>
          </aside>
        ) : (
          /* Slim Collapsed Rail (Desktop) */
          <aside className={`hidden md:flex flex-col w-14 border-r py-3 items-center justify-between shrink-0 h-[calc(100vh-61px)] z-30 ${
            theme === 'light'
              ? 'bg-white/95 border-sky-200 text-sky-950 shadow-sm'
              : 'bg-slate-950/90 border-slate-800 text-slate-100'
          }`}>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white border-sky-200 text-slate-600 hover:text-cyan-700 hover:border-cyan-300'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/40'
                }`}
                title="Zijpaneel uitklappen"
              >
                <PanelLeftOpen className="w-4 h-4" />
              </button>

              <div className={`w-6 h-[1px] my-1 ${theme === 'light' ? 'bg-sky-200' : 'bg-slate-800'}`} />

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
                        ? theme === 'light'
                          ? 'bg-sky-100 text-sky-800 border-sky-300 shadow-sm'
                          : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                        : theme === 'light'
                        ? 'bg-white border-sky-200 text-slate-600 hover:text-sky-900 hover:bg-sky-50'
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

              <div className={`w-6 h-[1px] my-1 ${theme === 'light' ? 'bg-sky-200' : 'bg-slate-800'}`} />

              <button
                onClick={() => {
                  setSidebarView('chapters');
                  setSidebarOpen(true);
                }}
                className={`p-2 rounded-xl border font-mono text-xs font-bold transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white border-sky-200 text-cyan-700 hover:bg-sky-50'
                    : 'bg-slate-900/60 border-slate-800 text-cyan-400 hover:bg-slate-800'
                }`}
                title={`Huidig hoofdstuk: 0${currentChapter}`}
              >
                0{currentChapter}
              </button>

              <button
                onClick={() => {
                  setSidebarView('entities');
                  setSidebarOpen(true);
                }}
                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                  theme === 'light'
                    ? 'bg-white border-sky-200 text-amber-600 hover:bg-amber-50'
                    : 'bg-slate-900/60 border-slate-800 text-amber-400 hover:bg-slate-800'
                }`}
                title="Entiteiten & Subholdings"
              >
                <Building2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="UK Substance Verified"></span>
            </div>
          </aside>
        ))}

        {/* Main Workspace Body */}
        <main className="flex min-h-0 min-w-0 flex-1 flex-col h-[calc(100vh-124px)] md:h-[calc(100vh-61px)] overflow-hidden bg-black relative">
          {accountSaveError && (
            <div className="absolute inset-x-3 top-3 z-50 rounded-xl border border-rose-500/40 bg-rose-950/90 px-4 py-3 text-xs text-rose-200 shadow-lg">
              {accountSaveError}
            </div>
          )}

          {/* TAB 0: APPLE PRO LANDING PAGE WITH MOTION DESIGN, FRAMER MOTION & 3D */}
          {activeTab === 'landing' && (
            <ErrorBoundary fallbackTitle="Landing Page Herstellen">
              <LandingPage
                theme={theme}
                language={language}
                subholdings={subholdingCardsData}
                entities={allEntitiesList}
                onNavigateTab={(tab) => setActiveTab(tab)}
                onSelectSubholding={(holdcoId, targetView) => handleSelectSubholding(holdcoId, targetView)}
                onSelectChapter={(chNum) => handleSelectChapter(chNum)}
              />
            </ErrorBoundary>
          )}

          {/* TAB 1: VISUAL FLOW ARCHITECTURE MAP */}
          {activeTab === 'architecture' && (
            <div className="flex-1 min-w-0 overflow-y-auto p-3 sm:p-5 lg:p-8 space-y-6 sm:space-y-8">
              <div className="apple-glass min-w-0 p-4 sm:p-7 rounded-3xl border border-white/12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 sm:gap-6">
                <div className="min-w-0 space-y-2">
                  <div className="flex items-center gap-2 text-[#2997ff] font-mono text-xs font-semibold uppercase tracking-widest">
                    <Network className="w-4 h-4" /> Strategische Architectuur
                  </div>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white tracking-[-0.03em] leading-tight break-words">
                    Vijf Gespecialiseerde Subholdings & Firewalling
                  </h2>
                  <p className="text-sm text-[#86868b] max-w-3xl leading-relaxed">
                    Geconsolideerde holdingstructuur rondom <strong>QuantumInitium Ltd (Moederholding)</strong>. Strikte juridische entiteitsscheiding (firewalling) elimineert kruisbesmetting van passiva tussen sectoren.
                  </p>
                </div>
              </div>

              {/* Interactive Network Diagram Container */}
              <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Network className="w-4 h-4 text-cyan-400" /> Network
                  </h3>
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
                        Overkoepelende kapitaalallocatie, IP beheer, M&A en governance
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
                      <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-cyan-700 font-semibold' : 'text-cyan-300'}`}>CRMos Ltd • Investbotiq Ltd • Spontiva Ltd</div>
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
                      <div className={`text-[10px] font-mono ${theme === 'light' ? 'text-emerald-700 font-semibold' : 'text-emerald-300'}`}>Boostplug • Logs.rent</div>
                      <p className={`text-[11px] ${theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'}`}>
                        GPU rekenkracht, account supply en bandbreedte monetarisering.
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
                    </div>
                  </div>
                </div>
                <p className={`text-xs leading-relaxed ${theme === 'light' ? 'text-sky-900/80' : 'text-slate-300'}`}>{activeSubholdingNode.desc}</p>
                <div className={`mt-4 pt-4 border-t ${theme === 'light' ? 'border-sky-100' : 'border-slate-800'}`}>
                  <h5 className={`text-xs font-bold uppercase tracking-wider mb-3 ${theme === 'light' ? 'text-sky-900/60' : 'text-slate-400'}`}>
                    Subholding Entiteiten & Strikte Risico Isolatie
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
                        <p className={`text-[11px] ${theme === 'light' ? 'text-sky-900/70' : 'text-slate-400'}`}>{amountsVisible ? e.role : maskAmounts(e.role ?? '')}</p>
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
                      <Zap className="w-4 h-4" /> Voer Automatische Ecosysteem-Allocatie Uit
                    </button>
                  </div>

                  {/* Status Monitor */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Investbotiq Workflow Engine:</span>
                      <span className="font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> OPERATIONEEL
                      </span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 leading-normal">
                      Verwerking: <span className="text-cyan-400">Realtime API</span> • Compliance Status:{' '}
                      <span className="text-emerald-400">GEVALIDEERD</span>
                    </div>
                  </div>
                </div>

                {/* Visual Execution Flow Outputs */}
                <div className="lg:col-span-2 glass-card p-7 rounded-2xl space-y-5">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
                      <Network className="w-4 h-4 text-amber-400" /> Autonoom Verdeelde Executie Sporen
                    </h3>
                    <span className="text-xs font-mono text-amber-400 font-bold">
                      <PrivateAmount value="€ 2.625 Output / mnd" />
                    </span>
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

                    {/* Spoor 2: Media & Distributie */}
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold tracking-wider">2. MEDIA & DISTRIBUTIE</span>
                        <Cpu className="w-4 h-4 text-cyan-400" />
                      </div>
                      <h4 className="font-bold text-white text-xs tracking-tight">Boostplug Ltd</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Combinatie van verkoop en generatie: Klanten kopen streaminggroei en reviewcampagnes; aangesloten leden genereren de streams en interacties via Logs.rent accountcapaciteit.
                      </p>
                      <div className="pt-2 border-t border-slate-800 text-xs font-mono text-cyan-300 font-bold">
                        <PrivateAmount value="€ 1.500 / mnd (Verkoop & Generatie)" />
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
                        <PrivateAmount value="€ 1.125 / mnd (LongStay + BnB)" />
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
                          {amountsVisible ? log : maskAmounts(log ?? '')}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COHORT CALCULATOR & FINANCIAL ENGINE */}
          {activeTab === 'calculator' && (
            <div className="flex-1 overflow-y-auto p-5 lg:p-8 space-y-8">
              <div className="glass-panel p-7 rounded-2xl border border-amber-500/30 gold-glow space-y-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold uppercase tracking-widest">
                  <Calculator className="w-4 h-4" /> Financiële Modelprojectie
                </div>
                <h2 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">12-Maandse Cohort-Accumulatie & Verdienmodel</h2>
                <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
                  Formule: <strong>78 cumulatieve maandcycli per lid</strong> over 12 maanden (sommatie 1 t/m 12), wat neerkomt op een geprojecteerd jaarvolume van <strong><PrivateAmount value="€ 204.750 per lid" /></strong>.
                </p>
              </div>

              {/* 4 Component Breakdown Cards conform bijlage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="glass-card p-5 rounded-xl border-l-4 border-l-cyan-500 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">MEDIA (STREAMING VERKOOP & GENERATIE)</span>
                  <div className="font-bold text-white text-sm">Boostplug Streaming Distributie</div>
                  <div className="text-2xl font-black text-cyan-400 font-mono"><PrivateAmount value="€ 1.000 / mnd" /></div>
                  <p className="text-xs text-slate-400 leading-normal">Klanten kopen Spotify/Apple Music streams; leden genereren luisteraars & play counts.</p>
                </div>

                <div className="glass-card p-5 rounded-xl border-l-4 border-l-emerald-500 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">MEDIA (REVIEWS & ACCOUNT BUNDELS)</span>
                  <div className="font-bold text-white text-sm">Boostplug Reviews & Accounts</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono"><PrivateAmount value="€ 500 / mnd" /></div>
                  <p className="text-xs text-slate-400 leading-normal">Klanten kopen Trustpilot/Google reviews; leden genereren interacties via gecontroleerde accounts op Logs.rent.</p>
                </div>

                <div className="glass-card p-5 rounded-xl border-l-4 border-l-amber-500 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">VASTGOED (LONG)</span>
                  <div className="font-bold text-white text-sm">WoningVry LongStay</div>
                  <div className="text-2xl font-black text-amber-400 font-mono"><PrivateAmount value="€ 750 / mnd" /></div>
                  <p className="text-xs text-slate-400 leading-normal">Structurele huisvesting IT professionals.</p>
                </div>

                <div className="glass-card p-5 rounded-xl border-l-4 border-l-yellow-400 space-y-1.5">
                  <span className="text-[10px] font-mono uppercase text-yellow-400 font-bold tracking-wider">VASTGOED (SHORT)</span>
                  <div className="font-bold text-white text-sm">WoningVry BnB</div>
                  <div className="text-2xl font-black text-yellow-400 font-mono"><PrivateAmount value="€ 375 / mnd" /></div>
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
                        <PrivateAmount value={`€ ${totalRevenue.toLocaleString('nl-NL')}`} />
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Jaarbasis via 12-mnd cohort</div>
                    </div>
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">BEOOGDE WAARDERING (4.0x)</span>
                      <div className="text-2xl lg:text-3xl font-black text-amber-400 font-mono mt-1 tracking-tight">
                        <PrivateAmount value={`€ ${valuation.toLocaleString('nl-NL')}`} />
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">Beoogde marktkapitalisatie</div>
                    </div>
                    <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">KOERS PER AANDEEL</span>
                      <div className="text-2xl lg:text-3xl font-black text-cyan-400 font-mono mt-1 tracking-tight">
                        <PrivateAmount value={`€ ${sharePrice.toFixed(2).replace('.', ',')}`} />
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
                <div className={`flex items-center gap-1.5 mt-3 pt-3 border-t overflow-x-auto no-scrollbar max-w-full ${theme === 'light' ? 'border-sky-100' : 'border-slate-800/80'}`}>
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

                  <button
                    onClick={() => setShowRoutesPanel((prev) => !prev)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                      showRoutesPanel
                        ? theme === 'light'
                          ? 'bg-cyan-100 text-cyan-900 border border-cyan-400 shadow-sm'
                          : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                        : theme === 'light'
                        ? 'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
                        : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
                    }`}
                    title="Onboarding Routes"
                  >
                    <RouteIcon className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-cyan-800' : 'text-cyan-400'}`} />
                    <span>Routes</span>
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
              {false && show3dCards && (
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
              {false && !show3dCards && (
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
                        {amountsVisible ? selectedEntityData.entity.role : maskAmounts(selectedEntityData.entity.role ?? '')}
                      </h4>
                    </div>

                    {/* Officiële Domein & Contactgegevens */}
                    {(selectedEntityData.entity.website || selectedEntityData.entity.email) && (
                      <div className={`p-3 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-mono ${
                        theme === 'light'
                          ? 'bg-white/90 border-sky-200 text-sky-950 shadow-sm'
                          : 'bg-slate-900/90 border-slate-800 text-slate-300'
                      }`}>
                        {selectedEntityData.entity.website && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 text-[10px] uppercase">Domein:</span>
                            <a
                              href={selectedEntityData.entity.website}
                              target="_blank"
                              rel="noreferrer"
                              className="text-cyan-400 hover:text-cyan-300 font-bold inline-flex items-center gap-1 underline"
                              title={`Bezoek ${selectedEntityData.entity.website}`}
                            >
                              <Globe className="w-3.5 h-3.5" />
                              <span>{selectedEntityData.entity.website.replace(/^https?:\/\//, '')}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                        {selectedEntityData.entity.email && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 text-[10px] uppercase">E-mail:</span>
                            <a
                              href={`mailto:${selectedEntityData.entity.email}`}
                              className="text-amber-400 hover:text-amber-300 font-bold inline-flex items-center gap-1 underline"
                              title={`Mail naar ${selectedEntityData.entity.email}`}
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>{selectedEntityData.entity.email}</span>
                            </a>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Live Website Propositie / Tagline */}
                    {selectedEntityData.entity.tagline && (
                      <div className={`p-3 rounded-xl border text-xs leading-relaxed font-medium ${
                        theme === 'light'
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-950'
                          : 'bg-amber-400/10 border-amber-400/25 text-amber-200'
                      }`}>
                        <span className="text-[10px] font-mono uppercase tracking-wider block font-bold mb-0.5 text-amber-400">
                          Officiële Platform Propositie:
                        </span>
                        <span className="italic font-semibold">"{selectedEntityData.entity.tagline}"</span>
                      </div>
                    )}

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
                        {amountsVisible ? selectedEntityData.entity.desc : maskAmounts(selectedEntityData.entity.desc ?? '')}
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
                          {amountsVisible ? selectedEntityData.entity.financialContribution : maskAmounts(selectedEntityData.entity.financialContribution ?? '')}
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
                            {amountsVisible ? selectedEntityData.entity.synergyEffect : maskAmounts(selectedEntityData.entity.synergyEffect ?? '')}
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
                                  {amountsVisible ? e.role : maskAmounts(e.role ?? '')}
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
                            <span className={theme === 'light' ? 'text-sky-950' : 'text-slate-200'}>{amountsVisible ? currentSubCard.model : maskAmounts(currentSubCard.model ?? '')}</span>
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
              {false && showSubholdingsModal && (
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
                                  handleSelectSubholding(sub.id, 'architecture');
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
                                  handleSelectSubholding(sub.id, '3d');
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

              {/* ONBOARDING ROUTES PANEL */}
              {showRoutesPanel && (
                <OnboardingRoutesPanel theme={theme} onClose={() => setShowRoutesPanel(false)} />
              )}
            </div>
          )}

          {/* TAB: VACATURES / CAREERS PAGINA */}
          {activeTab === 'careers' && (
            <div className="flex-1 overflow-y-auto h-full w-full">
              <CareersPage
                theme={theme}
                language={language}
                onNavigateHome={(t) => setActiveTab(t || 'landing')}
              />
            </div>
          )}

          {/* TAB: LOGIN PAGINA */}
          {activeTab === 'login' && (
            <div className="flex-1 overflow-y-auto h-full w-full">
              <LoginPage
                onLoginSuccess={handleLoginSuccess}
                onNavigateRegister={() => setActiveTab('register')}
                onNavigateHome={(t) => setActiveTab(t || 'landing')}
              />
            </div>
          )}

          {/* TAB: REGISTREER PAGINA */}
          {activeTab === 'register' && (
            <div className="flex-1 overflow-y-auto h-full w-full">
              <RegisterPage
                onRegisterSuccess={handleRegisterSuccess}
                onNavigateLogin={() => setActiveTab('login')}
                onNavigateHome={(t) => setActiveTab(t || 'landing')}
              />
            </div>
          )}

          {/* TAB: INVESTOR DASHBOARD */}
          {activeTab === 'investor_dashboard' && (
            <div className="flex-1 overflow-y-auto h-full w-full">
              <InvestorDashboard
                user={currentUser && currentUser.role !== 'admin' ? currentUser : DEMO_INVESTOR}
                emailEditable={isDemoModeEnabled}
                onLogout={handleLogout}
                onNavigateHome={(t) => setActiveTab(t || 'landing')}
                onUpdateShares={(newTotal) => {
                  if (currentUser) setCurrentUser({ ...currentUser, sharesOwned: newTotal });
                }}
                onUpdateUser={handleCurrentUserUpdate}
                theme={theme}
              />
            </div>
          )}

          {/* TAB: ADMIN DASHBOARD */}
          {activeTab === 'admin_dashboard' && (
            <div className="flex-1 overflow-y-auto h-full w-full">
              <AdminDashboard
                user={currentUser && currentUser.role === 'admin' ? currentUser : DEMO_ADMIN}
                managedAccounts={managedAccounts}
                accountsLoading={accountsLoading}
                emailEditable={isDemoModeEnabled}
                onUpdateAccount={handleManagedAccountUpdate}
                onLogout={handleLogout}
                onNavigateHome={(t) => setActiveTab(t || 'landing')}
                onSwitchRole={() => {
                  setCurrentUser(DEMO_INVESTOR);
                  setActiveTab('investor_dashboard');
                }}
                theme={theme}
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
    </AmountPrivacyProvider>
  );
}

export default App;
