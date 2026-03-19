import { useResumeStore } from '../../stores/resumeStore';
import { useLocale } from '../../hooks/useLocale';
import type { CustomSection } from '../../types/resume';
import RichTextEditor from '../UI/RichTextEditor';

interface Props {
  sectionId: string;
}

export default function SingleCustomSectionEditor({ sectionId }: Props) {
  const section = useResumeStore((s) =>
    s.resumeData.customSections.find((cs) => cs.id === sectionId),
  );
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection);
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection);
  const { t } = useLocale();

  if (!section) return null;

  const handleChange = (field: keyof CustomSection, value: string) => {
    updateCustomSection(sectionId, { [field]: value });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={() => removeCustomSection(sectionId)}
          className="min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 dark:hover:bg-red-900/20"
        >
          {t.delete}
        </button>
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t.sectionTitle}
        </label>
        <input
          type="text"
          value={section.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder={t.sectionTitlePh}
          className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          {t.sectionContent}
        </label>
        <RichTextEditor
          value={section.content}
          onChange={(html) => handleChange('content', html)}
          placeholder={t.sectionContentPh}
        />
      </div>
    </div>
  );
}
