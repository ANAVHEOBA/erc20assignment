"use client";

import { useState, useEffect, useCallback } from "react";
import { Contract, formatEther } from "ethers";

/**
 * Hook for reading token balance
 * READ FUNCTION #1: balanceOf
 */
export function useTokenBalance(contract: Contract | null, address: string | null) {
  const [balance, setBalance] = useState<string>("0");
  const [balanceRaw, setBalanceRaw] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!contract || !address) {
      setBalance("0");
      setBalanceRaw(BigInt(0));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bal = await contract.balanceOf(address);
      setBalanceRaw(bal);
      setBalance(formatEther(bal));
    } catch (err) {
      console.error("Error fetching balance:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
      setBalance("0");
      setBalanceRaw(BigInt(0));
    } finally {
      setLoading(false);
    }
  }, [contract, address]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    balanceRaw,
    loading,
    error,
    refetch: fetchBalance,
  };
}
