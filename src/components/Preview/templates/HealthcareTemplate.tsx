import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 医疗/健康行业模板 - 单栏清爽布局，大量留白，浅蓝+深青配色，时间线样式
 */
export default function HealthcareTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const teal = themeColor || '#2c7a7b';
  const lightBlue = '#e8f4f8';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: teal }}>
            {L.experiences}
          </h2>
          <div className="border-l-2 ml-2 pl-5 space-y-4" style={{ borderColor: teal }}>
            {experiences.map((exp) => (
              <div key={exp.id} className="relative">
                <div
                  className="absolute -left-[25px] top-1 w-3 h-3 rounded-full border-2 bg-white"
                  style={{ borderColor: teal }}
                />
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-sm text-gray-900">{exp.position}</h3>
                  <span className="text-xs text-gray-400">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
                </div>
                <p className="text-xs text-gray-500">{exp.company}</p>
                {exp.description && (
                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-8 rounded-lg p-5" style={{ backgroundColor: lightBlue }}>
          <h2 className="text-lg font-bold mb-4" style={{ color: teal }}>
            🎓 {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900">{edu.school}</h3>
                <span className="text-xs text-gray-400">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
              </div>
              <p className="text-xs text-gray-500">{edu.degree} · {edu.major}</p>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: teal }}>
            📋 {L.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill.id}
                className="text-xs px-3 py-1 rounded-full"
                style={{ backgroundColor: lightBlue, color: teal }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-8">
          <h2 className="text-lg font-bold mb-4" style={{ color: teal }}>
            {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-semibold text-sm text-gray-900">{proj.name}</h3>
                <span className="text-xs text-gray-400">{formatDate(proj.startDate)} - {formatDate(proj.endDate)}</span>
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
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-8 rounded-lg p-5" style={{ backgroundColor: lightBlue }}>
        <h2 className="text-lg font-bold mb-4" style={{ color: teal }}>
          📋 {cs.title}
        </h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  return (
    <div
      className="bg-white text-gray-800 p-10 font-sans"
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}
    >
      {/* Header */}
      <header className="text-center mb-8 pb-5" style={{ borderBottom: `2px solid ${teal}` }}>
        <h1 className="text-2xl font-bold mb-2" style={{ color: teal }}>
          {personalInfo.name || L.namePlaceholder}
        </h1>
        <div className="text-xs text-gray-500 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {sectionOrder.map((sectionId) => sectionRenderers[sectionId]?.())}

      {/* Fallback */}
      {!sectionOrder.includes('experiences') && experiences.length > 0 && sectionRenderers.experiences()}
      {!sectionOrder.includes('projects') && projects.length > 0 && sectionRenderers.projects()}
      {!sectionOrder.includes('educations') && educations.length > 0 && sectionRenderers.educations()}
      {!sectionOrder.includes('skills') && skills.length > 0 && sectionRenderers.skills()}
    </div>
  );
}
