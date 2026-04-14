import { create } from "zustand";
import { api } from "../../services/api";

export const useTaskStore = create((set, get) => ({
  tasks: [],
  isLoading: false,
  error: null,

  // Fetch all tasks from backend
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get("/tasks?limit=100");
      set({ tasks: data.data.tasks, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to fetch tasks", isLoading: false });
    }
  },

  // Add a new task
  addTask: async (title, status = "TODO") => {
    try {
      const { data } = await api.post("/tasks", { title, status });
      set((state) => ({
        tasks: [...state.tasks, data.data.task],
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to create task" });
    }
  },

  // Update task status (for drag-and-drop)
  updateTaskStatus: async (id, newStatus) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task._id === id || task.id === id ? { ...task, status: newStatus } : task
      ),
    }));

    try {
      await api.patch(`/tasks/${id}/status`, { status: newStatus });
    } catch (err) {
      // Revert on failure
      get().fetchTasks();
      set({ error: err.response?.data?.message || "Failed to update task" });
    }
  },

  // Delete a task
  deleteTask: async (id) => {
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.filter((task) => (task._id || task.id) !== id),
    }));

    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      get().fetchTasks();
      set({ error: err.response?.data?.message || "Failed to delete task" });
    }
  },

  // Reorder tasks (bulk update after drag)
  reorderTasks: async (taskUpdates) => {
    try {
      await api.put("/tasks/reorder", { tasks: taskUpdates });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to reorder" });
    }
  },
}));