import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { validateDateRange } from '../../services/validationService';
import { useLocale } from '../../hooks/useLocale';
import type { Project } from '../../types/resume';
import RichTextEditor from '../UI/RichTextEditor';

export default function ProjectForm() {
  const projects = useResumeStore((s) => s.resumeData.projects);
  const addProject = useResumeStore((s) => s.addProject);
  const updateProject = useResumeStore((s) => s.updateProject);
  const removeProject = useResumeStore((s) => s.removeProject);
  const { t } = useLocale();

  const [dateErrors, setDateErrors] = useState<Record<string, string | undefined>>({});

  const handleChange = (id: string, field: keyof Project, value: string) => {
    updateProject(id, { [field]: value });
  };

  const handleEndDateBlur = (proj: Project) => {
    if (!proj.startDate || !proj.endDate) {
      setDateErrors((prev) => ({ ...prev, [proj.id]: undefined }));
      return;
    }
    const result = validateDateRange(proj.startDate, proj.endDate);
    setDateErrors((prev) => ({ ...prev, [proj.id]: result.valid ? undefined : result.error }));
  };

  const inputCls = 'min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base md:text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500';

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{t.projects}</h2>
      {projects.map((proj) => (
        <div key={proj.id} className="rounded-lg border border-gray-200 bg-white p-4 space-y-3 dark:border-gray-600 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{proj.name || t.unfilledProject}</span>
            <button type="button" onClick={() => removeProject(proj.id)} className="min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-base md:text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 dark:hover:bg-red-900/20">{t.delete}</button>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.projectName}</label>
            <input type="text" value={proj.name} onChange={(e) => handleChange(proj.id, 'name', e.target.value)} placeholder={t.projectPh} className={inputCls} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.projectRole}</label>
            <input type="text" value={proj.role} onChange={(e) => handleChange(proj.id, 'role', e.target.value)} placeholder={t.projectRolePh} className={inputCls} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.startDate}</label>
              <input type="month" value={proj.startDate} onChange={(e) => handleChange(proj.id, 'startDate', e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.endDate}</label>
              <input type="month" value={proj.endDate} onChange={(e) => handleChange(proj.id, 'endDate', e.target.value)} onBlur={() => handleEndDateBlur(proj)}
                className={`${inputCls} ${dateErrors[proj.id] ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : ''}`} />
              {dateErrors[proj.id] && <p className="mt-1 text-sm text-red-500">{dateErrors[proj.id]}</p>}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">{t.projectDesc}</label>
            <RichTextEditor value={proj.description} onChange={(html) => handleChange(proj.id, 'description', html)} placeholder={t.projectDescPh} />
          </div>
        </div>
      ))}
      <button type="button" onClick={addProject} className="min-h-[44px] w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-3 text-base md:text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition-colors duration-150 dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary dark:hover:text-primary">
        {t.addProject}
      </button>
    </section>
  );
}
