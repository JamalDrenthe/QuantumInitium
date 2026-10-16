import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  Wallet,
  TrendingUp,
  Download,
  LogOut,
  Layers,
  Network,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Bell,
  RefreshCw,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  Bot,
  Calculator
} from 'lucide-react';
import { AuthUser, SHARE_PRICE_CURRENT, SHARE_PRICE_IPO_TARGET, TOTAL_SHARES_ISSUED } from '../types/auth';
import InvestorDashboard from './InvestorDashboard';

interface AdminDashboardProps {
  user: AuthUser;
  managedAccounts: AuthUser[];
  accountsLoading?: boolean;
  emailEditable?: boolean;
  onUpdateAccount: (updatedAccount: AuthUser) => void;
  onLogout: () => void;
  onNavigateHome: (tab?: 'architecture' | '3d' | 'dossier' | 'calculator' | 'simulator') => void;
  onSwitchRole: (targetRole: 'investor') => void;
  theme?: 'dark' | 'light';
}

interface InvestorRecord {
  id: string;
  name: string;
  email: string;
  shares: number;
  sharePrice: number;
  totalValue: number;
  tranche: string;
  certificateId: string;
  status: 'Geverifieerd' | 'In Behandeling' | 'Geaccrediteerd';
  date: string;
}

export default function AdminDashboard({
  user,
  managedAccounts,
  accountsLoading = false,
  emailEditable = false,
  onUpdateAccount,
  onLogout,
  onNavigateHome,
  onSwitchRole,
  theme = 'dark'
}: AdminDashboardProps) {
  const [investorSearch, setInvestorSearch] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'verified' | 'accredited'>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [accountRoleFilter, setAccountRoleFilter] = useState<'all' | 'investor' | 'shareholder'>('all');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);

  const totalMarketCap = TOTAL_SHARES_ISSUED * SHARE_PRICE_CURRENT;
  const targetIpoMarketCap = TOTAL_SHARES_ISSUED * SHARE_PRICE_IPO_TARGET;

  // Hardcoded demo investor cap table
  const initialInvestors: InvestorRecord[] = [
    {
      id: 'inv_1',
      name: 'Alexander van Heemstra',
      email: 'investor@quantuminitium.com',
      shares: 12500,
      sharePrice: 8.20,
      totalValue: 102500,
      tranche: 'Serie A Tranche 1',
      certificateId: 'QI INV 8842 NL',
      status: 'Geaccrediteerd',
      date: '14 jan 2025'
    },
    {
      id: 'inv_2',
      name: 'Vanderbilt Capital Partners',
      email: 'partners@vanderbiltcap.com',
      shares: 120000,
      sharePrice: 8.20,
      totalValue: 984000,
      tranche: 'Institutioneel',
      certificateId: 'QI INV 1009 UK',
      status: 'Geverifieerd',
      date: '02 dec 2024'
    },
    {
      id: 'inv_3',
      name: 'Dr. Hendrikus van der Meer',
      email: 'h.vandermeer@neurotech.nl',
      shares: 8000,
      sharePrice: 8.20,
      totalValue: 65600,
      tranche: 'Serie A Tranche 2',
      certificateId: 'QI INV 4421 NL',
      status: 'Geverifieerd',
      date: '28 jan 2025'
    },
    {
      id: 'inv_4',
      name: 'Geneva Wealth Trust SA',
      email: 'familyoffice@genevatrust.ch',
      shares: 250000,
      sharePrice: 8.20,
      totalValue: 2050000,
      tranche: 'Flankerend Kapitaal',
      certificateId: 'QI INV 7731 CH',
      status: 'Geaccrediteerd',
      date: '19 nov 2024'
    },
    {
      id: 'inv_5',
      name: 'Sophie de Boer MSc',
      email: 's.deboer@amsterdamfin.nl',
      shares: 5000,
      sharePrice: 8.20,
      totalValue: 41000,
      tranche: 'Particulier',
      certificateId: 'QI INV 9904 NL',
      status: 'In Behandeling',
      date: '11 feb 2025'
    }
  ];

  const filteredInvestors = initialInvestors.filter((inv) => {
    const matchesSearch =
      inv.name.toLowerCase().includes(investorSearch.toLowerCase()) ||
      inv.email.toLowerCase().includes(investorSearch.toLowerCase()) ||
      inv.certificateId.toLowerCase().includes(investorSearch.toLowerCase());

    if (selectedFilter === 'verified') {
      return matchesSearch && (inv.status === 'Geverifieerd' || inv.status === 'Geaccrediteerd');
    }
    if (selectedFilter === 'accredited') {
      return matchesSearch && inv.status === 'Geaccrediteerd';
    }
    return matchesSearch;
  });

  const selectableAccounts = managedAccounts.filter((account) =>
    accountRoleFilter === 'all' ? true : account.role === accountRoleFilter
  );
  const selectedAccount = managedAccounts.find((account) => account.id === selectedAccountId) || null;
  const managedShares = managedAccounts.reduce((total, account) => total + account.sharesOwned, 0);
  const managedValue = managedAccounts.reduce(
    (total, account) => total + account.sharesOwned * account.currentPrice,
    0
  );

  const handleActionClick = (actionName: string) => {
    setActionNotice(`Directie actie '${actionName}' succesvol vastgelegd in het audit logboek.`);
    setTimeout(() => {
      setActionNotice(null);
    }, 4500);
  };

  return (
    <div className={`w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto pb-16 transition-colors duration-200 ${
      theme === 'light' ? 'bg-[#fafdff] text-[#133b5c]' : 'bg-[#05070d] text-slate-100'
    }`}>
      {/* BOVENSTE ACTIEBALK MET STANDAARD KNOPPEN VOLGENS OPDRACHT */}
      <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-4 shadow-xl transition-all ${
        theme === 'light'
          ? 'glass-panel-luxe border-sky-200/80 text-sky-950 shadow-sky-500/5'
          : 'glass-panel-luxe border-slate-800 text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <div className={`w-full h-full rounded-[10px] flex items-center justify-center font-extrabold text-sm ${
              theme === 'light' ? 'bg-white text-cyan-700' : 'bg-slate-950 text-cyan-300'
            }`}>
              ADM
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className={`text-base font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>{user.name}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                theme === 'light'
                  ? 'bg-cyan-50 text-cyan-800 border-cyan-300'
                  : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
              }`}>
                Systeembeheer & Directie
              </span>
            </div>
            <p className={`text-xs font-mono ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}`}>
              Toegangsrecht: Volledig Ecosysteem Toezicht • 5 Subholdings • 12 Ltds
            </p>
          </div>
        </div>

        {/* Rechterzijde Directie acties */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleActionClick('Cap Table Exporteren')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm ${
              theme === 'light'
                ? 'bg-white hover:bg-sky-50 border-sky-200 text-sky-900'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
            }`}
            title="Exporteer Cap Table"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Cap Table CSV</span>
          </button>

          <button
            onClick={() => onSwitchRole('investor')}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm ${
              theme === 'light'
                ? 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-300'
            }`}
            title="Wissel direct naar Investeerder weergave"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Wissel naar Investeerder</span>
          </button>

          <button
            onClick={onLogout}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm ${
              theme === 'light'
                ? 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-900'
                : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/30 text-rose-300'
            }`}
            title="Uitloggen"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Uitloggen</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-4 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs sm:text-sm font-semibold flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs text-cyan-400 hover:text-white underline cursor-pointer"
          >
            Sluiten
          </button>
        </div>
      )}

      <div className={`p-6 rounded-2xl border space-y-5 transition-all ${
        theme === 'light'
          ? 'glass-panel-luxe border-cyan-300/40 shadow-sm'
          : 'glass-panel-luxe border-cyan-500/20'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
              <Users className="w-5 h-5 text-cyan-400" />
              Accounts beheren
            </h3>
            <p className={`text-xs max-w-2xl ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}`}>
              Kies een Investor of Shareholder om dezelfde dashboardkoppen te openen en accountgegevens te bewerken.
              Zonder selectie blijft dit een totaaloverzicht.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['all', 'investor', 'shareholder'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setAccountRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                  accountRoleFilter === role
                    ? theme === 'light'
                      ? 'border-cyan-500 bg-cyan-100 text-cyan-900 font-bold'
                      : 'border-cyan-400/60 bg-cyan-400/15 text-cyan-200'
                    : theme === 'light'
                    ? 'border-sky-200 bg-white text-sky-800 hover:bg-sky-50'
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {role === 'all' ? 'Alle accounts' : role === 'investor' ? 'Investors' : 'Shareholders'}
              </button>
            ))}
            <select
              value={selectedAccountId || ''}
              onChange={(event) => setSelectedAccountId(event.target.value || null)}
              className={`min-w-56 rounded-lg border px-3 py-1.5 text-xs focus:border-cyan-400 focus:outline-none ${
                theme === 'light'
                  ? 'border-sky-300 bg-white text-sky-950'
                  : 'border-slate-700 bg-slate-900 text-white'
              }`}
              aria-label="Account selecteren"
            >
              <option value="">Geen account geselecteerd</option>
              {selectableAccounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name} — {account.role === 'investor' ? 'Investor' : 'Shareholder'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {accountsLoading ? (
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-6 text-sm text-slate-400">
            Accounts worden geladen...
          </div>
        ) : selectedAccount ? (
          <div className="rounded-xl border border-cyan-500/20 overflow-hidden">
            <InvestorDashboard
              key={selectedAccount.id}
              user={selectedAccount}
              emailEditable={emailEditable}
              onLogout={() => undefined}
              onNavigateHome={() => undefined}
              onUpdateShares={(newTotal) =>
                onUpdateAccount({ ...selectedAccount, sharesOwned: newTotal })
              }
              onUpdateUser={onUpdateAccount}
              theme={theme}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`rounded-xl border p-4 ${
              theme === 'light' ? 'border-sky-200 bg-white' : 'border-slate-800 bg-slate-950/60'
            }`}>
              <p className={`text-[11px] uppercase tracking-wider font-mono ${theme === 'light' ? 'text-sky-700' : 'text-slate-500'}`}>Accounts</p>
              <p className={`mt-1 text-2xl font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>{managedAccounts.length}</p>
              <p className={`text-xs ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}`}>
                {managedAccounts.filter((account) => account.role === 'investor').length} investors ·{' '}
                {managedAccounts.filter((account) => account.role === 'shareholder').length} shareholders
              </p>
            </div>
            <div className={`rounded-xl border p-4 ${
              theme === 'light' ? 'border-sky-200 bg-white' : 'border-slate-800 bg-slate-950/60'
            }`}>
              <p className={`text-[11px] uppercase tracking-wider font-mono ${theme === 'light' ? 'text-sky-700' : 'text-slate-500'}`}>Geaggregeerde aandelen</p>
              <p className="mt-1 text-2xl font-bold cyan-gradient-text font-mono">{managedShares.toLocaleString('nl-NL')}</p>
              <p className={`text-xs ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}`}>over de geselecteerde accountgroepen</p>
            </div>
            <div className={`rounded-xl border p-4 ${
              theme === 'light' ? 'border-sky-200 bg-white' : 'border-slate-800 bg-slate-950/60'
            }`}>
              <p className={`text-[11px] uppercase tracking-wider font-mono ${theme === 'light' ? 'text-sky-700' : 'text-slate-500'}`}>Geaggregeerde waarde</p>
              <p className="mt-1 text-2xl font-bold text-emerald-400 font-mono">
                €{managedValue.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
              </p>
              <p className={`text-xs ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}`}>tegen actuele koers</p>
            </div>
          </div>
        )}
      </div>

      {/* METRICS OVERZICHT VOOR DIRECTIE & ADMINISTRATIE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card-luxe card-ambient-top-cyan p-5 rounded-2xl space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}>Totale Waardering (@ €{SHARE_PRICE_CURRENT.toFixed(2)})</span>
            <Wallet className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold cyan-gradient-text font-mono tracking-tight">
            €{(totalMarketCap / 1000000).toFixed(1)}M
          </div>
          <div className={`text-[11px] ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
            Exact €{totalMarketCap.toLocaleString('nl-NL')} geplaatst
          </div>
        </div>

        <div className="stat-card-luxe card-ambient-top-gold p-5 rounded-2xl space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}>Aandelen Uitgifte Totaal</span>
            <Building2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold gold-gradient-text font-mono tracking-tight">
            {(TOTAL_SHARES_ISSUED / 1000000).toFixed(0)}.000.000
          </div>
          <div className={`text-[11px] ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
            Waarvan 1.850.000 in treasury reserve
          </div>
        </div>

        <div className="stat-card-luxe card-ambient-top-emerald p-5 rounded-2xl space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}>Actieve Investeerders</span>
            <Users className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono tracking-tight">
            148
          </div>
          <div className={`text-[11px] ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
            100% geaccrediteerde participanten
          </div>
        </div>

        <div className="stat-card-luxe card-ambient-top-purple p-5 rounded-2xl space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}>Beoogde IPO Waardering</span>
            <Sparkles className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono tracking-tight">
            €{(targetIpoMarketCap / 1000000).toFixed(0)}M
          </div>
          <div className={`text-[11px] ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>
            Geprojecteerd op €{SHARE_PRICE_IPO_TARGET.toFixed(2)} per aandeel
          </div>
        </div>
      </div>

      {/* OVERZICHT SUBHOLDINGS & OPERATIONELE BRANDMUREN STATUS */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        theme === 'light' ? 'glass-panel-luxe border-sky-200' : 'glass-panel-luxe border-slate-800'
      }`}>
        <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b ${
          theme === 'light' ? 'border-sky-200' : 'border-slate-800'
        }`}>
          <div>
            <h3 className={`text-base font-bold flex items-center gap-2 ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Status van de 5 Subholdings & Juridische Brandmuren</span>
            </h3>
            <p className={`text-xs ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}`}>
              Alle 12 werkmaatschappijen zijn operationeel geïsoleerd conform het Section 89 statuut.
            </p>
          </div>
          <button
            onClick={() => handleActionClick('Brandmuur Integriteitstest')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Audit Controleer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            { name: 'Subholding 1: Fintech', code: 'FINTECH', status: 'Actief', ltds: 'Xabi World, Investbotiq' },
            { name: 'Subholding 2: AI Tech', code: 'AITECH', status: 'Actief', ltds: 'CRMos, QIQ' },
            { name: 'Subholding 3: Talent', code: 'TALENT', status: 'Actief', ltds: 'VVC, DJOBBA, Immigratiepunt, Zheavenzy' },
            { name: 'Subholding 4: Compute', code: 'COMPUTE', status: 'Actief', ltds: 'Boostplug, Logs.rent, Spontiva' },
            { name: 'Subholding 5: Operations', code: 'REALESTATE', status: 'Actief', ltds: 'WoningVry Ltd' }
          ].map((sub, idx) => (
            <div key={idx} className={`p-3.5 rounded-xl border space-y-2 transition-all ${
              theme === 'light'
                ? 'bg-white border-sky-200 shadow-sm'
                : 'stat-card-luxe'
            }`}>
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className={`font-bold ${theme === 'light' ? 'text-sky-700' : 'text-slate-400'}`}>Tak {idx + 1}</span>
                <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {sub.status}
                </span>
              </div>
              <h4 className={`text-xs font-bold truncate ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>{sub.name}</h4>
              <p className={`text-[10px] line-clamp-2 ${theme === 'light' ? 'text-sky-800/70' : 'text-slate-400'}`}>{sub.ltds}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CAP TABLE & INVESTEERDERS BEHEER TABEL */}
      <div className={`p-6 rounded-2xl border space-y-5 ${
        theme === 'light' ? 'glass-panel-luxe border-sky-200' : 'glass-panel-luxe border-slate-800'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className={`text-lg font-bold flex items-center gap-2 ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
              <Users className="w-5 h-5 text-amber-400" />
              <span>Investeerders Register & Aandelen Toewijzing</span>
            </h3>
            <p className={`text-xs ${theme === 'light' ? 'text-sky-800/80' : 'text-slate-400'}`}>
              Actueel aandeelhoudersregister geregistreerd onder de nominale Serie A koers van €{SHARE_PRICE_CURRENT.toFixed(2)}.
            </p>
          </div>

          {/* Zoekbalk & filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className={`w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ${
                theme === 'light' ? 'text-sky-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                placeholder="Zoek investeerder of certificaat..."
                value={investorSearch}
                onChange={(e) => setInvestorSearch(e.target.value)}
                className={`w-full pl-9 pr-3 py-1.5 rounded-xl border text-xs focus:border-amber-400 focus:outline-none ${
                  theme === 'light'
                    ? 'bg-white border-sky-200 text-sky-950 placeholder-sky-400'
                    : 'bg-slate-900 border-slate-800 text-white placeholder-slate-500'
                }`}
              />
            </div>

            <button
              onClick={() => handleActionClick('Nieuwe Investeerder Toevoegen')}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow-sm shadow-amber-500/20"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Emissie</span>
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className={`overflow-x-auto no-scrollbar rounded-xl border ${
          theme === 'light' ? 'border-sky-200' : 'border-slate-800'
        }`}>
          <table className="w-full text-left text-xs font-mono">
            <thead className={`border-b ${
              theme === 'light'
                ? 'bg-sky-50 text-sky-900 border-sky-200'
                : 'bg-slate-900/90 text-slate-400 border-slate-800'
            }`}>
              <tr>
                <th className="py-3 px-4">Investeerder</th>
                <th className="py-3 px-4">Aandelen</th>
                <th className="py-3 px-4">Koers</th>
                <th className="py-3 px-4">Totale Waarde</th>
                <th className="py-3 px-4">Certificaat</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actie</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              theme === 'light'
                ? 'divide-sky-100 bg-white'
                : 'divide-slate-800/60 bg-slate-950/60'
            }`}>
              {filteredInvestors.map((inv) => (
                <tr key={inv.id} className={theme === 'light' ? 'hover:bg-sky-50/50 transition-colors' : 'hover:bg-slate-900/40 transition-colors'}>
                  <td className="py-3 px-4">
                    <div className={`font-bold ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>{inv.name}</div>
                    <div className={`text-[10px] ${theme === 'light' ? 'text-sky-700' : 'text-slate-500'}`}>{inv.email}</div>
                  </td>
                  <td className={`py-3 px-4 font-bold font-mono ${theme === 'light' ? 'text-sky-950' : 'text-white'}`}>
                    {inv.shares.toLocaleString('nl-NL')}
                  </td>
                  <td className="py-3 px-4 text-cyan-400 font-bold font-mono">
                    €{inv.sharePrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold font-mono">
                    €{inv.totalValue.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-amber-400 font-mono">
                    {inv.certificateId}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'Geaccrediteerd'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : inv.status === 'Geverifieerd'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleActionClick(`Certificaat ${inv.certificateId} inzien`)}
                      className={`px-2.5 py-1 rounded border text-[11px] font-semibold cursor-pointer transition-colors ${
                        theme === 'light'
                          ? 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-900'
                          : 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300 hover:text-white'
                      }`}
                    >
                      Inzien
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
