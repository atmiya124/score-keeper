import { useMatches, useDeleteMatch } from "@/hooks/use-matches";
import { MatchControlPanel } from "@/components/MatchControlPanel";
import { Link } from "wouter";
import { ArrowLeft, Trash2, Edit, Calendar, Clock, Trophy, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { format } from "date-fns";

export default function Admin() {
  const { data: matches, isLoading } = useMatches();
  const deleteMutation = useDeleteMatch();

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-body">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="rounded-full border-white/20 bg-transparent hover:bg-white/10 text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold">Match Control</h1>
              <p className="text-white/40">Manage scores, teams, and schedules</p>
            </div>
          </div>
          <MatchControlPanel />
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-white/40 text-sm font-bold uppercase tracking-wider mb-1">Total Matches</h3>
            <p className="text-4xl font-display font-bold text-white">{matches?.length || 0}</p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-white/40 text-sm font-bold uppercase tracking-wider mb-1">Live Now</h3>
            <p className="text-4xl font-display font-bold text-red-500">
              {matches?.filter(m => m.isLive).length || 0}
            </p>
          </div>
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-white/40 text-sm font-bold uppercase tracking-wider mb-1">Completed</h3>
            <p className="text-4xl font-display font-bold text-emerald-500">
              {matches?.filter(m => !m.isLive).length || 0}
            </p>
          </div>
        </div>

        {/* Matches List */}
        <div className="space-y-4">
          {isLoading ? (
             <div className="text-center py-20">
               <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
               <p className="text-white/40">Loading matches...</p>
             </div>
          ) : matches?.length === 0 ? (
            <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
              <p className="text-white/40 mb-4">No matches found in the system.</p>
              <MatchControlPanel 
                trigger={
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                    Create your first match
                  </Button>
                }
              />
            </div>
          ) : (
            matches?.map((match) => (
              <div 
                key={match.id} 
                className="group relative overflow-hidden glass-panel rounded-xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-white/20"
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                  {/* Teams & Score */}
                  <div className="flex items-center gap-8 flex-1">
                    <div className="flex items-center gap-4 min-w-[150px] justify-end">
                      <span className="font-display font-bold text-lg text-right">{match.homeTeam}</span>
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-300 font-bold border border-blue-500/30">
                        {match.homeTeam.substring(0, 2).toUpperCase()}
                      </div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="text-3xl font-mono font-bold tracking-tighter bg-black/40 px-4 py-2 rounded-lg border border-white/10">
                        {match.homeScore} : {match.awayScore}
                      </div>
                      <span className={`mt-2 text-xs font-bold px-2 py-0.5 rounded-full ${match.isLive ? 'bg-red-500/20 text-red-400' : 'bg-white/10 text-white/40'}`}>
                        {match.isLive ? 'LIVE' : 'FINAL'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 min-w-[150px]">
                      <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center text-pink-300 font-bold border border-pink-500/30">
                        {match.awayTeam.substring(0, 2).toUpperCase()}
                      </div>
                      <span className="font-display font-bold text-lg">{match.awayTeam}</span>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="flex flex-row md:flex-col gap-4 text-white/40 text-sm font-medium border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 md:min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {match.week}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {match.time}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link href={`/manage?id=${match.id}`}>
                      <Button variant="secondary" size="icon" className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20" title="Manage Live Match">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </Link>
                    <MatchControlPanel 
                      match={match}
                      trigger={
                        <Button variant="secondary" size="icon" className="bg-white/10 hover:bg-white/20 text-white border border-white/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                      }
                    />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon" className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-slate-950 border-white/10 text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Match?</AlertDialogTitle>
                          <AlertDialogDescription className="text-white/60">
                            This action cannot be undone. This will permanently remove the match record.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-transparent text-white border-white/20 hover:bg-white/10">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(match.id)}
                            className="bg-red-600 hover:bg-red-700 text-white border-none"
                          >
                            Delete Match
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
