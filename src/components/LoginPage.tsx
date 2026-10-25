import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Network,
  Eye,
  EyeOff,
  UserCheck,
  CheckCircle2,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { AuthUser, DEMO_INVESTOR, DEMO_ADMIN, SHARE_PRICE_CURRENT } from '../types/auth';
import { buildRegisteredInvestor, isDemoModeEnabled, isFirebaseConfigured, signInWithPassword } from '../lib/authStore';
import { loadAccountForSession } from '../lib/accountStore';
import OAuthButtons from './OAuthButtons';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigateRegister: () => void;
  onNavigateHome: (tab?: 'landing' | 'architecture' | '3d' | 'dossier' | 'simulator') => void;
}

export default function LoginPage({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateHome
}: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<'investor' | 'admin'>('investor');
  const [email, setEmail] = useState<string>('investor@quantuminitium.com');
  const [password, setPassword] = useState<string>('investor2027');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSelectRole = (role: 'investor' | 'admin') => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'investor') {
      setEmail('investor@quantuminitium.com');
      setPassword('investor2027');
    } else {
      setEmail('info@quantuminitium.com');
      setPassword('admin2027');
    }
  };

  const handleQuickDemoLogin = (role: 'investor' | 'admin') => {
    setErrorMsg(null);
    if (role === 'investor') {
      onLoginSuccess(DEMO_INVESTOR);
    } else {
      onLoginSuccess(DEMO_ADMIN);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const cleanEmail = email.trim().toLowerCase();

    // 1. Direct login for demo investor
    if (cleanEmail === DEMO_INVESTOR.email.toLowerCase() && password === 'investor2027') {
      onLoginSuccess(DEMO_INVESTOR);
      setIsSubmitting(false);
      return;
    }

    // 2. Direct login for demo admin
    if (cleanEmail === DEMO_ADMIN.email.toLowerCase() && password === 'admin2027') {
      onLoginSuccess(DEMO_ADMIN);
      setIsSubmitting(false);
      return;
    }

    // 3. Try Firebase authentication if configured
    if (isFirebaseConfigured) {
      try {
        const session = await signInWithPassword(cleanEmail, password);
        let account: AuthUser;
        try {
          account = await loadAccountForSession(
            { id: session.id, email: session.email }
          );
        } catch {
          const isInfoAdmin = cleanEmail === 'info@quantuminitium.com' || cleanEmail === 'info@jamaldrenthe.com';
          account = buildRegisteredInvestor(
            session.id,
            session.name || (isInfoAdmin ? 'Directie QuantumInitium' : cleanEmail.split('@')[0] || 'Investeerder'),
            cleanEmail,
            isInfoAdmin ? 0 : 2500
          );
          if (isInfoAdmin) {
            account.role = 'admin';
          }
        }
        onLoginSuccess(account);
        return;
      } catch (error) {
        if (!isDemoModeEnabled) {
          setErrorMsg(error instanceof Error ? error.message : 'Inloggen mislukt.');
          setIsSubmitting(false);
          return;
        }
      } finally {
        setIsSubmitting(false);
      }
    }

    // 4. Demo fallback for custom emails
    if (selectedRole === 'investor') {
      const customInvestor: AuthUser = {
        ...DEMO_INVESTOR,
        email: cleanEmail,
        name: cleanEmail.split('@')[0] || 'Investeerder'
      };
      onLoginSuccess(customInvestor);
      setIsSubmitting(false);
      return;
    }

    if (selectedRole === 'admin') {
      const customAdmin: AuthUser = {
        ...DEMO_ADMIN,
        email: cleanEmail
      };
      onLoginSuccess(customAdmin);
      setIsSubmitting(false);
      return;
    }

    setErrorMsg('Controleer uw inloggegevens of gebruik de directe demo knoppen.');
    setIsSubmitting(false);
  };

  return (
    <div className="w-full min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black pb-16">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Terug naar presentatie / Sluiten */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <button
            onClick={() => onNavigateHome('landing')}
            className="apple-btn-secondary flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180 text-[#2997ff]" />
            <span>Terug naar Overzicht</span>
          </button>

          <span className="text-[11px] font-mono text-[#86868b]">
            Beveiligde SSL 256-bit Toegang
          </span>
        </div>

        {/* Hoofd Inlogkaart */}
        <div className="apple-glass-card p-6 sm:p-8 rounded-[2rem] border border-white/12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 right-0 w-64 h-64 bg-[#0071e3]/15 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-20 left-0 w-64 h-64 bg-[#2997ff]/10 rounded-full blur-[110px] pointer-events-none" />

          {/* Titel & Status */}
          <div className="text-center space-y-2 mb-6 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/12 text-[#2997ff] text-xs font-mono font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" />
              <span>QuantumInitium Portaal Toegang</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.03em]">
              Inloggen op uw Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#86868b] max-w-md mx-auto">
              Toegang tot het actuele aandelenbezit, koerswaarde (€{SHARE_PRICE_CURRENT.toFixed(2)}) en directie-overzichten.
            </p>
          </div>

          {/* Snelkeuze knoppen voor Investeerder en Admin */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#86868b]">
              <span>Kies uw gewenste profielrol:</span>
              <span className="text-[#30d158] font-semibold">
                Directe Toegang
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Knop voor Investeerder */}
              <button
                type="button"
                onClick={() => handleSelectRole('investor')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'investor'
                    ? 'bg-[#0071e3]/20 border-[#2997ff]/60 shadow-lg text-white'
                    : 'bg-white/[0.04] border-white/10 text-[#86868b] hover:border-white/25 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#0071e3]/20 text-[#2997ff] border border-[#2997ff]/30">
                    Investeerder
                  </span>
                  <TrendingUp className="w-4 h-4 text-[#2997ff]" />
                </div>
                <div className="text-sm font-semibold text-white">Investor Account</div>
                <div className="text-[11px] text-[#86868b] mt-0.5">
                  12.500 aandelen • €{SHARE_PRICE_CURRENT.toFixed(2)} koers
                </div>
              </button>

              {/* Knop voor Admin */}
              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-[#0071e3]/20 border-[#2997ff]/60 shadow-lg text-white'
                    : 'bg-white/[0.04] border-white/10 text-[#86868b] hover:border-white/25 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[#30d158]/15 text-[#30d158] border border-[#30d158]/30">
                    Beheerder
                  </span>
                  <ShieldCheck className="w-4 h-4 text-[#30d158]" />
                </div>
                <div className="text-sm font-semibold text-white">Admin Account</div>
                <div className="text-[11px] text-[#86868b] mt-0.5">
                  Directie beheer • 10M emissie
                </div>
              </button>
            </div>
          </div>

          {/* Directe Snelle Demo Knoppen (1 klik inloggen) */}
          <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5 mb-6">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#86868b]">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-[#30d158]" />
                Directe 1-klik demo toegang:
              </span>
              <span className="text-[#30d158] font-semibold">Geverifieerd</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('investor')}
                className="apple-btn-secondary px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5 text-[#2997ff]" />
                <span>Demo Investeerder Log In</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="apple-btn-secondary px-3 py-2 rounded-full text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#30d158]" />
                <span>Demo Admin Log In</span>
              </button>
            </div>
          </div>

          {isFirebaseConfigured && (
            <OAuthButtons
              intent="login"
              onSuccess={onLoginSuccess}
              onError={(message) => setErrorMsg(message || null)}
              disabled={isSubmitting}
            />
          )}

          {/* Formulier */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-medium text-[#86868b] mb-1.5">
                Emailadres
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="naam@quantuminitium.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/12 text-white text-sm focus:border-[#0071e3] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-medium text-[#86868b]">
                  Wachtwoord
                </label>
                <span className="text-[11px] text-[#86868b] font-mono">
                  Demo: {selectedRole === 'investor' ? 'investor2027' : 'admin2027'}
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white/[0.05] border border-white/12 text-white text-sm focus:border-[#0071e3] focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86868b] hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="apple-btn-primary w-full py-3 px-4 rounded-full font-semibold text-sm disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticatie controleren...' : `Inloggen als ${selectedRole === 'investor' ? 'Investeerder' : 'Admin'}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Onderkant switch naar registreren */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-[#86868b]">
            Nog geen aandeelhoudersaccount geregistreerd?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-semibold text-[#2997ff] hover:underline underline-offset-4 cursor-pointer"
            >
              Maak een nieuw account aan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
