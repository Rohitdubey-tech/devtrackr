import rateLimit from "express-rate-limit";

// General API rate limiter
// trustProxy: true is needed for Render/AWS/any platform behind a reverse proxy
// so each user's real IP is used instead of the proxy's IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Higher for cloud deployments where users may share an IP
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use the real client IP forwarded by Render's proxy
  keyGenerator: (req) => req.ip,
  skip: (req) => req.method === "OPTIONS",
});

// Stricter limiter for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Higher for cloud deployments (Render/AWS) where users may share proxy IPs
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
  skip: (req) => req.method === "OPTIONS",
});
