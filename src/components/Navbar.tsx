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
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-8">
        <h1 className="text-xl font-extrabold text-gray-800 tracking-tight">Velozity Tracker</h1>
        
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
          {['kanban', 'list', 'timeline'].map((view) => (
            <button
              key={view}
              onClick={() => setActiveView(view as any)}
              className={`px-4 py-1.5 rounded-md text-sm font-semibold capitalize transition-all duration-200 ${
                activeView === view 
                  ? 'bg-white shadow-sm text-blue-600' 
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className="text-sm text-gray-500 font-medium">
          {viewers} people are viewing this board
        </span>
        <div className="flex -space-x-2">
          {[...Array(viewers)].map((_, i) => (
            <div 
              key={i} 
              className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-sm" 
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