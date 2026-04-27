import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 经典模板 - 传统布局，清晰的分隔线，左对齐，衬线风格
 */
export default function ClassicTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language, data.sectionTitles);
  const contactItemCls = 'inline-flex max-w-full items-center whitespace-nowrap';
  const itemTitleRowCls = 'flex items-start justify-between gap-4';
  const itemMainCls = 'min-w-0 flex-1';
  const itemDateCls = 'shrink-0 pl-4 text-right text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null, // Header is always rendered at top
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2
            className="text-lg font-bold tracking-wide pb-1 mb-3 border-b-2"
            style={{ color: themeColor, borderColor: themeColor }}
          >
            {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className={itemTitleRowCls}>
                <div className={itemMainCls}>
                  <h3 className="font-bold text-sm leading-tight text-gray-900 break-words dark:text-gray-100">{exp.position}</h3>
                  <p className="mt-0.5 text-sm italic leading-tight text-gray-700 break-words dark:text-gray-300">{exp.company}</p>
                </div>
                <span className={itemDateCls}>
                  {formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}
                </span>
              </div>
              {exp.description && (
                <div className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-gray-600 dark:text-gray-400 [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-5">
          <h2
            className="text-lg font-bold tracking-wide pb-1 mb-3 border-b-2"
            style={{ color: themeColor, borderColor: themeColor }}
          >
            {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className={itemTitleRowCls}>
                <div className={itemMainCls}>
                  <h3 className="font-bold text-sm leading-tight text-gray-900 break-words dark:text-gray-100">{edu.school}</h3>
                  <p className="mt-0.5 text-sm leading-tight text-gray-700 break-words dark:text-gray-300">
                    {edu.degree} · {edu.major}
                  </p>
                </div>
                <span className={itemDateCls}>
                  {formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}
                </span>
              </div>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2
            className="text-lg font-bold tracking-wide pb-1 mb-3 border-b-2"
            style={{ color: themeColor, borderColor: themeColor }}
          >
            {L.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="rounded border px-2 py-1 text-xs leading-none whitespace-nowrap"
                style={{ borderColor: themeColor, color: themeColor }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2
            className="text-lg font-bold tracking-wide pb-1 mb-3 border-b-2"
            style={{ color: themeColor, borderColor: themeColor }}
          >
            {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className={itemTitleRowCls}>
                <div className={itemMainCls}>
                  <h3 className="font-bold text-sm leading-tight text-gray-900 break-words dark:text-gray-100">{proj.name}</h3>
                  {proj.role && <p className="mt-0.5 text-sm italic leading-tight text-gray-700 break-words dark:text-gray-300">{proj.role}</p>}
                </div>
                <span className={itemDateCls}>
                  {formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}
                </span>
              </div>
              {proj.description && (
                <div className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-gray-600 dark:text-gray-400 [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
  };

  // Register custom section renderers
  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2
          className="text-lg font-bold tracking-wide pb-1 mb-3 border-b-2"
          style={{ color: themeColor, borderColor: themeColor }}
        >
          {cs.title}
        </h2>
        <div className="text-xs text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  return (
    <div
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-8 font-serif"
      style={{ width: 794, minHeight: 1123, boxSizing: 'border-box' }}
    >
      {/* Header - Personal Info (always first) */}
      <header className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: themeColor }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: themeColor }}>
          {personalInfo.name || L.namePlaceholder}
        </h1>
        <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {personalInfo.email && <span className={contactItemCls}>{personalInfo.email}</span>}
          {personalInfo.phone && <span className={contactItemCls}>{personalInfo.phone}</span>}
          {personalInfo.address && <span className={contactItemCls}>{personalInfo.address}</span>}
          {personalInfo.website && <span className={contactItemCls}>{personalInfo.website}</span>}
        </div>
      </header>

      {/* Sections rendered in sectionOrder */}
      {sectionOrder.map((sectionId) => sectionRenderers[sectionId]?.())}

      {/* Fallback: render built-in sections that have content but are missing from sectionOrder */}
      {!sectionOrder.includes('experiences') && experiences.length > 0 && sectionRenderers.experiences()}
      {!sectionOrder.includes('projects') && projects.length > 0 && sectionRenderers.projects()}
      {!sectionOrder.includes('educations') && educations.length > 0 && sectionRenderers.educations()}
      {!sectionOrder.includes('skills') && skills.length > 0 && sectionRenderers.skills()}
    </div>
  );
}
