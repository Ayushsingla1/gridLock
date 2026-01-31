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
  //@ts-ignore Buffer existsA
  window.Buffer = window.Buffer || Buffer;
}

export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CDOI6BF4UT2DGZIDTQBLBLHL7Y6NVFO7JPPCYIW7ENO2JX7YLUROB2EP",
  },
} as const;

export interface Bet {
  no_shares: u128;
  yes_shares: u128;
}

export interface Game {
  finished: boolean;
  game_id: string;
  no_shares: u128;
  total_pool: i128;
  winner: u32;
  yes_shares: u128;
}

export const Errors = {
  1: { message: "GameExists" },
  2: { message: "NoSuchGame" },
  3: { message: "GameFinished" },
  4: { message: "InvalidBet" },
  5: { message: "InvalidResult" },
  6: { message: "InsufficientAmount" },
  7: { message: "NotFinished" },
  8: { message: "NoWinnings" },
  9: { message: "NoTotalWinningShares" },
  10: { message: "Unauthorized" },
  11: { message: "InvalidShares" },
};

export type DataKey =
  | { tag: "Owner"; values: void }
  | { tag: "UsdContract"; values: void }
  | { tag: "Game"; values: readonly [string] }
  | { tag: "Bet"; values: readonly [string, string] }
  | { tag: "Stakers"; values: readonly [string] };

export interface Client {
  /**
   * Construct and simulate a redeem transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Redeem winnings
   */
  redeem: (
    { user, game_id }: { user: string; game_id: string },
    options?: MethodOptions,
  ) => Promise<AssembledTransaction<Result<i128>>>;

  /**
   * Construct and simulate a get_bet transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get bet information for a user
   */
  get_bet: (
    { game_id, user }: { game_id: string; user: string },
    options?: MethodOptions,
  ) => Promise<AssembledTransaction<Result<readonly [u128, u128]>>>;

  /**
   * Construct and simulate a get_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get game information
   */
  get_game: (
    { game_id }: { game_id: string },
    options?: MethodOptions,
  ) => Promise<
    AssembledTransaction<
      Result<readonly [string, boolean, u32, u128, u128, u32, i128]>
    >
  >;

  /**
   * Construct and simulate a get_amount transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the amount needed to buy shares
   */
  get_amount: (
    { game_id, bet, shares }: { game_id: string; bet: u32; shares: u128 },
    options?: MethodOptions,
  ) => Promise<AssembledTransaction<Result<u128>>>;

  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  initialize: (
    { owner, usd_contract }: { owner: string; usd_contract: string },
    options?: MethodOptions,
  ) => Promise<AssembledTransaction<null>>;

  /**
   * Construct and simulate a create_game transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_game: (
    { owner, game_id }: { owner: string; game_id: string },
    options?: MethodOptions,
  ) => Promise<AssembledTransaction<Result<void>>>;

  /**
   * Construct and simulate a stake_amount transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Stake an amount on a bet
   */
  stake_amount: (
    {
      staker,
      game_id,
      shares,
      bet,
      amount,
    }: {
      staker: string;
      game_id: string;
      shares: u128;
      bet: u32;
      amount: i128;
    },
    options?: MethodOptions,
  ) => Promise<AssembledTransaction<Result<readonly [u128, i128, i128]>>>;

