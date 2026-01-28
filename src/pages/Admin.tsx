import { useState } from "react";
import { Layout } from "@/components/Layout";
import { GameCard, GameCardHeader, GameCardTitle, GameCardDescription, GameCardContent } from "@/components/ui/game-card";
import { GameButton } from "@/components/ui/game-button";
import { GameBadge } from "@/components/ui/game-badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Plus, ListChecks, Swords, Check, X } from "lucide-react";

// Mock challenges for admin
const mockAdminChallenges = [
  { id: "1", challenger: "TurboBlaze", challenged: "DemoDevil", status: "pending" },
  { id: "2", challenger: "AerialAce", challenged: "BoostPhantom", status: "accepted" },
  { id: "3", challenger: "ShadowFlick", challenged: "RocketNova", status: "pending" },
];

const Admin = () => {
  const [matchForm, setMatchForm] = useState({
    player1: "",
    player2: "",
    score1: "",
    score2: "",
  });

  const handleMatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder - would submit to backend
    console.log("Match submitted:", matchForm);
    alert("Match recorded! (This is a placeholder - backend not connected)");
    setMatchForm({ player1: "", player2: "", score1: "", score2: "" });
  };

  return (
    <Layout>
      <section className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Manage matches, challenges, and league settings
        </p>
        <GameBadge variant="warning" className="mt-2">
          No authentication required (MVP)
        </GameBadge>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Create Match */}
        <GameCard variant="highlight">
          <GameCardHeader>
            <GameCardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" />
              Record Match Result
            </GameCardTitle>
            <GameCardDescription>
              Enter match details to record a completed game
            </GameCardDescription>
          </GameCardHeader>
          <GameCardContent>
            <form onSubmit={handleMatchSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="player1">Player 1</Label>
                  <Input
                    id="player1"
                    placeholder="Username"
                    value={matchForm.player1}
                    onChange={(e) => setMatchForm({ ...matchForm, player1: e.target.value })}
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="player2">Player 2</Label>
                  <Input
                    id="player2"
                    placeholder="Username"
                    value={matchForm.player2}
                    onChange={(e) => setMatchForm({ ...matchForm, player2: e.target.value })}
                    className="bg-muted/50 border-border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="score1">Score P1</Label>
                  <Input
                    id="score1"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={matchForm.score1}
                    onChange={(e) => setMatchForm({ ...matchForm, score1: e.target.value })}
                    className="bg-muted/50 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="score2">Score P2</Label>
                  <Input
                    id="score2"
                    type="number"
                    placeholder="0"
                    min="0"
                    value={matchForm.score2}
                    onChange={(e) => setMatchForm({ ...matchForm, score2: e.target.value })}
                    className="bg-muted/50 border-border"
                  />
                </div>
              </div>
              <GameButton type="submit" className="w-full">
                <Swords className="w-4 h-4" />
                Record Match
              </GameButton>
            </form>
          </GameCardContent>
        </GameCard>

        {/* Manage Challenges */}
        <GameCard>
          <GameCardHeader>
            <GameCardTitle className="flex items-center gap-2">
              <ListChecks className="w-5 h-5 text-primary" />
              Manage Challenges
            </GameCardTitle>
            <GameCardDescription>
              Approve, decline, or resolve challenges
            </GameCardDescription>
          </GameCardHeader>
          <GameCardContent className="space-y-3">
            {mockAdminChallenges.map((challenge) => (
              <div
                key={challenge.id}
                className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
              >
                <div>
                  <p className="font-medium">
                    <span className="text-primary">{challenge.challenger}</span>
                    <span className="text-muted-foreground mx-2">→</span>
                    <span>{challenge.challenged}</span>
                  </p>
                  <GameBadge
                    variant={challenge.status === "pending" ? "warning" : "success"}
                    className="mt-1"
                  >
                    {challenge.status}
                  </GameBadge>
                </div>
                <div className="flex gap-2">
                  <GameButton size="icon" variant="ghost" className="text-success hover:text-success">
                    <Check className="w-4 h-4" />
                  </GameButton>
                  <GameButton size="icon" variant="ghost" className="text-destructive hover:text-destructive">
                    <X className="w-4 h-4" />
                  </GameButton>
                </div>
              </div>
            ))}
          </GameCardContent>
        </GameCard>
      </div>
    </Layout>
  );
};

export default Admin;
