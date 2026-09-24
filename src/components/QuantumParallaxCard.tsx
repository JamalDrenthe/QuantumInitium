import React, { useRef, useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Wifi, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Sparkles, 
  CreditCard, 
  Layers, 
  Smartphone,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export interface CardEdition {
  id: string;
  name: string;
  badge: string;
  tier: string;
  cardPrefix: string;
  cardSuffix: string;
  cvv: string;
  expiry: string;
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
    name: 'Quantum Obsidian Sovereign',
    badge: 'TITANIUM BLACK',
    tier: 'Series A Institutional Tier',
    cardPrefix: '5428 9012',
    cardSuffix: '8820',
    cvv: '849',
    expiry: '10/29',
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
    name: 'Quantum Imperial Bullion',
    badge: '24K GOLD BULLION',
    tier: 'Founding Partner Edition',
    cardPrefix: '5519 3301',
    cardSuffix: '7741',
    cvv: '912',
    expiry: '04/30',
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
    name: 'Quantum Cyber Sapphire',
    badge: 'CYBER SAPPHIRE',
    tier: 'Quantum Vault Protocol',
    cardPrefix: '4920 1883',
    cardSuffix: '4409',
    cvv: '633',
    expiry: '08/29',
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
    name: 'Quantum Emerald Sovereign',
    badge: 'EMERALD RESERVE',
    tier: 'Private Syndicate Edition',
    cardPrefix: '5204 7715',
    cardSuffix: '9931',
    cvv: '704',
    expiry: '12/29',
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
  width?: number; // default 340px
  height?: number; // default 215px
  theme?: 'dark' | 'light';
}

/* Individuele 3D Parallax Card volgens de exacte ATV-Img specificaties */
export const SingleParallaxCard: React.FC<SingleParallaxCardProps> = ({
  edition,
  holderName,
  shares,
  cashBalance,
  isRevealed,
  isFrozen,
  isSelected = false,
  onSelect,
  width = 340,
  height = 215,
  theme = 'dark'
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const shineRef = useRef<HTMLDivElement>(null);
  const layer0Ref = useRef<HTMLDivElement>(null);
  const layer1Ref = useRef<HTMLDivElement>(null);
  const layer2Ref = useRef<HTMLDivElement>(null);

  const [copied, setCopied] = useState(false);

  // Exacte ATV-Img wiskundige berekening
  const processMovement = (
    e: MouseEvent | TouchEvent,
    isTouch: boolean
  ) => {
    const card = cardRef.current;
    const container = containerRef.current;
    const shine = shineRef.current;
    const shadow = shadowRef.current;
    const layers = [layer0Ref.current, layer1Ref.current, layer2Ref.current];

    if (!card || !container || !shine || !shadow) return;

    const win = window;
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

    // Schaal en diepte bij hover
    imgCSS += ' scale3d(1.06, 1.06, 1.06)';
    container.style.transform = imgCSS;

    // Dynamische lichtinval (shine gradient)
    const shineOpacity = Math.min(0.65, Math.max(0.1, ((pageY - offsets.top - bdst) / h) * 0.55));
    shine.style.background = `linear-gradient(${angle}deg, rgba(255,255,255,${shineOpacity}) 0%, rgba(255,255,255,0) 80%)`;
    shine.style.transform = `translateX(${(offsetX * 3) - 0.1}px) translateY(${(offsetY * 3) - 0.1}px)`;

    // Dynamische schaduwverschuiving
    shadow.style.transform = `translateX(${-dx * 0.15}px) translateY(${-dy * 0.15}px) scale(1.04)`;
    shadow.style.boxShadow = `0 ${20 + Math.abs(dy) * 0.25}px ${45 + Math.abs(dy) * 0.4}px ${edition.themeStyle.glowColor}, 0 10px 25px rgba(0,0,0,0.6)`;

    // Individuele dieptelagen laten differentiëren (parallaxe)
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

    // Initialiseer perspective
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

  const handleCopyCardNumber = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fullNumber = `${edition.cardPrefix} 4920 ${edition.cardSuffix}`.replace(/\s+/g, '');
    navigator.clipboard.writeText(fullNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardNumberDisplay = isRevealed 
    ? `${edition.cardPrefix} 4920 ${edition.cardSuffix}`
    : `${edition.cardPrefix} •••• •••• ${edition.cardSuffix}`;

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
      {/* ATV-Img root element met transform-style preserve-3d */}
      <div
        ref={cardRef}
        className="atvImg w-full h-full rounded-2xl relative"
        style={{
          transformStyle: 'preserve-3d',
          WebkitTapHighlightColor: 'rgba(0,0,0,0)'
        }}
      >
        {/* ATV-Img Dynamic Shadow */}
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

        {/* ATV-Img Container */}
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
          {/* Lagen Container */}
          <div
            className="atvImg-layers w-full h-full relative overflow-hidden rounded-2xl"
            style={{
              transformStyle: 'preserve-3d',
              borderRadius: '16px'
            }}
          >
            {/* LAAG 0: Diepte-achtergrond, gradiënt & guilloche micro-lijnen */}
            <div
              ref={layer0Ref}
              className="atvImg-rendered-layer absolute inset-0 rounded-2xl transition-transform duration-100 ease-out"
              style={{
                background: edition.themeStyle.background,
                zIndex: 1
              }}
            >
              {/* Guilloche / Micro-circuit SVG watermerk */}
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

            {/* LAAG 1: Holografische circuits, QI Monogram Watermerk & Badge */}
            <div
              ref={layer1Ref}
              className="atvImg-rendered-layer absolute inset-0 p-5 flex flex-col justify-between rounded-2xl transition-transform duration-100 ease-out pointer-events-none"
              style={{
                zIndex: 2
              }}
            >
              {/* Subtiel groot QI logo op de achtergrond */}
              <div className="absolute right-3 top-6 font-mono font-black text-7xl select-none opacity-10 tracking-tighter" style={{ color: edition.themeStyle.accentColor }}>
                QI
              </div>

              {/* Bovenste rij: QuantumInitium merk & Contactless NFC */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 flex items-center justify-center shadow-md">
                    <span className="text-slate-950 font-black text-[10px] font-mono">QI</span>
                  </div>
                  <div>
                    <div className="font-extrabold text-xs tracking-wider uppercase" style={{ color: edition.themeStyle.textColor }}>
                      QUANTUMINITIUM
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-widest font-semibold" style={{ color: edition.themeStyle.accentColor }}>
                      {edition.badge}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 rotate-90" style={{ color: edition.themeStyle.subtextColor }} />
                  <span className="px-2 py-0.5 rounded text-[8px] font-mono font-bold border" style={{
                    borderColor: edition.themeStyle.borderColor,
                    color: edition.themeStyle.accentColor,
                    backgroundColor: 'rgba(0,0,0,0.3)'
                  }}>
                    VAULT
                  </span>
                </div>
              </div>

              {/* Midden: EMV Gouden Hologram Chip & Series Ticker */}
              <div className="flex items-center justify-between z-10 my-auto pt-2">
                <div 
                  className="w-10 h-7 rounded-md shadow-inner flex items-center justify-center relative overflow-hidden border border-amber-300/40"
                  style={{
                    background: edition.themeStyle.chipGradient
                  }}
                >
                  {/* Chip circuitslijnen */}
                  <div className="w-full h-[1px] bg-slate-900/40 absolute top-2" />
                  <div className="w-full h-[1px] bg-slate-900/40 absolute bottom-2" />
                  <div className="h-full w-[1px] bg-slate-900/40 absolute left-3" />
                  <div className="h-full w-[1px] bg-slate-900/40 absolute right-3" />
                  <div className="w-3 h-3 rounded-sm border border-slate-900/40" />
                </div>

                <div className="text-right">
                  <div className="text-[8px] font-mono uppercase tracking-wider text-slate-400">
                    LSE MAIN: QI.NL
                  </div>
                  <div className="text-[10px] font-mono font-bold" style={{ color: edition.themeStyle.accentColor }}>
                    {shares.toLocaleString('nl-NL')} AANDELEN
                  </div>
                </div>
              </div>

              {/* Onderste blok: Kaartnummer, Naam, Verval & CVV */}
              <div className="space-y-1.5 z-10">
                <div className="font-mono text-sm tracking-widest font-bold flex items-center justify-between" style={{ color: edition.themeStyle.textColor, textShadow: '0 2px 4px rgba(0,0,0,0.6)' }}>
                  <span>{cardNumberDisplay}</span>
                  {isFrozen && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1 font-sans">
                      <Lock className="w-2.5 h-2.5" /> BEVROREN
                    </span>
                  )}
                </div>

                <div className="flex items-end justify-between text-[9px] font-mono pt-1">
                  <div>
                    <span className="text-slate-400 block text-[8px] uppercase">Kaarthouder</span>
                    <span className="font-bold uppercase tracking-wider truncate max-w-[150px] block" style={{ color: edition.themeStyle.textColor }}>
                      {holderName || 'INVESTEERDER'}
                    </span>
                  </div>

                  <div className="text-center">
                    <span className="text-slate-400 block text-[8px] uppercase">Geldig Tot</span>
                    <span className="font-bold" style={{ color: edition.themeStyle.textColor }}>
                      {edition.expiry}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block text-[8px] uppercase">CVV</span>
                    <span className="font-bold" style={{ color: edition.themeStyle.accentColor }}>
                      {isRevealed ? edition.cvv : '•••'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LAAG 2: Holografische Glans Seal & Zilver/Goud Visa Badge */}
            <div
              ref={layer2Ref}
              className="atvImg-rendered-layer absolute inset-0 pointer-events-none rounded-2xl transition-transform duration-100 ease-out"
              style={{
                zIndex: 3
              }}
            >
              {/* Holografische beveiligingscirkel rechtsonder */}
              <div 
                className="absolute right-4 bottom-3 w-8 h-8 rounded-full border border-white/20 opacity-80 flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(217,119,6,0.2) 50%, rgba(56,189,248,0.25) 100%)'
                }}
              >
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
            </div>

            {/* ATV-Img Dynamic Parallax Shine Layer */}
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

      {/* Snelle knoppen bij hoveren over de kaart */}
      <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-20">
        <button
          type="button"
          onClick={handleCopyCardNumber}
          className="p-1.5 rounded-lg bg-slate-900/90 text-white hover:text-amber-400 border border-slate-700 shadow-md cursor-pointer transition-colors"
          title="Kopieer Kaartnummer"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

/* Volledig interactieve Wallet Card Showcase:
   - Toont de 4 QuantumInitium edities (zoals in de codepen container)
   - Biedt opties om kaartgegevens te verbergen/tonen, te bevriezen, of toe te voegen aan Apple/Google Wallet
*/
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
      {/* Subtiel decoratief achtergrondgrid */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      {/* HEADER: Titel, Portefeuillekoppeling & View Toggles */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <CreditCard className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono uppercase tracking-widest font-bold text-amber-400">
              QuantumInitium Digital Vault Card
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Actief • 3D Parallaxe
            </span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-black ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
            Institutionele Investeerders Pas
          </h3>
          <p className={`text-xs ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
            Beweeg uw muis of vinger over de kaart(en) om het dynamische 3D-licht en gelaagde parallaxe effect te ervaren.
          </p>
        </div>

        {/* Bedieningselementen: Weergave (4 kaarten container vs Focus) & Gegevens Beveiliging */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Gegevens verbergen / tonen */}
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
            title={isRevealed ? 'Verberg gevoelige gegevens' : 'Toon volledige kaartgegevens'}
          >
            {isRevealed ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{isRevealed ? 'Verberg Gegevens' : 'Toon Gegevens'}</span>
          </button>

          {/* Kaart Bevriezen Toggle */}
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
            title={isFrozen ? 'Deblokkeer Pas' : 'Tijdelijk Bevriezen'}
          >
            {isFrozen ? <Unlock className="w-3.5 h-3.5 text-rose-400" /> : <Lock className="w-3.5 h-3.5 text-slate-400" />}
            <span>{isFrozen ? 'Bevroren (Deblokkeer)' : 'Pas Bevriezen'}</span>
          </button>

          {/* Switch tussen Collectie (4 kaarten) en Enkele kaart */}
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
              <CreditCard className="w-3 h-3" />
              <span className="hidden sm:inline">Focus Pas</span>
            </button>
          </div>
        </div>
      </div>

      {/* FEEDBACK BERICHT KOPIËREN */}
      {copiedSuccess && (
        <div className="mb-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4" />
          <span>{copiedSuccess}</span>
        </div>
      )}

      {/* WEERGAVE OPTIE 1: DE 4 QUANTUMINITIUM EDITIES (CONTAINER UIT DE CODEPEN VOORBEELDCODE) */}
      {viewMode === 'collection' && (
        <div className="space-y-6">
          {/* De interactieve container met de 4 kaarten */}
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
                  <span>{edition.name.split(' ')[1]}</span>
                  {selectedCardId === edition.id && <Check className="w-3 h-3 text-amber-400" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEERGAVE OPTIE 2: FOCUSED WEERGAVE MET UITGEBREIDE PASDETAILS & SNELACTIES */}
      {viewMode === 'focused' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
          {/* Grote Parallax Card in de spotlight */}
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

          {/* Rechterpaneel: Pasdetails, Koppelingsstatus & Systeemacties */}
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

              {/* Grid met pasgegevens */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-950/60 border-slate-800/80'}`}>
                  <span className="text-slate-400 block text-[10px]">Kaartnummer</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className={`font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                      {isRevealed ? `${activeCard.cardPrefix} 4920 ${activeCard.cardSuffix}` : `•••• ${activeCard.cardSuffix}`}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(`${activeCard.cardPrefix}4920${activeCard.cardSuffix}`, 'Kaartnummer')}
                      className="text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-950/60 border-slate-800/80'}`}>
                  <span className="text-slate-400 block text-[10px]">Vervaldatum & CVV</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className={`font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                      {activeCard.expiry} • {isRevealed ? activeCard.cvv : '•••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(activeCard.cvv, 'CVV Code')}
                      className="text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-950/60 border-slate-800/80'}`}>
                  <span className="text-slate-400 block text-[10px]">Gekoppeld Aandelen Saldo</span>
                  <span className="text-cyan-400 font-bold block mt-0.5">
                    {shares.toLocaleString('nl-NL')} aandelen
                  </span>
                </div>

                <div className={`p-2.5 rounded-xl border ${theme === 'light' ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-950/60 border-slate-800/80'}`}>
                  <span className="text-slate-400 block text-[10px]">Beschikbaar Saldo</span>
                  <span className="text-emerald-400 font-bold block mt-0.5">
                    €{cashBalance.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Wisselknoppen voor de 4 edities in focus weergave */}
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
                    {ed.name.split(' ')[1]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER MET INTEGRATIES (APPLE PAY, GOOGLE WALLET, VEILIGHEIDSLINK) */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Apple Pay Knop */}
          <button
            type="button"
            onClick={() => handleCopy(`${activeCard.cardPrefix}4920${activeCard.cardSuffix}`, 'Apple Wallet Token')}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2 font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white hover:bg-sky-50 text-sky-950 border-sky-200 shadow-sm'
                : 'bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            <Smartphone className={`w-3.5 h-3.5 ${theme === 'light' ? 'text-sky-950' : 'text-white'}`} />
            <span>Koppel Apple Pay</span>
          </button>

          {/* Google Wallet Knop */}
          <button
            type="button"
            onClick={() => handleCopy(`${activeCard.cardPrefix}4920${activeCard.cardSuffix}`, 'Google Pay Token')}
            className={`px-3 py-2 rounded-xl border flex items-center gap-2 font-semibold transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-white hover:bg-sky-50 text-sky-950 border-sky-200 shadow-sm'
                : 'bg-slate-900 hover:bg-slate-850 text-white border-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-cyan-400" />
            <span>Koppel Google Wallet</span>
          </button>

          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-bit Quantum Hardware Encryption • FCA / AFM Compliant</span>
          </span>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          <span>LSE Custody Vault: </span>
          <strong className="text-amber-400">QI-VAULT-LONDON-88</strong>
        </div>
      </div>
    </div>
  );
};
