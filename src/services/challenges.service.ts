import { supabase } from "@/lib/supabase";

/* ================================
   TYPES
================================ */

type RegionRef = {
  code: string;
  name: string;
};

type PlayerRef = {
  id: string;
  username: string;
  // Añadimos la relación con región
  region?: RegionRef | null;
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

// Para el Admin: Ver TODOS con Regiones
export async function getAllChallenges(): Promise<Challenge[]> {
  const { data, error } = await supabase
    .from("challenges")
    .select(`
      *,
      challenger:players!challenges_challenger_fk ( 
        id, 
        username,
        region:regions!players_region_fkey ( code, name )
      ),
      challenged:players!challenges_challenged_fk ( 
        id, 
        username,
        region:regions!players_region_fkey ( code, name )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;
  
  // Aplanamos la estructura arrays que a veces devuelve supabase
  return (data ?? []).map((c: any) => ({
    ...c,
    challenger: Array.isArray(c.challenger) ? c.challenger[0] : c.challenger,
    challenged: Array.isArray(c.challenged) ? c.challenged[0] : c.challenged,
    // Aseguramos que las regiones dentro de los players también estén planas si son arrays
    ...(c.challenger && {
       challenger: {
         ...c.challenger,
         region: Array.isArray(c.challenger.region) ? c.challenger.region[0] : c.challenger.region
       }
    }),
    ...(c.challenged && {
      challenged: {
        ...c.challenged,
        region: Array.isArray(c.challenged.region) ? c.challenged.region[0] : c.challenged.region
      }
   })
  }));
}

export async function getPendingChallenges(): Promise<Challenge[]> {
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