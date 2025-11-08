import React from "react";
import { AppHeader } from "./AppHeader";
import { RadioPlayer } from "../RadioPlayer";
import { Toaster } from "@/components/ui/sonner";
type AppLayoutProps = {
  children: React.ReactNode;
};
export function AppLayout({ children }: AppLayoutProps): JSX.Element {
  return (
    <div className="dark">
      <div className="min-h-screen flex flex-col bg-retro-background">
        <AppHeader />
        <main className="flex-1">
          {children}
        </main>
        <RadioPlayer />
        <Toaster 
          theme="dark"
          toastOptions={{
            classNames: {
              toast: 'bg-retro-background border-retro-primary/50 text-retro-accent',
              title: 'text-retro-accent',
              description: 'text-retro-accent/80',
            },
          }}
        />
      </div>
    </div>
  );
}