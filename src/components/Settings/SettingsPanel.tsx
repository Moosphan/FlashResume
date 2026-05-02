import { Fragment, useCallback, useEffect, useState, type ReactElement, type ReactNode } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';
import { setLocale } from '../../utils/i18n';
import { TUTORIAL_DATA } from '../../data/tutorialData';
import TutorialCard from '../Tutorial/TutorialCard';
import { APP_VERSION } from '../../constants/app';
import changelogEn from '../../../CHANGELOG.md?raw';
import changelogZh from '../../../CHANGELOG.zh.md?raw';

type SettingsView = 'menu' | 'changelog' | 'tutorial';

type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; text: string }
  | { type: 'code'; text: string };

function parseMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: MarkdownBlock[] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      i += 1;
      continue;
    }

    if (trimmed.startsWith('```')) {
      const codeLines: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i += 1;
      }
      if (i < lines.length) i += 1;
      blocks.push({ type: 'code', text: codeLines.join('\n') });
      continue;
    }

    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, text: trimmed.slice(4).trim() });
      i += 1;
      continue;
    }

    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, text: trimmed.slice(3).trim() });
      i += 1;
      continue;
    }

    if (trimmed.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, text: trimmed.slice(2).trim() });
      i += 1;
      continue;
    }

    if (trimmed.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length) {
        const listLine = lines[i].trim();
        if (!listLine.startsWith('- ')) break;
        items.push(listLine.slice(2).trim());
        i += 1;
      }
      blocks.push({ type: 'list', items });
      continue;
    }

    const paragraphLines = [trimmed];
    i += 1;
    while (i < lines.length) {
      const next = lines[i].trim();
      if (
        !next ||
        next.startsWith('# ') ||
        next.startsWith('## ') ||
        next.startsWith('### ') ||
        next.startsWith('- ') ||
        next.startsWith('```')
      ) {
        break;
      }
      paragraphLines.push(next);
      i += 1;
    }
    blocks.push({ type: 'paragraph', text: paragraphLines.join(' ') });
  }

  return blocks;
}

function renderInlineMarkdown(text: string): Array<string | ReactElement> {
  const parts = text.split(/(`[^`]+`)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={`code-${index}`}
          className="rounded bg-gray-200 px-1.5 py-0.5 text-[0.9em] text-gray-800 dark:bg-gray-700 dark:text-gray-100"
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    return part;
  });
}

function renderMarkdown(markdown: string): ReactNode {
  const blocks = parseMarkdown(markdown);

  return (
    <div className="space-y-4 text-sm leading-6 text-gray-700 dark:text-gray-200">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          if (block.level === 1) {
            return (
              <h1 key={index} className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {renderInlineMarkdown(block.text)}
              </h1>
            );
          }

          if (block.level === 2) {
            return (
              <h2 key={index} className="pt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
                {renderInlineMarkdown(block.text)}
              </h2>
            );
          }

          return (
            <h3 key={index} className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {renderInlineMarkdown(block.text)}
            </h3>
          );
        }

        if (block.type === 'list') {
          return (
            <ul key={index} className="space-y-2 pl-5">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="list-disc">
                  {renderInlineMarkdown(item)}
                </li>
              ))}
            </ul>
          );
        }

        if (block.type === 'code') {
          return (
            <pre
              key={index}
              className="overflow-x-auto rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            >
              <code>{block.text}</code>
            </pre>
          );
        }

        return (
          <p key={index}>
            {renderInlineMarkdown(block.text).map((node, nodeIndex) => (
              <Fragment key={nodeIndex}>{node}</Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}

export default function SettingsPanel() {
  const settingsOpen = useUIStore((s) => s.settingsOpen);
  const themeMode = useUIStore((s) => s.themeMode);
  const toggleThemeMode = useUIStore((s) => s.toggleThemeMode);
  const { locale, t } = useLocale();
  const [view, setView] = useState<SettingsView>('menu');
  const changelogContent = locale === 'zh' ? changelogZh : changelogEn;

  const handleClose = useCallback(() => {
    useUIStore.getState().closeSettings();
  }, []);

  useEffect(() => {
    if (!settingsOpen) {
      setView('menu');
      return;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view !== 'menu') {
          setView('menu');
          return;
        }
        handleClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleClose, settingsOpen, view]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[9998] bg-black/40 transition-opacity duration-300 ${
          settingsOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 right-0 z-[9999] h-full w-full sm:w-[420px] bg-white dark:bg-gray-900 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
          settingsOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-panel-title"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div>
            <h2 id="settings-panel-title" className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {view === 'menu'
                ? t.settingsTitle
                : view === 'changelog'
                  ? t.changelogTitle
                  : t.tutorialTitle}
            </h2>
            {view === 'changelog' && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t.changelogDescription}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={handleClose}
            aria-label={t.closeSettings}
            className="text-sm px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {t.closeSettings}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {view === 'menu' && (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setView('tutorial')}
                className="flex w-full items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-left transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t.tutorialButton}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    {t.tutorialHint}
                  </span>
                </span>
                <span className="ml-4 text-gray-400 dark:text-gray-500">›</span>
              </button>
              <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t.languageSetting}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    {t.languageSettingHint}
                  </span>
                </span>
                <label className="relative ml-4">
                  <span className="sr-only">{t.languageSetting}</span>
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value as 'zh' | 'en')}
                    className="min-h-[40px] appearance-none rounded-full border border-gray-300 bg-white pl-4 pr-10 text-sm font-medium text-gray-700 outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200"
                    aria-label={t.languageSetting}
                  >
                    <option value="zh">中文</option>
                    <option value="en">English</option>
                  </select>
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 dark:text-gray-500">
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 7 5 5 5-5" />
                    </svg>
                  </span>
                </label>
              </div>
              <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t.themeModeSetting}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    {t.themeModeSettingHint}
                  </span>
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={themeMode === 'dark'}
                  aria-label={t.themeModeSetting}
                  onClick={toggleThemeMode}
                  className={`ml-4 inline-flex h-7 w-12 items-center rounded-full border transition-colors ${
                    themeMode === 'dark'
                      ? 'border-gray-700 bg-gray-900'
                      : 'border-gray-300 bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${
                      themeMode === 'dark' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setView('changelog')}
                className="flex w-full items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 text-left transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t.changelogTitle}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    {t.changelogHint}
                  </span>
                </span>
                <span className="ml-4 text-gray-400 dark:text-gray-500">›</span>
              </button>
              <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800">
                <span>
                  <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t.aboutVersionTitle}
                  </span>
                  <span className="mt-1 block text-xs text-gray-500 dark:text-gray-400">
                    {t.aboutVersionHint}
                  </span>
                </span>
                <span className="ml-4 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-200">
                  {APP_VERSION}
                </span>
              </div>
            </div>
          )}

          {view === 'changelog' && (
            <div>
              <button
                type="button"
                onClick={() => setView('menu')}
                className="mb-4 min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t.backToSettings}
              </button>
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                {renderMarkdown(changelogContent)}
              </div>
            </div>
          )}

          {view === 'tutorial' && (
            <div>
              <button
                type="button"
                onClick={() => setView('menu')}
                className="mb-4 min-h-[44px] rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {t.backToSettings}
              </button>
              {TUTORIAL_DATA.map((category) => (
                <div key={category.categoryKeyEn} className="mb-6">
                  <h3 className="mb-3 text-base font-semibold text-gray-900 dark:text-gray-100">
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
          )}
        </div>
      </div>
    </>
  );
}
