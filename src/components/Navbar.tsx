import { useState, useEffect } from 'react';

interface NavbarProps {
  activeView: 'kanban' | 'list' | 'timeline';
  setActiveView: (view: 'kanban' | 'list' | 'timeline') => void;
}

export default function Navbar({ activeView, setActiveView }: NavbarProps) {
  const [viewers, setViewers] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers(Math.floor(Math.random() * 3) + 2); 
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    // 🖤 Dark Navbar Background with subtle border
    <nav className="bg-[#121214] border-b border-white/10 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-extrabold text-white tracking-tight">Velozity Tracker</h1>
        
        {/* 🎛️ Dark Toggle Buttons */}
        <div className="flex space-x-1 bg-[#09090b] p-1 rounded-lg border border-white/10">
          {['kanban', 'list', 'timeline'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all duration-200 ${
                activeView === view 
                  ? 'bg-indigo-600 shadow-sm text-white' // Active button
                  : 'text-gray-400 hover:text-white hover:bg-white/5' // Inactive button
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-400 font-medium">
          {viewers} people are viewing this board
        </span>
        <div className="flex -space-x-2">
          {[...Array(viewers)].map((_, i) => (
            <div 
              key={i} 
              // Dark border around avatars to match navbar background
              className="w-8 h-8 rounded-full border-2 border-[#121214] flex items-center justify-center text-xs font-bold text-white shadow-sm" 
              style={{ backgroundColor: `hsl(${i * 60 + 200}, 70%, 50%)` }}
            >
              U{i + 1}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}