import { NodeData } from '../types';

export const ecosystemData: Record<string, NodeData> = {
  Moederholding: {
    id: 'Moederholding',
    objectName: '01_QuantumInitium_TopPlatform',
    title: 'QuantumInitium Ltd (Moederholding)',
    subTitle: 'Centrale Moederholding en Directie (Londen, UK Substance)',
    desc: 'Centrale moederholding verantwoordelijk voor overkoepelende kapitaalallocatie, IP beheer, M&A strategie en institutionele governance.',
    entities: [
      {
        name: 'QuantumInitium Ltd',
        role: 'Top Platform en Moederholding',
        tagline: 'Holdingstructuur en strategisch deelnemingenoverzicht voor QuantumInitium Ltd',
        desc: 'Fysiek hoofdkantoor in Londen met minimaal 2 UK resident bestuurders en onafhankelijke Raad van Commissarissen (minimaal 50% onafhankelijk). Centrale kapitaalallocatie en IFRS beursvoorbereiding.',
        shape: 'octahedron',
        color: '#ffd700',
        type: 'Moederholding',
        compliance: 'UK Substance, UK GAAP, IFRS en beursgereedheid',
        website: 'https://quantuminitium.com',
        domain: 'quantuminitium.com',
        email: 'info@quantuminitium.com'
      }
    ],
    color: '#ffd700',
    accent: 'rgba(212, 175, 55, 0.4)',
    pos: [0, 3.2, 0],
    corporateDetails: {
      focus: 'Overkoepelend toezicht, M&A strategie, kapitaalallocatie en beursnotering',
      model: 'Holdingstructuur, geconsolideerde deelnemingen en dividendinkomsten',
      substance: 'Fysiek hoofdkantoor Londen, minimaal 2 UK bestuurders, 3 deskundige RvC commissarissen',
      firewalling: '100% juridische en financiële scheiding van operationele risicos per dochtermaatschappij'
    }
  },
  IP_Tech: {
    id: 'IP_Tech',
    objectName: 'Node_IP_Tech',
    title: 'IP en Tech Holdco',
    subTitle: 'Intellectual Property en Software Portfolio',
    desc: 'Beheert centrale AI modellen, proprietary algoritmes, data architecturen en enterprise B2B SaaS software.',
    entities: [
      {
        name: 'CRMos Ltd',
        role: 'Enterprise SaaS & Triple Enablement CRM',
        tagline: 'One Platform. Three Disciplines. One Connected Workflow. — From People to Performance',
        desc: 'Hybride CRM oplossing die Field Sales (door-to-door), Callcenters en Recruitment samenbrengt in één centraal platform. Geïnspireerd door en alternatief voor Salesdock, LeadDesk en Recruit CRM.',
        shape: 'cube',
        color: '#00f0ff',
        type: 'Flankerende Module',
        synergyWith: 'VVC Ltd, DJOBBA Ltd, Immigratiepunt Ltd',
        synergyEffect: 'Haalt operationele wrijving weg en digitaliseert de volledige talent- en contractcyclus',
        website: 'https://crmos.one',
        domain: 'crmos.one',
        email: 'info@crmos.one'
      },
      {
        name: 'Investbotiq Ltd',
        role: 'Centrale Executiemotor en Cashflow Platform',
        tagline: 'Automated Cashflow Platform & Autonome Executie Engine',
        desc: 'Centrale executie-engine en data-orkestratie van de holding. Coördineert ordercapaciteit, matching en geautomatiseerde cashflow-distributie over de operationele dochterondernemingen.',
        shape: 'diamond',
        color: '#38bdf8',
        type: 'Werkmaatschappij',
        financialContribution: 'Verdeelt en activeert de maandelijkse € 2.625 cycli per actief lid',
        synergyWith: 'Spontiva Ltd, VVC Ltd, Xabi World Ltd',
        synergyEffect: 'Activeert geautomatiseerde kasstroomtriggers, directe clearing koppeling en verificatie van geverifieerd talent',
        website: 'https://investbotiq.com',
        domain: 'investbotiq.com',
        email: 'info@investbotiq.com'
      },
      {
        name: 'Spontiva Ltd',
        role: 'Fintech Motor en Time Gap Cashflow (TGC)',
        tagline: 'TIME GAP CASHFLOW — Sluit direct aan op hoe geld door jouw bedrijf beweegt',
        desc: 'Brengt gepatenteerde TGC-methodes en Working Capital Optimization (WCO) in om het tijdsverschil tussen ontvangst (T=0) en verplichting (T=1) productief in te zetten.',
        shape: 'pyramid',
        color: '#22d3ee',
        type: 'Werkmaatschappij',
        financialContribution: 'Optimaliseert werkkapitaal-liquiditeit via Stichting Derdengelden voor directe herinvestering in operationele capaciteit',
        synergyWith: 'WoningVry Ltd, Boostplug Ltd, Investbotiq Ltd, DJOBBA Ltd',
        synergyEffect: 'Directe liquiditeitsallocatie, IT detacheringskasstroom absorptie en werkkapitaal financiering aangestuurd door het platform',
        website: 'https://spontiva.nl',
        domain: 'spontiva.nl',
        email: 'info@spontiva.nl'
      }
    ],
    color: '#00f0ff',
    accent: 'rgba(0, 240, 255, 0.35)',
    pos: [-10.5, 0.5, 4.5],
    corporateDetails: {
      focus: 'Softwareontwikkeling, intellectueel eigendom, geautomatiseerde executie en enterprise cloud software',
      model: 'B2B SaaS abonnementen, enterprise softwarelicenties en API integraties',
      governance: 'Gecertificeerde software IP bescherming en datasecurity protocollen'
    }
  },
  Fintech: {
    id: 'Fintech',
    objectName: 'Node_Fintech',
    title: 'Fintech en Liquidity Holdco',
    subTitle: 'Financiële Infrastructuur en Transactieverwerking',
    desc: 'Faciliteert geavanceerde clearing, liquiditeitsretentie en embedded financing zonder blootstelling aan traditioneel bancair balansrisico.',
    entities: [
      {
        name: 'Xabi World Ltd',
        role: 'Clearing en Betaalinfrastructuur (Xabi World Clearing Rails / Geen Eigen Banklicentie)',
        tagline: 'Meer overzicht voor de volgende stap — Financiële helderheid en Xabi World clearing',
        desc: 'Xabi World Ltd beheert de Xabi World betaalinfrastructuur en liquiditeitsretentie. Werkt exclusief via gecertificeerde BaaS en EMI partners (Wallester, Swan) en Stichting Derdengelden (Escrow rails).',
        shape: 'cylinder',
        color: '#10b981',
        type: 'Werkmaatschappij',
        compliance: '100% dekkend voor DNB, FCA en UK GDPR (KYC en AML)',
        synergyWith: 'DJOBBA Ltd, Spontiva Ltd, Investbotiq Ltd',
        synergyEffect: 'Houdt kapitaal binnen de gesloten cyclus van € 66.000 per 99 leden en verzorgt realtime Xabi World clearing',
        website: 'https://xabi.world',
        domain: 'xabi.world',
        email: 'info@xabi.world'
      }
    ],
    color: '#10b981',
    accent: 'rgba(16, 185, 129, 0.35)',
    pos: [-7.0, -1.8, -8.5],
    corporateDetails: {
      focus: 'Robuuste betaalrails, geautomatiseerde clearing en veilige derdengeldenscheiding',
      model: 'Transactievergoedingen, clearingcontracten en liquiditeitsretentie',
      governance: 'Volledige derdengeldenscheiding via Stichting Derdengelden (Escrow); geen bankbalansrisico'
    }
  },
  Talent: {
    id: 'Talent',
    objectName: 'Node_Talent',
    title: 'Talent en Gateway Holdco',
    subTitle: 'Human Capital en IT Detachering',
    desc: 'Gespecialiseerd in strategische talentacquisitie, internationale onboarding en flexibele IT detachering als continue capaciteitsbasis voor het ecosysteem.',
    entities: [
      {
        name: 'VVC Ltd',
        role: 'Verdienende Vrienden Club & Commercial Gateway Hub',
        tagline: 'Exclusief Ecosysteem voor High-Ticket Sales Talent & Partners',
        desc: 'Verdienende Vrienden Club (VVC) is een exclusief B2B partnernetwerk voor high-ticket sales talent, account executives en commerciële partners. Geen passief beleggingsinstrument; beloning uitsluitend op basis van gerealiseerde, gecontracteerde B2B transacties.',
        shape: 'sphere',
        color: '#38bdf8',
        type: 'Werkmaatschappij',
        synergyWith: 'Immigratiepunt Ltd, Investbotiq Ltd',
        synergyEffect: 'Verwerkt gevalideerde kennismigranten direct naar de autorisatie poort',
        website: 'https://vvc.works',
        domain: 'vvc.works',
        email: 'info@vvc.works'
      },
      {
        name: 'DJOBBA Ltd',
        role: 'B2B IT Detachering & Flexibele Pool',
        tagline: 'Next-Gen B2B IT Detachering & Flexibele Pool — Directe Xabi World Rails clearing',
        desc: 'Het Supabase-achtige B2B IT platform voor flexibele gigs en vaste IT contracten. Koppelt detacheringskasstromen met directe uitbetaling en Xabi World Rails clearing aan het ecosysteem.',
        shape: 'diamond',
        color: '#60a5fa',
        type: 'Werkmaatschappij',
        financialContribution: 'Start van de gesloten kapitaalrotatiecyclus via B2B IT contracten',
        synergyWith: 'Xabi World Ltd, VVC Ltd, Spontiva Ltd',
        synergyEffect: 'Koppelt detacheringskasstromen direct aan Time Gap Cashflow werkkapitaal optimalisatie en Xabi World clearing',
        website: 'https://djobba.works',
        domain: 'djobba.works',
        email: 'info@djobba.works'
      },
      {
        name: 'Immigratiepunt Ltd',
        role: 'Flankerende Module voor Visumaanvragen en Relocatie',
        tagline: 'Start je leven in Nederland — Bankzaken, huisvesting, werk en postadres helpers',
        desc: 'Flankerende module: Helpt nieuwkomers en internationale kennismigranten met bankzaken, huisvesting, werk en administratie in Nederland (NL, EN, AR) en verbindt postadres helpers.',
        shape: 'pyramid',
        color: '#93c5fd',
        type: 'Flankerende Module',
        synergyWith: 'VVC Ltd',
        synergyEffect: 'Gestructureerde continue toevoer van gekwalificeerd talent zonder administratieve frictie',
        website: 'https://immigratiepunt.nl',
        domain: 'immigratiepunt.nl',
        email: 'info@immigratiepunt.nl'
      },
      {
        name: 'Zheavenzy Ltd',
        role: 'Muziekplatform voor Independent Artiesten & Label',
        tagline: 'Het platform voor independent artiesten — Muziekdistributie & studio zonder wurgcontracten',
        desc: 'Alles-in-één platform voor de independent artiest: wereldwijde muziekdistributie, studiosessies, marketingcampagnes, events en boekingen met 100% eigenaarschap en royalty exploitatie.',
        shape: 'sphere',
        color: '#ec4899',
        type: 'Werkmaatschappij',
        financialContribution: 'Genereert inkomsten via muziekrechten, streaming royalties en media talent partnerships',
        synergyWith: 'VVC Ltd, Boostplug Ltd',
        synergyEffect: 'Koppelt talent onboarding en artiestenontwikkeling van VVC direct aan streaming en media exploitatie',
        website: 'https://zheavenzy.one',
        domain: 'zheavenzy.one',
        email: 'info@zheavenzy.one'
      }
    ],
    color: '#38bdf8',
    accent: 'rgba(56, 189, 248, 0.35)',
    pos: [7.0, -1.8, -8.5],
    corporateDetails: {
      focus: 'Gekwalificeerde IT kennismigranten, artiestentalent en muzieklabel, B2B detachering en geautomatiseerde contracten',
      model: 'Detacheringstarieven, muziekrechten royalties, plaatsingsvergoedingen en recurrente partnercontracten',
      governance: 'Strikte verificatiegate; beloning gekoppeld aan gecontracteerde prestaties'
    }
  },
  Compute: {
    id: 'Compute',
    objectName: 'Node_Compute',
    title: 'Compute en Media Holdco',
    subTitle: 'Digitale Distributie en Media Infrastructuur',
    desc: 'Infrastructuur voor streaming distributie, verified review campagnes en account escrow markten.',
    entities: [
      {
        name: 'Boostplug Ltd',
        role: 'Streaming & Reviews Growth Platform (Verkoop & Generatie)',
        tagline: 'Streaming & Reviews Growth Platform — Klanten Kopen, Leden Genereren',
        desc: 'Combinatie van verkoop en generatie: Zakelijke klanten kopen streaminggroei en geverifieerde reviews (Spotify, Apple Music, Trustpilot, Google Maps), terwijl aangesloten leden de daadwerkelijke streams, engagement en reviews genereren met organische drip-feed algoritmebescherming.',
        shape: 'cube',
        color: '#a855f7',
        type: 'Werkmaatschappij',
        financialContribution: 'Duaal verkoop- en generatiemodel van € 1.500 / maand per actief lid binnen de Viercomponentenmotor (€ 1.000 streaming + € 500 reviews)',
        synergyWith: 'Logs.rent, Spontiva Ltd, Zheavenzy Ltd',
        synergyEffect: 'Directe liquiditeitsallocatie, realtime cloud tracking en streaming distributie voor artiesten en ondernemingen',
        website: 'https://boostplug.one',
        domain: 'boostplug.one',
        email: 'info@boostplug.one'
      },
      {
        name: 'Logs.rent',
        role: 'Digital Asset Exchange & Account Marketplace',
        tagline: 'Digital Asset Exchange — Professionele accountverhuur, orderboeken & escrow',
        desc: 'Flankerende module: Professionele digitale marktplaats en beurs voor accountverhuur, accountverkoop, realtime orderboeken, veilige escrow en geautomatiseerde settlements.',
        shape: 'torus',
        color: '#c084fc',
        type: 'Flankerende Module',
        synergyWith: 'Boostplug Ltd',
        synergyEffect: 'Directe monetarisering van streaming- en media-accounts via realtime orderboeken',
        website: 'https://logs.rent',
        domain: 'logs.rent',
        email: 'info@logs.rent'
      }
    ],
    color: '#a855f7',
    accent: 'rgba(168, 85, 247, 0.35)',
    pos: [10.5, 0.5, 4.5],
    corporateDetails: {
      focus: 'Streaming mediadistributie, verified review netwerken en veilige account escrow',
      model: 'Campagnevergoedingen, accountverhuur marges en hosting fees',
      governance: 'Prudentieel afgeschermde escrow van vooruitontvangen gelden'
    }
  },
  RealEstate: {
    id: 'RealEstate',
    objectName: 'Node_RealEstate',
    title: 'Real Estate en Operations Holdco',
    subTitle: 'Vastgoedtechnologie en Exploitatie',
    desc: 'PropTech innovaties, geautomatiseerde verhuurworkflows en kwalitatieve woonoplossingen voor IT professionals.',
    entities: [
      {
        name: 'WoningVry Ltd',
        role: 'PropTech Woningplatform (Zonder BKR, Zonder Hypotheek)',
        tagline: 'Zonder BKR. Zonder hypotheek. Wél een woning — Woningen van €200k tot €650k',
        desc: 'Biedt woningen (€200.000 - €650.000) aan via een innovatieve non-hypotheekstructuur zonder BKR-check (500 plekken in 4 rondes in o.a. Amsterdam, Rotterdam, Utrecht, Almere, Eindhoven en Groningen). Beheert LongStay en dynamische BnB exploitatie.',
        shape: 'cylinder',
        color: '#f59e0b',
        type: 'Werkmaatschappij',
        financialContribution: 'Genereert € 1.125 / maand per actief lid binnen de Viercomponentenmotor',
        synergyWith: 'Afterstudenthousing Ltd, Spontiva Ltd',
        synergyEffect: 'Synergie met Afterstudenthousing voor huurdersretentie en met Spontiva voor werkkapitaal en liquiditeit',
        website: 'https://woningvry.nl',
        domain: 'woningvry.nl',
        email: 'info@woningvry.nl'
      },
      {
        name: 'Afterstudenthousing Ltd',
        role: 'Flankerende Module voor Young Professional Living',
        tagline: 'Young Professional Living — Doorgroeiwoningen voor afgestudeerden en starters',
        desc: 'Flankerende module: Directe upscale fase voor afgestudeerden en young professionals; waarborgt een structureel hogere bezettingsgraad en huurdersretentie voor het portfolio.',
        shape: 'octahedron',
        color: '#fbbf24',
        type: 'Flankerende Module',
        synergyWith: 'WoningVry Ltd',
        synergyEffect: 'Verhoogt de levensduurwaarde van bewoners en minimaliseert leegstand',
        website: 'https://woningvry.nl',
        domain: 'woningvry.nl',
        email: 'info@woningvry.nl'
      }
    ],
    color: '#f59e0b',
    accent: 'rgba(245, 158, 11, 0.35)',
    pos: [0, -3.2, 9.5],
    corporateDetails: {
      focus: 'Datagedreven vastgoedmatching, short stay en longstay woonconcepten voor expats',
      model: 'Periodieke huurstromen, dynamische dagtarieven en beheerfees',
      governance: 'Juridisch afgescheiden vastgoedholdings per pandencluster ter risico isolatie'
    }
  }
};
