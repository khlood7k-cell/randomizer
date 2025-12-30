
import React, { useState } from 'react';
import { ListData } from '../types';
import { X, GitMerge, Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';

interface MergeModalProps {
  lists: ListData[];
  onMerge: (id1: string, id2: string, mode: 'add' | 'replace', newTitle: string) => void;
  onClose: () => void;
}

export const MergeModal: React.FC<MergeModalProps> = ({ lists, onMerge, onClose }) => {
  const [list1Id, setList1Id] = useState<string>(lists[0]?.id || '');
  const [list2Id, setList2Id] = useState<string>(lists[1]?.id || '');
  const [mode, setMode] = useState<'add' | 'replace'>('add');
  const [title, setTitle] = useState('Merged List');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!list1Id || !list2Id || list1Id === list2Id) return;
    onMerge(list1Id, list2Id, mode, title);
    onClose();
  };

  const isInvalidSelection = list1Id === list2Id || !list1Id || !list2Id;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-theme-light rounded-xl">
              <GitMerge size={20} className="text-theme" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Merge Lists</h2>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">First List</label>
              <select 
                value={list1Id}
                onChange={(e) => setList1Id(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-theme outline-none text-slate-800 dark:text-white transition-all"
              >
                {lists.map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Second List</label>
              <select 
                value={list2Id}
                onChange={(e) => setList2Id(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-theme outline-none text-slate-800 dark:text-white transition-all"
              >
                {lists.map(l => (
                  <option key={l.id} value={l.id}>{l.title}</option>
                ))}
              </select>
            </div>
          </div>

          {isInvalidSelection && (
            <p className="text-xs text-rose-500 font-medium px-1">Please select two different lists to merge.</p>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">New List Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter merged list name..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-theme outline-none text-slate-800 dark:text-white transition-all"
              required
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 ml-1">Merge Strategy</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setMode('add')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  mode === 'add' 
                    ? 'border-theme bg-theme-light text-theme' 
                    : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'
                }`}
              >
                <Plus size={20} />
                <div className="text-center">
                  <p className="text-sm font-bold">Add</p>
                  <p className="text-[10px] opacity-70">Keep original lists</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('replace')}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  mode === 'replace' 
                    ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-600' 
                    : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'
                }`}
              >
                <Trash2 size={20} />
                <div className="text-center">
                  <p className="text-sm font-bold">Replace</p>
                  <p className="text-[10px] opacity-70">Delete original lists</p>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              disabled={isInvalidSelection || !title.trim()}
              className="w-full py-4 rounded-2xl font-bold bg-theme text-white shadow-lg shadow-[var(--theme-color-light)]"
            >
              Complete Merge
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
