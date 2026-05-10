import { Router } from "express";
import { getProductivity, getGithubAnalytics } from "../controllers/analytics.controller.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = Router();

// Productivity analytics (requires auth)
router.get("/productivity", protect, getProductivity);

// GitHub analytics proxy (optional auth — works for anyone)
router.get("/github/:username", optionalAuth, getGithubAnalytics);

export default router;
