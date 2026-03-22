"use client";

import { useState, useCallback } from "react";
import { Contract, parseEther } from "ethers";

/**
 * Hook for transferring tokens
 * WRITE FUNCTION #3: transfer (REQUIRED)
 */
export function useTransferToken(contract: Contract | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const transfer = useCallback(
    async (toAddress: string, amount: string) => {
      if (!contract) {
        setError("Contract not initialized");
        return null;
      }

      if (!toAddress || !amount) {
        setError("Please provide address and amount");
        return null;
      }

      setLoading(true);
      setError(null);
      setTxHash(null);

      try {
        // Validate address
        if (!/^0x[a-fA-F0-9]{40}$/.test(toAddress)) {
          throw new Error("Invalid address format");
        }

        // Parse amount
        const amountWei = parseEther(amount);

        if (amountWei <= 0) {
          throw new Error("Amount must be greater than 0");
        }

        const tx = await contract.transfer(toAddress, amountWei);
        setTxHash(tx.hash);

        const receipt = await tx.wait();

        if (receipt.status === 0) {
          throw new Error("Transaction failed");
        }

        return receipt;
      } catch (err: any) {
        console.error("Error transferring tokens:", err);

        // Parse error messages
        let errorMessage = "Failed to transfer tokens";
        if (err.message) {
          if (err.message.includes("transfer amount exceeds balance")) {
            errorMessage = "Insufficient balance";
          } else if (err.message.includes("transfer to the zero address")) {
            errorMessage = "Cannot transfer to zero address";
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
    transfer,
    loading,
    error,
    txHash,
    reset,
  };
}
