import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import type { Status } from '../utils/generateData';
import KanbanCard from './KanbanCard';
import { useFilteredTasks } from '../utils/useFilteredTasks';

const COLUMNS: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export default function KanbanBoard() {
  const { updateTaskStatus } = useTaskStore();
  const tasks = useFilteredTasks();
  const [activeDropColumn, setActiveDropColumn] = useState<Status | null>(null);

  const handleDragOver = (e: React.DragEvent, status: Status) => {
    e.preventDefault(); 
    setActiveDropColumn(status);
  };

  const handleDragLeave = () => {
    setActiveDropColumn(null);
  };

  const handleDrop = (e: React.DragEvent, status: Status) => {
    e.preventDefault();
    setActiveDropColumn(null);
    const taskId = e.dataTransfer.getData('taskId');
    
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
  };

  return (
    <div className="flex-1 flex gap-6 overflow-x-auto pb-8 h-full items-start">
      {COLUMNS.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        const isHovered = activeDropColumn === status;

        return (
          // 🖤 Sleek Dark Column
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
            className={`flex flex-col flex-shrink-0 w-[320px] rounded-2xl border transition-all duration-300 ${
              isHovered 
                ? 'bg-[#18181b] border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] scale-[1.02]' // Dragging highlight
                : 'bg-[#121214] border-white/10' // Normal dark state
            }`}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center p-4 mb-2 border-b border-white/5">
              <h2 className="font-bold text-gray-300 tracking-wider text-sm uppercase">
                {status}
              </h2>
              <span className="bg-white/5 text-gray-400 text-xs font-bold px-3 py-1 rounded-full border border-white/10">
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks Area */}
            <div className="flex-1 overflow-y-auto px-3 pb-4 pt-2 space-y-3">
              {columnTasks.length === 0 ? (
                // 👻 Dark Empty State
                <div className="h-24 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-gray-500 text-sm font-medium">
                  No tasks here
                </div>
              ) : (
                columnTasks.map((task) => (
                  <KanbanCard key={task.id} task={task} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}