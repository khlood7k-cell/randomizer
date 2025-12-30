
import React, { useState } from 'react';
import { ListData } from '../types';
import { Button } from './Button';
import { Plus, List, Trash2, Settings as SettingsIcon, PanelLeftClose, X, Check, GitMerge } from 'lucide-react';

interface SidebarProps {
  lists: ListData[];
  activeId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onOpenSettings: () => void;
  onOpenMerge: () => void;
}

const SidebarItem: React.FC<{
  list: ListData;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ list, isActive, onSelect, onDelete }) => {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div 
      className={`group relative flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${
        isActive 
          ? 'bg-theme-light text-[var(--theme-color)] shadow-sm' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
      onClick={() => !isConfirming && onSelect(list.id)}
    >
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? 'bg-[var(--theme-color)]' : 'bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-400'}`} />
        <span className="truncate font-semibold text-sm">{list.title || "Untitled List"}</span>
      </div>

      <div className="flex items-center">
        {isConfirming ? (
          <div className="flex items-center gap-1 animate-in fade-in slide-in-from-right-2 duration-200">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete(list.id);
                setIsConfirming(false);
              }}
              className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors shadow-sm"
              title="Confirm Delete"
            >
              <Check size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsConfirming(false);
              }}
              className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              title="Cancel"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsConfirming(true);
            }}
            className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-900/20 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all"
            title="Delete this list"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ 
  lists, 
  activeId, 
  isOpen, 
  onToggle, 
  onSelect, 
  onCreate, 
  onDelete,
  onOpenSettings,
  onOpenMerge
}) => {
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 dark:bg-slate-950/40 backdrop-blur-sm z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <div className={`w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col fixed left-0 top-0 z-30 transition-all duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="bg-theme p-2 rounded-lg shadow-lg shadow-indigo-200 dark:shadow-none">
                <List className="text-white w-5 h-5" />
              </div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                Randomizer
              </h1>
            </div>
            <button 
              onClick={onToggle}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors"
              title="Close Menu"
            >
              <PanelLeftClose size={20} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onCreate} className="justify-start gap-2 shadow-sm bg-theme text-white border-none py-2.5 px-3" variant="primary">
              <Plus size={16} />
              <span className="text-sm">New</span>
            </Button>
            <Button 
              onClick={onOpenMerge} 
              disabled={lists.length < 2}
              className="justify-start gap-2 shadow-sm bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none py-2.5 px-3 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-30" 
              variant="secondary"
            >
              <GitMerge size={16} />
              <span className="text-sm">Merge</span>
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <h2 className="px-4 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">My Lists</h2>
          {lists.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-slate-400 dark:text-slate-500 italic">No lists yet.</p>
            </div>
          ) : (
            lists.map((list) => (
              <SidebarItem 
                key={list.id}
                list={list}
                isActive={activeId === list.id}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-900">
          <button 
            onClick={onOpenSettings}
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[var(--theme-color)] dark:hover:text-[var(--theme-color)] font-medium text-xs transition-colors p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg"
          >
            <SettingsIcon size={16} />
            Settings
          </button>
          <p className="text-[10px] text-slate-300 dark:text-slate-600 font-semibold tracking-tighter">V1.2</p>
        </div>
      </div>
    </>
  );
};
