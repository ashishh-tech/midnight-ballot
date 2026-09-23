import { describe, it, expect } from "vitest";
import { Contract, ledger, Witnesses } from "../../managed/contract/index.js";
import {
  createConstructorContext,
  createCircuitContext,
  dummyContractAddress,
} from "@midnight-ntwrk/compact-runtime";

// ============================================================================
// Midnight Ballot — End-to-End (E2E) Integration Flow Test
// ============================================================================
// Validates the full lifecycle of a ballot:
// 1. Contract initialization with 0 tallies and closed status
// 2. Admin opening the poll with proposal topic, quorum, and voter group root
// 3. Voter A casting YES with private witness and nullifier generation
// 4. Voter B casting NO with private witness and distinct nullifier
// 5. Duplicate vote attempt with Voter A's nullifier (rejection verified)
// 6. Non-admin attempting to close poll (rejection verified)
// 7. Admin successfully closing the poll once quorum is reached
// ============================================================================

describe("Midnight Ballot — Complete E2E Lifecycle", () => {
  const dummyCoinPublicKey = { bytes: new Uint8Array(32) };
  const adminKey = new Uint8Array(32).fill(0x11);
  const voterASecret = new Uint8Array(32).fill(0xaa);
  const voterBSecret = new Uint8Array(32).fill(0xbb);
  const eligibilityProof = new Uint8Array(32).fill(0x77);

  const proposalTopic = new Uint8Array(32);
  proposalTopic[0] = 0xfe;
  proposalTopic[1] = 0xdc;

  const createWitnesses = (
    secret: Uint8Array,
    choice: bigint,
    nullifierByte: number,
    adminOverride?: Uint8Array
  ): Witnesses<any> => ({
    getVoterSecret: (ctx: any): [any, Uint8Array] => [ctx.currentPrivateState, secret],
    getVoteChoice: (ctx: any): [any, bigint] => [ctx.currentPrivateState, choice],
    getNullifier: (ctx: any, _topic: Uint8Array): [any, Uint8Array] => {
      const n = new Uint8Array(32);
      n[0] = nullifierByte;
      return [ctx.currentPrivateState, n];
    },
    getEligibilityProof: (ctx: any): [any, Uint8Array] => [
      ctx.currentPrivateState,
      eligibilityProof,
    ],
    getAdminKey: (ctx: any): [any, Uint8Array] => [
      ctx.currentPrivateState,
      adminOverride || adminKey,
    ],
  });

  it("should successfully execute full proposal lifecycle from deploy to tally closure", () => {
    // 1. Deploy / Initial State
    const adminWitnesses = createWitnesses(voterASecret, 1n, 0x01, adminKey);
    const contract = new Contract(adminWitnesses);
    const constructorContext = createConstructorContext({}, dummyCoinPublicKey);
    const initResult = contract.initialState(constructorContext);

    let contractState = initResult.currentContractState;
    let privateState = initResult.currentPrivateState;

    let initialLedger = ledger(contractState.data);
    expect(initialLedger.isOpen).toBe(false);
    expect(initialLedger.yesVotes).toBe(0n);
    expect(initialLedger.noVotes).toBe(0n);

    // 2. Admin opens voting (quorum = 2)
    let circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const openResult = contract.circuits.openVoting(
      circuitContext,
      proposalTopic,
      2n, // Quorum of 2 votes
      new Uint8Array(32)
    );
    contractState.data = openResult.context.currentQueryContext.state;
    privateState = openResult.context.currentPrivateState;

    let openLedger = ledger(contractState.data);
    expect(openLedger.isOpen).toBe(true);
    expect(openLedger.minimumQuorum).toBe(2n);

    // 3. Voter A casts YES vote (choice = 1)
    const voterAContract = new Contract(createWitnesses(voterASecret, 1n, 0x0a));
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteAResult = voterAContract.circuits.castVote(circuitContext);
    contractState.data = voteAResult.context.currentQueryContext.state;

    let stateAfterA = ledger(contractState.data);
    expect(stateAfterA.yesVotes).toBe(1n);
    expect(stateAfterA.noVotes).toBe(0n);

    // 4. Voter A tries to double vote with same nullifier -> MUST FAIL
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      voteAResult.context.currentPrivateState
    );
    expect(() => voterAContract.circuits.castVote(circuitContext)).toThrow(
      "Vote already cast with this nullifier"
    );

    // 5. Admin tries to close before quorum is met (1 of 2 votes cast) -> MUST FAIL
    const adminContract = new Contract(createWitnesses(voterASecret, 1n, 0x00, adminKey));
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    expect(() => adminContract.circuits.closeVoting(circuitContext)).toThrow(
      "Minimum voting quorum not reached"
    );

    // 6. Voter B casts NO vote (choice = 0)
    const voterBContract = new Contract(createWitnesses(voterBSecret, 0n, 0x0b));
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const voteBResult = voterBContract.circuits.castVote(circuitContext);
    contractState.data = voteBResult.context.currentQueryContext.state;

    let stateAfterB = ledger(contractState.data);
    expect(stateAfterB.yesVotes).toBe(1n);
    expect(stateAfterB.noVotes).toBe(1n);

    // 7. Non-admin attempts to close voting -> MUST FAIL
    const nonAdminKey = new Uint8Array(32).fill(0x99);
    const attackerContract = new Contract(createWitnesses(voterASecret, 1n, 0x0c, nonAdminKey));
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    expect(() => attackerContract.circuits.closeVoting(circuitContext)).toThrow(
      "Unauthorized: caller is not the admin"
    );

    // 8. Admin closes voting now that quorum (2 votes) is satisfied -> SUCCESS
    circuitContext = createCircuitContext(
      dummyContractAddress(),
      dummyCoinPublicKey,
      contractState.data,
      privateState
    );
    const closeResult = adminContract.circuits.closeVoting(circuitContext);
    contractState.data = closeResult.context.currentQueryContext.state;

    let finalLedger = ledger(contractState.data);
    expect(finalLedger.isOpen).toBe(false);
    expect(finalLedger.yesVotes).toBe(1n);
    expect(finalLedger.noVotes).toBe(1n);
  });
});
