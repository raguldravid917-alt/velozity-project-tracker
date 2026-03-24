import { useSearchParams } from 'react-router-dom';
import { useTaskStore } from '../store/useTaskStore';
import { useMemo } from 'react';

export function useFilteredTasks() {
  const { tasks } = useTaskStore();
  const [searchParams] = useSearchParams();

  const statuses = searchParams.getAll('status');
  const priorities = searchParams.getAll('priority');

  return useMemo(() => {
    return tasks.filter(task => {
      if (statuses.length > 0 && !statuses.includes(task.status)) return false;
      if (priorities.length > 0 && !priorities.includes(task.priority)) return false;
      return true;
    });
  }, [tasks, statuses, priorities]);
}