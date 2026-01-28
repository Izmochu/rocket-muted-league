import { useEffect, useState } from "react";
import { getPlayers, Player } from "@/lib/data";
import { Layout } from "@/components/Layout";
import { PlayersTable } from "@/components/PlayersTable";
import { GameCard, GameCardHeader, GameCardTitle, GameCardDescription, GameCardContent } from "@/components/ui/game-card";
import { Users } from "lucide-react";

const Players = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      const data = await getPlayers();
      setPlayers(data);
      setLoading(false);
    }
    fetchPlayers();
  }, []);

  return (
    <Layout>
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Players</h1>
        </div>
        <p className="text-muted-foreground">
          All registered players in the Rocket Muted League
        </p>
      </section>

      <GameCard>
        <GameCardHeader>
          <GameCardTitle>Player Registry</GameCardTitle>
          <GameCardDescription>
            {players.length} players • Sorted by registration
          </GameCardDescription>
        </GameCardHeader>
        <GameCardContent>
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading players...</p>
          ) : (
            <PlayersTable players={players} showRank={false} />
          )}
        </GameCardContent>
      </GameCard>
    </Layout>
  );
};

export default Players;
