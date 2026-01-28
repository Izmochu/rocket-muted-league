import { useEffect, useState } from "react";
import { getMatches, Match } from "@/lib/data";
import { Layout } from "@/components/Layout";
import { MatchesTable } from "@/components/MatchesTable";
import { GameCard, GameCardHeader, GameCardTitle, GameCardDescription, GameCardContent } from "@/components/ui/game-card";
import { Swords } from "lucide-react";

const Matches = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      const data = await getMatches();
      setMatches(data);
      setLoading(false);
    }
    fetchMatches();
  }, []);

  return (
    <Layout>
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Swords className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Matches</h1>
        </div>
        <p className="text-muted-foreground">
          Complete match history of the Rocket Muted League
        </p>
      </section>

      <GameCard>
        <GameCardHeader>
          <GameCardTitle>Match History</GameCardTitle>
          <GameCardDescription>
            {matches.length} matches played
          </GameCardDescription>
        </GameCardHeader>
        <GameCardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading matches...</p>
          ) : (
            <MatchesTable matches={matches} />
          )}
        </GameCardContent>
      </GameCard>
    </Layout>
  );
};

export default Matches;
