import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// Use placeholder for build/CI when DATABASE_URL is not set (e.g. Vercel build)
let databaseUrl =
  process.env.DATABASE_URL || "postgresql://localhost:5432/placeholder";
// Fix: "scorekeeper" doesn't exist; use "neondb" (Neon)
if (databaseUrl.includes("scorekeeper")) {
  databaseUrl = databaseUrl.replace(/scorekeeper/g, "neondb");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: databaseUrl,
  },
});
