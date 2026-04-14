import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card } from "../../../components/ui/Card";

const data = [
  { name: "Mon", commits: 12, tasks: 4 },
  { name: "Tue", commits: 19, tasks: 7 },
  { name: "Wed", commits: 15, tasks: 5 },
  { name: "Thu", commits: 25, tasks: 10 },
  { name: "Fri", commits: 22, tasks: 8 },
  { name: "Sat", commits: 8, tasks: 2 },
  { name: "Sun", commits: 5, tasks: 1 },
];

export const ActivityChart = () => {
  return (
    <Card className="col-span-3">
      <div className="mb-6 flex justify-between items-center">
         <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Overview</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your coding output this week</p>
         </div>
         <select className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg px-3 py-1.5 text-sm dark:text-slate-200 outline-none focus:ring-2 ring-emerald-500/50">
           <option>This Week</option>
           <option>Last Week</option>
         </select>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(18, 24, 38, 0.8)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
              itemStyle={{ color: "#10b981" }}
            />
            <Area type="monotone" dataKey="commits" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorCommits)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};