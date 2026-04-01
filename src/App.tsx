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
    // 🌌 Deep Space Dark Background for entire App
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-indigo-500/30">
      <Navbar activeView={activeView} setActiveView={setActiveView} />
      
      <FilterBar />
      
      {/* 🖤 Main content area with pure dark background */}
      <main className="flex-1 overflow-hidden p-6 flex flex-col bg-[#09090b]">
        {activeView === 'kanban' && <KanbanBoard />}
        {activeView === 'list' && <ListView />}
        {activeView === 'timeline' && <TimelineView />}
      </main>
    </div>
  );
}