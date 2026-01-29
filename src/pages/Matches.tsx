import { useEffect, useState, useMemo } from "react";
import { getMatches, Match as ServiceMatch } from "@/services/matches.service";
import { Match as DomainMatch } from "@/domain/match";
import { Layout } from "@/components/Layout";
import { MatchesTable } from "@/components/MatchesTable";
import { GameCard, GameCardContent } from "@/components/ui/game-card";
import { Input } from "@/components/ui/input";
import { Swords, Search, CalendarDays } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

// Si no tienes date-fns, puedes usar JS nativo, pero asumo que está o se puede instalar fácil
// npm install date-fns

const Matches = () => {
  const [matches, setMatches] = useState<DomainMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchMatches() {
      try {
        const data = await getMatches();
        
        // ADAPTADOR
        const mappedMatches: DomainMatch[] = data.map((m: ServiceMatch) => ({
          id: m.id,
          score_p1: m.score_p1,
          score_p2: m.score_p2,
          played_at: m.played_at,
          created_at: m.created_at,
          player1: {
             id: m.player1?.id ?? "unknown",
             username: m.player1?.username ?? "Unknown"
          },
          player2: {
             id: m.player2?.id ?? "unknown",
             username: m.player2?.username ?? "Unknown"
          },
          winner: m.winner ? {
             id: m.winner.id,
             username: m.winner.username
          } : null
        }));

        setMatches(mappedMatches);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchMatches();
  }, []);

  // FILTRO
  const filteredMatches = useMemo(() => {
    if (!searchTerm) return matches;
    const term = searchTerm.toLowerCase();
    return matches.filter(m => 
      m.player1.username.toLowerCase().includes(term) ||
      m.player2.username.toLowerCase().includes(term)
    );
  }, [matches, searchTerm]);

  // AGRUPACIÓN POR FECHAS
  const groupedMatches = useMemo(() => {
    const groups: { [key: string]: DomainMatch[] } = {};
    
    filteredMatches.forEach(match => {
      const date = match.played_at ? new Date(match.played_at) : new Date(match.created_at);
      let dateKey = format(date, "yyyy-MM-dd");
      
      if (isToday(date)) dateKey = "Today";
      else if (isYesterday(date)) dateKey = "Yesterday";
      else dateKey = format(date, "MMMM d, yyyy"); // Ejemplo: January 29, 2026

      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(match);
    });

    return groups;
  }, [filteredMatches]);

  return (
    <Layout>
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Swords className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Match History</h1>
        </div>
        <p className="text-muted-foreground">
          Complete archive of every game played.
        </p>
      </section>

      {/* SEARCH BAR */}
      <div className="max-w-md mb-6 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Filter by player name..." 
          className="pl-9"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-8">
        {loading ? (
           <GameCard><GameCardContent className="p-8 text-center text-muted-foreground">Loading matches...</GameCardContent></GameCard>
        ) : Object.keys(groupedMatches).length === 0 ? (
           <div className="text-center text-muted-foreground">No matches found.</div>
        ) : (
          Object.entries(groupedMatches).map(([dateLabel, groupMatches]) => (
            <div key={dateLabel} className="animate-fade-in">
               <div className="flex items-center gap-2 mb-3 px-1">
                 <CalendarDays className="w-4 h-4 text-primary" />
                 <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{dateLabel}</h3>
               </div>
               <GameCard className="overflow-hidden">
                  <GameCardContent className="p-0">
                    <MatchesTable matches={groupMatches} />
                  </GameCardContent>
               </GameCard>
            </div>
          ))
        )}
      </div>
    </Layout>
  );
};

export default Matches;