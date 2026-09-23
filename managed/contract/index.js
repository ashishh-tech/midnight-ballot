import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = __compactRuntime.CompactTypeBoolean;
const _descriptor_1 = new __compactRuntime.CompactTypeBytes(32);
const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(65535n, 2);
const _descriptor_3 = new __compactRuntime.CompactTypeUnsignedInteger(4294967295n, 4);
const _descriptor_4 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);
const _descriptor_8 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

function bytesEqual(a, b) {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

function isZero32(b) {
  for (let i = 0; i < 32; i++) {
    if (b[i] !== 0) return false;
  }
  return true;
}

export class Contract {
  witnesses;
  spentNullifiers = new Set();
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof witnesses_0 !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    if (typeof witnesses_0.getVoterSecret !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getVoterSecret');
    }
    if (typeof witnesses_0.getVoteChoice !== 'function') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor does not contain a function-valued field named getVoteChoice');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      openVoting: (...args_1) => {
        if (args_1.length !== 4) {
          throw new __compactRuntime.CompactError(`openVoting: expected 4 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const topic_0 = args_1[1];
        const quorum_0 = args_1[2];
        const groupRoot_0 = args_1[3];
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_1.toValue(topic_0),
            alignment: _descriptor_1.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._openVoting_0(context, partialProofData, topic_0, quorum_0, groupRoot_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      castVote: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`castVote: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._castVote_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      closeVoting: (...args_1) => {
        if (args_1.length !== 1) {
          throw new __compactRuntime.CompactError(`closeVoting: expected 1 argument (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: { value: [], alignment: [] },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._closeVoting_0(context, partialProofData);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      openVoting: this.circuits.openVoting,
      castVote: this.circuits.castVote,
      closeVoting: this.circuits.closeVoting
    };
    this.provableCircuits = {
      openVoting: this.circuits.openVoting,
      castVote: this.circuits.castVote,
      closeVoting: this.circuits.closeVoting
    };
  }

  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    for (let i = 0; i < 8; i++) {
      stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    }
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('openVoting', new __compactRuntime.ContractOperation());
    state_0.setOperation('castVote', new __compactRuntime.ContractOperation());
    state_0.setOperation('closeVoting', new __compactRuntime.ContractOperation());

    const context = __compactRuntime.createCircuitContext(
      __compactRuntime.dummyContractAddress(),
      constructorContext_0.initialZswapLocalState.coinPublicKey,
      state_0.data,
      constructorContext_0.initialPrivateState
    );
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };

    // 0: yesVotes (0)
    this._writeSlot(context, partialProofData, 0n, _descriptor_4, 0n);
    // 1: noVotes (0)
    this._writeSlot(context, partialProofData, 1n, _descriptor_4, 0n);
    // 2: topicHash (zeros)
    this._writeSlot(context, partialProofData, 2n, _descriptor_1, new Uint8Array(32));
    // 3: minimumQuorum (0)
    this._writeSlot(context, partialProofData, 3n, _descriptor_3, 0n);
    // 4: voterGroupMerkleRoot (zeros)
    this._writeSlot(context, partialProofData, 4n, _descriptor_1, new Uint8Array(32));
    // 5: isOpen (false)
    this._writeSlot(context, partialProofData, 5n, _descriptor_0, false);
    // 6: nullifiers count / placeholder
    this._writeSlot(context, partialProofData, 6n, _descriptor_4, 0n);
    // 7: adminPublicKey (zeros)
    this._writeSlot(context, partialProofData, 7n, _descriptor_1, new Uint8Array(32));

    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    };
  }

  _writeSlot(context, partialProofData, slot, descriptor, val) {
    __compactRuntime.queryLedgerState(context, partialProofData, [
      { push: { storage: false, value: __compactRuntime.StateValue.newCell({ value: _descriptor_8.toValue(slot), alignment: _descriptor_8.alignment() }).encode() } },
      { push: { storage: true, value: __compactRuntime.StateValue.newCell({ value: descriptor.toValue(val), alignment: descriptor.alignment() }).encode() } },
      { ins: { cached: false, n: 1 } }
    ]);
  }

  _readSlot(context, partialProofData, slot, descriptor) {
    return descriptor.fromValue(__compactRuntime.queryLedgerState(context, partialProofData, [
      { dup: { n: 0 } },
      { idx: { cached: false, pushPath: false, path: [{ tag: 'value', value: { value: _descriptor_8.toValue(slot), alignment: _descriptor_8.alignment() } }] } },
      { popeq: { cached: false, result: undefined } }
    ]).value);
  }

  _getVoterSecret_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getVoterSecret(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    return result_0;
  }

  _getVoteChoice_0(context, partialProofData) {
    const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
    const [nextPrivateState_0, result_0] = this.witnesses.getVoteChoice(witnessContext_0);
    context.currentPrivateState = nextPrivateState_0;
    return result_0;
  }

  _getNullifier_0(context, partialProofData, topic) {
    if (this.witnesses.getNullifier) {
      const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
      const [nextPrivateState_0, result_0] = this.witnesses.getNullifier(witnessContext_0, topic);
      context.currentPrivateState = nextPrivateState_0;
      return result_0;
    }
    return new Uint8Array(32);
  }

  _getEligibilityProof_0(context, partialProofData) {
    if (this.witnesses.getEligibilityProof) {
      const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
      const [nextPrivateState_0, result_0] = this.witnesses.getEligibilityProof(witnessContext_0);
      context.currentPrivateState = nextPrivateState_0;
      return result_0;
    }
    return new Uint8Array(32);
  }

  _getAdminKey_0(context, partialProofData) {
    if (this.witnesses.getAdminKey) {
      const witnessContext_0 = __compactRuntime.createWitnessContext(ledger(context.currentQueryContext.state), context.currentPrivateState, context.currentQueryContext.address);
      const [nextPrivateState_0, result_0] = this.witnesses.getAdminKey(witnessContext_0);
      context.currentPrivateState = nextPrivateState_0;
      return result_0;
    }
    return new Uint8Array(32);
  }

  _openVoting_0(context, partialProofData, topic_0, quorum_0, groupRoot_0) {
    const isOpen = this._readSlot(context, partialProofData, 5n, _descriptor_0);
    __compactRuntime.assert(!isOpen, 'Voting is already open');

    const callerKey = this._getAdminKey_0(context, partialProofData);
    const currentAdmin = this._readSlot(context, partialProofData, 7n, _descriptor_1);

    if (isZero32(currentAdmin)) {
      this._writeSlot(context, partialProofData, 7n, _descriptor_1, callerKey);
    } else {
      __compactRuntime.assert(bytesEqual(callerKey, currentAdmin), 'Unauthorized: caller is not the admin');
    }

    this._writeSlot(context, partialProofData, 2n, _descriptor_1, topic_0);
    this._writeSlot(context, partialProofData, 3n, _descriptor_3, BigInt(quorum_0));
    this._writeSlot(context, partialProofData, 4n, _descriptor_1, groupRoot_0);
    this._writeSlot(context, partialProofData, 5n, _descriptor_0, true);
    return [];
  }

  _castVote_0(context, partialProofData) {
    const isOpen = this._readSlot(context, partialProofData, 5n, _descriptor_0);
    __compactRuntime.assert(isOpen, 'Voting is not open');

    const topicHash = this._readSlot(context, partialProofData, 2n, _descriptor_1);
    const _secret = this._getVoterSecret_0(context, partialProofData);
    const choice = this._getVoteChoice_0(context, partialProofData);
    const nullifier = this._getNullifier_0(context, partialProofData, topicHash);
    const eligibility = this._getEligibilityProof_0(context, partialProofData);

    __compactRuntime.assert(choice === 0n || choice === 1n, 'Vote must be 0 (No) or 1 (Yes)');
    __compactRuntime.assert(!isZero32(eligibility), 'Invalid voter eligibility proof');

    // Nullifier uniqueness check
    const nullifierHex = Buffer.from(nullifier).toString('hex');
    __compactRuntime.assert(!this.spentNullifiers.has(nullifierHex), 'Vote already cast with this nullifier');
    this.spentNullifiers.add(nullifierHex);

    if (choice === 1n) {
      const yes = this._readSlot(context, partialProofData, 0n, _descriptor_4);
      this._writeSlot(context, partialProofData, 0n, _descriptor_4, yes + 1n);
    } else {
      const no = this._readSlot(context, partialProofData, 1n, _descriptor_4);
      this._writeSlot(context, partialProofData, 1n, _descriptor_4, no + 1n);
    }
    return [];
  }

  _closeVoting_0(context, partialProofData) {
    const isOpen = this._readSlot(context, partialProofData, 5n, _descriptor_0);
    __compactRuntime.assert(isOpen, 'Voting is not open');

    const callerKey = this._getAdminKey_0(context, partialProofData);
    const currentAdmin = this._readSlot(context, partialProofData, 7n, _descriptor_1);
    if (!isZero32(currentAdmin)) {
      __compactRuntime.assert(bytesEqual(callerKey, currentAdmin), 'Unauthorized: caller is not the admin');
    }

    const yes = this._readSlot(context, partialProofData, 0n, _descriptor_4);
    const no = this._readSlot(context, partialProofData, 1n, _descriptor_4);
    const quorum = this._readSlot(context, partialProofData, 3n, _descriptor_3);
    __compactRuntime.assert(yes + no >= quorum, 'Minimum voting quorum not reached');

    this._writeSlot(context, partialProofData, 5n, _descriptor_0, false);
    return [];
  }
}

export function ledger(stateOrChargedState) {
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };

  function read(slot, desc) {
    return desc.fromValue(__compactRuntime.queryLedgerState(context, partialProofData, [
      { dup: { n: 0 } },
      { idx: { cached: false, pushPath: false, path: [{ tag: 'value', value: { value: _descriptor_8.toValue(slot), alignment: _descriptor_8.alignment() } }] } },
      { popeq: { cached: false, result: undefined } }
    ]).value);
  }

  return {
    get yesVotes() { return read(0n, _descriptor_4); },
    get noVotes() { return read(1n, _descriptor_4); },
    get topicHash() { return read(2n, _descriptor_1); },
    get minimumQuorum() { return read(3n, _descriptor_3); },
    get voterGroupMerkleRoot() { return read(4n, _descriptor_1); },
    get isOpen() { return read(5n, _descriptor_0); },
    get adminPublicKey() { return read(7n, _descriptor_1); }
  };
}

export const pureCircuits = {};
export const contractReferenceLocations = { tag: 'publicLedgerArray', indices: {} };
