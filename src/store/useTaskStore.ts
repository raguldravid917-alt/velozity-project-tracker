import { create } from 'zustand';
import type { Task, Status } from '../utils/generateData';

interface TaskState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  updateTaskStatus: (taskId: string, newStatus: Status) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  
  setTasks: (tasks) => set({ tasks }),
  
  updateTaskStatus: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ),
    })),
}));