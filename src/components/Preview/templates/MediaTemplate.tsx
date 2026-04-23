import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 媒体/传播行业模板 - 杂志排版风格，黑色+亮黄配色，混合字体，大标题引用块
 */
export default function MediaTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language, data.sectionTitles);

  const yellow = themeColor || '#f1c40f';
  const black = '#1a1a1a';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-6">
          <h2 className="font-serif text-lg font-bold mb-3 pb-1" style={{ color: black, borderBottom: `3px solid ${yellow}` }}>
            {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <h3 className="font-serif font-bold text-sm" style={{ color: black }}>{exp.position}</h3>
              <p className="text-xs font-sans" style={{ color: yellow }}>{exp.company} · {formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}</p>
              {exp.description && (
                <div className="text-xs font-sans text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-6">
          <h2 className="font-serif text-lg font-bold mb-3 pb-1" style={{ color: black, borderBottom: `3px solid ${yellow}` }}>
            {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="font-serif font-bold text-sm" style={{ color: black }}>{edu.school}</h3>
              <p className="text-xs font-sans text-gray-500">{edu.degree} · {edu.major} · {formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}</p>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-6">
          <h2 className="font-serif text-lg font-bold mb-3 pb-1" style={{ color: black, borderBottom: `3px solid ${yellow}` }}>
            {L.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs font-sans px-3 py-1 font-bold" style={{ backgroundColor: yellow, color: black }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-6">
          <h2 className="font-serif text-lg font-bold mb-3 pb-1" style={{ color: black, borderBottom: `3px solid ${yellow}` }}>
            {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4">
              <h3 className="font-serif font-bold text-sm" style={{ color: black }}>{proj.name}</h3>
              <p className="text-xs font-sans" style={{ color: yellow }}>{proj.role && `${proj.role} · `}{formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}</p>
              {proj.description && (
                <div className="text-xs font-sans text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
  };

  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-6">
        <h2 className="font-serif text-lg font-bold mb-3 pb-1" style={{ color: black, borderBottom: `3px solid ${yellow}` }}>
          {cs.title}
        </h2>
        <div className="text-xs font-sans text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const orderedSections = sectionOrder.filter((id) => id !== 'personalInfo');
  const renderedIds = new Set(orderedSections);

  return (
    <div className="bg-white" style={{ width: 794, minHeight: 1123, boxSizing: 'border-box', color: black }}>
      {/* Magazine-style header */}
      <div className="px-10 pt-8 pb-6" style={{ backgroundColor: black }}>
        <h1 className="font-serif text-3xl font-bold text-white">{personalInfo.name || L.namePlaceholder}</h1>
        <div className="flex flex-wrap gap-4 mt-2 text-xs font-sans" style={{ color: `${yellow}` }}>
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
        {/* Yellow accent bar */}
        <div className="mt-4 h-1 w-24" style={{ backgroundColor: yellow }} />
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
