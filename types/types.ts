import { PublicKey } from "@solana/web3.js";

export interface OwnedGame {
  gameId: string;
  gameModules: string[];
}

export declare type StorageAccountResponse = {
  shdw_bucket: string;
  transaction_signature: string;
};

export type OwnedStorageAccount = {
  publicKey: PublicKey;
  account: {
    immutable: boolean;
    toBeDeleted: boolean;
    deleteRequestEpoch: number;
    storage: any;
    owner1: PublicKey | PublicKey[];
    accountCounterSeed: number;
    creationTime: number;
    creationEpoch: number;
    lastFeeEpoch: number;
    identifier: string;
  };
};

export type ServiceCharge = {
  receiver: string;
  amount: number;
  token?: string;
};

export type NFTResponse = {
  success: boolean;
  message: string;
  result: {
    encoded_transaction: string;
    mint: string;
  };
};
