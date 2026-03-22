interface BalanceDisplayProps {
  balance: string;
  loading: boolean;
}

export const BalanceDisplay = ({ balance, loading }: BalanceDisplayProps) => {
  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', margin: '10px', borderRadius: '8px' }}>
      <h3>Your Balance</h3>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{balance} BRG</p>
      )}
    </div>
  );
};
