export interface Vacancy {
  code: string; // '01' t/m '13'
  id: string;
  title: string;
  titleEn: string;
  domain: string;
  domainEn: string;
  domainCategory: 'corporate' | 'marketing' | 'partnerships' | 'recruitment' | 'sales' | 'strategy' | 'grants' | 'finance';
  remunerationSummary: string;
  remunerationSummaryEn: string;
  location: string;
  locationEn: string;
  locationType: 'remote' | 'hybrid';
  hours: string;
  hoursEn: string;
  contractType: string;
  contractTypeEn: string;
  experience: string;
  experienceEn: string;
  roleOverview: { nl: string; en: string };
  tasks: { nl: string[]; en: string[] };
  profile: { nl: string[]; en: string[] };
  remuneration: { nl: string[]; en: string[] };
  tags: string[];
}

export const generalTerms = {
  salary: {
    nl: 'Marktconform, op basis van ervaring en eerder dienstverband.',
    en: 'Market-conform, based on experience and previous employment history.'
  },
  vacation: {
    nl: '27 dagen (fulltime basis), met optie tot bijkopen of sparen.',
    en: '27 days paid vacation (full-time basis), with options to purchase or save additional days.'
  },
  workplace: {
    nl: '100% remote, inclusief thuiswerkvergoeding of hybride afhankelijk van de rol en tevens bespreekbaar.',
    en: '100% remote, including home-office allowance or hybrid depending on the role (negotiable).'
  },
  hardware: {
    nl: 'Laptop en smartphone in bruikleen.',
    en: 'Company laptop and smartphone provided on loan.'
  },
  homeOfficeSetup: {
    nl: 'Budget voor ergonomische thuiswerkplek (zit-sta bureau, monitor, bureaustoel).',
    en: 'Dedicated budget for ergonomic home office setup (sit-stand desk, external monitor, ergonomic chair).'
  },
  development: {
    nl: 'Toegang tot interne academie en certificeringstrajecten.',
    en: 'Access to internal training academy and professional certification tracks.'
  },
  events: {
    nl: 'Kwartaalborrels, jaarlijkse workation, hackathons.',
    en: 'Quarterly company social events, annual international workation, hackathons.'
  },
  educationLevel: {
    nl: 'HBO- of WO-werk- en denkniveau, of gelijkwaardige ervaring.',
    en: 'Bachelor’s or Master’s intellectual and working level, or equivalent practical experience.'
  }
};

export const applicationSteps = [
  {
    step: '01',
    name: { nl: 'KENNISMAKING', en: 'INTRODUCTION' },
    desc: {
      nl: 'Stuur je CV en LinkedIn-profiel met het gewenste vacature-ID (01 t/m 13).',
      en: 'Submit your CV and LinkedIn profile with your selected vacancy ID (01 through 13).'
    }
  },
  {
    step: '02',
    name: { nl: 'KENNISMAKINGSGESPREK (30 MIN)', en: 'INTRODUCTORY CALL (30 MIN)' },
    desc: {
      nl: 'Videogesprek over je trackrecord, beschikbaarheid en de vergoedingsstructuur.',
      en: 'Video consultation covering your track record, availability, and the compensation structure.'
    }
  },
  {
    step: '03',
    name: { nl: 'CONTRACT & SETUP', en: 'CONTRACT & SETUP' },
    desc: {
      nl: 'Toegang tot systemen, apparatuur in bruikleen en de interne academie.',
      en: 'System access, hardware provisioning, and access to the internal learning academy.'
    }
  },
  {
    step: '04',
    name: { nl: 'START', en: 'START' },
    desc: {
      nl: '100% remote, met persoonlijke begeleiding bij de eerste opdrachten.',
      en: '100% remote launch, with structured onboarding and coaching on initial assignments.'
    }
  }
];

export const domainFilters = [
  { id: 'all', label: { nl: 'Alle Domeinen', en: 'All Domains' } },
  { id: 'corporate', label: { nl: 'Corporate / Pre-IPO', en: 'Corporate / Pre-IPO' } },
  { id: 'marketing', label: { nl: 'Growth & Crowdfunding', en: 'Growth & Crowdfunding' } },
  { id: 'partnerships', label: { nl: 'Media, Tech & Events', en: 'Media, Tech & Events' } },
  { id: 'recruitment', label: { nl: 'Recruitment & Headhunting', en: 'Recruitment & Headhunting' } },
  { id: 'sales', label: { nl: 'B2B Sales & Closing', en: 'B2B Sales & Closing' } },
  { id: 'strategy', label: { nl: 'AI, Werkkapitaal & M&A', en: 'AI, Working Capital & M&A' } },
  { id: 'grants', label: { nl: 'R&D, AI & Subsidies', en: 'R&D, AI & Grants' } },
  { id: 'finance', label: { nl: 'Hardware & Vastgoed Funding', en: 'Hardware & Real Estate Funding' } }
];

