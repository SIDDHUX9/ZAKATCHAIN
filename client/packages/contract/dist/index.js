import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from "@stellar/stellar-sdk/contract";
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
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["AAAAAAAAAAAAAAAEaW5pdAAAAAAAAAAA",
            "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAEAAAAAAAAACkRvbm9yVG90YWwAAAAAAAEAAAATAAAAAAAAAAAAAAAQVG90YWxEaXN0cmlidXRlZAAAAAAAAAAAAAAACkRvbm9yQ291bnQAAAAAAAAAAAAAAAAABkRvbm9ycwAAAAAAAAAAAAAAAAANQmVuZWZpY2lhcmllcwAAAA==",
            "AAAAAAAAAAAAAAAPZ2V0X2Rvbm9yX2NvdW50AAAAAAAAAAABAAAABg==",
            "AAAAAAAAAAAAAAAPZ2V0X2Rvbm9yX3RvdGFsAAAAAAEAAAAAAAAABWRvbm9yAAAAAAAAEwAAAAEAAAAL",
            "AAAAAAAAAAAAAAATcmVjb3JkX2Rpc3RyaWJ1dGlvbgAAAAAEAAAAAAAAAAVkb25vcgAAAAAAABMAAAAAAAAADHRvdGFsX2Ftb3VudAAAAAsAAAAAAAAADWJlbmVmaWNpYXJpZXMAAAAAAAAQAAAAAAAAAAd0eF9oYXNoAAAAABAAAAAA",
            "AAAAAAAAAAAAAAAVZ2V0X2JlbmVmaWNpYXJ5X2NvdW50AAAAAAAAAAAAAAEAAAAG",
            "AAAAAAAAAAAAAAAVZ2V0X3RvdGFsX2Rpc3RyaWJ1dGVkAAAAAAAAAAAAAAEAAAAL"]), options);
        this.options = options;
    }
    fromJSON = {
        init: (this.txFromJSON),
        get_donor_count: (this.txFromJSON),
        get_donor_total: (this.txFromJSON),
        record_distribution: (this.txFromJSON),
        get_beneficiary_count: (this.txFromJSON),
        get_total_distributed: (this.txFromJSON)
    };
}
