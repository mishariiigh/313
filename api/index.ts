import express, { Request, Response, NextFunction } from "express";
import serverless from "serverless-http";
import { config } from "dotenv";
import { registerRoutes } from "../server/routes.js";

// Load environment variables first
config();

const app = express();

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Logging middleware for /api routes
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

// Track if routes are already registered
let routesInitialized = false;
// Serverless handler placeholder
let handler: any;

// Initialize routes and error middleware
async function initializeApp() {
  if (routesInitialized) return;

  try {
    // Register your routes on the Express app
    await registerRoutes(app);

    // Error handling middleware
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      let message = err.message || "Internal Server Error";

      // Custom error message for large payloads
      if (err.code === "LIMIT_FILE_SIZE" || err.type === "entity.too.large") {
        message = "حجم الملف كبير جداً. الحد الأقصى المسموح 50 ميجابايت";
      }

      res.status(status).json({ message });
    });

    // Wrap app with serverless handler only after routes and middleware are ready
    handler = serverless(app);
    routesInitialized = true;
  } catch (error) {
    console.error("Failed to initialize routes:", error);
  }
}

// Default export for serverless platforms (Netlify, Vercel, etc.)
export default async function serverlessHandler(req: Request, res: Response) {
  if (!routesInitialized) await initializeApp();
  return handler(req, res);
}
