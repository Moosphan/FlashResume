import { useEffect } from 'react';
import AppLayout from './components/Layout/AppLayout';
import { useAutoSave } from './hooks/useAutoSave';
import { useResumeStore } from './stores/resumeStore';
import { useUIStore } from './stores/uiStore';
import { initializeAnalytics } from './services/analyticsService';
import * as storageService from './services/storageService';
import { PRESET_RESUME_DATA } from './data/presetResume';
import { useLocale } from './hooks/useLocale';
import { syncDocumentSeo } from './utils/seo';

function App() {
  // Activate auto-save at the top level
  useAutoSave();

  const themeMode = useUIStore((s) => s.themeMode);
  const { locale } = useLocale();

  // Sync themeMode to document.documentElement class for Tailwind dark mode
  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  useEffect(() => {
    syncDocumentSeo(locale);
  }, [locale]);

  // On startup, always load preset demo data, then restore last active resume if exists
  useEffect(() => {
    const store = useResumeStore.getState();
    const savedId = storageService.getCurrentResumeId();

    // Always ensure preset resume exists in the list
    const list = storageService.getResumeList();
    const presetExists = list.some((item) => item.name === 'Alex Chen');
    if (!presetExists) {
      store.importFromJSON(JSON.stringify(PRESET_RESUME_DATA));
    }

    // Then restore last active resume if available
    if (savedId) {
      store.loadResume(savedId);
    }
  }, []);

  useEffect(() => {
    initializeAnalytics();
  }, []);

  return <AppLayout />;
}

export default App;
