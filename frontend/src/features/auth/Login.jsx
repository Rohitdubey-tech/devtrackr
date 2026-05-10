import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./authStore";
import { API_BASE_URL } from "../../services/api";
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, LayoutDashboard, Code, BarChart3, Shield } from "lucide-react";

const FeatureItem = ({ icon: Icon, title, desc }) => (
  <div className="flex gap-4 group">
    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all">
      <Icon className="w-6 h-6 text-slate-400 group-hover:text-emerald-500" />
    </div>
    <div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

export const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", githubUsername: "" });
  const { login, register, isLoading, error, clearError } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let success;
    if (isRegister) {
      success = await register(form.name, form.email, form.password, form.githubUsername);
    } else {
      success = await login(form.email, form.password);
    }
    if (success) navigate("/");
  };

  const handleGuestLogin = async () => {
    // These would be pre-seeded in the database
    const success = await login("demo@devtrackr.io", "demo1234");
    if (success) navigate("/");
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    clearError();
  };

  return (
    <div className="min-h-screen flex bg-[#0A0D14] relative overflow-hidden">
      {/* Ambient background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Left side: Features showcase (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center p-20 relative z-10 border-r border-white/5 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
            DevTrackr
          </h1>
        </div>

        <h2 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
          Your Personal <span className="text-emerald-500">Developer OS</span>
        </h2>
        <p className="text-slate-400 text-lg mb-12 max-w-lg">
          The all-in-one workspace designed for modern developers to track tasks, save snippets, and visualize growth.
        </p>

        <div className="space-y-8 max-w-md">
          <FeatureItem 
            icon={LayoutDashboard} 
            title="Interactive Kanban" 
            desc="Manage your daily sprints with a drag-and-drop board optimized for developer workflows."
          />
          <FeatureItem 
            icon={Code} 
            title="Snippet Vault" 
            desc="Save your most-used code patterns with syntax highlighting and instant full-text search."
          />
          <FeatureItem 
            icon={BarChart3} 
            title="Growth Analytics" 
            desc="Visualize your productivity with contribution heatmaps and language breakdown charts."
          />
          <FeatureItem 
            icon={Shield} 
            title="Secure by Design" 
            desc="Enterprise-grade JWT authentication with refresh token rotation to keep your data safe."
          />
        </div>

        <div className="mt-16 pt-12 border-t border-white/5 flex items-center gap-6">
          <div className="flex -space-x-3">
             {[1,2,3,4].map(idx => (
               <div key={idx} className="w-10 h-10 rounded-full border-2 border-[#0A0D14] bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                 U{idx}
               </div>
             ))}
          </div>
          <p className="text-slate-500 text-sm">Join <span className="text-slate-300 font-semibold">1,000+</span> developers tracking their journey.</p>
        </div>
      </div>

      {/* Right side: Auth form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Logo (Mobile only) */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">DevTrackr</h1>
          </div>

          <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 lg:p-10 shadow-2xl relative">
            <h2 className="text-2xl font-bold text-white mb-2">
              {isRegister ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-slate-400 text-sm mb-8">
              {isRegister ? "Start tracking your developer journey" : "Sign in to your dev workspace"}
            </p>

            {error && (
              <div className="flex items-center gap-3 p-4 mb-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm outline-none focus:border-emerald-500/50 focus:ring-4 ring-emerald-500/10 text-white placeholder:text-slate-600 transition-all"
                    placeholder="Rohit Dubey"
                  />
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm outline-none focus:border-emerald-500/50 focus:ring-4 ring-emerald-500/10 text-white placeholder:text-slate-600 transition-all"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full px-5 py-3 pr-12 rounded-2xl bg-white/5 border border-white/10 text-sm outline-none focus:border-emerald-500/50 focus:ring-4 ring-emerald-500/10 text-white placeholder:text-slate-600 transition-all"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isRegister && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2 block ml-1">GitHub Username</label>
                  <input
                    type="text"
                    value={form.githubUsername}
                    onChange={(e) => setForm({ ...form, githubUsername: e.target.value })}
                    className="w-full px-5 py-3 rounded-2xl bg-white/5 border border-white/10 text-sm outline-none focus:border-emerald-500/50 focus:ring-4 ring-emerald-500/10 text-white placeholder:text-slate-600 transition-all"
                    placeholder="google-dev"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 disabled:cursor-wait text-white font-bold rounded-2xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:translate-y-[-2px] active:translate-y-[0px] flex items-center justify-center gap-2 mt-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : isRegister ? (
                  <><UserPlus className="w-5 h-5" /> Create Account</>
                ) : (
                  <><LogIn className="w-5 h-5" /> Let's Go!</>
                )}
              </button>
            </form>

            <div className="mt-8 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1"></div>
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">or continue with</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <a href={`${API_BASE_URL}/auth/google`} className="flex items-center justify-center py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all hover:scale-105 active:scale-95 group">
                <svg className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                   <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                   <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                   <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </a>
              <a href={`${API_BASE_URL}/auth/github`} className="flex items-center justify-center py-3.5 rounded-2xl bg-white/5 hover:bg-[#181717]/80 border border-white/10 hover:border-white/20 transition-all hover:scale-105 active:scale-95 group">
                <svg className="w-5 h-5 text-white opacity-70 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="currentColor">
                   <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                </svg>
              </a>
            </div>

            <button
               onClick={handleGuestLogin}
               className="w-full mt-4 py-3 rounded-2xl bg-transparent hover:bg-white/5 border border-transparent text-slate-400 hover:text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 group"
            >
               <Shield className="w-4 h-4 text-emerald-500 opacity-70 group-hover:opacity-100" />
               Use Guest Demo Account
            </button>

            <div className="mt-8 text-center text-sm text-slate-500">
              {isRegister ? "Already have an account?" : "New to DevTrackr?"}{" "}
              <button 
                onClick={toggleMode} 
                className="font-bold text-emerald-500 hover:text-emerald-400 hover:underline underline-offset-4"
              >
                {isRegister ? "Sign in" : "Create Account"}
              </button>
            </div>
          </div>
          
          <p className="mt-8 text-center text-slate-600 text-xs">
            Built with ❤️ for the developer community.
          </p>
        </div>
      </div>
    </div>
  );
};