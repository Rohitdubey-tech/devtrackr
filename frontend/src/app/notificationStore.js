import { create } from "zustand";

// Generate a notification when something happens in the app
const createNotification = (type, title, message) => ({
  id: Date.now() + Math.random(),
  type, // "task", "snippet", "streak", "system"
  title,
  message,
  time: new Date().toISOString(),
  read: false,
});

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  
  // Add a new notification
  addNotification: (type, title, message) => {
    const notification = createNotification(type, title, message);
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50), // Keep last 50
    }));
  },

  // Mark one as read
  markRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),

  // Mark all as read
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  // Clear all
  clearAll: () => set({ notifications: [] }),

  // Get unread count
  getUnreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
