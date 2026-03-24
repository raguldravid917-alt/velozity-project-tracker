import { useEffect, useState } from 'react';
import { useTaskStore } from './store/useTaskStore';
import { generateTasks } from './utils/generateData';
import Navbar from './components/Navbar';
import FilterBar from './components/FilterBar';
import KanbanBoard from './components/KanbanBoard';
import ListView from './components/ListView';
import TimelineView from './components/TimelineView';

export default function App() {
  const { tasks, setTasks } = useTaskStore();
  const [activeView, setActiveView] = useState<'kanban' | 'list' | 'timeline'>('kanban');

  useEffect(() => {
    if (tasks.length === 0) {
      setTasks(generateTasks(500));
    }
  }, [tasks.length, setTasks]);

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden font-sans">
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      
      <FilterBar />
      
      <main className="flex-1 overflow-hidden p-6 flex flex-col bg-[#f4f5f7]">
        {activeView === 'kanban' && <KanbanBoard />}
        {activeView === 'list' && <ListView />}
        {activeView === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
}