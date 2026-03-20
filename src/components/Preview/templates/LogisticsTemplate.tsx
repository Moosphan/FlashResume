import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 物流/供应链行业模板 - 流程图风格布局，深蓝+亮绿配色，箭头连接线装饰，流程节点工作经验
 */
export default function LogisticsTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const darkBlue = themeColor || '#1a3c5e';
  const green = '#27ae60';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1 flex items-center gap-2" style={{ color: darkBlue, borderBottom: `2px solid ${green}` }}>
            <span style={{ color: green }}>▶</span> {L.experiences}
          </h2>
          <div className="space-y-3">
            {experiences.map((exp, idx) => (
              <div key={exp.id} className="relative pl-8">
                {/* Flow node */}
                <div className="absolute left-0 top-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: green }}>
                  {idx + 1}
                </div>
                {idx < experiences.length - 1 && (
                  <div className="absolute left-2.5 top-6 w-0 h-full" style={{ borderLeft: `2px dashed ${green}44` }} />
                )}
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm" style={{ color: darkBlue }}>{exp.position}</h3>
                  <span className="text-xs text-gray-400">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                </div>
                <p className="text-xs" style={{ color: green }}>{exp.company}</p>
                {exp.description && (
                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1 flex items-center gap-2" style={{ color: darkBlue, borderBottom: `2px solid ${green}` }}>
            <span style={{ color: green }}>▶</span> {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3 pl-4" style={{ borderLeft: `3px solid ${green}33` }}>
              <h3 className="font-bold text-sm" style={{ color: darkBlue }}>{edu.school}</h3>
              <p className="text-xs text-gray-500">{edu.degree} · {edu.major} · {formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1 flex items-center gap-2" style={{ color: darkBlue, borderBottom: `2px solid ${green}` }}>
            <span style={{ color: green }}>▶</span> {L.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs px-3 py-1 rounded" style={{ backgroundColor: `${darkBlue}10`, color: darkBlue, border: `1px solid ${darkBlue}33` }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1 flex items-center gap-2" style={{ color: darkBlue, borderBottom: `2px solid ${green}` }}>
            <span style={{ color: green }}>▶</span> {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3 pl-4" style={{ borderLeft: `3px solid ${green}33` }}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: darkBlue }}>{proj.name}</h3>
                <span className="text-xs text-gray-400">{formatDate(proj.startDate)} - {formatDate(proj.endDate)}</span>
              </div>
              {proj.role && <p className="text-xs" style={{ color: green }}>{proj.role}</p>}
              {proj.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
  };

  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-6">
        <h2 className="text-sm font-bold mb-3 pb-1 flex items-center gap-2" style={{ color: darkBlue, borderBottom: `2px solid ${green}` }}>
          <span style={{ color: green }}>▶</span> {cs.title}
        </h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const orderedSections = sectionOrder.filter((id) => id !== 'personalInfo');
  const renderedIds = new Set(orderedSections);

  return (
    <div className="bg-white font-sans" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box', color: '#333' }}>
      {/* Header */}
      <div className="px-10 pt-8 pb-4" style={{ borderBottom: `4px solid ${green}` }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-8 rounded" style={{ backgroundColor: green }} />
          <h1 className="text-2xl font-bold" style={{ color: darkBlue }}>{personalInfo.name || L.namePlaceholder}</h1>
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500 ml-4">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="px-10 py-6">
        {orderedSections.map((id) => sectionRenderers[id]?.())}
        {!renderedIds.has('experiences') && experiences.length > 0 && sectionRenderers.experiences?.()}
        {!renderedIds.has('educations') && educations.length > 0 && sectionRenderers.educations?.()}
        {!renderedIds.has('skills') && skills.length > 0 && sectionRenderers.skills?.()}
        {!renderedIds.has('projects') && projects.length > 0 && sectionRenderers.projects?.()}
      </div>
    </div>
  );
}
