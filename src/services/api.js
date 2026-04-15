import axios from "axios";

// ── Backend API client (with JWT auth) ──────────────────────
// In production (Docker/App Runner), the frontend is served by the same
// Express server, so the base URL is relative (/api/v1).
// In local dev, VITE_API_URL defaults to localhost:5001.
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api/v1";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && error.response?.data?.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

        localStorage.setItem("accessToken", data.data.accessToken);
        localStorage.setItem("refreshToken", data.data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        // Refresh failed — force logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// ── GitHub API client (public, no auth) ─────────────────────
export const githubApi = axios.create({
  baseURL: "https://api.github.com",
});