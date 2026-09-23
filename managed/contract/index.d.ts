import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
  getVoterSecret(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getVoteChoice(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, bigint];
  getNullifier?(context: __compactRuntime.WitnessContext<Ledger, PS>, topic: Uint8Array): [PS, Uint8Array];
  getEligibilityProof?(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
  getAdminKey?(context: __compactRuntime.WitnessContext<Ledger, PS>): [PS, Uint8Array];
}

export type ImpureCircuits<PS> = {
  openVoting(context: __compactRuntime.CircuitContext<PS>, topic_0: Uint8Array, quorum_0: bigint, groupRoot_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  castVote(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  closeVoting(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  openVoting(context: __compactRuntime.CircuitContext<PS>, topic_0: Uint8Array, quorum_0: bigint, groupRoot_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  castVote(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  closeVoting(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  openVoting(context: __compactRuntime.CircuitContext<PS>, topic_0: Uint8Array, quorum_0: bigint, groupRoot_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  castVote(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
  closeVoting(context: __compactRuntime.CircuitContext<PS>): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  readonly yesVotes: bigint;
  readonly noVotes: bigint;
  readonly topicHash: Uint8Array;
  readonly minimumQuorum: bigint;
  readonly voterGroupMerkleRoot: Uint8Array;
  readonly isOpen: boolean;
  readonly adminPublicKey: Uint8Array;
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
