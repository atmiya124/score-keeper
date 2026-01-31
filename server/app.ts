import express, { type Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { registerRoutes } from "./routes";

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function createApp(): Promise<{
  app: express.Express;
  httpServer: ReturnType<typeof createServer>;
}> {
  const app = express();
  const httpServer = createServer(app);

  // Allow CORS preflight (OPTIONS) so browsers can send POST/PUT/DELETE
  app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");
      return res.sendStatus(204);
    }
    next();
  });

  app.use(
    express.json({
      verify: (req, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );
  app.use(express.urlencoded({ extended: false }));

  app.use((req, res, next) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, unknown> | undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson as Record<string, unknown>;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }
        log(logLine);
      }
    });

    next();
  });

  await registerRoutes(httpServer, app);

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    const status =
      (err as { status?: number }).status ||
      (err as { statusCode?: number }).statusCode ||
      500;
    const message = (err as Error).message || "Internal Server Error";
    console.error("Internal Server Error:", err);
    if (res.headersSent) {
      return next(err);
    }
    return res.status(status).json({ message });
  });

  // SPA fallback on Vercel (static files are served by Vercel from public/)
  if (process.env.VERCEL) {
    app.get("/(.*)", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(process.cwd(), "public", "index.html"));
    });
  }

  return { app, httpServer };
}
