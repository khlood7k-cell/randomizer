
import React, { useState, useMemo } from 'react';
import { ListData, NameItem, Settings } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Star, 
  CheckCircle2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { t } from '../translations';

interface CalendarManagerProps {
  list: ListData;
  settings: Settings;
  onUpdate: (updatedList: ListData) => void;
}

// Helper to get date string for Saudi Arabia (Asia/Riyadh)
const getSaudiDateStr = (date: Date = new Date()) => {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
};

// Helper to get current Date object in Saudi Arabia context
const getSaudiCurrentDate = () => {
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  });
  return new Date(formatter.format(new Date()));
};

export const CalendarManager: React.FC<CalendarManagerProps> = ({ list, settings, onUpdate }) => {
  const lang = settings.language;
  const isRtl = lang === 'ar';
  
  // Initialize with Saudi Arabia's current time context
  const [viewDate, setViewDate] = useState(getSaudiCurrentDate());
  const [selectedDate, setSelectedDate] = useState<Date>(getSaudiCurrentDate());
  const [taskInput, setTaskInput] = useState('');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Tasks for the selected day
  const selectedDateStr = getSaudiDateStr(selectedDate);
  const dayTasks = list.items.filter(item => item.date === selectedDateStr);
  const isDayHighlighted = list.highlights?.includes(selectedDateStr) || false;

  const handlePrevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskInput.trim()) return;

    const newTask: NameItem = {
      id: crypto.randomUUID(),
      value: taskInput.trim(),
      date: selectedDateStr,
      isPicked: false
    };

    onUpdate({
      ...list,
      items: [...list.items, newTask]
    });
    setTaskInput('');
  };

  const toggleTask = (id: string) => {
    onUpdate({
      ...list,
      items: list.items.map(item => 
        item.id === id ? { ...item, isPicked: !item.isPicked } : item
      )
    });
  };

  const deleteTask = (id: string) => {
    onUpdate({
      ...list,
      items: list.items.filter(item => item.id !== id)
    });
  };

  const toggleHighlight = () => {
    const highlights = list.highlights || [];
    const newHighlights = highlights.includes(selectedDateStr)
      ? highlights.filter(d => d !== selectedDateStr)
      : [...highlights, selectedDateStr];

    onUpdate({
      ...list,
      highlights: newHighlights
    });
  };

  const monthName = new Intl.DateTimeFormat(lang, { month: 'long' }).format(viewDate);
  const weekDays = [...Array(7)].map((_, i) => 
    new Intl.DateTimeFormat(lang, { weekday: 'short' }).format(new Date(2021, 0, 3 + i))
  );

  const gridCells = useMemo(() => {
    const cells = [];
    // Padding for first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push({ type: 'empty', key: `empty-${i}` });
    }
    
    const todayStr = getSaudiDateStr(); // Today in Saudi Arabia

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dStr = getSaudiDateStr(d);
      const hasTasks = list.items.some(item => item.date === dStr);
      const isHighlighted = list.highlights?.includes(dStr);
      const isToday = todayStr === dStr;
      const isSelected = getSaudiDateStr(selectedDate) === dStr;

      cells.push({
        type: 'day',
        date: d,
        dateStr: dStr,
        dayNum: i,
        hasTasks,
        isHighlighted,
        isToday,
        isSelected,
        key: `day-${i}`
      });
    }
    return cells;
  }, [year, month, list.items, list.highlights, selectedDate]);

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-500">
      
      {/* Calendar Grid Section */}
      <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-theme-light rounded-2xl text-theme">
              <CalendarIcon size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800 dark:text-white capitalize">{monthName} {year}</h2>
              <div className="flex items-center gap-2">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{list.title}</p>
                 <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                 <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Timezone: Saudi Arabia (AST)</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handlePrevMonth} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
              {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
            <button onClick={handleNextMonth} className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
              {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-4">
          {weekDays.map((day, i) => (
            <div key={i} className="text-center text-[10px] font-black text-slate-400 uppercase tracking-wider py-2">{day}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {gridCells.map((cell) => {
            if (cell.type === 'empty') return <div key={cell.key} />;

            return (
              <button
                key={cell.key}
                onClick={() => setSelectedDate(cell.date)}
                className={`
                  relative aspect-square rounded-2xl flex flex-col items-center justify-center transition-all group
                  ${cell.isSelected ? 'bg-theme text-white shadow-lg shadow-theme/30 scale-105 z-10' : 
                    cell.isHighlighted ? 'bg-theme-light text-theme' : 
                    'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'}
                  ${cell.isToday && !cell.isSelected ? 'ring-2 ring-theme/30 ring-inset' : ''}
                `}
              >
                <span className={`text-sm font-bold ${cell.isSelected ? 'text-white' : ''}`}>
                  {cell.dayNum}
                </span>
                
                <div className="absolute bottom-2 flex gap-1">
                  {cell.hasTasks && (
                    <div className={`w-1 h-1 rounded-full ${cell.isSelected ? 'bg-white/60' : 'bg-theme'}`} />
                  )}
                  {cell.isHighlighted && !cell.isSelected && (
                    <div className="w-1 h-1 rounded-full bg-theme" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side Management Panel */}
      <div className="lg:col-span-4 space-y-4 flex flex-col">
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-xl border border-slate-100 dark:border-slate-800 flex-1 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-black text-slate-800 dark:text-white">
                {new Intl.DateTimeFormat(lang, { day: 'numeric', month: 'long' }).format(selectedDate)}
              </h3>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {t('calendar.tasks', lang, { date: '' }).replace('{}', '')}
              </p>
            </div>
            <button 
              onClick={toggleHighlight}
              className={`p-2 rounded-xl transition-all ${isDayHighlighted ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-amber-500'}`}
              title={isDayHighlighted ? t('calendar.removeHighlight', lang) : t('calendar.highlight', lang)}
            >
              {isDayHighlighted ? <Star fill="currentColor" size={20} /> : <Star size={20} />}
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar pr-1 mb-6">
            {dayTasks.length === 0 ? (
              <div className="py-12 text-center opacity-30 flex flex-col items-center gap-2">
                <CheckCircle2 size={32} />
                <p className="text-[11px] font-bold italic">{t('calendar.noTasks', lang)}</p>
              </div>
            ) : (
              dayTasks.map(task => (
                <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl group animate-in slide-in-from-right-2">
                  <button 
                    onClick={() => toggleTask(task.id)}
                    className={`transition-colors ${task.isPicked ? 'text-theme' : 'text-slate-300 hover:text-theme'}`}
                  >
                    <CheckCircle2 size={18} fill={task.isPicked ? 'currentColor' : 'none'} />
                  </button>
                  <span className={`flex-1 text-xs font-bold truncate ${task.isPicked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {task.value}
                  </span>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddTask} className="relative">
            <input 
              type="text"
              value={taskInput}
              onChange={(e) => setTaskInput(e.target.value)}
              placeholder={t('calendar.placeholder', lang)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-theme outline-none text-xs font-bold transition-all pr-12"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-theme text-white rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all">
              <Plus size={16} strokeWidth={3} />
            </button>
          </form>
        </div>

        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Monthly Items</span>
            <span className="text-xs font-black text-theme bg-theme-light px-2 py-0.5 rounded-full">{list.items.length}</span>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}</style>
    </div>
  );
};
