import { Wallet } from "@project-serum/anchor";
import {
  createV1 as createNFT,
  CreateV1InstructionAccounts,
  CreateV1InstructionArgs,
  mintV1 as mintNFT,
  mplTokenMetadata,
  TokenStandard,
  verifyCollectionV1,
  verifyCreatorV1,
  MPL_TOKEN_METADATA_PROGRAM_ID,
  findMetadataPda,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  Pda,
  PublicKey as MetaplexPublicKey,
  Signer,
  generateSigner,
  percentAmount,
  createSignerFromKeypair,
  publicKey,
  Keypair as MetaplexKeypair,
  keypairIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { Keypair, PublicKey } from "@solana/web3.js";
import toast from "react-hot-toast";

interface CreateNFTParams {
  name: string;
  symbol: string;
  uri: string;
  royaltyPercent: number;
  parentCollectionAddress: string;
}

export async function createCollectionNFT({
  name,
  symbol,
  uri,
  royaltyPercent,
  parentCollectionAddress,
}: CreateNFTParams): Promise<{ address: Pda | MetaplexPublicKey }> {
  // console.log("rpc:", process.env.NEXT_PUBLIC_DEVNET_RPC_URL);
  // console.log("w1sk:", process.env.NEXT_PUBLIC_W1SK);
  // console.log("w2sk:", process.env.NEXT_PUBLIC_W2SK);
  console.log("Creating Collection...");

  const rpc = process.env.NEXT_PUBLIC_DEVNET_RPC_URL!;
  const umi = createUmi(rpc);

  const kp1 = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_W1SK!));
  const creatorOneKeypair = umi.eddsa.createKeypairFromSecretKey(kp1.secretKey);
  umi.use(keypairIdentity(creatorOneKeypair));
  umi.use(mplTokenMetadata());

  const kp2 = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_W2SK!));
  const creatorTwoKeypair = umi.eddsa.createKeypairFromSecretKey(kp2.secretKey);

  const mint = generateSigner(umi);
  umi.use(keypairIdentity(creatorOneKeypair));

  let createNFTParams: CreateV1InstructionAccounts & CreateV1InstructionArgs = {
    mint,
    name,
    symbol,
    uri,
    sellerFeeBasisPoints: percentAmount(royaltyPercent),
    isMutable: true,
    tokenStandard: TokenStandard.ProgrammableNonFungible,
    isCollection: true,
    creators: [
      {
        address: creatorOneKeypair.publicKey,
        verified: false,
        share: 100,
      },
    ],
  };

  if (parentCollectionAddress && parentCollectionAddress.trim().length > 0) {
    console.log("parentCollectionAddress 2: ", parentCollectionAddress);

    createNFTParams.collection = {
      verified: false,
      key: publicKey(parentCollectionAddress),
    };
  }

  console.log("createNFTParams 2: ", createNFTParams);

  const createResult = await createNFT(umi, createNFTParams).sendAndConfirm(
    umi,
    { send: { skipPreflight: true } }
  );
  console.log("Create NFT Result:", createResult);

  return { address: mint.publicKey };
}

interface MintNFTParams {
  mint: Pda | MetaplexPublicKey;
  receiver: number;
}

export async function mintCollectionNFT({
  mint,
  receiver,
}: MintNFTParams): Promise<void> {
  // console.log("rpc:", process.env.NEXT_PUBLIC_DEVNET_RPC_URL);
  // console.log("w1sk:", process.env.NEXT_PUBLIC_W1SK);
  // console.log("w2sk:", process.env.NEXT_PUBLIC_W2SK);
  // console.log("w3sk:", process.env.NEXT_PUBLIC_W3SK);
  console.log("Minting Collection...");

  const rpc = process.env.NEXT_PUBLIC_DEVNET_RPC_URL!;
  const umi = createUmi(rpc);

  const kp1 = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_W1SK!));
  const creatorOneKeypair = umi.eddsa.createKeypairFromSecretKey(kp1.secretKey);

  umi.use(keypairIdentity(creatorOneKeypair));
  umi.use(mplTokenMetadata());

  const kp2 = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_W2SK!));
  const creatorTwoKeypair = umi.eddsa.createKeypairFromSecretKey(kp2.secretKey);

  const kp3 = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_W3SK!));
  const creatorThreeKeypair = umi.eddsa.createKeypairFromSecretKey(
    kp3.secretKey
  );

  const authority = createSignerFromKeypair(umi, creatorOneKeypair);

  let tokenReceiver = creatorThreeKeypair;
  if (receiver == 1) {
    tokenReceiver = creatorOneKeypair;
  } else if (receiver == 3) {
    tokenReceiver = creatorThreeKeypair;
  } else {
    console.error("Invalid recipient:", receiver);
    toast.error("Invalid recipient");
  }

  const mintResult = await mintNFT(umi, {
    mint: mint,
    authority: authority,
    amount: 1,
    tokenOwner: tokenReceiver.publicKey,
    tokenStandard: TokenStandard.ProgrammableNonFungible,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });

  console.log("Mint NFT Result:", mintResult);
}

