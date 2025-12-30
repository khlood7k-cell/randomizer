
import React, { useState, useEffect } from 'react';
import { AppState, ListData, Settings, NameItem } from './types';
import { Sidebar } from './components/Sidebar';
import { ListManager } from './components/ListManager';
import { SettingsModal } from './components/SettingsModal';
import { MergeModal } from './components/MergeModal';
import { HashRouter as Router } from 'react-router-dom';
import { Sparkles, PanelLeftOpen } from 'lucide-react';

const STORAGE_KEY = 'randomizer_pro_data_v3';

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
          settings: parsed.settings || DEFAULT_SETTINGS
        };
      } catch (e) {
        console.error("Failed to parse saved state", e);
      }
    }
    return {
      lists: [],
      activeListId: null,
      settings: DEFAULT_SETTINGS
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Handle Dark Mode class on HTML element
  useEffect(() => {
    if (state.settings.isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#0f172a';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#fcfdfe';
    }
  }, [state.settings.isDarkMode]);

  const handleCreateList = () => {
    const newList: ListData = {
      id: crypto.randomUUID(),
      title: "New Amazing List",
      items: [],
      createdAt: Date.now()
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
        createdAt: Date.now()
      };

      let newLists = [newList, ...prev.lists];
      if (mode === 'replace') {
        newLists = newLists.filter(l => l.id !== id1 && l.id !== id2);
      }

      return {
        ...prev,
        lists: newLists,
        activeListId: newList.id
      };
    });
  };

  const handleUpdateSettings = (newSettings: Settings) => {
    setState(prev => ({ ...prev, settings: newSettings }));
  };

  const activeList = state.lists.find(l => l.id === state.activeListId);

  // Expanded color mappings
  const colorMap: Record<string, string> = {
    indigo: '#4f46e5',
    rose: '#f43f5e',
    emerald: '#10b981',
    amber: '#f59e0b',
    violet: '#7c3aed',
    sky: '#0ea5e9',
    pink: '#ec4899',
    orange: '#f97316',
    slate: '#334155',
  };

  const lightColorMap: Record<string, string> = {
    indigo: '#eef2ff',
    rose: '#fff1f2',
    emerald: '#ecfdf5',
    amber: '#fffbeb',
    violet: '#f5f3ff',
    sky: '#f0f9ff',
    pink: '#fdf2f8',
    orange: '#fff7ed',
    slate: '#f1f5f9',
  };

  const darkColorMap: Record<string, string> = {
    indigo: 'rgba(79, 70, 229, 0.15)',
    rose: 'rgba(244, 63, 94, 0.15)',
    emerald: 'rgba(16, 185, 129, 0.15)',
    amber: 'rgba(245, 158, 11, 0.15)',
    violet: 'rgba(124, 58, 237, 0.15)',
    sky: 'rgba(14, 165, 233, 0.15)',
    pink: 'rgba(236, 72, 153, 0.15)',
    orange: 'rgba(249, 115, 22, 0.15)',
    slate: 'rgba(51, 65, 85, 0.15)',
  };

  const themeColor = colorMap[state.settings.themeColor];
  const themeLightColor = state.settings.isDarkMode ? darkColorMap[state.settings.themeColor] : lightColorMap[state.settings.themeColor];

  return (
    <Router>
      <div className={`min-h-screen transition-colors duration-300 ${state.settings.isDarkMode ? 'dark bg-slate-950 text-white' : 'bg-[#fcfdfe] text-slate-900'}`}>
        <Sidebar 
          lists={state.lists}
          activeId={state.activeListId}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onSelect={(id) => {
            setState(prev => ({ ...prev, activeListId: id }));
            if (window.innerWidth < 1024) setIsSidebarOpen(false);
          }}
          onCreate={handleCreateList}
          onDelete={handleDeleteList}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenMerge={() => setIsMergeModalOpen(true)}
        />

        <main className={`transition-all duration-300 ease-in-out min-h-screen ${
          isSidebarOpen ? 'lg:pl-72' : 'pl-0'
        }`}>
          {!isSidebarOpen && (
            <div className="fixed top-6 left-6 z-10 animate-in fade-in slide-in-from-left-4 duration-500">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-3 bg-white dark:bg-slate-800 shadow-xl shadow-slate-200 dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:text-[var(--theme-color)] transition-all hover:scale-105 active:scale-95 group"
              >
                <PanelLeftOpen size={24} />
              </button>
            </div>
          )}

          <div className="py-12 px-6 lg:px-12">
            {activeList ? (
              <ListManager 
                list={activeList}
                settings={state.settings}
                onUpdate={handleUpdateList}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[80vh] text-center">
                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center shadow-xl shadow-slate-200 dark:shadow-none border border-slate-100 dark:border-slate-800 mb-8 animate-bounce duration-[3000ms]">
                  <Sparkles className="text-[var(--theme-color)] w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">No list selected</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-10 leading-relaxed">
                  Open the menu to select one of your lists or create a brand new one.
                </p>
                <button 
                  onClick={handleCreateList}
                  className="px-10 py-4 rounded-2xl font-bold text-lg text-white shadow-xl transition-all hover:scale-105 active:scale-95 bg-theme"
                >
                  Create First List
                </button>
              </div>
            )}
          </div>
        </main>

        {isSettingsOpen && (
          <SettingsModal 
            settings={state.settings}
            onUpdate={handleUpdateSettings}
            onClose={() => setIsSettingsOpen(false)}
          />
        )}

        {isMergeModalOpen && (
          <MergeModal
            lists={state.lists}
            onMerge={handleMergeLists}
            onClose={() => setIsMergeModalOpen(false)}
          />
        )}

        <style>{`
          :root {
            --theme-color: ${themeColor};
            --theme-color-light: ${themeLightColor};
          }
          .bg-theme { background-color: var(--theme-color); }
          .text-theme { color: var(--theme-color); }
          .border-theme { border-color: var(--theme-color); }
          .bg-theme-light { background-color: var(--theme-color-light); }
        `}</style>
      </div>
    </Router>
  );
};

export default App;
