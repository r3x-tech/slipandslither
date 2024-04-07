// import { generateSigner, percentAmount } from "@metaplex-foundation/umi";
// import { createNft } from "@metaplex-foundation/mpl-token-metadata";
import {
  NFT,
  NFTResponse,
  ServiceCharge,
  TxResponse,
  WalletNFTResponse,
} from "@/types/types";
import { apiRequest } from ".";
import axios from "axios";
import { Connection, Transaction, VersionedTransaction } from "@solana/web3.js";

export async function createNFTFromMetadata(
  metadataUri: string,
  receiver: string,
  feePayer: string,
  maxSupply?: number,
  serviceCharge?: ServiceCharge,
  collectionAddress?: string
): Promise<TxResponse | null> {
  const endpoint = "https://api.shyft.to/sol/v1/nft/create_from_metadata";
  const apiKey = process.env.NEXT_PUBLIC_S_KEY;
  const headers = {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };

  const requestBody = {
    network: "mainnet-beta",
    metadata_uri: metadataUri,
    ...(maxSupply && { max_supply: maxSupply }),
    ...(collectionAddress && { collection_address: collectionAddress }),
    receiver: receiver,
    fee_payer: feePayer,
    ...(serviceCharge && { service_charge: serviceCharge }),
  };

  try {
    console.log("5.0");

    const response = await axios.post(endpoint, requestBody, {
      headers: headers,
    });
    const responseData = response.data;

    if (responseData.success) {
      console.log("5.2 - responseData: ", responseData);
      return responseData;
    } else {
      console.log("5.3 - responseData: ", responseData);
      throw Error("Error creating NFT:", responseData.message);
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

export async function signAndSendTransaction(
  encodedTx: string,
  connection: Connection | null,
  signTransaction: any
) {
  try {
    if (!connection) {
      throw Error("No wallet connection");
    }
    if (!signTransaction) {
      throw Error("Signing tx unavailable");
    }
    const recoveredTransaction = Transaction.from(
      Buffer.from(encodedTx, "base64")
    );
    // const recoveredTransaction = getRawTransaction(encodedTx);
    const signedTx = await signTransaction(recoveredTransaction);
    console.log(
      "signed tx: ",
      Buffer.from(signedTx!.serialize()).toString("base64")
    );
    const txnSignature = await connection.sendRawTransaction(
      signedTx.serialize()
    );
    return txnSignature;
  } catch (error) {
    console.error("Error signing transaction:", error);
    throw error;
  }
}

export async function fetchNFTsFromWallet(
  walletAddress: string,
  collectionAddresses: string[]
): Promise<NFT[]> {
  const endpoint = "https://api.shyft.to/sol/v2/nft/read_all";
  const apiKey = process.env.NEXT_PUBLIC_S_KEY;
  let allMatchingNfts: NFT[] = [];
  let currentPage = 1;

  try {
    while (true) {
      const params = {
        network: "mainnet-beta",
        address: walletAddress,
        page: currentPage,
      };

      const response = await axios.get<any>(endpoint, {
        headers: {
          "x-api-key": apiKey,
        },
        params: params,
      });

      const fetchedNfts = response.data.result.nfts;
      console.log("fetchedNfts: ", fetchedNfts);

      console.log("fetchedNfts 0 collection: ", fetchedNfts[0].collection);

      const matchingNfts = fetchedNfts.filter(
        (nft: { collection?: { address?: string } }) =>
          nft.collection?.address &&
          collectionAddresses.includes(nft.collection.address)
      );

      allMatchingNfts = [...allMatchingNfts, ...matchingNfts];

      if (currentPage >= response.data.result.total_pages) {
        break;
      }

      currentPage++;
    }
    console.log("allMatchingNfts:", allMatchingNfts);

    return allMatchingNfts;
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    throw error;
  }
}

function getRawTransaction(
  encodedTransaction: string
): Transaction | VersionedTransaction {
  let recoveredTransaction: Transaction | VersionedTransaction;
  try {
    recoveredTransaction = Transaction.from(
      Buffer.from(encodedTransaction, "base64")
    );
  } catch (error) {
    recoveredTransaction = VersionedTransaction.deserialize(
      Buffer.from(encodedTransaction, "base64")
    );
  }
  return recoveredTransaction;
}

export const uploadCollectionMetadata = async (metadata: []) => {
  // const collectionNFTMetadata = {
  //     name: `${metadata[0]!.collectionName}`,
  //     symbol: `${metadata[0]!.symbol}`,
  //     description: `${metadata[0]!.description}`,
  //     image: `${imageUri}`,
  //     attributes: [
  //       {
  //         trait_type: "Location",
  //         value: `${rackLocation}`,
  //       },
  //       {
  //         trait_type: "Radius",
  //         value: `${rackRadius}`,
  //       },
  //       {
  //         trait_type: "Creator Link",
  //         value: `${creatorLink}`,
  //       },
  //     ],
  //     properties: {
  //       files: [
  //         {
  //           type: "image/jpg",
  //           uri: `${imageUri}`,
  //         },
  //       ],
  //     },
  //   };

  const response = await fetch("url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ metadata }),
    redirect: "follow",
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error(`Failed to create collection NFT. Error: ${errorMessage}`);
  }

  return await response.json();
};

export const createCollectionNFT = async (metadata: []) => {
  const response = await fetch("url", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ metadata }),
    redirect: "follow",
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    console.error(`Failed to create collection NFT. Error: ${errorMessage}`);
  }

  return await response.json();
};
