import React, { useEffect, useRef, useState } from 'react';
// three.js-scène wordt los geladen zodat de pagina direct zichtbaar is
const QuantumHero3DCore = React.lazy(() => import('./QuantumHero3DCore'));
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion
} from 'motion/react';
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  Wallet,
  Users,
  Server,
  Home,
  Crown,
  Layers,
  Network,
  BookOpen,
  Calculator,
  Bot,
  Briefcase,
  Globe,
  ExternalLink,
  Play,
  Pause,
  CheckCircle2,
  Building2,
  Lock,
  TrendingUp,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { PrivateAmount, useAmountPrivacy } from '../lib/amountPrivacy';
import { SingleParallaxCard, QUANTUM_CARD_EDITIONS } from './QuantumParallaxCard';
import type { SubholdingCardData } from '../App';
import { other11Companies, getCompanyLogo } from '../data/companyLogos';

export type AppTabId =
  | 'landing'
  | 'architecture'
  | 'simulator'
  | 'calculator'
  | 'dossier'
  | '3d'
  | 'careers'
  | 'login'
  | 'register'
  | 'investor_dashboard'
  | 'admin_dashboard';

interface EntitySummary {
  name: string;
  holdingKey: string;
  holdingName: string;
  category: string;
  type: string;
  role: string;
  tagline?: string;
  website?: string;
  domain?: string;
}

interface LandingPageProps {
  theme: 'dark' | 'light';
  language: 'nl' | 'en';
  subholdings: SubholdingCardData[];
  entities: EntitySummary[];
  onNavigateTab: (tab: AppTabId) => void;
  onSelectSubholding: (holdcoId: string, targetView: 'architecture' | '3d') => void;
  onSelectChapter: (chapterNum: number) => void;
}

/* ========================================================================= */
/* 3D INTERACTIVE TILT BENTO CARD (Framer Motion 3D Perspective + Spotlight) */
/* ========================================================================= */
interface TiltBentoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  accentColor?: string;
}

