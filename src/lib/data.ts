// Mock data layer for Rocket Muted League
// These functions return mock data and can be replaced with Supabase queries

export interface Player {
  id: string;
  username: string;
  region: string;
  rank_1v1: string;
  wins: number;
  losses: number;
  avatar?: string;
}

export interface Match {
  id: string;
  player1: string;
  player2: string;
  score1: number;
  score2: number;
  winner: string;
  date: string;
  type: '1v1' | '2v2';
}

export interface Challenge {
  id: string;
  challenger: string;
  challenged: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  createdAt: string;
  scheduledFor?: string;
}

// Mock Players
const mockPlayers: Player[] = [
  { id: '1', username: 'TurboBlaze', region: 'NA-East', rank_1v1: 'Grand Champion I', wins: 42, losses: 15 },
  { id: '2', username: 'AerialAce', region: 'EU-West', rank_1v1: 'Champion III', wins: 38, losses: 22 },
  { id: '3', username: 'BoostPhantom', region: 'NA-West', rank_1v1: 'Grand Champion II', wins: 55, losses: 12 },
  { id: '4', username: 'ShadowFlick', region: 'EU-Central', rank_1v1: 'Champion II', wins: 29, losses: 31 },
  { id: '5', username: 'RocketNova', region: 'OCE', rank_1v1: 'Champion I', wins: 25, losses: 28 },
  { id: '6', username: 'NitroKing', region: 'NA-East', rank_1v1: 'Grand Champion I', wins: 48, losses: 18 },
  { id: '7', username: 'DemoDevil', region: 'EU-West', rank_1v1: 'Supersonic Legend', wins: 67, losses: 8 },
  { id: '8', username: 'FlipResetFury', region: 'NA-Central', rank_1v1: 'Champion III', wins: 35, losses: 25 },
];

// Mock Matches
const mockMatches: Match[] = [
  { id: '1', player1: 'DemoDevil', player2: 'BoostPhantom', score1: 5, score2: 3, winner: 'DemoDevil', date: '2024-01-28', type: '1v1' },
  { id: '2', player1: 'TurboBlaze', player2: 'AerialAce', score1: 4, score2: 6, winner: 'AerialAce', date: '2024-01-27', type: '1v1' },
  { id: '3', player1: 'NitroKing', player2: 'ShadowFlick', score1: 7, score2: 2, winner: 'NitroKing', date: '2024-01-26', type: '1v1' },
  { id: '4', player1: 'RocketNova', player2: 'FlipResetFury', score1: 3, score2: 5, winner: 'FlipResetFury', date: '2024-01-25', type: '1v1' },
  { id: '5', player1: 'BoostPhantom', player2: 'TurboBlaze', score1: 6, score2: 4, winner: 'BoostPhantom', date: '2024-01-24', type: '1v1' },
  { id: '6', player1: 'DemoDevil', player2: 'NitroKing', score1: 5, score2: 5, winner: 'DemoDevil', date: '2024-01-23', type: '1v1' },
];

// Mock Challenges
const mockChallenges: Challenge[] = [
  { id: '1', challenger: 'TurboBlaze', challenged: 'DemoDevil', status: 'pending', createdAt: '2024-01-28' },
  { id: '2', challenger: 'AerialAce', challenged: 'BoostPhantom', status: 'accepted', createdAt: '2024-01-27', scheduledFor: '2024-01-30' },
  { id: '3', challenger: 'ShadowFlick', challenged: 'RocketNova', status: 'pending', createdAt: '2024-01-26' },
  { id: '4', challenger: 'FlipResetFury', challenged: 'NitroKing', status: 'accepted', createdAt: '2024-01-25', scheduledFor: '2024-01-29' },
  { id: '5', challenger: 'BoostPhantom', challenged: 'DemoDevil', status: 'declined', createdAt: '2024-01-24' },
];

// Data access functions - ready to be replaced with Supabase queries
export async function getPlayers(): Promise<Player[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockPlayers;
}

export async function getPlayerById(id: string): Promise<Player | undefined> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockPlayers.find(p => p.id === id);
}

export async function getMatches(): Promise<Match[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockMatches;
}

export async function getRecentMatches(limit: number = 5): Promise<Match[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockMatches.slice(0, limit);
}

export async function getChallenges(): Promise<Challenge[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  return mockChallenges;
}

export async function getPendingChallenges(): Promise<Challenge[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockChallenges.filter(c => c.status === 'pending');
}

export async function getAcceptedChallenges(): Promise<Challenge[]> {
  await new Promise(resolve => setTimeout(resolve, 50));
  return mockChallenges.filter(c => c.status === 'accepted');
}

export async function getRankings(): Promise<Player[]> {
  await new Promise(resolve => setTimeout(resolve, 100));
  // Sort by win rate
  return [...mockPlayers].sort((a, b) => {
    const rateA = a.wins / (a.wins + a.losses);
    const rateB = b.wins / (b.wins + b.losses);
    return rateB - rateA;
  });
}
