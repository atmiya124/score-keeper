import "dotenv/config";
import { createApp, log } from "./app";
import { serveStatic } from "./static";

(async () => {
  const { app, httpServer } = await createApp();

  if (process.env.VERCEL) {
    // On Vercel, static files are served by the platform; API is handled by serverless.
    // This file is only used for local/production non-Vercel runs.
  } else if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  // Windows can throw ENOTSUP with 0.0.0.0 + reusePort; use 127.0.0.1 when needed
  const host =
    process.platform === "win32" ? "127.0.0.1" : "0.0.0.0";
  httpServer.listen(port, host, () => {
    log(`serving on http://${host}:${port}`);
  });
})();
