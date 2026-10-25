export interface CompanyBrand {
  id: string;
  name: string;
  holdingKey: 'sub1' | 'sub2' | 'sub3' | 'sub4' | 'sub5' | 'mother';
  holdingName: string;
  category: 'tech' | 'fintech' | 'talent' | 'compute' | 'proptech' | 'media' | 'holding';
  type: string;
  tagline: string;
  role: string;
  website: string;
  domain: string;
  logoUrl: string;
  color: string;
  accentBg: string;
}

export const other11Companies: CompanyBrand[] = [
  {
    id: 'crmos',
    name: 'CRMos Ltd',
    holdingKey: 'sub1',
    holdingName: 'Subholding 1: IP & Tech',
    category: 'tech',
    type: 'Hybride CRM & SaaS',
    tagline: 'One Platform. Three Disciplines. One Connected Workflow.',
    role: 'Field Sales (D2D), Callcenters & Recruitment in één enterprise SaaS platform.',
    website: 'https://crmos.one',
    domain: 'crmos.one',
    logoUrl: '/logos/crmos.svg',
    color: '#00f0ff',
    accentBg: 'rgba(0, 240, 255, 0.12)'
  },
  {
    id: 'investbotiq',
    name: 'Investbotiq Ltd',
    holdingKey: 'sub1',
    holdingName: 'Subholding 1: IP & Tech',
    category: 'tech',
    type: 'AI Executie Engine',
    tagline: 'Automated Cashflow Platform & Autonome Executie Engine',
    role: 'Centrale executiemotor voor realtime ordermatching en geautomatiseerde dividenddistributie.',
    website: 'https://investbotiq.com',
    domain: 'investbotiq.com',
    logoUrl: '/logos/investbotiq.png',
    color: '#38bdf8',
    accentBg: 'rgba(56, 189, 248, 0.12)'
  },
  {
    id: 'spontiva',
    name: 'Spontiva Ltd',
    holdingKey: 'sub1',
    holdingName: 'Subholding 1: IP & Tech',
    category: 'tech',
    type: 'Time Gap Cashflow (TGC)',
    tagline: 'TIME GAP CASHFLOW — Sluit direct aan op hoe geld beweegt',
    role: 'Working Capital Optimization (WCO) om kapitaalrotatie tussen T=0 en T=1 te versnellen.',
    website: 'https://spontiva.nl',
    domain: 'spontiva.nl',
    logoUrl: '/logos/spontiva.svg',
    color: '#22d3ee',
    accentBg: 'rgba(34, 211, 238, 0.12)'
  },
  {
    id: 'xabi',
    name: 'Xabi World Ltd',
    holdingKey: 'sub2',
    holdingName: 'Subholding 2: Fintech & Liquidity',
    category: 'fintech',
    type: 'Clearing & Escrow Rails',
    tagline: 'Financiële helderheid en Xabi World clearing rails',
    role: 'Fintech clearing hub, BaaS/EMI integraties en Stichting Derdengelden escrow.',
    website: 'https://xabi.world',
    domain: 'xabi.world',
    logoUrl: '/logos/xabi.svg',
    color: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.12)'
  },
  {
    id: 'vvc',
    name: 'VVC Ltd',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'talent',
    type: 'Commercial Partnernetwerk',
    tagline: 'Verdienende Vrienden Club — High-Ticket B2B Sales & Partners',
    role: 'Exclusief netwerk voor high-ticket sales professionals en gecontracteerde partnerdeals.',
    website: 'https://vvc.works',
    domain: 'vvc.works',
    logoUrl: '/logos/vvc.svg',
    color: '#fbbf24',
    accentBg: 'rgba(251, 191, 36, 0.12)'
  },
  {
    id: 'djobba',
    name: 'DJOBBA Ltd',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'talent',
    type: 'B2B IT Detachering',
    tagline: 'Next-Gen B2B IT Detachering & Flexibele Pool',
    role: 'Supabase-achtig B2B IT platform met directe Xabi World clearing en snelle match.',
    website: 'https://djobba.works',
    domain: 'djobba.works',
    logoUrl: '/logos/djobba.svg',
    color: '#60a5fa',
    accentBg: 'rgba(96, 165, 250, 0.12)'
  },
  {
    id: 'immigratiepunt',
    name: 'Immigratiepunt Ltd',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'talent',
    type: 'Kennismigranten & Relocatie',
    tagline: 'Start je leven in Nederland — Bankzaken, huisvesting en werk',
    role: 'Helpt kennismigranten en internationale IT specialisten met visum, huisvesting en werk.',
    website: 'https://immigratiepunt.nl',
    domain: 'immigratiepunt.nl',
    logoUrl: '/logos/immigratiepunt.svg',
    color: '#93c5fd',
    accentBg: 'rgba(147, 197, 253, 0.12)'
  },
  {
    id: 'zheavenzy',
    name: 'Zheavenzy Ltd',
    holdingKey: 'sub3',
    holdingName: 'Subholding 3: Talent & Gateway',
    category: 'media',
    type: 'Muzieklabel & Distributie',
    tagline: 'Platform voor independent artiesten — Distributie & royalties',
    role: 'Muziekdistributie, studiosessies en smart contract royalties voor independent talent.',
    website: 'https://zheavenzy.one',
    domain: 'zheavenzy.one',
    logoUrl: '/logos/zheavenzy.svg',
    color: '#ec4899',
    accentBg: 'rgba(236, 72, 153, 0.12)'
  },
  {
    id: 'boostplug',
    name: 'Boostplug Ltd',
    holdingKey: 'sub4',
    holdingName: 'Subholding 4: Compute & Media',
    category: 'compute',
    type: 'Streaming & Reviews Growth',
    tagline: 'Streaming & Reviews Growth Platform — Klanten Kopen, Leden Genereren',
    role: 'Duaal model: B2B klanten kopen streaming & reviews; leden genereren de capaciteit via Logs.rent.',
    website: 'https://boostplug.one',
    domain: 'boostplug.one',
    logoUrl: '/logos/boostplug.svg',
    color: '#a855f7',
    accentBg: 'rgba(168, 85, 247, 0.12)'
  },
  {
    id: 'logsrent',
    name: 'Logs.rent',
    holdingKey: 'sub4',
    holdingName: 'Subholding 4: Compute & Media',
    category: 'compute',
    type: 'Digital Asset Exchange',
    tagline: 'Digital Asset Exchange — Professionele accountverhuur & escrow',
    role: 'Digitale beurs en marktplaats voor accountverhuur, orderboeken en geautomatiseerde settlements.',
    website: 'https://logs.rent',
    domain: 'logs.rent',
    logoUrl: '/logos/logsrent.svg',
    color: '#c084fc',
    accentBg: 'rgba(192, 132, 252, 0.12)'
  },
  {
    id: 'woningvry',
    name: 'WoningVry Ltd',
    holdingKey: 'sub5',
    holdingName: 'Subholding 5: Real Estate & Operations',
    category: 'proptech',
    type: 'Non-Hypotheek PropTech',
    tagline: 'Zonder BKR. Zonder hypotheek. Wél een woning — Woningen €200k–€650k',
    role: 'Innovatief non-hypotheek model voor kwalitatieve woningen en longstay beheer.',
    website: 'https://woningvry.nl',
    domain: 'woningvry.nl',
    logoUrl: '/logos/woningvry.svg',
    color: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.12)'
  }
];

