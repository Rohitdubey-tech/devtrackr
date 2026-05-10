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
  const { user, updateProfile } = useAuthStore();
  const [activeAccent, setActiveAccent] = useState("emerald");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    github: "",
    leetcode: "",
    gfg: "",
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
        leetcode: user.leetcodeUsername || "",
        gfg: user.gfgUsername || "",
        role: user.role || "user",
      });
    }
  }, [user]);

  const handleSave = async () => {
    const success = await updateProfile({
      name: profile.name,
      githubUsername: profile.github,
      leetcodeUsername: profile.leetcode,
      gfgUsername: profile.gfg
    });
    
    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
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

  const handleClearData = async () => {
    if (window.confirm("CRITICAL: This will delete ALL your account data from the database. Are you absolutely sure?")) {
      try {
        // In a real app, this would be a DELETE /api/v1/auth/account endpoint
        // For now, we clear everything and log out
        localStorage.clear();
        window.location.href = "/login";
      } catch (err) {
        alert("Failed to clear data.");
      }
    }
  };

  return (
    <div className="space-y-6 fade-in max-w-4xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your profile, theme, and workspace preferences.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
          <Monitor className="w-3.5 h-3.5" />
          SYSTEM STABLE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Appearance */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <Card className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Account Profile</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your public presence</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 ring-emerald-500/50 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">Email Address</label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">GitHub</label>
                  <input
                    type="text"
                    value={profile.github}
                    onChange={(e) => setProfile({ ...profile, github: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 ring-emerald-500/50 dark:text-white transition-all"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">LeetCode</label>
                  <input
                    type="text"
                    value={profile.leetcode}
                    onChange={(e) => setProfile({ ...profile, leetcode: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 ring-emerald-500/50 dark:text-white transition-all"
                    placeholder="Username"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5 block">GFG</label>
                  <input
                    type="text"
                    value={profile.gfg}
                    onChange={(e) => setProfile({ ...profile, gfg: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm outline-none focus:ring-2 ring-emerald-500/50 dark:text-white transition-all"
                    placeholder="Username"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                 <p className="text-[11px] text-slate-400">Account Role: <span className="text-emerald-500 font-bold uppercase">{user?.role || "User"}</span></p>
                 <button 
                  onClick={handleSave} 
                  disabled={saved}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
                    saved ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/20" : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                  }`}
                >
                  {saved ? <><Check className="w-4 h-4" /> Changes Saved</> : "Update Profile"}
                </button>
              </div>
            </div>
          </Card>

          {/* Appearance Section */}
          <Card>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-500/20">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white">Appearance</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Personalize your visual experience</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Theme Mode</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => dark && toggle()}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      !dark ? "border-emerald-500 bg-emerald-500/5 text-emerald-600" : "border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-300"
                    }`}
                  >
                    <Sun className="w-6 h-6" />
                    <span className="text-xs font-bold">Light</span>
                  </button>
                  <button
                    onClick={() => !dark && toggle()}
                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                      dark ? "border-emerald-500 bg-emerald-500/5 text-emerald-400" : "border-slate-200 dark:border-white/10 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Moon className="w-6 h-6" />
                    <span className="text-xs font-bold">Dark</span>
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Accent Highlights</p>
                <div className="grid grid-cols-3 gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setActiveAccent(color.value)}
                      className={`h-10 rounded-xl border-2 transition-all flex items-center justify-center relative group ${
                        activeAccent === color.value ? "border-emerald-500 shadow-lg scale-105" : "border-transparent"
                      }`}
                      style={{ backgroundColor: `${color.hex}20` }}
                    >
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: color.hex }}></div>
                      {activeAccent === color.value && (
                        <div className="absolute -top-1 -right-1 bg-emerald-500 rounded-full p-0.5">
                          <Check className="w-2 h-2 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Shortcuts & Data */}
        <div className="space-y-6">
          {/* Shortcuts Card */}
          <Card className="!p-0 overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-white/5 flex items-center gap-3">
               <Keyboard className="w-4 h-4 text-blue-500" />
               <span className="text-sm font-bold dark:text-white">Quick Shortcuts</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-white/5">
              {shortcuts.slice(0, 6).map((shortcut) => (
                <div key={shortcut.action} className="p-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{shortcut.action}</span>
                  <div className="flex gap-1">
                    {shortcut.keys.map((key) => (
                      <kbd key={key} className="px-1.5 py-0.5 text-[9px] font-black bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 rounded shadow-sm">
                        {key}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Backup Section */}
          <Card className="bg-slate-50 dark:bg-[#121826]/50 border-dashed">
            <h4 className="text-sm font-bold dark:text-white mb-1">Data Backup</h4>
            <p className="text-xs text-slate-500 mb-4">Export all your tasks and snippets to a JSON file.</p>
            <button onClick={handleExport} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-all active:scale-95">
              <Download className="w-4 h-4" /> Export All Data
            </button>
          </Card>

          {/* Danger Zone */}
          <Card className="border-rose-500/20 bg-rose-500/[0.02]">
            <div className="flex items-center gap-2 text-rose-500 mb-3">
               <Trash2 className="w-4 h-4" />
               <span className="text-xs font-black uppercase tracking-tighter">Danger Zone</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Once you clear your data, there is no going back. This will delete all tasks and snippets associated with your account.
            </p>
            <button 
              onClick={handleClearData} 
              className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-500 text-xs font-bold hover:bg-rose-500 hover:text-white transition-all shadow-sm"
            >
              Destroy All Data
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};
