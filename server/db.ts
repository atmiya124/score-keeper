import { createRequire } from "module";
import * as schema from "@shared/schema";

// CJS bundle has require; ESM (Vercel API) needs createRequire(import.meta.url)
const req =
  typeof import.meta !== "undefined" && import.meta.url
    ? createRequire(import.meta.url)
    : typeof require !== "undefined"
      ? require
      : createRequire(import.meta.url);

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}
// Fix: "scorekeeper" was an old local DB name that doesn't exist. Use "neondb" (Neon).
let databaseUrl = process.env.DATABASE_URL;
if (databaseUrl.includes("scorekeeper")) {
  databaseUrl = databaseUrl.replace(/scorekeeper/g, "neondb");
}

// Use Neon serverless driver (HTTP) for both local and Vercel.
// Neon v1 only allows tagged-template sql`...` or sql.query(); Drizzle calls client(sql, params, options).
// Wrap so client(sql, params, options) forwards to sql.query(sql, params, options).
const { neon } = req("@neondatabase/serverless");
const { drizzle } = req("drizzle-orm/neon-http");
const neonClient = neon(databaseUrl);
const client = Object.assign(
  (query: string, params?: unknown[], options?: Record<string, unknown>) =>
    neonClient.query(query, params ?? [], options as never),
  { transaction: neonClient.transaction?.bind(neonClient) }
);
const _db = drizzle({ client, schema });

export const db = _db as import("drizzle-orm/node-postgres").NodePgDatabase<
  typeof schema
>;
export const pool = null as unknown as import("pg").Pool;
