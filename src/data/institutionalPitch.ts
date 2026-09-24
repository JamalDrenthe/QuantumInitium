import {
  SynergyItem,
  FourComponentItem,
  GrowthProjection,
  CapTableItem,
  RoadmapStep,
  CapitalAllocationItem,
  GovernancePillar,
  InfiniteLoopStep
} from '../types';

export const pitchExecutiveSummary = {
  bedrijfsnaam: 'QuantumInitium Ltd',
  hoofdtitel: 'De Algoritmische Groeimotor',
  ondertitel: 'Geautomatiseerde Executie en Maximale Velocity of Money voor Institutionele Kapitaalgroei',
  vertrouwelijkheidslabel: 'Q4 2026 | Confidential en Proprietary | LSE Main Market Pre IPO Briefing',
  kernStatistieken: {
    aantalEntiteiten: 12,
    entiteitenVerdeling: '1 Moederholding, 6 Gespecialiseerde Werkmaatschappijen en 5 Flankerende Bedrijfsmodules',
    centraleEngine: '1 AI Executiemotor (Investbotiq Ltd / IQ Bot en Agent)',
    eerstejaarsTargetOmzet: 20475000,
    eerstejaarsTargetOmzetLabel: '€ 20.475.000',
    ledenBasisJaar1: 100,
    cumulatieveCycliJaar1: 7800,
    waarderingTarget: 81900000,
    waarderingTargetLabel: '€ 82M (€ 81.900.000)',
    multiple: '4,0x Price to Sales (P/S) over Jaar 1 omzetdoelstelling',
    beursnoteringDoel: 'London Stock Exchange (LSE) Main Market IPO medio 2027',
    uitgifteprijsPerAandeel: '€ 8,20',
    totaalAandelen: 10000000,
    nettoBeurskapitaal: '€ 22.000.000'
  }
};

export const corporateGovernanceData = {
  holdingNaam: 'QuantumInitium Ltd (Moederholding)',
  jurisdictie: 'Londen, Verenigd Koninkrijk',
  substanceKaders: [
    'Fysiek hoofdkantoor gevestigd in Londen',
    'Minimaal twee volwaardige UK resident bestuurders',
    'Rapportage en consolidatie strikt conform UK GAAP en IFRS standaarden'
  ],
  rvcKaders: [
    'Minimaal 3 onafhankelijke deskundige leden in de Raad van Commissarissen',
    'Minimaal 50% onafhankelijk toezicht gegarandeerd',
    'Direct toezicht op Audit, Financiële Verslaglegging, Beloningen en Compliance'
  ],
  juridischeFirewalling: {
    titel: 'Juridische Isolatie (Firewalling)',
    beschrijving: 'Strikte entiteitsscheiding over alle vijf subholdings en werkmaatschappijen.',
    risicoGarantie: 'Financiële en operationele risicos blijven 100% geïsoleerd per specifieke werkmaatschappij zonder doorbraak naar de Moederholding.'
  }
};

export const talentGatewayFlow = [
  {
    stapNummer: 1,
    titel: 'Stap 1: Invoer (Immigratiepunt Ltd)',
    type: 'Flankerende module voor visumaanvragen en internationale relocatie',
    beschrijving: 'Levert een gegarandeerde, continue instroom van gekwalificeerde internationale kennismigranten zonder logistieke wrijving.'
  },
  {
    stapNummer: 2,
    titel: 'Stap 2: Hub en Onboarding (VVC Ltd)',
    type: 'Centrale Gateway en Partnernetwerk',
    beschrijving: 'Geen passief beleggingsinstrument. Beloning uitsluitend gekoppeld aan gerealiseerde, gecontracteerde B2B transacties.'
  },
  {
    stapNummer: 3,
    titel: 'Stap 3: Autorisatie (API Koppeling en Verification Gate)',
    type: 'Beveiligde Doorstroom naar Centrale AI Engine',
    beschrijving: 'Geverifieerd talent wordt via beveiligde datastromen direct als brandstof doorgegeven aan Investbotiq voor autonome activatie.'
  }
];

