import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
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
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Rocket } from "lucide-react";

export default function Auth() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;

        // si todo va bien, redirigimos
        navigate("/admin");
      } else {
        // REGISTER
        const { error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;

        alert(
          "Cuenta creada. Revisa tu email si la verificación está activada."
        );
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message ?? "Authentication error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 glow-primary mb-4">
            <Rocket className="w-8 h-8 text-primary" />
          </div>

          <h1 className="text-2xl font-display font-bold">
            {isLogin ? "Welcome Back" : "Join the League"}
          </h1>

          <p className="text-muted-foreground mt-2">
            {isLogin
              ? "Sign in to your account to continue"
              : "Create an account to start competing"}
          </p>
        </div>

        <GameCard variant="highlight">
          <GameCardHeader>
            <GameCardTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-primary" />
              {isLogin ? "Sign In" : "Create Account"}
            </GameCardTitle>
            <GameCardDescription>
              <GameBadge variant="outline" className="mt-1">
                Supabase Auth
              </GameBadge>
            </GameCardDescription>
          </GameCardHeader>

          <GameCardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="player@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              {error && (
                <div className="text-sm text-destructive text-center">
                  {error}
                </div>
              )}

              <GameButton
                type="submit"
                variant="glow"
                className="w-full"
                disabled={loading}
              >
                {loading
                  ? "Please wait..."
                  : isLogin
                  ? "Sign In"
                  : "Create Account"}
              </GameButton>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm">
                {isLogin
                  ? "Don't have an account?"
                  : "Already have an account?"}
              </p>
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline text-sm font-medium mt-1"
              >
                {/* {isLogin ? "Create one" : "Sign in instead"} */}
              </button>
            </div>
          </GameCardContent>
        </GameCard>

        <p className="text-center text-muted-foreground text-xs mt-6">
          Authentication powered by Supabase
        </p>
      </div>
    </Layout>
  );
}
