import { Router } from "express";
import { z } from "zod";
import { register, login, refreshToken, getMe, logout, updateProfile } from "../controllers/auth.controller.js";
import { googleAuth, googleCallback, githubAuth, githubCallback } from "../controllers/oauth.controller.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { authLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// Validation schemas
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  githubUsername: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Routes
router.post("/register", authLimiter, validate(registerSchema), register);
router.post("/login", authLimiter, validate(loginSchema), login);
router.post("/refresh", refreshToken);
router.get("/me", protect, getMe);
router.post("/logout", protect, logout);
router.put("/profile", protect, updateProfile);

// OAuth Routes
router.get("/google", googleAuth);
router.get("/callback/google", googleCallback);
router.get("/github", githubAuth);
router.get("/callback/github", githubCallback);

export default router;
