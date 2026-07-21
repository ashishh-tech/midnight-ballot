import React, { useState, useEffect } from 'react';

interface WalletState {
  isConnected: boolean;
  address?: string;
  balance?: string;
  error?: string;
}

export default function BallotApp() {
  const [wallet, setWallet] = useState<WalletState>({ isConnected: false });
  const [voteChoice, setVoteChoice] = useState<'yes' | 'no'>('yes');
  const [isVoting, setIsVoting] = useState(false);
  const [txHash, setTxHash] = useState<string>('');

  // Connect wallet
  const connectWallet = async () => {
    try {
      // This would use the Lace wallet SDK
      // For demo, we'll simulate it
      setWallet({
        isConnected: true,
        address: '0x' + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').substring(0, 40),
        balance: '1.5 tNIGHT'
      });
    } catch (error) {
      setWallet({
        isConnected: false,
        error: 'Failed to connect wallet'
      });
    }
  };

  // Disconnect wallet
  const disconnectWallet = () => {
    setWallet({ isConnected: false });
    setTxHash('');
  };

  // Cast a vote
  const castVote = async () => {
    if (!wallet.isConnected) {
      alert('Please connect wallet first');
      return;
    }

    setIsVoting(true);
    try {
      // This would call the castVote circuit on Midnight
      // For demo, we simulate the call
      await new Promise(r => setTimeout(r, 2000));
      
      const hash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('').substring(0, 64);
      setTxHash(hash);
      alert(`✅ Vote cast successfully!\nTx: ${hash}`);
    } catch (error) {
      alert(`❌ Vote failed: ${error}`);
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>🗳️ Midnight Ballot</h1>
        <p>Privacy-Preserving Anonymous Voting</p>
      </div>

      {/* Wallet Section */}
      <div style={styles.section}>
        <h2>Wallet</h2>
        {wallet.isConnected ? (
          <div style={styles.walletConnected}>
            <p><strong>Address:</strong> {wallet.address?.substring(0, 10)}...{wallet.address?.substring(-8)}</p>
            <p><strong>Balance:</strong> {wallet.balance}</p>
            <button onClick={disconnectWallet} style={styles.buttonDanger}>
              Disconnect Wallet
            </button>
          </div>
        ) : (
          <button onClick={connectWallet} style={styles.buttonPrimary}>
            🔐 Connect Lace Wallet
          </button>
        )}
        {wallet.error && <p style={styles.error}>{wallet.error}</p>}
      </div>

      {/* Voting Section */}
      {wallet.isConnected && (
        <div style={styles.section}>
          <h2>Cast Your Vote (Private)</h2>
          <p style={styles.hint}>
            Your vote choice remains private. Only the final tally is public.
          </p>
          
          <div style={styles.voteOptions}>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="vote"
                value="yes"
                checked={voteChoice === 'yes'}
                onChange={(e) => setVoteChoice(e.target.value as 'yes' | 'no')}
              />
              Yes ✅
            </label>
            <label style={styles.radioLabel}>
              <input
                type="radio"
                name="vote"
                value="no"
                checked={voteChoice === 'no'}
                onChange={(e) => setVoteChoice(e.target.value as 'yes' | 'no')}
              />
              No ❌
            </label>
          </div>

          <button
            onClick={castVote}
            disabled={isVoting}
            style={isVoting ? styles.buttonDisabled : styles.buttonSuccess}
          >
            {isVoting ? '⏳ Casting Vote...' : '🗳️ Cast Vote Privately'}
          </button>

          {txHash && (
            <div style={styles.success}>
              <p><strong>Transaction Hash:</strong></p>
              <code>{txHash}</code>
            </div>
          )}
        </div>
      )}

      {/* Info Section */}
      <div style={styles.section}>
        <h2>How It Works</h2>
        <ul>
          <li><strong>Private Witness:</strong> Your vote choice stays on your device</li>
          <li><strong>ZK Proof:</strong> Blockchain verifies validity without seeing your choice</li>
          <li><strong>Public Ledger:</strong> Only aggregate vote counts are visible to everyone</li>
          <li><strong>Disclose Optional:</strong> You can voluntarily reveal your vote later</li>
        </ul>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    backgroundColor: '#f5f5f5',
    minHeight: '100vh'
  } as React.CSSProperties,
  header: {
    textAlign: 'center' as const,
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #333'
  } as React.CSSProperties,
  section: {
    backgroundColor: 'white',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  } as React.CSSProperties,
  walletConnected: {
    backgroundColor: '#f0f8f0',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '10px'
  } as React.CSSProperties,
  voteOptions: {
    margin: '15px 0',
    padding: '10px'
  } as React.CSSProperties,
  radioLabel: {
    display: 'block' as const,
    margin: '10px 0',
    fontSize: '16px',
    cursor: 'pointer'
  } as React.CSSProperties,
  hint: {
    fontSize: '14px',
    color: '#666',
    fontStyle: 'italic'
  } as React.CSSProperties,
  buttonPrimary: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  } as React.CSSProperties,
  buttonSuccess: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  } as React.CSSProperties,
  buttonDanger: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  } as React.CSSProperties,
  buttonDisabled: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#ccc',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'not-allowed',
    fontWeight: 'bold'
  } as React.CSSProperties,
  success: {
    backgroundColor: '#d4edda',
    border: '1px solid #c3e6cb',
    color: '#155724',
    padding: '12px',
    borderRadius: '5px',
    marginTop: '15px'
  } as React.CSSProperties,
  error: {
    color: '#dc3545',
    marginTop: '10px',
    fontWeight: 'bold'
  } as React.CSSProperties
};
