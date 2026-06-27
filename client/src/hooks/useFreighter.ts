"use client";

import { useState, useCallback, useEffect } from "react";
import {
  isConnected,
  isAllowed,
  requestAccess,
  setAllowed,
  getAddress,
  signTransaction as freighterSignTransaction,
} from "@stellar/freighter-api";

interface FreighterState {
  isInstalled: boolean;
  isAllowed: boolean;
  publicKey: string | null;
  isConnecting: boolean;
  error: string | null;
}

interface UseFreighterReturn {
  isInstalled: boolean;
  isAllowed: boolean;
  publicKey: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  getPublicKey: () => string | null;
  signTransaction: (xdr: string) => Promise<string>;
  checkConnection: () => Promise<boolean>;
}

export function useFreighter(): UseFreighterReturn {
  const [state, setState] = useState<FreighterState>({
    isInstalled: false,
    isAllowed: false,
    publicKey: null,
    isConnecting: false,
    error: null,
  });

  useEffect(() => {
    checkFreighterConnection();
  }, []);

  const checkFreighterConnection = useCallback(async () => {
    try {
      const connected = await isConnected();
      const allowed = await isAllowed();

      let publicKey: string | null = null;
      if (connected && allowed) {
        const { address } = await getAddress();
        publicKey = address;
      }

      setState((prev) => ({
        ...prev,
        isInstalled: connected,
        isAllowed: allowed,
        publicKey,
        error: null,
      }));
    } catch {
      setState((prev) => ({
        ...prev,
        isInstalled: false,
        isAllowed: false,
        publicKey: null,
        error: null,
      }));
    }
  }, []);

  const checkConnection = useCallback(async (): Promise<boolean> => {
    await checkFreighterConnection();
    return state.isInstalled && state.isAllowed && state.publicKey !== null;
  }, [checkFreighterConnection, state.isInstalled, state.isAllowed, state.publicKey]);

  const connectWallet = useCallback(async (): Promise<string | null> => {
    setState((prev) => ({ ...prev, isConnecting: true, error: null }));

    try {
      const connected = await isConnected();
      if (!connected) {
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          error: "Freighter wallet is not installed. Please install Freighter.",
        }));
        return null;
      }

      const allowed = await isAllowed();
      if (!allowed) {
        await setAllowed();
      }

      const { address } = await getAddress();

      setState((prev) => ({
        ...prev,
        isInstalled: true,
        isAllowed: true,
        publicKey: address,
        isConnecting: false,
        error: null,
      }));

      return address;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to connect Freighter wallet";
      setState((prev) => ({
        ...prev,
        isConnecting: false,
        error: message,
      }));
      return null;
    }
  }, []);

  const disconnectWallet = useCallback(() => {
    setState({
      isInstalled: true,
      isAllowed: false,
      publicKey: null,
      isConnecting: false,
      error: null,
    });
  }, []);

  const getPublicKey = useCallback((): string | null => {
    return state.publicKey;
  }, [state.publicKey]);

  const signTransaction = useCallback(async (xdr: string): Promise<string> => {
    const { signedTxXdr } = await freighterSignTransaction(xdr, {
      networkPassphrase: "Test SDF Network ; September 2015",
    });
    return signedTxXdr;
  }, []);

  return {
    isInstalled: state.isInstalled,
    isAllowed: state.isAllowed,
    publicKey: state.publicKey,
    isConnecting: state.isConnecting,
    error: state.error,
    connectWallet,
    disconnectWallet,
    getPublicKey,
    signTransaction,
    checkConnection,
  };
}
