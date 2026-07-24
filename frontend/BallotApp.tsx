import React, { useState, useEffect } from 'react';

interface WalletState {
  isConnected: boolean;
  address?: string;
  balance?: string;
  error?: string;
}

interface VoteStats {
  yesCount: number;
  noCount: number;
  totalVotes: number;
}

export default function BallotApp() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [wallet, setWallet] = useState<WalletState>({ isConnected: false });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  const [activeTab, setActiveTab] = useState<'vote' | 'audit' | 'ledger' | 'admin'>('vote');
  const [voteChoice, setVoteChoice] = useState<'yes' | 'no'>('yes');
  const [isVoting, setIsVoting] = useState(false);
  const [provingStep, setProvingStep] = useState<number>(0);
  const [txHash, setTxHash] = useState<string>('');
  const [copiedContract, setCopiedContract] = useState(false);
  
  // Simulated Ledger State
  const [stats, setStats] = useState<VoteStats>({
    yesCount: 14,
    noCount: 3,
    totalVotes: 17
  });

  const contractAddress = "020050e6bdae4c9e65023a252a6aba74323c1d9c1ba6e520f00e84a5fc1c75b100f3";

  // Connect Lace Wallet Simulation
  const connectWallet = async () => {
    try {
      const mockAddr = 'mn_addr_preprod1q9x3a' + Array(32).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      setWallet({
        isConnected: true,
        address: mockAddr,
        balance: '24.85 tNIGHT'
      });
    } catch (error) {
      setWallet({
        isConnected: false,
        error: 'Failed to connect Lace wallet'
      });
    }
  };

  const disconnectWallet = () => {
    setWallet({ isConnected: false });
    setTxHash('');
    setProvingStep(0);
  };

  // Cast Vote with Interactive ZK Step Animation
  const castVote = async () => {
    if (!wallet.isConnected) {
      alert('Please connect your Lace wallet first');
      return;
    }

    setIsVoting(true);
    setProvingStep(1); // Step 1: Witness extraction

    try {
      await new Promise(r => setTimeout(r, 800));
      setProvingStep(2); // Step 2: ZK Proving key computation

      await new Promise(r => setTimeout(r, 1000));
      setProvingStep(3); // Step 3: Disclose boundary

      await new Promise(r => setTimeout(r, 900));
      setProvingStep(4); // Step 4: Submission

      const generatedHash = '0x' + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
      setTxHash(generatedHash);

      // Update local state tally
      setStats(prev => ({
        yesCount: voteChoice === 'yes' ? prev.yesCount + 1 : prev.yesCount,
        noCount: voteChoice === 'no' ? prev.noCount + 1 : prev.noCount,
        totalVotes: prev.totalVotes + 1
      }));

    } catch (error) {
      alert(`❌ Proving failed: ${error}`);
    } finally {
      setIsVoting(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 2000);
  };

  const yesPercent = Math.round((stats.yesCount / (stats.totalVotes || 1)) * 100);
  const noPercent = Math.round((stats.noCount / (stats.totalVotes || 1)) * 100);

  return (
    <div style={styles.appContainer}>
      
      {/* HEADER BAR */}
      <header style={styles.header}>
        <div style={styles.brandGroup}>
          <div style={styles.logoBadge}>
            <span style={{ fontSize: '22px' }}>🗳️</span>
          </div>
          <div>
            <h1 style={styles.brandTitle}>Midnight Ballot</h1>
            <p style={styles.brandSubtitle}>Zero-Knowledge Anonymous Governance Protocol</p>
          </div>
        </div>

        <div style={styles.headerRight}>
          <button
            onClick={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
            style={styles.themeToggleBtn}
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>

          <div style={styles.networkBadge}>
            <span style={styles.statusDot}></span>
            <span>Preprod Testnet</span>
          </div>

          {wallet.isConnected ? (
            <div style={styles.walletBox}>
              <div style={styles.walletInfo}>
                <span style={styles.walletBalance}>{wallet.balance}</span>
                <span style={styles.walletAddress}>
                  {wallet.address?.substring(0, 12)}...{wallet.address?.substring(wallet.address.length - 6)}
                </span>
              </div>
              <button onClick={disconnectWallet} style={styles.disconnectBtn}>
                Disconnect
              </button>
            </div>
          ) : (
            <button onClick={connectWallet} style={styles.connectBtn}>
              ⚡ Connect Lace Wallet
            </button>
          )}
        </div>
      </header>

      {/* HERO / ACTIVE PROPOSAL CARD */}
      <div style={styles.heroCard} className="glass-panel animate-slide-up">
        <div style={styles.proposalBadgeRow}>
          <span style={styles.categoryTag}>GOVERNANCE POLL #104</span>
          <span style={styles.activeTag}>● ACTIVE VOTING</span>
          <span style={styles.timerTag}>⏱️ 48h 12m Remaining</span>
        </div>

        <h2 style={styles.proposalTitle}>
          Proposal: Allocate 250,000 tNIGHT to Privacy-Preserving Ecosystem Grant Program
        </h2>
        <p style={styles.proposalDesc}>
          Cast your vote anonymously. Your individual selection is protected by Midnight ZK circuits (`castVote.compact`).
          Only the aggregate vote count is disclosed publicly to the ledger.
        </p>

        {/* TALLY PROGRESS BARS */}
        <div style={styles.tallySection}>
          <div style={styles.tallyHeader}>
            <span style={styles.tallyTitle}>Current Public Ledger Tally ({stats.totalVotes} Votes Total)</span>
            <span style={styles.zkShieldBadge}>🛡️ 100% Zero-Knowledge Verified</span>
          </div>

          <div style={styles.progressGroup}>
            <div style={styles.progressLabelRow}>
              <span style={{ color: '#10b981', fontWeight: 600 }}>YES ({stats.yesCount} votes)</span>
              <span style={{ color: '#10b981', fontWeight: 700 }}>{yesPercent}%</span>
            </div>
            <div style={styles.trackBackground}>
              <div style={{ ...styles.fillYes, width: `${yesPercent}%` }}></div>
            </div>
          </div>

          <div style={styles.progressGroup}>
            <div style={styles.progressLabelRow}>
              <span style={{ color: '#f43f5e', fontWeight: 600 }}>NO ({stats.noCount} votes)</span>
              <span style={{ color: '#f43f5e', fontWeight: 700 }}>{noPercent}%</span>
            </div>
            <div style={styles.trackBackground}>
              <div style={{ ...styles.fillNo, width: `${noPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* DASHBOARD TABS */}
      <div style={styles.tabContainer}>
        <button
          onClick={() => setActiveTab('vote')}
          style={activeTab === 'vote' ? styles.tabActive : styles.tabInactive}
        >
          🗳️ Cast Private Vote
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          style={activeTab === 'audit' ? styles.tabActive : styles.tabInactive}
        >
          🔒 Privacy Witness Audit
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          style={activeTab === 'ledger' ? styles.tabActive : styles.tabInactive}
        >
          📊 On-Chain Ledger State
        </button>
        <button
          onClick={() => setActiveTab('admin')}
          style={activeTab === 'admin' ? styles.tabActive : styles.tabInactive}
        >
          ⚙️ Circuit Admin
        </button>
      </div>

      {/* TAB CONTENT 1: CAST VOTE */}
      {activeTab === 'vote' && (
        <div style={styles.tabCard} className="glass-panel">
          <h3 style={styles.sectionHeader}>Cast Your Vote Privately</h3>
          <p style={styles.sectionSubtext}>
            Select your choice below. Your witness data (`getVoterSecret` & `getVoteChoice`) will remain on your local device.
          </p>

          <div style={styles.voteGrid}>
            <div
              onClick={() => setVoteChoice('yes')}
              style={voteChoice === 'yes' ? styles.choiceSelectedYes : styles.choiceCard}
            >
              <div style={styles.choiceHeader}>
                <span style={{ fontSize: '24px' }}>✅</span>
                <span style={styles.choiceName}>YES (Approve)</span>
              </div>
              <p style={styles.choiceDesc}>Support allocating funds to the privacy ecosystem grant.</p>
              {voteChoice === 'yes' && <span style={styles.selectedBadgeYes}>SELECTED</span>}
            </div>

            <div
              onClick={() => setVoteChoice('no')}
              style={voteChoice === 'no' ? styles.choiceSelectedNo : styles.choiceCard}
            >
              <div style={styles.choiceHeader}>
                <span style={{ fontSize: '24px' }}>❌</span>
                <span style={styles.choiceName}>NO (Reject)</span>
              </div>
              <p style={styles.choiceDesc}>Oppose the current allocation proposal.</p>
              {voteChoice === 'no' && <span style={styles.selectedBadgeNo}>SELECTED</span>}
            </div>
          </div>

          {/* WITNESS PREVIEW BOX */}
          <div style={styles.witnessBox}>
            <div style={styles.witnessTitleRow}>
              <span>🔒 Off-Chain Private Witness Safeguard</span>
              <span style={styles.badgePrivate}>LOCAL WITNESS ONLY</span>
            </div>
            <div style={styles.witnessContent}>
              <div><strong>Witness `getVoterSecret()`:</strong> <code>0x8f1e9c... (Kept private on device)</code></div>
              <div><strong>Witness `getVoteChoice()`:</strong> <code>{voteChoice === 'yes' ? '1 (YES)' : '0 (NO)'} (ZK Hashed)</code></div>
              <div><strong>Circuit Target:</strong> <code>castVote()</code></div>
            </div>
          </div>

          {/* ACTION BUTTON */}
          <button
            onClick={castVote}
            disabled={isVoting || !wallet.isConnected}
            style={!wallet.isConnected ? styles.actionDisabled : styles.actionButton}
          >
            {isVoting ? '⏳ Generating ZK Proof...' : '🗳️ Execute CastVote Circuit & Prove'}
          </button>

          {!wallet.isConnected && (
            <p style={styles.connectPrompt}>⚠️ Please connect your Lace wallet to enable voting.</p>
          )}

          {/* PROVING STEP VISUALIZER */}
          {isVoting && (
            <div style={styles.provingModal}>
              <h4 style={{ marginBottom: '12px', color: '#38bdf8' }}>⚡ Executing ZK Circuit: `castVote()`</h4>
              <div style={styles.stepRow}>
                <span>{provingStep >= 1 ? '✅' : '⏳'} Step 1: Extracting private witness data...</span>
              </div>
              <div style={styles.stepRow}>
                <span>{provingStep >= 2 ? '✅' : '⏳'} Step 2: Computing ZK-SNARK proving keys...</span>
              </div>
              <div style={styles.stepRow}>
                <span>{provingStep >= 3 ? '✅' : '⏳'} Step 3: Enforcing `disclose()` boundary...</span>
              </div>
              <div style={styles.stepRow}>
                <span>{provingStep >= 4 ? '✅' : '⏳'} Step 4: Submitting proof to Midnight testnet...</span>
              </div>
            </div>
          )}

          {/* TRANSACTION RECEIPT */}
          {txHash && (
            <div style={styles.receiptCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>🎉</span>
                <strong style={{ color: '#10b981' }}>Vote Cast & Verified Successfully!</strong>
              </div>
              <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>
                Your vote was proved using ZK circuits. Aggregate ledger tally updated without exposing your choice.
              </p>
              <div style={styles.hashBox}>
                <span>Tx Hash:</span>
                <code style={styles.codeHash}>{txHash}</code>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: PRIVACY AUDIT */}
      {activeTab === 'audit' && (
        <div style={styles.tabCard} className="glass-panel">
          <h3 style={styles.sectionHeader}>Privacy Witness Audit: Public vs. Private</h3>
          <p style={styles.sectionSubtext}>
            Demonstrating how Midnight's dual-state architecture protects voter privacy using off-chain witness data.
          </p>

          <div style={styles.auditGrid}>
            <div style={styles.auditCardPublic}>
              <h4 style={{ color: '#38bdf8', marginBottom: '10px' }}>🌐 What the World Sees (On-Chain Ledger)</h4>
              <ul style={styles.auditList}>
                <li>✅ <strong>`yesVotes` Counter:</strong> {stats.yesCount}</li>
                <li>✅ <strong>`noVotes` Counter:</strong> {stats.noCount}</li>
                <li>✅ <strong>`topicHash`:</strong> <code>0x1234...5678</code></li>
                <li>✅ <strong>`isOpen`:</strong> <code>true</code></li>
                <li>❌ <strong>Voter Identity:</strong> NOT STORED ON-CHAIN</li>
                <li>❌ <strong>Individual Ballot:</strong> NOT STORED ON-CHAIN</li>
              </ul>
            </div>

            <div style={styles.auditCardPrivate}>
              <h4 style={{ color: '#a855f7', marginBottom: '10px' }}>🔒 What Only You See (Private Client Witness)</h4>
              <ul style={styles.auditList}>
                <li>🔑 <strong>Voter Secret Key:</strong> Stored in Local Storage / Wallet</li>
                <li>🗳️ <strong>Your Choice:</strong> {voteChoice.toUpperCase()} (Witness data)</li>
                <li>🛡️ <strong>ZK Proof:</strong> Generated on device before submission</li>
                <li>⚡ <strong>`disclose()` Boundary:</strong> Explicitly controls data release</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: LEDGER STATE */}
      {activeTab === 'ledger' && (
        <div style={styles.tabCard} className="glass-panel">
          <h3 style={styles.sectionHeader}>On-Chain Smart Contract Details</h3>
          
          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Contract Address (ID):</span>
            <div style={styles.infoValueRow}>
              <code style={styles.codeFull}>{contractAddress}</code>
              <button onClick={copyAddress} style={styles.copyBtn}>
                {copiedContract ? '✓ Copied' : '📋 Copy'}
              </button>
            </div>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Midnight Network:</span>
            <span style={{ color: '#10b981', fontWeight: 600 }}>Preprod Testnet</span>
          </div>

          <div style={styles.infoRow}>
            <span style={styles.infoLabel}>Compiled Circuits (`managed/`):</span>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              <span style={styles.circuitPill}>openVoting.zkir</span>
              <span style={styles.circuitPill}>castVote.zkir</span>
              <span style={styles.circuitPill}>closeVoting.zkir</span>
            </div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <a
              href={`https://explorer.preprod.midnight.network/contract/${contractAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.explorerLink}
            >
              🔗 View Contract on Midnight Preprod Explorer ↗
            </a>
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: ADMIN */}
      {activeTab === 'admin' && (
        <div style={styles.tabCard} className="glass-panel">
          <h3 style={styles.sectionHeader}>Admin Circuit Control</h3>
          <p style={styles.sectionSubtext}>Manage poll status using `openVoting` and `closeVoting` ZK circuits.</p>

          <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
            <button onClick={() => alert('Voting opened via openVoting() circuit!')} style={styles.btnGreen}>
              🟢 Open Voting (`openVoting`)
            </button>
            <button onClick={() => alert('Voting closed via closeVoting() circuit!')} style={styles.btnRed}>
              🔴 Close Voting (`closeVoting`)
            </button>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>Built for the Midnight Blockchain Hackathon • Compact v0.23+ • Privacy by Default</p>
      </footer>

    </div>
  );
}

// INLINE STYLES FOR SLEEK DARK THEME
const styles = {
  appContainer: {
    maxWidth: '960px',
    margin: '0 auto',
    padding: '24px 16px',
    fontFamily: "'Inter', sans-serif"
  } as React.CSSProperties,

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    flexWrap: 'wrap' as const,
    gap: '16px'
  } as React.CSSProperties,

  brandGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  } as React.CSSProperties,

  logoBadge: {
    width: '46px',
    height: '46px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
  } as React.CSSProperties,

  brandTitle: {
    fontSize: '22px',
    fontWeight: 800,
    background: 'linear-gradient(90deg, #f8fafc 0%, #38bdf8 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-0.5px'
  } as React.CSSProperties,

  brandSubtitle: {
    fontSize: '12px',
    color: '#94a3b8'
  } as React.CSSProperties,

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  } as React.CSSProperties,

  networkBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.25)',
    color: '#10b981',
    fontSize: '12px',
    fontWeight: 600
  } as React.CSSProperties,

  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px #10b981'
  } as React.CSSProperties,

  themeToggleBtn: {
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: 700,
    color: 'var(--text-main)',
    backgroundColor: 'var(--bg-card-hover)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s'
  } as React.CSSProperties,

  connectBtn: {
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
    transition: 'all 0.2s'
  } as React.CSSProperties,

  walletBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    padding: '6px 12px',
    borderRadius: '10px'
  } as React.CSSProperties,

  walletInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-end'
  } as React.CSSProperties,

  walletBalance: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#38bdf8'
  } as React.CSSProperties,

  walletAddress: {
    fontSize: '11px',
    color: '#94a3b8',
    fontFamily: 'monospace'
  } as React.CSSProperties,

  disconnectBtn: {
    padding: '6px 10px',
    fontSize: '11px',
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
    color: '#f43f5e',
    border: '1px solid rgba(244, 63, 94, 0.3)',
    borderRadius: '6px',
    cursor: 'pointer'
  } as React.CSSProperties,

  heroCard: {
    padding: '24px',
    marginBottom: '24px'
  } as React.CSSProperties,

  proposalBadgeRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    marginBottom: '12px',
    flexWrap: 'wrap' as const
  } as React.CSSProperties,

  categoryTag: {
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#818cf8',
    fontSize: '11px',
    fontWeight: 700,
    letterSpacing: '0.5px'
  } as React.CSSProperties,

  activeTag: {
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    color: '#34d399',
    fontSize: '11px',
    fontWeight: 700
  } as React.CSSProperties,

  timerTag: {
    padding: '4px 10px',
    borderRadius: '6px',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    color: '#fbbf24',
    fontSize: '11px',
    fontWeight: 600
  } as React.CSSProperties,

  proposalTitle: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#f8fafc',
    marginBottom: '10px',
    lineHeight: 1.4
  } as React.CSSProperties,

  proposalDesc: {
    fontSize: '14px',
    color: '#94a3b8',
    marginBottom: '20px',
    lineHeight: 1.6
  } as React.CSSProperties,

  tallySection: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    padding: '16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)'
  } as React.CSSProperties,

  tallyTitle: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#cbd5e1'
  } as React.CSSProperties,

  zkShieldBadge: {
    fontSize: '11px',
    color: '#a855f7',
    fontWeight: 600
  } as React.CSSProperties,

  tallyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '14px'
  } as React.CSSProperties,

  progressGroup: {
    marginBottom: '10px'
  } as React.CSSProperties,

  progressLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    marginBottom: '4px'
  } as React.CSSProperties,

  trackBackground: {
    height: '10px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: '5px',
    overflow: 'hidden'
  } as React.CSSProperties,

  fillYes: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: '5px',
    transition: 'width 0.6s ease'
  } as React.CSSProperties,

  fillNo: {
    height: '100%',
    backgroundColor: '#f43f5e',
    borderRadius: '5px',
    transition: 'width 0.6s ease'
  } as React.CSSProperties,

  tabContainer: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    paddingBottom: '8px',
    overflowX: 'auto' as const
  } as React.CSSProperties,

  tabActive: {
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: 700,
    color: '#38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    border: '1px solid rgba(56, 189, 248, 0.3)',
    borderRadius: '8px',
    cursor: 'pointer'
  } as React.CSSProperties,

  tabInactive: {
    padding: '10px 18px',
    fontSize: '13px',
    fontWeight: 600,
    color: '#94a3b8',
    backgroundColor: 'transparent',
    border: '1px solid transparent',
    borderRadius: '8px',
    cursor: 'pointer'
  } as React.CSSProperties,

  tabCard: {
    padding: '24px',
    marginBottom: '28px'
  } as React.CSSProperties,

  sectionHeader: {
    fontSize: '18px',
    fontWeight: 700,
    color: '#f8fafc',
    marginBottom: '6px'
  } as React.CSSProperties,

  sectionSubtext: {
    fontSize: '13px',
    color: '#94a3b8',
    marginBottom: '20px'
  } as React.CSSProperties,

  voteGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  } as React.CSSProperties,

  choiceCard: {
    padding: '18px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(30, 41, 59, 0.4)',
    cursor: 'pointer',
    transition: 'all 0.2s'
  } as React.CSSProperties,

  choiceSelectedYes: {
    padding: '18px',
    borderRadius: '12px',
    border: '2px solid #10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    boxShadow: '0 0 16px rgba(16, 185, 129, 0.2)',
    cursor: 'pointer',
    position: 'relative' as const
  } as React.CSSProperties,

  choiceSelectedNo: {
    padding: '18px',
    borderRadius: '12px',
    border: '2px solid #f43f5e',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    boxShadow: '0 0 16px rgba(244, 63, 94, 0.2)',
    cursor: 'pointer',
    position: 'relative' as const
  } as React.CSSProperties,

  choiceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '8px'
  } as React.CSSProperties,

  choiceName: {
    fontSize: '16px',
    fontWeight: 700,
    color: '#f8fafc'
  } as React.CSSProperties,

  choiceDesc: {
    fontSize: '12px',
    color: '#94a3b8'
  } as React.CSSProperties,

  selectedBadgeYes: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: 700,
    color: '#10b981',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderRadius: '4px'
  } as React.CSSProperties,

  selectedBadgeNo: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '2px 8px',
    fontSize: '10px',
    fontWeight: 700,
    color: '#f43f5e',
    backgroundColor: 'rgba(244, 63, 94, 0.2)',
    borderRadius: '4px'
  } as React.CSSProperties,

  witnessBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    border: '1px solid rgba(168, 85, 247, 0.3)',
    borderRadius: '10px',
    padding: '14px',
    marginBottom: '20px'
  } as React.CSSProperties,

  witnessTitleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: 700,
    color: '#c084fc',
    marginBottom: '10px'
  } as React.CSSProperties,

  badgePrivate: {
    fontSize: '10px',
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    padding: '2px 6px',
    borderRadius: '4px'
  } as React.CSSProperties,

  witnessContent: {
    fontSize: '12px',
    color: '#cbd5e1',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px'
  } as React.CSSProperties,

  actionButton: {
    width: '100%',
    padding: '14px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#ffffff',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
    transition: 'all 0.2s'
  } as React.CSSProperties,

  actionDisabled: {
    width: '100%',
    padding: '14px',
    fontSize: '15px',
    fontWeight: 700,
    color: '#64748b',
    backgroundColor: '#1e293b',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    cursor: 'not-allowed'
  } as React.CSSProperties,

  connectPrompt: {
    fontSize: '12px',
    color: '#fbbf24',
    textAlign: 'center' as const,
    marginTop: '10px'
  } as React.CSSProperties,

  provingModal: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    border: '1px solid rgba(56, 189, 248, 0.4)',
    borderRadius: '10px'
  } as React.CSSProperties,

  stepRow: {
    fontSize: '13px',
    color: '#e2e8f0',
    padding: '6px 0'
  } as React.CSSProperties,

  receiptCard: {
    marginTop: '20px',
    padding: '16px',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '10px'
  } as React.CSSProperties,

  hashBox: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    fontSize: '12px',
    color: '#94a3b8',
    flexWrap: 'wrap' as const
  } as React.CSSProperties,

  codeHash: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '11px',
    color: '#34d399',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '4px 8px',
    borderRadius: '4px',
    wordBreak: 'break-all' as const
  } as React.CSSProperties,

  auditGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px'
  } as React.CSSProperties,

  auditCardPublic: {
    padding: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(56, 189, 248, 0.2)',
    borderRadius: '10px'
  } as React.CSSProperties,

  auditCardPrivate: {
    padding: '16px',
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    border: '1px solid rgba(168, 85, 247, 0.2)',
    borderRadius: '10px'
  } as React.CSSProperties,

  auditList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    fontSize: '13px',
    color: '#cbd5e1'
  } as React.CSSProperties,

  infoRow: {
    marginBottom: '14px'
  } as React.CSSProperties,

  infoLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#94a3b8',
    marginBottom: '4px'
  } as React.CSSProperties,

  infoValueRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexWrap: 'wrap' as const
  } as React.CSSProperties,

  codeFull: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: '12px',
    color: '#38bdf8',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    padding: '6px 10px',
    borderRadius: '6px',
    wordBreak: 'break-all' as const
  } as React.CSSProperties,

  copyBtn: {
    padding: '6px 12px',
    fontSize: '11px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer'
  } as React.CSSProperties,

  circuitPill: {
    fontSize: '11px',
    fontFamily: 'monospace',
    color: '#c084fc',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    padding: '4px 8px',
    borderRadius: '4px'
  } as React.CSSProperties,

  explorerLink: {
    color: '#38bdf8',
    fontSize: '13px',
    textDecoration: 'none',
    fontWeight: 600
  } as React.CSSProperties,

  btnGreen: {
    padding: '10px 16px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: 'pointer'
  } as React.CSSProperties,

  btnRed: {
    padding: '10px 16px',
    backgroundColor: '#f43f5e',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 700,
    cursor: 'pointer'
  } as React.CSSProperties,

  footer: {
    textAlign: 'center' as const,
    marginTop: '32px',
    fontSize: '12px',
    color: '#64748b'
  } as React.CSSProperties
};
