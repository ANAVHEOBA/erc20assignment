"use client";

import { useState, useCallback } from "react";
import { Contract, parseEther } from "ethers";

/**
 * Hook for burning tokens
 * WRITE FUNCTION (BONUS): burn
 */
export function useBurnToken(contract: Contract | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const burn = useCallback(
    async (amount: string) => {
      if (!contract) {
        setError("Contract not initialized");
        return null;
      }

      if (!amount) {
        setError("Please provide amount to burn");
        return null;
      }

      setLoading(true);
      setError(null);
      setTxHash(null);

      try {
        // Parse amount
        const amountWei = parseEther(amount);

        if (amountWei <= 0) {
          throw new Error("Amount must be greater than 0");
        }

        const tx = await contract.burn(amountWei);
        setTxHash(tx.hash);

        const receipt = await tx.wait();

        if (receipt.status === 0) {
          throw new Error("Transaction failed");
        }

        return receipt;
      } catch (err: any) {
        console.error("Error burning tokens:", err);

        let errorMessage = "Failed to burn tokens";
        if (err.message) {
          if (err.message.includes("burn amount exceeds balance")) {
            errorMessage = "Insufficient balance to burn";
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
    },
    [contract]
  );

  const reset = useCallback(() => {
    setError(null);
    setTxHash(null);
  }, []);

  return {
    burn,
    loading,
    error,
    txHash,
    reset,
  };
}
