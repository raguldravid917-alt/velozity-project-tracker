import { addDays, subDays } from 'date-fns';

export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string; 
  startDate: string | null;
  dueDate: string;
}

const statuses: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const priorities: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const users = ['JD', 'AS', 'MK', 'SJ', 'RB', 'NK'];

export const generateTasks = (count: number = 500): Task[] => {
  const tasks: Task[] = [];
  const today = new Date();

  for (let i = 1; i <= count; i++) {
    const isOverdue = Math.random() > 0.8;
    const isDueToday = Math.random() > 0.9;
    const hasNoStartDate = Math.random() > 0.85;

    let dueDate = new Date();
    if (isOverdue) dueDate = subDays(today, Math.floor(Math.random() * 15) + 1);
    else if (!isDueToday) dueDate = addDays(today, Math.floor(Math.random() * 30) + 1);

    let startDate: Date | null = subDays(dueDate, Math.floor(Math.random() * 5) + 1);
    if (hasNoStartDate) startDate = null;

    tasks.push({
      id: `task-${i}`,
      title: `Project Task Optimization ${i}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee: users[Math.floor(Math.random() * users.length)],
      startDate: startDate ? startDate.toISOString() : null,
      dueDate: dueDate.toISOString(),
    });
  }
  return tasks;
};