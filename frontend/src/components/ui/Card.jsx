import { cn } from "../../utils/cn";

export const Card = ({ children, className = "" }) => {
  return (
    <div className={cn(
      "bg-white/80 dark:bg-[#121826]/70 backdrop-blur-2xl border border-slate-200 dark:border-white/5 shadow-xl shadow-slate-200/20 dark:shadow-black/40 rounded-2xl p-6 transition-all duration-300",
      className
    )}>
      {children}
    </div>
  );
};