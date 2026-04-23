import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 极简模板 - 单栏布局，大量留白，极少装饰，干净清爽
 */
export default function MinimalTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language, data.sectionTitles);

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null, // Header always at top
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-8">
          <h2 className="text-xs font-semibold tracking-[0.2em] mb-4" style={{ color: themeColor }}>
            {L.experiences}
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{exp.position}</span>
                  <span className="text-xs text-gray-400">
                    {formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{exp.company}</p>
                {exp.description && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-8">
          <h2 className="text-xs font-semibold tracking-[0.2em] mb-4" style={{ color: themeColor }}>
            {L.educations}
          </h2>
          <div className="space-y-3">
            {educations.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{edu.school}</span>
                  <span className="text-xs text-gray-400">
                    {formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {edu.degree} · {edu.major}
                </p>
              </div>
            ))}
          </div>
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-8">
          <h2 className="text-xs font-semibold tracking-[0.2em] mb-4" style={{ color: themeColor }}>
            {L.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs text-gray-600 dark:text-gray-400">
                {skill.name}
                {skills.indexOf(skill) < skills.length - 1 && (
                  <span className="ml-2" style={{ color: themeColor }}>·</span>
                )}
              </span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-8">
          <h2 className="text-xs font-semibold tracking-[0.2em] mb-4" style={{ color: themeColor }}>
            {L.projects}
          </h2>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{proj.name}</span>
                  <span className="text-xs text-gray-400">
                    {formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}
                  </span>
                </div>
                {proj.role && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{proj.role}</p>}
                {proj.description && (
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,
  };

  // Register custom section renderers
  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-8">
        <h2 className="text-xs font-semibold tracking-[0.2em] mb-4" style={{ color: themeColor }}>
          {cs.title}
        </h2>
        <div className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  return (
    <div
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-sans px-12 py-10"
      style={{ width: 794, minHeight: 1123, boxSizing: 'border-box' }}
    >
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-2xl font-light tracking-wide text-gray-900 dark:text-gray-100">
          {personalInfo.name || L.namePlaceholder}
        </h1>
        <div className="mt-2 h-px w-12" style={{ backgroundColor: themeColor }} />
        <div className="mt-3 flex flex-wrap gap-x-4 text-xs text-gray-400 dark:text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {/* Sections in order */}
      {sectionOrder.map((sectionId) => sectionRenderers[sectionId]?.())}

      {/* Fallback: render built-in sections that have content but are missing from sectionOrder */}
      {!sectionOrder.includes('experiences') && experiences.length > 0 && sectionRenderers.experiences()}
      {!sectionOrder.includes('projects') && projects.length > 0 && sectionRenderers.projects()}
      {!sectionOrder.includes('educations') && educations.length > 0 && sectionRenderers.educations()}
      {!sectionOrder.includes('skills') && skills.length > 0 && sectionRenderers.skills()}
    </div>
  );
}
