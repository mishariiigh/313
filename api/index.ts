import express, { type Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { config } from "dotenv";
import { registerRoutes } from "../server/routes.js";

// Load env vars
config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json.bind(res);
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson(bodyJson, ...args);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      console.log(logLine);
    }
  });

  next();
});

let routesInitialized = false;

async function initializeApp() {
  if (routesInitialized) return;
  try {
    await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      let message = err.message || "Internal Server Error";
      if (err.code === 'LIMIT_FILE_SIZE' || err.type === 'entity.too.large') {
        message = "حجم الملف كبير جداً. الحد الأقصى المسموح 50 ميجابايت";
      }
      res.status(status).json({ message });
    });

    routesInitialized = true;
  } catch (error) {
    console.error("Failed to initialize routes:", error);
  }
}

const handler = serverless(app);

export default async function serverlessHandler(req: Request, res: Response) {
  await initializeApp();
  return handler(req, res);
}
