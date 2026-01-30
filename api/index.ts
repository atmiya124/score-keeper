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
  const { app } = await getApp();
  return new Promise<void>((resolve, reject) => {
    res.on("finish", () => resolve());
    res.on("error", reject);
    app(req, res);
  });
}
