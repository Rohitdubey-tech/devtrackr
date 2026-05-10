import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import connectDB from "./config/db.js";
import env from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

// Route imports
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import snippetRoutes from "./routes/snippet.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import adminRoutes from "./routes/admin.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ─── Production Security & Performance ────────────────────────
app.set("trust proxy", 1); // Required for AWS App Runner/Load Balancers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "script-src": ["'self'", "'unsafe-inline'"], // Allow Vite inline scripts
      "img-src": ["'self'", "data:", "https://avatars.githubusercontent.com"],
      "connect-src": [
        "'self'",
        "https://api.github.com",
        "https://leetcode.com",
        "https://alfa-leetcode-api.onrender.com",
        "https://geeks-for-geeks-stats-api.onrender.com",
        "https://geeksforgeeksapi.onrender.com",
      ],
      "form-action": ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false, // Allow cross-origin API fetches
}));
app.use(compression());
app.use(morgan(env.NODE_ENV === "production" ? "combined" : "dev"));

// ─── Global Middleware ────────────────────────────────────────
const allowedOrigins = env.CLIENT_URL
  ? [
      env.CLIENT_URL,
      env.CLIENT_URL.replace("localhost", "127.0.0.1"),
      env.CLIENT_URL.replace("127.0.0.1", "localhost"),
    ]
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Dynamically allow any origin to prevent CORS network errors
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(apiLimiter);

// ─── API Routes (v1) ──────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/snippets", snippetRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/admin", adminRoutes);

// ─── Health Check (all environments) ────────────────────────
app.get("/api/v1/health", (req, res) => {
  res.json({
    success: true,
    message: "DevTrackr API is running",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// ─── Static File Serving (Production) ─────────────────────────
if (env.NODE_ENV === "production") {
  // Serve the 'dist' folder (which will be in the parent dir in Docker)
  const distPath = path.join(__dirname, "../../frontend/dist");
  app.use(express.static(distPath));

  // Handle SPA routing: only non-API requests go to index.html
  app.get(/^(?!\/api).*/, (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  app.use("*", (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
    });
  });
}

// ─── Global Error Handler ─────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────
const startServer = async () => {
  try {
    await connectDB();
    app.listen(env.PORT, () => {
      console.log(`
╔══════════════════════════════════════════╗
║       🚀 DevTrackr API Server           ║
║──────────────────────────────────────────║
║  Port:     ${env.PORT}                          ║
║  Env:      ${env.NODE_ENV.padEnd(28)}║
║  API:      /api/v1                       ║
╚══════════════════════════════════════════╝
      `);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
