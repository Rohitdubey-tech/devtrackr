import { Router } from "express";
import { z } from "zod";
import { getTasks, createTask, updateTask, updateTaskStatus, deleteTask, reorderTasks } from "../controllers/task.controller.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// All task routes are protected
router.use(protect);

// Validation schemas
const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE"]).optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  dueDate: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

const updateTaskSchema = createTaskSchema.partial();

// Routes
router.get("/", getTasks);
router.post("/", validate(createTaskSchema), createTask);
router.put("/reorder", reorderTasks);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.patch("/:id/status", updateTaskStatus);
router.delete("/:id", deleteTask);

export default router;
