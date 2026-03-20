import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 教育/学术行业模板 - 单栏学术论文风格，编号章节，衬线字体，深灰+暗红配色
 */
export default function AcademicTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const darkRed = themeColor || '#8b0000';
  const darkGray = '#333';

  // Track section numbering
  let sectionNum = 0;
  const getNextNum = () => ++sectionNum;

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-5">
          <h2 className="text-base font-bold mb-3" style={{ color: darkRed }}>
            {getNextNum()}. {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3 pl-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: darkGray }}>{edu.school}</h3>
                <span className="text-xs text-gray-500">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</span>
              </div>
              <p className="text-sm text-gray-700">{edu.degree} · {edu.major}</p>
            </div>
          ))}
        </section>
      ) : null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-base font-bold mb-3" style={{ color: darkRed }}>
            {getNextNum()}. {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3 pl-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: darkGray }}>{exp.position}</h3>
                <span className="text-xs text-gray-500">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
              </div>
              <p className="text-sm text-gray-700 italic">{exp.company}</p>
              {exp.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="text-base font-bold mb-3" style={{ color: darkRed }}>
            {getNextNum()}. {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3 pl-4">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: darkGray }}>{proj.name}</h3>
                <span className="text-xs text-gray-500">{formatDate(proj.startDate)} - {formatDate(proj.endDate)}</span>
              </div>
              {proj.role && <p className="text-sm text-gray-700 italic">{proj.role}</p>}
              {proj.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="text-base font-bold mb-3" style={{ color: darkRed }}>
            {getNextNum()}. {L.skills}
          </h2>
          <div className="flex flex-wrap gap-2 pl-4">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs px-2 py-1 rounded border" style={{ borderColor: darkRed, color: darkGray }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
  };

  // Custom sections with citation/indented format
  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="text-base font-bold mb-3" style={{ color: darkRed }}>
          {getNextNum()}. {cs.title}
        </h2>
        <div
          className="text-xs text-gray-600 pl-4 border-l-2"
          style={{ borderColor: darkRed }}
          dangerouslySetInnerHTML={{ __html: cs.content }}
        />
      </section>
    );
  });

  return (
    <div
      className="bg-white text-gray-800 p-8"
      style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box', fontFamily: '"Times New Roman", Times, serif' }}
    >
      {/* Header */}
      <header className="text-center mb-6 pb-4 border-b-2" style={{ borderColor: darkRed }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: darkGray }}>
          {personalInfo.name || L.namePlaceholder}
        </h1>
        <div className="text-xs text-gray-600 flex flex-wrap justify-center gap-x-4 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {sectionOrder.map((sectionId) => sectionRenderers[sectionId]?.())}

      {/* Fallback */}
      {!sectionOrder.includes('educations') && educations.length > 0 && sectionRenderers.educations()}
      {!sectionOrder.includes('experiences') && experiences.length > 0 && sectionRenderers.experiences()}
      {!sectionOrder.includes('projects') && projects.length > 0 && sectionRenderers.projects()}
      {!sectionOrder.includes('skills') && skills.length > 0 && sectionRenderers.skills()}
    </div>
  );
}
