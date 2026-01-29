import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trophy, Swords, Calendar, Activity } from "lucide-react";

// COMPONENTES
import { Layout } from "@/components/Layout";
import { RecentMatches } from "@/components/RecentMatches";
import { PlayersTable, PlayerWithStats } from "@/components/PlayersTable";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent, GameCardDescription } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { GameBadge } from "@/components/ui/game-badge";

// SERVICIOS
import { getMatches, getRecentMatches, Match as ServiceMatch } from "@/services/matches.service";
import { getPlayers, Player as ServicePlayer } from "@/services/players.service";

// DOMINIO
import { Match as DomainMatch } from "@/domain/match";

const Index = () => {
  const [recentMatches, setRecentMatches] = useState<DomainMatch[]>([]);
  const [topPlayers, setTopPlayers] = useState<PlayerWithStats[]>([]);
  
  const [stats, setStats] = useState({
    totalMatches: 0,
    activePlayers: 0,
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [recentMatchesData, allMatches, playersData] = await Promise.all([
          getRecentMatches(5),
          getMatches(),
          getPlayers(),
        ]);

        // 1. Mapeo de Partidos Recientes
        const mappedRecentMatches: DomainMatch[] = recentMatchesData.map((m: ServiceMatch) => ({
          id: m.id,
          score_p1: m.score_p1,
          score_p2: m.score_p2,
          played_at: m.played_at,
          created_at: m.created_at,
          player1: m.player1 ?? { id: "unknown", username: "Unknown" },
          player2: m.player2 ?? { id: "unknown", username: "Unknown" },
          winner: m.winner
        }));

        // 2. Cálculo de Ranking (Top 5 Real)
        const playersWithStats: PlayerWithStats[] = playersData.map((p: ServicePlayer) => {
          const playerMatches = allMatches.filter(
            (m) => m.player1_id === p.id || m.player2_id === p.id
          );
          
          const wins = playerMatches.filter((m) => m.winner_id === p.id).length;
          const losses = playerMatches.length - wins;
          const winrate = playerMatches.length > 0 
            ? Math.round((wins / playerMatches.length) * 100) 
            : 0;

          const recent = [...playerMatches].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 3);
          const form = recent.map(m => m.winner_id === p.id ? "W" : "L");

          return {
            id: p.id,
            username: p.username,
            region: p.region?.name ?? p.region_code ?? "Unknown",
            rank_1v1: p.rank?.name ?? "Unranked",
            wins,
            losses,
            matchesPlayed: playerMatches.length,
            winrate,
            form
          };
        });

        const sortedPlayers = playersWithStats
            .filter(p => p.matchesPlayed && p.matchesPlayed > 0)
            .sort((a, b) => {
               if ((b.winrate ?? 0) !== (a.winrate ?? 0)) return (b.winrate ?? 0) - (a.winrate ?? 0);
               return (b.matchesPlayed ?? 0) - (a.matchesPlayed ?? 0);
            })
            .slice(0, 5);

        setRecentMatches(mappedRecentMatches);
        setTopPlayers(sortedPlayers);
        setStats({
          totalMatches: allMatches.length,
          activePlayers: playersData.length
        });

      } catch (error) {
        console.error("Error loading home data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <Layout>
      {/* === VIDEO BACKGROUND === 
          Solo tienes que poner la ruta correcta en src=""
      */}
      <div className="hero-video-wrapper">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="hero-video"
        >
          {/* 👇 CAMBIA ESTA RUTA POR LA TUYA 👇 */}
          <source src="/videos/RocketLeagueSeason21Trailer.mp4" type="video/mp4" />
          
          {/* Mensaje por si falla */}
          Your browser does not support the video tag.
        </video>
        
        {/* Bloque negro semitransparente (overlay) */}
        <div className="hero-overlay"></div>
      </div>

      {/* === CONTENIDO DE LA PÁGINA === 
          Envuelto en 'home-content' para que flote encima del video
      */}
      <div className="home-content">
        
        {/* HERO SECTION */}
        <section className="relative py-20 mb-12 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-sm font-medium mb-6 animate-fade-in backdrop-blur-sm">
            <Activity className="w-4 h-4" /> Season 1 is Live
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 tracking-tight animate-fade-in drop-shadow-xl">
            Rocket <span className="text-primary text-glow">Muted</span> League
          </h1>
          
          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in delay-100 drop-shadow-md">
            The ultimate community hub. Challenge rivals, track your stats, 
            and climb the global leaderboard.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in delay-200">
            <Link to="/players">
              <GameButton variant="glow" size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/20">
                <Trophy className="w-5 h-5 mr-2" />
                View Leaderboard
              </GameButton>
            </Link>
            <Link to="/matches">
              <GameButton variant="outline" size="lg" className="h-12 px-8 text-base bg-black/40 backdrop-blur border-white/20 text-white hover:bg-black/60">
                <Swords className="w-5 h-5 mr-2" />
                Watch Matches
              </GameButton>
            </Link>
          </div>
        </section>

        {/* STATS BAR */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 container mx-auto max-w-4xl">
           <div className="p-4 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-center">
              <div className="text-3xl font-display font-bold text-primary">{stats.activePlayers}</div>
              <div className="text-sm text-gray-300">Players</div>
           </div>
           <div className="p-4 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-center">
              <div className="text-3xl font-display font-bold text-primary">{stats.totalMatches}</div>
              <div className="text-sm text-gray-300">Matches</div>
           </div>
           <div className="p-4 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-center">
              <div className="text-3xl font-display font-bold text-primary">S1</div>
              <div className="text-sm text-gray-300">Current Season</div>
           </div>
           <div className="p-4 rounded-xl bg-black/40 backdrop-blur border border-white/10 text-center">
              <div className="text-3xl font-display font-bold text-primary">EU/US</div>
              <div className="text-sm text-gray-300">Regions</div>
           </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Recent Matches (4 COLUMNAS) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-display font-bold flex items-center gap-2 drop-shadow-md">
                <Swords className="w-6 h-6 text-primary" /> Latest Action
              </h2>
              <Link to="/matches" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            
            {loading ? (
               <div className="h-[300px] w-full bg-muted/10 rounded-xl animate-pulse" />
            ) : (
               <RecentMatches matches={recentMatches} />
            )}
          </div>

          {/* RIGHT COLUMN: Top Players (8 COLUMNAS) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between mb-2">
               <h2 className="text-2xl font-display font-bold flex items-center gap-2 drop-shadow-md">
                 <Trophy className="w-6 h-6 text-yellow-500" /> Top 5
               </h2>
               <Link to="/players" className="text-sm text-primary hover:underline">Full Ranking</Link>
            </div>

            <GameCard className="border-primary/20 shadow-sm bg-black/50 backdrop-blur-md">
              <GameCardContent className="p-0">
                {loading ? (
                  <div className="p-8 text-center text-muted-foreground">Calculating ranking...</div>
                ) : (
                  <PlayersTable players={topPlayers} />
                )}
              </GameCardContent>
            </GameCard>
            
            {/* <GameCard className="bg-gradient-to-br from-primary/20 to-black/40 border-primary/30 backdrop-blur-sm">
              <GameCardContent className="p-6 text-center">
                <h3 className="text-lg font-bold mb-2">Ready to compete?</h3>
                <p className="text-sm text-gray-300 mb-4">Challenge a player and prove your skill in the arena.</p>
                <Link to="/challenges">
                  <GameButton size="sm" className="w-full md:w-auto px-8">Create Challenge</GameButton>
                </Link>
              </GameCardContent>
            </GameCard> */}
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default Index;