import { Router } from "express";
import { z } from "zod";
import { getSnippets, createSnippet, updateSnippet, toggleFavorite, deleteSnippet } from "../controllers/snippet.controller.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// All snippet routes are protected
router.use(protect);

// Validation schemas
const createSnippetSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  code: z.string().min(1, "Code is required").max(10000),
  language: z.string().min(1, "Language is required"),
  tags: z.array(z.string()).optional(),
  description: z.string().max(500).optional(),
});

const updateSnippetSchema = createSnippetSchema.partial();

// Routes
router.get("/", getSnippets);
router.post("/", validate(createSnippetSchema), createSnippet);
router.put("/:id", validate(updateSnippetSchema), updateSnippet);
router.patch("/:id/favorite", toggleFavorite);
router.delete("/:id", deleteSnippet);

export default router;
