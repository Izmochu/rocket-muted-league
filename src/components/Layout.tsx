import { ReactNode } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen gradient-dark">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="border-t border-border/30 mt-16">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p className="font-display tracking-wide">
            Rocket <span className="text-primary">Muted</span> League © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}
