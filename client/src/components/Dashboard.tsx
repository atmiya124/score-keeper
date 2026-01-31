import { useMatches } from "@/hooks/use-matches";
import { ScoreCard } from "@/components/ScoreCard";
import { Link } from "wouter";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Dashboard component: broadcast view of matches.
 * Used on the home page (/). Refetches matches on mount so updates show without manual refresh.
 */
export function Dashboard() {
  const { data: matches, isLoading } = useMatches();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
          <p className="text-white/50 font-display tracking-widest uppercase text-sm">Loading Broadcast...</p>
        </div>
      </div>
    );
  }

  // Only one match is shown on the big screen at a time
  const currentMatch = matches?.[0] ?? null;

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden font-body selection:bg-primary/30">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-12">
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
              Atmiya Badminton 2026
            </h1>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-12 w-12">
              <Settings className="w-8 h-8" />
            </Button>
          </Link>
        </header>

        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-white/40">Live Score</h2>
          </div>
          {currentMatch ? (
            <ScoreCard match={currentMatch} />
          ) : (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
              <p className="text-white/30 text-lg font-display">No match on screen — set one in Admin</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
