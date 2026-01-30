import { motion } from "framer-motion";
import { Clock, Trophy, MapPin, Calendar } from "lucide-react";
import type { Match } from "@shared/schema";

interface ScoreCardProps {
  match: Match;
}

export function ScoreCard({ match }: ScoreCardProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-1 relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
      
      <div className="relative glass-panel rounded-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="bg-black/40 px-6 py-3 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-2 text-white/60 text-sm font-medium tracking-wider uppercase">
            <MapPin className="w-4 h-4 text-primary" />
            {match.stadium}
          </div>
        </div>

        {/* Main Score Area */}
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-b from-transparent to-black/20">
          
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1 order-2 md:order-1">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 p-1 shadow-lg shadow-blue-500/20 mb-4 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-3xl font-bold font-display text-white border border-white/10">
                {match.homeTeam.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center font-display tracking-tight leading-none mb-2">
              {match.homeTeam}
            </h2>
            <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold tracking-widest text-white/50 uppercase border border-white/5">
              Player 1
            </span>
          </div>

          {/* Score & Time */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2 shrink-0">
            <div className="flex items-center gap-4 md:gap-8 mb-4">
              <span className="text-6xl md:text-8xl font-black text-white font-mono tracking-tighter drop-shadow-2xl tabular-nums animate-score-change">
                {match.homeScore}
              </span>
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <span className="text-6xl md:text-8xl font-black text-white font-mono tracking-tighter drop-shadow-2xl tabular-nums animate-score-change">
                {match.awayScore}
              </span>
            </div>
            
            <div className="flex flex-col items-center gap-2">
              <div className={`
                flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-md
                ${match.isLive 
                  ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                  : 'bg-white/5 border-white/10 text-white/40'
                }
              `}>
                {match.isLive && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                <Clock className="w-3.5 h-3.5" />
                <span className="text-sm font-bold font-mono tracking-widest">
                  {match.time}
                </span>
              </div>
              
              {match.homeScore > match.awayScore && !match.isLive && (
                <div className="text-xs font-medium text-emerald-400 mt-2 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> {match.homeTeam} Wins
                </div>
              )}
              {match.awayScore > match.homeScore && !match.isLive && (
                <div className="text-xs font-medium text-emerald-400 mt-2 flex items-center gap-1">
                  <Trophy className="w-3 h-3" /> {match.awayTeam} Wins
                </div>
              )}
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1 order-3">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-pink-500 to-rose-700 p-1 shadow-lg shadow-pink-500/20 mb-4 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-3xl font-bold font-display text-white border border-white/10">
                {match.awayTeam.substring(0, 2).toUpperCase()}
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white text-center font-display tracking-tight leading-none mb-2">
              {match.awayTeam}
            </h2>
            <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold tracking-widest text-white/50 uppercase border border-white/5">
              Player 2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
