import { Player } from "@/domain/player";
import {
  GameTable,
  GameTableHeader,
  GameTableBody,
  GameTableRow,
  GameTableHead,
  GameTableCell,
} from "@/components/ui/game-table";
import { GameBadge } from "@/components/ui/game-badge";
import { ArrowUpDown, ArrowUp, ArrowDown, CheckCircle2, XCircle } from "lucide-react";

export interface PlayerWithStats extends Player {
  matchesPlayed?: number;
  winrate?: number;
  form?: string[]; // Array de "W" o "L"
}

interface PlayersTableProps {
  players: PlayerWithStats[]; 
  onSort?: (key: keyof PlayerWithStats) => void;
  sortConfig?: { key: keyof PlayerWithStats; direction: "asc" | "desc" };
}

function getWinrateColor(winrate: number) {
  if (winrate >= 60) return "text-green-500";
  if (winrate <= 40) return "text-red-400";
  return "text-yellow-500";
}

// Componente auxiliar para la cabecera ordenable
const SortableHead = ({ 
  label, 
  sortKey, 
  currentSort, 
  onSort, 
  align = "left" 
}: { 
  label: string, 
  sortKey: keyof PlayerWithStats, 
  currentSort?: { key: string, direction: string }, 
  onSort?: (k: any) => void,
  align?: string
}) => {
  if (!onSort) return <GameTableHead className={align}>{label}</GameTableHead>;

  const isActive = currentSort?.key === sortKey;
  
  return (
    <GameTableHead 
      className={`cursor-pointer hover:text-primary transition-colors select-none ${align}`}
      onClick={() => onSort(sortKey)}
    >
      <div className={`flex items-center gap-1 ${align === "text-center" ? "justify-center" : align === "text-right" ? "justify-end" : ""}`}>
        {label}
        {isActive ? (
          currentSort.direction === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />
        ) : (
          <ArrowUpDown className="w-3 h-3 opacity-30" />
        )}
      </div>
    </GameTableHead>
  );
};

export function PlayersTable({ players, onSort, sortConfig }: PlayersTableProps) {
  if (players.length === 0) {
    return <div className="p-8 text-center text-muted-foreground">No players found.</div>;
  }

  return (
    <GameTable>
      <GameTableHeader className="sticky top-0 bg-background/95 backdrop-blur z-10 border-b border-border/50">
        <GameTableRow>
          <GameTableHead className="w-12 text-center">#</GameTableHead>
          
          <SortableHead label="Player" sortKey="username" onSort={onSort} currentSort={sortConfig} />
          <SortableHead label="Region" sortKey="region" onSort={onSort} currentSort={sortConfig} />
          <SortableHead label="Rank" sortKey="rank_1v1" onSort={onSort} currentSort={sortConfig} />
          
          <GameTableHead className="text-center">Form</GameTableHead>

          <SortableHead label="Matches" sortKey="matchesPlayed" onSort={onSort} currentSort={sortConfig} align="text-center" />
          <SortableHead label="Winrate" sortKey="winrate" onSort={onSort} currentSort={sortConfig} align="text-center" />
          <SortableHead label="W / L" sortKey="wins" onSort={onSort} currentSort={sortConfig} align="text-right pr-6" />
        </GameTableRow>
      </GameTableHeader>
      <GameTableBody>
        {players.map((player, index) => (
          <GameTableRow key={player.id} className="group hover:bg-muted/50 transition-colors">
            <GameTableCell className="font-mono text-muted-foreground text-center">
              {index + 1}
            </GameTableCell>
            
            <GameTableCell className="font-bold text-foreground group-hover:text-primary transition-colors">
              {player.username}
            </GameTableCell>
            
            <GameTableCell className="text-muted-foreground">
              {player.region}
            </GameTableCell>
            
            <GameTableCell>
              <GameBadge variant="outline" className="text-xs">
                {player.rank_1v1}
              </GameBadge>
            </GameTableCell>

            {/* COLUMNA FORM (RACHA) */}
            <GameTableCell className="flex justify-center gap-1">
               {player.form?.map((result, i) => (
                 result === "W" 
                   ? <CheckCircle2 key={i} className="w-4 h-4 text-green-500/80" />
                   : <XCircle key={i} className="w-4 h-4 text-red-500/50" />
               ))}
               {!player.form?.length && <span className="text-muted-foreground">-</span>}
            </GameTableCell>

            <GameTableCell className="text-center font-mono">
              {player.matchesPlayed ?? "-"}
            </GameTableCell>

            <GameTableCell className={`text-center font-bold ${player.winrate !== undefined ? getWinrateColor(player.winrate) : ""}`}>
              {player.winrate !== undefined ? `${player.winrate}%` : "-"}
            </GameTableCell>

            <GameTableCell className="text-right pr-6 font-mono text-sm">
              <span className="text-green-500">{player.wins}W</span>
              <span className="text-muted-foreground mx-1">-</span>
              <span className="text-red-500">{player.losses}L</span>
            </GameTableCell>
          </GameTableRow>
        ))}
      </GameTableBody>
    </GameTable>
  );
}