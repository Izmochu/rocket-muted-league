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
  
  // Antes eran string, ahora son objetos
  player1: PlayerRef;
  player2: PlayerRef;
  winner: PlayerRef | null;
};