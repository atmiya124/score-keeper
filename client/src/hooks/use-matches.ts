import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertMatch, type Match } from "@shared/routes"; // Assuming exports are available
import { apiRequest } from "@/lib/queryClient";

// Since @shared/routes exports api object, we use the paths from there
// and we manually type the input/output based on the schema for safety

export function useMatches() {
  return useQuery<Match[]>({
    queryKey: [api.matches.list.path],
    queryFn: async () => {
      const res = await fetch(api.matches.list.path);
      if (!res.ok) throw new Error("Failed to fetch matches");
      return await res.json();
    },
    refetchInterval: 2000,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

export function useMatch(id: number) {
  return useQuery<Match>({
    queryKey: [api.matches.get.path.replace(":id", String(id))],
    queryFn: async () => {
      const res = await fetch(api.matches.get.path.replace(":id", String(id)));
      if (!res.ok) throw new Error("Failed to fetch match");
      return await res.json();
    },
    refetchInterval: false,
    staleTime: 0,
    refetchOnMount: true,
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertMatch) => {
      const res = await apiRequest("POST", api.matches.create.path, data);
      return await res.json();
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [api.matches.list.path] });
      await queryClient.refetchQueries({ queryKey: [api.matches.list.path] });
    },
  });
}

export function useUpdateMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<InsertMatch> & { id: number }) => {
      const path = api.matches.update.path.replace(":id", String(id));
      const res = await apiRequest("PUT", path, data);
      return await res.json();
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({ queryKey: [api.matches.list.path] });
      await queryClient.refetchQueries({ queryKey: [api.matches.list.path] });
      if (variables?.id != null) {
        await queryClient.invalidateQueries({
          queryKey: [api.matches.get.path.replace(":id", String(variables.id))],
        });
      }
    },
  });
}

export function useDeleteMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const path = api.matches.delete.path.replace(":id", String(id));
      await apiRequest("DELETE", path);
    },
    onSuccess: async (_data, id) => {
      await queryClient.invalidateQueries({ queryKey: [api.matches.list.path] });
      await queryClient.refetchQueries({ queryKey: [api.matches.list.path] });
      if (id != null) {
        await queryClient.invalidateQueries({
          queryKey: [api.matches.get.path.replace(":id", String(id))],
        });
      }
    },
  });
}
