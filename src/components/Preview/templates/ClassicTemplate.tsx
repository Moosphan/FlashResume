import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 经典模板 - 传统布局，清晰的分隔线，左对齐，衬线风格
 */
export default function ClassicTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

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
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{exp.position}</h3>
                <span className="text-xs text-gray-500">
                  {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 italic">{exp.company}</p>
              {exp.description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
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
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{edu.school}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                {edu.degree} · {edu.major}
              </p>
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
                className="text-xs px-2 py-1 rounded border"
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
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">{proj.name}</h3>
                <span className="text-xs text-gray-500">
                  {formatDate(proj.startDate)} - {formatDate(proj.endDate)}
                </span>
              </div>
              {proj.role && <p className="text-sm text-gray-700 dark:text-gray-300 italic">{proj.role}</p>}
              {proj.description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
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
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      {/* Header - Personal Info (always first) */}
      <header className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: themeColor }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: themeColor }}>
          {personalInfo.name || L.namePlaceholder}
        </h1>
        <div className="text-xs text-gray-600 dark:text-gray-400 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
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
