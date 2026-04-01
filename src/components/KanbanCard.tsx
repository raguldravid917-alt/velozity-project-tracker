import { format, isBefore, startOfToday, isToday } from 'date-fns';
import type { Task } from '../utils/generateData';

export default function KanbanCard({ task }: { task: Task }) {
  const today = startOfToday();
  const dueDate = new Date(task.dueDate);
  const isOverdue = isBefore(dueDate, today);
  const dueToday = isToday(dueDate);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    
    setTimeout(() => {
      (e.target as HTMLElement).classList.add('opacity-40', 'scale-95');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('opacity-40', 'scale-95');
  };

  // 🎨 Priority colors updated for Dark Theme
  const priorityColors: Record<string, string> = {
    Critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    High: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    Medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    Low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      // 🎴 Dark Card with subtle hover effect
      className="bg-[#1c1c21] p-4 rounded-xl shadow-md border border-white/5 cursor-grab active:cursor-grabbing mb-3 hover:shadow-xl hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-200 relative z-10 group"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[10px] font-extrabold px-2 py-1 rounded border uppercase tracking-widest ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        
        {/* Dark User Avatar */}
        <div className="w-7 h-7 rounded-full bg-[#27272a] border border-white/10 text-gray-300 flex items-center justify-center text-xs font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
          {task.assignee}
        </div>
      </div>
      
      <h3 className="text-[15px] font-semibold text-gray-200 mb-4 leading-snug group-hover:text-white transition-colors">
        {task.title}
      </h3>
      
      <div className="flex justify-between items-center text-xs font-semibold">
        {/* Date colors updated for Dark Theme */}
        <span className={`flex items-center gap-1.5 px-2 py-1 rounded ${
          isOverdue ? 'text-red-400 bg-red-500/10' : 
          dueToday ? 'text-amber-400 bg-amber-500/10' : 
          'text-gray-500'
        }`}>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
          {dueToday ? 'Due Today' : isOverdue ? 'Overdue!' : `Due: ${format(dueDate, 'MMM dd')}`}
        </span>
      </div>
    </div>
  );
}