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
  const { publicKey, signTransaction, isDemo } = useWallet();
  const clientRef = useRef<Client | null>(null);

  const getClientInstance = useCallback(() => {
    if (!clientRef.current || clientRef.current.options.publicKey !== publicKey) {
      clientRef.current = getClient(publicKey, signTransaction);
    }
    return clientRef.current;
  }, [publicKey, signTransaction]);

  const initContract = useCallback(async () => {
    if (isDemo) return null;
    const client = getClientInstance();
    const tx = await client.init();
    if (publicKey) {
      const result = await tx.signAndSend();
      return result.result;
    }
    return null;
  }, [getClientInstance, publicKey, isDemo]);

  const recordDistribution = useCallback(
    async (
      donor: string,
      totalAmount: bigint,
      beneficiaries: string,
      txHash: string
    ) => {
      if (isDemo) {
        // Save mock transaction to local storage
        const savedTxList = localStorage.getItem("zakatchain_demo_distributions");
        const list = savedTxList ? JSON.parse(savedTxList) : [];
        const newTx = {
          date: new Date().toISOString().split("T")[0],
          type: "Distribution",
          amount: totalAmount.toString(), // Store as string representation of cents
          beneficiaries,
          txHash,
          status: "success",
        };
        list.unshift(newTx);
        localStorage.setItem("zakatchain_demo_distributions", JSON.stringify(list));
        return { result: null };
      }

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
    [getClientInstance, isDemo]
  );

  const getDonorTotal = useCallback(
    async (donor: string): Promise<bigint> => {
      if (isDemo) {
        const savedTxList = localStorage.getItem("zakatchain_demo_distributions");
        const list = savedTxList ? JSON.parse(savedTxList) : [];
        const sum = list.reduce((acc: number, item: any) => {
          return acc + Number(item.amount);
        }, 0);
        return BigInt(sum);
      }
      const client = getClientInstance();
      const tx = await client.get_donor_total({ donor });
      return tx.result;
    },
    [getClientInstance, isDemo]
  );

  const getTotalDistributed = useCallback(async (): Promise<bigint> => {
    if (isDemo) {
      const savedTxList = localStorage.getItem("zakatchain_demo_distributions");
      const list = savedTxList ? JSON.parse(savedTxList) : [];
      const sum = list.reduce((acc: number, item: any) => acc + Number(item.amount), 0);
      // Start with a mock base of $42,500.00 (in cents = 4250000)
      return BigInt(4250000 + sum);
    }
    const client = getClientInstance();
    const tx = await client.get_total_distributed();
    return tx.result;
  }, [getClientInstance, isDemo]);

  const getDonorCount = useCallback(async (): Promise<bigint> => {
    if (isDemo) {
      // 12 mock base + 1 if demo user has distributed
      const savedTxList = localStorage.getItem("zakatchain_demo_distributions");
      const list = savedTxList ? JSON.parse(savedTxList) : [];
      const hasDistributed = list.length > 0 ? 1 : 0;
      return BigInt(12 + hasDistributed);
    }
    const client = getClientInstance();
    const tx = await client.get_donor_count();
    return tx.result;
  }, [getClientInstance, isDemo]);

  const getBeneficiaryCount = useCallback(async (): Promise<bigint> => {
    if (isDemo) {
      // 88 mock base + count of transactions
      const savedTxList = localStorage.getItem("zakatchain_demo_distributions");
      const list = savedTxList ? JSON.parse(savedTxList) : [];
      return BigInt(88 + list.length);
    }
    const client = getClientInstance();
    const tx = await client.get_beneficiary_count();
    return tx.result;
  }, [getClientInstance, isDemo]);

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
