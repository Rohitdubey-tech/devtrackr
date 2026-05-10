import { useEffect, useState } from "react";
import { ContributionHeatmap } from "./components/ContributionHeatmap";
import { LanguageBreakdown } from "./components/LanguageBreakdown";
import { ProductivityChart } from "./components/ProductivityChart";
import { Card } from "../../components/ui/Card";
import { useAnalyticsStore } from "./analyticsStore";
import { useAuthStore } from "../auth/authStore";
import { api } from "../../services/api";
import { TrendingUp, GitPullRequest, Code2, Eye, CheckCircle2, ListTodo, Loader2, Flame, Monitor } from "lucide-react";

export const Analytics = () => {
  const { weeklyProductivity, fetchRealAnalytics } = useAnalyticsStore();
  const { user } = useAuthStore();
  const [backendStats, setBackendStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("devtrackr"); // devtrackr, github, competitive

  useEffect(() => {
    const loadAllAnalytics = async () => {
      let localActivity = {};
      try {
        const { data } = await api.get("/analytics/productivity?days=60");
        setBackendStats(data.data);
        localActivity = data.data.localActivity || {};
      } catch { /* ignore */ }
      
      await fetchRealAnalytics(user?.githubUsername, localActivity);
      setLoading(false);
    };
    loadAllAnalytics();
  }, [user?.githubUsername, user?.leetcodeUsername, user?.gfgUsername, fetchRealAnalytics]);

  const taskSummary = backendStats?.taskSummary || {};
  const currentStreak = backendStats?.streak?.current || 0;

  const miniStats = [
    { label: "Current Streak", value: `${currentStreak} Days`, icon: Flame, color: "orange" },
    { label: "Total Tasks", value: (taskSummary.TODO || 0) + (taskSummary.IN_PROGRESS || 0) + (taskSummary.DONE || 0), icon: ListTodo, color: "emerald" },
    { label: "Completed", value: taskSummary.DONE || 0, icon: CheckCircle2, color: "blue" },
    { label: "Total Days Active", value: backendStats?.streak?.totalDays || 0, icon: TrendingUp, color: "violet" },
  ];

  const colorMap = {
    orange: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Track your performance across all platforms.</p>
        </div>
        {currentStreak > 0 && (
          <div className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-2xl animate-bounce-subtle">
             <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
             <div>
                <p className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-tighter">Streak Active!</p>
                <p className="text-sm font-black text-orange-700 dark:text-orange-500">{currentStreak} Days</p>
             </div>
          </div>
        )}
      </div>

      {/* Platform Switcher */}
      <div className="flex p-1.5 bg-slate-100 dark:bg-white/5 rounded-2xl w-fit border border-slate-200 dark:border-white/10">
        {[
          { id: "devtrackr", label: "DevTrackr", icon: TrendingUp },
          { id: "github", label: "GitHub", icon: GitPullRequest },
          { id: "competitive", label: "CP Stats", icon: Code2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? "bg-white dark:bg-emerald-500 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "devtrackr" && (
        <div className="space-y-6 fade-in">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {miniStats.map((stat) => (
              <Card key={stat.label} className="flex items-center gap-3 !p-4 hover:shadow-lg transition-shadow">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[stat.color]}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>
          <ContributionHeatmap source="local" />
          <ProductivityChart />
          {backendStats?.snippetStats?.length > 0 && (
            <Card>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Snippet Distribution</h3>
              <div className="flex flex-wrap gap-3">
                {backendStats.snippetStats.map((lang) => (
                  <div key={lang._id} className="px-4 py-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{lang._id}</p>
                    <p className="text-xs text-slate-500">{lang.count} snippets · {lang.favorites} ★</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {activeTab === "github" && (
        <div className="space-y-6 fade-in">
          <ContributionHeatmap source="github" />
          <LanguageBreakdown />
        </div>
      )}

      {activeTab === "competitive" && (
        <div className="space-y-6 fade-in">
          {/* Check if user has configured any CP usernames */}
          {(user?.leetcodeUsername || user?.gfgUsername) ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* LeetCode Card */}
              {user?.leetcodeUsername && (
                backendStats?.leetcodeStats ? (
                  <Card className="relative overflow-hidden group border-amber-500/20">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                     <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FFA116]/10 text-[#FFA116] flex items-center justify-center">
                             <Code2 className="w-6 h-6" />
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-900 dark:text-white">LeetCode</h3>
                             <p className="text-xs text-slate-500 font-medium tracking-tight">@{user.leetcodeUsername}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-slate-900 dark:text-white">{backendStats.leetcodeStats.totalSolved}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Solved</p>
                       </div>
                     </div>
                     
                     <div className="space-y-3">
                       <div className="flex justify-between text-xs mb-1">
                         <span className="text-slate-500">Solved / Total</span>
                         <span className="text-slate-900 dark:text-slate-300 font-bold">{backendStats.leetcodeStats.totalSolved} / {backendStats.leetcodeStats.totalQuestions}</span>
                       </div>
                       <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-500 rounded-full transition-all" 
                            style={{ width: `${Math.min((backendStats.leetcodeStats.totalSolved / (backendStats.leetcodeStats.totalQuestions || 1)) * 100, 100)}%` }}
                          ></div>
                       </div>
                       <div className="grid grid-cols-3 gap-2 pt-2">
                          <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-center">
                             <p className="text-xs font-bold text-emerald-500">{backendStats.leetcodeStats.easySolved}</p>
                             <p className="text-[8px] text-slate-500 uppercase font-black">Easy</p>
                          </div>
                          <div className="p-2 rounded-lg bg-amber-500/5 border border-amber-500/10 text-center">
                             <p className="text-xs font-bold text-amber-500">{backendStats.leetcodeStats.mediumSolved}</p>
                             <p className="text-[8px] text-slate-500 uppercase font-black">Medium</p>
                          </div>
                          <div className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/10 text-center">
                             <p className="text-xs font-bold text-rose-500">{backendStats.leetcodeStats.hardSolved}</p>
                             <p className="text-[8px] text-slate-500 uppercase font-black">Hard</p>
                          </div>
                       </div>
                       {backendStats.leetcodeStats.ranking > 0 && (
                         <p className="text-xs text-slate-500 pt-2">Global Rank: <span className="text-slate-900 dark:text-slate-200 font-bold">#{backendStats.leetcodeStats.ranking.toLocaleString()}</span></p>
                       )}
                     </div>
                  </Card>
                ) : (
                  <Card className="border-amber-500/10 py-8 text-center">
                    <Code2 className="w-8 h-8 text-amber-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white">LeetCode: @{user.leetcodeUsername}</p>
                    <p className="text-xs text-slate-500 mt-1">Could not fetch stats. Check your username or try again later.</p>
                  </Card>
                )
              )}

              {/* GFG Card */}
              {user?.gfgUsername && (
                backendStats?.gfgStats ? (
                  <Card className="relative overflow-hidden group border-emerald-500/20">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                     <div className="flex items-center justify-between mb-6">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#2F8D46]/10 text-[#2F8D46] flex items-center justify-center">
                             <CheckCircle2 className="w-6 h-6" />
                          </div>
                          <div>
                             <h3 className="font-bold text-slate-900 dark:text-white">GeeksforGeeks</h3>
                             <p className="text-xs text-slate-500 font-medium tracking-tight">@{user.gfgUsername}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-slate-900 dark:text-white">{backendStats.gfgStats.totalProblemsSolved || backendStats.gfgStats.info?.totalProblemsSolved || 0}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase">Solved</p>
                       </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                           <p className="text-xs text-slate-500 mb-1">Coding Score</p>
                           <p className="text-lg font-bold text-slate-900 dark:text-white">{backendStats.gfgStats.totalScore || backendStats.gfgStats.info?.codingScore || 0}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5">
                           <p className="text-xs text-slate-500 mb-1">Current Streak</p>
                           <p className="text-lg font-bold text-slate-900 dark:text-white">{backendStats.gfgStats.currentStreak || backendStats.gfgStats.info?.currentStreak || 0} days</p>
                        </div>
                     </div>
                  </Card>
                ) : (
                  <Card className="border-emerald-500/10 py-8 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                    <p className="text-sm font-bold text-slate-900 dark:text-white">GFG: @{user.gfgUsername}</p>
                    <p className="text-xs text-slate-500 mt-1">Could not fetch stats. Check your username or try again later.</p>
                  </Card>
                )
              )}
            </div>
          ) : (
            <Card className="py-12 text-center border-dashed">
               <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Monitor className="w-8 h-8 text-slate-400" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Platforms Connected</h3>
               <p className="text-sm text-slate-500 max-w-sm mx-auto mt-2">Go to <span className="font-bold text-emerald-500">Settings → Account Profile</span> to add your LeetCode and GFG usernames.</p>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
