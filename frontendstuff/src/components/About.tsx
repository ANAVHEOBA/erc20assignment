import './About.css';
import aboutFrog from '../assets/about-frog.png';

export function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-image-container">
        <img src={aboutFrog} alt="BRIDGR pointing at a bridge blueprint" className="about-image" />
      </div>
      <div className="about-content">
        <h2 className="about-title">about</h2>
        <div className="about-text">
          <p>
            BRIDGR is tired of watching everyone play hot potato with the endless derivative ShibaCumGMElonKishuTurboAssFlokiMoon Inu coins. The Inu's have had their day. It's time for the most connected frog in the multiverse to take his reign as the ultimate bridge builder.
          </p>
          <p>
            BRIDGR is here to make cross-chain great again. Launched stealth with a 10M supply, a daily zero-fee faucet, and zero taxes, $BRIDGR is a coin for everyone, regardless of what chain they call home. Fueled by pure memetic bridging power, let $BRIDGR show you the way.
          </p>
        </div>
      </div>
    </section>
  );
}
