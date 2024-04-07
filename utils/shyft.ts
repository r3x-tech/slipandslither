import { NFT, ServiceCharge, TxResponse } from "@/types/types";
import axios, { AxiosResponse } from "axios";

export async function getUSDCBalance(walletAddress: string): Promise<any> {
  const endpoint = "https://api.shyft.to/sol/v1/wallet/token_balance";
  const apiKey = process.env.NEXT_PUBLIC_S_KEY!;
  const network = "devnet";
  const token = process.env.NEXT_PUBLIC_SOL_USDC_MAINNET!; // USDC token address on Solana devnet

  try {
    const params = new URLSearchParams({
      network,
      wallet: walletAddress,
      token,
    });

    const response = await axios.get(`${endpoint}?${params.toString()}`, {
      headers: {
        "x-api-key": apiKey,
      },
    });

    console.log("response: ", response.data);

    return response.data;
  } catch (error) {
    console.error("Error fetching USDC balance:", error);
    return null;
  }
}

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
