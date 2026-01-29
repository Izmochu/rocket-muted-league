import { Challenge } from "@/domain/challenge";
import {
  GameCard,
  GameCardHeader,
  GameCardTitle,
  GameCardContent,
} from "@/components/ui/game-card";
import { GameBadge } from "@/components/ui/game-badge";
import { Swords, Calendar } from "lucide-react";

interface ChallengesListProps {
  challenges: Challenge[];
  title: string;
}

function getStatusVariant(
  status: Challenge["status"]
): "primary" | "success" | "warning" {
  switch (status) {
    case "pending":
      return "warning";
    case "accepted":
      return "success";
    default:
      return "primary";
  }
}

export function ChallengesList({ challenges, title }: ChallengesListProps) {
  if (challenges.length === 0) {
    return (
      <GameCard>
        <GameCardHeader>
          <GameCardTitle>{title}</GameCardTitle>
        </GameCardHeader>
        <GameCardContent>
          <p className="text-muted-foreground text-center py-4">
            No challenges found
          </p>
        </GameCardContent>
      </GameCard>
    );
  }

  return (
    <GameCard>
      <GameCardHeader>
        <GameCardTitle>{title}</GameCardTitle>
      </GameCardHeader>

      <GameCardContent className="space-y-3">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <Swords className="w-5 h-5 text-primary" />

              <div>
                <p className="font-medium">
                  <span className="text-primary">
                    {challenge.challenger.username}
                  </span>
                  <span className="text-muted-foreground mx-2">vs</span>
                  <span>{challenge.challenged.username}</span>
                </p>

                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Created:{" "}
                    {new Date(challenge.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <GameBadge variant={getStatusVariant(challenge.status)}>
              {challenge.status}
            </GameBadge>
          </div>
        ))}
      </GameCardContent>
    </GameCard>
  );
}
