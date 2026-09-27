import React, { useState } from 'react';
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
    <div className="space-y-3 mb-6">
      <div className="relative flex items-center">
        <div className="flex-1 border-t border-slate-800" />
        <span className="px-3 text-[11px] font-mono text-slate-500">of ga verder met</span>
        <div className="flex-1 border-t border-slate-800" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => void handleOAuth(provider.id)}
            disabled={disabled || activeProvider !== null}
            className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/50 disabled:opacity-60 disabled:cursor-wait transition-colors cursor-pointer text-xs font-semibold"
          >
            {activeProvider === provider.id ? 'Verbinden...' : provider.label}
          </button>
        ))}
      </div>
    </div>
  );
}
