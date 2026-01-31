# Deploy & enable saving on Vercel

Saving matches fails until a **PostgreSQL database** is connected and the schema exists.

## 1. Create a database

Pick one:

- **Vercel Postgres** (easiest): Vercel dashboard → **Storage** → **Create Database** → **Postgres**
- **Neon**: [neon.tech](https://neon.tech) → create project → copy connection string
- **Supabase**: [supabase.com](https://supabase.com) → create project → **Settings** → **Database** → connection string

## 2. Add `DATABASE_URL` on Vercel

1. Open your project on [vercel.com](https://vercel.com)
2. **Settings** → **Environment Variables**
3. Add:
   - **Name:** `DATABASE_URL`
   - **Value:** your Postgres connection string (from step 1)
   - **Environment:** Production (and Preview if you want)
4. Save

## 3. Create the tables (one-time)

From your **local** project, using the **same** database URL:

1. Create a `.env` (or temporary) with:
   ```bash
   DATABASE_URL=postgresql://...your-production-url...
   ```
2. Run:
   ```bash
   npm run db:push
   ```
   This creates the `matches` table in that database.

## 4. Redeploy (if needed)

If you added `DATABASE_URL` after the last deploy: **Deployments** → **⋯** on latest → **Redeploy**.

After this, the live app can save and load matches.
