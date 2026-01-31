import { useMatches, useDeleteMatch } from "@/hooks/use-matches";
import { MatchControlPanel } from "@/components/MatchControlPanel";
import { ManageLive } from "@/components/ManageLive";
import { Link } from "wouter";
import { ArrowLeft, Edit, PlusCircle, Trash2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

/**
 * Admin page: manage-live (timer + score) plus Edit, New match, Clear.
 */
export function AdminPanel() {
  const { data: matches, isLoading } = useMatches();
  const deleteMutation = useDeleteMatch();
  const { toast } = useToast();
  const currentMatch = matches?.[0] ?? null;

  const handleClear = (id: number) => {
    deleteMutation.mutate(id, {
      onSuccess: () => toast({ title: "Score cleared", description: "Big screen will show no match." }),
      onError: () => toast({ title: "Failed to clear", variant: "destructive" }),
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-body">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button type="button" variant="outline" size="icon" className="rounded-full border-white/20 bg-transparent hover:bg-white/10 text-white">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-display font-bold">Manage live</h1>
              <p className="text-white/40">Timer and score for the big screen</p>
            </div>
          </div>
          <MatchControlPanel />
        </div>

        {currentMatch && (
          <div className="flex flex-wrap gap-2 mb-8 pb-6 border-b border-white/10">
            <MatchControlPanel
              match={currentMatch}
              trigger={
                <Button type="button" variant="outline" size="sm" className="border-white/20 text-white hover:bg-white/10">
                  <Edit className="w-4 h-4 mr-2" /> Edit match
                </Button>
              }
            />
            <MatchControlPanel
              trigger={
                <Button type="button" variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  <PlusCircle className="w-4 h-4 mr-2" /> New match (replaces)
                </Button>
              }
            />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  <Trash2 className="w-4 h-4 mr-2" /> Clear score
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-slate-950 border-white/10 text-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear score from screen?</AlertDialogTitle>
                  <AlertDialogDescription className="text-white/60">
                    The big screen will show “No match” until you set a new one.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent text-white border-white/20 hover:bg-white/10">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    onClick={() => handleClear(currentMatch.id)}
                    className="bg-red-600 hover:bg-red-700 text-white border-none"
                  >
                    Clear
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            <p className="text-white/40">Loading...</p>
          </div>
        ) : !currentMatch ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
            <p className="text-white/40 mb-4">No match on screen.</p>
            <MatchControlPanel
              trigger={
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Set match (teams & score)
                </Button>
              }
            />
          </div>
        ) : (
          <ManageLive match={currentMatch} />
        )}
      </div>
    </div>
  );
}
