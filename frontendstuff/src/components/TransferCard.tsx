import { useState, useEffect } from 'react';
import { useTransfer } from '../hooks/useTransfer';
import './TransferCard.css';

export const TransferCard = () => {
  const { transfer, loading, error, isSuccess, hash } = useTransfer();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isSuccess) {
      setSuccess(true);
      setRecipient('');
      setAmount('');
      setTimeout(() => setSuccess(false), 5000);
    }
  }, [isSuccess]);

  const handleTransfer = async () => {
    if (!recipient || !amount) return;
    setSuccess(false);
    await transfer(recipient, amount);
  };

  return (
    <div className="transfer-card">
      <div className="transfer-header">
        <div className="transfer-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M21 12L14 5v4H3v6h11v4l7-7z" fill="currentColor"/>
          </svg>
        </div>
        <div>
          <h3 className="transfer-title">Transfer Tokens</h3>
          <p className="transfer-subtitle">Send BRG tokens to another address</p>
        </div>
      </div>
      
      <div className="transfer-form">
        <div className="input-group">
          <label>Recipient Address</label>
          <input
            type="text"
            placeholder="0x..."
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            disabled={loading}
          />
        </div>
        
        <div className="input-group">
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
          onClick={handleTransfer}
          disabled={loading || !recipient || !amount}
          className="transfer-button"
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              Processing...
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17 10L11 4v4H2v4h9v4l6-6z" fill="currentColor"/>
              </svg>
              Send Tokens
            </>
          )}
        </button>
        
        {error && (
          <div className="error-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm1 15H9v-2h2v2zm0-4H9V5h2v6z" fill="currentColor"/>
            </svg>
            {error}
          </div>
        )}
        
        {success && (
          <div className="success-message">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm-2 15l-5-5 1.41-1.41L8 12.17l7.59-7.59L17 6l-9 9z" fill="currentColor"/>
            </svg>
            <div className="success-content">
              <p className="success-title">Tokens transferred successfully!</p>
              {hash && (
                <a 
                  href={`https://sepolia-blockscout.lisk.com/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="tx-link"
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
