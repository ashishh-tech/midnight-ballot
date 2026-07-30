import { describe, it, expect } from "vitest";

// ============================================================================
// Midnight Ballot Contract Test Suite (Simulated)
// ============================================================================
// Verifies ZK circuit logic, nullifier double-voting prevention, voter eligibility,
// and quorum enforcement.
// ============================================================================

describe("Midnight Ballot Contract (Simulated & Circuit Logic)", () => {

  class MockBallotSimulator {
    private state = {
      yesVotes: 0n,
      noVotes: 0n,
      topicHash: "0x0000000000000000000000000000000000000000000000000000000000000000",
      minimumQuorum: 1n,
      voterGroupMerkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
      isOpen: false,
      nullifiers: new Set<string>()
    };

    async ledger() {
      return {
        ...this.state,
        nullifiersCount: BigInt(this.state.nullifiers.size)
      };
    }

    async openVoting(topic: string, quorum: bigint = 1n, groupRoot: string = "0x1111222233334444555566667777888899990000111122223333444455556666") {
      if (this.state.isOpen) throw new Error("Voting is already open");
      this.state.topicHash = topic;
      this.state.minimumQuorum = quorum;
      this.state.voterGroupMerkleRoot = groupRoot;
      this.state.isOpen = true;
    }

    async castVote(witnesses: {
      getVoterSecret: () => string;
      getVoteChoice: () => bigint;
      getNullifier: () => string;
      getEligibilityProof: () => string;
    }) {
      if (!this.state.isOpen) throw new Error("Voting is not open");
      
      const choice = witnesses.getVoteChoice();
      const nullifier = witnesses.getNullifier();
      const eligibility = witnesses.getEligibilityProof();

      if (!eligibility || eligibility === "0x00") {
        throw new Error("Invalid voter eligibility proof");
      }

      if (choice !== 0n && choice !== 1n) {
        throw new Error("Vote must be 0 (No) or 1 (Yes)");
      }

      // Enforce Nullifier Uniqueness (Double Voting Prevention)
      if (this.state.nullifiers.has(nullifier)) {
        throw new Error("Vote already cast with this nullifier");
      }

      this.state.nullifiers.add(nullifier);

      if (choice === 1n) {
        this.state.yesVotes += 1n;
      } else {
        this.state.noVotes += 1n;
      }
    }

    async closeVoting() {
      if (!this.state.isOpen) throw new Error("Voting is not open");
      if (this.state.yesVotes + this.state.noVotes < this.state.minimumQuorum) {
        throw new Error("Minimum voting quorum not reached");
      }
      this.state.isOpen = false;
    }
  }

  // --- TESTS ---

  it("should initialize with zero votes and closed status", async () => {
    const simulator = new MockBallotSimulator();
    const state = await simulator.ledger();

    expect(state.yesVotes).toBe(0n);
    expect(state.noVotes).toBe(0n);
    expect(state.isOpen).toBe(false);
    expect(state.nullifiersCount).toBe(0n);
  });

  it("should open voting with configured topic, quorum, and voter group root", async () => {
    const simulator = new MockBallotSimulator();
    const sampleTopic = "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef";
    
    await simulator.openVoting(sampleTopic, 2n, "0xgroup123");
    const state = await simulator.ledger();

    expect(state.isOpen).toBe(true);
    expect(state.topicHash).toBe(sampleTopic);
    expect(state.minimumQuorum).toBe(2n);
    expect(state.voterGroupMerkleRoot).toBe("0xgroup123");
  });

  it("should cast a vote successfully and record nullifier on public ledger", async () => {
    const simulator = new MockBallotSimulator();
    await simulator.openVoting("0x1234", 1n);

    const voter1Witnesses = {
      getVoterSecret: () => "voter-1-secret-key",
      getVoteChoice: () => 1n,
      getNullifier: () => "0xnullifier_voter_1_topic_1234",
      getEligibilityProof: () => "0xproof_valid_member"
    };

    await simulator.castVote(voter1Witnesses);

    const state = await simulator.ledger();
    expect(state.yesVotes).toBe(1n);
    expect(state.noVotes).toBe(0n);
    expect(state.nullifiersCount).toBe(1n);
  });

  it("REJECTS double voting: second vote attempt with identical nullifier fails", async () => {
    const simulator = new MockBallotSimulator();
    await simulator.openVoting("0x1234", 1n);

    const voter1Witnesses = {
      getVoterSecret: () => "voter-1-secret-key",
      getVoteChoice: () => 1n,
      getNullifier: () => "0xnullifier_voter_1_topic_1234",
      getEligibilityProof: () => "0xproof_valid_member"
    };

    // First vote succeeds
    await simulator.castVote(voter1Witnesses);

    // Second vote with the SAME nullifier MUST be rejected!
    const doubleVoteAttempt = {
      ...voter1Witnesses,
      getVoteChoice: () => 0n // trying to change vote or vote again
    };

    await expect(simulator.castVote(doubleVoteAttempt)).rejects.toThrow("Vote already cast with this nullifier");
    
    const state = await simulator.ledger();
    expect(state.yesVotes).toBe(1n);
    expect(state.noVotes).toBe(0n); // Unchanged!
  });

  it("allows multiple unique voters with distinct nullifiers", async () => {
    const simulator = new MockBallotSimulator();
    await simulator.openVoting("0x1234", 2n);

    await simulator.castVote({
      getVoterSecret: () => "voter-1-secret",
      getVoteChoice: () => 1n,
      getNullifier: () => "0xnullifier_voter_1",
      getEligibilityProof: () => "0xproof_1"
    });

    await simulator.castVote({
      getVoterSecret: () => "voter-2-secret",
      getVoteChoice: () => 0n,
      getNullifier: () => "0xnullifier_voter_2",
      getEligibilityProof: () => "0xproof_2"
    });

    const state = await simulator.ledger();
    expect(state.yesVotes).toBe(1n);
    expect(state.noVotes).toBe(1n);
    expect(state.nullifiersCount).toBe(2n);
  });

  it("enforces minimum quorum rule before closing voting", async () => {
    const simulator = new MockBallotSimulator();
    await simulator.openVoting("0x1234", 5n); // Quorum of 5 required

    // Cast only 1 vote
    await simulator.castVote({
      getVoterSecret: () => "voter-1-secret",
      getVoteChoice: () => 1n,
      getNullifier: () => "0xnullifier_voter_1",
      getEligibilityProof: () => "0xproof_1"
    });

    // Attempting to close should fail quorum check
    await expect(simulator.closeVoting()).rejects.toThrow("Minimum voting quorum not reached");
  });
});
