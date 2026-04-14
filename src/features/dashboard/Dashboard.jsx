import { useEffect, useState } from "react";
import { StatsCard } from "./components/StatsCard";
import { ActivityChart } from "./components/ActivityChart";
import { GitCommit, Flame, CheckCircle2, ListTodo, Code2, Loader2 } from "lucide-react";
import { useAuthStore } from "../../features/auth/authStore";
import { api } from "../../services/api";

export const Dashboard = () => {
  const { user } = useAuthStore();
  const [taskStats, setTaskStats] = useState({ TODO: 0, IN_PROGRESS: 0, DONE: 0 });
  const [snippetCount, setSnippetCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [tasksRes, snippetsRes] = await Promise.all([
          api.get("/tasks?limit=200"),
          api.get("/snippets"),
        ]);

        const tasks = tasksRes.data.data.tasks;
        const counts = { TODO: 0, IN_PROGRESS: 0, DONE: 0 };
        tasks.forEach((t) => { counts[t.status] = (counts[t.status] || 0) + 1; });
        setTaskStats(counts);
        setSnippetCount(snippetsRes.data.data.snippets.length);
      } catch {
        // silently fail — will show 0s
      }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const totalTasks = taskStats.TODO + taskStats.IN_PROGRESS + taskStats.DONE;
  const firstName = user?.name?.split(" ")[0] || "Developer";

  const stats = [
    { title: "Total Tasks", value: String(totalTasks), icon: ListTodo, trend: `${taskStats.IN_PROGRESS} in progress`, trendUp: true },
    { title: "Completed", value: String(taskStats.DONE), icon: CheckCircle2, trend: totalTasks > 0 ? `${Math.round((taskStats.DONE / totalTasks) * 100)}% done` : "0%", trendUp: taskStats.DONE > 0 },
    { title: "Code Snippets", value: String(snippetCount), icon: Code2, trend: "Saved snippets", trendUp: true },
  ];

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
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back, {firstName}!</h1>
         <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your projects today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <StatsCard key={i} {...s} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <ActivityChart />
      </div>
    </div>
  );
};