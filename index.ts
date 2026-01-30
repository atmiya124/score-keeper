/**
 * Vercel serverless entry: export the Express app for all routes.
 * Static assets are served from public/ by Vercel; this app handles API and SPA fallback.
 */
import { createApp } from "./server/app";
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
  const { app } = await getApp();
  return new Promise<void>((resolve, reject) => {
    res.on("finish", () => resolve());
    res.on("error", reject);
    app(req, res);
  });
}
