import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 现代模板 - 双栏布局，左侧边栏放技能/联系方式，右侧主内容区，现代无衬线风格
 */
export default function ModernTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  // Sidebar sections: personalInfo contact details + skills
  const sidebarSectionIds = new Set(['personalInfo', 'skills']);

  // Main content sections: everything else, in sectionOrder
  const mainSections = sectionOrder.filter((id) => !sidebarSectionIds.has(id));

  const mainRenderers: Record<string, () => React.ReactNode> = {
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-sm font-bold tracking-widest mb-3" style={{ color: themeColor }}>
            {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{exp.position}</h3>
                <span className="text-xs text-gray-400">
                  {formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">{exp.company}</p>
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
          <h2 className="text-sm font-bold tracking-widest mb-3" style={{ color: themeColor }}>
            {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{edu.school}</h3>
                <span className="text-xs text-gray-400">
                  {formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {edu.degree} · {edu.major}
              </p>
            </div>
          ))}
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="text-sm font-bold tracking-widest mb-3" style={{ color: themeColor }}>
            {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">{proj.name}</h3>
                <span className="text-xs text-gray-400">
                  {formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}
                </span>
              </div>
              {proj.role && <p className="text-xs text-gray-500 dark:text-gray-400">{proj.role}</p>}
              {proj.description && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
  };

  // Register custom section renderers for main area
  customSections.forEach((cs) => {
    mainRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="text-sm font-bold tracking-widest mb-3" style={{ color: themeColor }}>
          {cs.title}
        </h2>
        <div className="text-xs text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  return (
    <div
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-sans flex"
      style={{ width: 794, minHeight: 1123, boxSizing: 'border-box' }}
    >
      {/* Sidebar */}
      <aside className="w-1/3 p-6 text-white" style={{ backgroundColor: themeColor }}>
        {/* Avatar + Name */}
        <div className="mb-6 text-center">
          {personalInfo.avatar && (
            <img
              src={personalInfo.avatar}
              alt="头像"
              className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-white/30 object-cover"
            />
          )}
          <h1 className="text-xl font-bold">{personalInfo.name || L.namePlaceholder}</h1>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <h2 className="text-xs font-bold tracking-widest mb-2 opacity-80">{L.contact}</h2>
          <div className="space-y-1 text-xs opacity-90">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.address && <p>{personalInfo.address}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-widest mb-2 opacity-80">{L.skills}</h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill.name}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full bg-white/80"
                      style={{
                        width:
                          skill.level === 'expert'
                            ? '100%'
                            : skill.level === 'advanced'
                              ? '75%'
                              : skill.level === 'intermediate'
                                ? '50%'
                                : '25%',
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-6">
        {mainSections.map((sectionId) => mainRenderers[sectionId]?.())}

        {/* Fallback: render sections that have content but are missing from sectionOrder */}
        {!sectionOrder.includes('experiences') && experiences.length > 0 && mainRenderers.experiences?.()}
        {!sectionOrder.includes('projects') && projects.length > 0 && mainRenderers.projects?.()}
        {!sectionOrder.includes('educations') && educations.length > 0 && mainRenderers.educations?.()}
      </main>
    </div>
  );
}
