import { create } from "zustand";
import { api } from "../../services/api";
import { useNotificationStore } from "../../app/notificationStore";

export const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  isLoading: false,
  error: null,

  // Register
  register: async (name, email, password, githubUsername) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/register", { name, email, password, githubUsername });
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      set({ user: data.data.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.map(e => e.message).join(", ")
        || (err.request ? "Cannot reach server. Check your connection." : "Registration failed");
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("accessToken", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      set({ user: data.data.user, isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      const msg = err.response?.data?.message
        || err.response?.data?.errors?.map(e => e.message).join(", ")
        || (err.request ? "Cannot reach server. Check your connection." : "Login failed");
      set({ error: msg, isLoading: false });
      return false;
    }
  },

  // Fetch current user
  fetchUser: async () => {
    if (!localStorage.getItem("accessToken")) return;
    set({ isLoading: true });
    try {
      const { data } = await api.get("/auth/me");
      set({ user: data.data.user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }
  },

  // Logout
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, isAuthenticated: false });
  },

  // Update Profile
  updateProfile: async (profileData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put("/auth/profile", profileData);
      set({ user: data.data.user, isLoading: false });
      useNotificationStore.getState().addNotification("system", "Profile Updated", "Your account settings have been saved.");
      return true;
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to update profile", isLoading: false });
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));