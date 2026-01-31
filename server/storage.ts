import { matches, type Match, type InsertMatch } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getMatches(): Promise<Match[]>;
  getMatch(id: number): Promise<Match | undefined>;
  createMatch(match: InsertMatch): Promise<Match>;
  updateMatch(id: number, match: Partial<InsertMatch>): Promise<Match>;
  deleteMatch(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getMatches(): Promise<Match[]> {
    return await db.select().from(matches);
  }

  async getMatch(id: number): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match;
  }

  /** Create match = replace: only one match is shown on the big screen at a time. Delete any existing match, then insert. */
  async createMatch(insertMatch: InsertMatch): Promise<Match> {
    await db.delete(matches); // Remove old match(es) so there is only one
    const [match] = await db.insert(matches).values(insertMatch).returning();
    if (!match) throw new Error("Insert failed: no row returned");
    return match;
  }

  async updateMatch(id: number, updates: Partial<InsertMatch>): Promise<Match> {
    const [updated] = await db
      .update(matches)
      .set(updates)
      .where(eq(matches.id, id))
      .returning();
    return updated;
  }

  async deleteMatch(id: number): Promise<void> {
    await db.delete(matches).where(eq(matches.id, id));
  }
}

export const storage = new DatabaseStorage();
