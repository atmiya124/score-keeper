import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.matches.list.path, async (_req, res) => {
    const matches = await storage.getMatches();
    res.json(matches);
  });

  app.get(api.matches.get.path, async (req, res) => {
    const match = await storage.getMatch(Number(req.params.id));
    if (!match) return res.status(404).json({ message: "Match not found" });
    res.json(match);
  });

  app.post(api.matches.create.path, async (req, res) => {
    try {
      const input = api.matches.create.input.parse(req.body);
      const match = await storage.createMatch(input);
      res.status(201).json(match);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      const message = err instanceof Error ? err.message : "Failed to create match";
      console.error("POST /api/matches error:", err);
      return res.status(500).json({ message });
    }
  });

  app.put(api.matches.update.path, async (req, res) => {
    try {
      const input = api.matches.update.input.parse(req.body);
      const match = await storage.updateMatch(Number(req.params.id), input);
      if (!match) return res.status(404).json({ message: "Match not found" });
      res.json(match);
    } catch (err) {
        if (err instanceof z.ZodError) {
          return res.status(400).json({
            message: err.errors[0].message,
            field: err.errors[0].path.join('.'),
          });
        }
        throw err;
    }
  });

  app.delete(api.matches.delete.path, async (req, res) => {
    await storage.deleteMatch(Number(req.params.id));
    res.status(204).send();
  });

  return httpServer;
}
