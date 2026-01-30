import { useMatches } from "@/hooks/use-matches";
import { ScoreCard } from "@/components/ScoreCard";
import { Link } from "wouter";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
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

  const liveMatches = matches?.filter(m => m.isLive) || [];
  const otherMatches = matches?.filter(m => !m.isLive) || [];
  
  // Sort: Live matches first, then by ID desc
  const displayMatches = [...liveMatches, ...otherMatches];

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden font-body selection:bg-primary/30">
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-12">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-display font-black text-white text-xl shadow-lg shadow-primary/25">
              S
            </div>
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              ScoreBoard<span className="text-primary">.live</span>
            </h1>
          </div>
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-white/10 rounded-full">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </header>

        {/* Live Matches Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h2 className="text-sm font-bold tracking-widest uppercase text-white/40">Live Broadcast</h2>
          </div>
          
          <div className="grid gap-8">
            {displayMatches.length > 0 ? (
              displayMatches.map(match => (
                <div key={match.id} className="transform hover:scale-[1.01] transition-transform duration-300">
                  <ScoreCard match={match} />
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
                <p className="text-white/30 text-lg font-display">No matches scheduled</p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-white/20 text-xs py-8 border-t border-white/5">
          <p>© 2024 Sports Broadcast System. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
