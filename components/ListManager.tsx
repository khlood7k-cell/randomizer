
import React, { useState, useRef } from 'react';
import { ListData, NameItem, Settings } from '../types';
import { Button } from './Button';
import { 
  RotateCcw, 
  Dice5, 
  Plus, 
  Sparkles, 
  Trash2, 
  CheckCircle2,
  Clock,
  LayoutGrid
} from 'lucide-react';

interface ListManagerProps {
  list: ListData;
  settings: Settings;
  onUpdate: (updatedList: ListData) => void;
}

export const ListManager: React.FC<ListManagerProps> = ({ list, settings, onUpdate }) => {
  const [inputValue, setInputValue] = useState('');
  const [picking, setPicking] = useState(false);
  const [lastPicked, setLastPicked] = useState<NameItem | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const availableItems = list.items.filter(item => !item.isPicked);
  const pickedItems = list.items.filter(item => item.isPicked).sort((a, b) => (b.pickedAt || 0) - (a.pickedAt || 0));

  const handleAddItem = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    const newItem: NameItem = {
      id: crypto.randomUUID(),
      value: inputValue.trim(),
      isPicked: false
    };

    onUpdate({
      ...list,
      items: [...list.items, newItem]
    });
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleTitleChange = (newTitle: string) => {
    onUpdate({ ...list, title: newTitle });
  };

  const handlePickRandom = () => {
    if (availableItems.length === 0) return;
    
    setPicking(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * availableItems.length);
      const chosenItem = availableItems[randomIndex];

      const updatedItems = list.items.map(item => 
        item.id === chosenItem.id 
          ? { ...item, isPicked: true, pickedAt: Date.now() } 
          : item
      );

      setLastPicked({ ...chosenItem, isPicked: true, pickedAt: Date.now() });
      onUpdate({ ...list, items: updatedItems });
      setPicking(false);

      const remainingPoolCount = availableItems.length - 1;
      if (settings.autoResetPool && remainingPoolCount === 0) {
        setTimeout(() => {
          handleRestart(true);
        }, 2000);
      }
    }, 800);
  };

  const handleRestart = (isAuto: boolean = false) => {
    const updatedItems = list.items.map(item => ({ ...item, isPicked: false, pickedAt: undefined }));
    onUpdate({ ...list, items: updatedItems });
    if (!isAuto) setLastPicked(null);
  };

  const handleDeleteItem = (id: string) => {
    onUpdate({
      ...list,
      items: list.items.filter(item => item.id !== id)
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header & Main Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 lg:p-10 shadow-xl shadow-slate-200/40 dark:shadow-none border border-slate-100 dark:border-slate-800 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10">
          <div className="flex-1">
            <input 
              type="text"
              value={list.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="List Title..."
              className="text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 placeholder:text-slate-200 dark:placeholder:text-slate-700 w-full mb-3"
            />
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 dark:text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock size={16} className="text-slate-300 dark:text-slate-600" />
                Created {new Date(list.createdAt).toLocaleDateString()}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700" />
              <span className="flex items-center gap-1.5">
                <LayoutGrid size={16} className="text-slate-300 dark:text-slate-600" />
                {availableItems.length} items left
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              variant="secondary" 
              onClick={() => handleRestart()}
              className="gap-2 px-6 py-3 rounded-2xl dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 hover:dark:bg-slate-700"
              title="Return all picked items to the pool"
            >
              <RotateCcw size={18} />
              Reset All
            </Button>
            <button 
              onClick={handlePickRandom}
              disabled={availableItems.length === 0 || picking}
              className={`inline-flex items-center justify-center gap-2 px-10 py-4 rounded-2xl shadow-xl text-lg font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed bg-theme shadow-[var(--theme-color-light)]`}
            >
              {picking ? (
                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                   <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                   <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
              ) : <Dice5 size={22} />}
              Pick Winner
            </button>
          </div>
        </div>

        {/* Winner Spotlight */}
        {lastPicked && !picking && (
          <div className="mb-10 p-8 rounded-[1.5rem] text-white shadow-2xl animate-in zoom-in-95 duration-300 bg-theme">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] opacity-80">The Result is In</p>
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <h3 className="text-4xl lg:text-6xl font-black">{lastPicked.value}</h3>
          </div>
        )}

        {/* Add Item Input */}
        <form onSubmit={handleAddItem} className="flex gap-3">
          <div className="flex-1">
            <input 
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Add new item..."
              className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl focus:ring-2 focus:ring-[var(--theme-color)] focus:bg-white dark:focus:bg-slate-800 transition-all outline-none text-lg text-slate-800 dark:text-white"
            />
          </div>
          <button 
            type="submit" 
            className="px-8 rounded-2xl bg-theme text-white hover:opacity-90 transition-all flex items-center justify-center shadow-lg active:scale-95"
          >
            <Plus size={24} />
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
        {/* Available Items */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm min-h-[500px]">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-8 flex items-center gap-3">
            Available Pool
            <span className="px-3 py-1 bg-theme-light text-theme text-xs font-bold rounded-full">
              {availableItems.length}
            </span>
          </h3>
          
          <div className="grid grid-cols-1 gap-3">
            {availableItems.length === 0 ? (
              <div className="py-20 text-center text-slate-300 dark:text-slate-700 flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center">
                  <Dice5 size={32} className="opacity-20" />
                </div>
                <div>
                  <p className="text-lg font-medium">Pool is empty</p>
                  <p className="text-sm">Click reset to restart the cycle</p>
                </div>
              </div>
            ) : (
              availableItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-2xl group hover:border-[var(--theme-color)] dark:hover:border-[var(--theme-color)] hover:bg-white dark:hover:bg-slate-800 hover:shadow-md transition-all duration-200"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300 text-lg">{item.value}</span>
                  <button 
                    onClick={() => handleDeleteItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Removed/Picked Items */}
        <div className="bg-white/40 dark:bg-slate-900/40 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-inner min-h-[500px] backdrop-blur-sm">
          <h3 className="text-xl font-bold text-slate-400 dark:text-slate-600 mb-8 flex items-center gap-3">
            Selected
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs font-bold rounded-full">
              {pickedItems.length}
            </span>
          </h3>

          <div className="grid grid-cols-1 gap-3">
            {pickedItems.length === 0 ? (
              <div className="py-20 text-center text-slate-300 dark:text-slate-700 italic">
                <p>No selections yet.</p>
              </div>
            ) : (
              pickedItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-800/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-slate-300 dark:text-slate-700 flex-shrink-0" />
                    <span className="font-medium text-slate-500 dark:text-slate-400 line-through text-lg truncate">{item.value}</span>
                  </div>
                  {item.pickedAt && settings.showTimestamps && (
                    <span className="text-xs text-slate-400 dark:text-slate-600 whitespace-nowrap ml-4">
                      {new Date(item.pickedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
