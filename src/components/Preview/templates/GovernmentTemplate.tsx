import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 政府/公共事业行业模板 - 标准化单栏布局，藏蓝+白色，庄重风格，编号层级标题
 */
export default function GovernmentTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const navy = themeColor || '#1b3a5c';
  let sectionNum = 0;

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: navy, borderBottom: `2px solid ${navy}` }}>
            {++sectionNum}. {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <div>
                  <span className="font-bold text-sm" style={{ color: navy }}>{exp.company}</span>
                  <span className="text-sm text-gray-600"> — {exp.position}</span>
                </div>
                <span className="text-xs text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
              </div>
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
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: navy, borderBottom: `2px solid ${navy}` }}>
            {++sectionNum}. {L.educations}
          </h2>
          <div className="border rounded" style={{ borderColor: `${navy}33` }}>
            {educations.map((edu, idx) => (
              <div key={edu.id} className="flex text-xs p-2" style={{ borderBottom: idx < educations.length - 1 ? `1px solid ${navy}22` : 'none' }}>
                <div className="w-1/4 text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</div>
                <div className="w-1/3 font-bold" style={{ color: navy }}>{edu.school}</div>
                <div className="w-5/12 text-gray-600">{edu.degree} · {edu.major}</div>
              </div>
            ))}
          </div>
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: navy, borderBottom: `2px solid ${navy}` }}>
            {++sectionNum}. {L.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs px-3 py-1 rounded" style={{ backgroundColor: `${navy}10`, color: navy, border: `1px solid ${navy}33` }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: navy, borderBottom: `2px solid ${navy}` }}>
            {++sectionNum}. {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: navy }}>{proj.name}</h3>
                <span className="text-xs text-gray-500">{formatDate(proj.startDate)} - {formatDate(proj.endDate)}</span>
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
        <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: navy, borderBottom: `2px solid ${navy}` }}>
          {++sectionNum}. {cs.title}
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
      <div className="px-10 pt-8 pb-4" style={{ borderBottom: `3px solid ${navy}` }}>
        <h1 className="text-2xl font-bold text-center" style={{ color: navy }}>{personalInfo.name || L.namePlaceholder}</h1>
        <div className="flex justify-center flex-wrap gap-4 mt-2 text-xs text-gray-500">
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
