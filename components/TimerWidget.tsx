
import React, { useState } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  Brain, 
  Coffee, 
  Settings2, 
  Check 
} from 'lucide-react';
import { Settings } from '../types';
import { t } from '../translations';

interface TimerWidgetProps {
  timeLeft: number;
  isActive: boolean;
  totalTime: number;
  onSetTime: (seconds: number) => void;
  onToggle: () => void;
  onReset: () => void;
  onClose: () => void;
  settings: Settings;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({ 
  timeLeft, 
  isActive, 
  totalTime, 
  onSetTime, 
  onToggle, 
  onReset, 
  onClose,
  settings 
}) => {
  const lang = settings.language;
  const [customMin, setCustomMin] = useState('25');
  const [customSec, setCustomSec] = useState('00');
  const [showCustom, setShowCustom] = useState(false);

  const modes = [
    { label: t('timer.pomodoro', lang), time: 25 * 60, icon: <Brain size={16} /> },
    { label: t('timer.shortBreak', lang), time: 5 * 60, icon: <Coffee size={16} /> },
    { label: t('timer.longBreak', lang), time: 15 * 60, icon: <Coffee size={16} /> },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseInt(customMin) || 0;
    const s = parseInt(customSec) || 0;
    if (m + s > 0) {
      onSetTime(m * 60 + s);
      setShowCustom(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 pointer-events-none">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 pointer-events-auto animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
             <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-xl">
                   <Brain size={18} />
                </div>
                <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-widest text-[10px]">{t('timer.globalToggle', lang)}</h3>
             </div>
             <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl">
               <X size={18} />
             </button>
          </div>

          <div className="flex flex-col items-center mb-8">
            <div className="relative w-48 aspect-square flex items-center justify-center mb-6">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" strokeWidth="4" fill="transparent" strokeDasharray="283%" strokeDashoffset={`${283 * (1 - progress / 100)}%`} strokeLinecap="round" className="text-rose-500 transition-all duration-1000 ease-linear" />
              </svg>
              <div className="flex flex-col items-center">
                 <span className="text-4xl font-black tabular-nums text-slate-800 dark:text-white">{formatTime(timeLeft)}</span>
                 <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{isActive ? 'Focus Active' : 'Idle'}</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={onReset} className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl hover:text-rose-500 transition-all">
                <RotateCcw size={20} />
              </button>
              <button onClick={onToggle} className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${isActive ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' : 'bg-rose-500 text-white shadow-rose-200 dark:shadow-rose-950/40'}`}>
                {isActive ? <Pause size={24} fill="currentColor" /> : <Play size={24} className="ml-1" fill="currentColor" />}
              </button>
              <button onClick={() => setShowCustom(!showCustom)} className={`p-3 rounded-2xl transition-all ${showCustom ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
                <Settings2 size={20} />
              </button>
            </div>
          </div>

          {showCustom ? (
             <form onSubmit={handleCustomSubmit} className="flex items-center gap-2 mb-6 animate-in slide-in-from-top-2">
                <div className="flex-1 flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
                  <input type="number" value={customMin} onChange={(e) => setCustomMin(e.target.value.slice(0, 3))} className="w-full bg-transparent text-center font-bold text-sm outline-none" placeholder="MM" />
                  <span className="text-slate-300">:</span>
                  <input type="number" value={customSec} onChange={(e) => setCustomSec(e.target.value.slice(0, 2))} className="w-full bg-transparent text-center font-bold text-sm outline-none" placeholder="SS" />
                </div>
                <button type="submit" className="p-3 bg-rose-500 text-white rounded-xl shadow-md"><Check size={18} strokeWidth={3} /></button>
             </form>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              {modes.map((m, i) => (
                <button 
                  key={i} 
                  onClick={() => onSetTime(m.time)} 
                  className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-all"
                >
                  {m.icon}
                  <span className="text-[8px] font-black uppercase tracking-widest">{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
