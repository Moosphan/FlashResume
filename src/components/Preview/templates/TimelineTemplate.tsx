import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 时间线模板 - 左侧竖线 + 圆点时间轴，右侧内容，视觉节奏感强
 */
export default function TimelineTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  function TimelineItem({ title, subtitle, date, desc }: { title: string; subtitle?: string; date: string; desc?: string }) {
    return (
      <div className="relative pl-6 pb-4">
        {/* Dot */}
        <div
          className="absolute left-0 top-1 w-3 h-3 rounded-full border-2 bg-white dark:bg-gray-800"
          style={{ borderColor: themeColor }}
        />
        {/* Line */}
        <div
          className="absolute left-[5px] top-4 bottom-0 w-0.5"
          style={{ backgroundColor: themeColor, opacity: 0.25 }}
        />
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</span>
          <span className="text-xs text-gray-400 shrink-0 ml-2">{date}</span>
        </div>
        {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
        {desc && <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-line leading-relaxed [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: desc }} />}
      </div>
    );
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-6">
          <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: themeColor }}>{L.experiences}</h2>
          {experiences.map((exp) => (
            <TimelineItem key={exp.id} title={exp.position} subtitle={exp.company} date={`${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`} desc={exp.description} />
          ))}
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-6">
          <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: themeColor }}>{L.projects}</h2>
          {projects.map((proj) => (
            <TimelineItem key={proj.id} title={proj.name} subtitle={proj.role} date={`${formatDate(proj.startDate)} - ${formatDate(proj.endDate)}`} desc={proj.description} />
          ))}
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-6">
          <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: themeColor }}>{L.educations}</h2>
          {educations.map((edu) => (
            <TimelineItem key={edu.id} title={edu.school} subtitle={`${edu.degree} · ${edu.major}`} date={`${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`} />
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-6">
          <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: themeColor }}>{L.skills}</h2>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: themeColor }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
  };

  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-6">
        <h2 className="text-xs font-bold tracking-widest mb-3" style={{ color: themeColor }}>{cs.title}</h2>
        <div className="text-xs text-gray-600 dark:text-gray-400 pl-6" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-sans p-8" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold" style={{ color: themeColor }}>{personalInfo.name || L.namePlaceholder}</h1>
        <div className="mt-2 flex flex-wrap gap-x-4 text-xs text-gray-500 dark:text-gray-400">
          {personalInfo.email && <span>✉ {personalInfo.email}</span>}
          {personalInfo.phone && <span>☎ {personalInfo.phone}</span>}
          {personalInfo.address && <span>⌂ {personalInfo.address}</span>}
          {personalInfo.website && <span>🔗 {personalInfo.website}</span>}
        </div>
        <div className="mt-3 h-0.5 w-full" style={{ backgroundColor: themeColor, opacity: 0.3 }} />
      </header>

      {sectionOrder.map((id) => sectionRenderers[id]?.())}
      {!sectionOrder.includes('experiences') && experiences.length > 0 && sectionRenderers.experiences()}
      {!sectionOrder.includes('projects') && projects.length > 0 && sectionRenderers.projects()}
      {!sectionOrder.includes('educations') && educations.length > 0 && sectionRenderers.educations()}
      {!sectionOrder.includes('skills') && skills.length > 0 && sectionRenderers.skills()}
    </div>
  );
}
