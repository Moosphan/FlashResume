import { useRef, useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';
import ThemeToggle from '../UI/ThemeToggle';
import TemplateSelector from '../UI/TemplateSelector';
import ThemePicker from '../UI/ThemePicker';
import SortableSectionList from '../Editor/SortableSectionList';
import PreviewPanel from '../Preview/PreviewPanel';
import ExportBar from './ExportBar';
import Sidebar from './Sidebar';

export default function AppLayout() {
  const previewRef = useRef<HTMLDivElement>(null);
  const autoSaveStatus = useUIStore((s) => s.autoSaveStatus);
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, toggleLocale } = useLocale();

  return (
    <div className="flex h-screen flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800 transition-colors duration-300">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex h-[44px] w-[44px] items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
            aria-label={t.openSidebar}
          >
            ☰
          </button>
          <img src="/favicon.svg" alt="Flash Resume" className="h-7 w-7" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Flash Resume</h1>
        </div>
        <div className="flex items-center gap-2">
          {autoSaveStatus === 'saved' && (
            <span className="text-xs text-green-600 dark:text-green-400">{t.autoSaved}</span>
          )}
          <ExportBar previewRef={previewRef} />
          <button
            type="button"
            onClick={toggleLocale}
            className="flex h-9 items-center rounded-md border border-gray-200 px-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label={t.switchLang}
          >
            {t.switchLang}
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex min-h-0 flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main area: editor + preview */}
        <main className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Editor panel */}
          <div className="flex-1 overflow-y-auto p-4 lg:max-w-[50%]">
            <div className="space-y-4">
              <section>
                <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{t.templateSelect}</h2>
                <TemplateSelector />
              </section>
              <section>
                <h2 className="mb-2 text-sm font-semibold text-gray-600 dark:text-gray-400">{t.themeColor}</h2>
                <ThemePicker />
              </section>
              <SortableSectionList />
            </div>
          </div>

          {/* Preview panel */}
          <div className="flex-1 overflow-y-auto border-t border-gray-200 dark:border-gray-700 lg:border-l lg:border-t-0">
            <PreviewPanel ref={previewRef} />
          </div>
        </main>
      </div>

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              role="alert"
              className={`pointer-events-auto flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-lg transition-all duration-200 ${
                toast.type === 'success'
                  ? 'bg-green-600 text-white'
                  : toast.type === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900'
              }`}
            >
              <span>{toast.message}</span>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="ml-1 flex h-5 w-5 items-center justify-center rounded-full hover:bg-white/20 transition-colors"
                aria-label={t.closeNotification}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
