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
    Critical: 'bg-red-500',
    High: 'bg-orange-500',
    Medium: 'bg-yellow-400',
    Low: 'bg-green-500',
  };

  return (
    <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden h-full">
      <div className="flex flex-1 overflow-hidden">

        <div className="w-64 border-r border-gray-200 flex flex-col bg-gray-50 flex-shrink-0 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">
          <div className="h-14 border-b border-gray-200 flex items-center px-4 font-bold text-xs text-gray-500 uppercase tracking-wider bg-gray-100">
            Task Name
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {timelineTasks.map(task => (
              <div key={`title-${task.id}`} className="h-12 border-b border-gray-200 flex items-center px-4 text-sm font-semibold text-gray-700 truncate hover:bg-gray-100 cursor-default">
                {task.title}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar relative">

          <div className="flex h-14 border-b border-gray-200 w-max sticky top-0 bg-white z-30 shadow-sm">
            {days.map(day => (
              <div key={day.toISOString()} className={`w-14 flex-shrink-0 flex flex-col items-center justify-center border-r border-gray-200 text-xs ${isToday(day) ? 'bg-blue-50 font-extrabold text-blue-600 border-b-2 border-b-blue-600' : 'text-gray-500 font-medium'}`}>
                <span className="uppercase text-[10px] mb-0.5">{format(day, 'EEE')}</span>
                <span className="text-sm">{format(day, 'dd')}</span>
              </div>
            ))}
          </div>

          <div className="relative w-max">
            
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10 opacity-60"
              style={{
                left: `${days.findIndex(d => isToday(d)) * 56 + 28}px`,
                display: days.findIndex(d => isToday(d)) !== -1 ? 'block' : 'none'
              }}
            />

            {timelineTasks.map(task => {
              const taskStart = startOfDay(task.startDate ? new Date(task.startDate) : new Date(task.dueDate));
              const taskEnd = startOfDay(new Date(task.dueDate));

              const startOffset = differenceInDays(taskStart, monthStart);
              const duration = Math.max(1, differenceInDays(taskEnd, taskStart) + 1);
              
              const leftPos = startOffset * 56;
              const barWidth = duration * 56;

              return (
                <div key={`timeline-${task.id}`} className="h-12 border-b border-gray-100 relative flex items-center w-full hover:bg-gray-50 transition-colors">
                  <div className="absolute inset-0 flex pointer-events-none">
                    {days.map((_, i) => (
                       <div key={`grid-${i}`} className="w-14 flex-shrink-0 border-r border-gray-100 h-full" />
                    ))}
                  </div>

                  {(startOffset < days.length && startOffset + duration > 0) && (
                    <div
                      className={`absolute h-7 rounded-md shadow-sm ${priorityColors[task.priority]} opacity-90 transition-all hover:opacity-100 cursor-pointer border border-black/10`}
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