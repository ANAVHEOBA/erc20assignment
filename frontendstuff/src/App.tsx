import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { TokenInfo } from './components/TokenInfo'
import { FaucetCard } from './components/FaucetCard'
import { TransferCard } from './components/TransferCard'
import { MintCard } from './components/MintCard'

function App() {
  const { isConnected } = useAccount()

  return (
    <div className="app">
      <header className="header">
        <div className="logo">BridgeToken</div>
        <ConnectButton />
      </header>
      <main className="main-content">
        {isConnected ? (
          <>
            <TokenInfo />
            <FaucetCard />
            <TransferCard />
            <MintCard />
          </>
        ) : (
          <div className="connect-prompt">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 44c-11.028 0-20-8.972-20-20s8.972-20 20-20 20 8.972 20 20-8.972 20-20 20z" fill="#d1d5db"/>
              <path d="M32 24c-1.105 0-2 .895-2 2v12c0 1.105.895 2 2 2s2-.895 2-2V26c0-1.105-.895-2-2-2zm0 20c-1.105 0-2 .895-2 2s.895 2 2 2 2-.895 2-2-.895-2-2-2z" fill="#d1d5db"/>
            </svg>
            <h2>Connect Your Wallet</h2>
            <p>Connect your wallet to view your token balance and interact with BridgeToken</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
