"use client";

import { useState, useEffect, useCallback } from "react";
import { Contract } from "ethers";

/**
 * Hook for reading owner information
 * READ FUNCTION #5: owner
 */
export function useOwnerInfo(contract: Contract | null, userAddress: string | null) {
  const [owner, setOwner] = useState<string>("");
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOwner = useCallback(async () => {
    if (!contract) return;

    setLoading(true);
    setError(null);

    try {
      const ownerAddress = await contract.owner();
      setOwner(ownerAddress);
      setIsOwner(
        userAddress ? ownerAddress.toLowerCase() === userAddress.toLowerCase() : false
      );
    } catch (err) {
      console.error("Error fetching owner:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch owner");
      setOwner("");
      setIsOwner(false);
    } finally {
      setLoading(false);
    }
  }, [contract, userAddress]);

  useEffect(() => {
    fetchOwner();
  }, [fetchOwner]);

  return {
    owner,
    isOwner,
    loading,
    error,
    refetch: fetchOwner,
  };
}
