import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 科技/互联网行业模板 - 深色侧边栏 + 浅色主内容区双栏布局，技能进度条，终端风格装饰
 */
export default function TechTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const accent = themeColor || '#0f9690';
  const sidebarBg = '#1a1a2e';

  const sidebarSectionIds = new Set(['personalInfo', 'skills']);
  const mainSections = sectionOrder.filter((id) => !sidebarSectionIds.has(id));

  const mainRenderers: Record<string, () => React.ReactNode> = {
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-sm font-bold tracking-widest mb-3 pb-1 border-b border-dashed" style={{ color: accent, borderColor: accent }}>
            {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900">{exp.position}</h3>
                <span className="text-xs text-gray-400">{formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}</span>
              </div>
              <p className="text-xs text-gray-500">{exp.company}</p>
              {exp.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-5">
          <h2 className="text-sm font-bold tracking-widest mb-3 pb-1 border-b border-dashed" style={{ color: accent, borderColor: accent }}>
            {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900">{edu.school}</h3>
                <span className="text-xs text-gray-400">{formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}</span>
              </div>
              <p className="text-xs text-gray-500">{edu.degree} · {edu.major}</p>
            </div>
          ))}
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="text-sm font-bold tracking-widest mb-3 pb-1 border-b border-dashed" style={{ color: accent, borderColor: accent }}>
            {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-mono font-semibold text-sm text-gray-900">{proj.name}</h3>
                <span className="text-xs text-gray-400">{formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}</span>
              </div>
              {proj.role && <p className="text-xs text-gray-500">{proj.role}</p>}
              {proj.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
  };

  customSections.forEach((cs) => {
    mainRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="text-sm font-bold tracking-widest mb-3 pb-1 border-b border-dashed" style={{ color: accent, borderColor: accent }}>
          {cs.title}
        </h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  return (
    <div
      className="bg-white text-gray-800 font-sans flex"
      style={{ width: 794, minHeight: 1123, boxSizing: 'border-box' }}
    >
      {/* Sidebar */}
      <aside className="w-1/3 p-6 text-white" style={{ backgroundColor: sidebarBg }}>
        {/* Avatar + Name */}
        <div className="mb-6 text-center">
          {personalInfo.avatar && (
            <img
              src={personalInfo.avatar}
              alt="avatar"
              className="w-20 h-20 rounded-full mx-auto mb-3 border-2 object-cover"
              style={{ borderColor: accent }}
            />
          )}
          <h1 className="text-xl font-bold">{personalInfo.name || L.namePlaceholder}</h1>
        </div>

        {/* Contact Info */}
        <div className="mb-6">
          <h2 className="text-xs font-bold tracking-widest mb-2" style={{ color: accent }}>{L.contact}</h2>
          <div className="space-y-1 text-xs opacity-90">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.address && <p>{personalInfo.address}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>

        {/* Skills - Progress Bars */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold tracking-widest mb-2" style={{ color: accent }}>{L.skills}</h2>
            <div className="space-y-2">
              {skills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill.name}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/20">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: accent,
                        width: skill.level === 'expert' ? '100%' : skill.level === 'advanced' ? '75%' : skill.level === 'intermediate' ? '50%' : '25%',
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

        {/* Fallback */}
        {!sectionOrder.includes('experiences') && experiences.length > 0 && mainRenderers.experiences?.()}
        {!sectionOrder.includes('projects') && projects.length > 0 && mainRenderers.projects?.()}
        {!sectionOrder.includes('educations') && educations.length > 0 && mainRenderers.educations?.()}
      </main>
    </div>
  );
}
