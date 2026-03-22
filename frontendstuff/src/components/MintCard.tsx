import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useMint } from '../hooks/useMint';
import { useOwner } from '../hooks/useOwner';
import './MintCard.css';

export const MintCard = () => {
  const { address } = useAccount();
  const { owner, loading: ownerLoading } = useOwner();
  const { mint, loading, error, isSuccess, hash } = useMint();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
      setRecipient('');
      setAmount('');
      setTimeout(() => setSuccess(false), 5000);
    }
  }, [isSuccess]);

  const handleMint = async () => {
    if (!recipient || !amount || !isOwner) return;
    setSuccess(false);
    await mint(recipient, amount);
  };

  if (ownerLoading) {
    return null;
  }

  if (!isOwner) {
    return null;
  }

  return (
    <div className="mint-card">
      <div className="mint-header">
        <div className="mint-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 10h5c-.46 2.28-1.78 4.28-4 5.58V14H8V9h4V2.18c3.58.78 6.24 3.94 6.24 7.82H12z" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <h3 className="mint-title">Mint Tokens</h3>
          <p className="mint-subtitle">Create new BRG tokens</p>
        </div>
      </div>

      <div className="owner-badge">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 0L0 4v6c0 4.44 3.07 8.59 7.2 9.6 4.13-1.01 7.2-5.16 7.2-9.6V4L8 0z" fill="currentColor"/>
        </svg>
        Owner Access
      </div>
      
      <div className="mint-form">
        <div className="mint-input-group">
          <label>Recipient Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="mint-input-group">
          <label>Amount (BRG)</label>
          <input
            type="number"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            min="0"
            step="0.01"
          />
        </div>
        
        <button 
          onClick={handleMint}
          disabled={loading || !recipient || !amount}
          className="mint-button"
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Minting...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm5 11h-4v4H9v-4H5V9h4V5h2v4h4v2z" fill="currentColor"/>
              </svg>
              Mint Tokens
            </>
          )}
        </button>
        
        {error && (
          <div className="mint-error">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
            </svg>
            <div>{error}</div>
          </div>
        )}
        
        {success && (
          <div className="mint-success">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z" fill="currentColor"/>
            </svg>
            <div>
              <p style={{ margin: '0 0 4px 0', fontWeight: 600 }}>Tokens minted successfully!</p>
              {hash && (
                <a 
                  href={`https://sepolia-blockscout.lisk.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
                  style={{ color: '#16a34a', textDecoration: 'underline' }}
                >
                  View transaction
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
