import { supabase } from "@/lib/supabase";

/* ================================
   TYPES
================================ */

export type PlayerRef = {
  id: string;
  username: string;
};

export type Match = {
  id: string;
  score_p1: number;
  score_p2: number;
  played_at: string | null;
  created_at: string;
  
  player1_id: string;
  player2_id: string;
  winner_id: string | null; // <--- AÑADIDO ESTO PARA QUE NO FALLE EL CÁLCULO

  player1: PlayerRef | null;
  player2: PlayerRef | null;
  winner: PlayerRef | null;
};

/* ================================
   CREATE
================================ */

export async function createMatch(input: {
  player1_id: string;
  player2_id: string;
  score_p1: number;
  score_p2: number;
  created_by: string;
  played_at?: string;
  challenge_id?: string;
}) {
  const {
    player1_id,
    player2_id,
    score_p1,
    score_p2,
    created_by,
    played_at,
    challenge_id,
  } = input;

  if (score_p1 === score_p2) {
    throw new Error("Match cannot end in a draw");
  }

  const winner_id = score_p1 > score_p2 ? player1_id : player2_id;

  const { error } = await supabase.from("matches").insert({
    player1_id,
    player2_id,
    score_p1,
    score_p2,
    winner_id,
    created_by,
    played_at: played_at ?? new Date().toISOString(),
  });

  if (error) throw error;

  if (challenge_id) {
    const { error: challengeError } = await supabase
      .from("challenges")
      .update({ status: "played" })
      .eq("id", challenge_id);

    if (challengeError) throw challengeError;
  }
}

/* ================================
   READ
================================ */

export async function getMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      player1:players!matches_player1_fk ( id, username ),
      player2:players!matches_player2_fk ( id, username ),
      winner:players!matches_winner_fk ( id, username )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((m: any) => ({
    ...m,
    player1: Array.isArray(m.player1) ? m.player1[0] : m.player1,
    player2: Array.isArray(m.player2) ? m.player2[0] : m.player2,
    winner: Array.isArray(m.winner) ? m.winner[0] : m.winner,
  }));
}

export async function getRecentMatches(limit = 10): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      player1:players!matches_player1_fk ( id, username ),
      player2:players!matches_player2_fk ( id, username ),
      winner:players!matches_winner_fk ( id, username )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) throw error;

  return (data ?? []).map((m: any) => ({
    ...m,
    player1: Array.isArray(m.player1) ? m.player1[0] : m.player1,
    player2: Array.isArray(m.player2) ? m.player2[0] : m.player2,
    winner: Array.isArray(m.winner) ? m.winner[0] : m.winner,
  }));
}

/* ================================
   DELETE
================================ */

export async function deleteMatch(id: string) {
  const { error } = await supabase.from("matches").delete().eq("id", id);
  if (error) throw error;
}