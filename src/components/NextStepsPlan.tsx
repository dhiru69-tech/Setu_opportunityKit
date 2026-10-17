import React, { useState } from 'react';
import { 
  CheckSquare, 
  Square, 
  Calendar, 
  AlertCircle, 
  FileText, 
  Plus, 
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { NextStepTask } from '../types';

interface NextStepsPlanProps {
  tasks: NextStepTask[];
  onTasksChange?: (updatedTasks: NextStepTask[]) => void;
  className?: string;
}

export const NextStepsPlan: React.FC<NextStepsPlanProps> = ({
  tasks: initialTasks,
  onTasksChange,
  className = ''
}) => {
  const [tasks, setTasks] = useState<NextStepTask[]>(initialTasks);
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = tasks.filter(t => t.completed).length;
  const progressPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const toggleTask = (id: string) => {
    const updated = tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t));
    setTasks(updated);
    if (onTasksChange) onTasksChange(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: NextStepTask = {
      id: `task-custom-${Date.now()}`,
      title: newTitle.trim(),
      description: 'Custom preparation task added by student.',
      category: 'documentation',
      completed: false,
      priority: 'medium'
    };

    const updated = [...tasks, newTask];
    setTasks(updated);
    setNewTitle('');
    setIsAdding(false);
    if (onTasksChange) onTasksChange(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter(t => t.id !== id);
    setTasks(updated);
    if (onTasksChange) onTasksChange(updated);
  };

  const getCategoryBadge = (cat: NextStepTask['category']) => {
    switch (cat) {
      case 'profile_fix':
        return <span className="text-[10px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded border border-sky-200">Profile</span>;
      case 'documentation':
        return <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">Documents</span>;
      case 'verification':
        return <span className="text-[10px] bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded border border-purple-200">Verification</span>;
      case 'application_submission':
        return <span className="text-[10px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded border border-emerald-200 font-semibold">Portal Submission</span>;
      default:
        return null;
    }
  };

  return (
    <div className={`bg-white rounded-xl border border-[#E5E9E5] p-5 text-[#202522] ${className}`}>
      {/* Header and Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-[#202522] flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#087F73]" />
            Personalized Preparation Checklist
          </h3>
          <p className="text-xs text-[#69716D] mt-0.5">
            Targeted action items generated from opportunity requirements and identified gaps.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-bold text-[#202522]">{completedCount} of {tasks.length}</span>
            <span className="text-xs text-[#69716D] ml-1">done</span>
          </div>
          <div className="w-24 h-2 rounded-full bg-stone-100 overflow-hidden">
            <div
              className="h-full bg-[#087F73] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-2 mb-4">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
              task.completed
                ? 'bg-stone-50 border-[#E5E9E5] opacity-75'
                : 'bg-white border-[#E5E9E5] hover:border-[#087F73]/40'
            }`}
          >
            <div className="flex items-start gap-3 flex-1">
              <button
                type="button"
                onClick={() => toggleTask(task.id)}
                className="mt-0.5 text-[#087F73] hover:text-[#066258] transition-colors cursor-pointer shrink-0"
                aria-label={task.completed ? 'Mark task incomplete' : 'Mark task complete'}
              >
                {task.completed ? (
                  <CheckSquare className="w-4 h-4 fill-[#EEF8F6]" />
                ) : (
                  <Square className="w-4 h-4 text-[#69716D]" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span
                    className={`text-xs font-semibold ${
                      task.completed ? 'line-through text-[#69716D]' : 'text-[#202522]'
                    }`}
                  >
                    {task.title}
                  </span>
                  {getCategoryBadge(task.category)}
                  {task.priority === 'high' && (
                    <span className="text-[10px] font-bold text-red-700 bg-red-50 px-1.5 py-0.2 rounded border border-red-200">
                      Priority
                    </span>
                  )}
                </div>

                <p className="text-[11px] text-[#69716D] leading-relaxed">
                  {task.description}
                </p>

                {task.dueDate && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#69716D] font-medium mt-1">
                    <Calendar className="w-3 h-3 text-[#087F73]" />
                    Target deadline: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                )}
              </div>
            </div>

            {task.id.startsWith('task-custom') && (
              <button
                onClick={() => deleteTask(task.id)}
                className="text-stone-400 hover:text-red-600 p-1 transition-colors"
                title="Remove custom task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Custom Task Form */}
      {isAdding ? (
        <form onSubmit={handleAddTask} className="flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Schedule meeting with recommender..."
            className="flex-1 px-3 py-1.5 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
            autoFocus
          />
          <button
            type="submit"
            className="px-3 py-1.5 rounded-lg bg-[#087F73] hover:bg-[#066258] text-white text-xs font-semibold cursor-pointer"
          >
            Add Task
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="px-2.5 py-1.5 rounded-lg border border-[#E5E9E5] text-[#69716D] hover:bg-stone-50 text-xs font-medium cursor-pointer"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="text-xs font-medium text-[#087F73] hover:text-[#066258] flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add custom preparation task
        </button>
      )}
    </div>
  );
};
