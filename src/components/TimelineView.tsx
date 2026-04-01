import { useMemo } from 'react';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, isToday, differenceInDays, startOfDay } from 'date-fns';
import type { Priority } from '../utils/generateData';
import { useFilteredTasks } from '../utils/useFilteredTasks';

export default function TimelineView() {
  const tasks = useFilteredTasks();
  const today = startOfDay(new Date());
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);

  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const timelineTasks = useMemo(() => tasks.slice(0, 100), [tasks]);

  const priorityColors: Record<Priority, string> = {
    Critical: 'bg-red-500/80 border-red-400',
    High: 'bg-orange-500/80 border-orange-400',
    Medium: 'bg-yellow-500/80 border-yellow-400',
    Low: 'bg-emerald-500/80 border-emerald-400',
  };

  return (
    // 🖤 Main Dark Container
    <div className="flex-1 bg-[#121214] rounded-xl shadow-2xl border border-white/10 flex flex-col overflow-hidden h-full">
      <div className="flex flex-1 overflow-hidden">

        {/* 👈 Left Sidebar (Task Names) */}
        <div className="w-64 border-r border-white/10 flex flex-col bg-[#18181b] flex-shrink-0 z-20 shadow-[2px_0_10px_rgba(0,0,0,0.5)]">
          <div className="h-14 border-b border-white/10 flex items-center px-4 font-bold text-xs text-gray-400 uppercase tracking-wider bg-[#1c1c21]">
            Task Name
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {timelineTasks.map(task => (
              <div key={`title-${task.id}`} className="h-12 border-b border-white/5 flex items-center px-4 text-sm font-semibold text-gray-300 truncate hover:bg-[#1f1f23] cursor-default transition-colors">
                {task.title}
              </div>
            ))}
          </div>
        </div>

        {/* 👉 Right Area (Timeline Grid) */}
        <div className="flex-1 overflow-auto custom-scrollbar relative bg-[#09090b]">

          {/* 📅 Dates Header */}
          <div className="flex h-14 border-b border-white/10 w-max sticky top-0 bg-[#1c1c21] z-30 shadow-md">
            {days.map(day => (
              <div key={day.toISOString()} className={`w-14 flex-shrink-0 flex flex-col items-center justify-center border-r border-white/5 text-xs transition-colors ${
                isToday(day) 
                  ? 'bg-indigo-500/20 font-extrabold text-indigo-400 border-b-2 border-b-indigo-500' 
                  : 'text-gray-500 font-medium'
              }`}>
                <span className="uppercase text-[10px] mb-0.5">{format(day, 'EEE')}</span>
                <span className="text-sm">{format(day, 'dd')}</span>
              </div>
            ))}
          </div>

          <div className="relative w-max">
            
            {/* 📍 Current Time Indicator Line */}
            <div
              className="absolute top-0 bottom-0 w-[1px] bg-indigo-500 z-10 shadow-[0_0_8px_rgba(99,102,241,0.8)]"
              style={{
                left: `${days.findIndex(d => isToday(d)) * 56 + 28}px`,
                display: days.findIndex(d => isToday(d)) !== -1 ? 'block' : 'none'
              }}
            />

            {/* 📊 Timeline Rows & Bars */}
            {timelineTasks.map(task => {
              const taskStart = startOfDay(task.startDate ? new Date(task.startDate) : new Date(task.dueDate));
              const taskEnd = startOfDay(new Date(task.dueDate));

              const startOffset = differenceInDays(taskStart, monthStart);
              const duration = Math.max(1, differenceInDays(taskEnd, taskStart) + 1);
              
              const leftPos = startOffset * 56;
              const barWidth = duration * 56;

              return (
                <div key={`timeline-${task.id}`} className="h-12 border-b border-white/5 relative flex items-center w-full hover:bg-white/[0.02] transition-colors">
                  
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 flex pointer-events-none">
                    {days.map((_, i) => (
                       <div key={`grid-${i}`} className={`w-14 flex-shrink-0 border-r border-white/5 h-full ${i === days.findIndex(d => isToday(d)) ? 'bg-indigo-500/[0.03]' : ''}`} />
                    ))}
                  </div>

                  {/* Colored Task Bar */}
                  {(startOffset < days.length && startOffset + duration > 0) && (
                    <div
                      className={`absolute h-7 rounded-md shadow-sm opacity-90 transition-all hover:opacity-100 hover:scale-y-110 hover:shadow-[0_0_15px_rgba(0,0,0,0.5)] cursor-pointer border ${priorityColors[task.priority]} z-10 backdrop-blur-sm`}
                      style={{ left: `${Math.max(0, leftPos + 4)}px`, width: `${Math.max(16, barWidth - 8)}px` }}
                      title={`${task.title} | ${format(taskStart, 'MMM dd')} - ${format(taskEnd, 'MMM dd')}`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}