"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { useFreighter } from "@/hooks/useFreighter";
import {
  rpc as SorobanRpc,
  Contract,
  Transaction,
  TransactionBuilder,
  scValToNative,
  BASE_FEE,
  xdr,
} from "@stellar/stellar-sdk";

type ScVal = xdr.ScVal;

interface WalletContextType {
  isInstalled: boolean;
  isAllowed: boolean;
  publicKey: string | null;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<string | null>;
  disconnectWallet: () => void;
  getPublicKey: () => string | null;
  signTransaction: (xdr: string) => Promise<string>;
  callContract: (
    method: string,
    params: ScVal[],
    caller?: string
  ) => Promise<unknown>;
  readContract: (
    method: string,
    params: ScVal[],
    caller?: string
  ) => Promise<unknown>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
const CONTRACT_ADDRESS = ""; // Set after deployment

const server = new SorobanRpc.Server(RPC_URL);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const freighter = useFreighter();

  const callContract = useCallback(
    async (method: string, params: ScVal[], caller?: string): Promise<unknown> => {
      if (!freighter.publicKey && !caller) {
        throw new Error("Wallet not connected");
      }
      const source = caller || freighter.publicKey!;
      const contract = new Contract(CONTRACT_ADDRESS);

      const account = await server.getAccount(source);

      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(method, ...params))
        .setTimeout(30)
        .build();

      const simulation = await server.simulateTransaction(tx);
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation error`);
      }

      const preparedTx = SorobanRpc.assembleTransaction(tx, simulation).build();
      const signedXdr = await freighter.signTransaction(
        preparedTx.toXDR()
      );

      const signedTx = new Transaction(signedXdr, NETWORK_PASSPHRASE);
      const response = await server.sendTransaction(signedTx);
      if (response.status === "PENDING") {
        const result = await server.getTransaction(response.hash);
        if (result.status === "SUCCESS") {
          return result.returnValue ? scValToNative(result.returnValue) : null;
        }
        throw new Error("Transaction failed");
      }
      throw new Error("Transaction submission failed");
    },
    [freighter]
  );

  const readContract = useCallback(
    async (method: string, params: ScVal[], caller?: string): Promise<unknown> => {
      const source = caller || freighter.publicKey!;
      const contract = new Contract(CONTRACT_ADDRESS);

      const account = await server.getAccount(source);
      const tx = new TransactionBuilder(account, {
        fee: BASE_FEE,
        networkPassphrase: NETWORK_PASSPHRASE,
      })
        .addOperation(contract.call(method, ...params))
        .setTimeout(30)
        .build();

      const simulation = await server.simulateTransaction(tx);
      if (SorobanRpc.Api.isSimulationError(simulation)) {
        throw new Error(`Simulation error`);
      }
      if (SorobanRpc.Api.isSimulationSuccess(simulation) && simulation.result) {
        return scValToNative(simulation.result.retval);
      }
      return null;
    },
    [freighter]
  );

  const value = useMemo(
    () => ({
      ...freighter,
      callContract,
      readContract,
    }),
    [freighter, callContract, readContract]
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
