import { useMatches, useUpdateMatch } from "@/hooks/use-matches";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Play, Pause, Square, ChevronUp, ChevronDown, Clock, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ManageMatch() {
  const [location] = useLocation();
  const matchId = new URLSearchParams(window.location.search).get("id");
  const { data: matches } = useMatches();
  const match = matches?.find(m => m.id === Number(matchId));
  const updateMutation = useUpdateMatch();
  const { toast } = useToast();

  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (match?.time) {
      const [m, s] = match.time.split(":").map(Number);
      if (!isNaN(m) && !isNaN(s)) {
        setSeconds(m * 60 + s);
      }
    }
  }, [match?.id]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          if (prev <= 0) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Sync timer to DB occasionally
  useEffect(() => {
    if (isRunning && seconds % 10 === 0 && match) {
      const timeStr = `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${(seconds % 60).toString().padStart(2, '0')}`;
      updateMutation.mutate({ id: match.id, time: timeStr });
    }
  }, [seconds, isRunning]);

  if (!match) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 mb-4">Match not found or no ID provided.</p>
          <Link href="/admin">
            <Button variant="outline">Back to Admin</Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleScoreUpdate = async (team: 'home' | 'away', delta: number) => {
    const newScore = Math.max(0, (team === 'home' ? match.homeScore : match.awayScore) + delta);
    try {
      await updateMutation.mutateAsync({
        id: match.id,
        [team === 'home' ? 'homeScore' : 'awayScore']: newScore
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update score", variant: "destructive" });
    }
  };

  const handleTimerAction = async (action: 'start' | 'pause' | 'reset' | 'end') => {
    if (action === 'start') setIsRunning(true);
    if (action === 'pause') setIsRunning(false);
    if (action === 'reset') {
      setIsRunning(false);
      setSeconds(12 * 60);
      await updateMutation.mutateAsync({ id: match.id, time: "12:00", isLive: true });
    }
    if (action === 'end') {
      setIsRunning(false);
      const timeStr = formatTime(seconds);
      await updateMutation.mutateAsync({ id: match.id, time: timeStr, isLive: false });
      toast({ title: "Match Ended", description: "Match status set to Final." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-body p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin">
            <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-transparent hover:bg-white/10 text-white">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-display font-bold">Match Manager</h1>
            <p className="text-white/40">{match.stadium}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Timer Control */}
          <Card className="bg-white/5 border-white/10 text-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-display flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Match Timer
              </CardTitle>
              <div className={`px-3 py-1 rounded-full text-xs font-bold ${match.isLive ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/40'}`}>
                {match.isLive ? 'LIVE' : 'FINAL'}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-8">
              <div className="text-8xl font-mono font-black tracking-tighter mb-8 tabular-nums">
                {formatTime(seconds)}
              </div>
              <div className="flex gap-4">
                {!isRunning ? (
                  <Button size="lg" onClick={() => handleTimerAction('start')} className="bg-emerald-600 hover:bg-emerald-700">
                    <Play className="w-5 h-5 mr-2" /> Start
                  </Button>
                ) : (
                  <Button size="lg" onClick={() => handleTimerAction('pause')} className="bg-amber-600 hover:bg-amber-700">
                    <Pause className="w-5 h-5 mr-2" /> Pause
                  </Button>
                )}
                <Button size="lg" variant="outline" onClick={() => handleTimerAction('reset')} className="border-white/20 hover:bg-white/10">
                  Reset (12m)
                </Button>
                <Button size="lg" variant="destructive" onClick={() => handleTimerAction('end')}>
                  <Square className="w-5 h-5 mr-2" /> End Match
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Score Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Team A */}
            <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
              <div className="h-2 bg-blue-600" />
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-display">{match.homeTeam}</CardTitle>
                <p className="text-white/40 text-xs uppercase tracking-widest">Team A</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-8">
                <div className="text-7xl font-mono font-bold mb-6">{match.homeScore}</div>
                <div className="flex gap-4">
                  <Button size="lg" variant="outline" className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10" onClick={() => handleScoreUpdate('home', -1)}>
                    <ChevronDown className="w-8 h-8" />
                  </Button>
                  <Button size="lg" variant="outline" className="h-16 w-16 rounded-2xl border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400" onClick={() => handleScoreUpdate('home', 1)}>
                    <ChevronUp className="w-8 h-8" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Team B */}
            <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
              <div className="h-2 bg-pink-600" />
              <CardHeader className="text-center">
                <CardTitle className="text-xl font-display">{match.awayTeam}</CardTitle>
                <p className="text-white/40 text-xs uppercase tracking-widest">Team B</p>
              </CardHeader>
              <CardContent className="flex flex-col items-center pb-8">
                <div className="text-7xl font-mono font-bold mb-6">{match.awayScore}</div>
                <div className="flex gap-4">
                  <Button size="lg" variant="outline" className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10" onClick={() => handleScoreUpdate('away', -1)}>
                    <ChevronDown className="w-8 h-8" />
                  </Button>
                  <Button size="lg" variant="outline" className="h-16 w-16 rounded-2xl border-pink-500/50 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400" onClick={() => handleScoreUpdate('away', 1)}>
                    <ChevronUp className="w-8 h-8" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
