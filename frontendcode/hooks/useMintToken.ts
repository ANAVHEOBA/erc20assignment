"use client";

import { useState, useCallback } from "react";
import { Contract, parseEther } from "ethers";

/**
 * Hook for minting tokens (owner only)
 * WRITE FUNCTION #2: mint (REQUIRED)
 */
export function useMintToken(contract: Contract | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);

  const mint = useCallback(
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

        const tx = await contract.mint(toAddress, amountWei);
        setTxHash(tx.hash);

        const receipt = await tx.wait();

        if (receipt.status === 0) {
          throw new Error("Transaction failed");
        }

        return receipt;
      } catch (err: any) {
        console.error("Error minting tokens:", err);

        // Parse error messages
        let errorMessage = "Failed to mint tokens";
        if (err.message) {
          if (err.message.includes("Ownable: caller is not the owner")) {
            errorMessage = "Only the contract owner can mint tokens";
          } else if (err.message.includes("Minting would exceed MAX_SUPPLY")) {
            errorMessage = "Minting would exceed maximum supply";
          } else if (err.message.includes("Cannot mint to zero address")) {
            errorMessage = "Cannot mint to zero address";
          } else if (err.message.includes("Cannot mint zero amount")) {
            errorMessage = "Amount must be greater than 0";
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
    mint,
    loading,
    error,
    txHash,
    reset,
  };
}
