import './Hero.css';
import heroFrog from '../assets/hero-frog.png';
import { useAccount } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';

export function Hero() {
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  const handleReceiveClick = () => {
    if (!isConnected && openConnectModal) {
      openConnectModal();
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-section">
      <div className="hero-content">
        <h1 className="hero-title">$BRIDGR</h1>
        <p className="hero-description">
          The most connected memecoin in existence. The maximalists have had their day, it's time for BRIDGR to connect the chains.
        </p>
        <div className="hero-actions">
          <button className="buy-button" onClick={handleReceiveClick}>
            Receive Now
          </button>
        </div>
      </div>
      <div className="hero-image-container">
        <img src={heroFrog} alt="BRIDGR the frog sitting on a cosmic bridge" className="hero-image" />
      </div>
    </section>
  );
}
