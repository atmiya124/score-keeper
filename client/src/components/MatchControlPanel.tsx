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
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit2, Save, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

interface MatchControlPanelProps {
  match?: Match;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

// Extend schema for form validation
const formSchema = insertMatchSchema.extend({
  homeScore: z.coerce.number(),
  awayScore: z.coerce.number(),
});

export function MatchControlPanel({ match, trigger, open, onOpenChange }: MatchControlPanelProps) {
  const { toast } = useToast();
  const createMutation = useCreateMatch();
  const updateMutation = useUpdateMatch();
  const [internalOpen, setInternalOpen] = useState(false);

  // Controlled vs Uncontrolled dialog state
  const isOpen = open !== undefined ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const isEditing = !!match;

  const form = useForm<InsertMatch>({
    resolver: zodResolver(formSchema),
    defaultValues: match || {
      homeTeam: "",
      awayTeam: "",
      homeScore: 0,
      awayScore: 0,
      time: "00:00",
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
              {/* Teams */}
              <FormField
                control={form.control}
                name="homeTeam"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player 1 Team / Name</FormLabel>
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
                    <FormLabel>Player 2 Team / Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Team B" className="bg-white/5 border-white/10" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Scores */}
              <FormField
                control={form.control}
                name="homeScore"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Player 1 Score</FormLabel>
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
                    <FormLabel>Player 2 Score</FormLabel>
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

              {/* Details */}
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
                name="week"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Week / Round</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Regular Season - Week 5" className="bg-white/5 border-white/10" {...field} />
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
              
              <FormField
                control={form.control}
                name="isLive"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Status</FormLabel>
                    <div className="flex items-center space-x-2 border border-white/10 rounded-lg p-3 bg-white/5">
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <span className={field.value ? "text-red-400 font-bold" : "text-muted-foreground"}>
                        {field.value ? "LIVE" : "Finished / Not Started"}
                      </span>
                    </div>
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
