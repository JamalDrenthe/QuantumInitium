import React, { useState } from 'react';
import {
  Building2,
  Cpu,
  Calculator,
  Compass,
  Coins,
  ShieldCheck,
  TrendingUp,
  Repeat,
  PieChart as PieChartIcon,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  ArrowRight,
  X,
  FileText
} from 'lucide-react';
import {
  pitchExecutiveSummary,
  corporateGovernanceData,
  talentGatewayFlow,
  investbotiqEngineFlow,
  operationalSynergyMatrix,
  viercomponentenmotor,
  driejarigeGroeiprojecties,
  infiniteLoopSteps,
  timeGapCashflowData,
  fintechOpmData,
  ipoHorizonData,
  beursgangRoadmap,
  kapitaalallocatieNettoBeursopbrengst,
  institutioneleVierPijlers
} from '../data/institutionalPitch';
import { ecosystemData } from '../data/ecosystem';

interface InstitutionalDossierModalProps {
  isOpen?: boolean;
  isInline?: boolean;
  onClose?: () => void;
  onSelectNodeInCanvas?: (nodeKey: string) => void;
  onSwitchTo3D?: () => void;
}

type TabType =
  | 'summary'
  | 'entities'
  | 'aiGateway'
  | 'synergy'
  | 'calculator'
  | 'projections'
  | 'infiniteLoop'
  | 'ipoRoadmap'
  | 'allocation'
  | 'governance';

interface TabItem {
  id: TabType;
  chapterNumber: string;
  label: string;
  shortLabel: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  {
    id: 'summary',
    chapterNumber: '01',
    label: 'Strategisch Perspectief & Executief Overzicht',
    shortLabel: 'Executief',
    category: 'Executief',
    icon: Building2
  },
  {
    id: 'entities',
    chapterNumber: '02',
    label: '11 Entiteiten en Holdingstructuur',
    shortLabel: '11 Entiteiten',
    category: 'Organisatie',
    icon: Layers
  },
  {
    id: 'aiGateway',
    chapterNumber: '03',
    label: 'Talent en AI Executie Engine',
    shortLabel: 'AI Engine',
    category: 'Technologie',
    icon: Cpu
  },
  {
    id: 'synergy',
    chapterNumber: '04',
    label: 'Operationele Synergie Matrix',
    shortLabel: 'Synergie',
    category: 'Integratie',
    icon: Compass
  },
  {
    id: 'calculator',
    chapterNumber: '05',
    label: 'Viercomponentenmotor en Gauss Model',
    shortLabel: 'Gauss Calculator',
    category: 'Rekenmodel',
    icon: Calculator
  },
  {
    id: 'projections',
    chapterNumber: '06',
    label: 'Schaalbaarheid 2026 tot 2029',
    shortLabel: 'Projecties',
    category: 'Groei',
    icon: TrendingUp
  },
  {
    id: 'infiniteLoop',
    chapterNumber: '07',
    label: 'Infinite Loop en Time Gap Cashflow',
    shortLabel: 'Kapitaalrotatie',
    category: 'Liquiditeit',
    icon: Repeat
  },
  {
    id: 'ipoRoadmap',
    chapterNumber: '08',
    label: 'LSE Beursgang en Cap Table',
    shortLabel: 'Beursgang',
    category: 'Kapitaalmarkt',
    icon: PieChartIcon
  },
  {
    id: 'allocation',
    chapterNumber: '09',
    label: 'Strategische Kapitaalallocatie (€ 22M)',
    shortLabel: 'Kapitaalallocatie',
    category: 'Allocatie',
    icon: Coins
  },
  {
    id: 'governance',
    chapterNumber: '10',
    label: 'UK Substance en Corporate Governance',
    shortLabel: 'Governance',
    category: 'Toezicht',
    icon: ShieldCheck
  }
];

