import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Trash2 } from "lucide-react";
import { useTaskStore } from "../taskStore";

export const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task._id || task.id,
    data: { task },
  });
  
  const deleteTask = useTaskStore(state => state.deleteTask);

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white dark:bg-[#1A2234] border border-slate-200 dark:border-slate-700/50 rounded-xl p-4 shadow-sm hover:shadow-md transition-all ${
        isDragging ? "opacity-50 scale-105 z-50 shadow-lg ring-2 ring-emerald-500/50" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div 
          {...listeners} 
          {...attributes}
          className="mt-0.5 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <div className="flex-1">
           <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{task.title}</p>
        </div>
        <button 
           onClick={() => deleteTask(task._id || task.id)}
           className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-all rounded hover:bg-rose-500/10"
        >
           <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;