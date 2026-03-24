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
      (e.target as HTMLElement).classList.add('opacity-40', 'shadow-2xl');
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).classList.remove('opacity-40', 'shadow-2xl');
  };

  const priorityColors = {
    Critical: 'bg-red-100 text-red-700 border-red-200',
    High: 'bg-orange-100 text-orange-700 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Low: 'bg-green-100 text-green-700 border-green-200',
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing mb-3 hover:shadow-md transition-all relative z-10"
    >
      <div className="flex justify-between items-start mb-3">
        <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-md border uppercase tracking-wider ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
          {task.assignee}
        </div>
      </div>
      
      <h3 className="text-sm font-bold text-gray-800 mb-4 leading-snug">{task.title}</h3>
      
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className={`${isOverdue ? 'text-red-600 bg-red-50 px-2 py-1 rounded' : dueToday ? 'text-amber-600 bg-amber-50 px-2 py-1 rounded' : 'text-gray-500'}`}>
          {dueToday ? 'Due Today' : isOverdue ? 'Overdue!' : `Due: ${format(dueDate, 'MMM dd')}`}
        </span>
      </div>
    </div>
  );
}