
export interface NameItem {
  id: string;
  value: string;
  answer?: string; // Optional answer for question tests
  isPicked: boolean;
  pickedAt?: number;
}

export type ListType = 'randomizer' | 'todo' | 'question-test';

export interface ListData {
  id: string;
  title: string;
  items: NameItem[];
  createdAt: number;
  type: ListType;
}

export type ThemeColor = 
  | 'indigo' | 'rose' | 'emerald' | 'amber' 
  | 'violet' | 'sky' | 'pink' | 'orange' | 'slate';

export interface Settings {
  themeColor: ThemeColor;
  isDarkMode: boolean;
  enableConfetti: boolean;
  autoResetPool: boolean;
  showTimestamps: boolean;
}

export type ViewMode = 'welcome' | 'randomizer' | 'todo' | 'question-test';

export interface AppState {
  lists: ListData[];
  activeListId: string | null;
  settings: Settings;
  viewMode: ViewMode;
}
