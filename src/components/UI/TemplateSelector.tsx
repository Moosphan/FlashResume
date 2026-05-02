import React from 'react';
import { templateRegistry } from '../../services/templateRegistry';
import type { ExtendedTemplateDefinition, ResumeData } from '../../types/resume';
import { useResumeStore } from '../../stores/resumeStore';
import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';
import type { Locale } from '../../utils/i18n';

const THUMBNAIL_FRAME_WIDTH = 64;
const THUMBNAIL_FRAME_HEIGHT = 80;
const THUMBNAIL_PAGE_WIDTH = 794;
const THUMBNAIL_PAGE_HEIGHT = 1123;
const THUMBNAIL_SCALE = Math.min(
  THUMBNAIL_FRAME_WIDTH / THUMBNAIL_PAGE_WIDTH,
  THUMBNAIL_FRAME_HEIGHT / THUMBNAIL_PAGE_HEIGHT,
);

interface ThumbnailErrorBoundaryState {
  hasError: boolean;
}

class ThumbnailErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackLabel: string },
  ThumbnailErrorBoundaryState
> {
  state: ThumbnailErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ThumbnailErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gray-100 px-2 text-center text-[9px] font-medium text-gray-400 dark:bg-gray-800 dark:text-gray-500">
          {this.props.fallbackLabel}
        </div>
      );
    }
    return this.props.children;
  }
}

function TemplateSelectorThumbnail({
  template,
  resumeData,
  themeColor,
  locale,
}: {
  template: ExtendedTemplateDefinition;
  resumeData: ResumeData;
  themeColor: string;
  locale: Locale;
}) {
  const registered = templateRegistry.getById(template.id);
  const TemplateComponent = registered?.component ?? template.component;

  return (
    <div
      data-testid={`template-preview-${template.id}`}
      className="relative h-20 w-16 overflow-hidden rounded-md border border-gray-200 bg-white shadow-[0_6px_18px_rgba(15,23,42,0.08)] dark:border-gray-700"
    >
      <ThumbnailErrorBoundary fallbackLabel={template.name}>
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: THUMBNAIL_PAGE_WIDTH,
            height: THUMBNAIL_PAGE_HEIGHT,
            transform: `translate(-50%, -50%) scale(${THUMBNAIL_SCALE})`,
            transformOrigin: 'center center',
            pointerEvents: 'none',
          }}
        >
          <TemplateComponent data={resumeData} themeColor={themeColor} language={locale} />
        </div>
      </ThumbnailErrorBoundary>
    </div>
  );
}

export default function TemplateSelector() {
  // Only show general-purpose templates (non-industry) in the compact selector
  // Industry-specific templates are accessible via the gallery overlay
  const templates = templateRegistry.getAll().filter((tpl) => !tpl.id.endsWith('-industry'));
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const resumeData = useResumeStore((s) => s.resumeData);
  const themeColor = useResumeStore((s) => s.themeColor);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const { locale, t } = useLocale();
  const openGallery = useUIStore((s) => s.openGallery);

  return (
    <div>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {templates.map((tpl) => {
          const isSelected = tpl.id === selectedTemplateId;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => setTemplate(tpl.id)}
              className={`flex min-h-[44px] min-w-[44px] flex-shrink-0 flex-col items-center gap-1.5 rounded-lg border-2 p-2 transition-all duration-200 ${
                isSelected
                  ? 'border-primary ring-2 ring-primary/30'
                  : 'border-gray-200 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-400'
              }`}
              aria-pressed={isSelected}
              aria-label={`${t.selectTemplate}：${tpl.name}`}
            >
              <TemplateSelectorThumbnail
                template={tpl}
                resumeData={resumeData}
                themeColor={themeColor}
                locale={locale}
              />
              <span className="w-16 text-center text-xs text-gray-700 dark:text-gray-300">
                {locale === 'zh' ? tpl.name : tpl.nameEn || tpl.name}
              </span>
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={openGallery}
        className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-primary/20 bg-primary/8 px-4 py-3 text-sm font-semibold text-primary shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/12 hover:shadow-md dark:border-primary/25 dark:bg-primary/12 dark:text-blue-300 dark:hover:border-primary/40 dark:hover:bg-primary/18"
      >
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
          <path d="M3 10h14" />
          <path d="M10 3v14" />
        </svg>
        {t.browseMoreTemplates}
      </button>
    </div>
  );
}
