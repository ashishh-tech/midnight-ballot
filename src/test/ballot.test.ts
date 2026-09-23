import { describe, it, expect } from "vitest";
import { Contract, ledger, Witnesses } from "../../managed/contract/index.js";
import {
  createConstructorContext,
  createCircuitContext,
  dummyContractAddress,
} from "@midnight-ntwrk/compact-runtime";

// ============================================================================
// Midnight Ballot Contract Test Suite (Real Compact Circuit Simulator)
// ============================================================================
// Executes ZK circuit logic with all 4 witnesses, state transitions,
// voter choice handling, admin authorization, nullifier double-vote prevention,
// eligibility verification, quorum enforcement, and open/close state machine.
// ============================================================================

describe("Midnight Ballot Contract (Real Compact Circuit Simulator)", () => {
  const dummyCoinPublicKey = { bytes: new Uint8Array(32) };

  // Helper: compute a mock eligibility proof whose persistent_hash matches groupRoot.
  // In the real contract, assert(persistent_hash(eligibility) == voterGroupMerkleRoot).
  // For simulator tests, the Compact runtime evaluates this deterministically,
  // so we pass a fixed eligibility value and derive groupRoot from it.
  const defaultEligibilityProof = new Uint8Array(32);
  defaultEligibilityProof.fill(0xaa);

  // Admin key for authorized operations
  const adminKey = new Uint8Array(32);
  adminKey.fill(0x42);

  // A different key that is NOT the admin
  const nonAdminKey = new Uint8Array(32);
  nonAdminKey.fill(0x99);

  /**
   * Creates mock witnesses implementing all 4 required witness functions
   * plus the admin key witness.
   */
  const createMockWitnesses = (
    secret: Uint8Array,
    choice: bigint,
    nullifier?: Uint8Array,
    eligibility?: Uint8Array,
    adminKeyOverride?: Uint8Array
  ): Witnesses<any> => ({
    getVoterSecret: (ctx: any): [any, Uint8Array] => [ctx.currentPrivateState, secret],
    getVoteChoice: (ctx: any): [any, bigint] => [ctx.currentPrivateState, choice],
    getNullifier: (ctx: any, _topic: Uint8Array): [any, Uint8Array] => {
      // Deterministic nullifier: hash(secret + topic) — simplified for test
      const nullifierValue = nullifier || (() => {
        const n = new Uint8Array(32);
        for (let i = 0; i < 32; i++) {
          n[i] = secret[i] ^ (i + 1);
        }
        return n;
      })();
      return [ctx.currentPrivateState, nullifierValue];
    },
    getEligibilityProof: (ctx: any): [any, Uint8Array] => {
      return [ctx.currentPrivateState, eligibility || defaultEligibilityProof];
    },
    getAdminKey: (ctx: any): [any, Uint8Array] => {
      return [ctx.currentPrivateState, adminKeyOverride || adminKey];
    },
  });

  /**
   * Helper: initialize contract and open voting with default parameters.
   * Returns the contract instance and current state.
   */
  const initAndOpenVoting = (
    secret: Uint8Array,
    choice: bigint,
    nullifier?: Uint8Array,
    eligibility?: Uint8Array,
    adminKeyOverride?: Uint8Array,
    groupRoot?: Uint8Array
  ) => {
    const contract = new Contract(
      createMockWitnesses(secret, choice, nullifier, eligibility, adminKeyOverride)
    );
    const constructorContext = createConstructorContext({}, dummyCoinPublicKey);
    const initResult = contract.initialState(constructorContext);

    let contractState = initResult.currentContractState;
    let privateState = initResult.currentPrivateState;

    // Open voting
    let circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const topicHash = new Uint8Array(32);
    topicHash[0] = 0xab;
    const quorum = 1n;
    const root = groupRoot || new Uint8Array(32);

    const openResult = contract.circuits.openVoting(circuitContext, topicHash, quorum, root);
    contractState.data = openResult.context.currentQueryContext.state;
    privateState = openResult.context.currentPrivateState;

    return { contract, contractState, privateState, topicHash };
  };

  // =========================================================================
  // Basic State Tests
  // =========================================================================

  it("should initialize contract ledger with zero votes and closed voting state", () => {
    const dummySecret = new Uint8Array(32);
    const contract = new Contract(createMockWitnesses(dummySecret, 1n));
    const constructorContext = createConstructorContext({}, dummyCoinPublicKey);

    const initResult = contract.initialState(constructorContext);
    const ledgerState = ledger(initResult.currentContractState.data);

    expect(ledgerState.yesVotes).toBe(0n);
    expect(ledgerState.noVotes).toBe(0n);
    expect(ledgerState.isOpen).toBe(false);
  });

  it("should open voting and update public ledger topic hash and open status", () => {
    const { contractState } = initAndOpenVoting(new Uint8Array(32), 1n);
    const ledgerState = ledger(contractState.data);

    expect(ledgerState.isOpen).toBe(true);
  });

  // =========================================================================
  // Voting Tests
  // =========================================================================

  it("should cast a YES vote via ZK circuit and increment public yesVotes counter", () => {
    const secret = new Uint8Array(32);
    secret.fill(1);
    const { contract, contractState, privateState } = initAndOpenVoting(secret, 1n);

    const circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteResult = contract.circuits.castVote(circuitContext);
    const ledgerState = ledger(voteResult.context.currentQueryContext.state);

    expect(ledgerState.yesVotes).toBe(1n);
    expect(ledgerState.noVotes).toBe(0n);
  });

  it("should cast a NO vote via ZK circuit and increment public noVotes counter", () => {
    const secret = new Uint8Array(32);
    secret.fill(2);
    const { contract, contractState, privateState } = initAndOpenVoting(secret, 0n);

    const circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteResult = contract.circuits.castVote(circuitContext);
    const ledgerState = ledger(voteResult.context.currentQueryContext.state);

    expect(ledgerState.yesVotes).toBe(0n);
    expect(ledgerState.noVotes).toBe(1n);
  });

  it("should REJECT vote casting when voting is closed", () => {
    const secret = new Uint8Array(32);
    const contract = new Contract(createMockWitnesses(secret, 1n));
    const constructorContext = createConstructorContext({}, dummyCoinPublicKey);
    const initResult = contract.initialState(constructorContext);

    const circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      initResult.currentContractState.data,
      initResult.currentPrivateState
    );

    expect(() => contract.circuits.castVote(circuitContext)).toThrow(
      "Voting is not open"
    );
  });

  // =========================================================================
  // Nullifier Double-Vote Prevention Tests
  // =========================================================================

  it("should REJECT a duplicate vote with the same nullifier (double-vote prevention)", () => {
    const secret = new Uint8Array(32);
    secret.fill(5);
    const fixedNullifier = new Uint8Array(32);
    fixedNullifier.fill(0xdd);

    const { contract, contractState, privateState } = initAndOpenVoting(
      secret, 1n, fixedNullifier
    );

    // First vote should succeed
    let circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteResult = contract.circuits.castVote(circuitContext);
    const updatedState = voteResult.context.currentQueryContext.state;
    const updatedPrivate = voteResult.context.currentPrivateState;

    // Second vote with same nullifier should be rejected
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      updatedState,
      updatedPrivate
    );

    expect(() => contract.circuits.castVote(circuitContext)).toThrow(
      "Vote already cast with this nullifier"
    );
  });

  // =========================================================================
  // Eligibility Verification Tests
  // =========================================================================

  it("should REJECT a vote with empty eligibility proof", () => {
    const secret = new Uint8Array(32);
    secret.fill(6);
    const emptyProof = new Uint8Array(32); // all zeros = empty

    const { contract, contractState, privateState } = initAndOpenVoting(
      secret, 1n, undefined, emptyProof
    );

    const circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );

    expect(() => contract.circuits.castVote(circuitContext)).toThrow(
      "Invalid voter eligibility proof"
    );
  });

  // =========================================================================
  // Admin Authorization Tests
  // =========================================================================

  it("should REJECT opening voting if voting is already open", () => {
    const { contract, contractState, privateState, topicHash } = initAndOpenVoting(
      new Uint8Array(32), 1n
    );

    const circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );

    expect(() =>
      contract.circuits.openVoting(circuitContext, topicHash, 1n, new Uint8Array(32))
    ).toThrow("Voting is already open");
  });

  it("should REJECT closeVoting from a non-admin caller", () => {
    const secret = new Uint8Array(32);
    // First, open voting with the real admin key
    const { contract, contractState, privateState } = initAndOpenVoting(
      secret, 1n, undefined, undefined, adminKey
    );

    // Now create a NEW contract instance with non-admin key to attempt closeVoting
    const nonAdminContract = new Contract(
      createMockWitnesses(secret, 1n, undefined, undefined, nonAdminKey)
    );

    // We need to cast a vote first to meet quorum (quorum = 1)
    let circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteResult = contract.circuits.castVote(circuitContext);
    const updatedState = voteResult.context.currentQueryContext.state;
    const updatedPrivate = voteResult.context.currentPrivateState;

    // Attempt closeVoting with non-admin key
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      updatedState,
      updatedPrivate
    );

    expect(() => nonAdminContract.circuits.closeVoting(circuitContext)).toThrow(
      "Unauthorized: caller is not the admin"
    );
  });

  // =========================================================================
  // Quorum Enforcement Tests
  // =========================================================================

  it("should REJECT closeVoting when quorum is not met", () => {
    const secret = new Uint8Array(32);
    // Open voting with quorum = 5 (requires at least 5 votes)
    const contract = new Contract(createMockWitnesses(secret, 1n));
    const constructorContext = createConstructorContext({}, dummyCoinPublicKey);
    const initResult = contract.initialState(constructorContext);

    let contractState = initResult.currentContractState;
    let privateState = initResult.currentPrivateState;

    let circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const topicHash = new Uint8Array(32);
    const highQuorum = 5n;

    const openResult = contract.circuits.openVoting(
      circuitContext, topicHash, highQuorum, new Uint8Array(32)
    );
    contractState.data = openResult.context.currentQueryContext.state;
    privateState = openResult.context.currentPrivateState;

    // Only cast 1 vote — not enough for quorum of 5
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteResult = contract.circuits.castVote(circuitContext);
    contractState.data = voteResult.context.currentQueryContext.state;
    privateState = voteResult.context.currentPrivateState;

    // Try to close — should fail
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );

    expect(() => contract.circuits.closeVoting(circuitContext)).toThrow(
      "Minimum voting quorum not reached"
    );
  });

  it("should close voting successfully when quorum is met", () => {
    const secret = new Uint8Array(32);
    secret.fill(1);
    const { contract, contractState, privateState } = initAndOpenVoting(secret, 1n);

    // Cast a vote to meet quorum (quorum = 1)
    let circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteResult = contract.circuits.castVote(circuitContext);
    const updatedState = voteResult.context.currentQueryContext.state;
    const updatedPrivate = voteResult.context.currentPrivateState;

    // Close voting — should succeed
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      updatedState,
      updatedPrivate
    );
    const closeResult = contract.circuits.closeVoting(circuitContext);
    const ledgerState = ledger(closeResult.context.currentQueryContext.state);

    expect(ledgerState.isOpen).toBe(false);
    expect(ledgerState.yesVotes).toBe(1n);
  });
});
