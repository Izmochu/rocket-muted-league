import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Home, Users, Swords, Target, Shield, LogIn } from "lucide-react";

const navItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/players", label: "Players", icon: Users },
  { path: "/matches", label: "Matches", icon: Swords },
  { path: "/challenges", label: "Challenges", icon: Target },
  { path: "/admin", label: "Admin", icon: Shield },
  { path: "/auth", label: "Login", icon: LogIn },
];

export function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center glow-primary-sm group-hover:glow-primary transition-all">
              <span className="font-display font-bold text-primary text-lg">R</span>
            </div>
            <span className="font-display text-lg font-semibold text-foreground hidden sm:block">
              Rocket <span className="text-primary">Muted</span> League
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
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
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
