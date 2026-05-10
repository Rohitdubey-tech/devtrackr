import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";

export const Column = ({ id, title, tasks, icon: Icon, colorClass }) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
           <div className={`p-1.5 rounded-lg ${colorClass}`}>
             <Icon className="w-4 h-4" />
           </div>
           <h3 className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        </div>
        <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs py-0.5 px-2 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex-1 rounded-2xl p-3 min-h-[150px] transition-colors border-2 border-transparent ${
          isOver ? "bg-slate-100/80 dark:bg-slate-800/80 border-emerald-500/30 border-dashed" : "bg-slate-50 dark:bg-[#0A0D14]"
        }`}
      >
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <TaskCard key={task._id || task.id} task={task} />
          ))}
        </div>
      </div>
    </div>
  );
};