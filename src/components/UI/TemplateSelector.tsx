import { templateRegistry } from '../../services/templateRegistry';
import { useResumeStore } from '../../stores/resumeStore';
import { useUIStore } from '../../stores/uiStore';
import { useLocale } from '../../hooks/useLocale';

const PLACEHOLDER_COLORS: Record<string, string> = {
  classic: 'bg-blue-100 dark:bg-blue-900',
  modern: 'bg-purple-100 dark:bg-purple-900',
  minimal: 'bg-gray-100 dark:bg-gray-700',
};

export default function TemplateSelector() {
  // Only show general-purpose templates (non-industry) in the compact selector
  // Industry-specific templates are accessible via the gallery overlay
  const templates = templateRegistry.getAll().filter((tpl) => !tpl.id.endsWith('-industry'));
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const setTemplate = useResumeStore((s) => s.setTemplate);
  const { t } = useLocale();
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
            <div
              className={`flex h-20 w-16 items-center justify-center rounded text-xs font-medium text-gray-600 dark:text-gray-300 ${
                PLACEHOLDER_COLORS[tpl.id] ?? 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {tpl.name}
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">{tpl.name}</span>
          </button>
        );
      })}
      </div>
      <button
        type="button"
        onClick={openGallery}
        className="mt-2 w-full rounded-lg border-2 border-dashed border-gray-300 px-3 py-2 text-sm text-gray-500 hover:border-gray-400 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:border-gray-500 dark:hover:text-gray-300 transition-colors"
      >
        {t.browseMoreTemplates}
      </button>
    </div>
  );
}
