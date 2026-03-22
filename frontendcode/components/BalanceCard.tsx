"use client";

import { useWeb3Wagmi } from "@/hooks/useWeb3Wagmi";
import { useTokenBalance, useTokenInfo } from "@/hooks";
import { formatTokenAmount, formatNumber } from "@/lib/utils";

export function BalanceCard() {
  const { contract, account, isConnected } = useWeb3Wagmi();
  const { balance, loading: balanceLoading } = useTokenBalance(contract, account);
  const { tokenInfo, loading: infoLoading } = useTokenInfo(contract);

  const loading = balanceLoading || infoLoading;

  if (!isConnected) {
    return (
      <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm h-full">
        <div className="text-center py-6">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-zinc-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <p className="text-sm text-zinc-600">Connect wallet to view balance</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white shadow-lg h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium opacity-90">Your Balance</h3>
        <div className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm">
          <span className="text-xs font-medium">{tokenInfo.symbol}</span>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse">
          <div className="h-10 bg-white/20 rounded-lg mb-2" />
          <div className="h-3 bg-white/20 rounded w-24" />
        </div>
      ) : (
        <>
          <div className="mb-2">
            <p className="text-3xl font-bold tracking-tight">
              {formatNumber(balance, 2)}
            </p>
          </div>
          <p className="text-sm opacity-75">
            {formatTokenAmount(balance, 6)} {tokenInfo.symbol}
          </p>
        </>
      )}

      <div className="mt-4 pt-3 border-t border-white/30">
        <div className="flex items-center justify-between text-sm">
          <span className="opacity-90">Token</span>
          <span className="font-medium">{tokenInfo.name}</span>
        </div>
      </div>
    </div>
  );
}
