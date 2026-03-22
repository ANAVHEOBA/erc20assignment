import { useEffect } from 'react';
import { useFaucetCooldown } from '../hooks/useFaucetCooldown';
import { useRequestToken } from '../hooks/useRequestToken';
import { FAUCET_AMOUNT } from '../config/contract';
import './FaucetCard.css';

export function FaucetCard() {
  const { timeRemaining, canRequest, formatTime, refetch } = useFaucetCooldown();
  const { requestToken, isPending, isConfirming, isSuccess, error, hash } = useRequestToken();

  useEffect(() => {
    if (isSuccess) {
      // Refetch cooldown after successful claim
      setTimeout(() => refetch(), 2000);
    }
  }, [isSuccess, refetch]);

  const handleClaim = () => {
    if (canRequest) {
      requestToken();
    }
  };

  return (
    <div className="faucet-card">
      <div className="faucet-header">
        <div className="faucet-icon">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <path d="M16 4C9.373 4 4 9.373 4 16s5.373 12 12 12 12-5.373 12-12S22.627 4 16 4zm0 22c-5.514 0-10-4.486-10-10S10.486 6 16 6s10 4.486 10 10-4.486 10-10 10z" fill="currentColor"/>
            <path d="M16 10v6l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <div>
          <h3 className="faucet-title">Token Faucet</h3>
          <p className="faucet-subtitle">Claim {FAUCET_AMOUNT} BRG every 24 hours</p>
        </div>
      </div>

      <div className="cooldown-display">
        <div className="cooldown-label">Cooldown Status</div>
        <div className={`cooldown-time ${canRequest ? 'ready' : 'waiting'}`}>
          {formatTime()}
        </div>
        {!canRequest && (
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((86400 - timeRemaining) / 86400) * 100}%` }}
            ></div>
          </div>
        )}
      </div>

      {isSuccess && (
        <div className="success-message">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z" fill="currentColor"/>
          </svg>
          <div>
            <p className="success-title">Tokens claimed successfully!</p>
            <a 
              href={`https://sepolia-blockscout.lisk.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="tx-link"
            >
              View transaction
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="error-message-inline">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
          </svg>
          <p>{error}</p>
        </div>
      )}

      <button 
        className={`claim-button ${canRequest && !isPending && !isConfirming ? 'ready' : 'disabled'}`}
        disabled={!canRequest || isPending || isConfirming}
        onClick={handleClaim}
      >
        {isPending ? (
          <>
            <div className="spinner"></div>
            Confirm in wallet...
          </>
        ) : isConfirming ? (
          <>
            <div className="spinner"></div>
            Processing...
          </>
        ) : canRequest ? (
          <>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z" fill="currentColor"/>
            </svg>
            Claim {FAUCET_AMOUNT} BRG
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H9v6l5.25 3.15.75-1.23-4.5-2.67z" fill="currentColor"/>
            </svg>
            Cooldown Active
          </>
        )}
      </button>
    </div>
  );
}
