import React, { useRef, useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Sparkles, 
  FileCheck, 
  Layers, 
  ExternalLink,
  Building2,
  Award
} from 'lucide-react';

export interface CardEdition {
  id: string;
  name: string;
  badge: string;
  tier: string;
  certPrefix: string;
  certSuffix: string;
  depotRef: string;
  regQuarter: string;
  themeStyle: {
    background: string;
    borderColor: string;
    accentColor: string;
    chipGradient: string;
    textColor: string;
    subtextColor: string;
    glowColor: string;
    hologramType: string;
  };
}

export const QUANTUM_CARD_EDITIONS: CardEdition[] = [
  {
    id: 'obsidian',
    name: 'Obsidian Institutional Pass',
    badge: 'INSTITUTIONAL SERIE A',
    tier: 'Serie A Preferred Shareholder',
    certPrefix: 'QI-2027-SH',
    certSuffix: '08820',
    depotRef: 'London Register of Members',
    regQuarter: '2026-Q4',
    themeStyle: {
      background: 'linear-gradient(135deg, #0a0c13 0%, #151a28 50%, #06080e 100%)',
      borderColor: 'rgba(217, 119, 6, 0.45)',
      accentColor: '#f59e0b',
      chipGradient: 'linear-gradient(135deg, #fef08a 0%, #d97706 50%, #78350f 100%)',
      textColor: '#ffffff',
      subtextColor: '#94a3b8',
      glowColor: 'rgba(245, 158, 11, 0.25)',
      hologramType: 'gold'
    }
  },
  {
    id: 'gold',
    name: 'Founding Sovereign Bullion',
    badge: 'FOUNDING PARTNER',
    tier: 'Oprichters- & Strategische Participatie',
    certPrefix: 'QI-FOUND-2027',
    certSuffix: '07741',
    depotRef: 'Stichting Custody QI',
    regQuarter: '2026-Q3',
    themeStyle: {
      background: 'linear-gradient(135deg, #2a1b04 0%, #452a07 30%, #78470a 70%, #1f1302 100%)',
      borderColor: 'rgba(251, 191, 36, 0.7)',
      accentColor: '#fbbf24',
      chipGradient: 'linear-gradient(135deg, #ffffff 0%, #fde68a 50%, #b45309 100%)',
      textColor: '#fffbeb',
      subtextColor: '#fef3c7',
      glowColor: 'rgba(251, 191, 36, 0.35)',
      hologramType: 'rainbow-gold'
    }
  },
  {
    id: 'sapphire',
    name: 'Sapphire Treasury Pass',
    badge: 'STRATEGIC EQUITY',
    tier: 'Institutionele Kapitaalallocatie',
    certPrefix: 'QI-TRS-2027',
    certSuffix: '04409',
    depotRef: 'UK Substance Escrow',
    regQuarter: '2026-Q4',
    themeStyle: {
      background: 'linear-gradient(135deg, #031429 0%, #06264d 50%, #020b18 100%)',
      borderColor: 'rgba(56, 189, 248, 0.55)',
      accentColor: '#38bdf8',
      chipGradient: 'linear-gradient(135deg, #bae6fd 0%, #0284c7 50%, #0c4a6e 100%)',
      textColor: '#ffffff',
      subtextColor: '#7dd3fc',
      glowColor: 'rgba(56, 189, 248, 0.3)',
      hologramType: 'cyan'
    }
  },
  {
    id: 'emerald',
    name: 'Emerald Syndicate Pass',
    badge: 'SYNDICATE RESERVE',
    tier: 'Gekwalificeerd Syndicaatscertificaat',
    certPrefix: 'QI-SYND-2027',
    certSuffix: '09931',
    depotRef: 'London Custody Nominee',
    regQuarter: '2027-Q1',
    themeStyle: {
      background: 'linear-gradient(135deg, #021a11 0%, #063825 50%, #01110a 100%)',
      borderColor: 'rgba(52, 211, 153, 0.55)',
      accentColor: '#34d399',
      chipGradient: 'linear-gradient(135deg, #a7f3d0 0%, #059669 50%, #064e3b 100%)',
      textColor: '#ffffff',
      subtextColor: '#6ee7b7',
      glowColor: 'rgba(52, 211, 153, 0.3)',
      hologramType: 'emerald'
    }
  }
];

