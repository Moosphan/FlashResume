import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 房地产/建筑行业模板 - 宽幅头部+双栏内容，大地色+深绿配色，建筑线条装饰，卡片式项目
 */
export default function RealEstateTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const earth = themeColor || '#8B7355';
  const green = '#2d5016';

  const sidebarSectionIds = new Set(['personalInfo', 'skills', 'educations']);
  const mainSections = sectionOrder.filter((id) => !sidebarSectionIds.has(id));
  const sidebarSections = sectionOrder.filter((id) => sidebarSectionIds.has(id) && id !== 'personalInfo');

  const sidebarRenderers: Record<string, () => React.ReactNode> = {
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: earth }}>{L.skills}</h2>
          <div className="space-y-1">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2 text-xs">
                <span style={{ color: green }}>▪</span>
                <span className="text-gray-700">{skill.name}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: earth }}>{L.educations}</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <p className="text-xs font-semibold" style={{ color: green }}>{edu.school}</p>
              <p className="text-xs text-gray-500">{edu.degree} · {edu.major}</p>
              <p className="text-xs text-gray-400">{formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}</p>
            </div>
          ))}
        </section>
      ) : null,
  };

  const mainRenderers: Record<string, () => React.ReactNode> = {
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-sm font-bold font-serif mb-3 pb-1" style={{ color: green, borderBottom: `2px solid ${earth}` }}>{L.experiences}</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm font-serif" style={{ color: green }}>{exp.position}</h3>
                <span className="text-xs text-gray-400">{formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}</span>
              </div>
              <p className="text-xs" style={{ color: earth }}>{exp.company}</p>
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
          <h2 className="text-sm font-bold font-serif mb-3 pb-1" style={{ color: green, borderBottom: `2px solid ${earth}` }}>{L.projects}</h2>
          <div className="grid grid-cols-2 gap-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3 rounded border" style={{ borderColor: `${earth}44` }}>
                <h3 className="font-bold text-xs font-serif" style={{ color: green }}>{proj.name}</h3>
                <p className="text-xs text-gray-400">{formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}</p>
                {proj.role && <p className="text-xs" style={{ color: earth }}>{proj.role}</p>}
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
        <h2 className="text-sm font-bold font-serif mb-3 pb-1" style={{ color: green, borderBottom: `2px solid ${earth}` }}>{cs.title}</h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const renderedMain = new Set(mainSections);
  const renderedSidebar = new Set(sidebarSections);

  return (
    <div className="bg-white font-serif" style={{ width: 794, minHeight: 1123, boxSizing: 'border-box', color: '#333' }}>
      {/* Wide Header with architectural line decoration */}
      <div className="relative px-8 pt-8 pb-6" style={{ backgroundColor: `${earth}0a` }}>
        {/* Architectural lines */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: earth }} />
        <div className="absolute top-2 left-8 right-8 h-px" style={{ backgroundColor: `${earth}44` }} />
        <div className="flex items-center gap-6 mt-2">
          {personalInfo.avatar && (
            <img src={personalInfo.avatar} alt="avatar" className="w-16 h-16 rounded object-cover border-2" style={{ borderColor: earth }} />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: green }}>{personalInfo.name || L.namePlaceholder}</h1>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
              {personalInfo.website && <span>{personalInfo.website}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Two-column content */}
      <div className="flex px-8 py-6 gap-6">
        <aside className="w-1/3">
          {sidebarSections.map((id) => sidebarRenderers[id]?.())}
          {!renderedSidebar.has('skills') && skills.length > 0 && sidebarRenderers.skills?.()}
          {!renderedSidebar.has('educations') && educations.length > 0 && sidebarRenderers.educations?.()}
        </aside>
        <main className="w-2/3">
          {mainSections.map((id) => mainRenderers[id]?.())}
          {!renderedMain.has('experiences') && experiences.length > 0 && mainRenderers.experiences?.()}
          {!renderedMain.has('projects') && projects.length > 0 && mainRenderers.projects?.()}
        </main>
      </div>
    </div>
  );
}
