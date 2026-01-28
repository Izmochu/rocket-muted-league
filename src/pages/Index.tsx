import { useEffect, useState } from "react";
import { getRecentMatches, getRankings, Match, Player } from "@/lib/data";
import { Layout } from "@/components/Layout";
import { RecentMatches } from "@/components/RecentMatches";
import { PlayersTable } from "@/components/PlayersTable";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent, GameCardDescription } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { Link } from "react-router-dom";
import { Trophy, Users, Swords, Target } from "lucide-react";

const Index = () => {
  const [recentMatches, setRecentMatches] = useState<Match[]>([]);
  const [topPlayers, setTopPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [matches, rankings] = await Promise.all([
        getRecentMatches(5),
        getRankings(),
      ]);
      setRecentMatches(matches);
      setTopPlayers(rankings.slice(0, 5));
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="text-center py-12 mb-12">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/20 border border-primary/40 glow-primary mb-6">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
          Rocket <span className="text-primary text-glow">Muted</span> League
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          The community Rocket League league. Compete, challenge, and climb the ranks.
          Fair play, good vibes, legendary aerials.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/challenges">
            <GameButton variant="glow" size="lg">
              <Target className="w-5 h-5" />
              Issue Challenge
            </GameButton>
          </Link>
          <Link to="/players">
            <GameButton variant="outline" size="lg">
              <Users className="w-5 h-5" />
              View Rankings
            </GameButton>
          </Link>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: "Active Players", value: "8", icon: Users },
          { label: "Matches Played", value: "156", icon: Swords },
          { label: "Open Challenges", value: "4", icon: Target },
          { label: "Current Season", value: "S1", icon: Trophy },
        ].map((stat) => (
          <GameCard key={stat.label} className="text-center">
            <GameCardContent className="py-6">
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className="text-3xl font-display font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </GameCardContent>
          </GameCard>
        ))}
      </section>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Matches */}
        <div className="animate-fade-in">
          {loading ? (
            <GameCard>
              <GameCardContent className="py-12 text-center text-muted-foreground">
                Loading matches...
              </GameCardContent>
            </GameCard>
          ) : (
            <RecentMatches matches={recentMatches} />
          )}
        </div>

        {/* Rankings Summary */}
        <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <GameCard variant="glow">
            <GameCardHeader>
              <GameCardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-primary" />
                Top Players
              </GameCardTitle>
              <GameCardDescription>Current season rankings</GameCardDescription>
            </GameCardHeader>
            <GameCardContent>
              {loading ? (
                <p className="text-center text-muted-foreground py-4">Loading...</p>
              ) : (
                <PlayersTable players={topPlayers} showRank={true} />
              )}
            </GameCardContent>
          </GameCard>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
