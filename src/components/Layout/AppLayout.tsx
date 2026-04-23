import { useRef, useState, useCallback } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';
import { useIsMobile, useIsTablet } from '../../hooks/useMediaQuery';
import MobileTabNav from './MobileTabNav';
import ThemeToggle from '../UI/ThemeToggle';
import TemplateSelector from '../UI/TemplateSelector';
import ThemePicker from '../UI/ThemePicker';
import SortableSectionList from '../Editor/SortableSectionList';
import PreviewPanel from '../Preview/PreviewPanel';
import ExportBar from './ExportBar';
import Sidebar from './Sidebar';
import IndustryGalleryOverlay from '../Gallery/IndustryGalleryOverlay';
import TutorialPanel from '../Tutorial/TutorialPanel';

export default function AppLayout() {
  const previewRef = useRef<HTMLDivElement>(null);
  const toasts = useUIStore((s) => s.toasts);
  const removeToast = useUIStore((s) => s.removeToast);
  const activeTab = useUIStore((s) => s.activeTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, toggleLocale } = useLocale();

  const isMobile = useIsMobile();
  const isTablet = useIsTablet();

  // Resizable split pane state
  // Tablet defaults to 55%, Desktop defaults to 50%
  const [editorWidthPct, setEditorWidthPct] = useState(isTablet ? 55 : 50);
  const isDragging = useRef(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const logoUrl = `${import.meta.env.BASE_URL}favicon.svg`;

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

  // Determine effective editor width: mobile = full width, tablet = 55%, desktop = user-adjustable
  const effectiveEditorWidthPct = isMobile ? 100 : isTablet ? 55 : editorWidthPct;

  // Whether to show the draggable divider (only on desktop)
  const showDivider = !isMobile && !isTablet;

  return (
    <div className="flex h-screen flex-col overflow-x-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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
          <img src={logoUrl} alt="Flash Resume" className="h-7 w-7" />
          {!isMobile && (
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Flash Resume</h1>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ExportBar previewRef={previewRef} />
          <button
            type="button"
            onClick={toggleLocale}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-gray-200 px-2 text-xs font-medium text-gray-600 hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            aria-label={t.switchLang}
          >
            {t.switchLang}
          </button>
          <button
            type="button"
            onClick={() => useUIStore.getState().openTutorial()}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            aria-label={t.tutorialButton}
          >
            📖
          </button>
          <ThemeToggle />
        </div>
      </header>

      {/* Body: sidebar + main */}
      <div className="flex min-h-0 flex-1">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main area: editor + resizable divider + preview */}
        <main ref={mainRef} className="flex min-h-0 flex-1 flex-col lg:flex-row min-w-0">
          {/* Editor panel - hidden on mobile when preview tab is active */}
          {(!isMobile || activeTab === 'editor') && (
            <div
              className="overflow-y-auto overflow-x-hidden p-4 max-lg:flex-1"
              style={{
                width: isMobile ? '100%' : `${effectiveEditorWidthPct}%`,
                flexShrink: 0,
                flexGrow: isMobile ? 1 : 0,
                paddingBottom: isMobile ? 'var(--mobile-tab-height)' : undefined,
              }}
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
          )}

          {/* Draggable divider - only visible on desktop (lg+), hidden on mobile and tablet */}
          {showDivider && (
            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="拖动调整面板大小"
              className="hidden lg:flex items-center justify-center w-2 cursor-col-resize bg-gray-200 hover:bg-blue-300 active:bg-blue-400 dark:bg-gray-700 dark:hover:bg-blue-600 dark:active:bg-blue-500 transition-colors flex-shrink-0 group"
              onMouseDown={handleDragStart}
            >
              <div className="w-0.5 h-8 rounded-full bg-gray-400 group-hover:bg-white dark:bg-gray-500 group-hover:dark:bg-white transition-colors" />
            </div>
          )}

          {/* Preview panel - hidden on mobile when editor tab is active */}
          {(!isMobile || activeTab === 'preview') && (
            <div
              className="flex-1 overflow-auto border-t border-gray-200 dark:border-gray-700 lg:border-l-0 lg:border-t-0 min-w-0"
              style={{
                paddingBottom: isMobile ? 'var(--mobile-tab-height)' : undefined,
              }}
            >
              <PreviewPanel ref={previewRef} />
            </div>
          )}

          {/* Mobile editor keeps an offscreen preview mounted so export has a DOM source. */}
          {isMobile && activeTab === 'editor' && (
            <div
              aria-hidden="true"
              className="pointer-events-none fixed left-[-10000px] top-0 h-[1px] w-[1px] overflow-hidden opacity-0"
            >
              <PreviewPanel ref={previewRef} />
            </div>
          )}
        </main>
      </div>

      {/* Mobile bottom tab navigation */}
      {isMobile && <MobileTabNav />}

      {/* Industry Gallery Overlay */}
      <IndustryGalleryOverlay />

      {/* Tutorial Panel */}
      <TutorialPanel />

      {/* Toast notifications */}
      {toasts.length > 0 && (
        <div className={`pointer-events-none fixed z-50 flex flex-col gap-2 ${
          isMobile
            ? 'top-4 left-4 right-4'
            : 'bottom-4 right-4'
        }`}>
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
              <span className="flex-1">{toast.message}</span>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className={`ml-1 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors ${
                  isMobile
                    ? 'min-h-[44px] min-w-[44px]'
                    : 'h-5 w-5'
                }`}
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
