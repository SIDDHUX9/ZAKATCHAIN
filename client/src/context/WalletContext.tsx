"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useFreighter } from "@/hooks/useFreighter";

const CONTRACT_ADDRESS = "CBZVYLQJKDHHSIB33MKDF2Z3EHTILULJIR3CBQHNW3RSASHOHTVQE42G";

interface WalletContextType {
  isInstalled: boolean;
  isAllowed: boolean;
  publicKey: string | null;
  isConnecting: boolean;
  error: string | null;
  contractAddress: string;
  networkPassphrase: string;
  rpcUrl: string;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  getPublicKey: () => string | null;
  signTransaction: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const freighter = useFreighter();

  const value = useMemo(
    () => ({
      ...freighter,
      contractAddress: CONTRACT_ADDRESS,
      networkPassphrase: "Test SDF Network ; September 2015" as const,
      rpcUrl: "https://soroban-testnet.stellar.org" as const,
    }),
    [freighter]
  );

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
}
