"use client";

import { useState, useEffect, useCallback } from "react";
import { Contract, formatEther } from "ethers";

interface SupplyInfo {
  totalSupply: string;
  totalSupplyRaw: bigint;
  totalMinted: string;
  totalMintedRaw: bigint;
  remainingMintable: string;
  remainingMintableRaw: bigint;
  maxSupply: string;
  maxSupplyRaw: bigint;
  supplyPercentage: number;
}

/**
 * Hook for reading supply information
 * READ FUNCTIONS #2, #4: totalSupply, totalMinted, remainingMintableSupply, MAX_SUPPLY
 */
export function useSupplyInfo(contract: Contract | null) {
  const [supplyInfo, setSupplyInfo] = useState<SupplyInfo>({
    totalSupply: "0",
    totalSupplyRaw: BigInt(0),
    totalMinted: "0",
    totalMintedRaw: BigInt(0),
    remainingMintable: "0",
    remainingMintableRaw: BigInt(0),
    maxSupply: "0",
    maxSupplyRaw: BigInt(0),
    supplyPercentage: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSupplyInfo = useCallback(async () => {
    if (!contract) return;

    setLoading(true);
    setError(null);

    try {
      const [totalSupply, totalMinted, remainingMintable, maxSupply] = await Promise.all([
        contract.totalSupply(),
        contract.totalMinted(),
        contract.remainingMintableSupply(),
        contract.MAX_SUPPLY(),
      ]);

      const supplyPercentage = maxSupply > 0 
        ? Number((totalMinted * BigInt(10000)) / maxSupply) / 100 
        : 0;

      setSupplyInfo({
        totalSupply: formatEther(totalSupply),
        totalSupplyRaw: totalSupply,
        totalMinted: formatEther(totalMinted),
        totalMintedRaw: totalMinted,
        remainingMintable: formatEther(remainingMintable),
        remainingMintableRaw: remainingMintable,
        maxSupply: formatEther(maxSupply),
        maxSupplyRaw: maxSupply,
        supplyPercentage,
      });
    } catch (err) {
      console.error("Error fetching supply info:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch supply info");
    } finally {
      setLoading(false);
    }
  }, [contract]);

  useEffect(() => {
    fetchSupplyInfo();
  }, [fetchSupplyInfo]);

  return {
    supplyInfo,
    loading,
    error,
    refetch: fetchSupplyInfo,
  };
}
