import { Buffer } from "buffer";
import { Address } from "@stellar/stellar-sdk";
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from "@stellar/stellar-sdk/contract";
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Timepoint,
  Duration,
} from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";

if (typeof window !== "undefined") {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBZVYLQJKDHHSIB33MKDF2Z3EHTILULJIR3CBQHNW3RSASHOHTVQE42G",
  }
} as const

export type DataKey = {tag: "DonorTotal", values: readonly [string]} | {tag: "TotalDistributed", values: void} | {tag: "DonorCount", values: void} | {tag: "Donors", values: void} | {tag: "Beneficiaries", values: void};

export interface Client {
  /**
   * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  init: (options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_donor_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_donor_count: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_donor_total transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_donor_total: ({donor}: {donor: string}, options?: MethodOptions) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a record_distribution transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  record_distribution: ({donor, total_amount, beneficiaries, tx_hash}: {donor: string, total_amount: i128, beneficiaries: string, tx_hash: string}, options?: MethodOptions) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a get_beneficiary_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_beneficiary_count: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_total_distributed transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_total_distributed: (options?: MethodOptions) => Promise<AssembledTransaction<i128>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAAAAAAAAAAAEaW5pdAAAAAAAAAAA",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAACkRvbm9yVG90YWwAAAAAAAEAAAATAAAAAAAAAAAAAAAQVG90YWxEaXN0cmlidXRlZAAAAAAAAAAAAAAACkRvbm9yQ291bnQAAAAAAAAAAAAAAAAABkRvbm9ycwAAAAAAAAAAAAAAAAANQmVuZWZpY2lhcmllcwAAAA==",
        "AAAAAAAAAAAAAAAPZ2V0X2Rvbm9yX2NvdW50AAAAAAAAAAABAAAABg==",
        "AAAAAAAAAAAAAAAPZ2V0X2Rvbm9yX3RvdGFsAAAAAAEAAAAAAAAABWRvbm9yAAAAAAAAEwAAAAEAAAAL",
        "AAAAAAAAAAAAAAATcmVjb3JkX2Rpc3RyaWJ1dGlvbgAAAAAEAAAAAAAAAAVkb25vcgAAAAAAABMAAAAAAAAADHRvdGFsX2Ftb3VudAAAAAsAAAAAAAAADWJlbmVmaWNpYXJpZXMAAAAAAAAQAAAAAAAAAAd0eF9oYXNoAAAAABAAAAAA",
        "AAAAAAAAAAAAAAAVZ2V0X2JlbmVmaWNpYXJ5X2NvdW50AAAAAAAAAAAAAAEAAAAG",
        "AAAAAAAAAAAAAAAVZ2V0X3RvdGFsX2Rpc3RyaWJ1dGVkAAAAAAAAAAAAAAEAAAAL" ]),
      options
    )
  }
  public readonly fromJSON = {
    init: this.txFromJSON<null>,
        get_donor_count: this.txFromJSON<u64>,
        get_donor_total: this.txFromJSON<i128>,
        record_distribution: this.txFromJSON<null>,
        get_beneficiary_count: this.txFromJSON<u64>,
        get_total_distributed: this.txFromJSON<i128>
  }
}