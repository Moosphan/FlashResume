import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 人力资源/咨询行业模板 - 双栏专业布局，紫色+浅灰配色，评分矩阵技能，结构化成就描述
 */
export default function HRConsultingTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const purple = themeColor || '#6c3483';
  const lightGray = '#f5f5f5';

  const sidebarSectionIds = new Set(['personalInfo', 'skills', 'educations']);
  const mainSections = sectionOrder.filter((id) => !sidebarSectionIds.has(id));
  const sidebarSections = sectionOrder.filter((id) => sidebarSectionIds.has(id) && id !== 'personalInfo');

  const sidebarRenderers: Record<string, () => React.ReactNode> = {
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-white">{L.skills}</h2>
          <div className="space-y-2">
            {skills.map((skill) => {
              const dots = skill.level === 'expert' ? 5 : skill.level === 'advanced' ? 4 : skill.level === 'intermediate' ? 3 : 2;
              return (
                <div key={skill.id} className="flex items-center justify-between">
                  <span className="text-xs text-gray-200">{skill.name}</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-2 h-2 rounded-full" style={{ backgroundColor: i <= dots ? '#fff' : `${purple}66` }} />
                    ))}
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
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-white">{L.educations}</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <p className="text-xs font-semibold text-white">{edu.school}</p>
              <p className="text-xs text-gray-300">{edu.degree} · {edu.major}</p>
              <p className="text-xs text-gray-400">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
            </div>
          ))}
        </section>
      ) : null,
  };

  const mainRenderers: Record<string, () => React.ReactNode> = {
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: purple, borderBottom: `2px solid ${purple}` }}>
            {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: purple }}>{exp.position}</h3>
                <span className="text-xs text-gray-400">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
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
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: purple, borderBottom: `2px solid ${purple}` }}>
            {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: purple }}>{proj.name}</h3>
                <span className="text-xs text-gray-400">{formatDate(proj.startDate)} - {formatDate(proj.endDate)}</span>
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
        <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: purple, borderBottom: `2px solid ${purple}` }}>
          {cs.title}
        </h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const renderedMain = new Set(mainSections);
  const renderedSidebar = new Set(sidebarSections);

  return (
    <div className="font-sans flex" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box', backgroundColor: lightGray }}>
      {/* Sidebar */}
      <aside className="w-1/3 p-6" style={{ backgroundColor: purple }}>
        <div className="mb-6 text-center">
          {personalInfo.avatar && (
            <img src={personalInfo.avatar} alt="avatar" className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-white object-cover" />
          )}
          <h1 className="text-xl font-bold text-white">{personalInfo.name || L.namePlaceholder}</h1>
          <div className="mt-2 space-y-1 text-xs text-gray-300">
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
      <main className="w-2/3 p-6 bg-white">
        {mainSections.map((id) => mainRenderers[id]?.())}
        {!renderedMain.has('experiences') && experiences.length > 0 && mainRenderers.experiences?.()}
        {!renderedMain.has('projects') && projects.length > 0 && mainRenderers.projects?.()}
      </main>
    </div>
  );
}
