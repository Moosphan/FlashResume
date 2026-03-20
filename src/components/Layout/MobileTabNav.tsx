import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';

/**
 * Bottom tab navigation for mobile viewport.
 * Fixed at the bottom of the screen with two tabs: Editor and Preview.
 * Adapts to iOS safe area via env(safe-area-inset-bottom).
 */
export default function MobileTabNav() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const { t } = useLocale();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 transition-colors"
      style={{
        height: `calc(var(--mobile-tab-height) + env(safe-area-inset-bottom, 0px))`,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
      aria-label="Mobile navigation"
    >
      <button
        type="button"
        onClick={() => setActiveTab('editor')}
        className={`flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] transition-colors ${
          activeTab === 'editor'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-500 dark:text-gray-400'
        }`}
        aria-current={activeTab === 'editor' ? 'page' : undefined}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
        <span className="text-xs font-medium">{t.mobileTabEditor}</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab('preview')}
        className={`flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] min-w-[44px] transition-colors ${
          activeTab === 'preview'
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-gray-500 dark:text-gray-400'
        }`}
        aria-current={activeTab === 'preview' ? 'page' : undefined}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-xs font-medium">{t.mobileTabPreview}</span>
      </button>
    </nav>
  );
}
