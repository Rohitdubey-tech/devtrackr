import Task from "../models/Task.js";
import { AppError } from "../middleware/errorHandler.js";

// @desc    Get all tasks for current user
// @route   GET /api/v1/tasks
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, sort = "-createdAt", page = 1, limit = 50 } = req.query;

    const query = { user: req.user._id };
    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          total,
          page: Number(page),
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/v1/tasks
export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.validatedBody,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/v1/tasks/:id
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.validatedBody,
      { new: true, runValidators: true }
    );

    if (!task) {
      throw new AppError("Task not found.", 404);
    }

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status (PATCH for drag-and-drop)
// @route   PATCH /api/v1/tasks/:id/status
export const updateTaskStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["TODO", "IN_PROGRESS", "DONE"].includes(status)) {
      throw new AppError("Invalid status.", 400);
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true }
    );

    if (!task) {
      throw new AppError("Task not found.", 404);
    }

    res.json({
      success: true,
      data: { task },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/v1/tasks/:id
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      throw new AppError("Task not found.", 404);
    }

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update task order (for drag-and-drop reordering)
// @route   PUT /api/v1/tasks/reorder
export const reorderTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body; // [{ id, order, status }]

    if (!Array.isArray(tasks)) {
      throw new AppError("Tasks array is required.", 400);
    }

    const bulkOps = tasks.map((t) => ({
      updateOne: {
        filter: { _id: t.id, user: req.user._id },
        update: { order: t.order, status: t.status },
      },
    }));

    await Task.bulkWrite(bulkOps);

    res.json({
      success: true,
      message: "Tasks reordered",
    });
  } catch (error) {
    next(error);
  }
};
