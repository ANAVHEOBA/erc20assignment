"use client";

import { useState, useCallback } from "react";
import { Contract, parseEther } from "ethers";

/**
 * Hook for approving token spending
 * WRITE FUNCTION (BONUS): approve
 */
export function useApprove(contract: Contract | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const approve = useCallback(
    async (spenderAddress: string, amount: string) => {
      if (!contract) {
        setError("Contract not initialized");
        return null;
      }

      if (!spenderAddress || !amount) {
        setError("Please provide spender address and amount");
        return null;
      }

      setLoading(true);
      setError(null);
      setTxHash(null);

      try {
        // Validate address
        if (!/^0x[a-fA-F0-9]{40}$/.test(spenderAddress)) {
          throw new Error("Invalid spender address format");
        }

        // Parse amount
        const amountWei = parseEther(amount);

        const tx = await contract.approve(spenderAddress, amountWei);
        setTxHash(tx.hash);

        const receipt = await tx.wait();

        if (receipt.status === 0) {
          throw new Error("Transaction failed");
        }

        return receipt;
      } catch (err: any) {
        console.error("Error approving tokens:", err);

        let errorMessage = "Failed to approve tokens";
        if (err.message) {
          if (err.message.includes("approve to the zero address")) {
            errorMessage = "Cannot approve zero address";
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
    approve,
    loading,
    error,
    txHash,
    reset,
  };
}
