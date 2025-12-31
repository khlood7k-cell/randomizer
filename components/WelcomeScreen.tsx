
import React from 'react';
import { Dice5, CheckSquare, Sparkles, Layout, HelpCircle } from 'lucide-react';
import { ViewMode } from '../types';

interface WelcomeScreenProps {
  onSelectMode: (mode: ViewMode) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fcfdfe] dark:bg-slate-950 transition-colors duration-500">
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex p-3 bg-theme-light rounded-2xl mb-4">
          <Sparkles className="text-theme w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">
          Applications
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Select a tool to begin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl animate-in fade-in zoom-in-95 duration-700 delay-200">
        {/* Randomizer Card */}
        <button 
          onClick={() => onSelectMode('randomizer')}
          className="group relative flex flex-col p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 text-left transition-all hover:scale-[1.02] hover:shadow-xl hover:border-theme/30"
        >
          <div className="mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl w-fit group-hover:scale-110 group-hover:bg-theme transition-all">
            <Dice5 className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Randomizer</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-4">
            Pick names or items by chance. Effortless and beautiful.
          </p>
          <div className="mt-auto flex items-center gap-2 text-theme font-bold text-xs">
            <span>Open Tool</span>
            <div className="w-4 h-0.5 bg-theme rounded-full group-hover:w-8 transition-all" />
          </div>
        </button>

        {/* Question Test Card */}
        <button 
          onClick={() => onSelectMode('question-test')}
          className="group relative flex flex-col p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 text-left transition-all hover:scale-[1.02] hover:shadow-xl hover:border-violet-400/30"
        >
          <div className="mb-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl w-fit group-hover:scale-110 group-hover:bg-violet-500 transition-all">
            <HelpCircle className="w-6 h-6 text-violet-600 dark:text-violet-400 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Question Tests</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-4">
            Add questions and answers. Test your knowledge randomly.
          </p>
          <div className="mt-auto flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-xs">
            <span>Start Test</span>
            <div className="w-4 h-0.5 bg-violet-600 dark:bg-violet-400 rounded-full group-hover:w-8 transition-all" />
          </div>
        </button>

        {/* To-Do List Card */}
        <button 
          onClick={() => onSelectMode('todo')}
          className="group relative flex flex-col p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 text-left transition-all hover:scale-[1.02] hover:shadow-xl hover:border-emerald-400/30"
        >
          <div className="mb-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl w-fit group-hover:scale-110 group-hover:bg-emerald-500 transition-all">
            <CheckSquare className="w-6 h-6 text-emerald-600 dark:text-emerald-400 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">To-Do List</h2>
          <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed mb-4">
            Elegant task tracking and productivity focus.
          </p>
          <div className="mt-auto flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <span>Get Productive</span>
            <div className="w-4 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full group-hover:w-8 transition-all" />
          </div>
        </button>
      </div>

      <div className="mt-16 text-slate-400 dark:text-slate-600 flex items-center gap-2 animate-in fade-in duration-1000 delay-500">
        <Layout size={12} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Version 2.4 Suite</span>
      </div>
    </div>
  );
};