interface VerifyCollectionParams {
  metadataAddy: string;
  collectionMintAddy: string;
}

export async function verifyCollection({
  metadataAddy,
  collectionMintAddy,
}: VerifyCollectionParams): Promise<void> {
  // console.log("rpc:", process.env.NEXT_PUBLIC_DEVNET_RPC_URL);
  // console.log("w1sk:", process.env.NEXT_PUBLIC_W1SK);
  console.log("Verifying Collection...");

  const rpc = process.env.NEXT_PUBLIC_DEVNET_RPC_URL!;
  const umi = createUmi(rpc);

  const kp1 = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_W1SK!));
  const collectionAuthorityKeypair = umi.eddsa.createKeypairFromSecretKey(
    kp1.secretKey
  );
  umi.use(keypairIdentity(collectionAuthorityKeypair));
  umi.use(mplTokenMetadata());

  const authority = createSignerFromKeypair(umi, collectionAuthorityKeypair);

  const metadataPda = findMetadataPda(umi, {
    mint: publicKey(metadataAddy),
  });
  console.log("NFT metadataPda verifyCollection: ", metadataPda);

  const verifyResult = await verifyCollectionV1(umi, {
    metadata: metadataPda,
    collectionMint: publicKey(collectionMintAddy),
    authority: authority,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  console.log("Verify Collection Result:", verifyResult);

  if (verifyResult.result.value.err !== null) {
    console.error(
      "Error with collection verification: ",
      verifyResult.result.value.err
    );
  }
}

interface VerifyCreatorsParams {
  metadataAddy: string;
}

export async function verifyCreators({
  metadataAddy,
}: VerifyCreatorsParams): Promise<void> {
  // console.log("rpc:", process.env.NEXT_PUBLIC_DEVNET_RPC_URL);
  console.log("Verifying Creators...");

  const rpc = process.env.NEXT_PUBLIC_DEVNET_RPC_URL!;
  const umi = createUmi(rpc);

  const kp1 = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_W1SK!));
  const creatorOneKeypair = umi.eddsa.createKeypairFromSecretKey(kp1.secretKey);

  const kp2 = Keypair.fromSecretKey(bs58.decode(process.env.NEXT_PUBLIC_W2SK!));
  const creatorTwoKeypair = umi.eddsa.createKeypairFromSecretKey(kp2.secretKey);

  umi.use(keypairIdentity(creatorOneKeypair));
  umi.use(mplTokenMetadata());

  const creatorOneAuthority = createSignerFromKeypair(umi, creatorOneKeypair);
  const creatorTwoAuthority = createSignerFromKeypair(umi, creatorTwoKeypair);

  const metadataPda = findMetadataPda(umi, {
    mint: publicKey(metadataAddy),
  });
  console.log("NFT metadataPda verifyCreators: ", metadataPda);

  // const metadataAddress = publicKey(metadataAddy);

  const verifyResult1 = await verifyCreatorV1(umi, {
    metadata: metadataPda,
    authority: creatorOneAuthority,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  console.log("Verify Creator Result 1:", verifyResult1);

  umi.use(keypairIdentity(creatorTwoKeypair));

  const verifyResult2 = await verifyCreatorV1(umi, {
    metadata: metadataPda,
    authority: creatorTwoAuthority,
  }).sendAndConfirm(umi, { send: { skipPreflight: true } });
  console.log("Verify Creator Result 2:", verifyResult2);

  if (verifyResult1.result.value.err !== null) {
    console.log("Failed to verify creator 1: ", verifyResult1.result.value.err);
    toast.error("Failed to verify creator! 0x1");
  }

  if (verifyResult2.result.value.err !== null) {
    console.log("Failed to verify creator 2: ", verifyResult2.result.value.err);
    toast.error("Failed to verify creator! 0x2");
  } else if (
    verifyResult1.result.value == null &&
    verifyResult2.result.value == null
  ) {
    console.log("Creators verified.");
    toast.success("Creators verified!");
  }
}

export function findMetadataAccountSync(nftMintAddress: string): PublicKey {
  const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
    MPL_TOKEN_METADATA_PROGRAM_ID
  ); // Replace with actual TOKEN_METADATA_PROGRAM_ID

  console.log("Finding metadata using nftMintAddress:", nftMintAddress);

  // Convert inputs to the required format
  const seeds = [
    Buffer.from("metadata"),
    TOKEN_METADATA_PROGRAM_ID.toBuffer(),
    new PublicKey(nftMintAddress).toBuffer(),
  ];

  // Use the synchronous method to find the program address
  const [metadataAccountAddress, nonce] = PublicKey.findProgramAddressSync(
    seeds,
    TOKEN_METADATA_PROGRAM_ID
  );

  console.log("Found metadataAccountAddress:", metadataAccountAddress);
  return metadataAccountAddress;
}
