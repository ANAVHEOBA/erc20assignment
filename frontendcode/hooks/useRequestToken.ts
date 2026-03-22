"use client";

import { useState, useCallback } from "react";
import { Contract } from "ethers";

/**
 * Hook for requesting tokens from faucet
 * WRITE FUNCTION #1: requestToken (REQUIRED)
 */
export function useRequestToken(contract: Contract | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const requestToken = useCallback(async () => {
    if (!contract) {
      setError("Contract not initialized");
      return null;
    }

    setLoading(true);
    setError(null);
    setTxHash(null);

    try {
      const tx = await contract.requestToken();
      setTxHash(tx.hash);

      const receipt = await tx.wait();

      if (receipt.status === 0) {
        throw new Error("Transaction failed");
      }

      return receipt;
    } catch (err: any) {
      console.error("Error requesting tokens:", err);

      // Parse error messages
      let errorMessage = "Failed to request tokens";
      if (err.message) {
        if (err.message.includes("Cooldown period not elapsed")) {
          errorMessage = "Please wait for the cooldown period to end";
        } else if (err.message.includes("Faucet is empty")) {
          errorMessage = "Faucet is currently empty. Please try again later";
        } else if (err.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected";
        } else {
          errorMessage = err.message;
        }
      }

      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract]);

  const reset = useCallback(() => {
    setError(null);
    setTxHash(null);
  }, []);

  return {
    requestToken,
    loading,
    error,
    txHash,
    reset,
  };
}
