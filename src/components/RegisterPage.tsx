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
import { authUserFromSupabaseUser, supabase } from '../lib/supabase';

interface RegisterPageProps {
  onRegisterSuccess: (user: AuthUser) => void;
  onNavigateLogin: () => void;
  onNavigateHome: (tab?: 'architecture' | '3d' | 'dossier') => void;
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

  const totalInvestment = desiredShares * SHARE_PRICE_CURRENT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg('Vul alstublieft uw volledige naam in.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Vul een geldig emailadres in.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Het wachtwoord dient minimaal 6 tekens te bevatten.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('De wachtwoorden komen niet overeen.');
      return;
    }
    if (!agreedTerms) {
      setErrorMsg('U dient akkoord te gaan met de aandeelhoudersvoorwaarden.');
      return;
    }

    if (!supabase) {
      setErrorMsg('Supabase is nog niet geconfigureerd.');
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: {
          name: name.trim(),
          role: 'investor',
          desiredShares
        }
      }
    });

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    if (!data.user) {
      setErrorMsg('Account kon niet worden aangemaakt.');
      return;
    }

    if (!data.session) {
      setErrorMsg('Account aangemaakt. Bevestig eerst uw e-mailadres en log daarna in.');
      return;
    }

    onRegisterSuccess(authUserFromSupabaseUser(data.user));
  };

  return (
    <div className="w-full min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#05070d] pb-16">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Terug naar presentatie */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <button
            onClick={() => onNavigateHome('architecture')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180 text-cyan-400" />
            <span>Terug naar Presentatie</span>
          </button>

          <span className="text-[11px] font-mono text-slate-500">
            Officiële Uitgifte Serie A
          </span>
        </div>

        {/* Registratie Kaart */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2 mb-6 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
              <UserPlus className="w-3.5 h-3.5" />
              <span>Nieuwe Participatie Registratie</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Investeerder Registratie
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Registreer direct uw participatie in QuantumInitium Ltd. Officiële aandelenkoers is vastgesteld op €{SHARE_PRICE_CURRENT.toFixed(2)}.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Volledige Naam
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Bijvoorbeeld: Drs. M. Jansen"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                Emailadres
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="investeerder@domein.nl"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Wachtwoord
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Minimaal 6 tekens"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-medium text-slate-300 mb-1.5">
                  Wachtwoord Bevestigen
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="Herhaal wachtwoord"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Investering Calculator Indicatie tijdens registratie */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-300 flex items-center gap-1.5">
                  <Calculator className="w-3.5 h-3.5 text-amber-400" />
                  Aantal Aandelen Reservering:
                </span>
                <span className="font-mono font-bold text-amber-300">
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
                className="w-full accent-amber-400 cursor-pointer"
              />

              <div className="flex items-center justify-between text-[11px] font-mono pt-1 border-t border-slate-800/80 text-slate-400">
                <span>Koers: €{SHARE_PRICE_CURRENT.toFixed(2)} per aandeel</span>
                <span className="text-emerald-400 font-bold">
                  Waarde: €{totalInvestment.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Akkoord voorwaarden */}
            <label className="flex items-start gap-2.5 text-xs text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                className="mt-0.5 rounded border-slate-700 text-amber-400 focus:ring-amber-400 cursor-pointer"
              />
              <span>
                Ik verklaar kennis te hebben genomen van het LSE Prospectus en de juridische brandmuurisolatie tussen de 5 subholdings.
              </span>
            </label>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Account Aanmaken & Naar Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Heeft u reeds een aandeelhoudersaccount?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
            >
              Log hier direct in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
