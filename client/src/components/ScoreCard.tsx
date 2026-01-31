import { motion } from "framer-motion";
import { Clock, Trophy, MapPin, Calendar } from "lucide-react";
import type { Match } from "@shared/schema";

interface ScoreCardProps {
  match: Match;
}

export function ScoreCard({ match }: ScoreCardProps) {
  return (
    <div className="w-full max-w-[1700px] mx-auto p-1 relative">
      <div className="relative glass-panel rounded-2xl overflow-hidden">
        {/* Header Bar */}
        <div className="bg-black/40 px-6 py-4 flex justify-center items-center border-b border-white/5">
          <div className="text-white/60 text-lg md:text-xl font-bold tracking-widest uppercase">
            {match.stadium}
          </div>
        </div>

        {/* Main Score Area */}
        <div className="p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 bg-gradient-to-b from-transparent to-black/20">
          
          {/* Home Team */}
          <div className="flex flex-col items-center flex-1 order-2 md:order-1">
            <div className="w-full max-w-[320px] py-4 rounded-3xl bg-blue-500/80 shadow-lg shadow-blue-500/20 mb-6 flex items-center justify-center border border-white/30 backdrop-blur-md">
              <span className="text-2xl md:text-4xl font-bold font-display text-white tracking-wide uppercase text-center px-4">
                {match.homeTeam}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {match.homePlayers?.map((player, idx) => (
                <span key={idx} className="px-4 py-2 rounded-full bg-blue-500/20 text-xs md:text-sm font-bold tracking-widest text-blue-300 uppercase border border-blue-500/30">
                  {player}
                </span>
              ))}
            </div>
          </div>

          {/* Score & Time */}
          <div className="flex flex-col items-center justify-center order-1 md:order-2 shrink-0">
            <div className="flex items-center gap-8 md:gap-16 mb-8">
              <span className="text-8xl md:text-[12rem] font-black text-white font-mono tracking-tighter drop-shadow-2xl tabular-nums animate-score-change leading-none">
                {match.homeScore}
              </span>
              <div className="h-24 md:h-32 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <span className="text-8xl md:text-[12rem] font-black text-white font-mono tracking-tighter drop-shadow-2xl tabular-nums animate-score-change leading-none">
                {match.awayScore}
              </span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className={`
                flex items-center gap-3 px-6 py-2 rounded-full border backdrop-blur-md
                ${match.isLive 
                  ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                  : 'bg-white/5 border-white/10 text-white/40'
                }
              `}>
                {match.isLive && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                )}
                <Clock className="w-5 h-5" />
                <span className="text-lg md:text-2xl font-bold font-mono tracking-widest">
                  {match.time}
                </span>
              </div>
            </div>
          </div>

          {/* Away Team */}
          <div className="flex flex-col items-center flex-1 order-3">
            <div className="w-full max-w-[320px] py-4 rounded-3xl bg-pink-500/80 shadow-lg shadow-pink-500/20 mb-6 flex items-center justify-center border border-white/30 backdrop-blur-md">
              <span className="text-2xl md:text-4xl font-bold font-display text-white tracking-wide uppercase text-center px-4">
                {match.awayTeam}
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-4">
              {match.awayPlayers?.map((player, idx) => (
                <span key={idx} className="px-4 py-2 rounded-full bg-pink-500/20 text-xs md:text-sm font-bold tracking-widest text-pink-300 uppercase border border-pink-500/30">
                  {player}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
