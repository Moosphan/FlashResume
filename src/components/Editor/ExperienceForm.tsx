import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { validateDateRange } from '../../services/validationService';
import type { Experience } from '../../types/resume';

export default function ExperienceForm() {
  const experiences = useResumeStore((s) => s.resumeData.experiences);
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);

  const [dateErrors, setDateErrors] = useState<Record<string, string | undefined>>({});

  const handleChange = (id: string, field: keyof Experience, value: string) => {
    updateExperience(id, { [field]: value });
  };

  const handleEndDateBlur = (exp: Experience) => {
    if (!exp.startDate || !exp.endDate) {
      setDateErrors((prev) => ({ ...prev, [exp.id]: undefined }));
      return;
    }
    const result = validateDateRange(exp.startDate, exp.endDate);
    setDateErrors((prev) => ({
      ...prev,
      [exp.id]: result.valid ? undefined : result.error,
    }));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">工作经历</h2>

      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="rounded-lg border border-gray-200 bg-white p-4 space-y-3 dark:border-gray-600 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {exp.company || '未填写公司'}
            </span>
            <button
              type="button"
              onClick={() => removeExperience(exp.id)}
              className="min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 dark:hover:bg-red-900/20"
            >
              删除
            </button>
          </div>

          {/* 公司名称 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">公司名称</label>
            <input
              type="text"
              value={exp.company}
              onChange={(e) => handleChange(exp.id, 'company', e.target.value)}
              placeholder="请输入公司名称"
              className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          {/* 职位 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">职位</label>
            <input
              type="text"
              value={exp.position}
              onChange={(e) => handleChange(exp.id, 'position', e.target.value)}
              placeholder="请输入职位"
              className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          {/* 起止日期 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">开始日期</label>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => handleChange(exp.id, 'startDate', e.target.value)}
                className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">结束日期</label>
              <input
                type="month"
                value={exp.endDate}
                onChange={(e) => handleChange(exp.id, 'endDate', e.target.value)}
                onBlur={() => handleEndDateBlur(exp)}
                className={`min-h-[44px] w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-gray-100 ${
                  dateErrors[exp.id]
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-gray-300 bg-white focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600'
                }`}
              />
              {dateErrors[exp.id] && (
                <p className="mt-1 text-sm text-red-500">{dateErrors[exp.id]}</p>
              )}
            </div>
          </div>

          {/* 工作描述 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">工作描述</label>
            <textarea
              value={exp.description}
              onChange={(e) => handleChange(exp.id, 'description', e.target.value)}
              placeholder="请描述工作内容和成就"
              rows={3}
              className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500 resize-y"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExperience}
        className="min-h-[44px] w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition-colors duration-150 dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary dark:hover:text-primary"
      >
        + 添加工作经历
      </button>
    </section>
  );
}
