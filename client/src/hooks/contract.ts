"use client";

import { useWallet } from "@/context/WalletContext";
import { Client, networks } from "contract";
import { useCallback, useRef } from "react";

function getClient(publicKey: string | null, signTransaction: (xdr: string) => Promise<string>) {
  return new Client({
    contractId: networks.testnet.contractId,
    networkPassphrase: networks.testnet.networkPassphrase,
    rpcUrl: "https://soroban-testnet.stellar.org",
    publicKey: publicKey || undefined,
    signTransaction: publicKey
      ? (xdr: string) => signTransaction(xdr).then((signedTxXdr) => ({ signedTxXdr }))
      : undefined,
  });
}

export function useContract() {
  const { publicKey, signTransaction } = useWallet();
  const clientRef = useRef<Client | null>(null);

  const getClientInstance = useCallback(() => {
    if (!clientRef.current || clientRef.current.options.publicKey !== publicKey) {
      clientRef.current = getClient(publicKey, signTransaction);
    }
    return clientRef.current;
  }, [publicKey, signTransaction]);

  const initContract = useCallback(async () => {
    const client = getClientInstance();
    const tx = await client.init();
    if (publicKey) {
      const result = await tx.signAndSend();
      return result.result;
    }
    return null;
  }, [getClientInstance, publicKey]);

  const recordDistribution = useCallback(
    async (
      donor: string,
      totalAmount: bigint,
      beneficiaries: string,
      txHash: string
    ) => {
      const client = getClientInstance();
      const tx = await client.record_distribution({
        donor,
        total_amount: totalAmount,
        beneficiaries,
        tx_hash: txHash,
      });
      const result = await tx.signAndSend();
      return result;
    },
    [getClientInstance]
  );

  const getDonorTotal = useCallback(
    async (donor: string): Promise<bigint> => {
      const client = getClientInstance();
      const tx = await client.get_donor_total({ donor });
      return tx.result;
    },
    [getClientInstance]
  );

  const getTotalDistributed = useCallback(async (): Promise<bigint> => {
    const client = getClientInstance();
    const tx = await client.get_total_distributed();
    return tx.result;
  }, [getClientInstance]);

  const getDonorCount = useCallback(async (): Promise<bigint> => {
    const client = getClientInstance();
    const tx = await client.get_donor_count();
    return tx.result;
  }, [getClientInstance]);

  const getBeneficiaryCount = useCallback(async (): Promise<bigint> => {
    const client = getClientInstance();
    const tx = await client.get_beneficiary_count();
    return tx.result;
  }, [getClientInstance]);

  const getPlatformStats = useCallback(async () => {
    const [totalDistributed, donorCount, beneficiaryCount] = await Promise.all([
      getTotalDistributed(),
      getDonorCount(),
      getBeneficiaryCount(),
    ]);
    return {
      totalDistributed,
      donorCount,
      beneficiaryCount,
    };
  }, [getTotalDistributed, getDonorCount, getBeneficiaryCount]);

  return {
    initContract,
    recordDistribution,
    getDonorTotal,
    getTotalDistributed,
    getDonorCount,
    getBeneficiaryCount,
    getPlatformStats,
    contractAddress: networks.testnet.contractId,
  };
}

// Legacy helpers for backwards compatibility — kept for reference
import { nativeToScVal } from "@stellar/stellar-sdk";

export function toScValString(v: string) {
  return nativeToScVal(v, { type: "string" });
}

export function toScValU32(v: number) {
  return nativeToScVal(v, { type: "u32" });
}

export function toScValI128(v: string | bigint) {
  return nativeToScVal(v, { type: "i128" });
}

export function toScValAddress(v: string) {
  return nativeToScVal(v, { type: "address" });
}

export function toScValBool(v: boolean) {
  return nativeToScVal(v);
}

export function toScValU64(v: string | bigint) {
  return nativeToScVal(v, { type: "u64" });
}

export function toScValI64(v: string | bigint) {
  return nativeToScVal(v, { type: "i64" });
}

export function toScValSymbol(v: string) {
  return nativeToScVal(v, { type: "symbol" });
}
