import React, { createContext, useContext } from 'react';

export interface AmountPrivacyContextValue {
  amountsVisible: boolean;
  toggleAmounts: () => void;
  mask: (text: string) => string;
}

export const maskAmounts = (text: string): string =>
  text.replace(/€\s*[\d.,]+\s*(?:[MKBm]|miljoen|miljard)?/gi, '€ ••••••');

const AmountPrivacyContext = createContext<AmountPrivacyContextValue>({
  amountsVisible: false,
  toggleAmounts: () => {},
  mask: maskAmounts
});

export const useAmountPrivacy = () => useContext(AmountPrivacyContext);

export function AmountPrivacyProvider({
  amountsVisible,
  toggleAmounts,
  children
}: {
  amountsVisible: boolean;
  toggleAmounts: () => void;
  children: React.ReactNode;
}) {
  return (
    <AmountPrivacyContext.Provider
      value={{
        amountsVisible,
        toggleAmounts,
        mask: (text: string) => (amountsVisible ? text : maskAmounts(text))
      }}
    >
      {children}
    </AmountPrivacyContext.Provider>
  );
}

export function PrivateAmount({ value }: { value: React.ReactNode }) {
  const { amountsVisible, toggleAmounts } = useAmountPrivacy();

  const handleTrigger = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    toggleAmounts();
  };

  if (amountsVisible) {
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={handleTrigger}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleTrigger(e);
          }
        }}
        title="Klik om bedragen te maskeren"
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#30d158]/12 text-[#30d158] border border-[#30d158]/30 cursor-pointer hover:bg-[#30d158]/20 transition-colors select-none"
      >
        <span>{value}</span>
        <span className="text-[10px] leading-none" aria-hidden="true">👁️</span>
      </span>
    );
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleTrigger}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleTrigger(e);
        }
      }}
      title="Log in of klik om beveiligde bedragen te tonen"
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.08] text-[#2997ff] border border-white/15 cursor-pointer hover:bg-white/[0.14] hover:border-[#2997ff]/40 transition-colors select-none font-mono text-[0.85em]"
    >
      <span>€ ••••••</span>
      <span className="text-[10px] leading-none" aria-hidden="true">👁️</span>
    </span>
  );
}
