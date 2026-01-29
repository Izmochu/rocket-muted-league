import { useEffect, useState, useMemo } from "react";
import { getPlayers, Player as ServicePlayer } from "@/services/players.service";
import { getMatches, Match as ServiceMatch } from "@/services/matches.service";
import { Layout } from "@/components/Layout";
import { PlayersTable, PlayerWithStats } from "@/components/PlayersTable";
import { GameCard, GameCardContent } from "@/components/ui/game-card";
import { Input } from "@/components/ui/input";
import { Users, Search, Filter, Trophy } from "lucide-react";

const Players = () => {
  const [players, setPlayers] = useState<PlayerWithStats[]>([]);
  const [loading, setLoading] = useState(true);

  // Filtros y Ordenación
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("");
  const [rankFilter, setRankFilter] = useState("");
  
  // Estado para la ordenación { clave, dirección }
  const [sortConfig, setSortConfig] = useState<{ key: keyof PlayerWithStats; direction: "asc" | "desc" }>({
    key: "winrate",
    direction: "desc",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [playersData, matchesData] = await Promise.all([
          getPlayers(),
          getMatches(),
        ]);

        // 1. Calcular Stats
        const playersWithStats: PlayerWithStats[] = playersData.map((p: ServicePlayer) => {
          // Obtener partidos del jugador
          const playerMatches = matchesData.filter(
            (m) => m.player1_id === p.id || m.player2_id === p.id
          );

          // Calcular Wins/Losses
          const wins = playerMatches.filter((m) => m.winner_id === p.id).length;
          const losses = playerMatches.length - wins;
          const winrate = playerMatches.length > 0 
            ? Math.round((wins / playerMatches.length) * 100) 
            : 0;

          // Calcular RACHA (Últimos 3 partidos ordenados por fecha)
          // Ordenamos por fecha descendente para coger los más recientes
          const recentMatches = [...playerMatches].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 3);
          
          // Creamos un array de 'W' o 'L'
          const form = recentMatches.map(m => m.winner_id === p.id ? "W" : "L");

          return {
            id: p.id,
            username: p.username,
            region: p.region?.name ?? p.region_code ?? "Unknown",
            rank_1v1: p.rank?.name ?? "Unranked",
            wins,
            losses,
            matchesPlayed: playerMatches.length,
            winrate,
            form, // Nuevo campo
          };
        });

        setPlayers(playersWithStats);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Función para manejar el click en cabeceras
  const handleSort = (key: keyof PlayerWithStats) => {
    setSortConfig((current) => ({
      key,
      direction: current.key === key && current.direction === "desc" ? "asc" : "desc",
    }));
  };

  // 2. Filtrado y Ordenación Dinámica
  const filteredPlayers = useMemo(() => {
    let result = players.filter((p) => {
      const matchesName = p.username.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = regionFilter ? p.region === regionFilter : true;
      const matchesRank = rankFilter ? p.rank_1v1.includes(rankFilter) : true;
      return matchesName && matchesRegion && matchesRank;
    });

    // Algoritmo de ordenación
    result.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Manejo de valores nulos/undefined
      if (aValue === undefined && bValue === undefined) return 0;
      if (aValue === undefined) return 1;
      if (bValue === undefined) return -1;

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [players, search, regionFilter, rankFilter, sortConfig]);

  const uniqueRegions = Array.from(new Set(players.map((p) => p.region)));
  const uniqueRanks = Array.from(new Set(players.map((p) => p.rank_1v1)));

  return (
    <Layout>
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Leaderboard</h1>
        </div>
        <p className="text-muted-foreground">
          Global rankings calculated in real-time.
        </p>
      </section>

      {/* FILTROS */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search player..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select 
            className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="">All Regions</option>
            {uniqueRegions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>

        <div className="relative">
          <Trophy className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <select 
            className="w-full h-10 rounded-md border border-input bg-background pl-9 pr-3 text-sm focus:ring-2 focus:ring-primary"
            value={rankFilter}
            onChange={(e) => setRankFilter(e.target.value)}
          >
            <option value="">All Ranks</option>
            {uniqueRanks.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      <GameCard className="overflow-hidden">
        <GameCardContent className="p-0">
          {loading ? (
            <p className="text-center text-muted-foreground py-12">Calculating stats...</p>
          ) : (
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <PlayersTable 
                players={filteredPlayers} 
                onSort={handleSort} 
                sortConfig={sortConfig} 
              />
            </div>
          )}
        </GameCardContent>
      </GameCard>
    </Layout>
  );
};

export default Players;