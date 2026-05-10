import { useState, useRef, useEffect } from "react";
import { useThemeStore } from "../../app/store";
import { useNotificationStore } from "../../app/notificationStore";
import { Moon, Sun, Bell, Search, Check, CheckCheck, Trash2, ListTodo, Code2, Flame, Info, X } from "lucide-react";

const iconMap = {
  task: ListTodo,
  snippet: Code2,
  streak: Flame,
  system: Info,
};

const colorMap = {
  task: "bg-blue-500/10 text-blue-500",
  snippet: "bg-violet-500/10 text-violet-500",
  streak: "bg-orange-500/10 text-orange-500",
  system: "bg-emerald-500/10 text-emerald-500",
};

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const Navbar = () => {
  const { dark, toggle } = useThemeStore();
  const { notifications, markRead, markAllRead, clearAll, getUnreadCount } = useNotificationStore();
  const [showNotifs, setShowNotifs] = useState(false);
  const panelRef = useRef(null);
  const unreadCount = getUnreadCount();

  // Close panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    if (showNotifs) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifs]);

  return (
    <header className="h-16 px-8 sticky top-0 z-10 w-full bg-white/50 dark:bg-[#0A0D14]/50 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/60 flex items-center justify-between">
      <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 w-64 focus-within:ring-2 ring-emerald-500/50 transition-all">
        <Search className="w-4 h-4 text-slate-400" />
        <input 
           type="text" 
           placeholder="Search anything..." 
           className="bg-transparent border-none outline-none text-sm w-full dark:text-slate-200 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* Notification Bell */}
        <div className="relative" ref={panelRef}>
          <button 
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 bg-emerald-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Panel */}
          {showNotifs && (
            <div className="absolute top-full right-0 mt-2 w-96 max-h-[480px] bg-white dark:bg-[#121826] rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl shadow-black/10 dark:shadow-black/40 overflow-hidden z-50">
              {/* Header */}
              <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h3>
                  <p className="text-[10px] text-slate-500">{unreadCount} unread</p>
                </div>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-500/10 transition-colors"
                      title="Mark all as read"
                    >
                      <CheckCheck className="w-4 h-4" />
                    </button>
                  )}
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearAll}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
                      title="Clear all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => setShowNotifs(false)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto max-h-[380px] divide-y divide-slate-50 dark:divide-white/5">
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const Icon = iconMap[n.type] || Info;
                    return (
                      <div
                        key={n.id}
                        onClick={() => markRead(n.id)}
                        className={`p-3.5 flex gap-3 cursor-pointer transition-colors hover:bg-slate-50 dark:hover:bg-white/5 ${
                          !n.read ? "bg-emerald-500/[0.03]" : ""
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${colorMap[n.type] || colorMap.system}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-xs font-bold truncate ${!n.read ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                              {n.title}
                            </p>
                            {!n.read && <span className="w-2 h-2 bg-emerald-500 rounded-full shrink-0"></span>}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{timeAgo(n.time)}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 text-center">
                    <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No notifications yet</p>
                    <p className="text-xs text-slate-400 mt-1">Actions like creating tasks and snippets will show up here.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>

        {/* Theme Toggle */}
        <button 
          onClick={toggle}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
            dark 
              ? "bg-amber-500/10 text-amber-400 hover:bg-amber-500/20" 
              : "bg-slate-100 text-slate-500 hover:bg-slate-200"
          }`}
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};