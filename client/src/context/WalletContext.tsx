"use client";

import React, { createContext, useContext, useCallback, useMemo, useState, useEffect } from "react";
import { useFreighter } from "@/hooks/useFreighter";

const CONTRACT_ADDRESS = "CBZVYLQJKDHHSIB33MKDF2Z3EHTILULJIR3CBQHNW3RSASHOHTVQE42G";
const DEMO_ADDRESS = "GDEMOZAKATCHAIN77777777777777777777777777777777777777777";

interface WalletContextType {
  isInstalled: boolean;
  isAllowed: boolean;
  publicKey: string | null;
  isConnecting: boolean;
  isDemo: boolean;
  error: string | null;
  contractAddress: string;
  networkPassphrase: string;
  rpcUrl: string;
  connectWallet: () => Promise<string | null>;
  connectDemoWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  getPublicKey: () => string | null;
  signTransaction: (xdr: string) => Promise<string>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const freighter = useFreighter();
  const [walletType, setWalletType] = useState<"freighter" | "demo" | null>(null);

  // Load saved connection type on mount
  useEffect(() => {
    const savedType = localStorage.getItem("zakatchain_wallet_type") as "freighter" | "demo" | null;
    if (savedType) {
      setWalletType(savedType);
    }
  }, []);

  const connectWallet = useCallback(async () => {
    const addr = await freighter.connectWallet();
    if (addr) {
      setWalletType("freighter");
      localStorage.setItem("zakatchain_wallet_type", "freighter");
    }
    return addr;
  }, [freighter]);

  const connectDemoWallet = useCallback(async () => {
    setWalletType("demo");
    localStorage.setItem("zakatchain_wallet_type", "demo");
    return DEMO_ADDRESS;
  }, []);

  const disconnectWallet = useCallback(() => {
    freighter.disconnectWallet();
    setWalletType(null);
    localStorage.removeItem("zakatchain_wallet_type");
  }, [freighter]);

  const isDemo = walletType === "demo";
  const publicKey = isDemo ? DEMO_ADDRESS : freighter.publicKey;
  const isConnecting = !isDemo && freighter.isConnecting;
  const error = isDemo ? null : freighter.error;

  const getPublicKey = useCallback(() => {
    return isDemo ? DEMO_ADDRESS : freighter.publicKey;
  }, [isDemo, freighter.publicKey]);

  const signTransaction = useCallback(async (xdr: string): Promise<string> => {
    if (isDemo) {
      return "AAAAAMOCK_SIGNATURE_XDR_DEMO_MODE_ACTIVE_AAAAA";
    }
    return freighter.signTransaction(xdr);
  }, [isDemo, freighter]);

  const value = useMemo(
    () => ({
      isInstalled: isDemo ? true : freighter.isInstalled,
      isAllowed: isDemo ? true : freighter.isAllowed,
      publicKey,
      isConnecting,
      isDemo,
      error,
      contractAddress: CONTRACT_ADDRESS,
      networkPassphrase: "Test SDF Network ; September 2015" as const,
      rpcUrl: "https://soroban-testnet.stellar.org" as const,
      connectWallet,
      connectDemoWallet,
      disconnectWallet,
      getPublicKey,
      signTransaction,
    }),
    [
      isDemo,
      freighter.isInstalled,
      freighter.isAllowed,
      publicKey,
      isConnecting,
      error,
      connectWallet,
      connectDemoWallet,
      disconnectWallet,
      getPublicKey,
      signTransaction,
    ]
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

