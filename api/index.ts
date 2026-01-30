/**
 * Vercel serverless: handles /api/* only.
 * Root (/) and static files are served from public/ by Vercel.
 */
import { createApp } from "../server/app";
import type { IncomingMessage, ServerResponse } from "http";

let appPromise: ReturnType<typeof createApp> | null = null;

function getApp() {
  if (!appPromise) appPromise = createApp();
  return appPromise;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  try {
    const { app } = await getApp();
    return new Promise<void>((resolve, reject) => {
      res.on("finish", () => resolve());
      res.on("error", reject);
      app(req, res);
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    const isDbMissing = message.includes("DATABASE_URL");
    res.statusCode = isDbMissing ? 503 : 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        error: isDbMissing
          ? "DATABASE_URL is not set. Add it in Vercel Project Settings → Environment Variables."
          : message,
      }),
    );
  }
}
