"use client";

import { CONTRACT_ADDRESS, NETWORK_CONFIG, LINKS } from "@/lib/constants";
import { formatAddress, copyToClipboard } from "@/lib/utils";
import { useState } from "react";

export function Footer() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(CONTRACT_ADDRESS);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">About BridgeToken</h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
              A secure ERC20 token with faucet functionality deployed on Lisk Sepolia Testnet. Claim 100 BRG every 24 hours.
            </p>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">Contract:</span>
              <button
                onClick={handleCopy}
                className="text-xs font-mono text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                {formatAddress(CONTRACT_ADDRESS, 6)}
                {copied ? (
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Resources</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={LINKS.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  View on Explorer
                </a>
              </li>
              <li>
                <a
                  href={LINKS.faucet}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Get Testnet ETH
                </a>
              </li>
              <li>
                <a
                  href={LINKS.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                  GitHub
                </a>
              </li>
            </ul>
          </div>

          {/* Network Info */}
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-white mb-3">Network</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Name</span>
                <span className="font-medium text-zinc-900 dark:text-white">{NETWORK_CONFIG.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Chain ID</span>
                <span className="font-medium text-zinc-900 dark:text-white">{NETWORK_CONFIG.chainId}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-600 dark:text-zinc-400">Currency</span>
                <span className="font-medium text-zinc-900 dark:text-white">{NETWORK_CONFIG.nativeCurrency.symbol}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              © 2026 BridgeToken. Built with Next.js & Ethers.js
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://docs.lisk.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Lisk Docs
              </a>
              <a
                href="https://docs.ethers.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Ethers.js
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
