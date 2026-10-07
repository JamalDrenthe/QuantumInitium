import React, { createContext, useContext } from 'react';

export interface AmountPrivacyContextValue {
  amountsVisible: boolean;
  toggleAmounts: () => void;
  mask: (text: string) => string;
}

export const maskAmounts = (text: string): string =>
  text.replace(/€\s*[\d.,]+\s*(?:[MKBm]|miljoen|miljard)?/gi, '€ •••');

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
  const { amountsVisible } = useAmountPrivacy();
  if (amountsVisible) {
    return <>{value}</>;
  }
  return <>€ •••</>;
}
