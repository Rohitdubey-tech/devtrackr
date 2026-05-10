import { create } from "zustand";
import { api } from "../../services/api";
import { useNotificationStore } from "../../app/notificationStore";

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
      useNotificationStore.getState().addNotification("task", "Task Created", `"${title}" added to your board.`);
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to create task" });
    }
  },

  // Update task status (for drag-and-drop)
  updateTaskStatus: async (id, newStatus) => {
    const task = get().tasks.find(t => (t._id || t.id) === id);
    // Optimistic update
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t._id === id || t.id === id ? { ...t, status: newStatus } : t
      ),
    }));

    try {
      await api.patch(`/tasks/${id}/status`, { status: newStatus });
      if (newStatus === "DONE" && task) {
        useNotificationStore.getState().addNotification("task", "Task Completed ✅", `"${task.title}" marked as done!`);
      }
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