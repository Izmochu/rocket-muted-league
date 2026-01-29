import { Match } from "@/domain/match";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent } from "@/components/ui/game-card";
import { Trophy, Calendar } from "lucide-react";

interface RecentMatchesProps {
  matches: Match[];
}

export function RecentMatches({ matches }: RecentMatchesProps) {
  if (matches.length === 0) {
    return (
      <GameCard>
        <GameCardContent className="py-8 text-center text-muted-foreground">
          No matches played recently.
        </GameCardContent>
      </GameCard>
    );
  }

  return (
    <GameCard variant="glow">
      <GameCardHeader>
        <GameCardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Recent Matches
        </GameCardTitle>
      </GameCardHeader>
      <GameCardContent className="space-y-3">
        {matches.map((match) => {
          // Lógica corregida para objetos
          const isP1Winner = match.winner?.id === match.player1.id;
          const isP2Winner = match.winner?.id === match.player2.id;

          return (
            <div
              key={match.id}
              className="flex items-center justify-between p-3 rounded-md bg-muted/20 border border-border/30 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                {/* PLAYER 1 */}
                <span className={`text-sm md:text-base font-medium ${isP1Winner ? "text-success" : "text-foreground/80"}`}>
                  {match.player1.username}
                </span>

                {/* SCORE */}
                <div className="flex items-center gap-2 font-display text-lg bg-background/50 px-2 rounded border border-white/5">
                  <span className={match.score_p1 > match.score_p2 ? "text-success" : "text-muted-foreground"}>
                    {match.score_p1}
                  </span>
                  <span className="text-primary/60 text-sm">-</span>
                  <span className={match.score_p2 > match.score_p1 ? "text-success" : "text-muted-foreground"}>
                    {match.score_p2}
                  </span>
                </div>

                {/* PLAYER 2 */}
                <span className={`text-sm md:text-base font-medium ${isP2Winner ? "text-success" : "text-foreground/80"}`}>
                  {match.player2.username}
                </span>
              </div>

              {/* DATE */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {match.played_at 
                  ? new Date(match.played_at).toLocaleDateString()
                  : "Recently"}
              </div>
            </div>
          );
        })}
      </GameCardContent>
    </GameCard>
  );
}