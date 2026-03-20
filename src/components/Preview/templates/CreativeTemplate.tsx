import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 创意/设计行业模板 - 非对称布局，珊瑚色+深紫撞色，几何装饰，圆环技能评分
 */
export default function CreativeTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  const coral = themeColor || '#ff6b6b';
  const purple = '#4a0e4e';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-wide" style={{ color: purple }}>{L.experiences}</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4 pl-4" style={{ borderLeft: `3px solid ${coral}` }}>
              <h3 className="font-bold text-sm" style={{ color: purple }}>{exp.position}</h3>
              <p className="text-xs text-gray-500">{exp.company} · {formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
              {exp.description && (
                <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />
              )}
            </div>
          ))}
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-wide" style={{ color: purple }}>{L.educations}</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="font-bold text-sm" style={{ color: purple }}>{edu.school}</h3>
              <p className="text-xs text-gray-500">{edu.degree} · {edu.major} · {formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-wide" style={{ color: purple }}>{L.skills}</h2>
          <div className="flex flex-wrap gap-4">
            {skills.map((skill) => {
              const pct = skill.level === 'expert' ? 100 : skill.level === 'advanced' ? 75 : skill.level === 'intermediate' ? 50 : 25;
              return (
                <div key={skill.id} className="flex flex-col items-center w-16">
                  <svg width="48" height="48" viewBox="0 0 48 48">
                    <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle cx="24" cy="24" r="20" fill="none" stroke={coral} strokeWidth="4"
                      strokeDasharray={`${(pct / 100) * 125.6} 125.6`}
                      strokeLinecap="round" transform="rotate(-90 24 24)" />
                  </svg>
                  <span className="text-xs mt-1 text-center text-gray-700">{skill.name}</span>
                </div>
              );
            })}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-6">
          <h2 className="text-lg font-bold mb-3 tracking-wide" style={{ color: purple }}>{L.projects}</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-4 p-3 rounded-lg" style={{ backgroundColor: `${coral}10` }}>
              <div className="flex justify-between items-baseline">
                <h3 className="font-bold text-sm" style={{ color: purple }}>{proj.name}</h3>
                <span className="text-xs text-gray-400">{formatDate(proj.startDate)} - {formatDate(proj.endDate)}</span>
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
        <h2 className="text-lg font-bold mb-3 tracking-wide" style={{ color: purple }}>{cs.title}</h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const orderedSections = sectionOrder.filter((id) => id !== 'personalInfo');
  const renderedIds = new Set(orderedSections);

  return (
    <div className="bg-white text-gray-800 font-sans" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
      {/* Hero Header - asymmetric coral block */}
      <div className="relative overflow-hidden" style={{ backgroundColor: coral, minHeight: '120px' }}>
        {/* Geometric decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-20" style={{ backgroundColor: purple, transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-10 w-16 h-16 rounded-full opacity-15" style={{ backgroundColor: '#fff' }} />
        <div className="relative p-8 flex items-center gap-6">
          {personalInfo.avatar && (
            <img src={personalInfo.avatar} alt="avatar" className="w-20 h-20 rounded-full border-4 border-white object-cover shadow-lg" />
          )}
          <div className="text-white">
            <h1 className="text-2xl font-bold">{personalInfo.name || L.namePlaceholder}</h1>
            <div className="flex flex-wrap gap-3 mt-2 text-xs opacity-90">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.address && <span>{personalInfo.address}</span>}
              {personalInfo.website && <span>{personalInfo.website}</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {orderedSections.map((id) => sectionRenderers[id]?.())}
        {/* Fallback */}
        {!renderedIds.has('experiences') && experiences.length > 0 && sectionRenderers.experiences?.()}
        {!renderedIds.has('educations') && educations.length > 0 && sectionRenderers.educations?.()}
        {!renderedIds.has('skills') && skills.length > 0 && sectionRenderers.skills?.()}
        {!renderedIds.has('projects') && projects.length > 0 && sectionRenderers.projects?.()}
      </div>
    </div>
  );
}
