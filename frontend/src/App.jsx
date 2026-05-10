import { useEffect } from "react";
import { Layout } from "./components/layout/layout";
import { AppRoutes } from "./routes/AppRoutes";
import { useThemeStore } from "./app/store";
import { useAuthStore } from "./features/auth/authStore";

function App() {
  const { dark } = useThemeStore();
  const { fetchUser } = useAuthStore();

  // On mount, fetch user if token exists
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <div className={dark ? "dark" : ""}>
      <div className="min-h-screen text-slate-900 bg-slate-50 dark:text-gray-100 dark:bg-[#0A0D14] selection:bg-emerald-500/30">
        <AppRoutes />
      </div>
    </div>
  );
}

export default App;