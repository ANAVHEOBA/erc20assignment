import { useTokenInfo } from '../hooks/useTokenInfo';
import { useRemainingSupply } from '../hooks/useRemainingSupply';
import { formatTokenAmount } from '../utils/helperFunctions';
import './TokenInfo.css';

export function TokenInfo() {
  const { balance, name, symbol, totalSupply, loading, error } = useTokenInfo();
  const { remainingSupply } = useRemainingSupply();

  if (loading) {
    return (
      <div className="token-info-container">
        <div className="loading-skeleton">
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
          <div className="skeleton-card"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="token-info-container">
        <div className="error-card">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/>
          </svg>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="token-info-container">
      <div className="info-card balance-card">
        <div className="card-header">
          <span className="card-label">Your Balance</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H9v6l5.25 3.15.75-1.23-4.5-2.67z" fill="#2563eb"/>
          </svg>
        </div>
        <div className="card-value">
          {formatTokenAmount(balance, 4)} <span className="token-symbol">{symbol}</span>
        </div>
      </div>

      <div className="info-card">
        <div className="card-header">
          <span className="card-label">Token Name</span>
        </div>
        <div className="card-value-secondary">{name}</div>
        <div className="card-subtitle">{symbol}</div>
      </div>

      <div className="info-card">
        <div className="card-header">
          <span className="card-label">Total Supply</span>
        </div>
        <div className="card-value-secondary">
          {formatTokenAmount(totalSupply, 0)} <span className="token-symbol-sm">{symbol}</span>
        </div>
      </div>

      <div className="info-card">
        <div className="card-header">
          <span className="card-label">Remaining Mintable</span>
        </div>
        <div className="card-value-secondary">
          {formatTokenAmount(remainingSupply, 0)} <span className="token-symbol-sm">{symbol}</span>
        </div>
      </div>
    </div>
  );
}
