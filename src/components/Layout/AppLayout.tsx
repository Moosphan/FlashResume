import { useRef, useState, useCallback } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';
import ThemeToggle from '../UI/ThemeToggle';
import TemplateSelector from '../UI/TemplateSelector';
import ThemePicker from '../UI/ThemePicker';
import SortableSectionList from '../Editor/SortableSectionList';
import PreviewPanel from '../Preview/PreviewPanel';
import ExportBar from './ExportBar';
import Sidebar from './Sidebar';
import IndustryGalleryOverlay from '../Gallery/IndustryGalleryOverlay';
import faviconUrl from '/favicon.svg?url';

export default function AppLayout() {
  const previewRef = useRef<HTMLDivElement>(null);
  const autoSaveStatus = useUIStore((s) => s.autoSaveStatus);
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, toggleLocale } = useLocale();

  // Resizable split pane state
  const [editorWidthPct, setEditorWidthPct] = useState(50);
  const isDragging = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    const onMove = (ev: MouseEvent) => {
      if (!isDragging.current || !mainRef.current) return;
      const rect = mainRef.current.getBoundingClientRect();
      const pct = ((ev.clientX - rect.left) / rect.width) * 100;
      setEditorWidthPct(Math.min(Math.max(pct, 20), 80));
    };

    const onUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, []);

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
          <img src={faviconUrl} alt="Flash Resume" className="h-7 w-7" />
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

        {/* Main area: editor + resizable divider + preview */}
        <main ref={mainRef} className="flex min-h-0 flex-1 flex-col lg:flex-row">
          {/* Editor panel */}
          <div
            className="overflow-y-auto p-4 max-lg:flex-1"
            style={{ width: `${editorWidthPct}%`, flexShrink: 0, flexGrow: 0 }}
          >
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

          {/* Draggable divider - only visible on lg+ */}
          <div
            role="separator"
            aria-orientation="vertical"
            aria-label="拖动调整面板大小"
            className="hidden lg:flex items-center justify-center w-2 cursor-col-resize bg-gray-200 hover:bg-blue-300 active:bg-blue-400 dark:bg-gray-700 dark:hover:bg-blue-600 dark:active:bg-blue-500 transition-colors flex-shrink-0 group"
            onMouseDown={handleDragStart}
          >
            <div className="w-0.5 h-8 rounded-full bg-gray-400 group-hover:bg-white dark:bg-gray-500 group-hover:dark:bg-white transition-colors" />
          </div>

          {/* Preview panel */}
          <div className="flex-1 overflow-y-auto border-t border-gray-200 dark:border-gray-700 lg:border-l-0 lg:border-t-0 min-w-0">
            <PreviewPanel ref={previewRef} />
          </div>
        </main>
      </div>

      {/* Industry Gallery Overlay */}
      <IndustryGalleryOverlay />

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
