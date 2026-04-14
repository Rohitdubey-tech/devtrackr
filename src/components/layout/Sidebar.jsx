import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Github, CheckSquare, BarChart3, Code2, Settings, LogOut } from "lucide-react";
import { cn } from "../../utils/cn";
import { useAuthStore } from "../../features/auth/authStore";

export const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const routes = [
    { path: "/", name: "Dashboard", icon: LayoutDashboard },
    { path: "/analytics", name: "Analytics", icon: BarChart3 },
    { path: "/github", name: "GitHub", icon: Github },
    { path: "/tasks", name: "Tasks", icon: CheckSquare },
    { path: "/snippets", name: "Snippets", icon: Code2 },
    { path: "/settings", name: "Settings", icon: Settings },
  ];

  const initials = user?.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "DT";

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="w-64 h-screen sticky top-0 bg-white/50 dark:bg-[#0A0D14]/50 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/60 p-6 flex flex-col z-20">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
           <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
           </svg>
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
          DevTrackr
        </h1>
      </div>

      <nav className="space-y-2 flex-1">
        {routes.map((rt) => (
          <NavLink
            key={rt.path}
            to={rt.path}
            end={rt.path === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all duration-200",
                isActive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
              )
            }
          >
            <rt.icon className="w-5 h-5" />
            {rt.name}
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-slate-800/60">
         <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center">
               <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
               <p className="text-sm font-semibold dark:text-slate-200 truncate">{user?.name || "User"}</p>
               <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email || ""}</p>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
         </div>
      </div>
    </div>
  );
};