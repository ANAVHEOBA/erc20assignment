"use client";

import { useWeb3 } from "@/hooks";
import { formatAddress } from "@/lib/utils";
import { NETWORK_CONFIG } from "@/lib/constants";

export function Navbar() {
  const { account, isConnected, isCorrectNetwork, connect, disconnect, switchNetwork, isConnecting } = useWeb3();

  return (
    <nav className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900 dark:text-white">BridgeToken</h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">BRG Faucet</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Network indicator */}
            {isConnected && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-zinc-700 dark:text-zinc-300">
                  {isCorrectNetwork ? NETWORK_CONFIG.name : 'Wrong Network'}
                </span>
              </div>
            )}

            {/* Switch network button */}
            {isConnected && !isCorrectNetwork && (
              <button
                onClick={switchNetwork}
                className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
              >
                Switch Network
              </button>
            )}

            {/* Connect/Disconnect button */}
            {isConnected ? (
              <button
                onClick={disconnect}
                className="px-4 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="hidden sm:inline">{formatAddress(account || '')}</span>
                <span className="sm:hidden">Connected</span>
              </button>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
