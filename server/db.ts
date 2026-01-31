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

// Use Neon serverless driver on Vercel (HTTP, works in serverless)
// Use node-postgres (pg) locally
let _db: unknown;
let _pool: import("pg").Pool | null = null;

if (process.env.VERCEL) {
  const { neon } = req("@neondatabase/serverless");
  const { drizzle } = req("drizzle-orm/neon-http");
  const sql = neon(process.env.DATABASE_URL);
  _db = drizzle({ client: sql, schema });
} else {
  const { drizzle } = req("drizzle-orm/node-postgres");
  const pg = req("pg");
  _pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  _db = drizzle(_pool, { schema });
}

export const db = _db as import("drizzle-orm/node-postgres").NodePgDatabase<
  typeof schema
>;
export const pool = _pool;
