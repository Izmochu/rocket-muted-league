import { Match } from "@/lib/data";
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
  return (
    <GameTable>
      <GameTableHeader>
        <GameTableRow>
          <GameTableHead>Date</GameTableHead>
          <GameTableHead>Player 1</GameTableHead>
          <GameTableHead className="text-center">Score</GameTableHead>
          <GameTableHead>Player 2</GameTableHead>
          <GameTableHead>Winner</GameTableHead>
        </GameTableRow>
      </GameTableHeader>
      <GameTableBody>
        {matches.map((match) => (
          <GameTableRow key={match.id}>
            <GameTableCell className="text-muted-foreground">
              {match.date}
            </GameTableCell>
            <GameTableCell className={match.winner === match.player1 ? "text-success font-medium" : ""}>
              {match.player1}
            </GameTableCell>
            <GameTableCell className="text-center">
              <span className={match.score1 > match.score2 ? "text-success" : "text-muted-foreground"}>
                {match.score1}
              </span>
              <span className="text-primary mx-2 font-display">vs</span>
              <span className={match.score2 > match.score1 ? "text-success" : "text-muted-foreground"}>
                {match.score2}
              </span>
            </GameTableCell>
            <GameTableCell className={match.winner === match.player2 ? "text-success font-medium" : ""}>
              {match.player2}
            </GameTableCell>
            <GameTableCell>
              <GameBadge variant="glow">{match.winner}</GameBadge>
            </GameTableCell>
          </GameTableRow>
        ))}
      </GameTableBody>
    </GameTable>
  );
}
