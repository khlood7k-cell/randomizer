
import React, { useState, useEffect, useRef } from 'react';
import { ListData, Settings } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Timer as TimerIcon,
  Bell,
  Coffee,
  Brain,
  Settings2,
  Check
} from 'lucide-react';
import { t } from '../translations';

interface TimerManagerProps {
  list: ListData;
  settings: Settings;
  onUpdate: (updatedList: ListData) => void;
}

type TimerMode = 'pomodoro' | 'short' | 'long' | 'custom';

export const TimerManager: React.FC<TimerManagerProps> = ({ list, settings }) => {
  const lang = settings.language;
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalTime, setTotalTime] = useState(25 * 60);
  
  // Custom time state
  const [customMin, setCustomMin] = useState('25');
  const [customSec, setCustomSec] = useState('00');
  
  const timerRef = useRef<number | null>(null);

  const modes = {
    pomodoro: { label: t('timer.pomodoro', lang), time: 25 * 60, icon: <Brain size={18} /> },
    short: { label: t('timer.shortBreak', lang), time: 5 * 60, icon: <Coffee size={18} /> },
    long: { label: t('timer.longBreak', lang), time: 15 * 60, icon: <Coffee size={18} /> },
    custom: { label: lang === 'ar' ? 'مخصص' : 'Custom', time: 0, icon: <Settings2 size={18} /> },
  };

  const sendNotification = () => {
    if (!("Notification" in window)) return;

    const title = t('timer.finished', lang);
    const options = {
      body: lang === 'ar' ? 'انتهت جلسة التركيز الخاصة بك!' : 'Your focus session is complete!',
      icon: '/favicon.ico', // Fallback icon
      silent: false,
    };

    if (Notification.permission === "granted") {
      new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, options);
        }
      });
    }
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      sendNotification();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, lang]);

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    if (newMode !== 'custom') {
      const newTime = modes[newMode].time;
      setTimeLeft(newTime);
      setTotalTime(newTime);
    }
  };

  const handleSetCustomTime = (e: React.FormEvent) => {
    e.preventDefault();
    const m = parseInt(customMin) || 0;
    const s = parseInt(customSec) || 0;
    const newTotal = (m * 60) + s;
    if (newTotal > 0) {
      setTimeLeft(newTotal);
      setTotalTime(newTotal);
      setIsActive(false);
    }
  };

  const toggleTimer = () => {
    // Request notification permission on first interaction
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (mode === 'custom') {
      const m = parseInt(customMin) || 0;
      const s = parseInt(customSec) || 0;
      setTimeLeft((m * 60) + s);
    } else {
      setTimeLeft(modes[mode].time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-6 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center">
        
        {/* Mode Toggles */}
        <div className="flex flex-wrap justify-center bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl gap-1 mb-8 w-full max-w-sm">
          {(Object.keys(modes) as TimerMode[]).map((m) => (
            <button
              key={m}
              onClick={() => switchMode(m)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                mode === m 
                  ? 'bg-theme text-white shadow-sm scale-105' 
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              {modes[m].icon}
              {modes[m].label}
            </button>
          ))}
        </div>

        {/* Custom Input Area */}
        {mode === 'custom' && (
          <form onSubmit={handleSetCustomTime} className="flex items-center gap-2 mb-8 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700">
              <input 
                type="number" 
                max="999"
                value={customMin}
                onChange={(e) => setCustomMin(e.target.value.slice(0, 3))}
                className="w-12 bg-transparent text-center font-black text-slate-800 dark:text-white focus:outline-none"
                placeholder="MM"
              />
              <span className="text-slate-400 font-bold">:</span>
              <input 
                type="number"
                max="59"
                value={customSec}
                onChange={(e) => setCustomSec(e.target.value.slice(0, 2))}
                className="w-12 bg-transparent text-center font-black text-slate-800 dark:text-white focus:outline-none"
                placeholder="SS"
              />
            </div>
            <button 
              type="submit"
              className="p-3 bg-theme text-white rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
            >
              <Check size={20} strokeWidth={3} />
            </button>
          </form>
        )}

        {/* Circular Timer Visual */}
        <div className="relative w-full max-w-[280px] aspect-square mb-10 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90 p-1 overflow-visible">
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800/50"
            />
            <circle
              cx="50%"
              cy="50%"
              r="45%"
              stroke="currentColor"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray="283%" 
              strokeDashoffset={`${283 * (1 - progress / 100)}%`}
              strokeLinecap="round"
              className="text-theme transition-all duration-1000 ease-linear"
              style={{ strokeDasharray: '283%' }}
            />
          </svg>
          
          <div className="flex flex-col items-center justify-center z-10 text-center">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
               {isActive ? (mode === 'pomodoro' ? t('timer.focusTime', lang) : 'Timer Active') : 'Standing By'}
             </span>
             <h2 className="text-5xl md:text-6xl font-black text-slate-800 dark:text-white tabular-nums tracking-tighter">
               {formatTime(timeLeft)}
             </h2>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-6">
          <button 
            onClick={resetTimer}
            className="p-4 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-3xl hover:text-rose-500 transition-all active:scale-90"
            title={t('timer.reset', lang)}
          >
            <RotateCcw size={24} />
          </button>
          
          <button 
            onClick={toggleTimer}
            disabled={timeLeft === 0 && !isActive}
            className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-95 disabled:opacity-30 ${
              isActive 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-600' 
                : 'bg-theme text-white shadow-theme/30'
            }`}
          >
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
          </button>

          <button 
            className={`p-4 bg-slate-50 dark:bg-slate-800 transition-all rounded-3xl ${timeLeft === 0 ? 'text-rose-500 animate-bounce' : 'text-slate-400 opacity-50 cursor-not-allowed'}`}
          >
            <Bell size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center transition-all hover:border-theme/20">
           <div className="p-3 bg-amber-50 dark:bg-amber-900/20 text-amber-500 rounded-2xl mb-3">
              <Brain size={20} />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
           <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
             {isActive ? (lang === 'ar' ? 'تركيز مستمر' : 'Ongoing Focus') : timeLeft === 0 ? (lang === 'ar' ? 'انتهت الجلسة' : 'Session Done') : (lang === 'ar' ? 'جاهز للبدء' : 'Ready to Start')}
           </p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col items-center text-center transition-all hover:border-theme/20">
           <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-2xl mb-3">
              <TimerIcon size={20} />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Timezone</p>
           <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Riyadh, SA</p>
        </div>
      </div>
    </div>
  );
};
