
export interface NameItem {
  id: string;
  value: string;
  answer?: string; // Optional answer for question tests
  date?: string;   // ISO date string for calendar tasks
  isPicked: boolean;
  pickedAt?: number;
}

export type ListType = 'randomizer' | 'calendar' | 'question-test';

export interface ListData {
  id: string;
  title: string;
  items: NameItem[];
  highlights?: string[]; // Array of ISO date strings
  createdAt: number;
  type: ListType;
}

export type ThemeColor = 
  | 'indigo' | 'rose' | 'emerald' | 'amber' 
  | 'violet' | 'sky' | 'pink' | 'orange' | 'slate';

export type Language = 'en' | 'ar';

export interface Settings {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  enableConfetti: boolean;
  autoResetPool: boolean;
  showTimestamps: boolean;
  language: Language;
  showGlobalTimer: boolean;
}

export type ViewMode = 'welcome' | 'randomizer' | 'calendar' | 'question-test';

export interface AppState {
  lists: ListData[];
  activeListId: string | null;
  settings: Settings;
  viewMode: ViewMode;
}