export const InstitutionalDossierModal: React.FC<InstitutionalDossierModalProps> = ({
  isOpen = true,
  isInline = false,
  onClose,
  onSelectNodeInCanvas,
  onSwitchTo3D
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('summary');
  const [interactiveMemberCount, setInteractiveMemberCount] = useState<number>(100);

  if (!isOpen && !isInline) return null;

  // Wiskundige Reeks van Gauss berekening
  const cyclesPerMember = 78;
  const cycleRevenue = 2625;
  const priceToSalesMultiple = 4.0;
  const sharesOutstanding = 10000000;

  const totalCycles = interactiveMemberCount * cyclesPerMember;
  const consolidatedRevenue = totalCycles * cycleRevenue;
  const valuation = consolidatedRevenue * priceToSalesMultiple;
  const pricePerShare = valuation / sharesOutstanding;

  const currentTabIndex = TABS.findIndex((t) => t.id === activeTab);
  const currentTab = TABS[currentTabIndex];

  const handlePrevTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1].id);
    }
  };

  const handleNextTab = () => {
    if (currentTabIndex < TABS.length - 1) {
      setActiveTab(TABS[currentTabIndex + 1].id);
    }
  };

  const dossierBody = (
    <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden bg-slate-950 text-slate-100">
      {/* Linker Navigatiekolom: Directie Inhoudsopgave (Desktop en Tablet) */}
      <aside className="hidden md:flex w-80 lg:w-96 flex-col border-r border-white/10 bg-slate-950/90 backdrop-blur-xl shrink-0">
        <div className="p-10 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                Dossier
              </div>
              <div className="text-sm font-semibold text-white">
                Inhoudsopgave Prospectus
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3 leading-relaxed">
            Volledige institutionele analyse en beursgang specificaties conform LSE Main Market standaarden.
          </p>
        </div>

        {/* Hoofdstukkenlijst met royale 1cm marge */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {TABS.map((tab, idx) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-4 pl-6 rounded-2xl transition-all cursor-pointer flex items-start gap-3.5 group ${
                  isActive
                    ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40 shadow-lg shadow-amber-400/5'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                }`}
              >
                <div
                  className={`font-mono text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 mt-0.5 ${
                    isActive
                      ? 'bg-amber-400 text-slate-950 font-extrabold'
                      : 'bg-white/5 text-slate-400 group-hover:text-slate-200'
                  }`}
                >
                  {tab.chapterNumber}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-0.5">
                    {tab.category}
                  </div>
                  <div className={`text-sm font-semibold leading-snug truncate ${isActive ? 'text-amber-200' : 'text-slate-300'}`}>
                    {tab.shortLabel}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 mt-1 transition-transform ${
                    isActive ? 'text-amber-400 translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Onderkant Linkerbalk: Status en 3D Knop */}
        <div className="p-8 pl-10 border-t border-white/10 bg-black/30">
          {onSwitchTo3D && (
            <button
              type="button"
              onClick={onSwitchTo3D}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-400/20 to-blue-500/20 hover:from-amber-400/30 hover:to-blue-500/30 border border-amber-400/40 text-amber-300 text-sm font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-md"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>3D Ecosysteem Verkenner</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobiele en Tablet Hoofdstukken Kiezer */}
      <div className="md:hidden p-4 sm:p-6 border-b border-white/10 bg-slate-950 shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2.5 min-w-max px-4">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isActive
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-bold'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                <span className="font-mono text-[11px] text-amber-400">{tab.chapterNumber}</span>
                <span>{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Rechter Hoofdgedeelte: Ruime Leesomgeving met exact 120px afstand van de zijkant */}
      <main className="flex-1 overflow-y-auto px-6 md:px-[120px] py-12 sm:py-16 space-y-14">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hoofdstuk Titelblok met Royale Ruimte en Gecentreerde Uitlijning */}
          <div className="border-b border-white/10 pb-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-widest mb-4 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/20">
              <span>Hoofdstuk {currentTab.chapterNumber}</span>
              <span>•</span>
              <span>{currentTab.category}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-normal leading-tight max-w-3xl mx-auto">
              {currentTab.label}
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed mt-4 max-w-2xl mx-auto text-center">
              {activeTab === 'summary' && 'Geconsolideerde holdingstructuur, geautomatiseerde kapitaalrotatie en waarderingsgrondslag voor beursnotering.'}
              {activeTab === 'entities' && 'Gedetailleerd overzicht van de moederholding, de 5 operationele werkmaatschappijen en de 5 flankerende modules.'}
              {activeTab === 'aiGateway' && 'De frictieloze toevoer van internationaal talent en de autonome executiekracht van de Investbotiq motor.'}
              {activeTab === 'synergy' && 'Wederzijdse versnelling tussen kernentiteiten en gespecialiseerde modules zonder logistieke vertraging.'}
              {activeTab === 'calculator' && 'Wiskundige cumulatie via de Reeks van Gauss en de gestandaardiseerde Viercomponentenoutput.'}
              {activeTab === 'projections' && 'Driejarige groeitrajecten en capaciteitsschaling richting € 1,87 miljard geconsolideerde jaaromzet.'}
              {activeTab === 'infiniteLoop' && 'Maximale Velocity of Money via Time Gap Cashflow en prudentieel escrowbeheer zonder extern schuldrisico.'}
              {activeTab === 'ipoRoadmap' && 'Introductie op de London Stock Exchange Main Market en gedisciplineerde aandelenverdeling.'}
              {activeTab === 'allocation' && 'Doelgerichte aanwending van € 22 miljoen netto beurskapitaal over infrastructuur, licenties en groei.'}
              {activeTab === 'governance' && 'UK Substance vereisten in Londen, onafhankelijke raad van commissarissen en juridische risico isolatie.'}
            </p>
          </div>

          {/* HOOFDSTUK 1: STRATEGISCH PERSPECTIEF */}
          {activeTab === 'summary' && (
            <div className="space-y-10">
              {/* Vier Kernstatistieken */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/40 transition-all space-y-3">
                  <div className="text-4xl sm:text-5xl font-extrabold text-amber-400 font-mono tracking-normal">
                    11
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Entiteiten in Structuur
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Eén centrale Moederholding in Londen met 5 gespecialiseerde werkmaatschappijen en 5 flankerende bedrijfsmodules.
                  </p>
                </div>

                <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-cyan-400/40 transition-all space-y-3">
                  <div className="text-4xl sm:text-5xl font-extrabold text-cyan-400 font-mono tracking-normal">
                    1
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    AI Executie Engine
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Volledige automatisering van kapitaal, compute en vastgoedstromen via Investbotiq Ltd (IQ Bot en Agent).
                  </p>
                </div>

                <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-emerald-400/40 transition-all space-y-3">
                  <div className="text-4xl sm:text-5xl font-extrabold text-emerald-400 font-mono tracking-normal">
                    € 20,4M
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Eerstejaars Target
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Geconsolideerde omzet gebaseerd op 100 actieve leden en wiskundige cumulatie via de Reeks van Gauss.
                  </p>
                </div>

                <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/40 transition-all space-y-3">
                  <div className="text-4xl sm:text-5xl font-extrabold text-amber-300 font-mono tracking-normal">
                    € 82M
                  </div>
                  <div className="text-sm font-bold uppercase tracking-wider text-slate-200">
                    Beoogde Waardering
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Marktwaarde bij London Stock Exchange Main Market IPO medio 2027 op basis van 4,0x Price to Sales ratio.
                  </p>
                </div>
              </div>

              {/* Institutioneel Overzicht en Visie */}
              <div className="p-10 sm:p-12 rounded-3xl bg-slate-900/70 border border-amber-400/25 space-y-8">
                <div className="flex items-center gap-3.5 text-amber-400 font-bold text-lg sm:text-xl">
                  <Building2 className="w-6 h-6 shrink-0" />
                  <span>Strategisch Perspectief: Een Gedetermineerd Groeimodel</span>
                </div>

                <p className="text-base sm:text-lg text-slate-200 leading-relaxed sm:leading-8">
                  QuantumInitium Ltd overstijgt het traditionele conglomeraat. Het fungeert als een wiskundig gedetermineerde, gesloten economische motor waarin gecontroleerde talentinvoer direct wordt omgezet in autonome, inkomstengenererende opdrachten over compute, fintech en vastgoed.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="text-base font-bold text-white">Autonome Executie</div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Eliminatie van menselijke vertraging dankzij directe API koppeling tussen talenthub en de Investbotiq centrale motor.
                    </p>
                  </div>
                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="text-base font-bold text-white">Voorspelbare Rendementen</div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Elk actief lid activeert een gestandaardiseerde Viercomponentenmotor van exact € 2.625 bruto per maand.
                    </p>
                  </div>
                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-3">
                    <div className="text-base font-bold text-white">Kapitaalefficiëntie (OPM)</div>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Time Gap Cashflow benut vooruitontvangen gelden prudentieel in escrow voor continue herinvestering zonder verwatering.
                    </p>
                  </div>
                </div>
              </div>

              {/* Snelle actie naar 3D verkenner */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-10 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-amber-950/30 border border-white/10 gap-6">
                <div>
                  <div className="text-lg font-bold text-white">Ruimtelijke Ecosysteem Navigatie</div>
                  <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                    Onderzoek alle 11 entiteiten, omloopbanen en divisies in de interactieve 3D weergave.
                  </p>
                </div>
                {onSwitchTo3D && (
                  <button
                    type="button"
                    onClick={onSwitchTo3D}
                    className="px-6 py-3.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2.5 shrink-0 shadow-md"
                  >
                    <span>Naar 3D Ecosysteem</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* HOOFDSTUK 2: 11 ENTITEITEN & STRUCTUUR */}
          {activeTab === 'entities' && (
            <div className="space-y-10">
              <div className="flex flex-col items-center text-center gap-3 border-b border-white/10 pb-8">
                <span className="text-xs font-mono text-amber-300 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 font-semibold">
                  Strikte Juridische Isolatie (Firewalling)
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">De 11 Bedrijfsentiteiten</h2>
                <p className="text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                  Eén Moederholding in Londen met 5 gespecialiseerde subholdings en 5 flankerende modules.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {Object.entries(ecosystemData).map(([key, node]) => (
                  <div
                    key={key}
                    className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-amber-400/40 transition-all flex flex-col justify-between space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                        <span
                          className="text-xs uppercase font-mono px-3 py-1.5 rounded-lg font-bold tracking-wider"
                          style={{ backgroundColor: `${node.color}25`, color: node.color }}
                        >
                          {node.title}
                        </span>
                        {onSelectNodeInCanvas && (
                          <button
                            type="button"
                            onClick={() => {
                              onSelectNodeInCanvas(key);
                              if (onSwitchTo3D) {
                                onSwitchTo3D();
                              } else if (onClose) {
                                onClose();
                              }
                            }}
                            className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer py-1.5 px-3 rounded-lg hover:bg-white/5"
                            title="Bekijk in 3D"
                          >
                            <span>Focus in 3D</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="text-base sm:text-lg font-bold text-white mb-2.5">
                        {node.subTitle}
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed mb-6">
                        {node.desc}
                      </p>

                      <div className="space-y-4 pt-6 border-t border-white/10">
                        <div className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                          Deelnemingen in dit cluster:
                        </div>

                        {node.entities.map((entity) => (
                          <div
                            key={entity.name}
                            className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-2"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-bold text-white text-sm sm:text-base">{entity.name}</span>
                              {entity.type && (
                                <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300">
                                  {entity.type}
                                </span>
                              )}
                            </div>
                            {entity.role && (
                              <div className="text-xs text-amber-300/90 font-semibold">{entity.role}</div>
                            )}
                            <p className="text-sm text-slate-300 leading-relaxed">{entity.desc}</p>
                            {entity.synergyWith && (
                              <div className="text-xs text-cyan-300/90 pt-1">
                                <span className="font-medium text-slate-400">Synergie: </span>
                                {entity.synergyWith}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {node.corporateDetails && (
                      <div className="pt-4 border-t border-white/10 text-xs text-slate-400 space-y-2">
                        <div>
                          <span className="text-slate-300 font-medium">Focus: </span>
                          {node.corporateDetails.focus}
                        </div>
                        <div>
                          <span className="text-slate-300 font-medium">Model: </span>
                          <span className="text-amber-300/90">{node.corporateDetails.model}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOOFDSTUK 3: TALENT EN AI EXECUTIE */}
          {activeTab === 'aiGateway' && (
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Stap 1: Gecontroleerde Talenttoevoer en Validatie
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  De waardecreatie begint met een frictieloze toevoer van internationaal gekwalificeerd IT talent.
                </p>
              </div>

              {/* 3 Stappen Flow */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {talentGatewayFlow.map((step) => (
                  <div
                    key={step.stapNummer}
                    className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4"
                  >
                    <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                      Fase {step.stapNummer}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-white">{step.titel}</div>
                    <div className="text-xs font-semibold text-amber-300/90">{step.type}</div>
                    <p className="text-sm text-slate-300 leading-relaxed pt-1">
                      {step.beschrijving}
                    </p>
                  </div>
                ))}
              </div>

              {/* Centrale AI Engine: Investbotiq Ltd */}
              <div className="p-10 sm:p-12 rounded-3xl bg-slate-900/70 border border-cyan-400/30 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shrink-0">
                    <Cpu className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{investbotiqEngineFlow.titel}</h3>
                    <p className="text-sm text-cyan-300 font-semibold">{investbotiqEngineFlow.rol}</p>
                  </div>
                </div>

                <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/10 text-sm text-slate-200 leading-relaxed">
                  <span className="font-bold text-white">Invoer en Verwerking: </span>
                  {investbotiqEngineFlow.invoer}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  {investbotiqEngineFlow.uitvoerSporen.map((spoor) => (
                    <div
                      key={spoor.sector}
                      className="p-8 sm:p-10 rounded-2xl bg-white/5 border border-white/10 space-y-3"
                    >
                      <div className="text-sm font-bold text-amber-400 tracking-wide">{spoor.sector}</div>
                      <p className="text-sm text-slate-300 leading-relaxed">{spoor.functie}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HOOFDSTUK 4: SYNERGIE MATRIX */}
          {activeTab === 'synergy' && (
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Operationele Synergie: Kernmaatschappijen en Flankerende Modules
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Gespecialiseerde flankerende modules versnellen de primaire divisies zonder de kernactiviteiten te belasten.
                </p>
              </div>

              {/* Desktop Tabelweergave met ruime padding van minimaal 1cm */}
              <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/60 shadow-xl">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 bg-slate-950/80 text-slate-400">
                      <th className="px-10 py-6 font-bold text-amber-300 text-sm">Flankerende Module</th>
                      <th className="px-10 py-6 font-bold text-slate-200 text-sm">Kern Entiteit</th>
                      <th className="px-10 py-6 font-bold text-slate-200 text-sm">Synergetische Versnelling</th>
                      <th className="px-10 py-6 font-bold text-cyan-300 text-sm">Strategisch Effect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {operationalSynergyMatrix.map((item) => (
                      <tr key={item.flankerendeModule} className="hover:bg-white/5 transition-colors">
                        <td className="px-10 py-6 font-bold text-amber-400 whitespace-nowrap">
                          {item.flankerendeModule}
                        </td>
                        <td className="px-10 py-6 font-semibold text-slate-200 whitespace-nowrap">
                          {item.kernEntiteit}
                        </td>
                        <td className="px-10 py-6 text-slate-300 leading-relaxed max-w-lg">
                          {item.synergetischeVersnelling}
                        </td>
                        <td className="px-10 py-6 text-cyan-300/90 whitespace-nowrap text-xs font-mono">
                          {item.effectType}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* HOOFDSTUK 5: VIERCOMPONENTENMOTOR & GAUSS CALCULATOR */}
          {activeTab === 'calculator' && (
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  De Viercomponentenmotor: Gestandaardiseerde Waardecreatie
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Eén geactiveerd lid staat gelijk aan een gestandaardiseerde wiskundige output motor van exact € 2.625 bruto per maand.
                </p>
              </div>

              {/* 4 Componenten Kaarten met Royale Ruimte van Minimaal 1 Centimeter */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {viercomponentenmotor.map((comp) => (
                  <div
                    key={comp.naam}
                    className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3"
                  >
                    <div className="text-xs uppercase font-mono text-cyan-400 font-bold tracking-wider">
                      {comp.categorie}
                    </div>
                    <div className="text-base font-bold text-white">{comp.naam}</div>
                    <div className="text-3xl font-extrabold text-amber-400 font-mono tracking-normal">
                      € {comp.bedrag}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed pt-2">
                      {comp.omschrijving}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totaal per maand box */}
              <div className="p-10 rounded-3xl bg-amber-400/10 border border-amber-400/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center text-amber-400 shrink-0">
                    <Coins className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-white font-bold text-lg">Totale Output per Actief Lid:</div>
                    <div className="text-sm text-slate-300 mt-0.5">Gestandaardiseerd bruto volume over alle vier sporen</div>
                  </div>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-300">
                  € 2.625 / maand
                </div>
              </div>

              {/* Interactieve Gauss Calculator Simulator */}
              <div className="p-10 sm:p-12 rounded-3xl bg-slate-900/70 border border-white/10 space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-3">
                      <Calculator className="w-6 h-6 text-amber-400 shrink-0" />
                      <span>Wiskundige Cumulatie: De Reeks van Gauss Simulator</span>
                    </h3>
                    <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">
                      Formule: n(n + 1) / 2 met 78 actieve cumulatieve cycli per lid over 12 maanden (12 × 13 / 2 = 78).
                    </p>
                  </div>
                  <div className="text-xs font-mono text-amber-300 bg-black/40 px-4 py-2.5 rounded-xl border border-amber-400/30 shrink-0 self-start sm:self-auto font-semibold">
                    € 204.750 per lid op jaarbasis
                  </div>
                </div>

                {/* Ledenaantal slider en knoppen */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between text-sm sm:text-base">
                    <span className="text-slate-300 font-semibold">Aantal Actieve Leden:</span>
                    <span className="font-mono text-2xl font-bold text-amber-400">
                      {interactiveMemberCount.toLocaleString('nl')} leden
                    </span>
                  </div>

                  <input
                    type="range"
                    min="10"
                    max="10000"
                    step="10"
                    value={interactiveMemberCount}
                    onChange={(e) => setInteractiveMemberCount(Number(e.target.value))}
                    className="w-full accent-amber-400 h-3 bg-slate-800 rounded-lg cursor-pointer"
                  />

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="text-xs text-slate-400 mr-1 font-medium">Directe Voorinstellingen:</span>
                    {[
                      { label: '100 Leden (Jaar 1 Target)', count: 100 },
                      { label: '1.000 Leden', count: 1000 },
                      { label: '6.000 Leden (Jaar 2 Europa)', count: 6000 },
                      { label: '9.150 Leden (Jaar 3 Max)', count: 9150 }
                    ].map((preset) => (
                      <button
                        key={preset.count}
                        type="button"
                        onClick={() => setInteractiveMemberCount(preset.count)}
                        className={`px-4 py-2 rounded-xl text-xs font-mono cursor-pointer transition-all ${
                          interactiveMemberCount === preset.count
                            ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20'
                            : 'bg-white/5 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resultaten Grid met Ruime Kaarten */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-xs uppercase text-slate-400 font-semibold">Cumulatieve Cycli</div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400">
                      {totalCycles.toLocaleString('nl')}
                    </div>
                    <div className="text-xs text-slate-400 pt-1">
                      {interactiveMemberCount} × 78 cycli
                    </div>
                  </div>

                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-xs uppercase text-slate-400 font-semibold">Geconsolideerde Omzet</div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400">
                      € {Math.round(consolidatedRevenue).toLocaleString('nl')}
                    </div>
                    <div className="text-xs text-slate-400 pt-1">
                      Basis voor beurswaardering
                    </div>
                  </div>

                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-xs uppercase text-slate-400 font-semibold">Waardering (4,0x P/S)</div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-300">
                      € {Math.round(valuation).toLocaleString('nl')}
                    </div>
                    <div className="text-xs text-slate-400 pt-1">
                      Marktkapitalisatie
                    </div>
                  </div>

                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-xs uppercase text-slate-400 font-semibold">Koers per Aandeel</div>
                    <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400">
                      € {pricePerShare.toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400 pt-1">
                      Op 10.000.000 aandelen
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HOOFDSTUK 6: SCHAALBAARHEID 2026 TOT 2029 */}
          {activeTab === 'projections' && (
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Schaalbaarheid: Driejarige Groeiprojecties (2026 tot 2029)
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Gestructureerde capaciteitsschaling richting een jaaromzet van € 1,87 miljard.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {driejarigeGroeiprojecties.map((proj) => (
                  <div
                    key={proj.jaar}
                    className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-6"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
                          {proj.jaar}
                        </span>
                        <span className="text-xs px-3 py-1 rounded-full bg-white/10 text-slate-200 font-medium">
                          {proj.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">{proj.titel}</h3>
                      <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-400 mb-6 tracking-normal">
                        {proj.omzetLabel}
                      </div>

                      <div className="space-y-3 py-5 border-y border-white/10 text-sm text-slate-200 font-mono">
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">Actieve Leden:</span>
                          <span className="font-bold text-white">{proj.actieveLeden.toLocaleString('nl')}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">Cumulatieve Cycli:</span>
                          <span className="font-bold text-cyan-300">{proj.cumulatieveCycli.toLocaleString('nl')}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-300 leading-relaxed pt-5">
                        {proj.toelichting}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Risicobeheersing parameters */}
              <div className="p-10 sm:p-12 rounded-3xl bg-slate-900/60 border border-white/10 space-y-6">
                <div className="text-sm font-bold text-white uppercase tracking-wider">
                  Belangrijkste Schaalparameters en Risicobeheersing
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-slate-300">
                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-amber-400 font-bold text-base">Lineaire Voorspelbaarheid</div>
                    <p className="text-slate-400 leading-relaxed">
                      Elke schaalsprong is wiskundig gekoppeld aan geverifieerde ledenaantallen, zonder speculatieve aannames.
                    </p>
                  </div>
                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-cyan-300 font-bold text-base">Decentrale Uitrol</div>
                    <p className="text-slate-400 leading-relaxed">
                      Wervingshubs in meerdere Europese jurisdicties spreiden het operationele wervingsrisico evenredig.
                    </p>
                  </div>
                  <div className="p-8 sm:p-10 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                    <div className="text-emerald-400 font-bold text-base">Margerobustheid</div>
                    <p className="text-slate-400 leading-relaxed">
                      Vaste brutomarges van € 2.625 per lid borgen winstgevendheid vanaf dag 1 van elke nieuwe inschrijving.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HOOFDSTUK 7: INFINITE LOOP & TIME GAP CASHFLOW */}
          {activeTab === 'infiniteLoop' && (
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  De Infinite Loop van Kapitaalrotatie en Time Gap Cashflow
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Gesloten cyclusvolume van € 66.000 per 99 leden; maximale Velocity of Money zonder extern schuldrisico.
                </p>
              </div>

              {/* 5 Stappen Loop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {infiniteLoopSteps.map((step) => (
                  <div
                    key={step.stapNummer}
                    className="p-8 sm:p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="text-xs uppercase font-mono text-amber-400 font-bold">
                        {step.knooppunt}
                      </div>
                      <div className="text-base font-bold text-white mt-1.5 mb-1">{step.titel}</div>
                      <div className="text-xs text-cyan-300/90 font-semibold mb-3">
                        {step.entiteiten}
                      </div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {step.mechanisme}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Time Gap Cashflow & Prudentieel Beheer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 sm:p-12 rounded-3xl bg-slate-900/70 border border-white/10 space-y-6">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    {timeGapCashflowData.titel}
                  </div>
                  <div className="text-base text-slate-200 font-semibold">
                    {timeGapCashflowData.ondertitel}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono pt-1">
                    <div className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-white/5 text-slate-200">
                      {timeGapCashflowData.t0}
                    </div>
                    <div className="p-6 sm:p-8 rounded-2xl bg-black/40 border border-white/5 text-slate-200">
                      {timeGapCashflowData.t1}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {timeGapCashflowData.mechanisme}
                  </p>
                </div>

                <div className="p-10 sm:p-12 rounded-3xl bg-slate-900/70 border border-white/10 space-y-6">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    Fintech Clearing en Compliance
                  </div>
                  <div className="text-base text-slate-200 font-semibold">
                    {fintechOpmData.sabiRol}
                  </div>
                  <ul className="text-sm text-slate-300 space-y-3.5 pt-1">
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{fintechOpmData.banklicentieVrij}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{fintechOpmData.baasPartners}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{fintechOpmData.stichtingDerdengelden}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{fintechOpmData.complianceDekking}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* HOOFDSTUK 8: LSE BEURSGANG & CAP TABLE */}
          {activeTab === 'ipoRoadmap' && (
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  {ipoHorizonData.waarderingTitel}
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Marsroute naar de London Stock Exchange Main Market IPO medio 2027.
                </p>
              </div>

              {/* Waardering en Cap Table Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Waardering Blok */}
                <div className="p-10 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    Waarderingsmethodiek
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-slate-400">Target Jaar 1 Omzet:</span>
                      <span className="font-mono font-bold text-white">
                        {ipoHorizonData.omzetDoelJaar1Label}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-slate-400">Waarderings Multiple:</span>
                      <span className="font-mono font-bold text-cyan-300">
                        {ipoHorizonData.multipleLabel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-white/10">
                      <span className="text-slate-400">Beoogde Beurswaardering:</span>
                      <span className="font-mono font-extrabold text-amber-400 text-xl">
                        {ipoHorizonData.beurswaarderingLabel}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3">
                      <span className="text-slate-400">Introductieprijs per aandeel:</span>
                      <span className="font-mono font-bold text-white">
                        {ipoHorizonData.uitgifteprijsPerAandeel} ({ipoHorizonData.aandelenLabel})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cap Table Blok */}
                <div className="p-10 sm:p-12 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    Cap Table bij Beursgang
                  </div>
                  <div className="space-y-4">
                    {ipoHorizonData.capTable.map((item) => (
                      <div
                        key={item.aandeelhouder}
                        className="p-6 sm:p-8 rounded-2xl bg-white/5 border border-white/5 space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-white text-sm sm:text-base">{item.aandeelhouder}</span>
                          <span
                            className="font-mono font-bold text-sm px-3 py-1 rounded-lg"
                            style={{ backgroundColor: `${item.kleur}25`, color: item.kleur }}
                          >
                            {item.percentage}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{item.rechten}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Vier Treden Marsroute */}
              <div className="space-y-6">
                <div className="text-sm font-bold text-white uppercase tracking-wider">
                  Gedisciplineerde Marsroute naar de Beurs (2026 tot 2027)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {beursgangRoadmap.map((step) => (
                    <div
                      key={step.periode}
                      className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-mono font-bold text-amber-400">
                          {step.periode}
                        </div>
                        <div className="text-base font-bold text-white mt-1.5 mb-1">
                          {step.titel}
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          {step.beschrijving}
                        </p>
                      </div>
                      <div className="space-y-2 pt-4 border-t border-white/10">
                        {step.mijlpalen.map((m) => (
                          <div key={m} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>{m}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* HOOFDSTUK 9: KAPITAALALLOCATIE */}
          {activeTab === 'allocation' && (
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Strategische Kapitaalallocatie: Fysieke Inzet van € 22 Miljoen
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Totaal netto beurskapitaal gerealiseerd via de 30% Free Float uitgifte op LSE Main Market.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                {kapitaalallocatieNettoBeursopbrengst.map((item) => (
                  <div
                    key={item.categorie}
                    className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-5"
                  >
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-400 tracking-normal">
                        {item.percentage}%
                      </div>
                      <div className="text-sm font-mono font-bold text-slate-200 mt-1.5 mb-2">
                        {item.bedrag}
                      </div>
                      <div className="text-base font-bold text-white mb-2">{item.categorie}</div>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {item.doel}
                      </p>
                    </div>
                    <div className="pt-4 border-t border-white/10 text-xs text-slate-400 leading-relaxed">
                      {item.toelichting}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HOOFDSTUK 10: GOVERNANCE & 4 PIJLERS */}
          {activeTab === 'governance' && (
            <div className="space-y-10">
              <div className="text-center max-w-2xl mx-auto space-y-2 pb-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Corporate Governance en Juridische Risico Isolatie
                </h2>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  UK Substance in Londen, onafhankelijke Raad van Commissarissen en volledige firewalling van operationele risicos.
                </p>
              </div>

              {/* Drie Zuilen */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                    UK Substance (Londen)
                  </div>
                  <ul className="text-sm text-slate-300 space-y-3 pt-1">
                    {corporateGovernanceData.substanceKaders.map((k) => (
                      <li key={k} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="text-xs font-bold text-cyan-400 uppercase tracking-widest">
                    Raad van Commissarissen
                  </div>
                  <ul className="text-sm text-slate-300 space-y-3 pt-1">
                    {corporateGovernanceData.rvcKaders.map((k) => (
                      <li key={k} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4">
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                    {corporateGovernanceData.juridischeFirewalling.titel}
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed pt-1">
                    {corporateGovernanceData.juridischeFirewalling.beschrijving}
                  </p>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {corporateGovernanceData.juridischeFirewalling.risicoGarantie}
                  </p>
                </div>
              </div>

              {/* De 4 Institutionele Pijlers */}
              <div className="space-y-6 pt-4">
                <div className="text-sm font-bold text-white uppercase tracking-wider">
                  Synthese: De Vier Institutionele Pijlers
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {institutioneleVierPijlers.map((pijler) => (
                    <div
                      key={pijler.nummer}
                      className="p-10 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="text-xs font-mono font-bold text-amber-400">
                          Pijler {pijler.nummer}
                        </div>
                        <div className="text-base sm:text-lg font-bold text-white mt-1.5 mb-1">
                          {pijler.titel}
                        </div>
                        <div className="text-xs text-amber-300/90 font-semibold mb-3">
                          {pijler.ondertitel}
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed mb-4">
                          {pijler.inhoud}
                        </p>
                      </div>
                      <div className="space-y-2.5 pt-4 border-t border-white/10">
                        {pijler.garanties.map((g) => (
                          <div key={g} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{g}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Onderste Hoofdstuk Navigatiebalk */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-10 border-t border-white/10">
            <button
              type="button"
              onClick={handlePrevTab}
              disabled={currentTabIndex === 0}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentTabIndex === 0
                  ? 'opacity-30 border-white/5 text-slate-600 cursor-not-allowed'
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200 hover:text-white'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Vorig Hoofdstuk</span>
            </button>

            <div className="text-xs font-mono text-slate-500">
              Hoofdstuk {currentTab.chapterNumber} van 10
            </div>

            <button
              type="button"
              onClick={handleNextTab}
              disabled={currentTabIndex === TABS.length - 1}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                currentTabIndex === TABS.length - 1
                  ? 'opacity-30 border-white/5 text-slate-600 cursor-not-allowed'
                  : 'bg-amber-400/15 hover:bg-amber-400/25 border-amber-400/40 text-amber-300 shadow-md shadow-amber-400/5'
              }`}
            >
              <span>Volgend Hoofdstuk</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );

  if (isInline) {
    return dossierBody;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-black/85 backdrop-blur-2xl animate-fade-in overflow-hidden">
      <div className="relative w-full max-w-7xl h-[94vh] flex flex-col bg-slate-950 border border-amber-400/30 rounded-3xl shadow-2xl shadow-black overflow-hidden">
        {/* Modal Topbar */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-white/10 bg-slate-950/90 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-amber-400/40 flex items-center justify-center p-0.5 shrink-0 overflow-hidden shadow-md">
              <img src="/quantum_initium_logo.jpg" alt="QuantumInitium Logo" referrerPolicy="no-referrer" className="w-full h-full object-cover rounded-[9px]" />
            </div>
            <div>
              <div className="text-base font-bold text-white">QuantumInitium Ltd</div>
              <div className="text-xs text-slate-400">LSE Main Market Prospectus Dossier</div>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              title="Sluiten"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        {dossierBody}
      </div>
    </div>
  );
};
