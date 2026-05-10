import { useState, useEffect } from "react";
import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import { Plus, ListTodo, Timer, CheckCircle2, Loader2 } from "lucide-react";
import { useTaskStore } from "./taskStore";
import { Column } from "./components/column";
import { TaskCard } from "./components/TaskCard";

export const TaskBoard = () => {
  const { tasks, isLoading, fetchTasks, addTask, updateTaskStatus } = useTaskStore();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [activeTask, setActiveTask] = useState(null);

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const { error } = useTaskStore();

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor)
  );

  const getTaskId = (task) => task._id || task.id;

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => getTaskId(t) === active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;
    
    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find(t => getTaskId(t) === taskId);
    if (task && task.status !== newStatus) {
      updateTaskStatus(taskId, newStatus);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    console.log("Adding task:", newTaskTitle);
    if (newTaskTitle.trim()) {
      try {
        await addTask(newTaskTitle.trim(), "TODO");
        console.log("Task added successfully");
        setNewTaskTitle("");
      } catch (err) {
        console.error("Task add error:", err);
      }
    }
  };

  const columns = [
    { id: "TODO", title: "To Do", icon: ListTodo, colorClass: "bg-slate-500/10 text-slate-500" },
    { id: "IN_PROGRESS", title: "In Progress", icon: Timer, colorClass: "bg-amber-500/10 text-amber-500" },
    { id: "DONE", title: "Done", icon: CheckCircle2, colorClass: "bg-emerald-500/10 text-emerald-500" }
  ];

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in h-full flex flex-col max-w-7xl mx-auto">
      {error && (
        <div className="bg-rose-500/10 border border-rose-500/20 text-rose-500 px-4 py-3 rounded-xl text-sm font-medium animate-in fade-in slide-in-from-top-4">
          Error: {error}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Task Board</h1>
           <p className="text-slate-500 dark:text-slate-400">Manage your work visually.</p>
        </div>
        
        <form onSubmit={handleAddTask} className="flex gap-2 relative">
          <input 
            type="text" 
            placeholder="What needs to be done?" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="pl-4 pr-10 py-2.5 rounded-xl bg-white dark:bg-[#121826] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 ring-emerald-500/50 dark:text-white shadow-sm w-full sm:w-72 transition-all"
          />
          <button 
            type="submit" 
            disabled={!newTaskTitle.trim()}
            className="absolute right-1.5 top-1.5 bottom-1.5 w-8 flex items-center justify-center bg-emerald-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </form>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <DndContext 
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-6 min-w-max h-full">
            {columns.map(col => (
              <div key={col.id} className="w-80 flex-shrink-0">
                <Column 
                  id={col.id} 
                  title={col.title} 
                  icon={col.icon}
                  colorClass={col.colorClass}
                  tasks={tasks.filter(t => t.status === col.id)} 
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {activeTask ? (
              <div className="rotate-2 scale-105 opacity-80 cursor-grabbing">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};