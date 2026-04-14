import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { Card } from "../../../components/ui/Card";
import { useAnalyticsStore } from "../analyticsStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 px-4 py-3 rounded-xl text-xs shadow-xl space-y-1">
        <p className="font-semibold text-white mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-slate-300">{p.name}:</span>
            <span className="font-bold text-white">{p.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ProductivityChart = () => {
  const { weeklyProductivity } = useAnalyticsStore();

  return (
    <Card className="col-span-2">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Productivity Breakdown</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Commits, PRs, Reviews &amp; Issues over 8 weeks</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyProductivity} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(16,185,129,0.05)" }} />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
            />
            <Bar dataKey="commits" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="prs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="reviews" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="issues" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
