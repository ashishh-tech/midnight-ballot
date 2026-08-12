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
// Executes ZK circuit logic, state transitions, voter choice handling,
// and open/close state machine validation against compiled Compact circuits.
// ============================================================================

describe("Midnight Ballot Contract (Real Compact Circuit Simulator)", () => {
  const dummyCoinPublicKey = { bytes: new Uint8Array(32) };

  const createMockWitnesses = (secret: Uint8Array, choice: bigint): Witnesses<any> => ({
    getVoterSecret: (ctx: any): [any, Uint8Array] => [ctx.currentPrivateState, secret],
    getVoteChoice: (ctx: any): [any, bigint] => [ctx.currentPrivateState, choice],
  });

  it("should initialize contract ledger with zero votes and closed voting state", () => {
    const dummySecret = new Uint8Array(32);
    const contract = new Contract(createMockWitnesses(dummySecret, 1n));
    const constructorContext = createConstructorContext(
      {},
      dummyCoinPublicKey
    );

    const initResult = contract.initialState(constructorContext);
    const ledgerState = ledger(initResult.currentContractState.data);

    expect(ledgerState.yesVotes).toBe(0n);
    expect(ledgerState.noVotes).toBe(0n);
    expect(ledgerState.isOpen).toBe(false);
  });

  it("should open voting and update public ledger topic hash and open status", () => {
    const dummySecret = new Uint8Array(32);
    const contract = new Contract(createMockWitnesses(dummySecret, 1n));
    const constructorContext = createConstructorContext(
      {},
      dummyCoinPublicKey
    );
    const initResult = contract.initialState(constructorContext);

    let contractState = initResult.currentContractState;
    let privateState = initResult.currentPrivateState;

    const circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );

    const topicHash = new Uint8Array(32);
    topicHash[0] = 0xab;
    topicHash[31] = 0xcd;

    const openResult = contract.circuits.openVoting(circuitContext, topicHash);
    contractState.data = openResult.context.currentQueryContext.state;

    const ledgerState = ledger(contractState.data);
    expect(ledgerState.isOpen).toBe(true);
    expect(ledgerState.topicHash).toEqual(topicHash);
  });

  it("should cast a YES vote via ZK circuit and increment public yesVotes counter", () => {
    const secret = new Uint8Array(32);
    secret.fill(1);
    const contract = new Contract(createMockWitnesses(secret, 1n)); // 1n = Yes

    const constructorContext = createConstructorContext(
      {},
      dummyCoinPublicKey
    );
    const initResult = contract.initialState(constructorContext);

    let contractState = initResult.currentContractState;
    let privateState = initResult.currentPrivateState;

    // Step 1: Open voting
    let circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const topicHash = new Uint8Array(32);
    const openResult = contract.circuits.openVoting(circuitContext, topicHash);
    contractState.data = openResult.context.currentQueryContext.state;
    privateState = openResult.context.currentPrivateState;

    // Step 2: Cast YES vote
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteResult = contract.circuits.castVote(circuitContext);
    contractState.data = voteResult.context.currentQueryContext.state;

    const ledgerState = ledger(contractState.data);
    expect(ledgerState.yesVotes).toBe(1n);
    expect(ledgerState.noVotes).toBe(0n);
  });

  it("should cast a NO vote via ZK circuit and increment public noVotes counter", () => {
    const secret = new Uint8Array(32);
    secret.fill(2);
    const contract = new Contract(createMockWitnesses(secret, 0n)); // 0n = No

    const constructorContext = createConstructorContext(
      {},
      dummyCoinPublicKey
    );
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
    const openResult = contract.circuits.openVoting(circuitContext, topicHash);
    contractState.data = openResult.context.currentQueryContext.state;
    privateState = openResult.context.currentPrivateState;

    // Cast NO vote
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteResult = contract.circuits.castVote(circuitContext);
    contractState.data = voteResult.context.currentQueryContext.state;

    const ledgerState = ledger(contractState.data);
    expect(ledgerState.yesVotes).toBe(0n);
    expect(ledgerState.noVotes).toBe(1n);
  });

  it("should REJECT vote casting when voting is closed", () => {
    const secret = new Uint8Array(32);
    const contract = new Contract(createMockWitnesses(secret, 1n));
    const constructorContext = createConstructorContext(
      {},
      dummyCoinPublicKey
    );
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

  it("should REJECT opening voting if voting is already open", () => {
    const secret = new Uint8Array(32);
    const contract = new Contract(createMockWitnesses(secret, 1n));
    const constructorContext = createConstructorContext(
      {},
      dummyCoinPublicKey
    );
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
    const openResult = contract.circuits.openVoting(circuitContext, topicHash);
    contractState.data = openResult.context.currentQueryContext.state;
    privateState = openResult.context.currentPrivateState;

    // Attempt second openVoting
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    expect(() => contract.circuits.openVoting(circuitContext, topicHash)).toThrow(
      "Voting is already open"
    );
  });

  it("should close voting and update public ledger state to closed", () => {
    const secret = new Uint8Array(32);
    const contract = new Contract(createMockWitnesses(secret, 1n));
    const constructorContext = createConstructorContext(
      {},
      dummyCoinPublicKey
    );
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
    const openResult = contract.circuits.openVoting(circuitContext, topicHash);
    contractState.data = openResult.context.currentQueryContext.state;
    privateState = openResult.context.currentPrivateState;

    // Close voting
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const closeResult = contract.circuits.closeVoting(circuitContext);
    contractState.data = closeResult.context.currentQueryContext.state;

    const ledgerState = ledger(contractState.data);
    expect(ledgerState.isOpen).toBe(false);
  });
});