export const allEcosystemCompanies: CompanyBrand[] = [
  {
    id: 'quantuminitium',
    name: 'QuantumInitium Ltd',
    holdingKey: 'mother',
    holdingName: 'QuantumInitium Ltd (Moederholding)',
    category: 'holding',
    type: 'Moederholding Londen HQ',
    tagline: 'Top Platform, IFRS Beursvoorbereiding & Kapitaalallocatie',
    role: 'Centrale moederholding, UK Substance in Londen, M&A strategie en kapitaalallocatie over 5 ring-fenced subholdings.',
    website: 'https://quantuminitium.com',
    domain: 'quantuminitium.com',
    logoUrl: '/quantum_initium_logo.svg',
    color: '#ffd700',
    accentBg: 'rgba(255, 215, 0, 0.14)'
  },
  ...other11Companies
];

export function getCompanyLogo(entityName: string): string | null {
  const normalized = entityName.toLowerCase().replace(/\s+/g, '');
  if (normalized.includes('quantum')) return '/quantum_initium_logo.svg';
  if (normalized.includes('crmos')) return '/logos/crmos.svg';
  if (normalized.includes('investbotiq')) return '/logos/investbotiq.png';
  if (normalized.includes('spontiva')) return '/logos/spontiva.svg';
  if (normalized.includes('xabi')) return '/logos/xabi.svg';
  if (normalized.includes('vvc')) return '/logos/vvc.svg';
  if (normalized.includes('djobba')) return '/logos/djobba.svg';
  if (normalized.includes('immigratiepunt')) return '/logos/immigratiepunt.svg';
  if (normalized.includes('zheavenzy')) return '/logos/zheavenzy.svg';
  if (normalized.includes('boostplug')) return '/logos/boostplug.svg';
  if (normalized.includes('logs')) return '/logos/logsrent.svg';
  if (normalized.includes('woningvry') || normalized.includes('afterstudenthousing')) return '/logos/woningvry.svg';
  return null;
}
