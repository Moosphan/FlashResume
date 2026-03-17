import { useResumeStore } from '../../stores/resumeStore';
import { useLocale } from '../../hooks/useLocale';
import type { CustomSection } from '../../types/resume';
import RichTextEditor from '../UI/RichTextEditor';

export default function CustomSectionForm() {
  const customSections = useResumeStore((s) => s.resumeData.customSections);
  const addCustomSection = useResumeStore((s) => s.addCustomSection);
  const updateCustomSection = useResumeStore((s) => s.updateCustomSection);
  const removeCustomSection = useResumeStore((s) => s.removeCustomSection);
  const { t } = useLocale();

  const handleChange = (id: string, field: keyof CustomSection, value: string) => {
    updateCustomSection(id, { [field]: value });
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t.customSections}</h2>
      {customSections.map((sec) => (
        <div key={sec.id} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3 dark:border-gray-600 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{sec.title || t.unnamedSection}</span>
            <button type="button" onClick={() => removeCustomSection(sec.id)} className="min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 dark:hover:bg-red-900/20">{t.delete}</button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.sectionTitle}</label>
            <input type="text" value={sec.title} onChange={(e) => handleChange(sec.id, 'title', e.target.value)} placeholder={t.sectionTitlePh}
              className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.sectionContent}</label>
            <RichTextEditor value={sec.content} onChange={(html) => handleChange(sec.id, 'content', html)} placeholder={t.sectionContentPh} />
          </div>
        </div>
      ))}
      <button type="button" onClick={addCustomSection} className="min-h-[44px] w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition-colors duration-150 dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary dark:hover:text-primary">
        {t.addSection}
      </button>
    </section>
  );
}
