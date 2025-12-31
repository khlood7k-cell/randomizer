
import React, { useState, useEffect } from 'react';
import { AppState, ListData, Settings, NameItem, ViewMode } from './types';
import { Sidebar } from './components/Sidebar';
import { ListManager } from './components/ListManager';
import { TodoManager } from './components/TodoManager';
import { QuestionTestManager } from './components/QuestionTestManager';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SettingsModal } from './components/SettingsModal';
import { MergeModal } from './components/MergeModal';
import { HashRouter as Router } from 'react-router-dom';
import { Plus, LayoutList, Menu } from 'lucide-react';

const STORAGE_KEY = 'applications_pro_data_v6';

const DEFAULT_SETTINGS: Settings = {
  themeColor: 'indigo',
  isDarkMode: false,
  enableConfetti: true,
  autoResetPool: false,
  showTimestamps: true
};

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMergeModalOpen, setIsMergeModalOpen] = useState(false);
  
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          settings: parsed.settings || DEFAULT_SETTINGS,
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

  useEffect(() => {
    if (state.settings.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#020617';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f8fafc';
    }
  }, [state.settings.isDarkMode]);

  const handleSelectMode = (mode: ViewMode) => {
    setState(prev => ({ ...prev, viewMode: mode, activeListId: null }));
  };

  const handleCreateList = () => {
    if (state.viewMode === 'welcome') return;
    
    const titles: Record<Exclude<ViewMode, 'welcome'>, string> = {
      'randomizer': 'New Random List',
      'todo': 'New Task List',
      'question-test': 'New Question Test'
    };

    const newList: ListData = {
      id: crypto.randomUUID(),
      title: titles[state.viewMode as keyof typeof titles],
      items: [],
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
  };

  const filteredLists = state.lists.filter(l => l.type === state.viewMode);
  const activeList = state.lists.find(l => l.id === state.activeListId);

  const colorMap: Record<string, string> = {
    indigo: '#4f46e5', rose: '#f43f5e', emerald: '#10b981', amber: '#f59e0b',
    violet: '#7c3aed', sky: '#0ea5e9', pink: '#ec4899', orange: '#f97316', slate: '#334155',
  };
  const themeColor = colorMap[state.settings.themeColor];

  if (state.viewMode === 'welcome') {
    return <WelcomeScreen onSelectMode={handleSelectMode} />;
  }

  return (
    <Router>
      <div className={`min-h-screen flex flex-col transition-colors duration-300 overflow-hidden ${state.settings.isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-[#f8fafc] text-slate-900'}`}>
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
        />

        <main className={`flex-1 transition-all duration-300 ease-in-out flex flex-col relative h-full w-full ${!isSidebarOpen ? 'pl-0' : 'lg:pl-64'}`}>
          {!isSidebarOpen && (
            <div className="fixed top-3 left-3 z-40 animate-in fade-in slide-in-from-left-2 duration-300">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 rounded-lg shadow-sm transition-all hover:scale-105 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500"
              >
                <Menu size={18} />
              </button>
            </div>
          )}

          <div className={`flex-1 flex flex-col p-4 md:p-6 lg:p-8 items-center ${activeList ? 'justify-start' : 'justify-center'} overflow-y-auto`}>
            {activeList ? (
              <div className="w-full h-auto max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-1 duration-300">
                {state.viewMode === 'randomizer' && (
                  <ListManager list={activeList} settings={state.settings} onUpdate={handleUpdateList} />
                )}
                {state.viewMode === 'todo' && (
                  <TodoManager list={activeList} settings={state.settings} onUpdate={handleUpdateList} />
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
                  Pick an application to begin
                </h2>
                <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm md:text-base font-medium leading-relaxed max-w-md">
                  Select an existing list from the sidebar or create a new one to get started with your {state.viewMode}.
                </p>
                <button 
                  onClick={handleCreateList}
                  className="group flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-black text-base text-white shadow-lg shadow-theme/20 bg-theme hover:brightness-110 hover:scale-105 active:scale-95 transition-all"
                >
                  <Plus size={20} strokeWidth={3} />
                  <span>CREATE NEW LIST</span>
                </button>
              </div>
            )}
          </div>
        </main>

        {isSettingsOpen && <SettingsModal settings={state.settings} onUpdate={handleUpdateSettings} onClose={() => setIsSettingsOpen(false)} />}
        {isMergeModalOpen && <MergeModal lists={filteredLists} onMerge={handleMergeLists} onClose={() => setIsMergeModalOpen(false)} />}

        <style>{`:root { --theme-color: ${themeColor}; --theme-color-light: ${themeColor}10; } .bg-theme { background-color: var(--theme-color); } .text-theme { color: var(--theme-color); } .bg-theme-light { background-color: var(--theme-color-light); }`}</style>
      </div>
    </Router>
  );
};

export default App;
