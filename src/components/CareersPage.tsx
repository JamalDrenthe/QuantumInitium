import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Search,
  Filter,
  MapPin,
  Clock,
  Euro,
  Building2,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Send,
  Upload,
  X,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Award,
  Users,
  Cpu,
  Flame,
  Check,
  FileText,
  AlertCircle,
  Laptop,
  Home,
  GraduationCap,
  Calendar,
  Coffee,
  CheckSquare,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';
import {
  Vacancy,
  vacanciesData,
  generalTerms,
  applicationSteps,
  domainFilters
} from '../data/vacancies';

interface CareersPageProps {
  theme?: 'dark' | 'light';
  language?: 'nl' | 'en';
  onNavigateHome?: (tab?: any) => void;
}

export default function CareersPage({
  theme = 'dark',
  language = 'nl',
  onNavigateHome
}: CareersPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'matrix'>('cards');
  const [activeVacancy, setActiveVacancy] = useState<Vacancy | null>(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedVacancyCode, setSelectedVacancyCode] = useState<string>('01');

  // Sollicitatie Formulier State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formLinkedIn, setFormLinkedIn] = useState('');
  const [formContractType, setFormContractType] = useState('Vast contract');
  const [formHours, setFormHours] = useState('32–40 uur per week');
  const [formMotivation, setFormMotivation] = useState('');
  const [formFile, setFormFile] = useState<File | null>(null);
  const [formAgreed, setFormAgreed] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccessCode, setFormSuccessCode] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Filter vacatures
  const filteredVacancies = useMemo(() => {
    return vacanciesData.filter((v) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (language === 'en' ? v.titleEn : v.title).toLowerCase().includes(q);
        const matchCode = v.code.includes(q);
        const matchDomain = (language === 'en' ? v.domainEn : v.domain).toLowerCase().includes(q);
        const matchDesc = (language === 'en' ? v.roleOverview.en : v.roleOverview.nl).toLowerCase().includes(q);
        const matchTags = v.tags.some((t) => t.toLowerCase().includes(q));
        const matchReward = (language === 'en' ? v.remunerationSummaryEn : v.remunerationSummary).toLowerCase().includes(q);
        if (!matchTitle && !matchCode && !matchDomain && !matchDesc && !matchTags && !matchReward) {
          return false;
        }
      }

      // Domain filter
      if (selectedDomain !== 'all' && v.domainCategory !== selectedDomain) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedDomain, language]);

  const handleOpenDetail = (vacancy: Vacancy) => {
    setActiveVacancy(vacancy);
    setSelectedVacancyCode(vacancy.code);
    setShowApplyModal(false);
    setFormSuccessCode(null);
    setFormError(null);
  };

  const handleOpenApply = (vacancy?: Vacancy) => {
    if (vacancy) {
      setActiveVacancy(vacancy);
      setSelectedVacancyCode(vacancy.code);
    }
    setShowApplyModal(true);
    setFormSuccessCode(null);
    setFormError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormFile(e.target.files[0]);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || !formEmail.trim()) {
      setFormError(
        language === 'en'
          ? 'Please provide your full name and email address.'
          : 'Vul alstublieft uw volledige naam en e-mailadres in.'
      );
      return;
    }

    if (!formAgreed) {
      setFormError(
        language === 'en'
          ? 'Please accept the application conditions to proceed.'
          : 'U dient akkoord te gaan met de voorwaarden om uw sollicitatie in te dienen.'
      );
      return;
    }

    setFormSubmitting(true);

    // Gesimuleerde verzending naar de directie van Quantum Initium
    setTimeout(() => {
      setFormSubmitting(false);
      const code = `QI-VAC-${selectedVacancyCode}-${Math.floor(1000 + Math.random() * 9000)}`;
      setFormSuccessCode(code);
    }, 850);
  };

  const handleResetForm = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormLinkedIn('');
    setFormMotivation('');
    setFormFile(null);
    setFormAgreed(false);
    setFormSuccessCode(null);
    setFormError(null);
    setShowApplyModal(false);
  };

  const isLight = theme === 'light';

  return (
    <div
      className={`min-h-full w-full pb-24 ${
        isLight ? 'bg-[#f8fbfe] text-[#133b5c]' : 'bg-[#05070d] text-slate-100'
      }`}
    >
      {/* HEADER SECTION MET EXACTE OPDRACHTTITEL */}
      <section className="relative overflow-hidden border-b border-white/[0.08] px-4 py-10 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25">
          <div className="h-[420px] w-[500px] rounded-full bg-gradient-to-tr from-amber-500/25 via-cyan-500/20 to-blue-600/20 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          {/* Top Breadcrumb */}
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={() => onNavigateHome?.('architecture')}
              className={`hover:underline cursor-pointer ${isLight ? 'text-sky-700' : 'text-slate-400'}`}
            >
              Quantum Initium
            </button>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
            <span className="text-amber-400 font-semibold font-mono">
              {language === 'en' ? 'Careers & Vacancies' : 'Vacatures'}
            </span>
            <span className="ml-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 font-mono">
              13 {language === 'en' ? 'Open Positions' : 'Functies Beschikbaar'}
            </span>
          </div>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="inline-block rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2">
                Quantum Initium
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl text-white">
                VACATURES — INTERNATIONALE TECH-, AI- & VASTGOEDGROEP
              </h1>
              <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-slate-300">
                <span className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08] px-3 py-1 text-cyan-400 font-semibold">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>Locatie: 100% remote</span>
                </span>
                <span className="flex items-center gap-1.5 rounded-lg bg-slate-900/80 border border-white/[0.08] px-3 py-1 text-amber-300 font-semibold">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Dienstverband: 24–40 uur per week | zzp/freelance of vast contract</span>
                </span>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handleOpenApply()}
                className="cursor-pointer rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 transition-all hover:from-amber-300 hover:to-yellow-400 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span>{language === 'en' ? 'Direct Application' : 'Direct Solliciteren'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ARBEIDSVOORWAARDEN (GELDEN VOOR ALLE 13 FUNCTIES) */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.08] pb-4 mb-6 gap-2">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                Secundaire & Primaire Voorwaarden
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                ARBEIDSVOORWAARDEN (gelden voor alle 13 functies)
              </h2>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-slate-400">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>Gegarandeerd voor iedere rol</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Salaris */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-amber-400 mb-2">
                <Euro className="h-4 w-4" />
                <span>Salaris</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'en' ? generalTerms.salary.en : generalTerms.salary.nl}
              </p>
            </div>

            {/* Vakantie */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-cyan-400 mb-2">
                <Calendar className="h-4 w-4" />
                <span>Vakantie</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'en' ? generalTerms.vacation.en : generalTerms.vacation.nl}
              </p>
            </div>

            {/* Werkplek */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-emerald-400 mb-2">
                <Home className="h-4 w-4" />
                <span>Werkplek</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'en' ? generalTerms.workplace.en : generalTerms.workplace.nl}
              </p>
            </div>

            {/* Apparatuur */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-purple-400 mb-2">
                <Laptop className="h-4 w-4" />
                <span>Apparatuur</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'en' ? generalTerms.hardware.en : generalTerms.hardware.nl}
              </p>
            </div>

            {/* Inrichting */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-cyan-400 mb-2">
                <Coffee className="h-4 w-4" />
                <span>Inrichting</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'en' ? generalTerms.homeOfficeSetup.en : generalTerms.homeOfficeSetup.nl}
              </p>
            </div>

            {/* Ontwikkeling */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-amber-400 mb-2">
                <GraduationCap className="h-4 w-4" />
                <span>Ontwikkeling</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'en' ? generalTerms.development.en : generalTerms.development.nl}
              </p>
            </div>

            {/* Evenementen */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-rose-400 mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Evenementen</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'en' ? generalTerms.events.en : generalTerms.events.nl}
              </p>
            </div>

            {/* Functie-eis */}
            <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4">
              <div className="flex items-center gap-2.5 text-xs font-mono font-bold text-yellow-400 mb-2">
                <CheckSquare className="h-4 w-4" />
                <span>Functie-eis</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {language === 'en' ? generalTerms.educationLevel.en : generalTerms.educationLevel.nl}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER & MATRIX TOGGLE BAR */}
      <section className="sticky top-[53px] z-40 border-b border-white/[0.08] backdrop-blur-md px-4 py-3 sm:px-6 lg:px-8 bg-slate-950/85">
        <div className="mx-auto max-w-6xl space-y-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Search by role, ID [01-13], domain or reward (e.g. Pre-IPO, Closing, Subsidie)...'
                    : 'Zoek op functie, ID [01-13], domein of beloning (bijv. Pre-IPO, Closer, Subsidie, M&A)...'
                }
                className={`w-full rounded-xl border pl-10 pr-9 py-2 text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                  isLight
                    ? 'border-sky-200 bg-white text-sky-950 placeholder-slate-400'
                    : 'border-white/[0.12] bg-slate-900/90 text-slate-100 placeholder-slate-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Domein Filter Dropdown */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedDomain}
                onChange={(e) => setSelectedDomain(e.target.value)}
                className={`rounded-xl border px-3 py-2 text-xs font-medium cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400 ${
                  isLight
                    ? 'border-sky-200 bg-white text-sky-950'
                    : 'border-white/[0.12] bg-slate-900/90 text-slate-200'
                }`}
              >
                {domainFilters.map((dep) => (
                  <option key={dep.id} value={dep.id}>
                    {language === 'en' ? dep.label.en : dep.label.nl}
                  </option>
                ))}
              </select>

              {/* View Mode Toggle: Bento Cards vs Overzichtsmatrix */}
              <div className="flex items-center rounded-xl border border-white/[0.12] bg-slate-900 p-0.5">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    viewMode === 'cards'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Kaarten weergave"
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Kaarten</span>
                </button>
                <button
                  onClick={() => setViewMode('matrix')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                    viewMode === 'matrix'
                      ? 'bg-cyan-400 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title="Overzichtsmatrix tabel"
                >
                  <TableIcon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Matrix</span>
                </button>
              </div>

              {(searchQuery || selectedDomain !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDomain('all');
                  }}
                  className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                >
                  Wissen
                </button>
              )}
            </div>
          </div>

          {/* Resultaten samenvatting */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              {language === 'en'
                ? `Showing ${filteredVacancies.length} of 13 Quantum Initium positions`
                : `${filteredVacancies.length} van de 13 Quantum Initium posities getoond`}
            </span>
            <span className="font-mono text-[11px] text-amber-400">
              Internationale Tech-, AI- & Vastgoedgroep
            </span>
          </div>
        </div>
      </section>

      {/* OVERZICHTSMATRIX TABEL WEERGAVE */}
      {viewMode === 'matrix' && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-white/[0.08] bg-slate-900/80 overflow-hidden shadow-2xl">
            <div className="p-4 sm:p-6 border-b border-white/[0.08] flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-mono">
                  OVERZICHTSMATRIX
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Alle 13 actieve posities binnen Quantum Initium
                </p>
              </div>
              <span className="font-mono text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-xl">
                100% remote | 24–40 uur
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-[11px] font-mono uppercase text-slate-400 border-b border-white/[0.08]">
                  <tr>
                    <th className="py-3.5 px-4 font-bold text-amber-400">ID</th>
                    <th className="py-3.5 px-4 font-bold text-white">FUNCTIE</th>
                    <th className="py-3.5 px-4 font-bold text-cyan-400">DOMEIN</th>
                    <th className="py-3.5 px-4 font-bold text-emerald-400">BELONING</th>
                    <th className="py-3.5 px-4 font-bold text-right">ACTIE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {filteredVacancies.map((vacancy) => (
                    <tr
                      key={vacancy.id}
                      className="hover:bg-white/[0.02] transition-colors cursor-pointer group"
                      onClick={() => handleOpenDetail(vacancy)}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400 whitespace-nowrap">
                        [{vacancy.code}/13]
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        <div>{vacancy.title}</div>
                        <div className="text-[11px] font-mono text-slate-400">{vacancy.hours}</div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                        <span className="rounded-md bg-slate-800/80 border border-white/[0.08] px-2.5 py-1">
                          {vacancy.domain}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400 whitespace-nowrap font-medium">
                        {vacancy.remunerationSummary}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleOpenDetail(vacancy)}
                            className="rounded-lg border border-white/[0.12] bg-slate-800/80 px-2.5 py-1 text-[11px] font-semibold text-slate-200 hover:text-white hover:border-slate-600 cursor-pointer"
                          >
                            Details
                          </button>
                          <button
                            onClick={() => handleOpenApply(vacancy)}
                            className="rounded-lg bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-1 text-[11px] font-bold text-slate-950 cursor-pointer hover:from-amber-300"
                          >
                            Solliciteer
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* BENTO CARDS WEERGAVE */}
      {viewMode === 'cards' && (
        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {filteredVacancies.length === 0 ? (
            <div className="rounded-3xl border border-white/[0.08] bg-slate-900/40 p-12 text-center">
              <AlertCircle className="mx-auto h-12 w-12 text-amber-400/80 mb-3" />
              <h3 className="text-lg font-bold">Geen vacatures gevonden</h3>
              <p className="mt-2 text-xs max-w-md mx-auto text-slate-400">
                Geen van de 13 functies matcht met uw zoekterm. Reset de filters om alle 13 functies te bekijken.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDomain('all');
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md cursor-pointer hover:from-amber-300"
              >
                Filters Wissen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {filteredVacancies.map((vacancy) => (
                <div
                  key={vacancy.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-gradient-to-b from-slate-900/80 to-slate-950/95 p-6 transition-all duration-300 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/5"
                >
                  <div>
                    {/* Top Row: Code Badge + Domain Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-mono font-bold text-amber-400">
                          [{vacancy.code}/13]
                        </span>
                        <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-mono font-semibold text-cyan-300">
                          {vacancy.domain}
                        </span>
                      </div>

                      <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                        {vacancy.remunerationSummary}
                      </span>
                    </div>

                    {/* Job Title */}
                    <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                      {vacancy.title}
                    </h3>

                    {/* Meta info tags */}
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800/80 border border-white/[0.08] px-2.5 py-1 text-[11px] font-mono text-slate-300">
                        <MapPin className="h-3 w-3 text-cyan-400" />
                        <span>100% remote</span>
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800/80 border border-white/[0.08] px-2.5 py-1 text-[11px] font-mono text-slate-300">
                        <Clock className="h-3 w-3 text-amber-400" />
                        <span>{vacancy.hours}</span>
                      </span>

                      <span className="inline-flex items-center gap-1 rounded-lg bg-slate-800/80 border border-white/[0.08] px-2.5 py-1 text-[11px] font-mono text-slate-300">
                        <Award className="h-3 w-3 text-purple-400" />
                        <span>{vacancy.experience}</span>
                      </span>
                    </div>

                    {/* Role Overview */}
                    <p className="mt-3.5 text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {language === 'en' ? vacancy.roleOverview.en : vacancy.roleOverview.nl}
                    </p>

                    {/* Core Tasks Preview */}
                    <div className="mt-4 space-y-1.5 border-t border-white/[0.06] pt-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-slate-400 block mb-1">
                        Kernactiviteiten:
                      </span>
                      {vacancy.tasks.nl.slice(0, 2).map((task, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-400 line-clamp-1">
                          <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{task}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap items-center gap-1.5">
                      {vacancy.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md border border-white/[0.08] bg-slate-900 px-2 py-0.5 text-[10px] font-mono text-slate-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="mt-6 flex items-center justify-between border-t border-white/[0.08] pt-4">
                    <span className="text-[11px] font-mono text-slate-500">
                      ID: {vacancy.code} • Quantum Initium
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenDetail(vacancy)}
                        className="rounded-xl border border-white/[0.12] bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-600 cursor-pointer transition-all"
                      >
                        Bekijk details
                      </button>

                      <button
                        onClick={() => handleOpenApply(vacancy)}
                        className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 shadow-sm shadow-amber-500/20 cursor-pointer hover:from-amber-300 flex items-center gap-1.5"
                      >
                        <span>Solliciteren</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* 4 STAPPEN SOLLICITATIEPROCES */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-slate-900/90 via-slate-950 to-[#0c1120] p-6 sm:p-10">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Sollicitatieprocedure
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-1 font-mono">
              SOLLICITEREN BIJ QUANTUM INITIUM
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
              Ons selectieproces is direct, transparant en 100% remote ingericht. In vier overzichtelijke stappen ga je van eerste kennismaking naar de officiële kick-off.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {applicationSteps.map((step) => (
              <div
                key={step.step}
                className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-5 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-extrabold font-mono text-amber-400/90">
                    {step.step}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Check className="h-4 w-4" />
                  </div>
                </div>
                <h4 className="font-bold text-xs font-mono text-white mb-2">
                  {language === 'en' ? step.name.en : step.name.nl}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {language === 'en' ? step.desc.en : step.desc.nl}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-mono text-center sm:text-left">
              Direct reageren? Geef je gewenste vacature-ID op in het formulier.
            </span>
            <button
              onClick={() => handleOpenApply()}
              className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer hover:from-amber-300 flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              <span>Nu Solliciteren op ID [01-13]</span>
            </button>
          </div>
        </div>
      </section>

      {/* VACATURE DETAIL MODAL */}
      {activeVacancy && !showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div
            className={`relative my-8 w-full max-w-3xl rounded-3xl border p-6 sm:p-8 shadow-2xl transition-all ${
              isLight ? 'border-sky-200 bg-white text-sky-950' : 'border-white/[0.12] bg-slate-950 text-slate-100'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-5">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-mono font-bold text-amber-400">
                    [{activeVacancy.code}/13]
                  </span>
                  <span className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-mono font-semibold text-cyan-300">
                    {activeVacancy.domain}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Quantum Initium
                  </span>
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-white">
                  [{activeVacancy.code}/13] {activeVacancy.title}
                </h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{activeVacancy.location}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-400" />
                    <span>{activeVacancy.hours}</span>
                  </span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{activeVacancy.remunerationSummary}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveVacancy(null)}
                className="rounded-xl border border-white/[0.08] bg-slate-900 p-2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-6 max-h-[60vh] space-y-6 overflow-y-auto pr-2 text-xs sm:text-sm">
              {/* Over de rol */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-amber-400 mb-2">
                  OVER DE ROL
                </h4>
                <p className="leading-relaxed text-slate-300">
                  {language === 'en' ? activeVacancy.roleOverview.en : activeVacancy.roleOverview.nl}
                </p>
              </div>

              {/* Taken */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-cyan-400 mb-2.5">
                  TAKEN
                </h4>
                <ul className="space-y-2">
                  {(language === 'en' ? activeVacancy.tasks.en : activeVacancy.tasks.nl).map(
                    (task, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300">{task}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Profiel */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-400 mb-2.5">
                  PROFIEL
                </h4>
                <ul className="space-y-2">
                  {(language === 'en' ? activeVacancy.profile.en : activeVacancy.profile.nl).map(
                    (req, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300">{req}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Beloning */}
              <div>
                <h4 className="font-mono text-xs uppercase tracking-wider font-bold text-purple-400 mb-2.5">
                  BELONING
                </h4>
                <ul className="space-y-2">
                  {(language === 'en' ? activeVacancy.remuneration.en : activeVacancy.remuneration.nl).map(
                    (reward, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Euro className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                        <span className="text-slate-300">{reward}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Arbeidsvoorwaarden box */}
              <div className="rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4">
                <span className="text-xs font-mono font-bold uppercase text-amber-400 block mb-2">
                  Standaard Arbeidsvoorwaarden (Inbegrepen)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
                  <div>• 27 vakantiedagen (fulltime basis)</div>
                  <div>• 100% remote + thuiswerkvergoeding</div>
                  <div>• Laptop en smartphone in bruikleen</div>
                  <div>• Budget voor ergonomische werkplek</div>
                  <div>• Interne academie & certificeringen</div>
                  <div>• Kwartaalborrels, workation & hackathons</div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="mt-6 flex flex-wrap items-center justify-between border-t border-white/[0.08] pt-5 gap-3">
              <span className="text-xs font-mono text-slate-400">
                Vacaturecode: [{activeVacancy.code}/13]
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveVacancy(null)}
                  className="rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white cursor-pointer"
                >
                  Sluiten
                </button>
                <button
                  onClick={() => handleOpenApply(activeVacancy)}
                  className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-5 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer hover:from-amber-300 flex items-center gap-2"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Solliciteer op deze rol</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION FORM MODAL */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div
            className={`relative my-8 w-full max-w-2xl rounded-3xl border p-6 sm:p-8 shadow-2xl ${
              isLight ? 'border-sky-200 bg-white text-sky-950' : 'border-white/[0.12] bg-slate-950 text-slate-100'
            }`}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  Quantum Initium — Sollicitatieformulier
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  Solliciteer op Vacature [{selectedVacancyCode}/13]
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  100% remote • 24–40 uur per week • zzp/freelance of vast contract
                </p>
              </div>

              <button
                onClick={handleResetForm}
                className="rounded-xl border border-white/[0.08] bg-slate-900 p-2 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form Success State */}
            {formSuccessCode ? (
              <div className="py-8 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h4 className="text-xl font-bold text-white">
                  Sollicitatie Succesvol Ontvangen!
                </h4>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                  Hartelijk dank voor je sollicitatie voor vacature [{selectedVacancyCode}/13]. Stap 1 van het proces is voltooid. We nemen binnen 48 uur contact op voor het videogesprek van 30 minuten (Stap 2).
                </p>

                <div className="mt-6 rounded-2xl border border-white/[0.08] bg-slate-900/60 p-4 max-w-sm mx-auto">
                  <span className="text-[11px] font-mono text-slate-400 block uppercase">
                    Dossier Referentienummer
                  </span>
                  <span className="text-base font-mono font-bold text-amber-400 mt-1 block">
                    {formSuccessCode}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    info@quantuminitium.com
                  </span>
                </div>

                <div className="mt-8">
                  <button
                    onClick={handleResetForm}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-2.5 text-xs font-bold text-slate-950 shadow-md cursor-pointer hover:from-amber-300"
                  >
                    Terug naar vacatures
                  </button>
                </div>
              </div>
            ) : (
              /* Actual Form */
              <form onSubmit={handleFormSubmit} className="mt-6 space-y-4">
                {formError && (
                  <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Vacature ID selectie */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Selecteer Vacature (ID 01 t/m 13) *
                  </label>
                  <select
                    value={selectedVacancyCode}
                    onChange={(e) => setSelectedVacancyCode(e.target.value)}
                    className="w-full rounded-xl border border-white/[0.12] bg-slate-900 px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
                  >
                    {vacanciesData.map((v) => (
                      <option key={v.code} value={v.code}>
                        [{v.code}/13] {v.title} — {v.domain} ({v.remunerationSummary})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Gewenst Dienstverband *
                    </label>
                    <select
                      value={formContractType}
                      onChange={(e) => setFormContractType(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.12] bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
                    >
                      <option value="Vast contract">Vast contract</option>
                      <option value="ZZP / Freelance">ZZP / Freelance</option>
                      <option value="Beide opties bespreekbaar">Beide opties bespreekbaar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Beschikbaarheid (Uren per week) *
                    </label>
                    <select
                      value={formHours}
                      onChange={(e) => setFormHours(e.target.value)}
                      className="w-full rounded-xl border border-white/[0.12] bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
                    >
                      <option value="32–40 uur per week">32–40 uur per week (Fulltime)</option>
                      <option value="24–32 uur per week">24–32 uur per week (Parttime)</option>
                      <option value="Flexibel in overleg">Flexibel in overleg</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Volledige Naam *
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="bijv. Alexander van der Meer"
                      className="w-full rounded-xl border border-white/[0.12] bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      required
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      placeholder="naam@voorbeeld.nl"
                      className="w-full rounded-xl border border-white/[0.12] bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Telefoonnummer
                    </label>
                    <input
                      type="tel"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                      placeholder="+31 6 12345678"
                      className="w-full rounded-xl border border-white/[0.12] bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      LinkedIn-profiel URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={formLinkedIn}
                      onChange={(e) => setFormLinkedIn(e.target.value)}
                      placeholder="https://linkedin.com/in/jouwnaam"
                      className="w-full rounded-xl border border-white/[0.12] bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Korte Toelichting / Trackrecord (Optioneel)
                  </label>
                  <textarea
                    rows={2}
                    value={formMotivation}
                    onChange={(e) => setFormMotivation(e.target.value)}
                    placeholder="Licht kort je relevante ervaring, trackrecord of gewenste vergoedingsstructuur toe..."
                    className="w-full rounded-xl border border-white/[0.12] bg-slate-900 p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>

                {/* CV File Upload */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Curriculum Vitae (PDF / DOCX) *
                  </label>
                  <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/[0.12] bg-slate-900/50 p-3.5 transition-colors hover:border-cyan-400/50">
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {formFile ? (
                      <div className="flex items-center gap-2 text-xs text-cyan-400">
                        <FileText className="h-5 w-5" />
                        <span className="font-mono font-semibold">{formFile.name}</span>
                        <span className="text-[10px] text-slate-400">
                          ({(formFile.size / 1024).toFixed(0)} KB)
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-5 w-5 text-slate-400 mb-1" />
                        <span className="text-xs text-slate-300">
                          Sleep je CV hierheen of klik om te uploaden
                        </span>
                        <span className="block text-[10px] font-mono text-slate-500 mt-0.5">
                          PDF of DOCX tot 15MB
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Privacy & Akkoord */}
                <div className="flex items-start gap-2.5 pt-1">
                  <input
                    type="checkbox"
                    id="privacyAgreement"
                    checked={formAgreed}
                    onChange={(e) => setFormAgreed(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 cursor-pointer"
                  />
                  <label htmlFor="privacyAgreement" className="text-[11px] text-slate-400 cursor-pointer">
                    Ik bevestig dat ik beschik over een HBO- of WO-werk- en denkniveau (of gelijkwaardige ervaring) en ga akkoord met de verwerking van mijn gegevens voor deze sollicitatie.
                  </label>
                </div>

                {/* Form Buttons */}
                <div className="mt-6 flex items-center justify-end gap-2.5 border-t border-white/[0.08] pt-4">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="rounded-xl border border-white/[0.08] px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
                  >
                    Annuleren
                  </button>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-6 py-2 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 cursor-pointer hover:from-amber-300 flex items-center gap-2 disabled:opacity-50"
                  >
                    {formSubmitting ? (
                      <>
                        <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-slate-950 border-t-transparent" />
                        <span>Verzenden...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Dossier Indienen</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
