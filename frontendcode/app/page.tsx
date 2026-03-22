"use client";

import { NavbarRainbow } from "@/components/NavbarRainbow";
import { BalanceCard, FaucetCard, TransferCard, MintCard, StatsCard, Footer } from "@/components";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <NavbarRainbow />
      
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-zinc-900 mb-3">
            Welcome to <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">BridgeToken</span>
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto px-4">
            Claim free BRG tokens every 24 hours from our faucet. Transfer, mint, and manage your tokens on Lisk Sepolia Testnet.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6">
          {/* Left Column - Balance */}
          <div className="lg:col-span-1">
            <BalanceCard />
          </div>

          {/* Middle Column - Faucet */}
          <div className="lg:col-span-2">
            <FaucetCard />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-6">
          <StatsCard />
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {/* Transfer Card */}
          <TransferCard />

          {/* Mint Card */}
          <MintCard />
        </div>
      </main>

      <Footer />
    </div>
  );
}