export const investbotiqEngineFlow = {
  titel: 'Investbotiq Ltd (IQ Bot en Agent)',
  rol: 'Centrale AI Executiemotor en Autonome Waarde Activatie',
  invoer: 'Ontvangt geverifieerde talentstroom van VVC Ltd en artiesten van Zheavenzy Ltd, berekent capaciteitsbehoefte en activeert autonome executie triggers.',
  uitvoerSporen: [
    {
      sector: 'Fintech (Spontiva Ltd)',
      functie: 'Activeert kasstromen en TGC structuren; levert directe financiering aan clearing (Xabi World Ltd) en recruitment (DJOBBA Ltd).'
    },
    {
      sector: 'Compute en Cloud (Boostplug Ltd)',
      functie: 'Initieert GPU rekenkracht opdrachten en stream point monetarisering die de accountmarktplaats Logs.rent voeden.'
    },
    {
      sector: 'Vastgoed (WoningVry Ltd)',
      functie: 'Start geautomatiseerde workflows voor bezetting van huurwoningen, met latere doorstroom naar upscale huisvesting via Afterstudenthousing Ltd.'
    }
  ]
};

export const operationalSynergyMatrix: SynergyItem[] = [
  {
    kernEntiteit: 'VVC Ltd',
    flankerendeModule: 'Immigratiepunt Ltd',
    synergetischeVersnelling: 'Visumafhandeling en internationale relocatie; haalt logistieke vertraging uit talenttoevoer naar de centrale gateway.',
    effectType: 'Eliminatie van operationele frictie'
  },
  {
    kernEntiteit: 'VVC Ltd, DJOBBA Ltd, Immigratiepunt Ltd',
    flankerendeModule: 'CRMos Ltd',
    synergetischeVersnelling: 'Triple Enablement via AI outreach, recruitment ATS, dialers en geautomatiseerd contractbeheer (de technologische lijm).',
    effectType: 'Software en procesoptimalisatie'
  },
  {
    kernEntiteit: 'WoningVry Ltd',
    flankerendeModule: 'Afterstudenthousing Ltd',
    synergetischeVersnelling: 'Directe upscale fase voor jonge professionals en starters; waarborgt een structureel hogere bezettingsgraad en huurdersretentie.',
    effectType: 'Levenscyclus verlenging en bezetting'
  },
  {
    kernEntiteit: 'Boostplug Ltd',
    flankerendeModule: 'Logs.rent',
    synergetischeVersnelling: 'Gesloten marktplaats die de eigen GPU infrastructuur direct transformeert in liquide verhandelbare accountcapaciteit.',
    effectType: 'Directe asset monetarisering'
  },
  {
    kernEntiteit: 'Zheavenzy Ltd',
    flankerendeModule: 'Boostplug Ltd, VVC Ltd',
    synergetischeVersnelling: 'Muzieklabel en artiestentalent portaal; benut medianetwerk bandbreedte van Boostplug en talent onboarding van VVC voor streaming distributie en royalty monetarisering.',
    effectType: 'Media distributie en artistiek talent'
  }
];

export const viercomponentenmotor: FourComponentItem[] = [
  {
    naam: 'Boostplug GPU Mining',
    bedrag: 1000,
    omschrijving: 'Inzet van 5 GPU nodes voor AI inferentie, rendering en rekenintensieve zakelijke applicaties.',
    detail: '€ 1.000 per maand per actief lid',
    categorie: 'High Performance Compute'
  },
  {
    naam: 'Boostplug Stream Point Mining',
    bedrag: 500,
    omschrijving: 'Datastroom optimalisatie en bandbreedte monetarisering via het gedistribueerde medianetwerk.',
    detail: '€ 500 per maand per actief lid',
    categorie: 'Data en Bandbreedte'
  },
  {
    naam: 'WoningVry LongStay',
    bedrag: 750,
    omschrijving: 'Structurele, langdurige residentiële huisvesting voor IT professionals en internationale expats.',
    detail: '€ 750 per maand per actief lid',
    categorie: 'Vastgoed en Living'
  },
  {
    naam: 'WoningVry BnB',
    bedrag: 375,
    omschrijving: 'Short stay residentiële verhuur geoptimaliseerd met geautomatiseerde dynamische dagtarieven.',
    detail: '€ 375 per maand per actief lid',
    categorie: 'Flexibele Verhuur'
  }
];

export const gaussReeksGegevens = {
  formule: 'n(n + 1) / 2',
  uitlegMechanisme: 'Leden voegen maandelijks nieuwe capaciteit toe. Cycli accumuleren in 12 maanden tot 78 actieve cycli per lid (12 × 13 / 2 = 78).',
  waardePerLidPerJaar: 204750,
  waardeBerekening: '78 cycli × € 2.625 = € 204.750 economische waarde per lid op jaarbasis.',
  eersteTargetLeden: 100,
  eersteTargetCycli: 7800,
  geconsolideerdeJaaromzet: 20475000,
  jaar1Berekening: '100 actieve leden × 78 cycli = 7.800 totale cycli × € 2.625 = € 20.475.000 omzet.'
};

