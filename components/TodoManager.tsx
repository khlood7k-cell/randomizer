
import React, { useState, useRef, useEffect } from 'react';
import { ListData, NameItem, Settings } from '../types';
import { 
  Plus, 
  Trash2, 
  CheckCircle2,
  Clock,
  LayoutGrid,
  Circle,
  Trophy,
  PlusCircle,
  Pencil
} from 'lucide-react';

interface TodoManagerProps {
  list: ListData;
  settings: Settings;
  onUpdate: (updatedList: ListData) => void;
}

const PendingTask: React.FC<{
  item: NameItem;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateValue: (id: string, newValue: string) => void;
}> = ({ item, onToggle, onDelete, onUpdateValue }) => {
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
      onUpdateValue(item.id, editValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-3 p-3.5 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 group hover:border-theme/30 transition-all animate-in slide-in-from-left-2">
      <button onClick={() => onToggle(item.id)} className="text-slate-200 hover:text-theme transition-all flex-shrink-0">
        <Circle size={20} />
      </button>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onBlur={handleSave}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
            className="w-full bg-slate-50 dark:bg-slate-800 border-none outline-none text-sm font-semibold py-0.5 px-1 rounded ring-1 ring-theme"
          />
        ) : (
          <span className="font-bold text-slate-700 dark:text-slate-300 text-sm truncate block">{item.value}</span>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="p-1.5 text-slate-300 hover:text-theme rounded-lg hover:bg-theme/5">
            <Pencil size={14} />
          </button>
          <button onClick={() => onDelete(item.id)} className="p-1.5 text-slate-300 hover:text-rose-500 transition-all hover:bg-rose-50 dark:hover:bg-rose-900/10 rounded-lg">
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export const TodoManager: React.FC<TodoManagerProps> = ({ list, settings, onUpdate }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const completedItems = list.items.filter(item => item.isPicked);
  const pendingItems = list.items.filter(item => !item.isPicked);
  const progress = list.items.length === 0 ? 0 : Math.round((completedItems.length / list.items.length) * 100);

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

  const toggleItem = (id: string) => {
    onUpdate({
      ...list,
      items: list.items.map(item => 
        item.id === id ? { ...item, isPicked: !item.isPicked, pickedAt: !item.isPicked ? Date.now() : undefined } : item
      )
    });
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
    <div className="w-full space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex-1">
            <input 
              type="text"
              value={list.title}
              onChange={(e) => onUpdate({ ...list, title: e.target.value })}
              className="text-2xl font-bold text-slate-900 dark:text-white bg-transparent border-none outline-none focus:ring-0 w-full mb-1"
              placeholder="List Title..."
            />
            <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span className="flex items-center gap-1"><Clock size={12}/> {new Date(list.createdAt).toLocaleDateString()}</span>
              <span className="w-1 h-1 rounded-full bg-slate-200" />
              <span className="flex items-center gap-1"><LayoutGrid size={12}/> {list.items.length} Tasks</span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-1.5 min-w-[140px]">
            <div className="text-[10px] font-black text-slate-400">{progress}% Complete</div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-theme transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <form onSubmit={handleAddItem} className="relative group">
          <input 
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full pl-10 pr-24 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-theme outline-none text-sm font-semibold transition-all"
          />
          <PlusCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-theme transition-colors" size={18} />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-lg bg-theme text-white font-bold text-xs shadow-md hover:opacity-90 transition-all active:scale-95"
          >
            ADD TASK
          </button>
        </form>
      </div>

      <div className="space-y-2">
        {list.items.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center gap-3">
            <CheckCircle2 size={24} className="text-slate-200" />
            <p className="text-slate-400 font-bold text-sm">Clean slate. Add some tasks!</p>
          </div>
        ) : (
          <>
            <div className="space-y-1.5">
              {pendingItems.map((item) => (
                <PendingTask 
                  key={item.id} 
                  item={item} 
                  onToggle={toggleItem} 
                  onDelete={handleDeleteItem} 
                  onUpdateValue={handleUpdateItemValue} 
                />
              ))}
            </div>

            {completedItems.length > 0 && (
              <div className="pt-4 space-y-1.5">
                <h4 className="px-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                  <CheckCircle2 size={12} /> Finished
                </h4>
                {completedItems.map((item) => (
                  <div 
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/10 rounded-xl opacity-60 line-through group border border-transparent hover:border-slate-200 dark:hover:border-slate-800 transition-all"
                  >
                    <button onClick={() => toggleItem(item.id)} className="text-theme">
                      <CheckCircle2 size={20} />
                    </button>
                    <span className="flex-1 font-semibold text-slate-500 dark:text-slate-500 text-sm truncate">{item.value}</span>
                    <button onClick={() => handleDeleteItem(item.id)} className="p-1.5 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {progress === 100 && (
              <div className="p-8 text-center bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800/20 animate-in zoom-in-95 mt-6">
                <Trophy className="text-emerald-500 w-8 h-8 mx-auto mb-3" />
                <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-400">All done!</h3>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
