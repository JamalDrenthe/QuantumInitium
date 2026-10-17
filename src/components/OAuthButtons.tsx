import React, { useState } from 'react';
import { BriefcaseBusiness, Facebook, Linkedin, LoaderCircle } from 'lucide-react';
import { AuthUser } from '../types/auth';
import { buildRegisteredInvestor, OAuthIntent, OAuthProvider, signInWithOAuth } from '../lib/authStore';
import { createManagedAccount, loadAccountForSession } from '../lib/accountStore';

const GoogleIcon = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

interface OAuthButtonsProps {
  intent: OAuthIntent;
  onError: (message: string) => void;
  onSuccess?: (user: AuthUser) => void;
  disabled?: boolean;
}

const providers: Array<{ id: OAuthProvider; label: string }> = [
  { id: 'google', label: 'Google' },
  { id: 'linkedin_oidc', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' }
];

const providerIcons: Record<OAuthProvider, React.ComponentType<{ className?: string }>> = {
  google: GoogleIcon,
  linkedin_oidc: Linkedin,
  facebook: Facebook
};

export default function OAuthButtons({ intent, onError, onSuccess, disabled = false }: OAuthButtonsProps) {
  const [activeProvider, setActiveProvider] = useState<OAuthProvider | null>(null);

  const handleOAuth = async (provider: OAuthProvider) => {
    onError('');
    setActiveProvider(provider);
    try {
      const identity = await signInWithOAuth(provider, intent);
      if (identity && onSuccess) {
        let account: AuthUser;
        try {
          account = await loadAccountForSession(identity);
        } catch {
          const normalizedEmail = identity.email.toLowerCase();
          const isInfoAdmin = normalizedEmail === 'info@quantuminitium.com' || normalizedEmail === 'info@jamaldrenthe.com';
          const newUser = buildRegisteredInvestor(
            identity.id,
            identity.name || (isInfoAdmin ? 'Directie QuantumInitium' : identity.email.split('@')[0] || 'Investeerder'),
            identity.email,
            isInfoAdmin ? 0 : 2500
          );
          if (isInfoAdmin) {
            newUser.role = 'admin';
          }
          try {
            await createManagedAccount(newUser, identity.id);
            account = await loadAccountForSession(identity);
          } catch (createErr) {
            console.warn('Firestore account synchronisatie fallback naar geheugen:', createErr);
            account = newUser;
          }
        }
        onSuccess(account);
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Social login mislukt.');
    } finally {
      setActiveProvider(null);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 rounded-lg bg-cyan-500/15 p-2 text-cyan-300">
            <BriefcaseBusiness className="w-4 h-4" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {intent === 'login' ? 'Snel aanmelden' : 'Account aanmaken'}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-slate-400">
              {intent === 'login'
                ? 'Gebruik een gekoppeld account voor directe toegang tot uw QuantumInitium-profiel.'
                : 'Maak uw profiel aan met een bestaand account en voltooi daarna uw investeerdersgegevens.'}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex items-center">
        <div className="flex-1 border-t border-slate-800" />
        <span className="px-3 text-[11px] font-mono uppercase tracking-wider text-slate-500">
          {intent === 'login' ? 'Aanmelden met' : 'Registreren met'}
        </span>
        <div className="flex-1 border-t border-slate-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {providers.map((provider) => {
          const Icon = providerIcons[provider.id];
          const isGoogle = provider.id === 'google';
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => void handleOAuth(provider.id)}
              disabled={disabled || activeProvider !== null}
              className={`group px-3 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
                isGoogle
                  ? 'border-white/20 bg-white/[0.07] text-white hover:bg-white/[0.13] hover:border-white/30 shadow-sm shadow-black/40 ring-1 ring-white/10'
                  : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:text-white hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {activeProvider === provider.id ? (
                  <LoaderCircle className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                <span>{activeProvider === provider.id ? 'Verbinden...' : provider.label}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-[11px] leading-relaxed text-slate-500">
        U wordt veilig doorgestuurd naar de gekozen provider. Uw wachtwoord wordt niet met QuantumInitium gedeeld.
      </p>
    </div>
  );
}
