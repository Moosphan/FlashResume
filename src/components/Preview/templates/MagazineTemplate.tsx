import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 杂志模板 - 左窄栏放个人信息+技能+教育，右宽栏放经历+项目，
 * 顶部横跨全宽的大字姓名，整体像杂志人物专访页面
 */
export default function MagazineTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const leftIds = new Set(['personalInfo', 'skills', 'educations']);
  const rightSections = sectionOrder.filter((id) => !leftIds.has(id));

  const rightRenderers: Record<string, () => React.ReactNode> = {
    experiences: () =>
      experiences.length > 0 ? (
        <section key="exp" className="mb-5">
          <h2 className="text-[11px] font-black tracking-[0.2em] mb-3" style={{ color: themeColor }}>
            ▎{L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3 pl-3" style={{ borderLeft: `2px solid ${themeColor}30` }}>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{exp.position}</span>
                <span className="text-[10px] text-gray-400">{formatDate(exp.startDate)} – {formatDate(exp.endDate)}</span>
              </div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">{exp.company}</p>
              {exp.description && <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line leading-relaxed [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />}
            </div>
          ))}
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="proj" className="mb-5">
          <h2 className="text-[11px] font-black tracking-[0.2em] mb-3" style={{ color: themeColor }}>
            ▎{L.projects}
          </h2>
          {projects.map((p) => (
            <div key={p.id} className="mb-3 pl-3" style={{ borderLeft: `2px solid ${themeColor}30` }}>
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{p.name}</span>
                <span className="text-[10px] text-gray-400">{formatDate(p.startDate)} – {formatDate(p.endDate)}</span>
              </div>
              {p.role && <p className="text-[10px] text-gray-500 dark:text-gray-400 italic">{p.role}</p>}
              {p.description && <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line leading-relaxed [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: p.description }} />}
            </div>
          ))}
        </section>
      ) : null,
  };

  // Register custom sections into right column
  customSections.forEach((cs) => {
    rightRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="text-[11px] font-black tracking-[0.2em] mb-3" style={{ color: themeColor }}>
          ▎{cs.title}
        </h2>
        <div className="text-[10px] text-gray-600 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-sans" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
      {/* Full-width name banner */}
      <header className="px-8 pt-10 pb-4">
        <h1 className="text-4xl font-black tracking-tight leading-none" style={{ color: themeColor }}>
          {personalInfo.name || L.namePlaceholder}
        </h1>
        <div className="mt-2 h-[3px] w-16 rounded" style={{ backgroundColor: themeColor }} />
      </header>

      {/* Two-column body: left narrow, right wide */}
      <div className="flex px-8 pb-8 gap-6">
        {/* Left column - 30% */}
        <aside className="w-[30%] shrink-0 space-y-5">
          {/* Contact */}
          <section>
            <h2 className="text-[10px] font-black tracking-[0.2em] mb-2 text-gray-400 dark:text-gray-500">{L.contact}</h2>
            <div className="text-[10px] text-gray-600 dark:text-gray-400 space-y-1">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.address && <p>{personalInfo.address}</p>}
              {personalInfo.website && <p>{personalInfo.website}</p>}
            </div>
          </section>

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black tracking-[0.2em] mb-2 text-gray-400 dark:text-gray-500">{L.skills}</h2>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span key={s.id} className="text-[10px] px-1.5 py-0.5 rounded" style={{ backgroundColor: `${themeColor}12`, color: themeColor }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <section>
              <h2 className="text-[10px] font-black tracking-[0.2em] mb-2 text-gray-400 dark:text-gray-500">{L.educations}</h2>
              {educations.map((edu) => (
                <div key={edu.id} className="mb-2">
                  <p className="text-[10px] font-bold text-gray-900 dark:text-gray-100">{edu.school}</p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">{edu.degree} · {edu.major}</p>
                  <p className="text-[9px] text-gray-400">{formatDate(edu.startDate)} – {formatDate(edu.endDate)}</p>
                </div>
              ))}
            </section>
          )}
        </aside>

        {/* Right column - 70% */}
        <main className="flex-1 min-w-0">
          {rightSections.map((id) => rightRenderers[id]?.())}
          {/* Fallbacks */}
          {!sectionOrder.includes('experiences') && experiences.length > 0 && rightRenderers.experiences()}
          {!sectionOrder.includes('projects') && projects.length > 0 && rightRenderers.projects()}
        </main>
      </div>
    </div>
  );
}
