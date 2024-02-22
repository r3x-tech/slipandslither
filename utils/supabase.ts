import userStore from "@/stores/userStore";
import { supabase } from "@/supabaseClient";

export const getPlayersByWalletAddress = async (
  solana_wallet_address: string
) => {
  try {
    const { data, error } = await supabase
      .from("reload_slipandslither_players")
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
      .from("reload_slipandslither_players")
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

export const saveHighScore = async (currentScore: number) => {
  const walletAddress = userStore.getState().solana_wallet_address;

  if (walletAddress && walletAddress.trim() !== "") {
    // Fetch the current scores for the user
    const { data, error } = await supabase
      .from("reload_slipandslither_players")
      .select("saved_scores")
      .eq("solana_wallet_address", walletAddress);

    if (error) throw error;

    // If the user doesn't exist, add a new row
    if (data.length === 0) {
      const { error: insertError } = await supabase
        .from("reload_slipandslither_players")
        .insert([
          {
            solana_wallet_address: walletAddress,
            saved_scores: [currentScore],
          },
        ]);

      if (insertError) throw insertError;
    } else {
      let scores = data[0]?.saved_scores || []; // Extract scores array

      // If current score is higher than the lowest or there are less than 10 scores, insert new score
      if (scores.length < 10 || currentScore > Math.min(...scores)) {
        scores.push(currentScore); // Add new score to array
        scores.sort((a: number, b: number) => b - a); // Sort scores in descending order
        if (scores.length > 10) scores.length = 10; // If more than 10 scores, remove extras

        // Update scores in database
        const { error: updateError } = await supabase
          .from("reload_slipandslither_players")
          .update({ saved_scores: scores }) // Update scores array
          .eq("solana_wallet_address", walletAddress); // Where clause

        if (updateError) throw updateError;
      }
    }
  }
};

export interface Score {
  user: string;
  score: number;
  walletAddress: string;
}

export const getLeaderboard = async (): Promise<Score[]> => {
  // Get all players, their scores and wallet addresses
  const { data, error } = await supabase
    .from("reload_slipandslither_players")
    .select("username, saved_scores, solana_wallet_address");

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("No data received from the database.");
  }

  // Flatten the data to create an array with all scores and their associated usernames and wallet addresses
  let allScores: Score[] = data.flatMap((player) => {
    if (!player.saved_scores) return [];
    return player.saved_scores.map((score: any) => ({
      user: player.username,
      score: score,
      walletAddress: player.solana_wallet_address,
    }));
  });

  // Sort scores in descending order
  allScores.sort((a, b) => b.score - a.score);

  // Return only top 10 scores
  return allScores.slice(0, 10);
};
