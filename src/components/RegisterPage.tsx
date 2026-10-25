import React, { useState } from 'react';
import {
  UserPlus,
  Mail,
  Lock,
  User,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Award,
  Layers,
  Network,
  HelpCircle
} from 'lucide-react';
import { AuthUser, SHARE_PRICE_CURRENT } from '../types/auth';
import {
  buildRegisteredInvestor,
  isDemoModeEnabled,
  isFirebaseConfigured,
  signUpWithPassword
} from '../lib/authStore';
import { createManagedAccount } from '../lib/accountStore';
import OAuthButtons from './OAuthButtons';

interface RegisterPageProps {
  onRegisterSuccess: (user: AuthUser) => void;
  onNavigateLogin: () => void;
  onNavigateHome: (tab?: 'landing' | 'architecture' | '3d' | 'dossier' | 'simulator') => void;
}

export default function RegisterPage({
  onRegisterSuccess,
  onNavigateLogin,
  onNavigateHome
}: RegisterPageProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [desiredShares, setDesiredShares] = useState<number>(2500);
  const [agreedTerms, setAgreedTerms] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const totalInvestment = desiredShares * SHARE_PRICE_CURRENT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    if (!name.trim()) {
      setErrorMsg('Vul alstublieft uw volledige naam in.');
      setIsSubmitting(false);
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Vul een geldig emailadres in.');
      setIsSubmitting(false);
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Het wachtwoord dient minimaal 6 tekens te bevatten.');
      setIsSubmitting(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('De wachtwoorden komen niet overeen.');
      setIsSubmitting(false);
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('U dient akkoord te gaan met de aandeelhoudersvoorwaarden.');
      setIsSubmitting(false);
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (isFirebaseConfigured) {
      try {
        const session = await signUpWithPassword(cleanEmail, password, {
          name: name.trim(),
        });
        const newUser = buildRegisteredInvestor(session.id, name.trim(), cleanEmail, desiredShares);
        try {
          await createManagedAccount(newUser, session.id);
        } catch (createErr) {
          console.warn('createManagedAccount fallback to in-memory profile:', createErr);
        }
        onRegisterSuccess(newUser);
        return;
      } catch (error) {
        if (!isDemoModeEnabled) {
          setErrorMsg(error instanceof Error ? error.message : 'Registratie mislukt.');
          setIsSubmitting(false);
          return;
        }
      } finally {
        setIsSubmitting(false);
      }
    }

    const newUser = buildRegisteredInvestor(
      `local_${Date.now()}`,
      name.trim(),
      cleanEmail,
      desiredShares
    );
    onRegisterSuccess(newUser);
    setIsSubmitting(false);
  };

  return (
    <div className="w-full min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-black pb-16">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Terug naar presentatie */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <button
            onClick={() => onNavigateHome('landing')}
            className="apple-btn-secondary flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180 text-[#2997ff]" />
            <span>Terug naar Overzicht</span>
          </button>

          <span className="text-[11px] font-mono text-[#86868b]">
            Officiële Uitgifte Serie A
          </span>
        </div>

        {/* Registratie Kaart */}
        <div className="apple-glass-card p-6 sm:p-8 rounded-[2rem] border border-white/12 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-20 left-0 w-64 h-64 bg-[#0071e3]/15 rounded-full blur-[110px] pointer-events-none" />
          <div className="absolute -bottom-20 right-0 w-64 h-64 bg-[#2997ff]/10 rounded-full blur-[110px] pointer-events-none" />

          <div className="text-center space-y-2 mb-6 relative">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.06] border border-white/12 text-[#2997ff] text-xs font-mono font-semibold">
              <UserPlus className="w-3.5 h-3.5 text-[#30d158]" />
              <span>Nieuwe Participatie Registratie</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-[-0.03em]">
              Investeerder Registratie
            </h2>
            <p className="text-xs sm:text-sm text-[#86868b] max-w-md mx-auto">
              Registreer direct uw participatie in QuantumInitium Ltd. Officiële aandelenkoers is vastgesteld op €{SHARE_PRICE_CURRENT.toFixed(2)}.
            </p>
          </div>

          {isFirebaseConfigured && (
            <OAuthButtons
              intent="register"
              onSuccess={onRegisterSuccess}
              onError={(message) => setErrorMsg(message || null)}
              disabled={isSubmitting}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-medium text-[#86868b] mb-1.5">
                Volledige Naam
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Bijvoorbeeld: Drs. M. Jansen"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/12 text-white text-sm focus:border-[#0071e3] focus:outline-none transition-colors"
                />
              </div>
            </div>

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
                  placeholder="investeerder@domein.nl"
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/12 text-white text-sm focus:border-[#0071e3] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-medium text-[#86868b] mb-1.5">
                  Wachtwoord
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimaal 6 tekens"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/12 text-white text-sm focus:border-[#0071e3] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-[#86868b] mb-1.5">
                  Wachtwoord Bevestigen
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#86868b] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Herhaal wachtwoord"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/[0.05] border border-white/12 text-white text-sm focus:border-[#0071e3] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Investering Calculator Indicatie tijdens registratie */}
            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-[#f5f5f7] flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-[#2997ff]" />
                  Aantal Aandelen Reservering:
                </span>
                <span className="font-mono font-bold text-[#2997ff]">
                  {desiredShares.toLocaleString('nl-NL')} aandelen
                </span>
              </div>

              <input
                type="range"
                min={250}
                max={50000}
                step={250}
                value={desiredShares}
                onChange={(e) => setDesiredShares(Number(e.target.value))}
                className="w-full cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-white/10 text-[#86868b]">
                <span>Koers: €{SHARE_PRICE_CURRENT.toFixed(2)} per aandeel</span>
                <span className="text-[#30d158] font-bold">
                  Waarde: €{totalInvestment.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Akkoord voorwaarden */}
            <label className="flex items-start gap-2.5 text-xs text-[#86868b] cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-white/20 text-[#0071e3] focus:ring-[#0071e3] cursor-pointer"
              />
              <span>
                Ik verklaar kennis te hebben genomen van het Investeerdersdossier en de juridische brandmuurisolatie tussen de 5 subholdings.
              </span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="apple-btn-primary w-full py-3 px-4 rounded-full font-semibold text-sm disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSubmitting ? 'Account beveiligen...' : 'Account Aanmaken & Naar Dashboard'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 text-center text-xs text-[#86868b]">
            Heeft u reeds een aandeelhoudersaccount?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-semibold text-[#2997ff] hover:underline underline-offset-4 cursor-pointer"
            >
              Log hier direct in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
