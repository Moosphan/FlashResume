import { useEffect, useCallback } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';
import { TUTORIAL_DATA } from '../../data/tutorialData';
import TutorialCard from './TutorialCard';

export default function TutorialPanel() {
  const tutorialOpen = useUIStore((s) => s.tutorialOpen);
  const { locale, t } = useLocale();

  const handleClose = useCallback(() => {
    useUIStore.getState().closeTutorial();
  }, []);

  useEffect(() => {
    if (!tutorialOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [tutorialOpen, handleClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[9998] bg-black/40 transition-opacity duration-300 ${
          tutorialOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 z-[9999] h-full w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          tutorialOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label={t.tutorialTitle}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t.tutorialTitle}
          </h2>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.closeTutorial}
            className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {t.closeTutorial}
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {TUTORIAL_DATA.map((category) => (
            <div key={category.categoryKeyEn} className="mb-6">
              <h3 className="text-base font-semibold text-gray-800 dark:text-gray-200 mb-3">
                {locale === 'zh' ? category.categoryKeyZh : category.categoryKeyEn}
              </h3>
              {category.items.map((item) => (
                <TutorialCard
                  key={item.titleEn}
                  title={locale === 'zh' ? item.titleZh : item.titleEn}
                  content={locale === 'zh' ? item.contentZh : item.contentEn}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