export const vacanciesData: Vacancy[] = [
  {
    code: '01',
    id: 'qi-01-investor-relations-manager',
    title: 'Investor Relations Manager',
    titleEn: 'Investor Relations Manager',
    domain: 'Corporate / Pre-IPO',
    domainEn: 'Corporate / Pre-IPO',
    domainCategory: 'corporate',
    remunerationSummary: 'Salaris + succesfee',
    remunerationSummaryEn: 'Salary + success fee',
    location: '100% remote (reisbereidheid voor internationale roadshows)',
    locationEn: '100% remote (willingness to travel for international roadshows)',
    locationType: 'remote',
    hours: '32–40 per week',
    hoursEn: '32–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: '5+ jaar corporate finance, private equity, venture capital of IR',
    experienceEn: '5+ years in corporate finance, private equity, venture capital, or IR',
    roleOverview: {
      nl: 'Ter voorbereiding op een internationale beursnotering en meerdere kapitaalrondes zoeken wij een IR Manager. Je bent het vaste aanspreekpunt richting de financiële markt en onderhoudt relaties met institutionele beleggers, family offices en strategische co-investeerders.',
      en: 'In preparation for an international public listing and multiple capital rounds, we are seeking an IR Manager. You will be the key liaison for the institutional financial community, cultivating lasting partnerships with institutional investors, family offices, and co-investment syndicates.'
    },
    tasks: {
      nl: [
        'Werven en onboarden van institutionele investeerders en kapitaalverstrekkers',
        'Regisseren van de internationale IR-roadshow en het bookbuilding-proces',
        'Presenteren van groeimodellen, kwartaalcijfers en IFRS-rapportage aan investeringscomités',
        'Schakelen met corporate finance-adviseurs, toezichthouders, juristen en auditors'
      ],
      en: [
        'Originating and onboarding institutional investors and tier-1 capital providers',
        'Directing the international IR roadshow and the institutional bookbuilding process',
        'Presenting growth models, quarterly financial telemetry, and IFRS reporting to investment committees',
        'Interfacing with corporate finance advisors, market regulators, legal counsel, and auditors'
      ]
    },
    profile: {
      nl: [
        'HBO/WO in finance, economie of bedrijfskunde, of gelijkwaardige ervaring',
        'Aantoonbaar netwerk binnen institutioneel kapitaal, family offices en private equity',
        'Nederlands en Engels op boardroomniveau',
        'Ervaring met IFRS, kapitaalmarkttransacties en pre-IPO-trajecten'
      ],
      en: [
        'Bachelor’s or Master’s in finance, economics, business administration, or equivalent experience',
        'Verifiable network across institutional capital, family offices, and private equity',
        'Dutch and English proficiency at boardroom executive level',
        'Hands-on expertise with IFRS consolidation, capital market transactions, and pre-IPO processes'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Succesfee over elk door jou aangebracht en gecontracteerd investeringsvolume (percentage in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, aligned with track record and background',
        'Success fee on every contracted and completed investment volume (percentage negotiable)',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['Pre-IPO', 'IR', 'IFRS', 'Corporate Finance', 'Family Offices', 'Roadshows']
  },
  {
    code: '02',
    id: 'qi-02-campagnemanager-growth-crowdfunding',
    title: 'Campagnemanager (Growth & Crowdfunding)',
    titleEn: 'Campaign Manager (Growth & Crowdfunding)',
    domain: 'Growth & crowdfunding',
    domainEn: 'Growth & crowdfunding',
    domainCategory: 'marketing',
    remunerationSummary: 'Salaris + campagnevergoeding',
    remunerationSummaryEn: 'Salary + campaign fee',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '32–40 per week',
    hoursEn: '32–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: '3+ jaar growth marketing, B2B of crowdfunding',
    experienceEn: '3+ years in growth marketing, B2B campaigns, or crowdfunding',
    roleOverview: {
      nl: 'Je bent verantwoordelijk voor de B2B-wervingscampagnes en co-financieringstrajecten voor nieuwe hardware- en vastgoedprojecten. Je bouwt datagedreven funnels die op Europese schaal converteren.',
      en: 'You are responsible for B2B acquisition campaigns and co-financing workflows for hardware, compute, and real estate initiatives. You build and optimize data-driven growth funnels converting across European markets.'
    },
    tasks: {
      nl: [
        'Ontwerpen, lanceren en optimaliseren van crowdfunding- en ledenwervingscampagnes',
        'Uitrollen van multi-channel campagnes (LinkedIn, Meta, Google, programmatic, e-mail) voor Europese wervingshubs',
        'Continueren van A/B-tests op landingspagina\'s, advertenties en onboarding-flows',
        'Monitoren van campagnedata, acquisitiekosten (CAC) en funnelconversie'
      ],
      en: [
        'Designing, launching, and scaling crowdfunding and member-acquisition campaigns',
        'Executing multi-channel digital campaigns (LinkedIn, Meta, Google, programmatic, email) across European hubs',
        'Running continuous A/B multivariate tests on landing environments, creative assets, and onboarding flows',
        'Monitoring campaign performance telemetry, customer acquisition costs (CAC), and pipeline conversion'
      ]
    },
    profile: {
      nl: [
        'HBO/WO in marketing, communicatie of data-analyse, of gelijkwaardige ervaring',
        'Minimaal 3 jaar ervaring met B2B performance marketing, leadgeneratie of grootschalige crowdfundingcampagnes',
        'Sterk in zowel copywriting als data-analyse',
        'Ondernemend en resultaatgericht'
      ],
      en: [
        'Bachelor’s or Master’s in marketing, communications, data analytics, or equivalent experience',
        '3+ years in B2B performance marketing, demand generation, or large-scale crowdfunding campaigns',
        'Strong mastery of both persuasive copywriting and cohort data analytics',
        'Entrepreneurial drive with a relentless focus on measurable conversion results'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Vergoeding per succesvol geactiveerd B2B-lid en per voltooide financieringscampagne',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, based on experience and previous results',
        'Campaign performance bonus per activated B2B member and completed financing milestone',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['Growth Marketing', 'Crowdfunding', 'B2B Funnels', 'Performance Ads', 'Data Analytics']
  },
  {
    code: '03',
    id: 'qi-03-sponsor-partnership-manager',
    title: 'Sponsor- & Partnership Manager',
    titleEn: 'Sponsor & Partnership Manager',
    domain: 'Media, tech, events',
    domainEn: 'Media, tech, events',
    domainCategory: 'partnerships',
    remunerationSummary: 'Salaris + dealvergoeding',
    remunerationSummaryEn: 'Salary + deal commission',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '24–40 per week',
    hoursEn: '24–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: '3+ jaar B2B-partnerships, media of sponsoring',
    experienceEn: '3+ years in B2B partnerships, media commercialization, or sponsorships',
    roleOverview: {
      nl: 'Je sluit commerciële samenwerkingen, sponsorcontracten en strategische allianties voor de media-, compute- en community-platforms van de groep.',
      en: 'You originate and close commercial collaborations, sponsorship agreements, and strategic alliances across the media, compute, and community hubs of the group.'
    },
    tasks: {
      nl: [
        'Binnenhalen van B2B-sponsors, adverteerders en mediapartners voor evenementen, platforms en hubs',
        'Initiëren van samenwerkingen met hardwareleveranciers, vastgoedpartijen en softwarelicentiepartners',
        'Ontwikkelen van sponsorpakketten en joint-venture-voorstellen',
        'Voeren van onderhandelingen van eerste pitch tot getekend contract'
      ],
      en: [
        'Securing high-tier B2B sponsors, brand advertisers, and media partners for corporate platforms and summits',
        'Initiating strategic syndicates with enterprise hardware vendors, proptech owners, and software licensors',
        'Designing high-value sponsorship packages, bespoke partnership tiers, and joint-venture frameworks',
        'Conducting commercial deal negotiations from initial executive pitch through contractual execution'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of vergelijkbare werkervaring',
        'Ervaring in B2B-sales, sponsorwerving, media-exploitatie of strategic partnerships',
        'Commercieel sterk, representatief en zelfsturend'
      ],
      en: [
        'Bachelor’s or Master’s level, or equivalent proven sales trajectory',
        'Track record in enterprise B2B sales, corporate sponsorships, media sales, or strategic partnerships',
        'Commercially astute, executive presentation presence, and highly self-directed'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Dealvergoeding: percentage van elke gecontracteerde sponsor- of partnership-deal (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, commensurate with senior experience',
        'Deal commission: percentage on every contracted sponsorship or commercial partnership',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['Sponsorships', 'Strategic Alliances', 'Media Exploitation', 'B2B Contracts', 'High-Level Deals']
  },
  {
    code: '04',
    id: 'qi-04-executive-search-consultant',
    title: 'Executive Search Consultant',
    titleEn: 'Executive Search Consultant',
    domain: 'Boardroom & C-level',
    domainEn: 'Boardroom & C-level',
    domainCategory: 'recruitment',
    remunerationSummary: 'Salaris + plaatsingsfee',
    remunerationSummaryEn: 'Salary + placement fee',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '32–40 per week',
    hoursEn: '32–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: '5+ jaar executive search of boardroom consulting',
    experienceEn: '5+ years in executive search or boardroom consulting',
    roleOverview: {
      nl: 'Je werft boardroomposities voor de eigen holdings en voor opdrachtgevers van de B2B recruitment-marketplace. Je opereert op strategisch niveau en bent verantwoordelijk voor het vinden en binden van bestuurders en toezichthouders.',
      en: 'You recruit boardroom and top-tier C-level appointments for our holdings and corporate clients of our B2B recruitment marketplace. Operating at board level, you locate and secure executive officers and supervisory board directors.'
    },
    tasks: {
      nl: [
        'Werven van statutaire directieleden, non-executive directors (RvC) en country managers',
        'Plaatsen van C-level executives (CIO, CTO, Chief AI Officer, VP Engineering) bij externe opdrachtgevers',
        'Begeleiden van het volledige search-, selectie- en benoemingsproces op boardroomniveau'
      ],
      en: [
        'Headhunting statutory directors, non-executive supervisory board members, and regional country managers',
        'Placing enterprise C-level technology leaders (CIO, CTO, Chief AI Officer, VP Engineering)',
        'Managing end-to-end confidential search, evaluation, and appointment workflows at the board level'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of gedegen praktijkervaring',
        'Minimaal 5 jaar ervaring bij een executive search-bureau of als senior headhunter voor C-level posities',
        'Gesprekspartner voor CEO\'s, commissarissen en investeringsmaatschappijen',
        'Nederlands en Engels vloeiend'
      ],
      en: [
        'Bachelor’s or Master’s degree, or equivalent veteran executive search background',
        '5+ years with a premier executive search firm or senior leadership boutique placing C-suite profiles',
        'Credible advisor to CEOs, supervisory board chairs, and institutional investment funds',
        'Fluent in Dutch and English (contractual boardroom fluency)'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Plaatsingsfee per geplaatste executive, gebaseerd op bruto jaarsalaris of contractwaarde (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, based on track record',
        'Placement fee per placed executive, benchmarked on gross annual package or contract value',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['Boardroom', 'C-Level', 'Executive Search', 'Supervisory Board', 'CTO/CIO Search']
  },
  {
    code: '05',
    id: 'qi-05-360-recruiter-it-tech-detachering',
    title: '360° Recruiter (IT & Tech-Detachering)',
    titleEn: '360° Recruiter (IT & Tech Staffing)',
    domain: 'IT-detachering',
    domainEn: 'IT staffing & contracting',
    domainCategory: 'recruitment',
    remunerationSummary: 'Salaris + margedeling',
    remunerationSummaryEn: 'Salary + margin share',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '24–40 per week',
    hoursEn: '24–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: '2+ jaar 360°-recruitment of IT-detachering',
    experienceEn: '2+ years in 360° recruitment or tech staffing/detachering',
    roleOverview: {
      nl: 'Je beheert zowel de klantkant (IT-detacheringsopdrachten) als de kandidatenkant (selectie en plaatsing van internationale specialisten die via de eigen relocatie-tak instromen).',
      en: 'You oversee both the client accounts (enterprise IT assignments) and candidate selection (qualifying and placing international tech specialists arriving through our integrated relocation pipelines).'
    },
    tasks: {
      nl: [
        'Binnenhalen van B2B IT-detacheringscontracten en aanvragen',
        'Matchen van vooraf geverifieerde kennismigranten en IT-professionals aan jouw klantportefeuille',
        'Voeren van tariefonderhandelingen, begeleiden van sollicitatiegesprekken en afsluiten van contracten via het recruitment-systeem'
      ],
      en: [
        'Acquiring enterprise IT staffing mandates and continuous B2B project requests',
        'Matching pre-vetted skilled tech migrants and senior developers to your corporate client portfolio',
        'Leading rate negotiations, facilitating technical interviews, and executing contracts via the digital platform'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of vergelijkbare ervaring',
        'Ervaring als 360°-recruiter, accountmanager of consultant in IT-, engineering- of tech-detachering',
        'Commercieel gedreven, proactief en relatiegericht',
        'Ervaring met moderne recruitmentsoftware en matchingtools'
      ],
      en: [
        'Bachelor’s or Master’s level, or demonstrable commercial recruiting excellence',
        'Experience as a 360° recruiter, account manager, or consultant in IT, software, or tech staffing',
        'Commercially relentless, proactive, and relationship-centric approach',
        'Skilled with modern ATS software, digital matching tools, and pipeline management'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Margedeling over gerealiseerde detacheringsomzet (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, reflective of past performance',
        'Continuous gross margin share over billed staffing revenue',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['IT Detachering', '360 Recruitment', 'Kennismigranten', 'Tech Talent', 'B2B Staffing']
  },
  {
    code: '06',
    id: 'qi-06-tech-headhunter-ai-engineering',
    title: 'Tech Headhunter (Global AI & Engineering Talent)',
    titleEn: 'Tech Headhunter (Global AI & Engineering Talent)',
    domain: 'AI & engineering',
    domainEn: 'AI & engineering',
    domainCategory: 'recruitment',
    remunerationSummary: 'Salaris + succesfee',
    remunerationSummaryEn: 'Salary + success fee',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '24–40 per week',
    hoursEn: '24–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: 'Aantoonbare ervaring in tech-sourcing of direct search',
    experienceEn: 'Demonstrable experience in technical talent sourcing or direct search',
    roleOverview: {
      nl: 'Je spoort wereldwijd AI-engineers, systeemarchitecten en senior developers op voor externe B2B-klanten en de eigen R&D-, AI- en hardware-afdelingen. Voor geplaatste kandidaten regelt de groep ook visum en huisvesting.',
      en: 'You locate world-class AI engineers, distributed systems architects, and senior developers for enterprise B2B partners and internal R&D clusters. The group facilitates full visa sponsorships, relocation, and corporate housing.'
    },
    tasks: {
      nl: [
        'Actief sourcen via GitHub, LinkedIn Recruiter, StackOverflow en eigen sourcing-tools',
        'Overtuigen van internationaal talent met het totaalpakket: baan, visum, relocatie en huisvesting',
        'Begeleiden van kandidaten door technische assessments tot contractondertekening'
      ],
      en: [
        'Proactively sourcing talent via GitHub, LinkedIn Recruiter, StackOverflow, and proprietary sourcing tooling',
        'Enrolling international specialists with our complete package: assignment, visa fast-track, and accommodation',
        'Guiding candidates through technical screening, coding assessments, and final contract signing'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of vergelijkbare praktijkervaring',
        'Ervaring met het sourcen van schaarse developers en engineers',
        'Bekend met Python, Rust, Kubernetes en LLM-architecturen',
        'Vloeiend Engels, comfortabel met kandidaten in verschillende tijdzones'
      ],
      en: [
        'Bachelor’s or Master’s level, or equivalent practical sourcing mastery',
        'Track record sourcing hard-to-find developers, quantitative researchers, and software engineers',
        'Familiarity with Python, Rust, Kubernetes, and LLM autonomous agent architectures',
        'Fluent in English, adept at coordinating across global time zones'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Succesfee per geplaatste en geverifieerde tech-specialist (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, according to technical sourcing seniority',
        'Direct success fee per verified and placed engineering specialist',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['AI Engineers', 'Rust/Python', 'Global Sourcing', 'Direct Search', 'Tech Talent']
  },
  {
    code: '07',
    id: 'qi-07-high-ticket-closer-b2b',
    title: 'High-Ticket Closer (B2B-Proposities)',
    titleEn: 'High-Ticket Closer (B2B Propositions)',
    domain: 'B2B-conversie',
    domainEn: 'B2B conversion & closing',
    domainCategory: 'sales',
    remunerationSummary: 'Salaris + commissie',
    remunerationSummaryEn: 'Salary + commission',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '24–40 per week (flexibele agenda)',
    hoursEn: '24–40 hours per week (flexible calendar)',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: 'Aantoonbaar trackrecord in high-ticket closing',
    experienceEn: 'Proven track record in closing high-ticket deals',
    roleOverview: {
      nl: 'Je voert de eindgesprekken met warme, voorgekwalificeerde zakelijke leads en sluit de deals voor de gecombineerde proposities (compute, digitale infrastructuur, zakelijk vastgoed). Koude acquisitie is geen onderdeel van de functie.',
      en: 'You conduct the closing meetings with pre-qualified inbound business leads and close modular ecosystem packages (compute, digital infrastructure, corporate housing). Cold calling is not part of this role.'
    },
    tasks: {
      nl: [
        'Voeren van consultatieve videocalls en telefoongesprekken met zakelijke beslissers',
        'Toelichten van de modulaire B2B-pakketten en het rendement van het ecosysteem',
        'Zorgen dat overeenkomsten tijdens of direct na het gesprek digitaal worden ondertekend',
        'Afstemmen met marketing en sales over leadkwaliteit'
      ],
      en: [
        'Conducting consultative video consultations and phone sessions with C-level and corporate buyers',
        'Elaborating on modular B2B packages and the compounding returns of the ecosystem',
        'Driving frictionless digital signature execution during or immediately following closing sessions',
        'Syncing closely with growth marketing and qualification reps regarding pipeline lead quality'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of gelijkwaardige saleservaring',
        'Trackrecord in consultative selling en high-ticket closing (bij voorkeur B2B SaaS, finance, vastgoed of consultancy)',
        'Sterk in actief luisteren, bezwaren behandelen en vertrouwen opbouwen',
        'Resultaatgericht en gedisciplineerd'
      ],
      en: [
        'Bachelor’s or Master’s level, or equivalent high-ticket sales background',
        'Demonstrated track record in consultative closing (preferably B2B SaaS, finance, real estate, or enterprise advisory)',
        'Exceptional active listening, objection reframing, and rapid authority building',
        'Highly disciplined, metric-driven, and commercially assertive'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Commissie per gecontracteerde B2B-transactie (percentage in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, commensurate with closing credentials',
        'Uncapped commission per contracted enterprise transaction (percentage negotiable)',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['High-Ticket Closing', 'B2B Deals', 'Consultative Sales', 'Inbound Leads', 'Digital Signatures']
  },
  {
    code: '08',
    id: 'qi-08-commercieel-agent-compute-housing',
    title: 'Commercieel Agent (Compute, Cloud & Corporate Housing)',
    titleEn: 'Commercial Agent (Compute, Cloud & Corporate Housing)',
    domain: 'Compute & huisvesting',
    domainEn: 'Compute, cloud & housing',
    domainCategory: 'sales',
    remunerationSummary: 'Salaris + doorlopende courtage',
    remunerationSummaryEn: 'Salary + recurring brokerage commission',
    location: '100% remote (eigen regio-indeling mogelijk)',
    locationEn: '100% remote (regional allocation possible)',
    locationType: 'remote',
    hours: 'Flexibel, 24–40 per week',
    hoursEn: 'Flexible, 24–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: 'Zelfstandige B2B-sales of agentuurervaring',
    experienceEn: 'Independent B2B sales or agency brokerage experience',
    roleOverview: {
      nl: 'Je vertegenwoordigt de commerciële eindproducten van de operationele clusters in de zakelijke markt: GPU-rekenkracht, zakelijke account-infrastructuur en short-/long-stay huisvesting voor expats en projectteams.',
      en: 'You represent the commercial offerings of our operational clusters: GPU server infrastructure, enterprise digital asset capacity, and premium corporate accommodation for international project teams.'
    },
    tasks: {
      nl: [
        'Verkopen van GPU-servers en digitale infrastructuur aan AI-bedrijven, mediabureaus en tech-ondernemingen',
        'Bemiddelen in B2B-huisvestingscontracten voor bedrijven die internationale specialisten huisvesten',
        'Opbouwen en beheren van een eigen klantenkring met meerjarige afnamecontracten'
      ],
      en: [
        'Selling dedicated GPU capacity and digital cloud infrastructure to AI labs, media firms, and high-tech enterprises',
        'Brokering B2B corporate housing contracts for organizations accommodating international specialists',
        'Building and servicing an independent client portfolio with multi-year recurring procurement agreements'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of gedegen commerciële achtergrond',
        'Sterk zakelijk netwerk in tech, media of corporate vastgoed',
        'Zelfstandig, plant eigen agenda, bouwt graag aan terugkerende omzet'
      ],
      en: [
        'Bachelor’s or Master’s level, or seasoned corporate agency background',
        'Established business rolodex across technology, digital media, or corporate real estate',
        'Independent operator, master of own schedule, dedicated to building recurring trail commissions'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Provisie per afgesloten B2B-transactie én doorlopende courtage over contractverlengingen van jouw portefeuille (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, aligned with commercial scope',
        'Transaction commission plus ongoing recurring trail courtage on all renewals across your portfolio',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['GPU Compute', 'Corporate Housing', 'Recurring Courtage', 'B2B Brokerage', 'Cloud Servers']
  },
  {
    code: '09',
    id: 'qi-09-b2b-sales-representative-saas',
    title: 'B2B Sales Representative (SaaS & Ecosysteem)',
    titleEn: 'B2B Sales Representative (SaaS & Ecosystem)',
    domain: 'SaaS & ecosysteem',
    domainEn: 'SaaS & ecosystem',
    domainCategory: 'sales',
    remunerationSummary: 'Salaris + commissie',
    remunerationSummaryEn: 'Salary + commission',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '32–40 per week',
    hoursEn: '32–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: 'Junior / medior / senior',
    experienceEn: 'Junior / mid / senior level',
    roleOverview: {
      nl: 'Je vult de commerciële pijplijn: je vertegenwoordigt de B2B SaaS-software (CRM, AI-outreach, workflow-automatisering) en de bredere ecosysteem-proposities, opent deuren bij nieuwe zakelijke klanten en zet contacten om in verkoopkansen en getekende orders.',
      en: 'You fill the commercial pipeline: presenting enterprise B2B SaaS suites (CRM, AI outreach, workflow orchestration) and cross-ecosystem products, unlocking executive access and converting conversations into signed agreements.'
    },
    tasks: {
      nl: [
        'Uitvoeren van gepersonaliseerde outbound campagnes via telefoon, videomessaging, e-mail en LinkedIn',
        'Geven van online productdemo\'s aan MKB- en enterprise-bedrijven',
        'Kwalificeren van zakelijke partijen en beheren van de eigen salesfunnel in samenwerking met de closers'
      ],
      en: [
        'Executing tailored multi-touch outbound prospecting via telephone, personalized video, email, and LinkedIn',
        'Conducting high-impact online product demonstrations for mid-market and enterprise prospects',
        'Qualifying enterprise accounts and managing sales stages in close partnership with senior deal closers'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of sterke aantoonbare saleservaring',
        'Communicatief vaardig, bestand tegen afwijzing, energie van nieuwe contacten',
        'Affiniteit met B2B SaaS, AI-tools en moderne salesmethodieken'
      ],
      en: [
        'Bachelor’s or Master’s level, or documented successful sales prospecting track record',
        'Eloquent communicator, resilient mindset, genuinely energized by initiating high-value conversations',
        'Affinity with enterprise SaaS products, AI automation tools, and modern consultative selling'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Commissie per gesloten B2B-deal, plus maandelijkse staffelbonus bij behalen van targets (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, tiered to experience level',
        'Direct commission per closed B2B deal plus tiered monthly accelerators upon target achievement',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['B2B SaaS', 'Outbound Sales', 'Demos', 'Pipeline Growth', 'Enterprise Software']
  },
  {
    code: '10',
    id: 'qi-10-senior-strategy-consultant-ma',
    title: 'Senior Strategy Consultant (AI, Werkkapitaal & M&A)',
    titleEn: 'Senior Strategy Consultant (AI, Working Capital & M&A)',
    domain: 'AI, werkkapitaal, M&A',
    domainEn: 'AI, working capital, M&A',
    domainCategory: 'strategy',
    remunerationSummary: 'Salaris + projectfee',
    remunerationSummaryEn: 'Salary + project fee',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '32–40 per week',
    hoursEn: '32–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: '7+ jaar strategy consulting, M&A of enterprise IT',
    experienceEn: '7+ years in strategy consulting, M&A, or enterprise IT advisory',
    roleOverview: {
      nl: 'Je adviseert op directie- en C-level over AI-automatisering, werkkapitaaloptimalisatie en het begeleiden van fusies, overnames en integraties binnen het ecosysteem.',
      en: 'You advise executive boards on AI autonomous execution engines, working capital optimization (WCO), and lead the structuring of mergers, acquisitions, and ecosystem platform integrations.'
    },
    tasks: {
      nl: [
        'Adviseren van middelgrote en grote ondernemingen over AI-executiemotoren, B2B clearing-API\'s en werkstroomautomatisering',
        'Identificeren, beoordelen (due diligence) en begeleiden van acquisities van tech-startups, softwarebedrijven en licentiepartners',
        'Opstellen van business cases op boardroomniveau'
      ],
      en: [
        'Advising mid-market and enterprise leadership on AI execution architectures, clearing APIs, and automation',
        'Originating, evaluating (technical & commercial due diligence), and executing acquisitions of software platforms',
        'Synthesizing institutional investment memoranda and quantitative business cases for board approval'
      ]
    },
    profile: {
      nl: [
        'WO-master in business, finance, economie of IT, of gelijkwaardig topniveau door ervaring',
        'Minimaal 7 jaar ervaring als strategy consultant, M&A-adviseur of enterprise transformation manager',
        'Diepgaand financieel inzicht (kasstroommodellen, waarderingen, WCO) en begrip van AI- en cloudarchitecturen'
      ],
      en: [
        'Master’s degree in business, corporate finance, economics, or computer science, or equivalent pedigree',
        '7+ years at a top-tier strategy consultancy, corporate M&A boutique, or enterprise transformation practice',
        'Deep financial modeling fluency (cashflow waterfalls, valuation multiples, WCO) paired with AI tech literacy'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Projectfee over de contractwaarde van elk enterprise-implementatietraject of afgeronde M&A-transactie (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, commanding executive compensation',
        'Project bonus / fee calculated on enterprise assignment contract values and closed M&A transactions',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['M&A', 'Strategy Consulting', 'Due Diligence', 'Working Capital', 'AI Architecture']
  },
  {
    code: '11',
    id: 'qi-11-subsidieconsultant-rd-vastgoed',
    title: 'Subsidieconsultant (R&D, AI & Duurzaam Vastgoed)',
    titleEn: 'Grant & Subsidy Consultant (R&D, AI & Sustainable Real Estate)',
    domain: 'R&D, AI, duurzaamheid',
    domainEn: 'R&D, AI, sustainability',
    domainCategory: 'grants',
    remunerationSummary: 'Salaris + succespercentage',
    remunerationSummaryEn: 'Salary + success percentage',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '24–40 per week',
    hoursEn: '24–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: '3+ jaar als subsidieadviseur of grant writer',
    experienceEn: '3+ years as grant advisor, subsidy consultant, or technical grant writer',
    roleOverview: {
      nl: 'Binnen het ecosysteem wordt geïnvesteerd in eigen R&D en duurzame fysieke infrastructuur. Je haalt nationale, Britse en Europese innovatiesubsidies, tech-grants en fiscale regelingen binnen.',
      en: 'Our group commits continuous capital to proprietary R&D and sustainable infrastructure. You capture Dutch, UK, and European innovation grants, high-tech research subsidies, and tax credit incentives.'
    },
    tasks: {
      nl: [
        'In kaart brengen van relevante regelingen (WBSO, MIT, Horizon Europe, UK Innovate, duurzaamheidsfondsen)',
        'Opstellen en indienen van technisch en financieel onderbouwde aanvragen in samenwerking met developers, AI-architecten en vastgoedmanagers',
        'Benutten van fiscale voordelen rond kennismigranten en Europese innovatiehubs',
        'Verzorgen van projectadministratie en eindverantwoording conform UK GAAP en IFRS'
      ],
      en: [
        'Mapping high-yield grant frameworks (WBSO, MIT, Horizon Europe, Innovate UK, net-zero green funds)',
        'Drafting and filing comprehensive technical and financial grant dossiers with engineers and architects',
        'Optimizing fiscal tax credits regarding skilled tech migrants and European innovation initiatives',
        'Managing compliant project telemetry, cost allocation, and audit reporting per UK GAAP and IFRS rules'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of vergelijkbare ervaring',
        'Aantoonbare ervaring als subsidieconsultant met sterk slagingspercentage, bij voorkeur op het snijvlak van IT, AI, innovatie en duurzaamheid',
        'Sterk in het vertalen van technische projecten naar beoordelingscriteria'
      ],
      en: [
        'Bachelor’s or Master’s level, or equivalent proven grant management background',
        'Documented track record with high grant success ratios at the intersection of AI, software, and real estate',
        'Exceptional capacity to articulate complex technical blueprints against regulatory evaluation matrices'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Succespercentage over elk daadwerkelijk toegekend subsidiebedrag of gerealiseerd fiscaal voordeel (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, based on track record',
        'Success fee percentage on all awarded non-dilutive grant capital and realized fiscal deductions',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['Subsidies', 'WBSO', 'Horizon Europe', 'Innovate UK', 'R&D Tax Credits', 'Green Real Estate']
  },
  {
    code: '12',
    id: 'qi-12-recruitment-consultant-international-talent',
    title: 'Recruitment Consultant (International Talent & Relocation)',
    titleEn: 'Recruitment Consultant (International Talent & Relocation)',
    domain: 'Internationaal talent',
    domainEn: 'International talent & relocation',
    domainCategory: 'recruitment',
    remunerationSummary: 'Salaris + plaatsingsfee',
    remunerationSummaryEn: 'Salary + placement fee',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '24–40 per week',
    hoursEn: '24–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: '1+ jaar recruitment of HR',
    experienceEn: '1+ years in recruitment, technical talent acquisition, or HR',
    roleOverview: {
      nl: 'Je bent verantwoordelijk voor de kandidaatkant: je begeleidt gekwalificeerde kennismigranten door het verificatieproces en matcht hen aan openstaande B2B-vacatures op het platform.',
      en: 'You are responsible for candidate onboarding: guiding qualified skilled migrants through compliance screening and matching them directly to live B2B requirements on our platform.'
    },
    tasks: {
      nl: [
        'Voeren van diepte-interviews en begeleiden van kandidaten door screening en verificatie',
        'Matchen van gevalideerde IT-, engineering- en tech-specialisten aan openstaande vacatures via het ATS',
        'Coördineren van de digitale overdracht na plaatsing, zodat zusterentiteiten visum, huisvesting en financiële onboarding in gang zetten'
      ],
      en: [
        'Conducting in-depth interviews and shepherding candidates through digital credential verification',
        'Matching validated software and engineering specialists to open mandates via our central ATS',
        'Coordinating seamless post-placement handover to sister divisions managing visas, housing, and clearing'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of vergelijkbare praktijkervaring',
        'Mensgericht en organisatorisch sterk',
        'Gestructureerd, vaardig met moderne HR-software',
        'Vloeiend Nederlands en Engels'
      ],
      en: [
        'Bachelor’s or Master’s degree, or equivalent human-centric recruitment experience',
        'People-oriented, highly organized, and communicative',
        'Methodical workflow mastery with contemporary HR tech stacks and ATS platforms',
        'Fluent in Dutch and English'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Plaatsingsfee per succesvolle, gecontracteerde B2B-plaatsing (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, based on experience',
        'Placement bonus on every completed, contracted enterprise placement',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['Recruitment', 'Kennismigranten', 'Relocation', 'Candidate Care', 'ATS']
  },
  {
    code: '13',
    id: 'qi-13-corporate-funding-broker',
    title: 'Corporate Funding Broker (Asset-Backed, Lease & Vastgoed)',
    titleEn: 'Corporate Funding Broker (Asset-Backed, Lease & Real Estate)',
    domain: 'Hardware & vastgoed',
    domainEn: 'Hardware & real estate funding',
    domainCategory: 'finance',
    remunerationSummary: 'Salaris + bemiddelingsfee',
    remunerationSummaryEn: 'Salary + brokerage fee',
    location: '100% remote',
    locationEn: '100% remote',
    locationType: 'remote',
    hours: '24–40 per week',
    hoursEn: '24–40 hours per week',
    contractType: '24–40 uur per week | zzp/freelance of vast contract',
    contractTypeEn: '24–40 hours per week | freelance/contractor or permanent contract',
    experience: '5+ jaar debt advisory, corporate finance of leasing',
    experienceEn: '5+ years in debt advisory, corporate finance, or asset leasing',
    roleOverview: {
      nl: 'Je structureert en bemiddelt zakelijke financieringen voor de uitbreiding van GPU-serverclusters, de vastgoedportefeuille en de interne factoring- en werkkapitaalfaciliteiten.',
      en: 'You structure and broker commercial debt facilities for the expansion of GPU server clusters, real estate portfolios, and internal factoring and working capital facilities.'
    },
    tasks: {
      nl: [
        'Ophalen en structureren van kredietlijnen, equipment lease-constructies en zakelijke vastgoedhypotheken',
        'Bemiddelen bij banken, private debt-fondsen en BaaS/EMI-partners voor factoring- en liquiditeitslijnen',
        'Presenteren van geconsolideerde cijfers (UK GAAP, IFRS) en onderpandstructuren aan kredietcomités'
      ],
      en: [
        'Originating and structuring credit lines, equipment lease mechanisms, and commercial real estate mortgages',
        'Brokering terms with tier-1 banks, private debt funds, and BaaS/EMI clearing partners for factoring lines',
        'Presenting consolidated financial statements (UK GAAP, IFRS) and collateral topologies to credit committees'
      ]
    },
    profile: {
      nl: [
        'HBO/WO, of gelijkwaardig vakmanschap',
        'Ervaring als zakelijk financieringsadviseur, debt broker, accountmanager grootzakelijk bij een bank of leasing-specialist',
        'Netwerk van kapitaalverstrekkers, leasemaatschappijen, private debt-fondsen en vastgoedfinanciers'
      ],
      en: [
        'Bachelor’s or Master’s level, or equivalent established capital markets craftsmanship',
        'Seasoned background as commercial debt broker, wholesale banking relationship manager, or leasing specialist',
        'Active relationships across institutional credit providers, equipment leasers, private credit funds, and mortgage lenders'
      ]
    },
    remuneration: {
      nl: [
        'Salaris in overleg, afhankelijk van ervaring',
        'Bemiddelingscourtage per afgesloten financieringslijn, hardware-lease of vastgoedhypotheek (in overleg)',
        'Arbeidsvoorwaarden zoals hierboven vermeld (laptop, smartphone, 27 vakantiedagen, thuiswerkbudget)'
      ],
      en: [
        'Salary negotiable, aligned with senior dealmaking background',
        'Brokerage courtage on every closed credit line, hardware lease facility, or real estate mortgage',
        'Full corporate benefits (laptop, smartphone, 27 vacation days, ergonomic home office stipend)'
      ]
    },
    tags: ['Debt Advisory', 'Asset-Backed Finance', 'Equipment Lease', 'Commercial Mortgages', 'Private Debt']
  }
];
