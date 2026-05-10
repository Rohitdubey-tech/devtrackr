import { useMemo } from "react";
import { Card } from "../../../components/ui/Card";
import { useAnalyticsStore } from "../analyticsStore";

const getColor = (count, dark) => {
  if (count === 0) return dark ? "#161b22" : "#ebedf0";
  if (count <= 3) return "#0e4429";
  if (count <= 6) return "#006d32";
  if (count <= 9) return "#26a641";
  return "#39d353";
};

export const ContributionHeatmap = ({ source = "combined" }) => {
  const { heatmapData, githubHeatmapData, localHeatmapData } = useAnalyticsStore();
  
  const data = source === "github" ? githubHeatmapData 
             : source === "local" ? localHeatmapData 
             : heatmapData;

  const totalContributions = useMemo(
    () => data.reduce((sum, d) => sum + d.count, 0),
    [data]
  );

  const maxStreak = useMemo(() => {
    let max = 0, current = 0;
    data.forEach((d) => {
      if (d.count > 0) { current++; max = Math.max(max, current); }
      else current = 0;
    });
    return max;
  }, [data]);

  const dayLabels = ["", "Mon", "", "Wed", "", "Fri", ""];

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Contribution Activity</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <span className="font-semibold text-emerald-500">{totalContributions}</span> contributions in the last 20 weeks
            &nbsp;·&nbsp;Longest streak: <span className="font-semibold text-emerald-500">{maxStreak} days</span>
          </p>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-2 shrink-0">
          {dayLabels.map((label, i) => (
            <div key={i} className="h-[14px] text-[10px] text-slate-500 dark:text-slate-400 flex items-center justify-end pr-1 w-6">
              {label}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        {Array.from({ length: 20 }).map((_, weekIdx) => (
          <div key={weekIdx} className="flex flex-col gap-1">
            {Array.from({ length: 7 }).map((_, dayIdx) => {
              const cell = data.find(
                (d) => d.week === weekIdx && d.day === dayIdx
              );
              return (
                <div
                  key={dayIdx}
                  className="w-[14px] h-[14px] rounded-[3px] transition-all hover:scale-150 hover:z-10 cursor-pointer relative group"
                  style={{ backgroundColor: getColor(cell?.count || 0, true) }}
                >
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-[10px] bg-slate-900 text-white rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
                    {cell?.count || 0} contributions on {cell?.date}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-4 text-[10px] text-slate-500">
        <span>Less</span>
        {[0, 2, 5, 8, 12].map((val) => (
          <div
            key={val}
            className="w-[12px] h-[12px] rounded-[2px]"
            style={{ backgroundColor: getColor(val, true) }}
          />
        ))}
        <span>More</span>
      </div>
    </Card>
  );
};
