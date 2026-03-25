import type { TemplateProps } from '../../../types/resume';
import { formatDate } from '../../../utils/validators';
import { getLabels } from '../../../utils/i18n';

/**
 * 居中模板 - 所有内容居中对齐，大量留白，像展开的名片
 */
export default function CenteredTemplate({ data, themeColor, language }: TemplateProps) {
  const { personalInfo, experiences, educations, skills, projects, customSections, sectionOrder } = data;
  const L = getLabels(language);

  function Divider() {
    return <div className="w-8 h-[2px] mx-auto my-6" style={{ backgroundColor: themeColor }} />;
  }

  const sectionRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: () => null,
    experiences: () =>
      experiences.length > 0 ? (
        <section key="exp" className="mb-8 text-center">
          <h2 className="text-[11px] font-bold tracking-[0.25em] mb-4" style={{ color: themeColor }}>{L.experiences}</h2>
          {experiences.map((exp) => (
            <div key={exp.id} className="mb-4">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{exp.position}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{exp.company} · {formatDate(exp.startDate, language)} – {formatDate(exp.endDate, language)}</p>
              {exp.description && <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 max-w-md mx-auto whitespace-pre-line leading-relaxed [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: exp.description }} />}
            </div>
          ))}
        </section>
      ) : null,
    projects: () =>
      projects.length > 0 ? (
        <section key="proj" className="mb-8 text-center">
          <h2 className="text-[11px] font-bold tracking-[0.25em] mb-4" style={{ color: themeColor }}>{L.projects}</h2>
          {projects.map((p) => (
            <div key={p.id} className="mb-4">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{p.name}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{p.role && `${p.role} · `}{formatDate(p.startDate, language)} – {formatDate(p.endDate, language)}</p>
              {p.description && <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 max-w-md mx-auto whitespace-pre-line leading-relaxed [&_a]:text-blue-600 [&_a]:underline" dangerouslySetInnerHTML={{ __html: p.description }} />}
            </div>
          ))}
        </section>
      ) : null,
    educations: () =>
      educations.length > 0 ? (
        <section key="edu" className="mb-8 text-center">
          <h2 className="text-[11px] font-bold tracking-[0.25em] mb-4" style={{ color: themeColor }}>{L.educations}</h2>
          {educations.map((edu) => (
            <div key={edu.id} className="mb-3">
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{edu.school}</p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">{edu.degree} · {edu.major}</p>
              <p className="text-[9px] text-gray-400">{formatDate(edu.startDate, language)} – {formatDate(edu.endDate, language)}</p>
            </div>
          ))}
        </section>
      ) : null,
    skills: () =>
      skills.length > 0 ? (
        <section key="skills" className="mb-8 text-center">
          <h2 className="text-[11px] font-bold tracking-[0.25em] mb-4" style={{ color: themeColor }}>{L.skills}</h2>
          <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
            {skills.map((s) => (
              <span key={s.id} className="text-[10px] px-2.5 py-1 rounded-full border" style={{ borderColor: `${themeColor}40`, color: themeColor }}>
                {s.name}
              </span>
            ))}
          </div>
        </section>
      ) : null,
  };

  // Custom sections
  customSections.forEach((cs) => {
    sectionRenderers[cs.id] = () => (
      <section key={cs.id} className="mb-8 text-center">
        <h2 className="text-[11px] font-bold tracking-[0.25em] mb-4" style={{ color: themeColor }}>{cs.title}</h2>
        <div className="text-[10px] text-gray-600 dark:text-gray-400 max-w-md mx-auto" dangerouslySetInnerHTML={{ __html: cs.content }} />
      </section>
    );
  });

  // Build ordered sections with dividers
  const rendered: React.ReactNode[] = [];
  const orderedIds = sectionOrder.filter((id) => id !== 'personalInfo');
  orderedIds.forEach((id, i) => {
    const node = sectionRenderers[id]?.();
    if (node) {
      if (rendered.length > 0) rendered.push(<Divider key={`div-${i}`} />);
      rendered.push(node);
    }
  });
  // Fallbacks
  const fallbacks = ['experiences', 'projects', 'educations', 'skills'] as const;
  fallbacks.forEach((id) => {
    if (!sectionOrder.includes(id)) {
      const node = sectionRenderers[id]?.();
      if (node) {
        if (rendered.length > 0) rendered.push(<Divider key={`div-fb-${id}`} />);
        rendered.push(node);
      }
    }
  });

  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 font-sans" style={{ width: 794, minHeight: 1123, boxSizing: 'border-box' }}>
      {/* Centered header with generous whitespace */}
      <header className="text-center pt-16 pb-8 px-12">
        <h1 className="text-3xl font-light tracking-[0.15em]" style={{ color: themeColor }}>
          {personalInfo.name || L.namePlaceholder}
        </h1>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[10px] text-gray-400 dark:text-gray-500">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.address && <span>{personalInfo.address}</span>}
          {personalInfo.website && <span>{personalInfo.website}</span>}
        </div>
        <div className="w-12 h-[2px] mx-auto mt-6" style={{ backgroundColor: themeColor }} />
      </header>

      {/* Content */}
      <div className="px-16 pb-12">
        {rendered}
      </div>
    </div>
  );
}
