import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMatchSchema, type InsertMatch, type Match } from "@shared/schema";
import { useCreateMatch, useUpdateMatch } from "@/hooks/use-matches";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, Plus, Save } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

interface MatchControlPanelProps {
  match?: Match;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const formSchema = insertMatchSchema.extend({
  homeScore: z.coerce.number(),
  awayScore: z.coerce.number(),
  homePlayers: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
  awayPlayers: z.string().transform(val => val.split(',').map(s => s.trim()).filter(Boolean)),
});

export function MatchControlPanel({ match, trigger, open, onOpenChange }: MatchControlPanelProps) {
  const { toast } = useToast();
  const createMutation = useCreateMatch();
  const updateMutation = useUpdateMatch();
  const [internalOpen, setInternalOpen] = useState(false);

  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const isEditing = !!match;

  const form = useForm<InsertMatch>({
    resolver: zodResolver(formSchema),
    defaultValues: match ? {
      ...match,
      homePlayers: match.homePlayers?.join(', ') || "",
      awayPlayers: match.awayPlayers?.join(', ') || "",
    } : {
      homeTeam: "",
      awayTeam: "",
      homePlayers: "",
      awayPlayers: "",
      homeScore: 0,
      awayScore: 0,
      time: "12:00",
      stadium: "",
      week: "",
      isLive: true,
    },
  });

  const onSubmit = async (data: InsertMatch) => {
    try {
      if (isEditing && match) {
        await updateMutation.mutateAsync({ id: match.id, ...data });
        toast({ title: "Match updated", description: "Changes saved successfully." });
      } else {
        await createMutation.mutateAsync(data);
        toast({ title: "Match created", description: "New match has been added." });
        form.reset();
      }
      setOpen(false);
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to save match details.", 
        variant: "destructive" 
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4" /> Create Match
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-slate-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-display">
            {isEditing ? "Edit Match Details" : "Create New Match"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="homeTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team A Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Team A" className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="awayTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team B Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Team B" className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homePlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team A Players (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Player 1, Player 2" className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="awayPlayers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team B Players (comma separated)</FormLabel>
                    <FormControl>
                      <Input placeholder="Player 3, Player 4" className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homeScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team A Score</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => field.onChange(Math.max(0, Number(field.value) - 1))}
                        >
                          -
                        </Button>
                        <Input 
                          type="number" 
                          className="bg-white/5 border-white/10 text-center font-mono text-lg" 
                          {...field} 
                        />
                         <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => field.onChange(Number(field.value) + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="awayScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Team B Score</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => field.onChange(Math.max(0, Number(field.value) - 1))}
                        >
                          -
                        </Button>
                        <Input 
                          type="number" 
                          className="bg-white/5 border-white/10 text-center font-mono text-lg" 
                          {...field} 
                        />
                         <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => field.onChange(Number(field.value) + 1)}
                        >
                          +
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stadium"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event / Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Atmiya Badminton 2026" className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Match Time</FormLabel>
                    <FormControl>
                      <Input placeholder="00:00" className="bg-white/5 border-white/10 font-mono" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white font-bold min-w-[120px]">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Save Match</>}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
