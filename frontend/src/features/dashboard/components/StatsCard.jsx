import { Card } from "../../../components/ui/Card";
import { cn } from "../../../utils/cn";

export const StatsCard = ({ title, value, icon: Icon, trend = "+0%", trendUp = true }) => {
  return (
    <Card className="hover:-translate-y-1 hover:shadow-emerald-500/10 group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
           {Icon && <Icon className="w-6 h-6" />}
        </div>
        <div className={cn(
           "px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md",
           trendUp 
             ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400 dark:bg-emerald-500/10 border border-emerald-500/20" 
             : "text-rose-600 bg-rose-500/10 dark:text-rose-400 dark:bg-rose-500/10 border border-rose-500/20"
        )}>
          {trend}
        </div>
      </div>
      <div>
         <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</p>
         <h2 className="text-3xl font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{value}</h2>
      </div>
    </Card>
  );
};