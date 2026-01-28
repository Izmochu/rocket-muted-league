import { Match } from "@/lib/data";
import { GameCard, GameCardHeader, GameCardTitle, GameCardContent } from "@/components/ui/game-card";
import { Trophy } from "lucide-react";

interface RecentMatchesProps {
  matches: Match[];
}

export function RecentMatches({ matches }: RecentMatchesProps) {
  return (
    <GameCard variant="glow">
      <GameCardHeader>
        <GameCardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          Recent Matches
        </GameCardTitle>
      </GameCardHeader>
      <GameCardContent className="space-y-3">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between p-3 rounded-md bg-muted/20 border border-border/30"
          >
            <div className="flex items-center gap-4 flex-1">
              <span className={match.winner === match.player1 ? "text-success font-medium" : "text-foreground/70"}>
                {match.player1}
              </span>
              <div className="flex items-center gap-1 font-display text-lg">
                <span className={match.score1 > match.score2 ? "text-success" : "text-muted-foreground"}>
                  {match.score1}
                </span>
                <span className="text-primary/60 text-sm">-</span>
                <span className={match.score2 > match.score1 ? "text-success" : "text-muted-foreground"}>
                  {match.score2}
                </span>
              </div>
              <span className={match.winner === match.player2 ? "text-success font-medium" : "text-foreground/70"}>
                {match.player2}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{match.date}</span>
          </div>
        ))}
      </GameCardContent>
    </GameCard>
  );
}
