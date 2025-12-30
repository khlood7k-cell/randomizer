
export interface NameItem {
  id: string;
  value: string;
  isPicked: boolean;
  pickedAt?: number;
}

export interface ListData {
  id: string;
  title: string;
  items: NameItem[];
  createdAt: number;
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

export interface AppState {
  lists: ListData[];
  activeListId: string | null;
  settings: Settings;
}
