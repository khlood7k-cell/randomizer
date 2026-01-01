
import React from 'react';
import { Settings, ThemeColor, Language } from '../types';
import { X, Palette, Zap, RotateCw, Clock, Moon, Sun, Languages, Timer } from 'lucide-react';
import { Button } from './Button';
import { t } from '../translations';

interface SettingsModalProps {
  settings: Settings;
  onUpdate: (settings: Settings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ settings, onUpdate, onClose }) => {
  const lang = settings.language;
  const themes: { id: ThemeColor; class: string; label: string }[] = [
    { id: 'indigo', class: 'bg-indigo-600', label: lang === 'ar' ? 'أرجواني' : 'Indigo' },
    { id: 'rose', class: 'bg-rose-500', label: lang === 'ar' ? 'وردي' : 'Rose' },
    { id: 'emerald', class: 'bg-emerald-500', label: lang === 'ar' ? 'زمردي' : 'Emerald' },
    { id: 'amber', class: 'bg-amber-500', label: lang === 'ar' ? 'كهرماني' : 'Amber' },
    { id: 'violet', class: 'bg-violet-600', label: lang === 'ar' ? 'بنفسجي' : 'Violet' },
    { id: 'sky', class: 'bg-sky-500', label: lang === 'ar' ? 'سماوي' : 'Sky' },
    { id: 'pink', class: 'bg-pink-500', label: lang === 'ar' ? 'زهري' : 'Pink' },
    { id: 'orange', class: 'bg-orange-500', label: lang === 'ar' ? 'برتقالي' : 'Orange' },
    { id: 'slate', class: 'bg-slate-700', label: lang === 'ar' ? 'رمادي' : 'Slate' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t('settings.title', lang)}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Language Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200 font-semibold">
              <Languages size={18} className="text-slate-400" />
              <h3>{t('settings.language', lang)}</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdate({ ...settings, language: 'en' })}
                className={`p-3 rounded-2xl border-2 font-bold text-sm transition-all ${settings.language === 'en' ? 'border-theme bg-theme-light text-theme' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-500'}`}
              >
                English
              </button>
              <button
                onClick={() => onUpdate({ ...settings, language: 'ar' })}
                className={`p-3 rounded-2xl border-2 font-bold text-sm transition-all ${settings.language === 'ar' ? 'border-theme bg-theme-light text-theme' : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 text-slate-500'}`}
              >
                العربية
              </button>
            </div>
          </section>

          {/* Appearance Section */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200 font-semibold">
              <Sun size={18} className="text-slate-400" />
              <h3>{t('settings.appearance', lang)}</h3>
            </div>
            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl cursor-pointer group hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                {settings.isDarkMode ? <Moon size={18} className="text-indigo-400" /> : <Sun size={18} className="text-amber-400" />}
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{t('settings.darkMode', lang)}</p>
                  <p className="text-xs text-slate-400">{t('settings.darkModeDesc', lang)}</p>
                </div>
              </div>
              <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-slate-200 dark:bg-slate-700 transition-colors">
                <input 
                  type="checkbox" 
                  className="sr-only"
                  checked={settings.isDarkMode}
                  onChange={(e) => onUpdate({ ...settings, isDarkMode: e.target.checked })}
                />
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings.isDarkMode ? 'translate-x-6 rtl:-translate-x-6' : 'translate-x-1 rtl:-translate-x-1'}`} />
              </div>
            </label>
          </section>

          {/* Theme Selection */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200 font-semibold">
              <Palette size={18} className="text-slate-400" />
              <h3>{t('settings.themeColor', lang)}</h3>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdate({ ...settings, themeColor: t.id })}
                  className={`group relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                    settings.themeColor === t.id 
                      ? 'border-[var(--theme-color)] bg-[var(--theme-color-light)]' 
                      : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${t.class} shadow-sm group-hover:scale-110 transition-transform`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${settings.themeColor === t.id ? 'text-[var(--theme-color)]' : 'text-slate-500'}`}>{t.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Behavior Toggles */}
          <section className="space-y-4">
            <div className="flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200 font-semibold">
              <Zap size={18} className="text-slate-400" />
              <h3>{t('settings.behavior', lang)}</h3>
            </div>
            
            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl cursor-pointer group hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <RotateCw size={18} className="text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{t('settings.autoReset', lang)}</p>
                  <p className="text-xs text-slate-400">{t('settings.autoResetDesc', lang)}</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.autoResetPool}
                onChange={(e) => onUpdate({ ...settings, autoResetPool: e.target.checked })}
                className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl cursor-pointer group hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <Clock size={18} className="text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{t('settings.showTimestamps', lang)}</p>
                  <p className="text-xs text-slate-400">{t('settings.showTimestampsDesc', lang)}</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.showTimestamps}
                onChange={(e) => onUpdate({ ...settings, showTimestamps: e.target.checked })}
                className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-700"
              />
            </label>

            {/* Global Timer Toggle */}
            <label className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl cursor-pointer group hover:bg-white dark:hover:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex items-center gap-3">
                <Timer size={18} className="text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-700 dark:text-slate-200 text-sm">{t('settings.showTimer', lang)}</p>
                  <p className="text-xs text-slate-400">{t('settings.showTimerDesc', lang)}</p>
                </div>
              </div>
              <input 
                type="checkbox" 
                checked={settings.showGlobalTimer}
                onChange={(e) => onUpdate({ ...settings, showGlobalTimer: e.target.checked })}
                className="w-5 h-5 rounded-lg border-slate-300 dark:border-slate-600 text-indigo-600 focus:ring-indigo-500 bg-white dark:bg-slate-700"
              />
            </label>
          </section>
        </div>

        <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800">
          <Button onClick={onClose} className="w-full py-4 rounded-2xl font-bold bg-theme text-white">
            {t('settings.save', lang)}
          </Button>
        </div>
      </div>
    </div>
  );
};
