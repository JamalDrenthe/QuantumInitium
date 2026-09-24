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
        desc: 'Fysiek hoofdkantoor in Londen met minimaal 2 UK resident bestuurders en onafhankelijke Raad van Commissarissen (minimaal 50% onafhankelijk). Rapportage conform UK GAAP en IFRS.',
        shape: 'octahedron',
        color: '#ffd700',
        type: 'Moederholding',
        compliance: 'UK Substance, UK GAAP, IFRS en LSE Main Market gereedheid'
      }
    ],
    color: '#ffd700',
    accent: 'rgba(212, 175, 55, 0.4)',
    pos: [0, 3.2, 0],
    corporateDetails: {
      focus: 'Overkoepelend toezicht, M&A strategie, kapitaalallocatie en LSE beursnotering',
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
        role: 'Enterprise SaaS en Triple Enablement Platform',
        desc: 'Flankerende module: Triple Enablement via AI outreach, recruitment ATS, dialers en geautomatiseerd contractbeheer. De technologische lijm van het netwerk.',
        shape: 'cube',
        color: '#00f0ff',
        type: 'Flankerende Module',
        synergyWith: 'VVC Ltd, DJOBBA Ltd, Immigratiepunt Ltd',
        synergyEffect: 'Haalt operationele wrijving weg en digitaliseert de volledige talent en contractcyclus'
      },
      {
        name: 'Investbotiq Ltd',
        role: 'Centrale AI Executiemotor en Allocatie',
        desc: 'Het kloppend hart van de holding. Ontvangt talentstroom via API, berekent capaciteit en triggert autonome workflows in de operationele clusters.',
        shape: 'diamond',
        color: '#38bdf8',
        type: 'Werkmaatschappij',
        financialContribution: 'Verdeelt en activeert de maandelijkse € 2.625 cycli per actief lid',
        synergyWith: 'Spontiva Ltd, VVC Ltd, Xabi World Ltd',
        synergyEffect: 'Activeert autonome kasstroomtriggers, directe clearing koppeling en automatische intake van geverifieerd talent'
      }
    ],
    color: '#00f0ff',
    accent: 'rgba(0, 240, 255, 0.35)',
    pos: [-10.5, 0.5, 4.5],
    corporateDetails: {
      focus: 'Softwareontwikkeling, intellectueel eigendom, AI agent executie en enterprise cloud software',
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
        role: 'Clearing en Betaalinfrastructuur (SABI Clearing Rails / Geen Eigen Banklicentie)',
        desc: 'Xabi World Ltd beheert de SABI betaalinfrastructuur en liquiditeitsretentie. Werkt exclusief via gecertificeerde BaaS en EMI partners (Wallester, Swan) en Stichting Derdengelden (Escrow).',
        shape: 'cylinder',
        color: '#10b981',
        type: 'Werkmaatschappij',
        compliance: '100% dekkend voor DNB, FCA en UK GDPR (KYC en AML)',
        synergyWith: 'DJOBBA Ltd, Spontiva Ltd, Investbotiq Ltd',
        synergyEffect: 'Houdt kapitaal binnen de gesloten cyclus van € 66.000 per 99 leden en verzorgt realtime SABI clearing voor AI executie'
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
    desc: 'Gespecialiseerd in strategische talentacquisitie, internationale onboarding en flexibele IT detachering als continue brandstof voor het ecosysteem.',
    entities: [
      {
        name: 'VVC Ltd',
        role: 'Centrale Gateway en Partnernetwerk',
        desc: 'De centrale hub voor talentonboarding. Geen passief beleggingsinstrument; beloning uitsluitend op basis van gerealiseerde, gecontracteerde B2B transacties.',
        shape: 'sphere',
        color: '#38bdf8',
        type: 'Werkmaatschappij',
        synergyWith: 'Immigratiepunt Ltd, Investbotiq Ltd',
        synergyEffect: 'Verwerkt gevalideerde kennismigranten direct naar de autorisatie poort'
      },
      {
        name: 'DJOBBA Ltd',
        role: 'Transactiestroom en Flexibele IT Pool',
        desc: 'Genereert initiële kasstromen via zakelijke B2B IT detacheringscontracten met directe embedded financing via Xabi World Ltd.',
        shape: 'diamond',
        color: '#60a5fa',
        type: 'Werkmaatschappij',
        financialContribution: 'Start Knooppunt 1 van de Infinite Loop van kapitaalrotatie',
        synergyWith: 'Xabi World Ltd, VVC Ltd, Spontiva Ltd',
        synergyEffect: 'Koppelt detacheringskasstromen direct aan Time Gap Cashflow werkkapitaal optimalisatie en SABI clearing'
      },
      {
        name: 'Immigratiepunt Ltd',
        role: 'Flankerende Module voor Visumaanvragen en Relocatie',
        desc: 'Flankerende module: Verleent gespecialiseerde visa en relocatiediensten voor internationale kennismigranten; haalt logistieke vertraging uit de talenttoevoer.',
        shape: 'pyramid',
        color: '#93c5fd',
        type: 'Flankerende Module',
        synergyWith: 'VVC Ltd',
        synergyEffect: 'Gegarandeerde continue toevoer van gekwalificeerd talent zonder frictie'
      },
      {
        name: 'Zheavenzy Ltd',
        role: 'Muzieklabel en Talentportaal voor Artiesten',
        desc: 'Het officiële muzieklabel en talentportaal binnen het ecosysteem. Faciliteert artiestenontwikkeling, muziekrechten, streaming distributie en strategische IP monetarisering.',
        shape: 'sphere',
        color: '#ec4899',
        type: 'Werkmaatschappij',
        financialContribution: 'Genereert inkomsten via muziekrechten, streaming royalties en media talent partnerships',
        synergyWith: 'VVC Ltd, Boostplug Ltd',
        synergyEffect: 'Koppelt talent onboarding en artiestenontwikkeling van VVC direct aan streaming en media exploitatie'
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
    subTitle: 'Compute Cloud en Digitale Distributie',
    desc: 'Infrastructuur voor veeleisende compute workloads, GPU clusters en Time Gap Cashflow monetarisering.',
    entities: [
      {
        name: 'Boostplug Ltd',
        role: 'High Performance GPU Infrastructuur en Mining',
        desc: 'Verantwoordelijk voor GPU mining (€ 1.000 / mnd per lid via 5 GPU nodes) en Stream Point mining (€ 500 / mnd via medianetwerk bandbreedte).',
        shape: 'cube',
        color: '#a855f7',
        type: 'Werkmaatschappij',
        financialContribution: 'Genereert € 1.500 / maand per actief lid binnen de Viercomponentenmotor',
        synergyWith: 'Logs.rent, Spontiva Ltd, Zheavenzy Ltd',
        synergyEffect: 'Directe liquiditeitsallocatie, GPU compute clusters en high performance streaming bandbreedte voor artiesten'
      },
      {
        name: 'Logs.rent',
        role: 'Flankerende Module voor Verhandelbare Accountcapaciteit',
        desc: 'Flankerende module: Gesloten accountmarktplaats die de eigen hardware en GPU infrastructuur direct transformeert in liquide, verhandelbare capaciteit.',
        shape: 'torus',
        color: '#c084fc',
        type: 'Flankerende Module',
        synergyWith: 'Boostplug Ltd',
        synergyEffect: 'Directe monetarisering van overtollige GPU capaciteit zonder externe tussenpersonen'
      },
      {
        name: 'Spontiva Ltd',
        role: 'Fintech Motor en Time Gap Cashflow (TGC)',
        desc: 'Aangestuurd door Investbotiq. Activeert kasstromen en Working Capital Optimization (WCO) door het tijdsverschil tussen ontvangst (T=0) en verplichting (T=1) prudentieel productief te maken.',
        shape: 'pyramid',
        color: '#e879f9',
        type: 'Werkmaatschappij',
        financialContribution: 'Optimaliseert werkkapitaal (OPM) voor directe herinvestering in assets',
        synergyWith: 'WoningVry Ltd, Boostplug Ltd, Investbotiq Ltd, DJOBBA Ltd',
        synergyEffect: 'Directe liquiditeitsallocatie, IT detacheringskasstroom absorptie en werkkapitaal financiering aangestuurd door de AI engine'
      }
    ],
    color: '#a855f7',
    accent: 'rgba(168, 85, 247, 0.35)',
    pos: [10.5, 0.5, 4.5],
    corporateDetails: {
      focus: 'High performance servers, GPU clusters, data monetarisering en Time Gap Cashflow',
      model: 'Capaciteitsvergoedingen, mining output, hosting fees en Time Gap liquiditeit',
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
        role: 'PropTech Verhuurplatform (LongStay en BnB)',
        desc: 'Beheert residentieel vastgoed voor IT professionals en expats. Genereert binnen de Viercomponentenmotor LongStay (€ 750 / mnd) en BnB short stay (€ 375 / mnd met dynamische dagtarieven).',
        shape: 'cylinder',
        color: '#f59e0b',
        type: 'Werkmaatschappij',
        financialContribution: 'Genereert € 1.125 / maand per actief lid binnen de Viercomponentenmotor',
        synergyWith: 'Afterstudenthousing Ltd, Spontiva Ltd',
        synergyEffect: 'Synergie met Afterstudenthousing voor huurdersretentie en met Spontiva voor werkkapitaal en liquiditeit'
      },
      {
        name: 'Afterstudenthousing Ltd',
        role: 'Flankerende Module voor Upscale Young Professional Living',
        desc: 'Flankerende module: Directe upscale fase voor afgestudeerden en jonge starters; waarborgt een structureel hogere bezettingsgraad en huurdersretentie voor het portfolio.',
        shape: 'octahedron',
        color: '#fbbf24',
        type: 'Flankerende Module',
        synergyWith: 'WoningVry Ltd',
        synergyEffect: 'Verhoogt de levensduurwaarde van bewoners en minimaliseert leegstand'
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
