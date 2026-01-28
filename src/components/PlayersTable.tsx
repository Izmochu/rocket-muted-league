import { Player } from "@/lib/data";
import {
  GameTable,
  GameTableHeader,
  GameTableBody,
  GameTableRow,
  GameTableHead,
  GameTableCell,
} from "@/components/ui/game-table";
import { GameBadge } from "@/components/ui/game-badge";

interface PlayersTableProps {
  players: Player[];
  showRank?: boolean;
}

function getRankVariant(rank: string): "primary" | "success" | "warning" | "default" {
  if (rank.includes("Supersonic Legend")) return "primary";
  if (rank.includes("Grand Champion")) return "success";
  if (rank.includes("Champion")) return "warning";
  return "default";
}

export function PlayersTable({ players, showRank = true }: PlayersTableProps) {
  return (
    <GameTable>
      <GameTableHeader>
        <GameTableRow>
          {showRank && <GameTableHead className="w-12">#</GameTableHead>}
          <GameTableHead>Player</GameTableHead>
          <GameTableHead>Region</GameTableHead>
          <GameTableHead>1v1 Rank</GameTableHead>
          <GameTableHead className="text-right">W/L</GameTableHead>
        </GameTableRow>
      </GameTableHeader>
      <GameTableBody>
        {players.map((player, index) => (
          <GameTableRow key={player.id}>
            {showRank && (
              <GameTableCell className="font-display font-bold text-primary">
                {index + 1}
              </GameTableCell>
            )}
            <GameTableCell className="font-medium">{player.username}</GameTableCell>
            <GameTableCell className="text-muted-foreground">{player.region}</GameTableCell>
            <GameTableCell>
              <GameBadge variant={getRankVariant(player.rank_1v1)}>
                {player.rank_1v1}
              </GameBadge>
            </GameTableCell>
            <GameTableCell className="text-right">
              <span className="text-success">{player.wins}</span>
              <span className="text-muted-foreground mx-1">/</span>
              <span className="text-destructive">{player.losses}</span>
            </GameTableCell>
          </GameTableRow>
        ))}
      </GameTableBody>
    </GameTable>
  );
}
