import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Home,
  Trophy, // Cambiado Users por Trophy para "Leaderboard"
  Swords,
  Target,
  Shield,
  LogIn,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, isAdmin, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      navigate("/auth", { replace: true });
    }
  };

  const navItems = [
    { path: "/", label: "Home", icon: Home, show: true },
    { path: "/players", label: "Leaderboard", icon: Trophy, show: true }, // CAMBIO AQUÍ
    { path: "/matches", label: "Matches", icon: Swords, show: true },
    { path: "/challenges", label: "Challenges", icon: Target, show: true },

    {
      path: "/admin",
      label: "Admin",
      icon: Shield,
      show: isAdmin,
    },
    {
      path: "/auth",
      label: "Login",
      icon: LogIn,
      show: !user,
    },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center transition-all group-hover:shadow-[0_0_15px_rgba(99,102,241,0.5)] group-hover:scale-105">
              <span className="font-display font-bold text-primary text-lg">
                R
              </span>
            </div>
            <span className="font-display text-lg font-semibold text-foreground hidden sm:block">
              Rocket <span className="text-primary">Muted</span> League
            </span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1 md:gap-2">
            {navItems
              .filter(item => item.show)
              .map(item => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                      "hover:bg-muted hover:text-foreground",
                      isActive
                        ? "bg-primary/10 text-primary border border-primary/30 shadow-sm"
                        : "text-muted-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden md:inline">{item.label}</span>
                  </Link>
                );
              })}

            {/* User info */}
            {user && (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-border/50">
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="max-w-[100px] truncate">
                    {profile?.username ?? user.email}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1 p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}