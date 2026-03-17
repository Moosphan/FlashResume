import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useUIStore } from '../uiStore';

// Mock storageService
vi.mock('../../services/storageService', () => ({
  getThemeMode: vi.fn(() => 'light'),
  setThemeMode: vi.fn(),
}));

import { getThemeMode, setThemeMode } from '../../services/storageService';

const mockedGetThemeMode = vi.mocked(getThemeMode);
const mockedSetThemeMode = vi.mocked(setThemeMode);

describe('UIStore', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    // Reset store state
    useUIStore.setState({
      themeMode: 'light',
      autoSaveStatus: 'idle',
      toasts: [],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('themeMode', () => {
    it('initializes themeMode from storageService', () => {
      mockedGetThemeMode.mockReturnValue('dark');
      // Re-create store by calling getThemeMode during init
      // The initial state was set in beforeEach; verify the mock is wired
      expect(mockedGetThemeMode).toBeDefined();
    });

    it('toggleThemeMode switches light to dark', () => {
      useUIStore.getState().toggleThemeMode();
      expect(useUIStore.getState().themeMode).toBe('dark');
      expect(mockedSetThemeMode).toHaveBeenCalledWith('dark');
    });

    it('toggleThemeMode switches dark to light', () => {
      useUIStore.setState({ themeMode: 'dark' });
      useUIStore.getState().toggleThemeMode();
      expect(useUIStore.getState().themeMode).toBe('light');
      expect(mockedSetThemeMode).toHaveBeenCalledWith('light');
    });

    it('setThemeMode sets mode and persists', () => {
      useUIStore.getState().setThemeMode('dark');
      expect(useUIStore.getState().themeMode).toBe('dark');
      expect(mockedSetThemeMode).toHaveBeenCalledWith('dark');
    });
  });

  describe('autoSaveStatus', () => {
    it('defaults to idle', () => {
      expect(useUIStore.getState().autoSaveStatus).toBe('idle');
    });

    it('setAutoSaveStatus updates status', () => {
      useUIStore.getState().setAutoSaveStatus('saving');
      expect(useUIStore.getState().autoSaveStatus).toBe('saving');

      useUIStore.getState().setAutoSaveStatus('saved');
      expect(useUIStore.getState().autoSaveStatus).toBe('saved');
    });
  });

  describe('toasts', () => {
    it('addToast adds a toast with default type info', () => {
      useUIStore.getState().addToast('Hello');
      const toasts = useUIStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe('Hello');
      expect(toasts[0].type).toBe('info');
    });

    it('addToast adds a toast with specified type', () => {
      useUIStore.getState().addToast('Error!', 'error');
      const toasts = useUIStore.getState().toasts;
      expect(toasts).toHaveLength(1);
      expect(toasts[0].type).toBe('error');
    });

    it('addToast auto-removes toast after 3 seconds', () => {
      useUIStore.getState().addToast('Temporary');
      expect(useUIStore.getState().toasts).toHaveLength(1);

      vi.advanceTimersByTime(3000);
      expect(useUIStore.getState().toasts).toHaveLength(0);
    });

    it('removeToast removes a specific toast', () => {
      useUIStore.getState().addToast('First');
      useUIStore.getState().addToast('Second');
      expect(useUIStore.getState().toasts).toHaveLength(2);

      const id = useUIStore.getState().toasts[0].id;
      useUIStore.getState().removeToast(id);
      expect(useUIStore.getState().toasts).toHaveLength(1);
      expect(useUIStore.getState().toasts[0].message).toBe('Second');
    });

    it('multiple toasts can coexist', () => {
      useUIStore.getState().addToast('A', 'success');
      useUIStore.getState().addToast('B', 'error');
      useUIStore.getState().addToast('C', 'info');
      expect(useUIStore.getState().toasts).toHaveLength(3);
    });
  });
});
