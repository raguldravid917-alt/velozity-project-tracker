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
    <div className="flex-1 flex gap-6 overflow-x-auto pb-4 h-full">
      {COLUMNS.map((status) => {
        const columnTasks = tasks.filter((t) => t.status === status);
        const isHovered = activeDropColumn === status;

        return (
          <div
            key={status}
            onDragOver={(e) => handleDragOver(e, status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, status)}
            className={`flex flex-col flex-shrink-0 w-[320px] bg-gray-100/80 rounded-2xl border-2 transition-all duration-200 ${
              isHovered ? 'border-blue-400 bg-blue-50/50 shadow-inner' : 'border-transparent'
            }`}
          >
            <div className="flex justify-between items-center p-4 mb-2">
              <h2 className="font-bold text-gray-700 text-sm uppercase tracking-wide">{status}</h2>
              <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {columnTasks.length === 0 ? (
                <div className="h-28 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 text-sm font-medium">
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