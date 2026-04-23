import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 农业/环保行业模板 - 单栏自然风格，森林绿+大地棕配色，有机曲线装饰，卡片式经验
 */
export default function AgricultureTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language, data.sectionTitles);

  const forestGreen = themeColor || '#2d5016';
  const earthBrown = '#8B7355';

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: forestGreen, borderBottom: `2px solid ${earthBrown}44` }}>
            🌱 {L.experiences}
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="p-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${forestGreen}08, ${earthBrown}08)` }}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm" style={{ color: forestGreen }}>{exp.position}</h3>
                  <span className="text-xs text-gray-400">{formatDate(exp.startDate, language)} - {formatDate(exp.endDate, language)}</span>
                </div>
                <p className="text-xs" style={{ color: earthBrown }}>{exp.company}</p>
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
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: forestGreen, borderBottom: `2px solid ${earthBrown}44` }}>
            🎓 {L.educations}
          </h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <h3 className="font-bold text-sm" style={{ color: forestGreen }}>{edu.school}</h3>
              <p className="text-xs text-gray-500">{edu.degree} · {edu.major} · {formatDate(edu.startDate, language)} - {formatDate(edu.endDate, language)}</p>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: forestGreen, borderBottom: `2px solid ${earthBrown}44` }}>
            🛠 {L.skills}
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span key={skill.id} className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: `${forestGreen}15`, color: forestGreen, border: `1px solid ${forestGreen}33` }}>
                {skill.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-6">
          <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: forestGreen, borderBottom: `2px solid ${earthBrown}44` }}>
            📋 {L.projects}
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-3 rounded-xl" style={{ background: `linear-gradient(135deg, ${forestGreen}08, ${earthBrown}08)` }}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-sm" style={{ color: forestGreen }}>{proj.name}</h3>
                  <span className="text-xs text-gray-400">{formatDate(proj.startDate, language)} - {formatDate(proj.endDate, language)}</span>
                </div>
                {proj.role && <p className="text-xs" style={{ color: earthBrown }}>{proj.role}</p>}
                {proj.description && (
                  <div className="text-xs text-gray-600 mt-1 whitespace-pre-line [&_a]:underline" dangerouslySetInnerHTML={{ __html: proj.description }} />
                )}
              </div>
            ))}
          </div>
        </section>
      ) : null,
  };

  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-6">
        <h2 className="text-sm font-bold mb-3 pb-1" style={{ color: forestGreen, borderBottom: `2px solid ${earthBrown}44` }}>
          {cs.title}
        </h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const orderedSections = sectionOrder.filter((id) => id !== 'personalInfo');
  const renderedIds = new Set(orderedSections);

  return (
    <div className="bg-white font-sans" style={{ width: 794, minHeight: 1123, boxSizing: 'border-box', color: '#333' }}>
      {/* Header with organic curve */}
      <div className="relative px-10 pt-8 pb-6 overflow-hidden" style={{ backgroundColor: `${forestGreen}08` }}>
        {/* Organic curve decoration */}
        <div className="absolute -bottom-4 left-0 right-0 h-8" style={{
          background: 'white',
          borderRadius: '50% 50% 0 0 / 100% 100% 0 0',
        }} />
        <div className="flex items-center gap-6">
          {personalInfo.avatar && (
            <img src={personalInfo.avatar} alt="avatar" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: forestGreen }} />
          )}
          <div>
            <h1 className="text-2xl font-bold" style={{ color: forestGreen }}>{personalInfo.name || L.namePlaceholder}</h1>
            <div className="flex flex-wrap gap-3 mt-1 text-xs" style={{ color: earthBrown }}>
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
