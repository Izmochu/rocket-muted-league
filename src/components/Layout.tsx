import { ReactNode } from "react";
import { useLocation } from "react-router-dom"; // Importamos el hook para saber dónde estamos
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // Detectamos si estamos en la Home
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen relative bg-background/90">
      {/* === FONDO GLOBAL (Solo para NO-Home) ===
         Si NO es home, renderizamos la imagen fija.
         Asegúrate de meter tu imagen en public/assets/background.jpg
      */}
      {!isHome && (
        <div className="fixed inset-0 z-0">
          <img 
            src="/img/wallpaper02.jpg" 
            alt="App Background" 
            className="w-full h-full object-cover"
          />
          {/* Capa de opacidad (negro al 85%). Cámbialo a bg-black/50 si la quieres más clara */}
          <div className="absolute inset-0 bg-black/85"></div>
        </div>
      )}

      {/* === CONTENIDO ===
         Navbar y páginas (children).
         Usamos 'relative z-10' para que flote ENCIMA del fondo (sea video o imagen).
      */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="container mx-auto px-4 py-8 flex-1">
          {children}
        </main>
        
        <footer className="border-t border-white/10 mt-16 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
            <p className="font-display tracking-wide">
              Rocket <span className="text-primary">Muted</span> League © 2024
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}