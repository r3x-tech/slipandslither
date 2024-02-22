import { supabase } from "../supabaseClient";

export interface Tournament {
  id: number;
  game_name: string;
  tournament_name: string;
  start_datetime: string;
  end_datetime: string;
  tournament_link: string;
}

export async function getTournamentsByGameName(
  gameName: string
): Promise<Tournament[]> {
  let { data, error } = await supabase
    .from("reload_tournaments")
    .select(
      `
    id,
    game_name,
    tournament_name,
    start_datetime,
    end_datetime,
    tournament_link
  `
    )
    .eq("game_name", gameName);

  if (error) {
    console.error("Error loading tournaments", error);
    return [];
  }
  return data || [];
}

// Usage:
// const meteorCrashTournaments = await getTournamentsByGameName("Meteor Crash");
