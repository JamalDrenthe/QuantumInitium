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
  onUpdateAccount: (updatedAccount: AuthUser) => void;
  onLogout: () => void;
  onNavigateHome: (tab?: 'architecture' | '3d' | 'dossier' | 'calculator' | 'simulator') => void;
  onSwitchRole: (targetRole: 'investor') => void;
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
  onUpdateAccount,
  onLogout,
  onNavigateHome,
  onSwitchRole
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
    setActionNotice(`Directie actie '${actionName}' succesvol vastgelegd in het LSE audit logboek.`);
    setTimeout(() => {
      setActionNotice(null);
    }, 4500);
  };

  return (
    <div className="w-full min-h-full p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto bg-[#05070d] pb-16">
      {/* BOVENSTE ACTIEBALK MET STANDAARD KNOPPEN VOLGENS OPDRACHT */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-400 to-blue-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-cyan-300 font-extrabold text-sm">
              ADM
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-white">{user.name}</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                Systeembeheer & Directie
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Toegangsrecht: Volledig Ecosysteem Toezicht • 5 Subholdings • 12 Ltds
            </p>
          </div>
        </div>

        {/* Rechterzijde Directie acties */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => handleActionClick('Cap Table Exporteren')}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Exporteer Cap Table"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cap Table CSV</span>
          </button>

          <button
            onClick={() => onSwitchRole('investor')}
            className="px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Wissel direct naar Investeerder weergave"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Wissel naar Investeerder</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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

      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Accounts beheren
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl">
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
                    ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-200'
                    : 'border-slate-700 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {role === 'all' ? 'Alle accounts' : role === 'investor' ? 'Investors' : 'Shareholders'}
              </button>
            ))}
            <select
              value={selectedAccountId || ''}
              onChange={(event) => setSelectedAccountId(event.target.value || null)}
              className="min-w-56 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
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
              onLogout={() => undefined}
              onNavigateHome={() => undefined}
              onSwitchRole={() => undefined}
              onUpdateShares={(newTotal) =>
                onUpdateAccount({ ...selectedAccount, sharesOwned: newTotal })
              }
              onUpdateUser={onUpdateAccount}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Accounts</p>
              <p className="mt-1 text-2xl font-bold text-white">{managedAccounts.length}</p>
              <p className="text-xs text-slate-400">
                {managedAccounts.filter((account) => account.role === 'investor').length} investors ·{' '}
                {managedAccounts.filter((account) => account.role === 'shareholder').length} shareholders
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Geaggregeerde aandelen</p>
              <p className="mt-1 text-2xl font-bold text-cyan-300">{managedShares.toLocaleString('nl-NL')}</p>
              <p className="text-xs text-slate-400">over de geselecteerde accountgroepen</p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Geaggregeerde waarde</p>
              <p className="mt-1 text-2xl font-bold text-emerald-300">
                €{managedValue.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-slate-400">tegen actuele koers</p>
            </div>
          </div>
        )}
      </div>

      {/* METRICS OVERZICHT VOOR DIRECTIE & ADMINISTRATIE */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Totale Waardering (@ €{SHARE_PRICE_CURRENT.toFixed(2)})</span>
            <Wallet className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-cyan-300 font-mono">
            €{(totalMarketCap / 1000000).toFixed(1)}M
          </div>
          <div className="text-[11px] text-slate-400">
            Exact €{totalMarketCap.toLocaleString('nl-NL')} geplaatst
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Aandelen Uitgifte Totaal</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {(TOTAL_SHARES_ISSUED / 1000000).toFixed(0)}.000.000
          </div>
          <div className="text-[11px] text-slate-400">
            Waarvan 1.850.000 in treasury reserve
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Actieve Investeerders</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            148
          </div>
          <div className="text-[11px] text-slate-400">
            100% geaccrediteerde participanten
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Beoogde IPO Waardering (2027)</span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-300 font-mono">
            €{(targetIpoMarketCap / 1000000).toFixed(0)}M
          </div>
          <div className="text-[11px] text-slate-400">
            Geprojecteerd op €{SHARE_PRICE_IPO_TARGET.toFixed(2)} per aandeel
          </div>
        </div>
      </div>

      {/* OVERZICHT SUBHOLDINGS & OPERATIONELE BRANDMUREN STATUS */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Status van de 5 Subholdings & Juridische Brandmuren</span>
            </h3>
            <p className="text-xs text-slate-400">
              Alle 12 werkmaatschappijen zijn operationeel geïsoleerd conform het Section 89 statuut.
            </p>
          </div>
          <button
            onClick={() => handleActionClick('Brandmuur Integriteitstest')}
            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 font-bold">Tak {idx + 1}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {sub.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-white truncate">{sub.name}</h4>
              <p className="text-[10px] text-slate-400 line-clamp-2">{sub.ltds}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CAP TABLE & INVESTEERDERS BEHEER TABEL */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              <span>Investeerders Register & Aandelen Toewijzing</span>
            </h3>
            <p className="text-xs text-slate-400">
              Actueel aandeelhoudersregister geregistreerd onder de nominale Serie A koers van €{SHARE_PRICE_CURRENT.toFixed(2)}.
            </p>
          </div>

          {/* Zoekbalk & filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Zoek investeerder of certificaat..."
                value={investorSearch}
                onChange={(e) => setInvestorSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs focus:border-amber-400 focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleActionClick('Nieuwe Investeerder Toevoegen')}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Emissie</span>
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="overflow-x-auto no-scrollbar rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 border-b border-slate-800">
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
            <tbody className="divide-y divide-slate-800/60 bg-slate-950/60">
              {filteredInvestors.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">{inv.name}</div>
                    <div className="text-[10px] text-slate-500">{inv.email}</div>
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {inv.shares.toLocaleString('nl-NL')}
                  </td>
                  <td className="py-3 px-4 text-cyan-300 font-bold">
                    €{inv.sharePrice.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">
                    €{inv.totalValue.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-amber-300">
                    {inv.certificateId}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      inv.status === 'Geaccrediteerd'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : inv.status === 'Geverifieerd'
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleActionClick(`Certificaat ${inv.certificateId} inzien`)}
                      className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] cursor-pointer"
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
