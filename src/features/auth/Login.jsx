import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "./authStore";
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
              <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">or reach instantly</span>
              <div className="h-px bg-white/10 flex-1"></div>
            </div>

            <button
               onClick={handleGuestLogin}
               className="w-full mt-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all flex items-center justify-center gap-3 group"
            >
               <span className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                 <Shield className="w-4 h-4" />
               </span>
               Try Guest Demo
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