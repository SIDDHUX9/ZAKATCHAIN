import { Buffer } from "buffer";
import { AssembledTransaction, Client as ContractClient, ClientOptions as ContractClientOptions, MethodOptions } from "@stellar/stellar-sdk/contract";
import type { u64, i128 } from "@stellar/stellar-sdk/contract";
export * from "@stellar/stellar-sdk";
export * as contract from "@stellar/stellar-sdk/contract";
export * as rpc from "@stellar/stellar-sdk/rpc";
export declare const networks: {
    readonly testnet: {
        readonly networkPassphrase: "Test SDF Network ; September 2015";
        readonly contractId: "CBZVYLQJKDHHSIB33MKDF2Z3EHTILULJIR3CBQHNW3RSASHOHTVQE42G";
    };
};
export type DataKey = {
    tag: "DonorTotal";
    values: readonly [string];
} | {
    tag: "TotalDistributed";
    values: void;
} | {
    tag: "DonorCount";
    values: void;
} | {
    tag: "Donors";
    values: void;
} | {
    tag: "Beneficiaries";
    values: void;
};
export interface Client {
    /**
     * Construct and simulate a init transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    init: (options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_donor_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_donor_count: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>;
    /**
     * Construct and simulate a get_donor_total transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_donor_total: ({ donor }: {
        donor: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<i128>>;
    /**
     * Construct and simulate a record_distribution transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    record_distribution: ({ donor, total_amount, beneficiaries, tx_hash }: {
        donor: string;
        total_amount: i128;
        beneficiaries: string;
        tx_hash: string;
    }, options?: MethodOptions) => Promise<AssembledTransaction<null>>;
    /**
     * Construct and simulate a get_beneficiary_count transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_beneficiary_count: (options?: MethodOptions) => Promise<AssembledTransaction<u64>>;
    /**
     * Construct and simulate a get_total_distributed transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
     */
    get_total_distributed: (options?: MethodOptions) => Promise<AssembledTransaction<i128>>;
}
export declare class Client extends ContractClient {
    readonly options: ContractClientOptions;
    static deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions & Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
    }): Promise<AssembledTransaction<T>>;
    constructor(options: ContractClientOptions);
    readonly fromJSON: {
        init: (json: string) => AssembledTransaction<null>;
        get_donor_count: (json: string) => AssembledTransaction<bigint>;
        get_donor_total: (json: string) => AssembledTransaction<bigint>;
        record_distribution: (json: string) => AssembledTransaction<null>;
        get_beneficiary_count: (json: string) => AssembledTransaction<bigint>;
        get_total_distributed: (json: string) => AssembledTransaction<bigint>;
    };
}
