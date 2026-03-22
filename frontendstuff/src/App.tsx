import './App.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { TokenInfo } from './components/TokenInfo'
import { FaucetCard } from './components/FaucetCard'
import { TransferCard } from './components/TransferCard'
import { MintCard } from './components/MintCard'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Tokenomics } from './components/Tokenomics'
import { Footer } from './components/Footer'

function App() {
  const { isConnected } = useAccount()

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <img 
            src="https://raw.githubusercontent.com/ANAVHEOBA/erc20assignment/main/logo.png" 
            alt="BridgeToken Logo" 
            className="logo-image"
          />
          <span className="logo-text">BridgeToken</span>
        </div>
        <ConnectButton />
      </header>
      
      <div className="stars-container">
        <div className="stars"></div>
        <div className="stars2"></div>
        <div className="stars3"></div>
      </div>

      {!isConnected ? (
        <>
          <Hero />
          <About />
          <Tokenomics />
        </>
      ) : (
        <main className="main-content">
          <div className="dashboard-grid">
            <TokenInfo />
            <FaucetCard />
            <TransferCard />
            <MintCard />
          </div>
        </main>
      )}
      <Footer />
    </div>
  )
}

export default App
