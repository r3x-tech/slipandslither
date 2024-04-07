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

export type TxResponse = {
  result: {
    encoded_transaction: string;
    mint: string;
  };
};

export interface Creator {
  address: string;
  share: number;
  verified: boolean;
}

export interface NFT {
  name: string;
  symbol: string;
  royalty: number;
  image_uri: string;
  cached_image_uri: string;
  animation_url: string;
  cached_animation_url: string;
  metadata_uri: string;
  description: string;
  mint: string;
  owner: string;
  update_authority: string;
  creators: Creator[];
  collection: {
    name: string;
    family: string;
  };
  attributes: { [key: string]: string };
  attributes_array: Array<{ trait_type: string; value: string }>;
  files: Array<{ uri: string; type: string }>;
  external_url: string;
  is_loaded_metadata: boolean;
  primary_sale_happened: boolean;
  is_mutable: boolean;
}

export interface WalletNFTResponse {
  success: boolean;
  message: string;
  result: {
    nfts: NFT[];
    total_count: number;
    page: number;
    size: number;
    total_pages: number;
  };
}
