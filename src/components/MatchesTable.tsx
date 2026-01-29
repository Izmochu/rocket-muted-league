import { Match } from "@/domain/match";
import {
  GameTable,
  GameTableHeader,
  GameTableBody,
  GameTableRow,
  GameTableHead,
  GameTableCell,
} from "@/components/ui/game-table";
import { GameBadge } from "@/components/ui/game-badge";

interface MatchesTableProps {
  matches: Match[];
}

export function MatchesTable({ matches }: MatchesTableProps) {
  if (matches.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No matches found.</div>;
  }

  return (
    <GameTable>
      <GameTableHeader>
        <GameTableRow>
          <GameTableHead>Date</GameTableHead>
          <GameTableHead className="text-right">Player 1</GameTableHead>
          <GameTableHead className="text-center">Score</GameTableHead>
          <GameTableHead>Player 2</GameTableHead>
          <GameTableHead>Winner</GameTableHead>
        </GameTableRow>
      </GameTableHeader>

      <GameTableBody>
        {matches.map((match) => {
          const winnerId = match.winner?.id;
          const p1Id = match.player1.id;
          const p2Id = match.player2.id;

          return (
            <GameTableRow key={match.id}>
              <GameTableCell className="text-muted-foreground text-xs">
                {match.played_at
                  ? new Date(match.played_at).toLocaleDateString()
                  : "—"}
              </GameTableCell>

              <GameTableCell
                className={`text-right ${winnerId === p1Id ? "text-success font-bold" : ""}`}
              >
                {match.player1.username}
              </GameTableCell>

              <GameTableCell className="text-center">
                <span className="font-mono bg-muted/30 px-2 py-1 rounded">
                   <span className={match.score_p1 > match.score_p2 ? "text-success" : ""}>{match.score_p1}</span>
                   <span className="mx-1 text-muted-foreground">-</span>
                   <span className={match.score_p2 > match.score_p1 ? "text-success" : ""}>{match.score_p2}</span>
                </span>
              </GameTableCell>

              <GameTableCell
                className={winnerId === p2Id ? "text-success font-bold" : ""}
              >
                {match.player2.username}
              </GameTableCell>

              <GameTableCell>
                {match.winner ? (
                  <GameBadge variant="glow" className="text-xs">
                    {match.winner.username}
                  </GameBadge>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </GameTableCell>
            </GameTableRow>
          );
        })}
      </GameTableBody>
    </GameTable>
  );
}