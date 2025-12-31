
import React, { useState, useRef, useEffect } from 'react';
import { ListData, NameItem, Settings } from '../types';
import { 
  Plus, 
  RefreshCw, 
  Dice5, 
  Trash, 
  Sparkles,
  Trophy,
  History,
  Target,
  X,
  Pencil,
  RotateCcw
} from 'lucide-react';
import { suggestNames } from '../services/geminiService';

interface ListManagerProps {
  list: ListData;
  settings: Settings;
  onUpdate: (updatedList: ListData) => void;
}

const PoolItem: React.FC<{
  item: NameItem;
  onDelete: (id: string) => void;
  onUpdate: (id: string, newValue: string) => void;
}> = ({ item, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(item.value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editValue.trim() && editValue !== item.value) {
      onUpdate(item.id, editValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="group flex items-center justify-between px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/30 rounded-md border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={e => e.key === 'Enter' && handleSave()}
          className="flex-1 bg-white dark:bg-slate-700 border-none outline-none text-[11px] font-semibold py-0.5 px-1 rounded ring-1 ring-theme"
        />
      ) : (
        <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate mr-2">{item.value}</span>
      )}
      
      {!isEditing && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="p-0.5 text-slate-300 hover:text-theme">
            <Pencil size={12} />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-0.5 text-slate-300 hover:text-rose-500">
            <Trash size={12} />
          </button>
        </div>
      )}
    </div>
  );
};

export const ListManager: React.FC<ListManagerProps> = ({ list, settings, onUpdate }) => {
  const [inputValue, setInputValue] = useState('');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<NameItem | null>(null);
  const [shuffleText, setShuffleText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  
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

  const handleSuggest = async () => {
    if (!list.title || list.title === "New Random List") return;
    setIsSuggesting(true);
    const suggestions = await suggestNames(list.title);
    const newItems = suggestions.map(val => ({
      id: crypto.randomUUID(),
      value: val,
      isPicked: false
    }));
    onUpdate({
      ...list,
      items: [...list.items, ...newItems]
    });
    setIsSuggesting(false);
  };

  const handlePickRandom = () => {
    if (availableItems.length === 0) {
      if (settings.autoResetPool) handleReset();
      return;
    }

    // Pick a winner instantly
    const finalWinner = availableItems[Math.floor(Math.random() * availableItems.length)];
    
    setWinner(finalWinner);
    setIsSpinning(false);
    
    onUpdate({
      ...list,
      items: list.items.map(item => 
        item.id === finalWinner.id ? { ...item, isPicked: true, pickedAt: Date.now() } : item
      )
    });
  };

  const handleReset = () => {
    onUpdate({
      ...list,
      items: list.items.map(item => ({ ...item, isPicked: false, pickedAt: undefined }))
    });
    setWinner(null);
  };

  const handleDeleteItem = (id: string) => {
    onUpdate({
      ...list,
      items: list.items.filter(item => item.id !== id)
    });
  };

  const handleUpdateItemValue = (id: string, newValue: string) => {
    onUpdate({
      ...list,
      items: list.items.map(item => item.id === id ? { ...item, value: newValue } : item)
    });
  };

  return (
    <div className="w-full space-y-3 max-w-xl mx-auto">
      {/* Mini Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex-1">
            <input 
              type="text"
              value={list.title}
              onChange={(e) => onUpdate({ ...list, title: e.target.value })}
              className="text-lg font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 w-full mb-0.5 p-0"
              placeholder="Topic..."
            />
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                <Target size={10} /> {availableItems.length} available
              </span>
              <button 
                onClick={handleSuggest}
                disabled={isSuggesting || !list.title}
                className="flex items-center gap-1 text-[8px] font-bold text-theme uppercase tracking-widest hover:opacity-70 disabled:opacity-30 transition-opacity"
              >
                <Sparkles size={10} /> {isSuggesting ? 'Thinking...' : 'AI Boost'}
              </button>
            </div>
          </div>
          <button 
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Compact Result Area */}
        <div className={`relative min-h-[110px] rounded-lg transition-all duration-300 border flex flex-col items-center justify-center px-4 py-4 ${isSpinning || winner ? 'bg-theme border-theme text-white' : 'bg-slate-50 dark:bg-slate-800/50 border-transparent'}`}>
          {isSpinning ? (
            <div className="text-center">
              <p className="text-white/60 text-[8px] font-bold uppercase tracking-widest mb-0.5">Picking...</p>
              <h2 className="text-2xl font-black italic truncate max-w-full">{shuffleText}</h2>
            </div>
          ) : winner ? (
            <div className="text-center animate-in zoom-in-95 duration-200 w-full">
               <div className="flex items-center justify-center gap-2 mb-0.5">
                  <Trophy size={14} className="text-white/90" />
                  <p className="text-white/80 text-[8px] font-bold uppercase tracking-widest">Selected</p>
               </div>
               <h2 className="text-3xl font-black italic tracking-tight truncate w-full mb-3">{winner.value}</h2>
               
               <div className="flex flex-col items-center gap-2">
                 <button 
                  onClick={handlePickRandom}
                  disabled={availableItems.length === 0}
                  className="px-8 py-2 bg-white text-theme rounded-lg font-bold text-xs shadow-md hover:brightness-105 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                 >
                  <RotateCcw size={14} /> PICK NEXT
                 </button>
               </div>
            </div>
          ) : (
            <button 
              onClick={handlePickRandom}
              disabled={availableItems.length === 0}
              className="w-full max-w-xs py-3 bg-theme text-white rounded-lg font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100 flex items-center justify-center gap-2"
            >
              <Dice5 size={14} /> PICK NAME
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Input & Pool Section */}
        <div className="space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800">
            <form onSubmit={handleAddItem} className="flex gap-1.5">
              <input 
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Add name..."
                className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-theme outline-none text-[11px] font-semibold"
              />
              <button type="submit" className="p-1.5 bg-theme text-white rounded-lg hover:brightness-110 active:scale-95 transition-all">
                <Plus size={16} strokeWidth={3} />
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-3 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col min-h-[200px] max-h-[400px]">
            <h3 className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
              <Dice5 size={10} /> Pool
            </h3>
            <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {availableItems.length === 0 ? (
                <div className="py-12 text-center opacity-30">
                  <p className="text-[9px] font-bold italic">Empty</p>
                </div>
              ) : (
                availableItems.map((item) => (
                  <PoolItem 
                    key={item.id} 
                    item={item} 
                    onDelete={handleDeleteItem} 
                    onUpdate={handleUpdateItemValue} 
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* History Section */}
        <div className="bg-slate-50 dark:bg-slate-900/40 rounded-xl p-3 border border-slate-200/50 dark:border-slate-800/50 h-full flex flex-col">
          <h3 className="text-[8px] font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-1.5">
            <History size={10} /> Log
          </h3>
          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-[450px] pr-1 custom-scrollbar">
            {pickedItems.length === 0 ? (
              <div className="py-12 text-center opacity-20">
                <p className="text-[9px] font-bold italic">No picks</p>
              </div>
            ) : (
              pickedItems.map((item, idx) => (
                <div key={item.id} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
                  <div className="w-5 h-5 bg-theme-light text-theme rounded flex items-center justify-center font-bold text-[9px]">
                    {pickedItems.length - idx}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-slate-800 dark:text-white truncate">{item.value}</p>
                    {settings.showTimestamps && item.pickedAt && (
                      <p className="text-[7px] text-slate-400 uppercase font-bold">
                        {new Date(item.pickedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                  </div>
                  {idx === 0 && <Trophy size={10} className="text-amber-400" />}
                </div>
              ))
            )}
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
