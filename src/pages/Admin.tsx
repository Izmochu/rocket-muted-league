import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import {
  GameCard,
  GameCardHeader,
  GameCardTitle,
  GameCardDescription,
  GameCardContent,
} from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { GameBadge } from "@/components/ui/game-badge";
import { Input } from "@/components/ui/input";
import {
  Shield,
  Plus,
  Users,
  ListChecks,
  Swords,
  Pencil,
  Trash2,
  X,
  Calendar,
  Search,
  CheckCircle2,
} from "lucide-react";

import {
  getPlayers,
  createPlayer,
  updatePlayer,
  deletePlayer,
  getRanks,
  getRegions,
  Player,
  Rank,
  Region,
} from "@/services/players.service";
import {
  createChallenge,
  getAllChallenges,
  deleteChallenge,
  Challenge,
} from "@/services/challenges.service";
import {
  createMatch,
  getMatches,
  deleteMatch,
  Match,
} from "@/services/matches.service";

/* ---------------- STYLES ---------------- */

const selectClass =
  "h-10 w-full rounded-md bg-background/70 border border-border px-3 text-sm text-foreground " +
  "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary";

export default function Admin() {
  const { user } = useAuth();
  
  // Data State
  const [players, setPlayers] = useState<Player[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  
  // Aux Data State
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);

  // UI State
  const [loading, setLoading] = useState(true);
  
  // FILTROS
  const [playersListFilter, setPlayersListFilter] = useState(""); 
  const [challengesListFilter, setChallengesListFilter] = useState(""); 
  const [matchPlayerFilter, setMatchPlayerFilter] = useState(""); 
  const [challengePlayerFilter, setChallengePlayerFilter] = useState(""); // NUEVO FILTRO CREAR RETO

  // Ref para hacer scroll
  const matchFormRef = useRef<HTMLDivElement>(null);

  /* ---------------- LOAD DATA ---------------- */

  async function loadAllData() {
    setLoading(true);
    try {
      const [pData, cData, mData, rData, regData] = await Promise.all([
        getPlayers(),
        getAllChallenges(),
        getMatches(),
        getRanks(),
        getRegions(),
      ]);

      setPlayers(pData);
      setChallenges(cData);
      setMatches(mData);
      setRanks(rData);
      setRegions(regData);
    } catch (e: any) {
      console.error(e);
      alert(e.message ?? "Error cargando datos del admin");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  /* ---------------- PLAYERS LOGIC ---------------- */

  const [playerForm, setPlayerForm] = useState({
    id: "",
    username: "",
    epic_id: "",
    region_code: "",
    rank_1v1_id: "",
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  async function savePlayer() {
    if (!playerForm.username) return alert("Username requerido");

    try {
      const payload = {
        username: playerForm.username,
        epic_id: playerForm.epic_id || null,
        region_code: playerForm.region_code || null,
        rank_1v1_id: playerForm.rank_1v1_id ? Number(playerForm.rank_1v1_id) : null,
      };

      if (editingId) {
        await updatePlayer(editingId, payload);
      } else {
        await createPlayer({
          id: playerForm.id || crypto.randomUUID(),
          ...payload,
          rank_1v1_id: payload.rank_1v1_id ?? undefined,
          region_code: payload.region_code ?? undefined,
          epic_id: payload.epic_id ?? undefined,
        });
      }

      setPlayerForm({ id: "", username: "", epic_id: "", region_code: "", rank_1v1_id: "" });
      setEditingId(null);
      
      const updatedPlayers = await getPlayers();
      setPlayers(updatedPlayers);
    } catch (e: any) {
      alert(e.message ?? "Error guardando jugador");
    }
  }

  function editPlayer(p: Player) {
    setEditingId(p.id);
    setPlayerForm({
      id: p.id,
      username: p.username,
      epic_id: p.epic_id ?? "",
      region_code: p.region_code ?? "",
      rank_1v1_id: p.rank_1v1_id ? String(p.rank_1v1_id) : "",
    });
  }

  async function removePlayer(id: string) {
    if (!confirm("¿Seguro que quieres borrar este jugador?")) return;
    try {
      await deletePlayer(id);
      setPlayers(players.filter((p) => p.id !== id));
    } catch (e: any) {
      alert("No se puede borrar (probablemente tenga partidos asociados).");
    }
  }

  function cancelEditPlayer() {
    setEditingId(null);
    setPlayerForm({ id: "", username: "", epic_id: "", region_code: "", rank_1v1_id: "" });
  }

  /* ---------------- CHALLENGES LOGIC ---------------- */

  const [challengeForm, setChallengeForm] = useState({
    challenger_id: "",
    challenged_id: "",
  });

  async function handleCreateChallenge() {
    if (!challengeForm.challenger_id || !challengeForm.challenged_id) return;
    try {
      await createChallenge(challengeForm.challenger_id, challengeForm.challenged_id);
      setChallengeForm({ challenger_id: "", challenged_id: "" });
      setChallengePlayerFilter(""); // Limpiar filtro
      
      const updated = await getAllChallenges();
      setChallenges(updated);
      alert("Reto creado");
    } catch (e: any) {
      alert(e.message ?? "Error creando reto");
    }
  }

  async function removeChallenge(id: string) {
    if (!confirm("¿Borrar reto?")) return;
    try {
      await deleteChallenge(id);
      setChallenges(challenges.filter((c) => c.id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  }

  function resolveChallenge(c: Challenge) {
    setMatchForm({
      ...matchForm,
      player1_id: c.challenger_id,
      player2_id: c.challenged_id,
      challenge_id: c.id, 
      score_p1: "",
      score_p2: ""
    });

    if (matchFormRef.current) {
      matchFormRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /* ---------------- MATCHES LOGIC ---------------- */

  const [matchForm, setMatchForm] = useState({
    player1_id: "",
    player2_id: "",
    score_p1: "",
    score_p2: "",
    played_at: "",
    challenge_id: "" as string | undefined,
  });

  async function recordMatch() {
    if (!user) return alert("No auth user");
    
    const s1 = Number(matchForm.score_p1);
    const s2 = Number(matchForm.score_p2);

    if (
      !matchForm.player1_id ||
      !matchForm.player2_id ||
      matchForm.player1_id === matchForm.player2_id ||
      Number.isNaN(s1) ||
      Number.isNaN(s2) ||
      s1 === s2
    ) {
      return alert("Datos inválidos o empate");
    }

    try {
      await createMatch({
        player1_id: matchForm.player1_id,
        player2_id: matchForm.player2_id,
        score_p1: s1,
        score_p2: s2,
        created_by: user.id,
        played_at: matchForm.played_at ? new Date(matchForm.played_at).toISOString() : undefined,
        challenge_id: matchForm.challenge_id || undefined,
      });

      setMatchForm({ 
        player1_id: "", 
        player2_id: "", 
        score_p1: "", 
        score_p2: "",
        played_at: "",
        challenge_id: undefined 
      });
      setMatchPlayerFilter(""); 
      
      loadAllData();
      alert("Match registrado y reto actualizado (si existía)");
    } catch (e: any) {
      alert(e.message ?? "Error creando match");
    }
  }

  async function removeMatch(id: string) {
    if (!confirm("¿Borrar partido? Esto afectará al historial.")) return;
    try {
      await deleteMatch(id);
      setMatches(matches.filter((m) => m.id !== id));
    } catch (e: any) {
      alert(e.message);
    }
  }

  /* ---------------- FILTROS HELPERS ---------------- */

  const filteredPlayersList = players.filter(p => 
    p.username.toLowerCase().includes(playersListFilter.toLowerCase()) || 
    p.region_code?.toLowerCase().includes(playersListFilter.toLowerCase())
  );

  const filteredChallengesList = challenges.filter(c => 
    c.challenger?.username.toLowerCase().includes(challengesListFilter.toLowerCase()) ||
    c.challenged?.username.toLowerCase().includes(challengesListFilter.toLowerCase())
  );

  // Filtro para MATCHES
  const getFilteredOptions = (currentSelectedId: string) => {
    if (!matchPlayerFilter) return players;
    return players.filter(p => 
      p.username.toLowerCase().includes(matchPlayerFilter.toLowerCase()) || 
      p.id === currentSelectedId
    );
  };

  // Filtro para CHALLENGES (NUEVO)
  const getFilteredChallengeOptions = (currentSelectedId: string) => {
    if (!challengePlayerFilter) return players;
    return players.filter(p => 
      p.username.toLowerCase().includes(challengePlayerFilter.toLowerCase()) || 
      p.id === currentSelectedId
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <Layout>
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Admin Panel</h1>
        </div>
        <GameBadge variant="warning">Admin activo</GameBadge>
      </section>

      {loading ? (
        <p className="text-muted-foreground animate-pulse">Cargando sistema...</p>
      ) : (
        <div className="space-y-12">
          
          {/* ================= PLAYERS ================= */}
          <GameCard>
            <GameCardHeader>
              <GameCardTitle className="flex gap-2 items-center">
                <Users className="w-5 h-5" /> Players ({players.length})
              </GameCardTitle>
              <GameCardDescription>
                Gestión de usuarios, regiones y rangos.
              </GameCardDescription>
            </GameCardHeader>

            <GameCardContent className="space-y-6">
              {/* FORMULARIO CREAR/EDITAR */}
              <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                <div className="flex justify-between items-center">
                   <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                     {editingId ? "Editando Jugador" : "Nuevo Jugador"}
                   </h3>
                   {editingId && (
                     <GameButton size="sm" variant="ghost" onClick={cancelEditPlayer}>
                       <X className="w-4 h-4 mr-1"/> Cancelar
                     </GameButton>
                   )}
                </div>

                <div className="grid md:grid-cols-5 gap-4">
                  <Input
                    placeholder="Username"
                    value={playerForm.username}
                    onChange={(e) => setPlayerForm({ ...playerForm, username: e.target.value })}
                  />
                  <Input
                    placeholder="Epic ID"
                    value={playerForm.epic_id}
                    onChange={(e) => setPlayerForm({ ...playerForm, epic_id: e.target.value })}
                  />
                  <div>
                    <Input
                      list="regions-list"
                      placeholder="Buscar Región..."
                      value={playerForm.region_code}
                      onChange={(e) => setPlayerForm({ ...playerForm, region_code: e.target.value })}
                    />
                    <datalist id="regions-list">
                      {regions.map((r) => (
                        <option key={r.code} value={r.code}>
                          {r.name}
                        </option>
                      ))}
                    </datalist>
                  </div>
                  <div>
                    <Input
                      list="ranks-list"
                      placeholder="Buscar Rango..."
                      value={ranks.find(r => String(r.id) === playerForm.rank_1v1_id)?.name || playerForm.rank_1v1_id}
                      onChange={(e) => {
                         const val = e.target.value;
                         const foundRank = ranks.find(r => r.name === val || String(r.id) === val);
                         setPlayerForm({ 
                           ...playerForm, 
                           rank_1v1_id: foundRank ? String(foundRank.id) : val 
                         });
                      }}
                    />
                    <datalist id="ranks-list">
                      {ranks.map((r) => (
                        <option key={r.id} value={r.name}>
                          {r.code} (Tier {r.tier_order})
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <GameButton onClick={savePlayer}>
                    <Plus className="w-4 h-4 mr-2" />
                    {editingId ? "Actualizar" : "Añadir"}
                  </GameButton>
                </div>
              </div>

              {/* LISTA PLAYERS (Con Filtro) */}
              <div className="space-y-2">
                <div className="relative max-w-sm">
                  <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground"/>
                  <Input 
                    placeholder="Filtrar jugadores..." 
                    className="pl-8"
                    value={playersListFilter}
                    onChange={(e) => setPlayersListFilter(e.target.value)}
                  />
                </div>

                <div className="rounded-md border bg-background/50">
                  <div className="h-[400px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {filteredPlayersList.map((p) => (
                      <div
                        key={p.id}
                        className="flex justify-between items-center p-3 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">{p.username}</span>
                          <div className="text-xs text-muted-foreground flex gap-2">
                            <span>Epic: {p.epic_id || "N/A"}</span>
                            <span>•</span>
                            <span className="text-primary">
                              {p.region?.name || p.region_code || "Sin Región"}
                            </span>
                            <span>•</span>
                            <span className="text-yellow-500">
                              {p.rank?.name || "Unranked"}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <GameButton size="icon" variant="ghost" onClick={() => editPlayer(p)}>
                            <Pencil className="w-4 h-4" />
                          </GameButton>
                          <GameButton size="icon" variant="ghost" onClick={() => removePlayer(p.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </GameButton>
                        </div>
                      </div>
                    ))}
                    {filteredPlayersList.length === 0 && <p className="text-center p-4 text-muted-foreground">No players found.</p>}
                  </div>
                </div>
              </div>
            </GameCardContent>
          </GameCard>

          {/* ================= CHALLENGES ================= */}
          <GameCard>
            <GameCardHeader>
              <GameCardTitle className="flex gap-2 items-center">
                <ListChecks className="w-5 h-5" /> Challenges ({challenges.length})
              </GameCardTitle>
            </GameCardHeader>
            <GameCardContent className="space-y-6">
              
              {/* CREAR CHALLENGE (Con nuevo filtro) */}
              <div className="p-4 border rounded-lg bg-muted/20 space-y-3">
                 <div className="relative mb-2">
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground"/>
                    <Input
                       placeholder="Filtrar jugadores para nuevo reto..."
                       className="pl-8 bg-background"
                       value={challengePlayerFilter}
                       onChange={(e) => setChallengePlayerFilter(e.target.value)}
                    />
                 </div>

                 <div className="grid md:grid-cols-3 gap-4">
                  <select
                    className={selectClass}
                    value={challengeForm.challenger_id}
                    onChange={(e) => setChallengeForm({ ...challengeForm, challenger_id: e.target.value })}
                  >
                    <option value="">Desafiante...</option>
                    {getFilteredChallengeOptions(challengeForm.challenger_id).map((p) => (
                      <option key={p.id} value={p.id}>{p.username}</option>
                    ))}
                  </select>
                  <select
                    className={selectClass}
                    value={challengeForm.challenged_id}
                    onChange={(e) => setChallengeForm({ ...challengeForm, challenged_id: e.target.value })}
                  >
                    <option value="">Desafiado...</option>
                    {getFilteredChallengeOptions(challengeForm.challenged_id).map((p) => (
                      <option key={p.id} value={p.id}>{p.username}</option>
                    ))}
                  </select>
                  <GameButton onClick={handleCreateChallenge}>
                    <Plus className="w-4 h-4 mr-2" /> Crear Reto
                  </GameButton>
                </div>
              </div>

              {/* LISTA CHALLENGES (Con Filtro) */}
              <div className="space-y-2">
                <div className="relative max-w-sm">
                   <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground"/>
                   <Input 
                     placeholder="Filtrar retos por nombre..." 
                     className="pl-8"
                     value={challengesListFilter}
                     onChange={(e) => setChallengesListFilter(e.target.value)}
                   />
                </div>

                <div className="rounded-md border bg-background/50">
                   <div className="h-[300px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
                      {filteredChallengesList.map(c => (
                        <div key={c.id} className="flex justify-between items-center p-3 rounded-md bg-muted/30">
                          <div className="text-sm">
                             {/* INFO JUGADOR 1 */}
                             <span className="font-bold text-primary">
                               {c.challenger?.username ?? "Unknown"}
                             </span>
                             <span className="text-xs text-muted-foreground ml-1">
                               ({c.challenger?.region?.name ?? "N/A"})
                             </span>

                             <span className="mx-2 text-muted-foreground">vs</span>

                             {/* INFO JUGADOR 2 */}
                             <span className="font-bold text-destructive">
                               {c.challenged?.username ?? "Unknown"}
                             </span>
                             <span className="text-xs text-muted-foreground ml-1">
                               ({c.challenged?.region?.name ?? "N/A"})
                             </span>

                             <div className="text-xs text-muted-foreground mt-1">
                               Status: <span className="uppercase text-foreground">{c.status}</span> • {new Date(c.created_at).toLocaleDateString()}
                             </div>
                          </div>
                          
                          <div className="flex gap-2">
                             {/* BOTON RESOLVER */}
                             {c.status !== "played" && (
                                <GameButton 
                                  size="sm" 
                                  variant="glow" 
                                  className="h-8"
                                  title="Resolver: Crear partido con estos jugadores"
                                  onClick={() => resolveChallenge(c)}
                                >
                                  <CheckCircle2 className="w-4 h-4 mr-1"/> Resolve
                                </GameButton>
                             )}

                             <GameButton size="icon" variant="ghost" onClick={() => removeChallenge(c.id)}>
                                <Trash2 className="w-4 h-4 text-destructive" />
                             </GameButton>
                          </div>
                        </div>
                      ))}
                      {filteredChallengesList.length === 0 && <p className="text-center p-4 text-muted-foreground">No challenges found.</p>}
                   </div>
                </div>
              </div>
            </GameCardContent>
          </GameCard>

          {/* ================= MATCHES ================= */}
          <GameCard ref={matchFormRef} className="scroll-mt-24">
            <GameCardHeader>
              <GameCardTitle className="flex gap-2 items-center">
                <Swords className="w-5 h-5" /> Matches ({matches.length})
              </GameCardTitle>
            </GameCardHeader>

            <GameCardContent className="space-y-6">
              {/* CREAR MATCH */}
              <div className="p-4 border rounded-lg bg-muted/20 space-y-3">
                
                {/* FILTRO PARA SELECTORES DE MATCHES */}
                <div className="relative mb-2">
                   <Search className="absolute left-2 top-2.5 w-4 h-4 text-muted-foreground"/>
                   <Input
                      placeholder="Filtrar jugadores en los selectores..."
                      className="pl-8 bg-background"
                      value={matchPlayerFilter}
                      onChange={(e) => setMatchPlayerFilter(e.target.value)}
                   />
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <select
                    className={selectClass}
                    value={matchForm.player1_id}
                    onChange={(e) => setMatchForm({ ...matchForm, player1_id: e.target.value })}
                  >
                    <option value="">Player 1...</option>
                    {getFilteredOptions(matchForm.player1_id).map((p) => (
                      <option key={p.id} value={p.id}>{p.username}</option>
                    ))}
                  </select>

                  <select
                    className={selectClass}
                    value={matchForm.player2_id}
                    onChange={(e) => setMatchForm({ ...matchForm, player2_id: e.target.value })}
                  >
                    <option value="">Player 2...</option>
                    {getFilteredOptions(matchForm.player2_id).map((p) => (
                      <option key={p.id} value={p.id}>{p.username}</option>
                    ))}
                  </select>

                  <Input
                    type="number"
                    placeholder="Score P1"
                    value={matchForm.score_p1}
                    onChange={(e) => setMatchForm({ ...matchForm, score_p1: e.target.value })}
                  />
                  <Input
                    type="number"
                    placeholder="Score P2"
                    value={matchForm.score_p2}
                    onChange={(e) => setMatchForm({ ...matchForm, score_p2: e.target.value })}
                  />
                  
                  {/* SELECTOR DE FECHA OPCIONAL */}
                  <div className="md:col-span-2 relative">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-muted-foreground"/>
                        <span className="text-xs text-muted-foreground">Fecha (Opcional - por defecto HOY)</span>
                    </div>
                    <Input
                      type="datetime-local"
                      value={matchForm.played_at}
                      onChange={(e) => setMatchForm({ ...matchForm, played_at: e.target.value })}
                      className="w-full"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-end">
                    <GameButton className="w-full" onClick={recordMatch}>
                      <Swords className="w-4 h-4 mr-2" /> Registrar Resultado
                    </GameButton>
                  </div>
                </div>

                {matchForm.challenge_id && (
                  <div className="text-xs text-green-400 flex items-center bg-green-950/30 p-2 rounded">
                    <CheckCircle2 className="w-3 h-3 mr-1"/>
                    Este partido resolverá un Challenge activo.
                  </div>
                )}
              </div>

              {/* LISTA MATCHES */}
              <div className="rounded-md border bg-background/50">
                 <div className="h-[300px] overflow-y-auto p-2 space-y-2 custom-scrollbar">
                    {matches.map(m => (
                      <div key={m.id} className="flex justify-between items-center p-3 rounded-md bg-muted/30">
                        <div className="text-sm flex flex-col gap-1">
                           <div className="flex items-center gap-2">
                             <span className={m.score_p1 > m.score_p2 ? "text-green-500 font-bold" : ""}>
                               {m.player1?.username}
                             </span>
                             <span className="font-mono bg-background px-2 py-0.5 rounded border">
                               {m.score_p1} - {m.score_p2}
                             </span>
                             <span className={m.score_p2 > m.score_p1 ? "text-green-500 font-bold" : ""}>
                               {m.player2?.username}
                             </span>
                           </div>
                           <span className="text-xs text-muted-foreground">
                             {new Date(m.created_at).toLocaleDateString()}
                             {m.played_at && m.played_at !== m.created_at && (
                               <span className="ml-2 text-primary/70">(Jugado: {new Date(m.played_at).toLocaleDateString()})</span>
                             )}
                           </span>
                        </div>
                        <GameButton size="icon" variant="ghost" onClick={() => removeMatch(m.id)}>
                            <Trash2 className="w-4 h-4 text-destructive" />
                        </GameButton>
                      </div>
                    ))}
                    {matches.length === 0 && <p className="text-center p-4 text-muted-foreground">No matches found.</p>}
                 </div>
              </div>
            </GameCardContent>
          </GameCard>
          
        </div>
      )}
    </Layout>
  );
}