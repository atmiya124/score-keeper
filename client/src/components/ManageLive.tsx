import type { Match } from "@shared/schema";
import { useUpdateMatch } from "@/hooks/use-matches";
import { Play, Pause, Square, ChevronUp, ChevronDown, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface ManageLiveProps {
  match: Match;
}

export function ManageLive({ match }: ManageLiveProps) {
  const updateMutation = useUpdateMatch();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Only when match ID changes (new match after create/replace): reset timer from DB and stop it.
  // Don't depend on match.time or refetches will stop the timer when we sync time to the server.
  useEffect(() => {
    setIsRunning(false);
    if (match?.time) {
      const [m, s] = match.time.split(":").map(Number);
      if (!isNaN(m) && !isNaN(s)) setSeconds(m * 60 + s);
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
    } else if (timerRef.current) clearInterval(timerRef.current);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  // Sync time to server every 250ms when running so the dashboard refetch doesn't skip seconds
  const lastSyncRef = useRef(0);
  useEffect(() => {
    if (!isRunning || !match) return;
    const timeStr = `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60).toString().padStart(2, "0")}`;
    const now = Date.now();
    if (now - lastSyncRef.current >= 250) {
      lastSyncRef.current = now;
      updateMutation.mutate({ id: match.id, time: timeStr });
    }
  }, [seconds, isRunning, match?.id]);

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleScoreUpdate = (e: React.MouseEvent, team: "home" | "away", delta: number) => {
    e.preventDefault();
    e.stopPropagation();
    const newScore = Math.max(0, (team === "home" ? match.homeScore : match.awayScore) + delta);
    updateMutation.mutate({
      id: match.id,
      [team === "home" ? "homeScore" : "awayScore"]: newScore,
    });
  };

  const handleTimerAction = (e: React.MouseEvent, action: "start" | "pause" | "reset" | "end") => {
    e.preventDefault();
    e.stopPropagation();
    if (action === "start") setIsRunning(true);
    if (action === "pause") {
      setIsRunning(false);
      const timeStr = formatTime(seconds);
      updateMutation.mutate({ id: match.id, time: timeStr });
    }
    if (action === "reset") {
      setIsRunning(false);
      setSeconds(12 * 60);
      updateMutation.mutateAsync({ id: match.id, time: "12:00", isLive: true });
    }
    if (action === "end") {
      setIsRunning(false);
      const timeStr = formatTime(seconds);
      updateMutation.mutateAsync({ id: match.id, time: timeStr, isLive: false }).then(() => {
        toast({ title: "Match Ended", description: "Match status set to Final." });
      });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      <Card className="bg-white/5 border-white/10 text-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-display flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Match Timer
          </CardTitle>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${match.isLive ? "bg-red-500/20 text-red-400" : "bg-white/10 text-white/40"}`}>
            {match.isLive ? "LIVE" : "FINAL"}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <div className="text-8xl font-mono font-black tracking-tighter mb-8 tabular-nums">
            {formatTime(seconds)}
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            {!isRunning ? (
              <Button type="button" size="lg" onClick={(e) => handleTimerAction(e, "start")} className="bg-emerald-600 hover:bg-emerald-700">
                <Play className="w-5 h-5 mr-2" /> Start
              </Button>
            ) : (
              <Button type="button" size="lg" onClick={(e) => handleTimerAction(e, "pause")} className="bg-amber-600 hover:bg-amber-700">
                <Pause className="w-5 h-5 mr-2" /> Pause
              </Button>
            )}
            <Button type="button" size="lg" variant="outline" onClick={(e) => handleTimerAction(e, "reset")} className="border-white/20 hover:bg-white/10">
              Reset (12m)
            </Button>
            <Button type="button" size="lg" variant="destructive" onClick={(e) => handleTimerAction(e, "end")}>
              <Square className="w-5 h-5 mr-2" /> End Match
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
          <div className="h-2 bg-blue-600" />
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-display">{match.homeTeam}</CardTitle>
            <p className="text-white/50 text-sm">
              {match.homePlayers?.length ? match.homePlayers.join(", ") : "—"}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-8">
            <div className="text-7xl font-mono font-bold mb-6">{match.homeScore}</div>
            <div className="flex gap-4">
              <Button type="button" size="lg" variant="outline" className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10" onClick={(e) => handleScoreUpdate(e, "home", -1)}>
                <ChevronDown className="w-8 h-8" />
              </Button>
              <Button type="button" size="lg" variant="outline" className="h-16 w-16 rounded-2xl border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400" onClick={(e) => handleScoreUpdate(e, "home", 1)}>
                <ChevronUp className="w-8 h-8" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10 text-white overflow-hidden">
          <div className="h-2 bg-pink-600" />
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-display">{match.awayTeam}</CardTitle>
            <p className="text-white/50 text-sm">
              {match.awayPlayers?.length ? match.awayPlayers.join(", ") : "—"}
            </p>
          </CardHeader>
          <CardContent className="flex flex-col items-center pb-8">
            <div className="text-7xl font-mono font-bold mb-6">{match.awayScore}</div>
            <div className="flex gap-4">
              <Button type="button" size="lg" variant="outline" className="h-16 w-16 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10" onClick={(e) => handleScoreUpdate(e, "away", -1)}>
                <ChevronDown className="w-8 h-8" />
              </Button>
              <Button type="button" size="lg" variant="outline" className="h-16 w-16 rounded-2xl border-pink-500/50 bg-pink-500/10 hover:bg-pink-500/20 text-pink-400" onClick={(e) => handleScoreUpdate(e, "away", 1)}>
                <ChevronUp className="w-8 h-8" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
