import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 零售/电商行业模板 - 双栏活泼布局，圆角卡片+柔和阴影，活力橙+深灰配色，标签云技能
 */
export default function RetailTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const orange = themeColor || '#f39c12';
  const darkGray = '#2c3e50';

  const sidebarSectionIds = new Set(['personalInfo', 'skills', 'educations']);
  const mainSections = sectionOrder.filter((id) => !sidebarSectionIds.has(id));
  const sidebarSections = sectionOrder.filter((id) => sidebarSectionIds.has(id) && id !== 'personalInfo');

  const tagColors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22', '#f39c12'];

  const sidebarRenderers: Record<string, () => React.ReactNode> = {
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: orange }}>{L.skills}</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill, i) => (
              <span key={skill.id} className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: tagColors[i % tagColors.length] }}>
                {skill.name}
              </span>
            ))}
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
              <p className="text-xs text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
            </div>
          ))}
        </section>
      ) : null,
  };

  const mainRenderers: Record<string, () => React.ReactNode> = {
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-sm font-bold mb-3" style={{ color: darkGray }}>{L.experiences}</h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-3 rounded-lg bg-gray-50 shadow-sm">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm" style={{ color: darkGray }}>{exp.position}</h3>
                  <span className="text-xs text-gray-400">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                </div>
                <p className="text-xs" style={{ color: orange }}>{exp.company}</p>
                {exp.description && (
                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="text-sm font-bold mb-3" style={{ color: darkGray }}>{L.projects}</h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3 rounded-lg bg-gray-50 shadow-sm">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm" style={{ color: darkGray }}>{proj.name}</h3>
                  <span className="text-xs text-gray-400">{formatDate(proj.startDate)} - {formatDate(proj.endDate)}</span>
                </div>
                {proj.role && <p className="text-xs" style={{ color: orange }}>{proj.role}</p>}
                {proj.description && (
                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,
  };

  customSections.forEach((cs) => {
    mainRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="text-sm font-bold mb-3" style={{ color: darkGray }}>{cs.title}</h2>
        <div className="text-xs text-gray-600 p-3 rounded-lg bg-gray-50 shadow-sm" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const renderedMain = new Set(mainSections);
  const renderedSidebar = new Set(sidebarSections);

  return (
    <div className="bg-white text-gray-800 font-sans flex" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
      {/* Sidebar */}
      <aside className="w-1/3 p-6 text-white rounded-r-2xl" style={{ backgroundColor: darkGray }}>
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
