import { useThemeStore } from "../../app/store";
import { Moon, Sun, Bell, Search } from "lucide-react";

export const Navbar = () => {
  const { dark, toggle } = useThemeStore();

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

      <div className="flex items-center gap-4">
        <button className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
        </button>
        
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-800"></div>

        <button 
          onClick={toggle}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 transition-colors"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
};