import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 金融/银行行业模板 - 单栏传统布局，衬线字体，深蓝+金色配色，严谨对称
 */
export default function FinanceTemplate({ data, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const navy = '#003366';
  const gold = '#c5a55a';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-lg font-bold tracking-wide pb-1 mb-3 border-b" style={{ color: navy, borderColor: gold }}>
            {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: navy }}>{exp.company}</h3>
                <span className="text-xs text-gray-500">{formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}</span>
              </div>
              <p className="text-sm text-gray-700 italic">{exp.position}</p>
              {exp.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-5">
          <h2 className="text-lg font-bold tracking-wide pb-1 mb-3 border-b" style={{ color: navy, borderColor: gold }}>
            {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: navy }}>{edu.school}</h3>
                <span className="text-xs text-gray-500">{formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}</span>
              </div>
              <p className="text-sm text-gray-700">{edu.degree} · {edu.major}</p>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="text-lg font-bold tracking-wide pb-1 mb-3 border-b" style={{ color: navy, borderColor: gold }}>
            {L.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs px-2 py-1 rounded border" style={{ borderColor: gold, color: navy }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="text-lg font-bold tracking-wide pb-1 mb-3 border-b" style={{ color: navy, borderColor: gold }}>
            {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: navy }}>{proj.name}</h3>
                <span className="text-xs text-gray-500">{formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}</span>
              </div>
              {proj.role && <p className="text-sm text-gray-700 italic">{proj.role}</p>}
              {proj.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
  };

  // Custom sections with gold-bordered badge style
  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="text-lg font-bold tracking-wide pb-1 mb-3 border-b" style={{ color: navy, borderColor: gold }}>
          {cs.title}
        </h2>
        <div
          className="text-xs text-gray-600 px-3 py-2 rounded border-l-4"
          style={{ borderColor: gold, backgroundColor: '#faf8f0' }}
          dangerouslySetInnerHTML={{ __html: cs.content }}
        />
      </section>
    );
  });

  return (
    <div
      className="bg-white text-gray-800 p-8"
      style={{ width: 794, minHeight: 1123, boxSizing: 'border-box', fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {/* Header */}
      <header className="text-center mb-6 pb-4 border-b" style={{ borderColor: gold }}>
        <h1 className="text-2xl font-bold mb-1" style={{ color: navy }}>
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
      {!sectionOrder.includes('experiences') && experiences.length > 0 && sectionRenderers.experiences()}
      {!sectionOrder.includes('projects') && projects.length > 0 && sectionRenderers.projects()}
      {!sectionOrder.includes('educations') && educations.length > 0 && sectionRenderers.educations()}
      {!sectionOrder.includes('skills') && skills.length > 0 && sectionRenderers.skills()}
    </div>
  );
}
