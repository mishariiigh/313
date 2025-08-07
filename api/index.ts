
import express, { type Request, Response, NextFunction } from "express";
import path from 'path';
import { registerRoutes } from "../server/routes.js";

// Load environment variables FIRST
import { config } from "dotenv";
config();

// Then import config after env vars are loaded
import { config as appConfig } from "@shared/config";

console.log("🔧 Starting serverless function...");

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Middleware for logging
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Initialize routes
(async () => {
  await registerRoutes(app);
  
  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    let message = err.message || "Internal Server Error";
    if (err.code === 'LIMIT_FILE_SIZE' || err.type === 'entity.too.large') {
      message = "حجم الملف كبير جداً. الحد الأقصى المسموح 50 ميجابايت";
    }
    res.status(status).json({ message });
  });
})();

// Export for Vercel serverless function
export default app;
