import { useEffect } from 'react';
import AppLayout from './components/Layout/AppLayout';
import { useAutoSave } from './hooks/useAutoSave';
import { useResumeStore } from './stores/resumeStore';
import { useUIStore } from './stores/uiStore';
import * as storageService from './services/storageService';

function App() {
  // Activate auto-save at the top level
  useAutoSave();

  const themeMode = useUIStore((s) => s.themeMode);

  // Sync themeMode to document.documentElement class for Tailwind dark mode
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  // On startup, restore the last active resume from localStorage
  useEffect(() => {
    const savedId = storageService.getCurrentResumeId();
    if (savedId) {
      useResumeStore.getState().loadResume(savedId);
    }
  }, []);

  return <AppLayout />;
}

export default App;
