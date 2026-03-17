import { create } from 'zustand';
import { getThemeMode, setThemeMode as persistThemeMode } from '../services/storageService';

// ============================================================
// UIStore - 界面状态管理 (Zustand)
// ============================================================

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export interface UIStoreState {
  themeMode: 'light' | 'dark';
  autoSaveStatus: 'idle' | 'saving' | 'saved';
  toasts: Toast[];

  toggleThemeMode: () => void;
  setThemeMode: (mode: 'light' | 'dark') => void;
  setAutoSaveStatus: (status: 'idle' | 'saving' | 'saved') => void;
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

let toastCounter = 0;

export const useUIStore = create<UIStoreState>((set) => ({
  themeMode: getThemeMode(),
  autoSaveStatus: 'idle',
  toasts: [],

  toggleThemeMode: () =>
    set((state) => {
      const next = state.themeMode === 'light' ? 'dark' : 'light';
      persistThemeMode(next);
      return { themeMode: next };
    }),

  setThemeMode: (mode) =>
    set(() => {
      persistThemeMode(mode);
      return { themeMode: mode };
    }),

  setAutoSaveStatus: (status) => set({ autoSaveStatus: status }),

  addToast: (message, type = 'info') => {
    const id = `toast_${++toastCounter}_${Date.now()}`;
    const toast: Toast = { id, message, type };

    set((state) => ({ toasts: [...state.toasts, toast] }));

    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((t) => t.id !== id),
      }));
    }, 3000);
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));
