import { useEffect } from 'react';
import AppLayout from './components/Layout/AppLayout';
import { useAutoSave } from './hooks/useAutoSave';
import { useResumeStore } from './stores/resumeStore';
import { useUIStore } from './stores/uiStore';
import * as storageService from './services/storageService';
import { PRESET_RESUME_DATA } from './data/presetResume';

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

  // On startup, always load preset demo data, then restore last active resume if exists
  useEffect(() => {
    const store = useResumeStore.getState();
    // Always ensure preset resume exists in the list
    const list = storageService.getResumeList();
    const presetExists = list.some((item) => item.name === 'Alex Chen');
    if (!presetExists) {
      store.importFromJSON(JSON.stringify(PRESET_RESUME_DATA));
    }

    // Then restore last active resume if available
    const savedId = storageService.getCurrentResumeId();
    if (savedId) {
      store.loadResume(savedId);
    }
  }, []);

  return <AppLayout />;
}

export default App;
