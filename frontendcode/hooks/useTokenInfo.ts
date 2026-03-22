"use client";

import { useState, useEffect, useCallback } from "react";
import { Contract, formatEther } from "ethers";

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  totalSupplyRaw: bigint;
  maxSupply: string;
  maxSupplyRaw: bigint;
  faucetAmount: string;
  faucetAmountRaw: bigint;
  cooldownTime: number;
}

/**
 * Hook for reading token information
 * READ FUNCTIONS: name, symbol, decimals, totalSupply, MAX_SUPPLY, FAUCET_AMOUNT, COOLDOWN_TIME
 */
export function useTokenInfo(contract: Contract | null) {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    name: "",
    symbol: "",
    decimals: 18,
    totalSupply: "0",
    totalSupplyRaw: BigInt(0),
    maxSupply: "0",
    maxSupplyRaw: BigInt(0),
    faucetAmount: "0",
    faucetAmountRaw: BigInt(0),
    cooldownTime: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenInfo = useCallback(async () => {
    if (!contract) return;

    setLoading(true);
    setError(null);

    try {
      const [name, symbol, decimals, totalSupply, maxSupply, faucetAmount, cooldownTime] =
        await Promise.all([
          contract.name(),
          contract.symbol(),
          contract.decimals(),
          contract.totalSupply(),
          contract.MAX_SUPPLY(),
          contract.FAUCET_AMOUNT(),
          contract.COOLDOWN_TIME(),
        ]);

      setTokenInfo({
        name,
        symbol,
        decimals: Number(decimals),
        totalSupply: formatEther(totalSupply),
        totalSupplyRaw: totalSupply,
        maxSupply: formatEther(maxSupply),
        maxSupplyRaw: maxSupply,
        faucetAmount: formatEther(faucetAmount),
        faucetAmountRaw: faucetAmount,
        cooldownTime: Number(cooldownTime),
      });
    } catch (err) {
      console.error("Error fetching token info:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch token info");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    fetchTokenInfo();
  }, [fetchTokenInfo]);

  return {
    tokenInfo,
    loading,
    error,
    refetch: fetchTokenInfo,
  };
}
