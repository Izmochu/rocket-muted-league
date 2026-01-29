import { supabase } from "@/lib/supabase";

/* ================================
   TYPES
================================ */

type PlayerRef = {
  id: string;
  username: string;
};

export type Challenge = {
  id: string;
  status: string;
  created_at: string;
  challenger_id: string;
  challenged_id: string;

  challenger: PlayerRef | null;
  challenged: PlayerRef | null;
};

/* ================================
   CREATE
================================ */

export async function createChallenge(
  challenger_id: string,
  challenged_id: string
) {
  const { error } = await supabase.from("challenges").insert({
    challenger_id,
    challenged_id,
    status: "pending",
  });

  if (error) throw error;
}

/* ================================
   READ
================================ */

// Para el Admin: Ver TODOS
export async function getAllChallenges(): Promise<Challenge[]> {
  // AQUI EL CAMBIO: Usamos challenges_challenger_fk y challenges_challenged_fk
  const { data, error } = await supabase
    .from("challenges")
    .select(`
      *,
      challenger:players!challenges_challenger_fk ( id, username ),
      challenged:players!challenges_challenged_fk ( id, username )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  return (data ?? []).map((c: any) => ({
    ...c,
    challenger: Array.isArray(c.challenger) ? c.challenger[0] : c.challenger,
    challenged: Array.isArray(c.challenged) ? c.challenged[0] : c.challenged,
  }));
}

export async function getPendingChallenges(): Promise<Challenge[]> {
  // AQUI TAMBIEN
  const { data, error } = await supabase
    .from("challenges")
    .select(`
      *,
      challenger:players!challenges_challenger_fk ( id, username ),
      challenged:players!challenges_challenged_fk ( id, username )
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  return (data ?? []).map((c: any) => ({
    ...c,
    challenger: Array.isArray(c.challenger) ? c.challenger[0] : c.challenger,
    challenged: Array.isArray(c.challenged) ? c.challenged[0] : c.challenged,
  }));
}

export async function getAcceptedChallenges(): Promise<Challenge[]> {
  // Y AQUI TAMBIEN
  const { data, error } = await supabase
    .from("challenges")
    .select(`
      *,
      challenger:players!challenges_challenger_fk ( id, username ),
      challenged:players!challenges_challenged_fk ( id, username )
    `)
    .eq("status", "accepted")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((c: any) => ({
    ...c,
    challenger: Array.isArray(c.challenger) ? c.challenger[0] : c.challenger,
    challenged: Array.isArray(c.challenged) ? c.challenged[0] : c.challenged,
  }));
}

/* ================================
   UPDATE / DELETE
================================ */

export async function deleteChallenge(id: string) {
  const { error } = await supabase.from("challenges").delete().eq("id", id);
  if (error) throw error;
}