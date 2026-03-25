import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 餐饮/酒店行业模板 - 单栏温馨风格，暖棕+奶油白配色，圆角元素，时间线工作经验，分组技能标签
 */
export default function HospitalityTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const brown = themeColor || '#8B4513';
  const cream = '#FFF8DC';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: brown, borderBottom: `2px solid ${brown}44` }}>{L.experiences}</h2>
          <div className="relative pl-6">
            <div className="absolute left-2 top-0 bottom-0 w-0.5 rounded" style={{ backgroundColor: `${brown}33` }} />
            {experiences.map((exp) => (
              <div key={exp.id} className="mb-4 relative">
                <div className="absolute -left-4 top-1 w-3 h-3 rounded-full border-2" style={{ borderColor: brown, backgroundColor: cream }} />
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm" style={{ color: brown }}>{exp.position}</h3>
                  <span className="text-xs text-gray-400">{formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}</span>
                </div>
                <p className="text-xs text-gray-500">{exp.company}</p>
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
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: brown, borderBottom: `2px solid ${brown}44` }}>{L.educations}</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: cream }}>
              <h3 className="font-bold text-sm" style={{ color: brown }}>{edu.school}</h3>
              <p className="text-xs text-gray-500">{edu.degree} · {edu.major} · {formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}</p>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: brown, borderBottom: `2px solid ${brown}44` }}>{L.skills}</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: cream, color: brown, border: `1px solid ${brown}33` }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: brown, borderBottom: `2px solid ${brown}44` }}>{L.projects}</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3 p-3 rounded-lg" style={{ backgroundColor: cream }}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: brown }}>{proj.name}</h3>
                <span className="text-xs text-gray-400">{formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}</span>
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
      <section key={cs.id} className="mb-6">
        <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: brown, borderBottom: `2px solid ${brown}44` }}>{cs.title}</h2>
        <div className="text-xs text-gray-600 p-3 rounded-lg" style={{ backgroundColor: cream }} dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const orderedSections = sectionOrder.filter((id) => id !== 'personalInfo');
  const renderedIds = new Set(orderedSections);

  return (
    <div className="bg-white font-sans" style={{ width: 794, minHeight: 1123, boxSizing: 'border-box', color: '#333' }}>
      {/* Header with warm style */}
      <div className="px-10 pt-8 pb-6 rounded-b-3xl" style={{ backgroundColor: cream }}>
        <div className="flex items-center gap-6">
          {personalInfo.avatar && (
            <img src={personalInfo.avatar} alt="avatar" className="w-20 h-20 rounded-2xl object-cover border-2" style={{ borderColor: brown }} />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: brown }}>{personalInfo.name || L.namePlaceholder}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
              {personalInfo.website && <span>{personalInfo.website}</span>}
            </div>
          </div>
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
