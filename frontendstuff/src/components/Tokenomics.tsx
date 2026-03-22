import './Tokenomics.css';
import tokenomicsFrog from '../assets/tokenomics-frog.png';

export function Tokenomics() {
  return (
    <section className="tokenomics-section" id="tokenomics">
      <h2 className="tokenomics-title">TOKENOMICS</h2>
      
      <div className="tokenomics-content">
        <div className="tokenomics-stats">
          <h3>Token Supply:</h3>
          <p className="supply-number">10,000,000</p>
          
          <div className="tokenomics-details">
            <p>No Taxes, No Bullshit. It's that simple.</p>
            <p>Daily faucet is enabled, ready for bridging.</p>
          </div>
        </div>
        
        <div className="tokenomics-image-container">
          <img src={tokenomicsFrog} alt="BRIDGR Tokenomics" className="tokenomics-image" />
        </div>
      </div>
    </section>
  );
}