export const driejarigeGroeiprojecties: GrowthProjection[] = [
  {
    jaar: 'Jaar 1',
    titel: 'Launch en Notering',
    actieveLeden: 100,
    cumulatieveCycli: 7800,
    omzet: 20475000,
    omzetLabel: '€ 20.475.000',
    status: 'Basis voor beurswaardering',
    toelichting: 'Validatie van de Viercomponentenmotor en activatie van de eerste 100 actieve leden.'
  },
  {
    jaar: 'Jaar 2',
    titel: 'Europese Schaal',
    actieveLeden: 6000,
    cumulatieveCycli: 468000,
    omzet: 1228500000,
    omzetLabel: '€ 1.228.500.000',
    status: 'Uitrol via geautomatiseerde platforms',
    toelichting: 'Europese opschaling via wervingshubs, geautomatiseerde onboarding en cloud uitbreiding.'
  },
  {
    jaar: 'Jaar 3',
    titel: 'Maximale Capaciteit',
    actieveLeden: 9150,
    cumulatieveCycli: 713700,
    omzet: 1873462500,
    omzetLabel: '€ 1.873.462.500 (€ 1,87 miljard)',
    status: 'Maximale gecontroleerde infrastructuurbezetting',
    toelichting: 'Volledige infrastructuurbezetting met geoptimaliseerde brutomarges en internationale vestigingen.'
  }
];

export const fintechOpmData = {
  sabiRol: 'Xabi World Ltd fungeert als clearing hub en beheert de betaalinfrastructuur (SABI rails), maar draagt geen bancair balansrisico.',
  banklicentieVrij: 'Geen eigen banklicentie benodigd. Geen blootstelling aan traditionele bankrisicos.',
  baasPartners: 'BaaS en EMI Partners (bijvoorbeeld Wallester, Swan). Volledig operationeel onder gecertificeerde externe vergunningen.',
  stichtingDerdengelden: 'Volledige derdengeldenscheiding via Stichting Derdengelden (Escrow). Vooruitontvangen gelden blijven strikt afgeschermd totdat de prestatie geleverd is.',
  complianceDekking: '100% dekkend conform de toezichteisen van DNB, FCA en UK GDPR (volledige KYC en AML compliance).'
};

export const timeGapCashflowData = {
  titel: 'Kapitaalefficiëntie door Time Gap Cashflow (TGC)',
  ondertitel: 'Working Capital Optimization (WCO) gestuurd door Spontiva Ltd',
  t0: 'T=0: Ontvangst gelden (Escrow / Stichting Derdengelden)',
  t1: 'T=1: Uiteindelijke verplichting (Fysieke uitstroom van fondsen)',
  mechanisme: 'Spontiva Ltd structureert het tijdsverschil tussen vooruitontvangen middelen (zoals ticketverkoop en contractreserveringen) en de uiteindelijke uitstroom.',
  prudentieelBeheer: 'Fondsen blijven strikt afgeschermd in escrow totdat de tegenprestatie geleverd is, wat risicoloze, tijdelijke liquiditeit genereert (Other Platforms Money / OPM).'
};

export const infiniteLoopSteps: InfiniteLoopStep[] = [
  {
    stapNummer: 1,
    knooppunt: 'Knooppunt 1 (Start)',
    titel: 'Generatie Initiële Kasstromen',
    entiteiten: 'DJOBBA Ltd en VVC Ltd',
    mechanisme: 'Genereert initiële kasstromen via zakelijke B2B IT detacheringscontracten.'
  },
  {
    stapNummer: 2,
    knooppunt: 'Knooppunt 2 (Retentie)',
    titel: 'Betaalinfrastructuur en Vasthouden Middelen',
    entiteiten: 'Xabi World Ltd (SABI Clearing)',
    mechanisme: 'Beheert de betaalrails; middelen blijven binnen het ecosysteem behouden.'
  },
  {
    stapNummer: 3,
    knooppunt: 'Knooppunt 3 (Motor)',
    titel: 'Activatie Time Gap Cashflow en Toewijzing',
    entiteiten: 'Spontiva Ltd en Investbotiq Ltd',
    mechanisme: 'Spontiva activeert tijdelijke liquiditeit uit vooruitontvangen gelden (OPM); Investbotiq wijst WCO kapitaal toe.'
  },
  {
    stapNummer: 4,
    knooppunt: 'Knooppunt 4 (Herinvestering)',
    titel: 'Omzetting in Fysieke Productieve Assets',
    entiteiten: 'Boostplug Ltd en WoningVry Ltd',
    mechanisme: 'Vrijgekomen werkkapitaal wordt direct, zonder externe financiering, omgezet in hardware (GPU servers) en residentieel vastgoed.'
  },
  {
    stapNummer: 5,
    knooppunt: 'Knooppunt 5 (Expansie)',
    titel: 'Nieuwe Output Cycli per Lid',
    entiteiten: 'Ecosysteem Brede Output',
    mechanisme: 'Nieuwe assets genereren direct nieuwe € 2.625 maandcycli, wat een continu herhalende groeicyclus aandrijft zonder externe verwatering.'
  }
];

