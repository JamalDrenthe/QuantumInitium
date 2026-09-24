import React from 'react';
import {
  Bookmark,
  ShieldCheck,
  Building2,
  Cpu,
  Wallet,
  Users,
  Server,
  Home,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  GitBranch,
  Crown,
  Layers,
  Award,
  Coins,
  Scale,
  FileText,
  Clock
} from 'lucide-react';
import {
  pitchExecutiveSummary,
  corporateGovernanceData,
  talentGatewayFlow,
  investbotiqEngineFlow,
  operationalSynergyMatrix,
  viercomponentenmotor,
  gaussReeksGegevens,
  driejarigeGroeiprojecties,
  fintechOpmData,
  timeGapCashflowData,
  infiniteLoopSteps,
  ipoHorizonData,
  beursgangRoadmap,
  kapitaalallocatieNettoBeursopbrengst,
  institutioneleVierPijlers
} from '../data/institutionalPitch';

interface DossierReaderProps {
  currentChapter: number;
}

export const DossierReader: React.FC<DossierReaderProps> = ({ currentChapter }) => {
  return (
    <div className="px-6 md:px-[120px] py-10 space-y-10 max-w-7xl mx-auto">
      {/* HOOFDSTUK 01: EXECUTIEF */}
      {currentChapter === 1 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
                <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 01 • EXECUTIEF
              </div>
              <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Strategisch Perspectief & Executief Overzicht
              </h2>
              <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
                Geconsolideerde holdingstructuur rondom <strong>QuantumInitium Ltd</strong> met geautomatiseerde kapitaalrotatie, 5 gespecialiseerde subholdings en wiskundige groeimotor.
              </p>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-amber-400/40 p-1.5 shrink-0 shadow-xl gold-glow hidden sm:flex items-center justify-center overflow-hidden">
              <img
                src="/quantum_initium_logo.jpg"
                alt="QuantumInitium Ltd Logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-cyan-500 space-y-2">
              <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">5 SUBHOLDINGS</span>
              <div className="text-3xl font-black text-white font-mono tracking-tight">12 Entiteiten</div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Strikte risico isolatie en entiteitsscheiding ter voorkoming van kruisbesmetting.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500 space-y-2">
              <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">JAAR 1 TARGET</span>
              <div className="text-3xl font-black text-amber-400 font-mono tracking-tight">€ 20,4M</div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                Gebaseerd op 100 actieve leden en de Reeks van Gauss (78 cumulatieve cycli).
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-yellow-400 space-y-2">
              <span className="text-xs text-slate-400 font-mono font-semibold uppercase tracking-wider">WAARDERING</span>
              <div className="text-3xl font-black text-yellow-400 font-mono tracking-tight">€ 82M</div>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                LSE Main Market IPO target medio 2027 op basis van 4,0x omzet multiple.
              </p>
            </div>
          </div>

          <div className="glass-panel p-7 rounded-2xl space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-cyan-400" /> Drie Kernpijlers van het Ecosysteem
            </h3>
            <ul className="text-sm text-slate-300 space-y-3 list-disc pl-5 leading-relaxed">
              <li>
                <strong>Invoer & Verificatie:</strong> Immigratiepunt Ltd en VVC Ltd garanderen continue instroom van hooggekwalificeerde kennismigranten.
              </li>
              <li>
                <strong>Algoritmische Executie:</strong> Investbotiq Ltd herverdeelt opdrachten en kapitaal direct over Boostplug (GPU), WoningVry (PropTech) en Spontiva (Fintech).
              </li>
              <li>
                <strong>Wiskundige Voorspelbaarheid:</strong> De Reeks van Gauss formuleert exacte omzetontwikkeling zonder traditionele frictie.
              </li>
            </ul>
          </div>

          <div className="glass-card p-7 rounded-2xl border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              Statutaire Zetel & Institutionele Waarborg
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 text-sm text-slate-300">
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[11px] uppercase font-mono tracking-wider">Jurisdictie</span>
                <strong className="text-white text-base">Londen, Verenigd Koninkrijk</strong>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[11px] uppercase font-mono tracking-wider">Beoogde Beurs</span>
                <strong className="text-amber-400 text-base">London Stock Exchange (Main Market)</strong>
              </div>
              <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-slate-500 block text-[11px] uppercase font-mono tracking-wider">Governance Code</span>
                <strong className="text-emerald-400 text-base">UK Corporate Governance Code</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOOFDSTUK 02: ORGANISATIE */}
      {currentChapter === 2 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 02 • ORGANISATIE
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              5 Subholdings en 12 Entiteiten
            </h2>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Strikte juridische isolatie en firewalling voorkomt aansprakelijkheidsoverdracht tussen de operationele sectoren.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-wider">SUBHOLDING 01 • IP & TECH</span>
              <h4 className="font-bold text-white text-base tracking-tight">CRMos Ltd & Investbotiq Ltd</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Eigenaar van alle intellectuele eigendommen, AI modellen, ATS softwarepatenten, geautomatiseerde dialers en handelsmerken.
              </p>
              <div className="text-xs font-mono text-cyan-300 pt-1">Belang: 100% eigendom via Moederholding</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono text-blue-400 font-bold tracking-wider">SUBHOLDING 02 • FINTECH & LIQUIDITY</span>
              <h4 className="font-bold text-white text-base tracking-tight">Xabi World Ltd</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Gespecialiseerde clearing hub (SABI betaalrails), escrow liquiditeitsretentie en realtime split payments zonder traditioneel bancair balansrisico.
              </p>
              <div className="text-xs font-mono text-blue-300 pt-1">Belang: 100% eigendom via Moederholding</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono text-yellow-400 font-bold tracking-wider">SUBHOLDING 03 • TALENT & GATEWAY</span>
              <h4 className="font-bold text-white text-base tracking-tight">VVC Ltd, DJOBBA Ltd, Immigratiepunt Ltd & Zheavenzy Ltd</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                Onboarding hub, B2B IT detacherings marketplace, volledige visum en relocatieservices en het officiële muzieklabel en talentportaal voor artiesten.
              </p>
              <div className="text-xs font-mono text-yellow-300 pt-1">Belang: 100% eigendom via Moederholding</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
              <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider">SUBHOLDING 04 • COMPUTE & MEDIA</span>
              <h4 className="font-bold text-white text-base tracking-tight">Boostplug Ltd, Logs.rent & Spontiva Ltd</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                GPU AI mining clusters, streaming bandbreedte monetarisering en de working capital optimalisatie motor.
              </p>
              <div className="text-xs font-mono text-emerald-300 pt-1">Belang: 100% eigendom via Moederholding</div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 md:col-span-2 space-y-3">
              <span className="text-[11px] font-mono text-indigo-400 font-bold tracking-wider">SUBHOLDING 05 • REAL ESTATE & OPERATIONS</span>
              <h4 className="font-bold text-white text-base tracking-tight">WoningVry Ltd & Afterstudenthousing Ltd</h4>
              <p className="text-sm text-slate-400 leading-relaxed">
                PropTech huisvesting: LongStay verhuur (€750 per maand) en short stay BnB verhuur (€375 per maand) voor IT professionals en doorstromers.
              </p>
              <div className="text-xs font-mono text-indigo-300 pt-1">Belang: 100% eigendom via Moederholding</div>
            </div>
          </div>
        </div>
      )}

      {/* HOOFDSTUK 03: TECHNOLOGIE */}
      {currentChapter === 3 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 03 • TECHNOLOGIE
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Investbotiq AI Executie Engine
            </h2>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Autonome verwerking van kapitaal, compute en vastgoedopdrachten zonder menselijke vertraging.
            </p>
          </div>

          <div className="glass-panel p-7 rounded-2xl space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2.5">
              <Cpu className="w-5 h-5 text-cyan-400" /> IQ Bot & IQ Agent Architectuur
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              De Investbotiq engine activeert een microservices framework waarin elke geautoriseerde talentstroom direct drie synchrone executiekanalen aanstuurt. Latencies onder 15ms garanderen realtime clearing via Xabi World Ltd.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-cyan-400 font-bold tracking-wider block">TRIGGER LAAG</span>
                <h5 className="font-bold text-white text-sm">VVC Gateway Verificatie</h5>
                <p className="text-xs text-slate-400 leading-relaxed">Identiteits en kwalificatiecontrole met instant webhook activatie.</p>
              </div>
              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider block">ROUTING LAAG</span>
                <h5 className="font-bold text-white text-sm">Multi Channel Splitsing</h5>
                <p className="text-xs text-slate-400 leading-relaxed">Parallelle toewijzing van GPU rekenkracht, residentie en liquiditeit.</p>
              </div>
              <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-2">
                <span className="text-[11px] font-mono text-amber-400 font-bold tracking-wider block">CLEARING LAAG</span>
                <h5 className="font-bold text-white text-sm">Xabi World Escrow & Afwikkeling</h5>
                <p className="text-xs text-slate-400 leading-relaxed">Directe saldering en distributie over werkmaatschappijen (SABI clearing).</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOOFDSTUK 04: INTEGRATIE */}
      {currentChapter === 4 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 04 • INTEGRATIE
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Operationele Synergie Matrix
            </h2>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Gespecialiseerde flankerende modules versnellen de kernoperatie zonder frictie toe te voegen.
            </p>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300 border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-cyan-400 font-mono text-xs tracking-wider border-b border-slate-800">
                    <th className="p-4 lg:p-5">Flankerende Module</th>
                    <th className="p-4 lg:p-5">Kern Entiteit</th>
                    <th className="p-4 lg:p-5">Synergetische Versnelling</th>
                    <th className="p-4 lg:p-5 text-right">Effect Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {operationalSynergyMatrix.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-4 lg:p-5 font-bold text-white flex items-center gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                        {item.flankerendeModule}
                      </td>
                      <td className="p-4 lg:p-5 font-mono text-cyan-300 text-xs">{item.kernEntiteit}</td>
                      <td className="p-4 lg:p-5 text-slate-300 leading-relaxed text-xs lg:text-sm">{item.synergetischeVersnelling}</td>
                      <td className="p-4 lg:p-5 text-right font-mono text-amber-400 font-bold text-xs">{item.effectType}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* HOOFDSTUK 05: REKENMODEL */}
      {currentChapter === 5 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 05 • REKENMODEL
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Het Gauss Model (€ 2.625 Motor)
            </h2>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Cumulatieve maandopbouw: 12 maanden × € 2.625 × (12 × 13 / 2 = 78 cycli) = € 204.750 bruto omzet per actief lid per jaar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-cyan-500 space-y-3">
              <span className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider">COMPUTE TAK</span>
              <div className="text-2xl font-black text-white font-mono tracking-tight">€ 1.500 per maand</div>
              <p className="text-sm text-slate-400 leading-relaxed">
                GPU Mining (€1.000) via Boostplug 5 node cluster + Stream Point Mining (€500) via bandbreedte monetarisering.
              </p>
            </div>
            <div className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500 space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase font-mono tracking-wider">VASTGOED TAK</span>
              <div className="text-2xl font-black text-white font-mono tracking-tight">€ 1.125 per maand</div>
              <p className="text-sm text-slate-400 leading-relaxed">
                WoningVry LongStay (€750) residentiële huur + WoningVry BnB (€375) short stay bezettingsvergoeding.
              </p>
            </div>
          </div>

          <div className="glass-panel p-7 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
              Wiskundige Reeks Formule & Berekening
            </h4>
            <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-sm space-y-2.5">
              <div className="text-cyan-400 text-base">Som(n) = n × (n + 1) / 2</div>
              <div className="text-slate-300">
                Voor n = 12 maanden geldt: 12 × 13 / 2 = <strong>78 cumulatieve cycli</strong>
              </div>
              <div className="text-emerald-400 font-bold text-base pt-1">
                78 cycli × € 2.625 per cyclus = € 204.750 jaarbasis per lid
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOOFDSTUK 06: GROEI */}
      {currentChapter === 6 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 06 • GROEI
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Schaalbaarheid 2026 tot 2029
            </h2>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Gecontroleerde capaciteitsschaling richting 9.150 leden.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-cyan-500 text-center space-y-3">
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider">JAAR 1 (LAUNCH)</span>
              <div className="text-3xl font-black text-white font-mono my-2 tracking-tight">100 Leden</div>
              <div className="text-sm text-slate-300">
                7.800 Cycli • <strong className="text-cyan-400 font-mono">€ 20,4M Omzet</strong>
              </div>
              <div className="text-xs text-slate-400">Beursbasis LSE Introductie</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-emerald-500 text-center space-y-3">
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">JAAR 2 (SCHAAL)</span>
              <div className="text-3xl font-black text-white font-mono my-2 tracking-tight">6.000 Leden</div>
              <div className="text-sm text-slate-300">
                468.000 Cycli • <strong className="text-emerald-400 font-mono">€ 1,22B Omzet</strong>
              </div>
              <div className="text-xs text-slate-400">Europese Hub Expansie</div>
            </div>
            <div className="glass-card p-6 rounded-2xl border-t-4 border-t-amber-500 text-center space-y-3">
              <span className="text-xs font-mono text-amber-400 font-bold uppercase tracking-wider">JAAR 3 (MAX CAP)</span>
              <div className="text-3xl font-black text-white font-mono my-2 tracking-tight">9.150 Leden</div>
              <div className="text-sm text-slate-300">
                713.700 Cycli • <strong className="text-amber-400 font-mono">€ 1,87B Omzet</strong>
              </div>
              <div className="text-xs text-slate-400">Volledige Infrastructuur Capaciteit</div>
            </div>
          </div>
        </div>
      )}

      {/* HOOFDSTUK 07: LIQUIDITEIT */}
      {currentChapter === 7 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 07 • LIQUIDITEIT
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Time Gap Cashflow & Xabi World Clearing
            </h2>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Spontiva Ltd overbrugt betaaltermijnen via WCO (Working Capital Optimization). Xabi World Ltd zorgt voor instant escrow split payments via de SABI infrastructuur.
            </p>
          </div>

          <div className="glass-panel p-7 rounded-2xl space-y-5">
            <h3 className="font-bold text-white text-base flex items-center gap-2.5">
              <Wallet className="w-5 h-5 text-cyan-400" /> Infinite Liquidity Loop
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {infiniteLoopSteps.map((step, idx) => (
                <div key={idx} className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-cyan-400">
                    <span>STAP 0{step.stapNummer}</span>
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <h5 className="font-bold text-white text-sm tracking-tight">{step.titel}</h5>
                  <div className="text-xs font-mono text-amber-300 font-semibold">{step.entiteiten}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.mechanisme}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* HOOFDSTUK 08: KAPITAALMARKT */}
      {currentChapter === 8 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 08 • KAPITAALMARKT
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              LSE Main Market IPO & Cap Table
            </h2>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Beoogde beursgang medio 2027 op de London Stock Exchange met 10.000.000 geplaatste aandelen en €82M startwaardering.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono tracking-wider">Kernparameters Beursgang</h4>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Aantal Geplaatste Aandelen:</span>
                  <span className="font-mono font-bold text-white">10.000.000</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Introductiekoers IPO:</span>
                  <span className="font-mono font-bold text-emerald-400">€ 8,19</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-800/80">
                  <span className="text-slate-400">Startkapitalisatie (LSE):</span>
                  <span className="font-mono font-bold text-amber-400">€ 81.900.000</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Vrije Verhandelbaarheid (Free Float):</span>
                  <span className="font-mono font-bold text-white">25% (2.500.000)</span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
              <h4 className="text-xs font-bold text-amber-400 uppercase font-mono tracking-wider">Tijdlijn Naar Beursnotering</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-cyan-400 font-bold text-xs shrink-0 pt-0.5">Q1 2026:</span>
                  <span className="text-slate-300 leading-relaxed">Audited IFRS openingsbalans & UK substance verankering</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-cyan-400 font-bold text-xs shrink-0 pt-0.5">Q4 2026:</span>
                  <span className="text-slate-300 leading-relaxed">Indienen concept prospectus bij Financial Conduct Authority (FCA)</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="font-mono text-amber-400 font-bold text-xs shrink-0 pt-0.5">Medio 2027:</span>
                  <span className="text-slate-300 leading-relaxed">Officiële notering London Stock Exchange Main Market</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HOOFDSTUK 09: ALLOCATIE */}
      {currentChapter === 9 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 09 • ALLOCATIE
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Kapitaalallocatie (€22M Netto Beursopbrengst)
            </h2>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Strategische verdeling van de opbrengsten ter versnelling van de viercomponentenmotor.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kapitaalallocatieNettoBeursopbrengst.map((item, idx) => (
              <div key={idx} className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
                <span className="text-cyan-400 font-bold font-mono text-base">{item.percentage}</span>
                <div className="text-white text-sm font-bold tracking-tight">{item.doel}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.toelichting}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* HOOFDSTUK 10: TOEZICHT */}
      {currentChapter === 10 && (
        <div className="space-y-8">
          <div className="border-b border-slate-800/90 pb-6 space-y-3">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-bold tracking-widest uppercase">
              <Bookmark className="w-3.5 h-3.5" /> HOOFDSTUK 10 • TOEZICHT
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              Governance, Board & UK Substance Verified
            </h2>
            <p className="text-sm lg:text-base text-slate-300 max-w-3xl leading-relaxed">
              Volledige naleving van de UK Corporate Governance Code. Raad van Commissarissen met 3 onafhankelijke deskundige leden.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {institutioneleVierPijlers.map((pillar, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
                <span className="text-[11px] font-mono text-amber-400 font-bold block uppercase tracking-wider">
                  PIJLER 0{pillar.nummer}
                </span>
                <h4 className="font-bold text-white text-sm tracking-tight">{pillar.titel}</h4>
                <div className="text-xs font-mono text-cyan-400 font-semibold">{pillar.ondertitel}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{pillar.inhoud}</p>
                <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 space-y-2">
                  {pillar.garanties.map((g, gIdx) => (
                    <div key={gIdx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5"></span>
                      <span className="leading-relaxed">{g}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default DossierReader;