interface SingleParallaxCardProps {
  edition: CardEdition;
  holderName: string;
  shares: number;
  cashBalance: number;
  isRevealed: boolean;
  isFrozen: boolean;
  isSelected?: boolean;
  onSelect?: () => void;
  width?: number;
  height?: number;
  theme?: 'dark' | 'light';
}

/* Individuele 3D Parallax Aandeelhouderspas */
export const SingleParallaxCard: React.FC<SingleParallaxCardProps> = ({
  edition,
  holderName,
  shares,
  cashBalance: _cashBalance,
  isRevealed,
  isFrozen,
  isSelected = false,
  onSelect,
  width = 340,
  height = 215,
  theme: _theme = 'dark'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const layer0Ref = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);

  const processMovement = (e: MouseEvent | TouchEvent, isTouch: boolean) => {
    const card = cardRef.current;
    const container = containerRef.current;
    const shine = shineRef.current;
    const shadow = shadowRef.current;
    const layers = [layer0Ref.current, layer1Ref.current, layer2Ref.current];

    if (!card || !container || !shine || !shadow) return;

    const doc = document;
    const bdst = doc.body.scrollTop || doc.documentElement.scrollTop;
    const bdsl = doc.body.scrollLeft || doc.documentElement.scrollLeft;

    let pageX = 0;
    let pageY = 0;

    if (isTouch) {
      const touch = (e as TouchEvent).touches[0];
      if (!touch) return;
      pageX = touch.pageX;
      pageY = touch.pageY;
    } else {
      const mouse = e as MouseEvent;
      pageX = mouse.pageX;
      pageY = mouse.pageY;
    }

    const offsets = card.getBoundingClientRect();
    const w = card.clientWidth || card.offsetWidth || width;
    const h = card.clientHeight || card.offsetHeight || height;
    const wMultiple = 320 / w;

    const offsetX = 0.52 - (pageX - offsets.left - bdsl) / w;
    const offsetY = 0.52 - (pageY - offsets.top - bdst) / h;
    const dy = (pageY - offsets.top - bdst) - h / 2;
    const dx = (pageX - offsets.left - bdsl) - w / 2;

    const yRotate = (offsetX - dx) * (0.07 * wMultiple);
    const xRotate = (dy - offsetY) * (0.1 * wMultiple);

    let imgCSS = `rotateX(${xRotate}deg) rotateY(${yRotate}deg)`;

    const arad = Math.atan2(dy, dx);
    let angle = (arad * 180) / Math.PI - 90;
    if (angle < 0) {
      angle += 360;
    }

    imgCSS += ' scale3d(1.06, 1.06, 1.06)';
    container.style.transform = imgCSS;

    const shineOpacity = Math.min(0.65, Math.max(0.1, ((pageY - offsets.top - bdst) / h) * 0.55));
    shine.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${shineOpacity}) 0%, rgba(255,255,255,0) 80%)`;
    shine.style.transform = `translateX(${(offsetX * 3) - 0.1}px) translateY(${(offsetY * 3) - 0.1}px)`;

    shadow.style.transform = `translateX(${-dx * 0.15}px) translateY(${-dy * 0.15}px) scale(1.04)`;
    shadow.style.boxShadow = `0 ${20 + Math.abs(dy) * 0.25}px ${45 + Math.abs(dy) * 0.4}px ${edition.themeStyle.glowColor}, 0 10px 25px rgba(0,0,0,0.6)`;

    const totalLayers = 3;
    let revNum = totalLayers;
    for (let ly = 0; ly < totalLayers; ly++) {
      const layerElem = layers[ly];
      if (layerElem) {
        const transX = (offsetX * revNum) * ((ly * 3.2) / wMultiple);
        const transY = (offsetY * totalLayers) * ((ly * 3.2) / wMultiple);
        layerElem.style.transform = `translateX(${transX}px) translateY(${transY}px)`;
      }
      revNum--;
    }
  };

  const processEnter = () => {
    if (containerRef.current) {
      containerRef.current.classList.add('over');
    }
  };

  const processExit = () => {
    const container = containerRef.current;
    const shine = shineRef.current;
    const shadow = shadowRef.current;
    const layers = [layer0Ref.current, layer1Ref.current, layer2Ref.current];

    if (!container || !shine || !shadow) return;

    container.classList.remove('over');
    container.style.transform = 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    shine.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 60%)';
    shine.style.transform = 'translateX(0px) translateY(0px)';

    shadow.style.transform = 'translateX(0px) translateY(0px) scale(1)';
    shadow.style.boxShadow = '0 8px 30px rgba(0,0,0,0.5)';

    for (let ly = 0; ly < layers.length; ly++) {
      const layerElem = layers[ly];
      if (layerElem) {
        layerElem.style.transform = 'translateX(0px) translateY(0px)';
      }
    }
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => processMovement(e, false);
    const handleMouseEnter = () => processEnter();
    const handleMouseLeave = () => processExit();

    const handleTouchMove = (e: TouchEvent) => {
      processMovement(e, true);
    };
    const handleTouchStart = () => processEnter();
    const handleTouchEnd = () => processExit();

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('touchmove', handleTouchMove, { passive: true });
    card.addEventListener('touchstart', handleTouchStart, { passive: true });
    card.addEventListener('touchend', handleTouchEnd);

    const w = card.clientWidth || width;
    card.style.transform = `perspective(${w * 3}px)`;

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, [width, height, edition]);

  const handleCopyCertNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullCertId = `${edition.certPrefix}-${edition.certSuffix}`;
    navigator.clipboard.writeText(fullCertId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const certNumberDisplay = isRevealed 
    ? `${edition.certPrefix}-${edition.certSuffix}`
    : `${edition.certPrefix}-••••`;

  return (
    <div
      className={`relative inline-block select-none cursor-pointer group transition-all duration-300 ${
        isSelected ? 'ring-2 ring-amber-400/80 rounded-2xl shadow-xl' : ''
      }`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        margin: '10px'
      }}
      onClick={onSelect}
    >
      <div
        ref={cardRef}
        className="atvImg w-full h-full rounded-2xl relative"
        style={{
          transformStyle: 'preserve-3d',
          WebkitTapHighlightColor: 'rgba(0,0,0,0)'
        }}
      >
        <div
          ref={shadowRef}
          className="atvImg-shadow rounded-2xl pointer-events-none transition-transform duration-200"
          style={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            width: '90%',
            height: '90%',
            borderRadius: '16px',
            boxShadow: `0 12px 35px ${edition.themeStyle.glowColor}, 0 6px 16px rgba(0,0,0,0.5)`,
            zIndex: 1
          }}
        />

        <div
          ref={containerRef}
          className="atvImg-container w-full h-full rounded-2xl relative overflow-hidden transition-transform duration-100 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            border: `1px solid ${edition.themeStyle.borderColor}`,
            borderRadius: '16px',
            zIndex: 2
          }}
        >
          <div
            className="atvImg-layers w-full h-full relative overflow-hidden rounded-2xl"
            style={{
              transformStyle: 'preserve-3d',
              borderRadius: '16px'
            }}
          >
            {/* LAAG 0: Achtergrond, guilloche patroon & micro-grid */}
            <div
              ref={layer0Ref}
              className="atvImg-rendered-layer absolute inset-0 rounded-2xl transition-transform duration-100 ease-out"
              style={{
                background: edition.themeStyle.background,
                zIndex: 1
              }}
            >
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 30%, ${edition.themeStyle.accentColor} 0%, transparent 40%), radial-gradient(circle at 80% 70%, ${edition.themeStyle.accentColor} 0%, transparent 40%)`
                }}
              />
              <svg className="absolute inset-0 w-full h-full opacity-15 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id={`grid-${edition.id}`} width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 24 0 L 0 0 0 24" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white" />
                    <circle cx="12" cy="12" r="1" fill="currentColor" className="text-amber-300" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${edition.id})`} />
              </svg>
            </div>

            {/* LAAG 1: Institutioneel Zegel, Aandeelhoudersdata & Paspoortdetails */}
            <div
              ref={layer1Ref}
              className="atvImg-rendered-layer absolute inset-0 p-5 flex flex-col justify-between rounded-2xl transition-transform duration-100 ease-out pointer-events-none"
              style={{
                zIndex: 2
              }}
            >
              <div className="absolute right-3 top-6 font-mono font-black text-7xl select-none opacity-10 tracking-tighter" style={{ color: edition.themeStyle.accentColor }}>
                QI
              </div>

              {/* Bovenste rij: QuantumInitium merk & Custody Badge */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 flex items-center justify-center shadow-md">
                    <span className="text-slate-950 font-black text-[10px] font-mono">QI</span>
                  </div>
                  <div>
                    <div className="font-extrabold text-xs tracking-wider uppercase" style={{ color: edition.themeStyle.textColor }}>
                      QUANTUMINITIUM LTD
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-widest font-semibold" style={{ color: edition.themeStyle.accentColor }}>
                      {edition.badge}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" style={{ color: edition.themeStyle.subtextColor }} />
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold border" style={{
                    borderColor: edition.themeStyle.borderColor,
                    color: edition.themeStyle.accentColor,
                    backgroundColor: 'rgba(0,0,0,0.3)'
                  }}>
                    CUSTODY
                  </span>
                </div>
              </div>

              {/* Midden: Institutioneel Zegel & Aandelenregister Ticker */}
              <div className="flex items-center justify-between z-10 my-auto pt-2">
                <div 
                  className="w-10 h-7 rounded-md shadow-inner flex items-center justify-center relative overflow-hidden border border-amber-300/40"
                  style={{
                    background: edition.themeStyle.chipGradient
                  }}
                >
                  <Award className="w-4 h-4 text-slate-950" />
                </div>

                <div className="text-right">
                  <div className="text-[8px] font-mono uppercase tracking-wider text-slate-400">
                    AANDEELHOUDERSPAS
                  </div>
                  <div className="text-[10px] font-mono font-bold" style={{ color: edition.themeStyle.accentColor }}>
                    {shares.toLocaleString('nl-NL')} AANDELEN
                  </div>
                </div>
              </div>

              {/* Onderste blok: Certificaat-ID, Aandeelhouder, Registratie & Depot */}
              <div className="space-y-1.5 z-10">
                <div className="font-mono text-sm tracking-widest font-bold flex items-center justify-between" style={{ color: edition.themeStyle.textColor, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                  <span>{certNumberDisplay}</span>
                  {isFrozen && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 font-sans">
                      <Lock className="w-2.5 h-2.5" /> VERGRENDELD
                    </span>
                  )}
                </div>

                <div className="flex items-end justify-between text-[9px] font-mono pt-1">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Aandeelhouder</span>
                    <span className="font-bold uppercase tracking-wider truncate max-w-[150px] block" style={{ color: edition.themeStyle.textColor }}>
                      {holderName || 'INVESTEERDER'}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-slate-400 block text-[8px] uppercase">Registratie</span>
                    <span className="font-bold" style={{ color: edition.themeStyle.textColor }}>
                      {edition.regQuarter}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block text-[8px] uppercase">Depot</span>
                    <span className="font-bold truncate max-w-[100px] block" style={{ color: edition.themeStyle.accentColor }}>
                      {isRevealed ? edition.depotRef.split(' ')[0] : 'VERIFIEER'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LAAG 2: Institutioneel Holografisch Zegel */}
            <div
              ref={layer2Ref}
              className="atvImg-rendered-layer absolute inset-0 pointer-events-none rounded-2xl transition-transform duration-100 ease-out"
              style={{
                zIndex: 3
              }}
            >
              <div 
                className="absolute right-4 bottom-3 w-8 h-8 rounded-full border border-white/20 opacity-80 flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(217,119,6,0.2) 50%, rgba(56,189,248,0.25) 100%)'
                }}
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
            </div>

            {/* Parallax Shine Layer */}
            <div
              ref={shineRef}
              className="atvImg-shine pointer-events-none rounded-2xl"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 60%)',
                zIndex: 4,
                mixBlendMode: 'screen'
              }}
            />
          </div>
        </div>
      </div>

      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          type="button"
          onClick={handleCopyCertNumber}
          className="p-1.5 rounded-lg bg-slate-900/90 text-white hover:text-amber-400 border border-slate-700 shadow-md cursor-pointer transition-colors"
          title="Kopieer Certificaat ID"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

interface QuantumWalletCardsProps {
  holderName: string;
  shares: number;
  cashBalance: number;
  theme?: 'dark' | 'light';
}

export const QuantumWalletCards: React.FC<QuantumWalletCardsProps> = ({
  holderName,
  shares,
  cashBalance,
  theme = 'dark'
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>('obsidian');
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [isFrozen, setIsFrozen] = useState<boolean>(false);
  const [copiedSuccess, setCopiedSuccess] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'collection' | 'focused'>('collection');

  const activeCard = QUANTUM_CARD_EDITIONS.find(c => c.id === selectedCardId) || QUANTUM_CARD_EDITIONS[0];

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(`${label} gekopieerd naar klembord!`);
    setTimeout(() => setCopiedSuccess(null), 2500);
  };

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-200 relative overflow-hidden ${
      theme === 'light'
        ? 'bg-gradient-to-br from-white via-sky-50/50 to-blue-50/30 border-sky-200 text-sky-950 shadow-xl shadow-sky-500/5'
        : 'glass-panel border-slate-800 bg-[#070b14]/90 text-white shadow-2xl'
    }`}>
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* HEADER: Titel, Portefeuillekoppeling & View Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <FileCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400">
              QuantumInitium Shareholder Custody
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Geverifieerd • Register of Members
            </span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-black ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
            Institutionele Aandeelhouderspas & Custody ID
          </h3>
          <p className={`text-xs ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
            Officieel geregistreerd aandeelhouderscertificaat en bewaarbewijs voor QuantumInitium Ltd participaties.
          </p>
        </div>

        {/* Bedieningselementen: Weergave & Vertrouwelijke Gegevens */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setIsRevealed(!isRevealed)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isRevealed
                ? 'bg-amber-500/20 border-amber-400/50 text-amber-300'
                : theme === 'light'
                ? 'bg-white hover:bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isRevealed ? 'Verberg vertrouwelijke depotgegevens' : 'Toon volledige registergegevens'}
          >
            {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isRevealed ? 'Verberg Depot' : 'Toon Depot'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsFrozen(!isFrozen)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isFrozen
                ? 'bg-rose-500/20 border-rose-400/50 text-rose-300'
                : theme === 'light'
                ? 'bg-white hover:bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title={isFrozen ? 'Deblokkeer Pas' : 'Tijdelijk Vergrendelen'}
          >
            {isFrozen ? <Unlock className="w-3.5 h-3.5 text-rose-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isFrozen ? 'Vergrendeld' : 'Pas Vergrendelen'}</span>
          </button>

          <div className="flex items-center rounded-xl p-1 bg-slate-900 border border-slate-800">
            <button
              type="button"
              onClick={() => setViewMode('collection')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'collection'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span className="hidden sm:inline">4 Edities</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('focused')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'focused'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileCheck className="w-3 h-3" />
              <span className="hidden sm:inline">Focus Pas</span>
            </button>
          </div>
        </div>
      </div>

      {copiedSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{copiedSuccess}</span>
        </div>
      )}

      {/* WEERGAVE OPTIE 1: DE 4 PARTICIPATIE EDITIES */}
      {viewMode === 'collection' && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 py-4">
            {QUANTUM_CARD_EDITIONS.map((edition) => (
              <div key={edition.id} className="flex flex-col items-center">
                <SingleParallaxCard
                  edition={edition}
                  holderName={holderName}
                  shares={shares}
                  cashBalance={cashBalance}
                  isRevealed={isRevealed}
                  isFrozen={isFrozen}
                  isSelected={selectedCardId === edition.id}
                  onSelect={() => setSelectedCardId(edition.id)}
                  width={310}
                  height={195}
                  theme={theme}
                />
                <button
                  type="button"
                  onClick={() => setSelectedCardId(edition.id)}
                  className={`mt-1 px-3 py-1 rounded-full text-[11px] font-mono font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedCardId === edition.id
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                      : theme === 'light'
                      ? 'bg-white border-sky-200 text-sky-800 hover:bg-sky-50'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: edition.themeStyle.accentColor }} />
                  <span>{edition.name.split(' ')[0]}</span>
                  {selectedCardId === edition.id && <Check className="w-3 h-3 text-amber-400" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEERGAVE OPTIE 2: FOCUSED WEERGAVE MET UITGEBREIDE DEPOTDETAILS */}
      {viewMode === 'focused' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
          <div className="lg:col-span-6 flex justify-center items-center">
            <SingleParallaxCard
              edition={activeCard}
              holderName={holderName}
              shares={shares}
              cashBalance={cashBalance}
              isRevealed={isRevealed}
              isFrozen={isFrozen}
              isSelected={true}
              width={360}
              height={228}
              theme={theme}
            />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className={`p-5 rounded-2xl border ${
              theme === 'light' ? 'bg-white border-sky-200 shadow-sm' : 'bg-slate-900/80 border-slate-800'
            }`}>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-3">
                <div>
                  <h4 className={`text-base font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                    {activeCard.name}
                  </h4>
                  <p className="text-xs text-amber-400 font-mono">{activeCard.tier}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  {activeCard.badge}
                </span>
              </div>

              {/* Grid met officiële registergegevens */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-950/60 border-slate-800/80'}`}>
                  <span className="text-slate-400 block text-[10px]">Certificaatnummer</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className={`font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                      {isRevealed ? `${activeCard.certPrefix}-${activeCard.certSuffix}` : `${activeCard.certPrefix}-••••`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${activeCard.certPrefix}-${activeCard.certSuffix}`, 'Certificaat ID')}
                      className="text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-950/60 border-slate-800/80'}`}>
                  <span className="text-slate-400 block text-[10px]">Depot & Bewaring</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className={`font-bold truncate ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                      {isRevealed ? activeCard.depotRef : 'Geregistreerd Depot'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeCard.depotRef, 'Depot Referentie')}
                      className="text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-950/60 border-slate-800/80'}`}>
                  <span className="text-slate-400 block text-[10px]">Aandelenbezit</span>
                  <span className="text-cyan-400 font-bold block mt-0.5">
                    {shares.toLocaleString('nl-NL')} aandelen (€ 8,20)
                  </span>
                </div>

                <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-950/60 border-slate-800/80'}`}>
                  <span className="text-slate-400 block text-[10px]">Liquiditeitssaldo</span>
                  <span className="text-emerald-400 font-bold block mt-0.5">
                    €{cashBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Selecteer Editie:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {QUANTUM_CARD_EDITIONS.map(ed => (
                  <button
                    key={ed.id}
                    type="button"
                    onClick={() => setSelectedCardId(ed.id)}
                    className={`px-3 py-1 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                      selectedCardId === ed.id
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                        : theme === 'light'
                        ? 'bg-white border-sky-200 text-sky-900 hover:bg-sky-50'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {ed.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER MET CUSTODY & GOVERNANCE INFORMATIE */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => handleCopy(`${activeCard.certPrefix}-${activeCard.certSuffix}`, 'Certificaat Referentie')}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2 font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white hover:bg-sky-50 text-sky-950 border-sky-200 shadow-sm'
                : 'bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Kopieer Certificaat ID</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Officiële UK Substance & IFRS Governance • Companies House London</span>
          </span>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <span>Custody Depot: </span>
          <strong className="text-amber-400">QI-CUSTODY-LONDON-01</strong>
        </div>
      </div>
    </div>
  );
};
