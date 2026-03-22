"use client";

import { useWeb3Wagmi } from "@/hooks/useWeb3Wagmi";
import { useMintToken, useOwnerInfo, useSupplyInfo } from "@/hooks";
import { useState, useEffect } from "react";
import { isValidAddress, isValidAmount, formatNumber } from "@/lib/utils";

export function MintCard() {
  const { contract, account, isConnected, isCorrectNetwork } = useWeb3Wagmi();
  const { mint, loading, error, txHash, reset } = useMintToken(contract);
  const { isOwner } = useOwnerInfo(contract, account);
  const { supplyInfo, refetch } = useSupplyInfo(contract);
  
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleMint = async () => {
    if (!isValidAddress(recipient)) {
      return;
    }
    if (!isValidAmount(amount)) {
      return;
    }

    reset();
    const receipt = await mint(recipient, amount);
    if (receipt) {
      setShowSuccess(true);
      setRecipient("");
      setAmount("");
      refetch();
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  const setMaxMintable = () => {
    setAmount(supplyInfo.remainingMintable);
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

  if (!isOwner) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
            <svg className="w-8 h-8 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Owner Only</h3>
          <p className="text-zinc-600 dark:text-zinc-400">Only the contract owner can mint new tokens</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Mint Tokens</h3>
            <span className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-medium">
              Owner
            </span>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Create new tokens up to max supply</p>
        </div>
      </div>

      {/* Supply Info */}
      <div className="mb-6 p-4 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-900 dark:text-purple-100">Remaining Mintable</span>
          <span className="text-lg font-bold text-purple-900 dark:text-purple-100">
            {formatNumber(supplyInfo.remainingMintable)} BRG
          </span>
        </div>
        <div className="mt-2">
          <div className="h-2 bg-purple-200 dark:bg-purple-900/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all"
              style={{ width: `${supplyInfo.supplyPercentage}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-purple-700 dark:text-purple-300">
            {supplyInfo.supplyPercentage.toFixed(2)}% of max supply minted
          </p>
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
                Tokens minted successfully!
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
            className="w-full px-4 py-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
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
              onClick={setMaxMintable}
              className="text-xs font-medium text-purple-600 dark:text-purple-400 hover:underline"
            >
              Max: {formatNumber(supplyInfo.remainingMintable)} BRG
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
              className="w-full px-4 py-3 pr-16 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-zinc-500 dark:text-zinc-400">
              BRG
            </div>
          </div>
          {amount && !isValidAmount(amount) && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">Amount must be greater than 0</p>
          )}
        </div>

        {/* Mint Button */}
        <button
          onClick={handleMint}
          disabled={loading || !recipient || !amount || !isValidAddress(recipient) || !isValidAmount(amount)}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-purple-500 disabled:hover:to-pink-600 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Minting...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Mint Tokens</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
