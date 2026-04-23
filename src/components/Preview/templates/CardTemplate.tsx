import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 卡片模板 - 每个区块独立卡片，圆角阴影，网格感布局
 */
export default function CardTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language, data.sectionTitles);

  function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
      <div className="rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 p-4 shadow-sm">
        <h2 className="text-xs font-bold tracking-widest mb-3 pb-2 border-b" style={{ color: themeColor, borderColor: `${themeColor}33` }}>
          {title}
        </h2>
        {children}
      </div>
    );
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <Card key="experiences" title={L.experiences}>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exp.position}</span>
                  <span className="text-xs text-gray-400">{formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{exp.company}</p>
                {exp.description && <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />}
              </div>
            ))}
          </div>
        </Card>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <Card key="projects" title={L.projects}>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{proj.name}</span>
                  <span className="text-xs text-gray-400">{formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}</span>
                </div>
                {proj.role && <p className="text-xs text-gray-500 dark:text-gray-400">{proj.role}</p>}
                {proj.description && <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />}
              </div>
            ))}
          </div>
        </Card>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <Card key="educations" title={L.educations}>
          <div className="space-y-2">
            {educations.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{edu.school}</span>
                  <span className="text-xs text-gray-400">{formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{edu.degree} · {edu.major}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <Card key="skills" title={L.skills}>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs px-2.5 py-1 rounded-md border font-medium" style={{ borderColor: themeColor, color: themeColor, backgroundColor: `${themeColor}0D` }}>
                {skill.name}
              </span>
            ))}
          </div>
        </Card>
      ) : null,
  };

  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <Card key={cs.id} title={cs.title}>
        <div className="text-xs text-gray-600 dark:text-gray-400" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </Card>
    );
  });

  return (
    <div className="font-sans text-gray-800 dark:text-gray-200 p-8 bg-gray-50 dark:bg-gray-800" style={{ width: 794, minHeight: 1123, boxSizing: 'border-box' }}>
      {/* Header card */}
      <div className="rounded-lg p-6 mb-4 text-white shadow-md" style={{ backgroundColor: themeColor }}>
        <h1 className="text-2xl font-bold">{personalInfo.name || L.namePlaceholder}</h1>
        <div className="mt-2 flex flex-wrap gap-x-4 text-xs opacity-90">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </div>

      {/* Content cards */}
      <div className="space-y-3">
        {sectionOrder.map((id) => sectionRenderers[id]?.())}
        {!sectionOrder.includes('experiences') && experiences.length > 0 && sectionRenderers.experiences()}
        {!sectionOrder.includes('projects') && projects.length > 0 && sectionRenderers.projects()}
        {!sectionOrder.includes('educations') && educations.length > 0 && sectionRenderers.educations()}
        {!sectionOrder.includes('skills') && skills.length > 0 && sectionRenderers.skills()}
      </div>
    </div>
  );
}
