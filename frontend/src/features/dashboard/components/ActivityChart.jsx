import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card } from "../../../components/ui/Card";

export const ActivityChart = ({ data }) => {
  // Fallback to empty if no data provided
  const chartData = data?.length > 0 ? data : [
    { name: "Mon", activity: 0 },
    { name: "Tue", activity: 0 },
    { name: "Wed", activity: 0 },
    { name: "Thu", activity: 0 },
    { name: "Fri", activity: 0 },
    { name: "Sat", activity: 0 },
    { name: "Sun", activity: 0 },
  ];

  return (
    <Card className="col-span-3">
      <div className="mb-6 flex justify-between items-center">
         <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Activity Overview</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Your coding output this week</p>
         </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="activity" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorActivity)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};