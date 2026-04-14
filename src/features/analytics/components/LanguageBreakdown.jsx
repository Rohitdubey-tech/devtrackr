import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card } from "../../../components/ui/Card";
import { useAnalyticsStore } from "../analyticsStore";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 px-3 py-2 rounded-xl text-xs shadow-xl">
        <p className="font-semibold text-white">{payload[0].name}</p>
        <p className="text-emerald-400">{payload[0].value}% of codebase</p>
      </div>
    );
  }
  return null;
};

export const LanguageBreakdown = () => {
  const { languageData } = useAnalyticsStore();

  return (
    <Card>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Language Breakdown</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Across all repositories</p>

      <div className="flex items-center gap-6">
        <div className="w-40 h-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={languageData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {languageData.map((entry, index) => (
                  <Cell key={index} fill={entry.color} className="hover:opacity-80 transition-opacity cursor-pointer" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="flex-1 space-y-2.5">
          {languageData.map((lang) => (
            <div key={lang.name} className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: lang.color }} />
              <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{lang.name}</span>
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${lang.value}%`, backgroundColor: lang.color }} />
                </div>
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 w-8 text-right">{lang.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
