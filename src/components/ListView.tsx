import { useState, useMemo } from 'react';
import type { UIEvent } from 'react';
import { format } from 'date-fns';
import type { Status, Priority } from '../utils/generateData';
import { useFilteredTasks } from '../utils/useFilteredTasks';
import { useTaskStore } from '../store/useTaskStore';

const ROW_HEIGHT = 64;
const BUFFER = 5;

export default function ListView() {
  const { updateTaskStatus } = useTaskStore();
  const tasks = useFilteredTasks();
  const [scrollTop, setScrollTop] = useState(0);
  
  const [sortKey, setSortKey] = useState<'title' | 'priority' | 'dueDate' | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sortedTasks = useMemo(() => {
    if (!sortKey) return tasks;
    return [...tasks].sort((a, b) => {
    let aVal: any = a[sortKey];
    let bVal: any = b[sortKey];

      if (sortKey === 'priority') {
        const pOrder: Record<Priority, number> = { Critical: 1, High: 2, Medium: 3, Low: 4 };
        aVal = pOrder[a.priority as Priority];
        bVal = pOrder[b.priority as Priority];
      }

      if (aVal! < bVal!) return sortDir === 'asc' ? -1 : 1;
      if (aVal! > bVal!) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [tasks, sortKey, sortDir]);

  const viewportHeight = 800;
  const visibleCount = Math.ceil(viewportHeight / ROW_HEIGHT);
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(sortedTasks.length - 1, startIndex + visibleCount + 2 * BUFFER);

  const visibleTasks = sortedTasks.slice(startIndex, endIndex + 1);
  const totalHeight = sortedTasks.length * ROW_HEIGHT;
  const offsetY = startIndex * ROW_HEIGHT;

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleSort = (key: 'title' | 'priority' | 'dueDate') => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    // 🖤 Dark List Container
    <div className="flex-1 bg-[#121214] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col h-full">
      
      {/* Table Header */}
      <div className="flex bg-[#1c1c21] border-b border-white/10 px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
        <div className="w-1/2 cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => handleSort('title')}>
          Task Title {sortKey === 'title' && (sortDir === 'asc' ? '↑' : '↓')}
        </div>
        <div className="w-1/6 cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => handleSort('priority')}>
          Priority {sortKey === 'priority' && (sortDir === 'asc' ? '↑' : '↓')}
        </div>
        <div className="w-1/6">Status (Inline Edit)</div>
        <div className="w-1/6 cursor-pointer hover:text-indigo-400 transition-colors" onClick={() => handleSort('dueDate')}>
          Due Date {sortKey === 'dueDate' && (sortDir === 'asc' ? '↑' : '↓')}
        </div>
      </div>

      {/* Table Body */}
      <div 
        className="flex-1 overflow-y-auto custom-scrollbar"
        onScroll={handleScroll}
      >
        <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
          <div style={{ transform: `translateY(${offsetY}px)`, position: 'absolute', width: '100%' }}>
            {visibleTasks.map((task) => (
              // 🖤 Dark Row Hover
              <div key={task.id} className="flex items-center px-6 border-b border-white/5 hover:bg-[#18181b] transition-colors" style={{ height: `${ROW_HEIGHT}px` }}>
                <div className="w-1/2 font-semibold text-gray-200 text-sm">{task.title}</div>
                <div className="w-1/6">
                  {/* Dark Priority Badges */}
                  <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                    task.priority === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    task.priority === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                    task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                <div className="w-1/6">
                  {/* Dark Select Dropdown */}
                  <select 
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value as Status)}
                    className="text-xs font-semibold bg-[#1c1c21] text-gray-300 border border-white/10 rounded px-2 py-1.5 outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="To Do">To Do</option>
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
                <div className="w-1/6 text-sm text-gray-400 font-medium">
                  {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}