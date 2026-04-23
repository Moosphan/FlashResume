import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { validateDateRange } from '../../services/validationService';
import { useLocale } from '../../hooks/useLocale';
import type { Education } from '../../types/resume';
import EditableSectionTitle from './EditableSectionTitle';

export default function EducationForm() {
  const educations = useResumeStore((s) => s.resumeData.educations);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);
  const { t } = useLocale();

  const [dateErrors, setDateErrors] = useState<Record<string, string | undefined>>({});

  const handleChange = (id: string, field: keyof Education, value: string) => {
    updateEducation(id, { [field]: value });
  };

  const handleEndDateBlur = (edu: Education) => {
    if (!edu.startDate || !edu.endDate) {
      setDateErrors((prev) => ({ ...prev, [edu.id]: undefined }));
      return;
    }
    const result = validateDateRange(edu.startDate, edu.endDate);
    setDateErrors((prev) => ({ ...prev, [edu.id]: result.valid ? undefined : result.error }));
  };

  const inputCls = 'min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base md:text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500';

  return (
    <section className="space-y-4">
      <EditableSectionTitle sectionId="educations" />
      {educations.map((edu) => (
        <div key={edu.id} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3 dark:border-gray-600 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{edu.school || t.unfilledSchool}</span>
            <button type="button" onClick={() => removeEducation(edu.id)} className="min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-base md:text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 dark:hover:bg-red-900/20">{t.delete}</button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.schoolName}</label>
            <input type="text" value={edu.school} onChange={(e) => handleChange(edu.id, 'school', e.target.value)} placeholder={t.schoolPh} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.degree}</label>
            <input type="text" value={edu.degree} onChange={(e) => handleChange(edu.id, 'degree', e.target.value)} placeholder={t.degreePh} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.major}</label>
            <input type="text" value={edu.major} onChange={(e) => handleChange(edu.id, 'major', e.target.value)} placeholder={t.majorPh} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.startDate}</label>
              <input type="month" value={edu.startDate} onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.endDate}</label>
              <input type="month" value={edu.endDate} onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)} onBlur={() => handleEndDateBlur(edu)}
                className={`min-h-[44px] w-full rounded-md border px-3 py-2 text-base md:text-sm outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-gray-100 ${dateErrors[edu.id] ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-gray-300 bg-white focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600'}`} />
              {dateErrors[edu.id] && <p className="mt-1 text-sm text-red-500">{dateErrors[edu.id]}</p>}
            </div>
          </div>
        </div>
      ))}
      <button type="button" onClick={addEducation} className="min-h-[44px] w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-3 text-base md:text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition-colors duration-150 dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary dark:hover:text-primary">
        {t.addEducation}
      </button>
    </section>
  );
}
