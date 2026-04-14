import { Router } from "express";
import User from "../models/User.js";
import Task from "../models/Task.js";
import Snippet from "../models/Snippet.js";
import { protect, authorize } from "../middleware/auth.js";

const router = Router();

// @desc    Get all users and platform stats
// @route   GET /api/v1/admin/users
// @access  Public for now (add protect + authorize("admin") for production)
router.get("/users", async (req, res, next) => {
  try {
    const users = await User.find({})
      .select("name email githubUsername role createdAt")
      .sort("-createdAt");

    // Get per-user stats
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [taskCount, snippetCount] = await Promise.all([
          Task.countDocuments({ user: user._id }),
          Snippet.countDocuments({ user: user._id }),
        ]);
        return {
          ...user.toObject(),
          stats: { tasks: taskCount, snippets: snippetCount },
        };
      })
    );

    res.json({
      success: true,
      data: {
        totalUsers: users.length,
        users: usersWithStats,
      },
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get platform-wide stats
// @route   GET /api/v1/admin/stats
router.get("/stats", async (req, res, next) => {
  try {
    const [totalUsers, totalTasks, totalSnippets] = await Promise.all([
      User.countDocuments(),
      Task.countDocuments(),
      Snippet.countDocuments(),
    ]);

    const recentUsers = await User.find({})
      .select("name email createdAt")
      .sort("-createdAt")
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTasks,
        totalSnippets,
        recentUsers,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
