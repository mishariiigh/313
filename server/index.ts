// server/index.ts
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import multer from "multer";
import fs from "fs";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { firebaseAutoSync } from "./firebase-auto-sync";
import { config } from "dotenv";
config();

console.log("🔧 Starting application...");

const app = express();

// --- Ensure uploads directory exists ---
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`Uploads directory created at ${uploadDir}`);
}

// --- Multer setup ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// --- Middleware ---
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false, limit: "50mb" }));

// Logging middleware for /api routes
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${Date.now() - start}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      log(logLine);
    }
  });

  next();
});

// --- Optional auth middleware ---
// Uncomment and implement your auth logic here if needed
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  // Example:
  // if (!req.headers.authorization) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }
  next();
};

// --- Video upload route ---
app.post(
  "/api/upload-video",
  requireAuth,
  upload.single("video"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "خطأ في رفع الفيديو" }); // "Error uploading video"
    }
    res.status(200).json({
      message: "تم رفع الفيديو بنجاح", // "Video uploaded successfully"
      filePath: `/uploads/${req.file.filename}`,
    });
  }
);

// --- Serve uploaded files ---
app.use("/uploads", express.static(uploadDir));

// --- Initialize Firebase auto-sync and register other routes ---
(async () => {
  await firebaseAutoSync.initialize();

  await registerRoutes(app);

  // Error handling middleware
  app.use(
    (err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      let message = err.message || "Internal Server Error";
      if (err.code === "LIMIT_FILE_SIZE" || err.type === "entity.too.large") {
        message = "حجم الملف كبير جداً. الحد الأقصى المسموح 50 ميجابايت"; // "File size too large"
      } else if (err.message.includes("Unexpected field")) {
        message = "خطأ في حقل التحميل، تأكد من استخدام حقل 'video'"; // "Upload field error, check 'video' field"
      }
      res.status(status).json({ message });

      if (status >= 500) {
        console.error("Server error:", err);
      }
    }
  );

  // HTTP server creation
  const { createServer } = await import("http");
  const server = createServer(app);

  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    // Production static serving
    const clientDistPath = path.join(__dirname, "../../dist");
    app.use(express.static(clientDistPath));

    // Handle client-side routing fallback
    app.get("*", (req, res) => {
      if (!req.path.startsWith("/api")) {
        res.sendFile(path.join(clientDistPath, "index.html"));
      }
    });
  }

  // Start server
  const port = parseInt(process.env.PORT || "5000", 10);
  const host = "0.0.0.0";
  server.listen(port, host, () => {
    log(`Server running on ${host}:${port}`);
  });
})();
