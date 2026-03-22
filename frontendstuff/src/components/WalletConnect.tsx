import { useState } from 'react';
import { connectWallet, addNetwork } from '../utils/walletFunctions';
import { CHAIN_ID, NETWORK_NAME, RPC_URL, BLOCK_EXPLORER } from '../config/contract';
import { formatAddress } from '../utils/helperFunctions';
import './WalletConnect.css';

export function WalletConnect() {
  const [account, setAccount] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleConnect = async () => {
    setLoading(true);
    setError('');

    try {
      const { account: connectedAccount } = await connectWallet();
      setAccount(connectedAccount);
    } catch (err: any) {
      setError(err.message || 'Failed to connect wallet');
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNetwork = async () => {
    setLoading(true);
    setError('');

    try {
      await addNetwork(CHAIN_ID, NETWORK_NAME, RPC_URL, BLOCK_EXPLORER);
    } catch (err: any) {
      setError(err.message || 'Failed to add network');
      console.error('Network error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-connect">
      {!account ? (
        <button 
          className="btn btn-primary" 
          onClick={handleConnect} 
          disabled={loading}
        >
          {loading ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="wallet-info">
          <div className="account-badge">
            <div className="status-dot"></div>
            <span className="account-address">{formatAddress(account)}</span>
          </div>
          <button 
            className="btn btn-secondary btn-sm" 
            onClick={handleAddNetwork} 
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Network'}
          </button>
        </div>
      )}

      {error && (
        <div className="error-message">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1C4.13 1 1 4.13 1 8s3.13 7 7 7 7-3.13 7-7-3.13-7-7-7zm0 13c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zm-.5-9h1v5h-1V5zm0 6h1v1h-1v-1z" fill="currentColor"/>
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
