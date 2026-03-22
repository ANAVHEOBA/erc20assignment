"use client";

import { useState, useEffect, useCallback } from "react";
import { Contract, formatEther } from "ethers";

/**
 * Hook for reading allowance
 * READ FUNCTION: allowance (bonus)
 */
export function useAllowance(
  contract: Contract | null,
  owner: string | null,
  spender: string | null
) {
  const [allowance, setAllowance] = useState<string>("0");
  const [allowanceRaw, setAllowanceRaw] = useState<bigint>(BigInt(0));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllowance = useCallback(async () => {
    if (!contract || !owner || !spender) {
      setAllowance("0");
      setAllowanceRaw(BigInt(0));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const allow = await contract.allowance(owner, spender);
      setAllowanceRaw(allow);
      setAllowance(formatEther(allow));
    } catch (err) {
      console.error("Error fetching allowance:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch allowance");
      setAllowance("0");
      setAllowanceRaw(BigInt(0));
    } finally {
      setLoading(false);
    }
  }, [contract, owner, spender]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  return {
    allowance,
    allowanceRaw,
    loading,
    error,
    refetch: fetchAllowance,
  };
}
