import { useSearchParams } from 'react-router-dom';

const STATUSES = ['To Do', 'In Progress', 'In Review', 'Done'];
const PRIORITIES = ['Critical', 'High', 'Medium', 'Low'];

export default function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const toggleFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    const current = newParams.getAll(key);
    
    newParams.delete(key);
    const updated = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    updated.forEach(v => newParams.append(key, v));
    
    setSearchParams(newParams);
  };

  const clearAll = () => setSearchParams(new URLSearchParams());
  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-3 flex flex-wrap items-center gap-4 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] z-10 relative">
      <span className="text-sm font-extrabold text-gray-700">Filters:</span>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</span>
        {STATUSES.map(s => {
          const isActive = searchParams.getAll('status').includes(s);
          return (
            <button key={s} onClick={() => toggleFilter('status', s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${isActive ? 'bg-blue-100 border-blue-400 text-blue-800 font-bold shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
              {s}
            </button>
          )
        })}
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1"></div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Priority</span>
        {PRIORITIES.map(p => {
          const isActive = searchParams.getAll('priority').includes(p);
          return (
            <button key={p} onClick={() => toggleFilter('priority', p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${isActive ? 'bg-orange-100 border-orange-400 text-orange-800 font-bold shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}>
              {p}
            </button>
          )
        })}
      </div>

      {hasFilters && (
        <button onClick={clearAll} className="ml-auto text-xs font-bold text-red-500 hover:text-red-700 hover:underline transition-colors">
          Clear All Filters ✕
        </button>
      )}
    </div>
  );
}