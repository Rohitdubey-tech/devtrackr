import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/layout/layout";
import { useAuthStore } from "../features/auth/authStore";
import { Dashboard } from "../features/dashboard/Dashboard";
import { Github } from "../features/github/Github";
import { TaskBoard } from "../features/tasks/Taskboard";
import { Analytics } from "../features/analytics/Analytics";
import { Snippets } from "../features/snippets/Snippets";
import { Settings } from "../features/settings/Settings";
import { Login } from "../features/auth/Login";
import { OAuthCallback } from "../features/auth/OAuthCallback";

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Layout>{children}</Layout>;
};

export const AppRoutes = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <Routes>
      {/* Public route */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/oauth/callback" element={<OAuthCallback />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/github" element={<ProtectedRoute><Github /></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><TaskBoard /></ProtectedRoute>} />
      <Route path="/snippets" element={<ProtectedRoute><Snippets /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};