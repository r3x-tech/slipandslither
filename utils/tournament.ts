import { Solana } from "@raindrop-studios/events-client";
import { AnchorProvider } from "@project-serum/anchor";
import { Connection } from "@solana/web3.js";
import { supabase } from "@/supabaseClient";
import { Wallet } from "@/types/Wallet";

export async function createTournament(
  tournamentName: string,
  participantLimit: number,
  wallet: Wallet,
  connection: Connection,
  entryFee: Solana.Rpc.Events.EntryFee,
  rewardAmount: number
): Promise<string> {
  // Create an Anchor Provider

  if (!wallet) {
    throw Error("provider not found");
  }
  console.log("wallet: ", wallet);

  const provider = new AnchorProvider(connection, wallet, {});
  console.log("provider: ", provider);

  if (!provider) {
    throw Error("provider not found");
  }
  // Initialize the tournament authority
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  console.log("passed authority: ", authority);

  try {
    // Create a tournament
    const tournamentPubkey = await authority.createTournament(
      "test",
      2,
      null,
      null
    );
    console.log("tournamentPubkey: ", tournamentPubkey);

    if (!tournamentPubkey) {
      throw new Error("Tournament unavailable");
    }

    console.log(
      "Tournament created successfully with pubkey: ",
      tournamentPubkey
    );

    // Add entry fee as a reward
    await authority.addEntryFeeAsReward(tournamentPubkey);

    console.log("Entry fee added as reward successfully");

    // Add an additional reward
    await authority.addReward(
      tournamentPubkey,
      "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
      rewardAmount.toString()
    );

    console.log("Additional reward added successfully");

    return tournamentPubkey;
  } catch (error) {
    console.error("Error creating tournament:", error);
    throw error;
  }
}

export async function enterTournament(
  tournamentPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<void> {
  // Create an Anchor Provider
  const provider = new AnchorProvider(connection, wallet, {});
  // Initialize the participant client
  const participant = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    // Enter the tournament
    await participant.enterTournament(tournamentPubkey);
    console.log("Successfully entered the tournament");
  } catch (error) {
    console.error("Error entering tournament:", error);
    throw error;
  }
}

export async function startTournament(
  tournamentPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<void> {
  // Create an Anchor Provider
  const provider = new AnchorProvider(connection, wallet, {});
  // Initialize the tournament authority
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    // Start the tournament
    await authority.startTournament(tournamentPubkey);
    console.log("Tournament started successfully");
  } catch (error) {
    console.error("Error starting tournament:", error);
    throw error;
  }
}

export async function getMatch(
  matchPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<any> {
  // Replace any with the appropriate type
  const provider = new AnchorProvider(connection, wallet, {});
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const matchData = await authority.getMatch(matchPubkey);
    console.log("Match Data:", matchData);
    return matchData;
  } catch (error) {
    console.error("Error getting match data:", error);
    throw error;
  }
}

export async function getMatchesByRound(
  tournamentPubkey: string,
  roundIndex: number,
  finalized: boolean,
  wallet: Wallet,
  connection: Connection
): Promise<any[]> {
  // Replace any[] with the appropriate type
  const provider = new AnchorProvider(connection, wallet, {});
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const matches = await authority.getMatchesByRound(
      tournamentPubkey,
      roundIndex,
      finalized
    );
    console.log("Matches:", matches);
    return matches;
  } catch (error) {
    console.error("Error getting matches by round:", error);
    throw error;
  }
}

export async function getMatchParticipants(
  tournamentPubkey: string,
  matchPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<string[]> {
  const provider = new AnchorProvider(connection, wallet, {});
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const participants = await authority.getMatchParticipants(
      tournamentPubkey,
      matchPubkey
    );
    console.log("Participants:", participants);
    return participants;
  } catch (error) {
    console.error("Error getting match participants:", error);
    throw error;
  }
}

export async function getParticipantsForRound(
  tournamentPubkey: string,
  roundIndex: number,
  wallet: Wallet,
  connection: Connection
): Promise<string[]> {
  const provider = new AnchorProvider(connection, wallet, {});
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const participants = await authority.getParticipantsForRound(
      tournamentPubkey,
      roundIndex
    );
    console.log("Participants for round:", participants);
    return participants;
  } catch (error) {
    console.error("Error getting participants for round:", error);
    throw error;
  }
}

export async function getTournamentStandings(
  tournamentPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<Map<string, number>> {
  // Create an Anchor Provider
  const provider = new AnchorProvider(connection, wallet, {});
  // Initialize the tournament authority
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const standings = await authority.getStandings(tournamentPubkey);
    console.log("Tournament standings retrieved successfully");
    return standings;
  } catch (error) {
    console.error("Error retrieving tournament standings:", error);
    throw error;
  }
}

export async function getTournamentDetails(
  tournamentPubkey: string,
  wallet: Wallet,
  connection: Connection
): Promise<any> {
  // Replace 'any' with the appropriate type for tournament details
  // Create an Anchor Provider
  const provider = new AnchorProvider(connection, wallet, {});
  // Initialize the tournament authority
  const authority = new Solana.Http.Tournaments.Client(
    provider,
    "mainnet-beta"
  );

  try {
    const tournamentData = await authority.getTournament(tournamentPubkey);
    console.log("Tournament details retrieved successfully");
    return tournamentData;
  } catch (error) {
    console.error("Error retrieving tournament details:", error);
    throw error;
  }
}

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
