import { supabase } from "@/supabaseClient";

export const getPlayersByWalletAddress = async (
  solana_wallet_address: string
) => {
  try {
    const { data, error } = await supabase
      .from("reload_bouncebackreloaded_players")
      .select("*")
      .eq("solana_wallet_address", solana_wallet_address)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        throw Error("PGRST116");
      }
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching waitlist entry:", error);
    return null;
  }
};

export const insertPlayerEntry = async (
  username: string,
  login_type: string,
  solana_wallet_address: string,
  ip_address: string
) => {
  try {
    const { data, error } = await supabase
      .from("reload_bouncebackreloaded_players")
      .insert([
        {
          username: username,
          solana_wallet_address: solana_wallet_address,
          login_type: login_type,
          ip_address: ip_address,
        },
      ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error inserting login entry:", error);
    return null;
  }
};
