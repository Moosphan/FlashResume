import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';
import { exportContactItemCls, exportDateMainCls, exportDateRowCls, exportDateTextCls, exportMetaLineCls } from './exportLayout';

/**
 * 法律/合规行业模板 - 严格单栏法律文书风格，衬线字体，粗体标题+缩进段落
 */
export default function LegalTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language, data.sectionTitles);

  const darkRed = themeColor || '#800020';
  const textColor = '#2d2d2d';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: darkRed, borderBottom: `2px solid ${darkRed}` }}>
            {L.experiences}
          </h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4 pl-4">
              <div className={exportDateRowCls}>
                <div className={exportDateMainCls}>
                  <p className="text-sm break-words"><span className="font-bold">{exp.company}</span> — {exp.position}</p>
                </div>
                <span className={`${exportDateTextCls} text-gray-500`}>
                  {formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}
                </span>
              </div>
              {exp.description && (
                <div className="text-xs leading-relaxed text-gray-700 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: darkRed, borderBottom: `2px solid ${darkRed}` }}>
            {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3 pl-4">
              <div className={exportDateRowCls}>
                <div className={exportDateMainCls}>
                  <p className="text-sm break-words"><span className="font-bold">{edu.school}</span></p>
                  <p className={`${exportMetaLineCls} text-gray-600 pl-4`}>{edu.degree} · {edu.major}</p>
                </div>
                <span className={`${exportDateTextCls} text-gray-500`}>
                  {formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}
                </span>
              </div>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: darkRed, borderBottom: `2px solid ${darkRed}` }}>
            {L.skills}
          </h2>
          <div className="pl-4 text-xs text-gray-700 leading-relaxed">
            {skills.map((skill, i) => (
              <span key={skill.id}>{skill.name}{i < skills.length - 1 ? ' · ' : ''}</span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: darkRed, borderBottom: `2px solid ${darkRed}` }}>
            {L.projects}
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4 pl-4">
              <div className={exportDateRowCls}>
                <div className={exportDateMainCls}>
                  <p className="text-sm font-bold break-words">{proj.name}</p>
                  {proj.role && <p className={`${exportMetaLineCls} text-gray-500`}>{proj.role}</p>}
                </div>
                <span className={`${exportDateTextCls} text-gray-500`}>
                  {formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}
                </span>
              </div>
              {proj.description && (
                <div className="text-xs leading-relaxed text-gray-700 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
  };

  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="text-sm font-bold uppercase tracking-wider mb-3 pb-1" style={{ color: darkRed, borderBottom: `2px solid ${darkRed}` }}>
          {cs.title}
        </h2>
        <div className="text-xs text-gray-700 pl-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const orderedSections = sectionOrder.filter((id) => id !== 'personalInfo');
  const renderedIds = new Set(orderedSections);

  return (
    <div className="bg-white font-serif" style={{ width: 794, minHeight: 1123, boxSizing: 'border-box', color: textColor }}>
      {/* Header */}
      <div className="px-10 pt-10 pb-4 text-center" style={{ borderBottom: `3px double ${darkRed}` }}>
        <h1 className="text-2xl font-bold tracking-wider" style={{ color: darkRed }}>{personalInfo.name || L.namePlaceholder}</h1>
        <div className="flex justify-center flex-wrap gap-4 mt-2 text-xs text-gray-500">
          {personalInfo.email && <span className={exportContactItemCls}>{personalInfo.email}</span>}
          {personalInfo.phone && <span className={exportContactItemCls}>{personalInfo.phone}</span>}
          {personalInfo.address && <span className={exportContactItemCls}>{personalInfo.address}</span>}
          {personalInfo.website && <span className={exportContactItemCls}>{personalInfo.website}</span>}
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
