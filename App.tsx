
import React, { useState, useEffect, useRef } from 'react';
import { AppState, ListData, Settings, NameItem, ViewMode } from './types';
import { Sidebar } from './components/Sidebar';
import { ListManager } from './components/ListManager';
import { CalendarManager } from './components/CalendarManager';
import { TimerWidget } from './components/TimerWidget';
import { QuestionTestManager } from './components/QuestionTestManager';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsModal } from './components/SettingsModal';
import { MergeModal } from './components/MergeModal';
import { HashRouter as Router } from 'react-router-dom';
import { Plus, LayoutList, Menu, Timer as TimerIcon } from 'lucide-react';
import { t } from './translations';

const STORAGE_KEY = 'applications_pro_data_v11';

const DEFAULT_SETTINGS: Settings = {
  themeColor: 'indigo',
  isDarkMode: false,
  enableConfetti: true,
  autoResetPool: false,
  showTimestamps: true,
  language: 'en',
  showGlobalTimer: true
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  
  // Global Timer State
  const [timerTimeLeft, setTimerTimeLeft] = useState(25 * 60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerTotalTime, setTimerTotalTime] = useState(25 * 60);
  const timerRef = useRef<number | null>(null);

  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          viewMode: parsed.viewMode || 'welcome'
        };
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      lists: [],
      activeListId: null,
      settings: DEFAULT_SETTINGS,
      viewMode: 'welcome'
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Handle Global Timer Countdown
  useEffect(() => {
    if (isTimerActive && timerTimeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimerTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timerTimeLeft === 0 && isTimerActive) {
      setIsTimerActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      
      // Desktop Notification
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification(t('timer.finished', state.settings.language), {
          body: state.settings.language === 'ar' ? 'انتهت جلسة التركيز!' : 'Focus session complete!',
          icon: '/favicon.ico'
        });
      }
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isTimerActive, timerTimeLeft, state.settings.language]);

  useEffect(() => {
    if (state.settings.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
    document.documentElement.dir = state.settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = state.settings.language;
  }, [state.settings.isDarkMode, state.settings.language]);

  const handleSelectMode = (mode: ViewMode) => {
    let newState = { ...state, viewMode: mode };
    
    if (mode === 'calendar') {
      let singletonList = state.lists.find(l => l.type === mode);
      if (!singletonList) {
        singletonList = {
          id: `single-calendar-id`,
          title: state.settings.language === 'ar' ? 'تقويمي' : 'My Calendar',
          items: [],
          highlights: [],
          createdAt: Date.now(),
          type: 'calendar'
        };
        newState.lists = [singletonList, ...state.lists];
      }
      newState.activeListId = singletonList.id;
    } else {
      newState.activeListId = null;
    }
    
    setState(newState);
  };

  const handleCreateList = () => {
    if (state.viewMode === 'welcome' || state.viewMode === 'calendar') return;
    
    const titles: Record<Exclude<ViewMode, 'welcome' | 'calendar'>, string> = {
      'randomizer': state.settings.language === 'ar' ? 'قائمة عشوائية جديدة' : 'New Random List',
      'question-test': state.settings.language === 'ar' ? 'اختبار أسئلة جديد' : 'New Question Test'
    };

    const newList: ListData = {
      id: crypto.randomUUID(),
      title: titles[state.viewMode as keyof typeof titles],
      items: [],
      highlights: [],
      createdAt: Date.now(),
      type: state.viewMode as any
    };

    setState(prev => ({
      ...prev,
      lists: [newList, ...prev.lists],
      activeListId: newList.id
    }));
    if (!isSidebarOpen) setIsSidebarOpen(true);
  };

  const handleUpdateList = (updatedList: ListData) => {
    setState(prev => ({
      ...prev,
      lists: prev.lists.map(l => l.id === updatedList.id ? updatedList : l)
    }));
  };

  const handleDeleteList = (id: string) => {
    const list = state.lists.find(l => l.id === id);
    if (list?.type === 'calendar') return;

    setState(prev => {
      const newLists = prev.lists.filter(l => l.id !== id);
      return {
        ...prev,
        lists: newLists,
        activeListId: prev.activeListId === id ? null : prev.activeListId
      };
    });
  };

  const handleMergeLists = (id1: string, id2: string, mode: 'add' | 'replace', newTitle: string) => {
    setState(prev => {
      const list1 = prev.lists.find(l => l.id === id1);
      const list2 = prev.lists.find(l => l.id === id2);
      if (!list1 || !list2) return prev;
      const mergedItems: NameItem[] = [
        ...list1.items.map(item => ({ ...item, id: crypto.randomUUID(), isPicked: false, pickedAt: undefined })),
        ...list2.items.map(item => ({ ...item, id: crypto.randomUUID(), isPicked: false, pickedAt: undefined }))
      ];
      const newList: ListData = {
        id: crypto.randomUUID(),
        title: newTitle,
        items: mergedItems,
        highlights: [...(list1.highlights || []), ...(list2.highlights || [])],
        createdAt: Date.now(),
        type: list1.type
      };
      let newLists = [newList, ...prev.lists];
      if (mode === 'replace') {
        newLists = newLists.filter(l => l.id !== id1 && l.id !== id2);
      }
      return { ...prev, lists: newLists, activeListId: newList.id };
    });
  };

  const handleUpdateSettings = (newSettings: Settings) => {
    setState(prev => ({ ...prev, settings: newSettings }));
    // If user hides timer in settings, close the widget
    if (!newSettings.showGlobalTimer) setIsTimerOpen(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredLists = state.lists.filter(l => l.type === state.viewMode);
  const activeList = state.lists.find(l => l.id === state.activeListId);
  const lang = state.settings.language;
  const themeColor = {
    indigo: '#4f46e5', rose: '#f43f5e', emerald: '#10b981', amber: '#f59e0b',
    violet: '#7c3aed', sky: '#0ea5e9', pink: '#ec4899', orange: '#f97316', slate: '#334155',
  }[state.settings.themeColor];

  if (state.viewMode === 'welcome') {
    return <WelcomeScreen onSelectMode={handleSelectMode} settings={state.settings} />;
  }

  return (
    <Router>
      <div 
        className={`min-h-screen flex flex-col transition-colors duration-300 overflow-hidden ${state.settings.isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-900'}`}
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <Sidebar 
          lists={filteredLists}
          activeId={state.activeListId}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onSelect={(id) => {
            setState(prev => ({ ...prev, activeListId: id }));
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          onCreate={handleCreateList}
          onDelete={handleDeleteList}
          onUpdate={handleUpdateList}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMerge={() => setIsMergeModalOpen(true)}
          onSelectMode={handleSelectMode}
          viewMode={state.viewMode}
          settings={state.settings}
        />

        <main className={`flex-1 transition-all duration-300 ease-in-out flex flex-col relative h-full w-full ${!isSidebarOpen ? 'pl-0 pr-0' : (lang === 'ar' ? 'lg:pr-64 lg:pl-0' : 'lg:pl-64 lg:pr-0')}`}>
          {/* Persistent Header */}
          <header className="fixed top-0 z-30 w-full flex items-center justify-between p-4 pointer-events-none">
             <div className="flex items-center gap-2 pointer-events-auto">
               {!isSidebarOpen && (
                 <button 
                   onClick={() => setIsSidebarOpen(true)}
                   className="p-2.5 rounded-lg shadow-sm transition-all hover:scale-105 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500"
                 >
                   <Menu size={18} />
                 </button>
               )}
             </div>

             {/* Conditionally show timer button based on settings */}
             {state.settings.showGlobalTimer && (
               <div className="flex items-center gap-2 pointer-events-auto">
                  <button 
                    onClick={() => setIsTimerOpen(!isTimerOpen)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-lg border transition-all ${isTimerActive ? 'bg-rose-500 text-white border-rose-400 animate-pulse' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'}`}
                  >
                    <TimerIcon size={16} className={isTimerActive ? 'animate-spin' : ''} />
                    <span className="text-sm font-black tabular-nums">{formatTime(timerTimeLeft)}</span>
                  </button>
               </div>
             )}
          </header>

          <div className={`flex-1 flex flex-col p-4 md:p-12 lg:p-16 items-center ${activeList ? 'justify-start' : 'justify-center'} overflow-y-auto mt-12`}>
            {activeList ? (
              <div className="w-full h-auto max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-1 duration-300">
                {state.viewMode === 'randomizer' && (
                  <ListManager list={activeList} settings={state.settings} onUpdate={handleUpdateList} />
                )}
                {state.viewMode === 'calendar' && (
                  <CalendarManager list={activeList} settings={state.settings} onUpdate={handleUpdateList} />
                )}
                {state.viewMode === 'question-test' && (
                  <QuestionTestManager list={activeList} settings={state.settings} onUpdate={handleUpdateList} />
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center text-center max-w-lg pb-12 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-theme-light rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-theme/5">
                  <LayoutList className="text-[var(--theme-color)] w-10 h-10" />
                </div>
                <h2 className="text-3xl md:text-4xl font-black mb-3 text-slate-900 dark:text-white tracking-tight">
                  {t('app.emptyStateTitle', lang)}
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm md:text-base font-medium leading-relaxed max-w-md">
                  {t('app.emptyStateDesc', lang, { mode: t(`welcome.${state.viewMode}`, lang) })}
                </p>
                <button 
                  onClick={handleCreateList}
                  className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-base text-white shadow-lg shadow-theme/20 bg-theme hover:brightness-110 hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus size={20} strokeWidth={3} />
                  <span>{t('app.createNew', lang)}</span>
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Global Overlays */}
        {isTimerOpen && (
          <TimerWidget 
            timeLeft={timerTimeLeft}
            isActive={isTimerActive}
            totalTime={timerTotalTime}
            onSetTime={(t) => { setTimerTimeLeft(t); setTimerTotalTime(t); setIsTimerActive(false); }}
            onToggle={() => {
              if ("Notification" in window && Notification.permission === "default") {
                Notification.requestPermission();
              }
              setIsTimerActive(!isTimerActive);
            }}
            onReset={() => { setIsTimerActive(false); setTimerTimeLeft(timerTotalTime); }}
            settings={state.settings}
            onClose={() => setIsTimerOpen(false)}
          />
        )}

        {isSettingsOpen && <SettingsModal settings={state.settings} onUpdate={handleUpdateSettings} onClose={() => setIsSettingsOpen(false)} />}
        {isMergeModalOpen && <MergeModal lists={filteredLists} onMerge={handleMergeLists} onClose={() => setIsMergeModalOpen(false)} />}

        <style>{`:root { --theme-color: ${themeColor}; --theme-color-light: ${themeColor}10; } .bg-theme { background-color: var(--theme-color); } .text-theme { color: var(--theme-color); } .bg-theme-light { background-color: var(--theme-color-light); }`}</style>
      </div>
    </Router>
  );
};

export default App;
