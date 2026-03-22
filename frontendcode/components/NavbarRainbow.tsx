"use client";

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useWeb3Wagmi } from '@/hooks/useWeb3Wagmi';
import { NETWORK_CONFIG } from '@/lib/constants';

export function NavbarRainbow() {
  const { isConnected, isCorrectNetwork } = useWeb3Wagmi();

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">BridgeToken</h1>
              <p className="text-xs text-zinc-500">BRG Faucet</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Network indicator */}
            {isConnected && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-100">
                <div className={`w-2 h-2 rounded-full ${isCorrectNetwork ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className="text-sm text-zinc-700">
                  {isCorrectNetwork ? NETWORK_CONFIG.name : 'Wrong Network'}
                </span>
              </div>
            )}

            {/* RainbowKit Connect Button */}
            <ConnectButton 
              chainStatus="icon"
              showBalance={false}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
