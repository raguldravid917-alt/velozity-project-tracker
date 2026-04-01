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
    // 🖤 Dark Filter Bar
    <div className="bg-[#09090b] border-b border-white/5 px-6 py-3 flex flex-wrap items-center gap-4 z-10 relative">
      <span className="text-sm font-extrabold text-gray-300">Filters:</span>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Status</span>
        {STATUSES.map(s => {
          const isActive = searchParams.getAll('status').includes(s);
          return (
            <button key={s} onClick={() => toggleFilter('status', s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                  : 'bg-[#1c1c21] border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/30'
              }`}>
              {s}
            </button>
          )
        })}
      </div>

      {/* Divider */}
      <div className="w-px h-6 bg-white/10 mx-1"></div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Priority</span>
        {/* இங்கே தான் p-க்கு பதில் s என்று தப்பாக இருந்தது, இப்போது சரிசெய்யப்பட்டுவிட்டது! */}
        {PRIORITIES.map(p => {
          const isActive = searchParams.getAll('priority').includes(p);
          return (
            <button key={p} onClick={() => toggleFilter('priority', p)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-500/20 border-indigo-500 text-indigo-300 font-bold shadow-[0_0_10px_rgba(99,102,241,0.2)]' 
                  : 'bg-[#1c1c21] border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/30'
              }`}>
              {p}
            </button>
          )
        })}
      </div>

      {hasFilters && (
        <button onClick={clearAll} className="ml-auto text-xs font-bold text-red-400 hover:text-red-300 hover:underline transition-colors">
          Clear All Filters ✕
        </button>
      )}
    </div>
  );
}