import React, { useState } from 'react';
import { BriefcaseBusiness, Chrome, Facebook, Linkedin, LoaderCircle } from 'lucide-react';
import { OAuthIntent, OAuthProvider, signInWithOAuth } from '../lib/authStore';

interface OAuthButtonsProps {
  intent: OAuthIntent;
  onError: (message: string) => void;
  disabled?: boolean;
}

const providers: Array<{ id: OAuthProvider; label: string }> = [
  { id: 'google', label: 'Google' },
  { id: 'linkedin_oidc', label: 'LinkedIn' },
  { id: 'facebook', label: 'Facebook' }
];

const providerIcons: Record<OAuthProvider, typeof Chrome> = {
  google: Chrome,
  linkedin_oidc: Linkedin,
  facebook: Facebook
};

export default function OAuthButtons({ intent, onError, disabled = false }: OAuthButtonsProps) {
  const [activeProvider, setActiveProvider] = useState<OAuthProvider | null>(null);

  const handleOAuth = async (provider: OAuthProvider) => {
    onError('');
    setActiveProvider(provider);
    try {
      await signInWithOAuth(provider, intent);
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Social login mislukt.');
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {providers.map((provider) => {
          const Icon = providerIcons[provider.id];
          return (
            <button
              key={provider.id}
              type="button"
              onClick={() => void handleOAuth(provider.id)}
              disabled={disabled || activeProvider !== null}
              className={`group px-3 py-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait ${
                provider.id === 'google'
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-white hover:bg-cyan-500/20 hover:border-cyan-400'
                  : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:text-white hover:border-slate-600'
              }`}
            >
              <span className="flex items-center justify-center gap-2">
                {activeProvider === provider.id ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
                {activeProvider === provider.id ? 'Verbinden...' : provider.label}
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
