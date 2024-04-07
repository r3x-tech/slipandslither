import { ServiceCharge } from "@/types/types";
import axios, { AxiosResponse } from "axios";

export async function getUSDCBalance(walletAddress: string): Promise<any> {
  const endpoint = "https://api.shyft.to/sol/v1/wallet/token_balance";
  const apiKey = process.env.NEXT_PUBLIC_S_KEY!;
  const network = "mainnet-beta";
  const token = process.env.NEXT_PUBLIC_SOL_USDC_MAINNET!; // USDC token address on Solana mainnet-beta

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