export const ipoHorizonData = {
  waarderingTitel: 'Aandelenstructuur en Wiskundig Onderbouwde Introductiewaarding',
  omzetDoelJaar1: 20475000,
  omzetDoelJaar1Label: '€ 20.475.000',
  multipleLabel: '4,0x Price to Sales (P/S)',
  beurswaardering: 81900000,
  beurswaarderingLabel: '€ 81.900.000 (€ 82M)',
  totaleAandelen: 10000000,
  aandelenLabel: '10.000.000 aandelen totaal',
  uitgifteprijsPerAandeel: '€ 8,20 per aandeel',
  capTable: [
    {
      aandeelhouder: 'Oprichter (7M Aandelen)',
      percentage: 70,
      aandelen: 7000000,
      aandelenLabel: '7.000.000 aandelen',
      rechten: 'Gewone aandelen met behoud van strategische controle. Geen verkoop van bestaande aandelen bij IPO (geen cash out).',
      kleur: '#3b82f6'
    },
    {
      aandeelhouder: 'Free Float (3M Aandelen)',
      percentage: 30,
      aandelen: 3000000,
      aandelenLabel: '3.000.000 aandelen',
      rechten: 'Nieuw uit te geven primaire aandelen via London Stock Exchange (LSE) Main Market. Inclusief Tag Along / Drag Along en anti dilution bescherming.',
      kleur: '#f59e0b'
    }
  ] as CapTableItem[]
};

export const beursgangRoadmap: RoadmapStep[] = [
  {
    periode: 'Q4 2026',
    titel: 'Trede 1: Governance en Adviseurs',
    beschrijving: 'Formele aanstelling van Britse corporate finance adviseurs, Nomads, advocaten en Big Four accountants.',
    mijlpalen: [
      'Aanstelling Britse adviseurs en advocaten',
      'Instelling onafhankelijke Raad van Commissarissen',
      'Activatie van het eerste 100 actieve leden doel'
    ]
  },
  {
    periode: 'Q1 2027',
    titel: 'Trede 2: Due Diligence en IFRS Audit',
    beschrijving: 'Uitvoering van integrale financiële, fiscale en juridische due diligence.',
    mijlpalen: [
      'Afronding formele IFRS audits over de gehele holding',
      'Opstelling en toetsing van het FCA goedgekeurde prospectus',
      'Fiscale structurering van UK Substance'
    ]
  },
  {
    periode: 'Q2 2027',
    titel: 'Trede 3: FCA Goedkeuring en LSE Toelating',
    beschrijving: 'Formele indiening van het prospectus bij de Financial Conduct Authority.',
    mijlpalen: [
      'Indiening prospectus bij de Financial Conduct Authority (FCA)',
      'Toelatingsaanvraag voor London Stock Exchange (LSE) Main Market',
      'Afronding toelatingsprocedures en compliance review'
    ]
  },
  {
    periode: 'Medio 2027',
    titel: 'Trede 4: IPO en Internationale IR Roadshow',
    beschrijving: 'Internationale investeerders roadshow, bookbuilding en beursnotering.',
    mijlpalen: [
      'Internationale investeerders roadshow en bookbuilding op € 8,20',
      'Officiële eerste handelsdag op LSE Main Market',
      'Opname van € 22.000.000 netto beurskapitaal via 3M nieuwe aandelen'
    ]
  }
];