  /**
   * Construct and simulate a result_announced transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Announce result (only owner)
   */
  result_announced: (
    { owner, game_id, result }: { owner: string; game_id: string; result: u32 },
    options?: MethodOptions,
  ) => Promise<AssembledTransaction<Result<void>>>;
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
      },
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options);
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([
        "AAAAAQAAAAAAAAAAAAAAA0JldAAAAAACAAAAAAAAAAlub19zaGFyZXMAAAAAAAAKAAAAAAAAAAp5ZXNfc2hhcmVzAAAAAAAK",
        "AAAAAQAAAAAAAAAAAAAABEdhbWUAAAAGAAAAAAAAAAhmaW5pc2hlZAAAAAEAAAAAAAAAB2dhbWVfaWQAAAAAEAAAAAAAAAAJbm9fc2hhcmVzAAAAAAAACgAAAAAAAAAKdG90YWxfcG9vbAAAAAAACwAAAAAAAAAGd2lubmVyAAAAAAAEAAAAAAAAAAp5ZXNfc2hhcmVzAAAAAAAK",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAACwAAAAAAAAAKR2FtZUV4aXN0cwAAAAAAAQAAAAAAAAAKTm9TdWNoR2FtZQAAAAAAAgAAAAAAAAAMR2FtZUZpbmlzaGVkAAAAAwAAAAAAAAAKSW52YWxpZEJldAAAAAAABAAAAAAAAAANSW52YWxpZFJlc3VsdAAAAAAAAAUAAAAAAAAAEkluc3VmZmljaWVudEFtb3VudAAAAAAABgAAAAAAAAALTm90RmluaXNoZWQAAAAABwAAAAAAAAAKTm9XaW5uaW5ncwAAAAAACAAAAAAAAAAUTm9Ub3RhbFdpbm5pbmdTaGFyZXMAAAAJAAAAAAAAAAxVbmF1dGhvcml6ZWQAAAAKAAAAAAAAAA1JbnZhbGlkU2hhcmVzAAAAAAAACw==",
        "AAAAAgAAAAAAAAAAAAAAB0RhdGFLZXkAAAAABQAAAAAAAAAAAAAABU93bmVyAAAAAAAAAAAAAAAAAAALVXNkQ29udHJhY3QAAAAAAQAAAAAAAAAER2FtZQAAAAEAAAAQAAAAAQAAAAAAAAADQmV0AAAAAAIAAAAQAAAAEwAAAAEAAAAAAAAAB1N0YWtlcnMAAAAAAQAAABA=",
        "AAAAAAAAAA9SZWRlZW0gd2lubmluZ3MAAAAABnJlZGVlbQAAAAAAAgAAAAAAAAAEdXNlcgAAABMAAAAAAAAAB2dhbWVfaWQAAAAAEAAAAAEAAAPpAAAACwAAAAM=",
        "AAAAAAAAAB5HZXQgYmV0IGluZm9ybWF0aW9uIGZvciBhIHVzZXIAAAAAAAdnZXRfYmV0AAAAAAIAAAAAAAAAB2dhbWVfaWQAAAAAEAAAAAAAAAAEdXNlcgAAABMAAAABAAAD6QAAA+0AAAACAAAACgAAAAoAAAAD",
        "AAAAAAAAABRHZXQgZ2FtZSBpbmZvcm1hdGlvbgAAAAhnZXRfZ2FtZQAAAAEAAAAAAAAAB2dhbWVfaWQAAAAAEAAAAAEAAAPpAAAD7QAAAAcAAAAQAAAAAQAAAAQAAAAKAAAACgAAAAQAAAALAAAAAw==",
        "AAAAAAAAACNHZXQgdGhlIGFtb3VudCBuZWVkZWQgdG8gYnV5IHNoYXJlcwAAAAAKZ2V0X2Ftb3VudAAAAAAAAwAAAAAAAAAHZ2FtZV9pZAAAAAAQAAAAAAAAAANiZXQAAAAABAAAAAAAAAAGc2hhcmVzAAAAAAAKAAAAAQAAA+kAAAAKAAAAAw==",
        "AAAAAAAAAAAAAAAKaW5pdGlhbGl6ZQAAAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAx1c2RfY29udHJhY3QAAAATAAAAAA==",
        "AAAAAAAAAAAAAAALY3JlYXRlX2dhbWUAAAAAAgAAAAAAAAAFb3duZXIAAAAAAAATAAAAAAAAAAdnYW1lX2lkAAAAABAAAAABAAAD6QAAAAIAAAAD",
        "AAAAAAAAABhTdGFrZSBhbiBhbW91bnQgb24gYSBiZXQAAAAMc3Rha2VfYW1vdW50AAAABQAAAAAAAAAGc3Rha2VyAAAAAAATAAAAAAAAAAdnYW1lX2lkAAAAABAAAAAAAAAABnNoYXJlcwAAAAAACgAAAAAAAAADYmV0AAAAAAQAAAAAAAAABmFtb3VudAAAAAAACwAAAAEAAAPpAAAD7QAAAAMAAAAKAAAACwAAAAsAAAAD",
        "AAAAAAAAABxBbm5vdW5jZSByZXN1bHQgKG9ubHkgb3duZXIpAAAAEHJlc3VsdF9hbm5vdW5jZWQAAAADAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAAB2dhbWVfaWQAAAAAEAAAAAAAAAAGcmVzdWx0AAAAAAAEAAAAAQAAA+kAAAACAAAAAw==",
      ]),
      options,
    );
  }
  public readonly fromJSON = {
    redeem: this.txFromJSON<Result<i128>>,
    get_bet: this.txFromJSON<Result<readonly [u128, u128]>>,
    get_game: this.txFromJSON<
      Result<readonly [string, boolean, u32, u128, u128, u32, i128]>
    >,
    get_amount: this.txFromJSON<Result<u128>>,
    initialize: this.txFromJSON<null>,
    create_game: this.txFromJSON<Result<void>>,
    stake_amount: this.txFromJSON<Result<readonly [u128, i128, i128]>>,
    result_announced: this.txFromJSON<Result<void>>,
  };
}
