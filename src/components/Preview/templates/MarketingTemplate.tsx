import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 市场营销行业模板 - 双栏信息图风格，橙色+深灰配色，百分比进度条，数据高亮
 */
export default function MarketingTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const orange = themeColor || '#ff6600';
  const darkGray = '#333';

  const sidebarSectionIds = new Set(['personalInfo', 'skills', 'educations']);
  const mainSections = sectionOrder.filter((id) => !sidebarSectionIds.has(id));
  const sidebarSections = sectionOrder.filter((id) => sidebarSectionIds.has(id) && id !== 'personalInfo');

  const sidebarRenderers: Record<string, () => React.ReactNode> = {
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: orange }}>{L.skills}</h2>
          <div className="space-y-2">
            {skills.map((skill) => {
              const pct = skill.level === 'expert' ? 100 : skill.level === 'advanced' ? 75 : skill.level === 'intermediate' ? 50 : 25;
              return (
                <div key={skill.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-300">{skill.name}</span>
                    <span style={{ color: orange }}>{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-gray-600">
                    <div className="h-full rounded-full" style={{ backgroundColor: orange, width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: orange }}>{L.educations}</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <p className="text-xs font-semibold text-white">{edu.school}</p>
              <p className="text-xs text-gray-400">{edu.degree} · {edu.major}</p>
              <p className="text-xs text-gray-500">{formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}</p>
            </div>
          ))}
        </section>
      ) : null,
  };

  const mainRenderers: Record<string, () => React.ReactNode> = {
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: orange, borderBottom: `2px solid ${orange}` }}>
            {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: darkGray }}>{exp.position}</h3>
                <span className="text-xs text-gray-400">{formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}</span>
              </div>
              <p className="text-xs text-gray-500">{exp.company}</p>
              {exp.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: orange, borderBottom: `2px solid ${orange}` }}>
            {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: darkGray }}>{proj.name}</h3>
                <span className="text-xs text-gray-400">{formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}</span>
              </div>
              {proj.role && <p className="text-xs text-gray-500">{proj.role}</p>}
              {proj.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
  };

  customSections.forEach((cs) => {
    mainRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: orange, borderBottom: `2px solid ${orange}` }}>
          {cs.title}
        </h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const renderedMain = new Set(mainSections);
  const renderedSidebar = new Set(sidebarSections);

  return (
    <div className="bg-white text-gray-800 font-sans flex" style={{ width: 794, minHeight: 1123, boxSizing: 'border-box' }}>
      {/* Sidebar */}
      <aside className="w-1/3 p-6 text-white" style={{ backgroundColor: darkGray }}>
        <div className="mb-6 text-center">
          {personalInfo.avatar && (
            <img src={personalInfo.avatar} alt="avatar" className="w-20 h-20 rounded-full mx-auto mb-3 border-2 object-cover" style={{ borderColor: orange }} />
          )}
          <h1 className="text-xl font-bold">{personalInfo.name || L.namePlaceholder}</h1>
          <div className="mt-2 space-y-1 text-xs opacity-90">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.address && <p>{personalInfo.address}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>
        {sidebarSections.map((id) => sidebarRenderers[id]?.())}
        {!renderedSidebar.has('skills') && skills.length > 0 && sidebarRenderers.skills?.()}
        {!renderedSidebar.has('educations') && educations.length > 0 && sidebarRenderers.educations?.()}
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-6">
        {mainSections.map((id) => mainRenderers[id]?.())}
        {!renderedMain.has('experiences') && experiences.length > 0 && mainRenderers.experiences?.()}
        {!renderedMain.has('projects') && projects.length > 0 && mainRenderers.projects?.()}
      </main>
    </div>
  );
}