export const kapitaalallocatieNettoBeursopbrengst: CapitalAllocationItem[] = [
  {
    categorie: 'Capaciteit en Infrastructuur',
    percentage: 35,
    bedrag: '€ 7,70M (€ 7.700.000)',
    doel: 'Aanschaf GPU mining servers, hardwareclusters en residentiële inrichting vastgoed.',
    toelichting: 'Directe aanschaf van fysieke GPU clusters en inrichting van WoningVry residenties voor expats.'
  },
  {
    categorie: 'Marketing en Expansie',
    percentage: 25,
    bedrag: '€ 5,50M (€ 5.500.000)',
    doel: 'Schaling naar 6.000 leden (Europese schaal) en opening internationale wervingshubs.',
    toelichting: 'Uitrol van Europese partnernetwerken en expansie naar belangrijke zakelijke expatmarkten.'
  },
  {
    categorie: 'R&D en Softwareontwikkeling',
    percentage: 20,
    bedrag: '€ 4,40M (€ 4.400.000)',
    doel: 'Doorontwikkeling van CRMos, Investbotiq algoritmes en Boostplug engines.',
    toelichting: 'Verdere automatisering van autonome executie triggers, datastromen en enterprise CRM.'
  },
  {
    categorie: 'Werkkapitaal en Reserves',
    percentage: 10,
    bedrag: '€ 2,20M (€ 2.200.000)',
    doel: 'Liquide buffer voor seizoensfluctuaties, operationele garanties en vergunningsreserves.',
    toelichting: 'Robuuste liquiditeitsbuffer voor prudentieel beheer en operationele continuïteit.'
  },
  {
    categorie: 'Strategische M&A',
    percentage: 10,
    bedrag: '€ 2,20M (€ 2.200.000)',
    doel: 'Gerichte overnames van complementaire tech startups en licentiepartners.',
    toelichting: 'Strategische toevoegingen van intellectueel eigendom en complementaire fintech technologie.'
  }
];

export const institutioneleVierPijlers: GovernancePillar[] = [
  {
    nummer: 1,
    titel: 'AI Gedreven Automatisering',
    ondertitel: 'Volledige executie zonder menselijke wrijving',
    inhoud: 'Investbotiq zet de gekwalificeerde talentinstroom onmiddellijk om in autonome, inkomstengenererende opdrachten in compute, fintech en vastgoed.',
    garanties: [
      'Directe allocatie van opdrachten zonder menselijke vertraging',
      'Geautomatiseerde monitoring van capaciteit en bezetting',
      'Naadloze datakoppelingen tussen alle 11 entiteiten'
    ]
  },
  {
    nummer: 2,
    titel: 'Voorspelbare Wiskunde',
    ondertitel: 'Gedetermineerde omzetbasis via Gauss',
    inhoud: 'De wiskundige synergie van de Viercomponentenmotor en de Reeks van Gauss garandeert een sluitende, transparante en voorspelbare omzetbasis (€ 20,4M bij slechts 100 leden).',
    garanties: [
      'Vaste brutomarge van € 2.625 per maand per actief lid',
      'Reeks van Gauss n(n+1)/2 creëert 78 cycli per lid per jaar',
      'Wiskundig getoetste schaling richting € 1,87 miljard in Jaar 3'
    ]
  },
  {
    nummer: 3,
    titel: 'Kapitaalefficiënte Synergie',
    ondertitel: 'Herinvestering zonder externe verwatering',
    inhoud: 'Gespecialiseerde flankerende modules verhogen de marges, terwijl Time Gap Cashflow een gesloten Infinite Loop aandrijft die continu assets financiert zonder extern risicokapitaal.',
    garanties: [
      'Gesloten cyclusvolume van € 66.000 per 99 leden',
      'Prudentieel escrow beheer van vooruitontvangen middelen (OPM)',
      'Directe autonome herinvestering in hardware en vastgoed'
    ]
  },
  {
    nummer: 4,
    titel: 'Institutionele Governance',
    ondertitel: 'Strikte compliance en LSE gereedheid',
    inhoud: 'Fysieke UK Substance in Londen, onafhankelijke RvC, IFRS audits en afgeschermde BaaS / EMI clearing maken het fundament gereed voor Tier 1 institutioneel kapitaal.',
    garanties: [
      'Juridische firewalling isoleert 100% van de bedrijfsrisicos',
      'Geen eigen banklicentie risico dankzij gecertificeerde BaaS partners',
      'LSE Main Market notering met heldere 70/30 aandelenverhouding'
    ]
  }
];
