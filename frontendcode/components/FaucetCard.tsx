"use client";

import { useWeb3Wagmi } from "@/hooks/useWeb3Wagmi";
import { useRequestToken, useFaucetCooldown, useTokenInfo } from "@/hooks";
import { useState, useEffect } from "react";

export function FaucetCard() {
  const { contract, account, isConnected, isCorrectNetwork } = useWeb3Wagmi();
  const { requestToken, loading, error, txHash, reset } = useRequestToken(contract);
  const { cooldownInfo, refetch } = useFaucetCooldown(contract, account);
  const { tokenInfo } = useTokenInfo(contract);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleRequest = async () => {
    reset();
    const receipt = await requestToken();
    if (receipt) {
      setShowSuccess(true);
      refetch();
      setTimeout(() => setShowSuccess(false), 5000);
    }
  };

  useEffect(() => {
    if (error) {
      const timer = setTimeout(reset, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, reset]);

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Token Faucet</h3>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">Connect your wallet to claim free tokens</p>
        </div>
      </div>
    );
  }

  if (!isCorrectNetwork) {
    return (
      <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-orange-200 dark:border-orange-800 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Wrong Network</h3>
          <p className="text-zinc-600 dark:text-zinc-400">Please switch to Lisk Sepolia to use the faucet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Token Faucet</h3>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Claim {tokenInfo.faucetAmount} {tokenInfo.symbol} every 24 hours</p>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="mb-6 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Cooldown Status</span>
          {cooldownInfo.canRequest ? (
            <span className="px-2 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium">
              Ready
            </span>
          ) : (
            <span className="px-2 py-1 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-medium">
              Cooling Down
            </span>
          )}
        </div>
        <div className="text-2xl font-bold text-zinc-900 dark:text-white">
          {cooldownInfo.formattedTime}
        </div>
        {!cooldownInfo.canRequest && (
          <div className="mt-3">
            <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-1000"
                style={{ 
                  width: `${Math.max(0, 100 - (cooldownInfo.timeRemaining / 86400) * 100)}%` 
                }}
              />
            </div>
          </div>
        )}
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
                Successfully claimed {tokenInfo.faucetAmount} {tokenInfo.symbol}!
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

      {/* Claim Button */}
      <button
        onClick={handleRequest}
        disabled={!cooldownInfo.canRequest || loading}
        className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-500 disabled:hover:to-purple-600 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Claiming...</span>
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Claim {tokenInfo.faucetAmount} {tokenInfo.symbol}</span>
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-center text-zinc-500 dark:text-zinc-400">
        You can claim tokens once every 24 hours
      </p>
    </div>
  );
}
