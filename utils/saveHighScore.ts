// scoresService.ts
import userStore from "@/stores/userStore";
import { supabase } from "../supabaseClient";

export const saveHighScore = async (currentScore: number) => {
  const walletAddress = userStore.getState().solana_wallet_address;

  if (walletAddress && walletAddress.trim() !== "") {
    // Fetch the current scores for the user
    const { data, error } = await supabase
      .from("reload_bouncebackreloaded_players")
      .select("saved_scores")
      .eq("solana_wallet_address", walletAddress);

    if (error) throw error;

    // If the user doesn't exist, add a new row
    if (data.length === 0) {
      const { error: insertError } = await supabase
        .from("reload_bouncebackreloaded_players")
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
          .from("reload_bouncebackreloaded_players")
          .update({ saved_scores: scores }) // Update scores array
          .eq("solana_wallet_address", walletAddress); // Where clause

        if (updateError) throw updateError;
      }
    }
  }
};
