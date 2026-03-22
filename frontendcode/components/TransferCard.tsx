"use client";

import { useWeb3Wagmi } from "@/hooks/useWeb3Wagmi";
import { useTransferToken, useTokenBalance } from "@/hooks";
import { useState, useEffect } from "react";
import { isValidAddress, isValidAmount, formatAddress } from "@/lib/utils";

export function TransferCard() {
  const { contract, account, isConnected, isCorrectNetwork } = useWeb3Wagmi();
  const { transfer, loading, error, txHash, reset } = useTransferToken(contract);
  const { balance, refetch } = useTokenBalance(contract, account);
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleTransfer = async () => {
    if (!isValidAddress(recipient)) {
      return;
    }
    if (!isValidAmount(amount)) {
      return;
    }

    reset();
    const receipt = await transfer(recipient, amount);
    if (receipt) {
      setShowSuccess(true);
      setRecipient("");
      setAmount("");
      refetch();
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const setMaxAmount = () => {
    setAmount(balance);
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(reset, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, reset]);

  if (!isConnected || !isCorrectNetwork) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Transfer Tokens</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Send BRG to another address</p>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="mb-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-green-900 dark:text-green-100">
                Transfer successful!
              </p>
              {txHash && (
                <a 
                  href={`https://sepolia-blockscout.lisk.com/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-green-700 dark:text-green-400 hover:underline mt-1 inline-block"
                >
                  View transaction →
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-red-900 dark:text-red-100">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="space-y-4">
        {/* Recipient Address */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Recipient Address
          </label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          />
          {recipient && !isValidAddress(recipient) && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">Invalid address format</p>
          )}
        </div>

        {/* Amount */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Amount
            </label>
            <button
              onClick={setMaxAmount}
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              Max: {balance} BRG
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.0"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 pr-16 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              BRG
            </div>
          </div>
          {amount && !isValidAmount(amount) && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">Amount must be greater than 0</p>
          )}
        </div>

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={loading || !recipient || !amount || !isValidAddress(recipient) || !isValidAmount(amount)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-green-500 disabled:hover:to-emerald-600 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              <span>Send Tokens</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
