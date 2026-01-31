/**
 * Vercel serverless: handles /api/* only.
 * Root (/) and static files are served from public/ by Vercel.
 * Bundled to api/index.js by npm run build.
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
    // Vercel rewrites /api/matches -> /api?__path=/matches; restore path so Express can route
    const url = req.url || "";
    const q = url.indexOf("?");
    if (q !== -1) {
      const params = new URLSearchParams(url.slice(q));
      const path = params.get("__path");
      if (path) {
        const rest = params.toString().replace(/\b__path=[^&]+&?/g, "").replace(/&$/, "");
        (req as IncomingMessage & { url: string }).url = "/api" + decodeURIComponent(path) + (rest ? "?" + rest : "");
      }
    }
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
