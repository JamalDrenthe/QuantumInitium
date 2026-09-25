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
import { AuthUser, DEMO_ADMIN, SHARE_PRICE_CURRENT } from '../types/auth';
import { authUserFromSupabaseUser, supabase } from '../lib/supabase';

type LoginRole = 'investor' | 'shareholder' | 'admin';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
  onNavigateRegister: () => void;
  onNavigateHome: (tab?: 'architecture' | '3d' | 'dossier') => void;
}

export default function LoginPage({
  onLoginSuccess,
  onNavigateRegister,
  onNavigateHome
}: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<LoginRole>('investor');
  const [email, setEmail] = useState<string>('investor@quantuminitium.com');
  const [password, setPassword] = useState<string>('investor2027');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSelectRole = (role: LoginRole) => {
    setSelectedRole(role);
    setErrorMsg(null);
    if (role === 'investor') {
      setEmail('investor@quantuminitium.com');
      setPassword('investor2027');
    } else if (role === 'admin') {
      setEmail('admin@quantuminitium.com');
      setPassword('admin2027');
    } else {
      setEmail('');
      setPassword('');
    }
  };

  const signInAsInvestor = async () => {
    if (!supabase) {
      setErrorMsg('Supabase is nog niet geconfigureerd.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'investor@quantuminitium.com',
      password: 'investor2027'
    });

    if (error || !data.user) {
      setErrorMsg(error?.message || 'Inloggen is mislukt.');
      return;
    }

    onLoginSuccess(authUserFromSupabaseUser(data.user));
  };

  const handleQuickDemoLogin = async (role: 'investor' | 'admin') => {
    if (role === 'investor') {
      await signInAsInvestor();
    } else {
      onLoginSuccess(DEMO_ADMIN);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (selectedRole === 'admin' && cleanEmail === DEMO_ADMIN.email.toLowerCase() && password === 'admin2027') {
      onLoginSuccess(DEMO_ADMIN);
      return;
    }

    if (!supabase) {
      setErrorMsg('Controleer uw inloggegevens.');
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password
    });

    if (error || !data.user) {
      setErrorMsg(error?.message || 'Controleer uw inloggegevens.');
      return;
    }

    const user = authUserFromSupabaseUser(data.user);
    if (user.role !== selectedRole) {
      setErrorMsg('Deze account hoort niet bij de geselecteerde profielrol.');
      await supabase.auth.signOut();
      return;
    }

    onLoginSuccess(user);
  };

  return (
    <div className="w-full min-h-full flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#05070d] pb-16">
      <div className="w-full max-w-xl mx-auto space-y-6">
        {/* Terug naar presentatie / Sluiten */}
        <div className="flex items-center justify-between gap-3 text-xs">
          <button
            onClick={() => onNavigateHome('architecture')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5 rotate-180 text-amber-400" />
            <span>Terug naar Presentatie</span>
          </button>

          <span className="text-[11px] font-mono text-slate-500">
            Beveiligde SSL 256-bit Toegang
          </span>
        </div>

        {/* Hoofd Inlogkaart */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtiel decoratief achtergrond raster en gloed */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Titel & Status */}
          <div className="text-center space-y-2 mb-6 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>QuantumInitium Portaal Toegang</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Inloggen op uw Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
              Toegang tot het actuele aandelenbezit, live koerswaarde (€{SHARE_PRICE_CURRENT.toFixed(2)}) en directie overzichten.
            </p>
          </div>

          {/* Snelkeuze knoppen voor Investeerder en Admin volgens gebruikersverzoek */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Kies uw gewenste profielrol:</span>
              <span className="text-amber-400 font-semibold">Live Demo Gereed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Knop voor Investeerder */}
              <button
                type="button"
                onClick={() => handleSelectRole('investor')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'investor'
                    ? 'bg-amber-500/20 border-amber-500/60 shadow-lg shadow-amber-500/20 text-white'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Investeerder
                  </span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-sm font-bold text-white">Investor Account</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  12.500 aandelen • €{SHARE_PRICE_CURRENT.toFixed(2)} koers
                </div>
              </button>

              {/* Knop voor Share Holder */}
              <button
                type="button"
                onClick={() => handleSelectRole('shareholder')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'shareholder'
                    ? 'bg-emerald-500/20 border-emerald-500/60 shadow-lg shadow-emerald-500/20 text-white'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    Share Holder
                  </span>
                  <Award className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-sm font-bold text-white">Share Holder Account</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Aandeelhoudersinzage zonder investor-workflows
                </div>
              </button>

              {/* Knop voor Admin */}
              <button
                type="button"
                onClick={() => handleSelectRole('admin')}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'bg-cyan-500/20 border-cyan-500/60 shadow-lg shadow-cyan-500/20 text-white'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    Beheerder
                  </span>
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="text-sm font-bold text-white">Admin Account</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Directie beheer • 10M emissie
                </div>
              </button>
            </div>
          </div>

          {/* Directe Snelle Demo Knoppen (1 klik inloggen) */}
          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 mb-6">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                Directe 1 klik demo toegang:
              </span>
              <span className="text-emerald-400 font-bold">Supabase Auth</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('investor')}
                className="px-3 py-2 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Demo Investeerder Log In</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="px-3 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/40 text-cyan-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Demo Admin Log In</span>
              </button>
            </div>
          </div>

          {/* Formulier */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

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
                  placeholder="naam@quantuminitium.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono font-medium text-slate-300">
                  Wachtwoord
                </label>
                {selectedRole !== 'shareholder' && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    Demo: {selectedRole === 'investor' ? 'investor2027' : 'admin2027'}
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-sm focus:border-amber-400 focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>
                Inloggen als {
                  selectedRole === 'investor'
                    ? 'Investeerder'
                    : selectedRole === 'shareholder'
                      ? 'Share Holder'
                      : 'Admin'
                }
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Onderkant switch naar registreren */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 text-center text-xs text-slate-400">
            Nog geen aandeelhoudersaccount geregistreerd?{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
            >
              Maak een nieuw account aan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
