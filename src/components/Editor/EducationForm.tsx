import { useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { validateDateRange } from '../../services/validationService';
import type { Education } from '../../types/resume';

export default function EducationForm() {
  const educations = useResumeStore((s) => s.resumeData.educations);
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);

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
    setDateErrors((prev) => ({
      ...prev,
      [edu.id]: result.valid ? undefined : result.error,
    }));
  };

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">教育背景</h2>

      {educations.map((edu) => (
        <div
          key={edu.id}
          className="rounded-lg border border-gray-200 bg-white p-4 space-y-3 dark:border-gray-600 dark:bg-gray-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {edu.school || '未填写学校'}
            </span>
            <button
              type="button"
              onClick={() => removeEducation(edu.id)}
              className="min-h-[44px] min-w-[44px] rounded-md px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 dark:hover:bg-red-900/20"
            >
              删除
            </button>
          </div>

          {/* 学校名称 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">学校名称</label>
            <input
              type="text"
              value={edu.school}
              onChange={(e) => handleChange(edu.id, 'school', e.target.value)}
              placeholder="请输入学校名称"
              className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          {/* 学位 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">学位</label>
            <input
              type="text"
              value={edu.degree}
              onChange={(e) => handleChange(edu.id, 'degree', e.target.value)}
              placeholder="请输入学位"
              className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          {/* 专业 */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">专业</label>
            <input
              type="text"
              value={edu.major}
              onChange={(e) => handleChange(edu.id, 'major', e.target.value)}
              placeholder="请输入专业"
              className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          {/* 起止日期 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">开始日期</label>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => handleChange(edu.id, 'startDate', e.target.value)}
                className="min-h-[44px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition-colors duration-150 focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">结束日期</label>
              <input
                type="month"
                value={edu.endDate}
                onChange={(e) => handleChange(edu.id, 'endDate', e.target.value)}
                onBlur={() => handleEndDateBlur(edu)}
                className={`min-h-[44px] w-full rounded-md border px-3 py-2 text-sm outline-none transition-colors duration-150 dark:bg-gray-800 dark:text-gray-100 ${
                  dateErrors[edu.id]
                    ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500'
                    : 'border-gray-300 bg-white focus:border-primary focus:ring-1 focus:ring-primary dark:border-gray-600'
                }`}
              />
              {dateErrors[edu.id] && (
                <p className="mt-1 text-sm text-red-500">{dateErrors[edu.id]}</p>
              )}
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addEducation}
        className="min-h-[44px] w-full rounded-md border-2 border-dashed border-gray-300 px-4 py-3 text-sm font-medium text-gray-500 hover:border-primary hover:text-primary transition-colors duration-150 dark:border-gray-600 dark:text-gray-400 dark:hover:border-primary dark:hover:text-primary"
      >
        + 添加教育背景
      </button>
    </section>
  );
}
