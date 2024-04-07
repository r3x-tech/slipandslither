// typescript
import axios from "axios";

export async function fetchNFTsByCreator(creatorAddress: string): Promise<any> {
  const baseUrl = process.env.NEXT_PUBLIC_RPC_URL;

  const endpoint = `${baseUrl}/?api-key=eb9afd3c-c061-44b3-846e-2765b5c949ba/v1/assets/by-creator`;
  const apiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY;

  const headers = {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  };

  try {
    const response = await axios.get(endpoint, {
      headers: headers,
      params: { creator: creatorAddress },
    });

    const responseData = response.data;
    if (responseData.success) {
      return responseData.data;
    } else {
      console.error("Error fetching NFTs:", responseData.message);
      return null;
    }
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}
