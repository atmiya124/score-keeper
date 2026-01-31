import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  homeTeam: text("home_team").notNull(),
  awayTeam: text("away_team").notNull(),
  homePlayers: text("home_players").array(),
  awayPlayers: text("away_players").array(),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  time: text("time").notNull().default("00:00"),
  stadium: text("stadium").notNull(),
  week: text("week").notNull(),
  isLive: boolean("is_live").default(true),
});

export const comments = pgTable("comments", {
  comment: text("comment").notNull(),
});

export const insertMatchSchema = createInsertSchema(matches).omit({ id: true });

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Comment = typeof comments.$inferSelect;
