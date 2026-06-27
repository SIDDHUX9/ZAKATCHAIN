"use client";

import { useWallet } from "@/context/WalletContext";
import { nativeToScVal, scValToNative } from "@stellar/stellar-sdk";
import { useCallback } from "react";

// ScVal converter helpers
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

export function useContract() {
  const wallet = useWallet();

  const initContract = useCallback(async () => {
    return wallet.callContract("init", []);
  }, [wallet]);

  const recordZakatDistribution = useCallback(
    async (
      donor: string,
      totalAmount: string,
      beneficiaries: string,
      txHash: string
    ) => {
      return wallet.callContract(
        "record_distribution",
        [
          toScValAddress(donor),
          toScValI128(totalAmount),
          toScValString(beneficiaries),
          toScValString(txHash),
        ],
        donor
      );
    },
    [wallet]
  );

  const getDonorTotal = useCallback(
    async (donor: string) => {
      const result = await wallet.readContract("get_donor_total", [
        toScValAddress(donor),
      ]);
      return result !== null && result !== undefined ? result : 0;
    },
    [wallet]
  );

  const getPlatformStats = useCallback(async () => {
    const totalDistributed = await wallet.readContract("get_total_distributed", []);
    const donorCount = await wallet.readContract("get_donor_count", []);
    const beneficiaryCount = await wallet.readContract("get_beneficiary_count", []);
    return {
      totalDistributed: totalDistributed || 0,
      donorCount: donorCount || 0,
      beneficiaryCount: beneficiaryCount || 0,
    };
  }, [wallet]);

  return {
    initContract,
    recordZakatDistribution,
    getDonorTotal,
    getPlatformStats,
    contractAddress: "",
  };
}
