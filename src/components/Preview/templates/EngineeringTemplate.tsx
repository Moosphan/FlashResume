import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 制造/工程行业模板 - 网格化结构布局，等宽字体，钢铁灰+工业蓝配色，表格式技能展示
 */
export default function EngineeringTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language, data.sectionTitles);

  const blue = themeColor || '#2b5797';
  const steelGray = '#4a4a4a';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: blue, borderBottom: `2px solid ${blue}` }}>
            {L.experiences}
          </h2>
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="mb-3 pl-4" style={{ borderLeft: `2px solid ${steelGray}33` }}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-mono font-bold text-sm" style={{ color: steelGray }}>
                  <span className="text-xs mr-1" style={{ color: blue }}>{String(idx + 1).padStart(2, '0')}.</span>
                  {exp.position}
                </h3>
                <span className="font-mono text-xs text-gray-400">{formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}</span>
              </div>
              <p className="text-xs text-gray-500">{exp.company}</p>
              {exp.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-5">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: blue, borderBottom: `2px solid ${blue}` }}>
            {L.educations}
          </h2>
          <div className="border rounded" style={{ borderColor: `${steelGray}33` }}>
            {educations.map((edu, idx) => (
              <div key={edu.id} className="flex text-xs p-2" style={{ borderBottom: idx < educations.length - 1 ? `1px solid ${steelGray}22` : 'none' }}>
                <div className="w-1/3 font-mono text-gray-500">{formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}</div>
                <div className="w-2/3">
                  <span className="font-bold" style={{ color: steelGray }}>{edu.school}</span>
                  <span className="text-gray-500"> · {edu.degree} · {edu.major}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: blue, borderBottom: `2px solid ${blue}` }}>
            {L.skills}
          </h2>
          <div className="border rounded" style={{ borderColor: `${steelGray}33` }}>
            {skills.map((skill, idx) => (
              <div key={skill.id} className="flex items-center text-xs p-2 font-mono" style={{ borderBottom: idx < skills.length - 1 ? `1px solid ${steelGray}22` : 'none' }}>
                <div className="w-1/2 font-semibold" style={{ color: steelGray }}>{skill.name}</div>
                <div className="w-1/2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 rounded-full bg-gray-200">
                      <div className="h-full rounded-full" style={{
                        backgroundColor: blue,
                        width: skill.level === 'expert' ? '100%' : skill.level === 'advanced' ? '75%' : skill.level === 'intermediate' ? '50%' : '25%',
                      }} />
                    </div>
                    <span className="text-xs text-gray-400 w-20">{skill.level}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="font-mono text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: blue, borderBottom: `2px solid ${blue}` }}>
            {L.projects}
          </h2>
          {projects.map((proj, idx) => (
            <div key={proj.id} className="mb-3 pl-4" style={{ borderLeft: `2px solid ${steelGray}33` }}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-mono font-bold text-sm" style={{ color: steelGray }}>
                  <span className="text-xs mr-1" style={{ color: blue }}>{String(idx + 1).padStart(2, '0')}.</span>
                  {proj.name}
                </h3>
                <span className="font-mono text-xs text-gray-400">{formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}</span>
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
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="font-mono text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: blue, borderBottom: `2px solid ${blue}` }}>
          {cs.title}
        </h2>
        <div className="text-xs text-gray-600 font-mono" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const orderedSections = sectionOrder.filter((id) => id !== 'personalInfo');
  const renderedIds = new Set(orderedSections);

  return (
    <div className="bg-white font-mono" style={{ width: 794, minHeight: 1123, boxSizing: 'border-box', color: steelGray }}>
      {/* Header - grid style */}
      <div className="px-8 pt-8 pb-4" style={{ borderBottom: `3px solid ${blue}` }}>
        <div className="grid grid-cols-3 gap-4 items-center">
          <div className="col-span-2">
            <h1 className="text-2xl font-bold" style={{ color: blue }}>{personalInfo.name || L.namePlaceholder}</h1>
          </div>
          <div className="text-right text-xs text-gray-500 space-y-1">
            {personalInfo.email && <p>{personalInfo.email}</p>}
            {personalInfo.phone && <p>{personalInfo.phone}</p>}
            {personalInfo.address && <p>{personalInfo.address}</p>}
            {personalInfo.website && <p>{personalInfo.website}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {orderedSections.map((id) => sectionRenderers[id]?.())}
        {!renderedIds.has('experiences') && experiences.length > 0 && sectionRenderers.experiences?.()}
        {!renderedIds.has('educations') && educations.length > 0 && sectionRenderers.educations?.()}
        {!renderedIds.has('skills') && skills.length > 0 && sectionRenderers.skills?.()}
        {!renderedIds.has('projects') && projects.length > 0 && sectionRenderers.projects?.()}
      </div>
    </div>
  );
}
