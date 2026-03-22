import './Footer.css';
import heroFrog from '../assets/hero-frog.png';

export function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-top">
          <img src={heroFrog} alt="BRIDGR Logo" className="footer-logo" />
        </div>

        <div className="footer-disclaimer">
          <p>
            $BRIDGR coin has no association with any bridge engineers, civil planners, or real-world infrastructure. This token is simply paying homage to the chaotic interoperability struggles we all love and recognize across the blockchain universe.
          </p>
          <p>
            $BRIDGR is a meme coin with no intrinsic value or expectation of financial return. There is no formal team or roadmap. The coin is completely useless and for entertainment purposes only.
          </p>
        </div>

        <div className="footer-copyright">
          © 2026 by BRIDGR. All rights reserved!
        </div>
      </div>
    </footer>
  );
}
