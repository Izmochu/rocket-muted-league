export type ChallengeStatus = "pending" | "accepted" | "rejected" | "played";

export type PlayerRef = {
  id: string;
  username: string;
  // Estos campos son opcionales en la vista resumen
  region?: string;
  rank_1v1?: string;
  wins?: number;
  losses?: number;
};

export interface Challenge {
  id: string;
  match_id?: string | null;
  status: ChallengeStatus;
  created_at: string;

  challenger: PlayerRef;
  challenged: PlayerRef;
}