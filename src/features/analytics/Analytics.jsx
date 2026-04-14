import { useEffect, useState } from "react";
import { ContributionHeatmap } from "./components/ContributionHeatmap";
import { LanguageBreakdown } from "./components/LanguageBreakdown";
import { ProductivityChart } from "./components/ProductivityChart";
import { Card } from "../../components/ui/Card";
import { useAnalyticsStore } from "./analyticsStore";
import { api } from "../../services/api";
import { TrendingUp, GitPullRequest, Code2, Eye, CheckCircle2, ListTodo, Loader2 } from "lucide-react";

export const Analytics = () => {
  const { weeklyProductivity } = useAnalyticsStore();
  const [backendStats, setBackendStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get("/analytics/productivity?days=60");
        setBackendStats(data.data);
      } catch {
        // Fallback to local store data
      }
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  const totals = weeklyProductivity.reduce(
    (acc, w) => ({
      commits: acc.commits + w.commits,
      prs: acc.prs + w.prs,
      reviews: acc.reviews + w.reviews,
      issues: acc.issues + w.issues,
    }),
    { commits: 0, prs: 0, reviews: 0, issues: 0 }
  );

  // Use backend stats if available, otherwise fallback to mock
  const taskSummary = backendStats?.taskSummary || {};
  const miniStats = [
    { label: "Total Tasks", value: (taskSummary.TODO || 0) + (taskSummary.IN_PROGRESS || 0) + (taskSummary.DONE || 0), icon: ListTodo, color: "emerald" },
    { label: "Completed", value: taskSummary.DONE || 0, icon: CheckCircle2, color: "blue" },
    { label: "In Progress", value: taskSummary.IN_PROGRESS || 0, icon: Eye, color: "violet" },
    { label: "To Do", value: taskSummary.TODO || 0, icon: TrendingUp, color: "amber" },
  ];

  const colorMap = {
    emerald: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    violet: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    amber: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Track your coding patterns and productivity metrics.</p>
      </div>

      {/* Mini stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {miniStats.map((stat) => (
          <Card key={stat.label} className="flex items-center gap-3 !p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${colorMap[stat.color]}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Contribution heatmap */}
      <ContributionHeatmap />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ProductivityChart />
        <LanguageBreakdown />
      </div>

      {/* Backend snippet stats */}
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
  );
};