const TiltBentoCard: React.FC<TiltBentoCardProps> = ({
  children,
  className = '',
  onClick,
  accentColor = 'rgba(41, 151, 255, 0.16)'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 0, active: false });

  const springConfig = { damping: 24, stiffness: 260, mass: 0.6 };
  const rotateX = useSpring(useTransform(mouseY, [0, 1], [6, -6]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-6, 6]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const normX = (e.clientX - rect.left) / rect.width;
    const normY = (e.clientY - rect.top) / rect.height;
    mouseX.set(normX);
    mouseY.set(normY);
    setSpotlightPos({ x: normX * 100, y: normY * 100, active: true });
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
    setSpotlightPos((prev) => ({ ...prev, active: false }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: prefersReducedMotion ? 0 : rotateX,
        rotateY: prefersReducedMotion ? 0 : rotateY,
        transformPerspective: 1100,
        transformStyle: 'preserve-3d'
      }}
      whileTap={{ scale: 0.985 }}
      className={`apple-glass-card rounded-[2rem] relative overflow-hidden group ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {/* Dynamic Cursor Specular Spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: spotlightPos.active ? 1 : 0,
          background: `radial-gradient(480px circle at ${spotlightPos.x}% ${spotlightPos.y}%, ${accentColor}, transparent 65%)`
        }}
      />
      <div style={{ transform: 'translateZ(18px)', transformStyle: 'preserve-3d' }} className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};


/* ========================================================================= */
/* MAIN LANDING PAGE COMPONENT                                               */
/* ========================================================================= */
export const LandingPage: React.FC<LandingPageProps> = ({
  theme,
  language,
  subholdings,
  entities,
  onNavigateTab,
  onSelectSubholding,
  onSelectChapter
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { amountsVisible, toggleAmounts } = useAmountPrivacy();

  // 3D Hero controls
  const [is3DPaused, setIs3DPaused] = useState<boolean>(false);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'topdown' | 'closeup'>('orbit');
  const [hoveredSubIdx, setHoveredSubIdx] = useState<number | null>(null);

  // Interactive Motion Pipeline state
  const [activePipelineStage, setActivePipelineStage] = useState<number>(0);

  // Interactive 3D Shareholder Pass state
  const [selectedCardEditionId, setSelectedCardEditionId] = useState<string>('obsidian');
  const [cardRevealed, setCardRevealed] = useState<boolean>(false);

  // Entity directory filter
  const [entityFilter, setEntityFilter] = useState<string>('all');

  // Scroll-driven motion values
  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const smoothScroll = useSpring(scrollYProgress, { damping: 28, stiffness: 180 });
  const heroScale = useTransform(smoothScroll, [0, 0.18], [1, 0.96]);
  const heroRotateX = useTransform(smoothScroll, [0, 0.2], [0, 6]);

  const pipelineStages = [
    {
      id: 0,
      badge: 'FASE 01',
      title: language === 'en' ? 'Talent & Gateway Inflow' : 'Talent & Gateway Instroom',
      subtitle: 'VVC Ltd • DJOBBA Ltd • Immigratiepunt Ltd • Zheavenzy Ltd',
      metric: '4 Gateway Entiteiten',
      desc:
        language === 'en'
          ? 'Qualified international IT professionals, sales partners and independent artists enter through the ring-fenced Talent & Gateway subholding.'
          : 'Gekwalificeerde internationale IT-professionals, commerciële partners en artiesten stromen binnen via de juridisch gescheiden Talent & Gateway subholding.',
      bullets: [
        'VVC Ltd: Partner- en deal-sourcing netwerk',
        'DJOBBA Ltd: B2B IT detachering & flexibele plaatsing',
        'Immigratiepunt Ltd: Expat relocatie, huisvesting & bankzaken',
        'Zheavenzy Ltd: Muziekdistributie & rechtenbeheer'
      ],
      targetSub: 'Talent'
    },
    {
      id: 1,
      badge: 'FASE 02',
      title: language === 'en' ? 'AI Execution & Cashflow Engine' : 'AI Executie & Kasstroommotor',
      subtitle: 'Investbotiq Ltd • CRMos Ltd • Spontiva Ltd',
      metric: 'Realtime API Orchestratie',
      desc:
        language === 'en'
          ? 'Investbotiq IQ Bot & Agent coordinates order matching, CRMos connects Field Sales, Callcenters and Recruitment, and Spontiva accelerates T=0 to T=1 working capital.'
          : 'Investbotiq IQ Bot & Agent coördineert orderdistributie, CRMos verbindt Field Sales, Callcenters en Recruitment, en Spontiva versnelt T=0 naar T=1 werkkapitaal.',
      bullets: [
        'Investbotiq Ltd: Autonome order- en kapitaalallocatie',
        'CRMos Ltd: Hybride CRM voor Sales, Callcenters & ATS',
        'Spontiva Ltd: Time Gap Cashflow (TGC) optimalisatie',
        '100% ring-fenced IP-licenties in Londen UK'
      ],
      targetSub: 'IP_Tech'
    },
    {
      id: 2,
      badge: 'FASE 03',
      title: language === 'en' ? 'Clearing, Escrow & Media Compute' : 'Clearing, Escrow & Media Compute',
      subtitle: 'Xabi World Ltd • Boostplug Ltd • Logs.rent',
      metric: '€ 1.500 / mnd Media Output',
      desc:
        language === 'en'
          ? 'Xabi World processes split-payments via segregated third-party escrow accounts while Boostplug and Logs.rent monetize streaming growth and digital asset accounts.'
          : 'Xabi World verwerkt split-payments via gescheiden Stichting Derdengelden escrow, terwijl Boostplug en Logs.rent streamingcampagnes en digitale accounts afwikkelen.',
      bullets: [
        'Xabi World Ltd: Clearing rails zonder bancair balansrisico',
        'Boostplug Ltd: Zakelijke streaminggroei & geverifieerde reviews',
        'Logs.rent: Digitale beurs voor accountverhuur & orderboeken',
        'Directe settlement per transactiecyclus'
      ],
      targetSub: 'Fintech'
    },
    {
      id: 3,
      badge: 'FASE 04',
      title: language === 'en' ? 'PropTech & Residential Yield' : 'PropTech & Vastgoedrendement',
      subtitle: 'WoningVry Ltd • Afterstudenthousing Ltd',
      metric: '€ 1.125 / mnd Vastgoed Output',
      desc:
        language === 'en'
          ? 'Non-mortgage residential access (€200k–€650k across 4 rounds) combined with structural LongStay and dynamic short-stay BnB occupancy.'
          : 'Non-hypotheek woonmodel (€200k tot €650k over 4 rondes) gecombineerd met structurele LongStay en dynamische short-stay BnB bezetting.',
      bullets: [
        'WoningVry Ltd: Zonder BKR of hypotheek naar een koopwoning',
        'Afterstudenthousing Ltd: Young professional doorstroomwoningen',
        'Vastgoedcontracten 100% afgeschermd van de tech-modules',
        'Cumulatief cohort-volume: € 204.750 per lid over 12 maanden'
      ],
      targetSub: 'RealEstate'
    }
  ];

  const activeStageData = pipelineStages[activePipelineStage] || pipelineStages[0];
  const activeEdition = QUANTUM_CARD_EDITIONS.find((c) => c.id === selectedCardEditionId) || QUANTUM_CARD_EDITIONS[0];

  const visibleEntities = entities.filter((e) => {
    if (entityFilter === 'all') return true;
    return e.category === entityFilter;
  });

  const renderIcon = (iconName: string, className = 'w-5 h-5') => {
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
  };

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 min-h-0 h-full w-full overflow-y-auto overflow-x-hidden scroll-smooth relative select-none sm:select-auto bg-black text-[#f5f5f7]"
    >
      {/* Top Scroll Progress Hairline */}
      <motion.div
        style={{ scaleX: smoothScroll, transformOrigin: '0% 50%' }}
        className="sticky top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#0071e3] via-[#2997ff] to-[#30d158] z-50 pointer-events-none"
      />

      {/* Subtle Apple Pro Ambient OLED Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[760px] h-[420px] rounded-full bg-[#0071e3]/15 blur-[140px]" />
        <div className="absolute top-[40%] -right-40 w-[520px] h-[520px] rounded-full bg-[#2997ff]/10 blur-[150px]" />
        <div className="absolute bottom-0 -left-40 w-[520px] h-[420px] rounded-full bg-[#0071e3]/10 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-24 space-y-20 sm:space-y-28">
        {/* ================================================================= */}
        {/* SECTION 1: APPLE PRO HERO + 3D SPATIAL HARDWARE SHOWCASE          */}
        {/* ================================================================= */}
        <section className="space-y-10 sm:space-y-12">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            {/* Specular Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex flex-wrap items-center justify-center gap-2 px-4 py-1.5 rounded-full apple-glass text-xs font-medium text-[#f5f5f7]"
            >
              <span className="w-2 h-2 rounded-full bg-[#30d158]" />
              <span className="font-semibold text-white">QuantumInitium Ltd</span>
              <span className="text-[#86868b]">•</span>
              <span className="text-[#2997ff] font-mono text-[11px]">Londen UK Holding</span>
              <span className="text-[#86868b] hidden sm:inline">•</span>
              <span className="text-[#86868b] hidden sm:inline">5 Subholdings & 12 Entiteiten</span>
            </motion.div>

            {/* Apple HIG Display Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontSize: 'clamp(2.15rem, 1.35rem + 3.8vw, 4.4rem)' }}
              className="font-semibold tracking-[-0.03em] leading-[1.06] apple-heading-gradient"
            >
              {language === 'en'
                ? 'One Motherholding. Five Ring-Fenced Subholdings. Twelve Operating Entities.'
                : 'Eén Moederholding. Vijf Subholdings. Twaalf Entiteiten.'}
            </motion.h1>

            {/* Direct, Factual Subcopy (Zero AI-Slop) */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg text-[#86868b] max-w-2xl mx-auto font-normal leading-relaxed"
            >
              {language === 'en'
                ? 'Central capital allocation and IFRS governance in London. Strict legal separation between AI SaaS, Fintech clearing, IT recruitment, media compute and non-mortgage real estate.'
                : 'Centrale kapitaalallocatie en IFRS-governance vanuit Londen. Strikte juridische scheiding tussen AI-software, Fintech clearing, IT-detachering, streaming-compute en non-hypotheek vastgoed.'}
            </motion.p>

            {/* Primary Apple CTA Bar + Interactive Amount Privacy Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap items-center justify-center gap-3 pt-2"
            >
              <button
                onClick={() => onNavigateTab('3d')}
                className="apple-btn-white px-6 py-3 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-[#0071e3]" />
                <span>{language === 'en' ? 'Open 3D Ecosystem' : 'Open 3D Ecosysteem'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigateTab('register')}
                className="apple-btn-primary px-6 py-3 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>{language === 'en' ? 'Shareholder Access' : 'Aandeelhouders Toegang'}</span>
              </button>

              <button
                onClick={() => onNavigateTab('dossier')}
                className="apple-btn-secondary px-5 py-3 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-[#2997ff]" />
                <span>{language === 'en' ? 'Institutional Dossier (10 Ch.)' : 'Institutioneel Dossier (10 Hfdst.)'}</span>
              </button>
            </motion.div>

            {/* Key Verified Metrics Bar with Interactive `👁️` Privacy Masking */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.35 }}
              className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#86868b]"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#30d158]" />
                <span>100% Ring-Fenced UK Structuur</span>
              </div>
              <span className="hidden sm:inline text-white/15">|</span>
              <div className="flex items-center gap-2">
                <span>12-Mnd Cohort Volume:</span>
                <PrivateAmount value="€ 204.750 / lid" />
              </div>
              <span className="hidden sm:inline text-white/15">|</span>
              <div className="flex items-center gap-2">
                <span>Introductiekoers:</span>
                <PrivateAmount value="€ 8,20 / aandeel" />
              </div>
            </motion.div>
          </div>

          {/* 3D Hardware Display Frame Showcase */}
          <motion.div
            style={{
              scale: prefersReducedMotion ? 1 : heroScale,
              rotateX: prefersReducedMotion ? 0 : heroRotateX,
              transformPerspective: 1400
            }}
            className="apple-hardware-frame rounded-[2rem] sm:rounded-[2.5rem] p-2 sm:p-3.5 relative overflow-hidden"
          >
            <div className="rounded-[1.6rem] sm:rounded-[2rem] bg-[#060608] border border-white/10 overflow-hidden relative">
              {/* Top macOS / VisionOS Window Bar */}
              <div className="apple-glass border-b border-white/[0.08] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 z-20 relative">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-xs font-mono text-[#86868b] pl-2 border-l border-white/10">
                    QuantumInitium Spatial Core • WebGL 3D
                  </span>
                </div>

                {/* Segmented Pill Camera Mode Switcher + Pause Button */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="bg-white/[0.06] p-1 rounded-full border border-white/10 flex items-center text-[11px] font-medium">
                    {(
                      [
                        { id: 'orbit', label: 'Orbit 3D' },
                        { id: 'topdown', label: 'Top-Down' },
                        { id: 'closeup', label: 'Core Focus' }
                      ] as const
                    ).map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => setCameraMode(preset.id)}
                        className={`px-3 py-1 rounded-full transition-all cursor-pointer relative ${
                          cameraMode === preset.id ? 'text-white font-semibold' : 'text-[#86868b] hover:text-white'
                        }`}
                      >
                        {cameraMode === preset.id && (
                          <motion.span
                            layoutId="heroCamPill"
                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                            className="absolute inset-0 rounded-full bg-[#0071e3] -z-10"
                          />
                        )}
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIs3DPaused((p) => !p)}
                    className="apple-btn-secondary px-3 py-1.5 rounded-full text-[11px] font-mono inline-flex items-center gap-1.5 cursor-pointer"
                    title={is3DPaused ? 'Hervat 3D rotatie' : 'Pauzeer 3D rotatie'}
                    aria-label={is3DPaused ? 'Hervat 3D rotatie' : 'Pauzeer 3D rotatie'}
                  >
                    {is3DPaused ? <Play className="w-3 h-3 text-[#30d158]" /> : <Pause className="w-3 h-3 text-[#2997ff]" />}
                    <span>{is3DPaused ? 'Play' : 'Pause'}</span>
                  </button>
                </div>
              </div>

              {/* Main Split Inside Hardware Frame: Interactive 3D Canvas + Live Ring-Fence Selector */}
              <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[420px]">
                <div className="lg:col-span-8 relative min-h-[360px] sm:min-h-[440px] flex items-center justify-center">
                  <React.Suspense
                    fallback={
                      <div className="w-full h-full min-h-[360px] sm:min-h-[440px] flex items-center justify-center">
                        <img src="/favicon.svg" alt="" className="w-20 h-20 opacity-70 animate-pulse" />
                      </div>
                    }
                  >
                    <QuantumHero3DCore
                      isPaused={is3DPaused || Boolean(prefersReducedMotion)}
                      cameraMode={cameraMode}
                      theme={theme}
                      activeSubholdingIndex={hoveredSubIdx}
                    />
                  </React.Suspense>

                  {/* Floating Spatial HUD Overlay Bottom-Left */}
                  <div className="absolute bottom-4 left-4 right-4 sm:right-auto apple-glass px-4 py-2.5 rounded-2xl border border-white/12 flex items-center justify-between sm:justify-start gap-4 text-xs pointer-events-none">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#86868b] block">
                        Actieve 3D Topologie
                      </span>
                      <span className="font-semibold text-white">
                        {hoveredSubIdx !== null && subholdings[hoveredSubIdx + 1]
                          ? subholdings[hoveredSubIdx + 1].title
                          : 'Moederholding + 5 Subholdings (12 Ltd’s)'}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30 font-mono text-[10px] font-semibold">
                      Ring-Fenced
                    </span>
                  </div>
                </div>

                {/* Right Column inside Hardware Frame: Interactive Subholding Orbit Selector */}
                <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/[0.08] p-4 sm:p-5 flex flex-col justify-between bg-[#121215]/75">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-[#2997ff] font-semibold">
                        Interactieve Subholdings
                      </span>
                      <span className="text-[11px] font-mono text-[#86868b]">Hover of klik</span>
                    </div>

                    <div className="space-y-2">
                      {subholdings.slice(1).map((sub, idx) => {
                        const isHovered = hoveredSubIdx === idx;
                        return (
                          <motion.div
                            key={sub.id}
                            onMouseEnter={() => setHoveredSubIdx(idx)}
                            onMouseLeave={() => setHoveredSubIdx(null)}
                            onClick={() => onSelectSubholding(sub.id, '3d')}
                            whileHover={{ x: 4 }}
                            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                              isHovered
                                ? 'bg-[#0071e3]/20 border-[#2997ff]/50 shadow-lg'
                                : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.08] text-[#2997ff] border border-white/10 shrink-0">
                                  {sub.numberTag}
                                </span>
                                <span className="text-xs font-semibold text-white truncate">{sub.title}</span>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-[#86868b] shrink-0" />
                            </div>
                            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#86868b]">
                              <span className="truncate">{sub.entityNames.join(' • ')}</span>
                              <span className="text-[#30d158] font-mono text-[10px] shrink-0 ml-2">
                                {sub.entitiesCount} Ltd
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigateTab('3d')}
                      className="apple-btn-primary w-full py-2.5 px-4 rounded-full text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>Volledige 3D Ruimte Openen</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 1.5: THE 11 PORTFOLIO COMPANIES (OFFICIAL LOGOS & SHOWCASE) */}
        {/* ================================================================= */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2997ff] font-semibold block">
                {language === 'en' ? 'Portfolio Architecture • 11 Companies' : 'Gevalideerde Portefeuille • 11 Bedrijven'}
              </span>
              <h2
                style={{ fontSize: 'clamp(1.65rem, 1.2rem + 2vw, 2.75rem)' }}
                className="font-semibold tracking-[-0.03em] leading-[1.08] apple-heading-gradient"
              >
                {language === 'en'
                  ? 'The 11 Operating Companies in the Ecosystem'
                  : 'De 11 Bedrijven binnen het Ecosysteem'}
              </h2>
              <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                {language === 'en'
                  ? 'Beside the London parent holding QuantumInitium Ltd, these 11 dedicated companies operate across 5 ring-fenced subholdings — each with its own cashflow, proprietary technology, and operational leadership.'
                  : 'Naast de centrale moederholding QuantumInitium Ltd (Londen) opereren deze 11 gespecialiseerde bedrijven binnen 5 ring-fenced subholdings — elk met eigen kasstromen, intellectueel eigendom en directie.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigateTab('architecture')}
              className="apple-btn-secondary px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <span>{language === 'en' ? 'View Structure' : 'Bekijk Holdingstructuur'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Interactive Logo Marquee Banner */}
          <div className="relative overflow-hidden rounded-3xl apple-glass border border-white/10 py-4 px-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black via-black/80 to-transparent z-10" />

            <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-1 px-4">
              {other11Companies.map((comp) => (
                <a
                  key={comp.id}
                  href={comp.website}
                  target="_blank"
                  rel="noreferrer"
                  title={`${comp.name} — ${comp.tagline}`}
                  className="group shrink-0 flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] hover:border-cyan-400/40 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-white/[0.08] border border-white/10 p-1.5 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <img
                      src={comp.logoUrl}
                      alt={comp.name}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                      <span>{comp.name}</span>
                      <ExternalLink className="w-2.5 h-2.5 text-[#86868b] group-hover:text-cyan-400 opacity-60" />
                    </div>
                    <div className="text-[10px] font-mono text-[#86868b]">
                      {comp.domain}
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* 11 Company Bento Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {other11Companies.map((comp, idx) => (
              <motion.div
                key={comp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, delay: idx * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="apple-glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 hover:border-cyan-400/35 transition-all group"
              >
                <div className="space-y-3">
                  {/* Brand Logo + Subholding Badge */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.08] border border-white/12 p-2 flex items-center justify-center shadow-md group-hover:border-cyan-400/50 group-hover:bg-white/[0.14] group-hover:scale-105 transition-all">
                      <img
                        src={comp.logoUrl}
                        alt={`${comp.name} logo`}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-[#2997ff] border border-white/10 shrink-0">
                      {comp.holdingName.split(':')[0]}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {comp.name}
                    </h3>
                    <p className="text-[11px] font-mono text-[#2997ff] line-clamp-1 mt-0.5">
                      {comp.type}
                    </p>
                  </div>

                  <p className="text-xs text-[#86868b] leading-relaxed line-clamp-2">
                    {comp.role}
                  </p>
                </div>

                {/* Footer: Live domain + 3D trigger */}
                <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#2997ff] hover:underline inline-flex items-center gap-1 truncate max-w-[150px]"
                  >
                    <Globe className="w-3 h-3 shrink-0" />
                    <span className="truncate">{comp.domain}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>

                  <button
                    type="button"
                    onClick={() => onSelectSubholding(comp.holdingKey, '3d')}
                    className="text-white hover:text-cyan-300 transition-colors cursor-pointer inline-flex items-center gap-0.5"
                  >
                    <span>3D Orbit</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 2: 3D TILT BENTO GRID — DE 6 KERNPIJLERS VAN DE HOLDING    */}
        {/* ================================================================= */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2997ff] font-semibold block">
                Bento Architectuur • 3D Perspective Tilt
              </span>
              <h2
                style={{ fontSize: 'clamp(1.65rem, 1.2rem + 2vw, 2.75rem)' }}
                className="font-semibold tracking-[-0.03em] leading-[1.08] apple-heading-gradient"
              >
                {language === 'en'
                  ? 'Six Ring-Fenced Pillars. Zero Cross-Contamination.'
                  : 'Zes Juridisch Gescheiden Pijlers. Geen Kruisbesmetting.'}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('architecture')}
              className="apple-btn-secondary px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 self-start md:self-auto cursor-pointer"
            >
              <Network className="w-3.5 h-3.5 text-[#2997ff]" />
              <span>Bekijk Juridische Flow Matrix</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {subholdings.map((sub, idx) => (
              <motion.div
                key={sub.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.55, delay: idx * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <TiltBentoCard
                  onClick={() => onSelectSubholding(sub.id, 'architecture')}
                  className="p-6 sm:p-7 h-full flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-white/[0.07] text-[#2997ff] border border-white/12">
                        {sub.numberTag}
                      </span>
                      <div className="w-10 h-10 rounded-2xl bg-[#0071e3]/15 border border-[#2997ff]/30 flex items-center justify-center text-[#2997ff]">
                        {renderIcon(sub.iconName, 'w-5 h-5')}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[11px] font-mono text-[#86868b] uppercase tracking-wider">
                        {sub.sector}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                        {sub.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-[#86868b] leading-relaxed">
                      {sub.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-5 border-t border-white/[0.08] space-y-3">
                    <div className="flex flex-wrap gap-1.5">
                      {sub.entityNames.map((name) => {
                        const pillLogo = getCompanyLogo(name);
                        return (
                          <span
                            key={name}
                            className="inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.05] text-[#f5f5f7] border border-white/10 hover:border-white/25 transition-colors"
                          >
                            {pillLogo && (
                              <img src={pillLogo} alt="" className="w-3.5 h-3.5 object-contain rounded-sm" />
                            )}
                            <span>{name}</span>
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-[#30d158] font-mono text-[11px] flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> 100% Ring-Fenced
                      </span>
                      <span className="text-[#2997ff] font-medium inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Inspecteer</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </TiltBentoCard>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 3: INTERACTIVE MOTION PIPELINE (FRAMER MOTION LAYOUTID)   */}
        {/* ================================================================= */}
        <section className="apple-glass rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-white/12 space-y-8 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#2997ff]">
                <Bot className="w-4 h-4" />
                <span>Autonome Executie & Kapitaalrotatie</span>
              </div>
              <h2
                style={{ fontSize: 'clamp(1.5rem, 1.1rem + 1.8vw, 2.4rem)' }}
                className="font-semibold tracking-[-0.03em] leading-[1.1] text-white"
              >
                {language === 'en'
                  ? 'From Talent Onboarding to Real Estate & Clearing'
                  : 'Van Talent Instroom naar Clearing, Compute & Vastgoed'}
              </h2>
              <p className="text-xs sm:text-sm text-[#86868b]">
                Selecteer een fase om de geautomatiseerde samenhang tussen de 12 werkmaatschappijen te bekijken.
              </p>
            </div>

            {/* Apple Segmented Pill Switcher with Framer Motion layoutId */}
            <div className="bg-white/[0.06] p-1.5 rounded-full border border-white/10 flex items-center overflow-x-auto no-scrollbar gap-1 self-start">
              {pipelineStages.map((stage) => {
                const isActive = activePipelineStage === stage.id;
                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActivePipelineStage(stage.id)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors relative cursor-pointer ${
                      isActive ? 'text-white font-semibold' : 'text-[#86868b] hover:text-white'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="pipelineStagePill"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        className="absolute inset-0 rounded-full bg-[#0071e3] shadow-md -z-10"
                      />
                    )}
                    {stage.badge}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Animated Stage Content Panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStageData.id}
              initial={{ opacity: 0, y: 14, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center pt-2"
            >
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0071e3]/15 border border-[#2997ff]/30 text-xs font-mono text-[#2997ff]">
                  <span>{activeStageData.badge}</span>
                  <span>•</span>
                  <span>
                    {activeStageData.metric.includes('€') ? (
                      <PrivateAmount value={activeStageData.metric} />
                    ) : (
                      activeStageData.metric
                    )}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
                    {activeStageData.title}
                  </h3>
                  <div className="text-xs font-mono text-[#2997ff]">{activeStageData.subtitle}</div>
                </div>

                <p className="text-sm text-[#86868b] leading-relaxed">{activeStageData.desc}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {activeStageData.bullets.map((b, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-start gap-2.5 text-xs text-[#f5f5f7]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#30d158] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigateTab('simulator')}
                    className="apple-btn-primary px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bot className="w-4 h-4" />
                    <span>Start IQ Bot Simulator</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onSelectSubholding(activeStageData.targetSub, '3d')}
                    className="apple-btn-secondary px-4 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-[#2997ff]" />
                    <span>Toon Subholding in 3D</span>
                  </button>
                </div>
              </div>

              {/* Animated Visual Flow Schematic */}
              <div className="lg:col-span-5 apple-glass-card rounded-3xl p-6 space-y-4 border border-white/12">
                <div className="flex items-center justify-between text-xs border-b border-white/[0.08] pb-3">
                  <span className="font-mono text-[#86868b] uppercase">Live Pipeline Status</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[#30d158] text-[11px]">
                    <span className="w-2 h-2 rounded-full bg-[#30d158] animate-pulse" />
                    Gevalideerd
                  </span>
                </div>

                <div className="space-y-3">
                  {pipelineStages.map((s) => {
                    const isCurrent = s.id === activePipelineStage;
                    const isPassed = s.id < activePipelineStage;
                    return (
                      <div
                        key={s.id}
                        onClick={() => setActivePipelineStage(s.id)}
                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'bg-[#0071e3]/20 border-[#2997ff]/60 text-white shadow-md'
                            : isPassed
                            ? 'bg-[#30d158]/10 border-[#30d158]/30 text-[#f5f5f7]'
                            : 'bg-white/[0.02] border-white/[0.07] text-[#86868b] hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-6 h-6 rounded-full text-[11px] font-mono font-bold flex items-center justify-center shrink-0 ${
                              isCurrent
                                ? 'bg-[#0071e3] text-white'
                                : isPassed
                                ? 'bg-[#30d158] text-black'
                                : 'bg-white/10 text-[#86868b]'
                            }`}
                          >
                            {s.id + 1}
                          </span>
                          <div className="truncate">
                            <div className="text-xs font-semibold truncate">{s.title}</div>
                            <div className="text-[10px] font-mono text-[#86868b] truncate">{s.subtitle}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        {/* ================================================================= */}
        {/* SECTION 4: 3D SHAREHOLDER PASS & COHORT FINANCIAL PRIVACY (`👁️`) */}
        {/* ================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Interactive 3D Parallax Shareholder Card Preview */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 apple-glass-card rounded-[2rem] p-6 sm:p-8 flex flex-col items-center text-center space-y-5"
          >
            <div className="flex items-center justify-between w-full text-xs">
              <span className="font-mono text-[#2997ff] uppercase tracking-wider font-semibold">
                3D Parallax Custody Pass
              </span>
              <button
                type="button"
                onClick={() => setCardRevealed((r) => !r)}
                className="apple-btn-secondary px-3 py-1 rounded-full text-[11px] font-mono inline-flex items-center gap-1.5 cursor-pointer"
              >
                {cardRevealed ? <EyeOff className="w-3 h-3 text-[#2997ff]" /> : <Eye className="w-3 h-3 text-[#2997ff]" />}
                <span>{cardRevealed ? 'Verberg ID' : 'Toon Depot ID'}</span>
              </button>
            </div>

            <div className="py-2 flex justify-center items-center">
              <SingleParallaxCard
                edition={activeEdition}
                holderName="QUANTUM SHAREHOLDER"
                shares={2500}
                cashBalance={20500}
                isRevealed={cardRevealed}
                isFrozen={false}
                isSelected={true}
                width={330}
                height={208}
                theme={theme}
              />
            </div>

            {/* Edition Switcher Pills */}
            <div className="bg-white/[0.06] p-1 rounded-full border border-white/10 flex flex-wrap items-center justify-center gap-1">
              {QUANTUM_CARD_EDITIONS.map((ed) => {
                const isSelected = selectedCardEditionId === ed.id;
                return (
                  <button
                    key={ed.id}
                    type="button"
                    onClick={() => setSelectedCardEditionId(ed.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#0071e3] text-white font-semibold shadow-sm'
                        : 'text-[#86868b] hover:text-white'
                    }`}
                  >
                    {ed.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-[#86868b] max-w-md">
              Beweeg uw muis of vinger over het aandeelhouderscertificaat voor 3D diepte-parallax en holografische reflectie.
            </p>
          </motion.div>

          {/* Right: Cohort Financial Architecture & Privacy Controls */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="space-y-3">
              <span className="text-xs font-mono uppercase tracking-widest text-[#30d158] font-semibold block">
                78 Cumulatieve Maandcycli • Financiële Transparantie
              </span>
              <h2
                style={{ fontSize: 'clamp(1.6rem, 1.15rem + 1.9vw, 2.5rem)' }}
                className="font-semibold tracking-[-0.03em] leading-[1.08] apple-heading-gradient"
              >
                {language === 'en'
                  ? 'Verified Cohort Yield & Shareholder Portal'
                  : 'Geverifieerd Cohort-Model & Aandeelhoudersportaal'}
              </h2>
              <p className="text-sm text-[#86868b] leading-relaxed">
                Financiële bedragen zijn standaard afgeschermd voor bezoekers. Klik op een{' '}
                <button
                  type="button"
                  onClick={toggleAmounts}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.08] text-[#2997ff] border border-white/15 text-xs font-mono cursor-pointer hover:bg-white/[0.14]"
                >
                  <span>{amountsVisible ? 'Zichtbaar' : '€ ••••••'}</span>
                  <span>👁️</span>
                </button>{' '}
                badge om in te loggen of bedragen direct vrij te geven.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="apple-glass-card p-5 rounded-3xl space-y-1.5">
                <span className="text-[11px] font-mono text-[#86868b] uppercase">Maandelijkse Output / Lid</span>
                <div className="text-xl font-bold text-white">
                  <PrivateAmount value="€ 2.625 / mnd" />
                </div>
                <p className="text-xs text-[#86868b]">Gecombineerd uit Media & Vastgoed</p>
              </div>

              <div className="apple-glass-card p-5 rounded-3xl space-y-1.5">
                <span className="text-[11px] font-mono text-[#86868b] uppercase">12-Mnd Cohort (78 Cycli)</span>
                <div className="text-xl font-bold text-white">
                  <PrivateAmount value="€ 204.750 / jaar" />
                </div>
                <p className="text-xs text-[#86868b]">Cumulatieve cohort-accumulatie</p>
              </div>

              <div className="apple-glass-card p-5 rounded-3xl space-y-1.5">
                <span className="text-[11px] font-mono text-[#86868b] uppercase">Waarderingsmultiple</span>
                <div className="text-xl font-bold text-[#2997ff] font-mono">4,0x P/S</div>
                <p className="text-xs text-[#86868b]">10.000.000 uitstaande aandelen</p>
              </div>

              <div className="apple-glass-card p-5 rounded-3xl space-y-1.5">
                <span className="text-[11px] font-mono text-[#86868b] uppercase">Huidige Aandelenkoers</span>
                <div className="text-xl font-bold text-[#30d158]">
                  <PrivateAmount value="€ 8,20" />
                </div>
                <p className="text-xs text-[#86868b]">Register of Members Londen</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onNavigateTab('calculator')}
                className="apple-btn-primary px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                <span>Open Interactieve Cohort Calculator</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigateTab('login')}
                className="apple-btn-secondary px-5 py-2.5 rounded-full text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-[#2997ff]" />
                <span>Inloggen op Portaal</span>
              </button>
            </div>
          </motion.div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 5: ALLE 12 ENTITEITEN BENTO OVERZICHT                     */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-widest text-[#2997ff] font-semibold block">
                Volledige Portfolio • 12 Werkmaatschappijen
              </span>
              <h2
                style={{ fontSize: 'clamp(1.5rem, 1.1rem + 1.8vw, 2.35rem)' }}
                className="font-semibold tracking-[-0.03em] leading-[1.1] text-white"
              >
                Directe Toegang tot Alle Groepsentiteiten
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="bg-white/[0.06] p-1 rounded-full border border-white/10 flex items-center gap-1 overflow-x-auto no-scrollbar self-start">
              {[
                { id: 'all', label: 'Alle (13)' },
                { id: 'holding', label: 'Moederholding' },
                { id: 'tech', label: 'IP & Tech' },
                { id: 'fintech', label: 'Fintech' },
                { id: 'talent', label: 'Talent' },
                { id: 'compute', label: 'Compute' },
                { id: 'proptech', label: 'PropTech' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setEntityFilter(cat.id)}
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    entityFilter === cat.id
                      ? 'bg-[#0071e3] text-white font-semibold'
                      : 'text-[#86868b] hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {visibleEntities.map((entity) => {
              const entityLogo = getCompanyLogo(entity.name);
              return (
                <motion.div
                  layout
                  key={entity.name}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="apple-glass-card rounded-3xl p-5 flex flex-col justify-between space-y-4 group hover:border-cyan-400/35 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {entityLogo ? (
                          <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/12 p-1.5 flex items-center justify-center shrink-0 shadow-sm group-hover:border-cyan-400/40 group-hover:scale-105 transition-all">
                            <img
                              src={entityLogo}
                              alt={entity.name}
                              className="w-full h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#0071e3]/15 border border-[#2997ff]/30 flex items-center justify-center text-[#2997ff] shrink-0">
                            <Building2 className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold text-sm text-white truncate block group-hover:text-cyan-300 transition-colors">
                            {entity.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#86868b] truncate block">
                            {entity.holdingName.split(':')[0]}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.07] text-[#2997ff] border border-white/10 shrink-0">
                        {entity.type}
                      </span>
                    </div>
                    <p className="text-xs text-[#86868b] line-clamp-3 leading-relaxed">{entity.role}</p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] font-mono">
                    {entity.website ? (
                      <a
                        href={entity.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#2997ff] hover:underline inline-flex items-center gap-1 truncate max-w-[140px]"
                      >
                        <Globe className="w-3 h-3 shrink-0" />
                        <span className="truncate">{entity.domain || entity.website.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ) : (
                      <span className="text-[#86868b]">Londen UK</span>
                    )}

                    <button
                      type="button"
                      onClick={() => onSelectSubholding(entity.holdingKey, '3d')}
                      className="text-white hover:text-[#2997ff] transition-colors cursor-pointer inline-flex items-center gap-0.5"
                    >
                      <span>3D</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 6: INSTITUTIONAL DOSSIER & CAREERS CTA FOOTER             */}
        {/* ================================================================= */}
        <section className="apple-glass rounded-[2rem] sm:rounded-[2.5rem] p-7 sm:p-10 border border-white/12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#2997ff] font-semibold">
              Directe Vervolgstappen
            </span>
            <h3 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              {language === 'en'
                ? 'Explore the 10-Chapter Dossier or 13 Open Positions'
                : 'Verken het 10-Delige Dossier of 13 Openstaande Vacatures'}
            </h3>
            <p className="text-xs sm:text-sm text-[#86868b]">
              Alle hoofdstukken, cap-table berekeningen, IFRS-richtlijnen en sollicitatieprocedures zijn direct toegankelijk.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => onSelectChapter(1)}
              className="apple-btn-white px-5 py-3 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-[#0071e3]" />
              <span>Lees Hoofdstuk 01</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('careers')}
              className="apple-btn-secondary px-5 py-3 rounded-full text-xs sm:text-sm font-semibold inline-flex items-center gap-2 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[#30d158]" />
              <span>13 Vacatures</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LandingPage;
