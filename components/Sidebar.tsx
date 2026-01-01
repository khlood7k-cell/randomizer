
import React, { useState, useRef, useEffect } from 'react';
import { ListData, ViewMode, Settings } from '../types';
import { Button } from './Button';
import { Plus, Trash2, Settings as SettingsIcon, PanelLeftClose, X, Check, GitMerge, Dice5, Calendar, Home, HelpCircle, Pencil, PanelRightClose } from 'lucide-react';
import { t } from '../translations';

interface SidebarProps {
  lists: ListData[];
  activeId: string | null;
  isOpen: boolean;
  onToggle: () => void;
  onSelect: (id: string) => void;
  onCreate: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string | ListData, listOrTitle?: ListData) => void;
  onOpenSettings: () => void;
  onOpenMerge: () => void;
  onSelectMode: (mode: ViewMode) => void;
  viewMode: ViewMode;
  settings: Settings;
}

const SidebarItem: React.FC<{
  list: ListData;
  isActive: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (list: ListData) => void;
  lang: string;
}> = ({ list, isActive, onSelect, onDelete, onUpdate, lang }) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(list.title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleRename = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (editValue.trim() && editValue !== list.title) {
      onUpdate({ ...list, title: editValue.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div 
      className={`group relative flex items-center justify-between px-3 py-3 rounded-lg cursor-pointer transition-all ${
        isActive 
          ? 'bg-theme-light text-[var(--theme-color)]' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
      }`}
      onClick={() => !isConfirming && !isEditing && onSelect(list.id)}
    >
      <div className="flex items-center gap-3 overflow-hidden flex-1">
        <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isActive ? 'bg-[var(--theme-color)]' : 'bg-slate-300 dark:bg-slate-700'}`} />
        {isEditing ? (
          <form onSubmit={handleRename} className="flex-1" onClick={e => e.stopPropagation()}>
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={handleRename}
              className="w-full bg-white dark:bg-slate-800 border-none outline-none text-[12px] font-semibold py-0.5 px-1.5 rounded ring-1 ring-theme"
            />
          </form>
        ) : (
          <span className="truncate font-semibold text-[12px] tracking-tight">{list.title || (lang === 'ar' ? "بدون عنوان" : "Untitled")}</span>
        )}
      </div>

      <div className="flex items-center gap-1">
        {isConfirming ? (
          <div className="flex items-center gap-1.5">
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(list.id); setIsConfirming(false); }}
              className="p-1 bg-rose-500 text-white rounded hover:bg-rose-600"
            >
              <Check size={12} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsConfirming(false); }}
              className="p-1 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded"
            >
              <X size={12} />
            </button>
          </div>
        ) : (
          <>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
              className="p-1.5 text-slate-300 dark:text-slate-500 hover:text-theme rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title={t('sidebar.rename', lang as any)}
            >
              <Pencil size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); setIsConfirming(true); }}
              className="p-1.5 text-slate-300 dark:text-slate-500 hover:text-rose-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title={t('sidebar.delete', lang as any)}
            >
              <Trash2 size={14} />
            </button>
          </>
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
  onUpdate,
  onOpenSettings,
  onOpenMerge,
  onSelectMode,
  viewMode,
  settings,
}) => {
  const lang = settings.language;
  const isRtl = lang === 'ar';
  const isSingletonMode = viewMode === 'calendar';

  return (
    <>
      {isOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[1px] z-40 lg:z-30 transition-opacity" 
            onClick={onToggle} 
          />
      )}

      <div className={`w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col fixed top-0 z-50 transition-all duration-300 ${isRtl ? 'right-0 border-l border-r-0' : 'left-0'} ${isOpen ? 'translate-x-0' : (isRtl ? 'translate-x-full' : '-translate-x-full')}`}>
        <div className="p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => onSelectMode('welcome')} className="flex items-center gap-2 group">
              <div className="bg-theme p-1.5 rounded-md">
                <Home className="text-white w-3.5 h-3.5" />
              </div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">{t('sidebar.suite', lang)}</h1>
            </button>
            <button onClick={onToggle} className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md text-slate-400">
              {isRtl ? <PanelRightClose size={18} /> : <PanelLeftClose size={18} />}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 p-0.5 bg-slate-50 dark:bg-slate-800/50 rounded-lg mb-4">
            <button 
              onClick={() => onSelectMode('randomizer')}
              className={`py-1.5 rounded flex justify-center transition-all ${viewMode === 'randomizer' ? 'bg-white dark:bg-slate-700 shadow-sm text-theme' : 'text-slate-400 hover:text-slate-500'}`}
              title={t('welcome.randomizer', lang)}
            >
              <Dice5 size={14} />
            </button>
            <button 
              onClick={() => onSelectMode('question-test')}
              className={`py-1.5 rounded flex justify-center transition-all ${viewMode === 'question-test' ? 'bg-white dark:bg-slate-700 shadow-sm text-violet-500' : 'text-slate-400 hover:text-slate-500'}`}
              title={t('welcome.questionTest', lang)}
            >
              <HelpCircle size={14} />
            </button>
            <button 
              onClick={() => onSelectMode('calendar')}
              className={`py-1.5 rounded flex justify-center transition-all ${viewMode === 'calendar' ? 'bg-white dark:bg-slate-700 shadow-sm text-sky-500' : 'text-slate-400 hover:text-slate-500'}`}
              title={t('welcome.calendar', lang)}
            >
              <Calendar size={14} />
            </button>
          </div>

          {!isSingletonMode && (
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={onCreate} className="justify-start gap-2 bg-theme text-white border-none py-2 px-3 h-9" variant="primary">
                <Plus size={14} /><span className="text-xs">{t('sidebar.new', lang)}</span>
              </Button>
              <Button onClick={onOpenMerge} disabled={lists.length < 2} className="justify-start gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-none py-2 px-3 h-9 disabled:opacity-30" variant="secondary">
                <GitMerge size={14} /><span className="text-xs">{t('sidebar.merge', lang)}</span>
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
          {isSingletonMode ? (
            <div className="px-2 py-6 text-center">
               <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500`}>
                  <Calendar size={20} />
               </div>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                  {lang === 'ar' ? `وضع ${t(`welcome.${viewMode}`, lang)} النشط` : `Active ${t(`welcome.${viewMode}`, lang)} Mode`}
               </p>
            </div>
          ) : (
            <>
              <h2 className="px-2 text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-3">{t('sidebar.inventory', lang)}</h2>
              {lists.length === 0 ? (
                <div className="px-2 py-6 text-center"><p className="text-[11px] text-slate-400 italic">{t('sidebar.noLists', lang)}</p></div>
              ) : (
                lists.map((list) => <SidebarItem key={list.id} list={list} isActive={activeId === list.id} onSelect={onSelect} onDelete={onDelete} onUpdate={(updated) => onUpdate(updated.id, updated)} lang={lang} />)
              )}
            </>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button onClick={onOpenSettings} className="flex items-center gap-2 text-slate-500 hover:text-theme font-bold text-xs p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md transition-colors uppercase">
            <SettingsIcon size={14} />{t('sidebar.settings', lang)}
          </button>
          <p className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">V3.1</p>
        </div>
      </div>
    </>
  );
};
