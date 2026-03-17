import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 专业模板 - 顶部大色块 header，紧凑双栏布局，适合资深人士
 */
export default function ProfessionalTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  // Right sidebar sections
  const sidebarIds = new Set(['skills', 'educations']);
  const mainIds = sectionOrder.filter((id) => !sidebarIds.has(id) && id !== 'personalInfo');
  const sideIds = sectionOrder.filter((id) => sidebarIds.has(id));

  const mainRenderers: Record<string, () => React.ReactNode> = {
    experiences: () =>
      experiences.length > 0 ? (
        <section key="experiences" className="mb-5">
          <h2 className="text-xs font-bold tracking-widest pb-1 mb-2 border-b" style={{ color: themeColor, borderColor: themeColor }}>{L.experiences}</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">{exp.position}</span>
                <span className="text-xs text-gray-400">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</span>
              </div>
              <p className="text-xs text-gray-500 font-medium">{exp.company}</p>
              {exp.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>}
            </div>
          ))}
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="projects" className="mb-5">
          <h2 className="text-xs font-bold tracking-widest pb-1 mb-2 border-b" style={{ color: themeColor, borderColor: themeColor }}>{L.projects}</h2>
          {projects.map((proj) => (
            <div key={proj.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">{proj.name}</span>
                <span className="text-xs text-gray-400">{formatDate(proj.startDate)} - {formatDate(proj.endDate)}</span>
              </div>
              {proj.role && <p className="text-xs text-gray-500 font-medium">{proj.role}</p>}
              {proj.description && <p className="text-xs text-gray-600 mt-1 whitespace-pre-line leading-relaxed">{proj.description}</p>}
            </div>
          ))}
        </section>
      ) : null,
  };

  customSections.forEach((cs) => {
    mainRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-5">
        <h2 className="text-xs font-bold tracking-widest pb-1 mb-2 border-b" style={{ color: themeColor, borderColor: themeColor }}>{cs.title}</h2>
        <div className="text-xs text-gray-600" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  const sideRenderers: Record<string, () => React.ReactNode> = {
    educations: () =>
      educations.length > 0 ? (
        <section key="educations" className="mb-5">
          <h2 className="text-xs font-bold tracking-widest pb-1 mb-2 border-b border-white/30 text-white/80">{L.educations}</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-2">
              <p className="text-xs font-semibold text-white">{edu.school}</p>
              <p className="text-xs text-white/70">{edu.degree} · {edu.major}</p>
              <p className="text-xs text-white/50">{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-5">
          <h2 className="text-xs font-bold tracking-widest pb-1 mb-2 border-b border-white/30 text-white/80">{L.skills}</h2>
          <div className="space-y-1.5">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-white/60 shrink-0" />
                <span className="text-xs text-white/90">{skill.name}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null,
  };

  return (
    <div className="bg-white text-gray-800 font-sans" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
      {/* Top header band */}
      <header className="px-8 py-6 text-white" style={{ backgroundColor: themeColor }}>
        <h1 className="text-3xl font-bold tracking-tight">{personalInfo.name || L.namePlaceholder}</h1>
        <div className="mt-2 flex flex-wrap gap-x-5 text-xs opacity-85">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
      </header>

      {/* Two-column body */}
      <div className="flex">
        {/* Main content - left */}
        <main className="flex-1 p-6">
          {mainIds.map((id) => mainRenderers[id]?.())}
          {!sectionOrder.includes('experiences') && experiences.length > 0 && mainRenderers.experiences?.()}
          {!sectionOrder.includes('projects') && projects.length > 0 && mainRenderers.projects?.()}
        </main>

        {/* Sidebar - right */}
        <aside className="w-1/3 p-6 text-white" style={{ backgroundColor: themeColor, opacity: 0.9 }}>
          {sideIds.map((id) => sideRenderers[id]?.())}
          {!sectionOrder.includes('skills') && skills.length > 0 && sideRenderers.skills?.()}
          {!sectionOrder.includes('educations') && educations.length > 0 && sideRenderers.educations?.()}
        </aside>
      </div>
    </div>
  );
}
