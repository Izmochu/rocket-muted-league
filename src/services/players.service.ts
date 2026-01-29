import { supabase } from "@/lib/supabase";

/* =======================
   TYPES
======================= */

export type Rank = {
  id: number;
  name: string;
  code: string;
  tier_order: number;
};

export type Region = {
  code: string;
  name: string;
  sort_order: number;
};

export type Player = {
  id: string;
  username: string;
  epic_id: string | null;
  
  region_code: string | null;
  rank_1v1_id: number | null;
  
  region?: Region | null;
  rank?: Rank | null;

  is_admin: boolean;
  created_at: string;
};

/* =======================
   AUXILIARY DATA
======================= */

export async function getRanks(): Promise<Rank[]> {
  const { data, error } = await supabase
    .from("ranks")
    .select("*")
    .order("tier_order", { ascending: true });

  if (error) throw error;
  return data;
}

export async function getRegions(): Promise<Region[]> {
  const { data, error } = await supabase
    .from("regions")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data;
}

/* =======================
   CORE CRUD
======================= */

export async function getPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select(`
      *,
      region:regions!players_region_fkey(*),
      rank:ranks!players_rank_1v1_fkey(*)
    `)
    .order("created_at", { ascending: true });

  if (error) throw error;
  
  return (data ?? []).map((p: any) => ({
    ...p,
    region: Array.isArray(p.region) ? p.region[0] : p.region,
    rank: Array.isArray(p.rank) ? p.rank[0] : p.rank
  }));
}

// RECUPERADA Y MEJORADA: Ordena por ranking para el Top Players
export async function getRankings(): Promise<Player[]> {
  const players = await getPlayers();
  
  // Ordenar por tier_order descendente (asumiendo que mayor tier es mejor, o al revés según tu lógica)
  // Si tier 1 es Bronce y 10 es GC, ordenamos descendente (b.rank - a.rank)
  return players.sort((a, b) => {
    const tierA = a.rank?.tier_order ?? -1;
    const tierB = b.rank?.tier_order ?? -1;
    return tierB - tierA; // Mayor tier primero
  });
}

export async function createPlayer(input: {
  id: string; 
  username: string;
  region_code?: string;
  rank_1v1_id?: number;
  epic_id?: string;
}) {
  const { error } = await supabase.from("players").insert({
    id: input.id,
    username: input.username,
    region_code: input.region_code || null,
    rank_1v1_id: input.rank_1v1_id || null,
    epic_id: input.epic_id || null,
  });

  if (error) throw error;
}

export async function updatePlayer(
  id: string,
  input: {
    username?: string;
    epic_id?: string | null;
    region_code?: string | null;
    rank_1v1_id?: number | null;
  }
) {
  const { error } = await supabase
    .from("players")
    .update(input)
    .eq("id", id);

  if (error) throw error;
}

export async function deletePlayer(id: string) {
  const { error } = await supabase.from("players").delete().eq("id", id);
  if (error) throw error;
}

/* =======================
   HELPERS
======================= */

export async function getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from("players")
    .select(`
      *,
      region:regions!players_region_fkey(*),
      rank:ranks!players_rank_1v1_fkey(*)
    `)
    .eq("id", id)
    .single();

  if (error) return null;
  
  const p = data as any;
  return {
      ...p,
      region: Array.isArray(p.region) ? p.region[0] : p.region,
      rank: Array.isArray(p.rank) ? p.rank[0] : p.rank
  };
}