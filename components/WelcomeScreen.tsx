
import React from 'react';
import { Dice5, Calendar, Sparkles, Layout, HelpCircle } from 'lucide-react';
import { ViewMode, Settings } from '../types';
import { t } from '../translations';

interface WelcomeScreenProps {
  onSelectMode: (mode: ViewMode) => void;
  settings: Settings;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectMode, settings }) => {
  const lang = settings.language;
  const isRtl = lang === 'ar';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fcfdfe] dark:bg-slate-950 transition-colors duration-500" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="mb-12 text-center animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="inline-flex p-3 bg-theme-light rounded-2xl mb-4">
          <Sparkles className="text-theme w-8 h-8" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
          {t('welcome.title', lang)}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{t('welcome.subtitle', lang)}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl animate-in fade-in zoom-in-95 duration-700 delay-200 px-4">
        {/* Randomizer Card */}
        <button 
          onClick={() => onSelectMode('randomizer')}
          className="group relative flex flex-col p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 text-left transition-all hover:scale-[1.05] hover:shadow-2xl hover:border-theme/30"
          style={{ textAlign: isRtl ? 'right' : 'left' }}
        >
          <div className={`mb-6 p-5 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-theme transition-all ${isRtl ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`}>
            <Dice5 className="w-8 h-8 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('welcome.randomizer', lang)}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
            {t('welcome.randomizerDesc', lang)}
          </p>
          <div className="mt-auto flex items-center gap-2 text-theme font-bold text-xs">
            <span>{t('welcome.openTool', lang)}</span>
            <div className="w-4 h-0.5 bg-theme rounded-full group-hover:w-8 transition-all" />
          </div>
        </button>

        {/* Question Test Card */}
        <button 
          onClick={() => onSelectMode('question-test')}
          className="group relative flex flex-col p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 text-left transition-all hover:scale-[1.05] hover:shadow-2xl hover:border-violet-400/30"
          style={{ textAlign: isRtl ? 'right' : 'left' }}
        >
          <div className={`mb-6 p-5 bg-violet-50 dark:bg-violet-900/20 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-violet-500 transition-all ${isRtl ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`}>
            <HelpCircle className="w-8 h-8 text-violet-600 dark:text-violet-400 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('welcome.questionTest', lang)}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
            {t('welcome.questionTestDesc', lang)}
          </p>
          <div className="mt-auto flex items-center gap-2 text-violet-600 dark:text-violet-400 font-bold text-xs">
            <span>{t('welcome.startTest', lang)}</span>
            <div className="w-4 h-0.5 bg-violet-600 dark:bg-violet-400 rounded-full group-hover:w-8 transition-all" />
          </div>
        </button>

        {/* Calendar Card */}
        <button 
          onClick={() => onSelectMode('calendar')}
          className="group relative flex flex-col p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 text-left transition-all hover:scale-[1.05] hover:shadow-2xl hover:border-sky-400/30"
          style={{ textAlign: isRtl ? 'right' : 'left' }}
        >
          <div className={`mb-6 p-5 bg-sky-50 dark:bg-sky-900/20 rounded-2xl w-fit group-hover:scale-110 group-hover:bg-sky-500 transition-all ${isRtl ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`}>
            <Calendar className="w-8 h-8 text-sky-600 dark:text-sky-400 group-hover:text-white transition-colors" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{t('welcome.calendar', lang)}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
            {t('welcome.calendarDesc', lang)}
          </p>
          <div className="mt-auto flex items-center gap-2 text-sky-600 dark:text-sky-400 font-bold text-xs">
            <span>{t('welcome.getProductive', lang)}</span>
            <div className="w-4 h-0.5 bg-sky-600 dark:bg-sky-400 rounded-full group-hover:w-8 transition-all" />
          </div>
        </button>
      </div>

      <div className="mt-16 text-slate-400 dark:text-slate-600 flex items-center gap-2 animate-in fade-in duration-1000 delay-500">
        <Layout size={12} />
        <span className="text-[9px] font-bold uppercase tracking-widest">Version 3.1 Global Suite</span>
      </div>
    </div>
  );
};
