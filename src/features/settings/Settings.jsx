import { useState, useEffect } from "react";
import { Card } from "../../components/ui/Card";
import { useThemeStore } from "../../app/store";
import { useAuthStore } from "../../features/auth/authStore";
import { api } from "../../services/api";
import { User, Palette, Keyboard, Download, Upload, Trash2, Sun, Moon, Monitor, Check } from "lucide-react";

const accentColors = [
  { name: "Emerald", value: "emerald", hex: "#10b981" },
  { name: "Blue", value: "blue", hex: "#3b82f6" },
  { name: "Violet", value: "violet", hex: "#8b5cf6" },
  { name: "Rose", value: "rose", hex: "#f43f5e" },
  { name: "Amber", value: "amber", hex: "#f59e0b" },
  { name: "Cyan", value: "cyan", hex: "#06b6d4" },
];

const shortcuts = [
  { keys: ["⌘", "K"], action: "Open command palette" },
  { keys: ["⌘", "B"], action: "Toggle sidebar" },
  { keys: ["⌘", "D"], action: "Toggle dark mode" },
  { keys: ["⌘", "N"], action: "Create new task" },
  { keys: ["⌘", "S"], action: "Save snippet" },
  { keys: ["⌘", "/"], action: "Search" },
  { keys: ["⌘", "1-5"], action: "Navigate sections" },
  { keys: ["Esc"], action: "Close modal" },
];

export const Settings = () => {
  const { dark, toggle } = useThemeStore();
  const { user, fetchUser } = useAuthStore();
  const [activeAccent, setActiveAccent] = useState("emerald");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    github: "",
    role: "",
  });
  const [saved, setSaved] = useState(false);

  // Load user data into profile form
  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || "",
        email: user.email || "",
        github: user.githubUsername || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleSave = async () => {
    setSaved(true);
    // Profile save is local for now — could add PUT /auth/profile endpoint
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = async () => {
    try {
      const [tasksRes, snippetsRes] = await Promise.all([
        api.get("/tasks?limit=500"),
        api.get("/snippets"),
      ]);
      const data = {
        tasks: tasksRes.data.data.tasks,
        snippets: snippetsRes.data.data.snippets,
        profile: user,
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "devtrackr-backup.json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Failed to export data. Make sure the server is running.");
    }
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure? This will clear all local storage data.")) {
      localStorage.removeItem("task-storage");
      localStorage.removeItem("snippet-storage");
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 fade-in max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Configure your workspace and preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Profile</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Your personal information</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(profile).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">
                {key === "github" ? "GitHub Username" : key}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 ring-emerald-500/50 dark:text-white"
              />
            </div>
          ))}
        </div>
        <button onClick={handleSave} className="mt-4 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
          {saved ? <><Check className="w-4 h-4" /> Saved!</> : "Save Changes"}
        </button>
      </Card>

      {/* Appearance */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Appearance</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Customize how DevTrackr looks</p>
          </div>
        </div>

        {/* Theme */}
        <div className="mb-6">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Theme</p>
          <div className="flex gap-3">
            {[
              { label: "Light", icon: Sun, active: !dark },
              { label: "Dark", icon: Moon, active: dark },
            ].map((theme) => (
              <button
                key={theme.label}
                onClick={toggle}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all text-sm font-medium ${
                  theme.active
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5"
                }`}
              >
                <theme.icon className="w-4 h-4" />
                {theme.label}
              </button>
            ))}
          </div>
        </div>

        {/* Accent Color */}
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Accent Color</p>
          <div className="flex gap-3">
            {accentColors.map((color) => (
              <button
                key={color.value}
                onClick={() => setActiveAccent(color.value)}
                className={`w-9 h-9 rounded-full border-2 transition-all flex items-center justify-center ${
                  activeAccent === color.value ? "border-white dark:border-slate-300 scale-110 shadow-lg" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {activeAccent === color.value && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Keyboard Shortcuts */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Keyboard Shortcuts</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Quick actions for power users</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {shortcuts.map((shortcut) => (
            <div key={shortcut.action} className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
              <span className="text-sm text-slate-600 dark:text-slate-300">{shortcut.action}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key) => (
                  <kbd key={key} className="px-2 py-0.5 text-[11px] font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-md shadow-sm">
                    {key}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white">Data Management</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Export, import, or reset your data</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <Download className="w-4 h-4" /> Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
            <Upload className="w-4 h-4" /> Import Data
          </button>
          <button onClick={handleClearData} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 transition-colors">
            <Trash2 className="w-4 h-4" /> Clear All Data
          </button>
        </div>
      </Card>
    </div>
  );
};
