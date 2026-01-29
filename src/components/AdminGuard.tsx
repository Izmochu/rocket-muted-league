import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: React.ReactNode;
};

export default function AdminGuard({ children }: Props) {
  const { user, isAdmin, loading } = useAuth();

  // Mientras se resuelve auth + perfil
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  // No logeado → login
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Logeado pero NO admin → fuera
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Admin OK
  return <>{children}</>;
}
