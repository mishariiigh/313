import express from "express";
import serverless from "serverless-http";
import { config } from "dotenv";
import { registerRoutes } from "../server/routes.js";

config();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  let capturedJsonResponse: any;

  const originalJson = res.json.bind(res);
  res.json = (body, ...args) => {
    capturedJsonResponse = body;
    return originalJson(body, ...args);
  };

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      const duration = Date.now() - start;
      let logLine = `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`;
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

    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      let message = err.message || "Internal Server Error";

      if (err.code === "LIMIT_FILE_SIZE" || err.type === "entity.too.large") {
        message = "حجم الملف كبير جداً. الحد الأقصى المسموح 50 ميجابايت";
      }

      res.status(status).json({ message });
    });

    routesInitialized = true;
  } catch (error) {
    console.error("Failed to initialize routes:", error);
  }
}

const handlerPromise = initializeApp().then(() => serverless(app));

export async function handler(event, context) {
  const fn = await handlerPromise;
  return fn(event, context);
}
