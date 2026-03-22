"use client";

import { useWeb3Wagmi } from "@/hooks/useWeb3Wagmi";
import { useSupplyInfo, useTokenInfo } from "@/hooks";
import { formatNumber, formatTokenAmount } from "@/lib/utils";

export function StatsCard() {
  const { contract, isConnected } = useWeb3Wagmi();
  const { supplyInfo, loading: supplyLoading } = useSupplyInfo(contract);
  const { tokenInfo, loading: infoLoading } = useTokenInfo(contract);

  const loading = supplyLoading || infoLoading;

  const stats = [
    {
      label: "Total Supply",
      value: formatNumber(supplyInfo.totalSupply),
      subValue: `${formatTokenAmount(supplyInfo.totalSupply, 2)} BRG`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Total Minted",
      value: formatNumber(supplyInfo.totalMinted),
      subValue: `${supplyInfo.supplyPercentage.toFixed(2)}% of max`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Remaining Mintable",
      value: formatNumber(supplyInfo.remainingMintable),
      subValue: `${formatTokenAmount(supplyInfo.remainingMintable, 2)} BRG`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      color: "from-green-500 to-emerald-500",
    },
    {
      label: "Max Supply",
      value: formatNumber(supplyInfo.maxSupply),
      subValue: `${formatTokenAmount(supplyInfo.maxSupply, 0)} BRG`,
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-orange-500 to-red-500",
    },
  ];

  if (!isConnected) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6">
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-6">Token Statistics</h3>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-zinc-100 dark:bg-zinc-800 rounded-xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white`}>
                  {stat.icon}
                </div>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-white mb-1">{stat.value}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">{stat.subValue}</p>
            </div>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {!loading && (
        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Minting Progress</span>
            <span className="text-sm font-bold text-zinc-900 dark:text-white">
              {supplyInfo.supplyPercentage.toFixed(2)}%
            </span>
          </div>
          <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${Math.min(100, supplyInfo.supplyPercentage)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span>0 BRG</span>
            <span>{formatNumber(tokenInfo.maxSupply, 0)} BRG</span>
          </div>
        </div>
      )}
    </div>
  );
}
