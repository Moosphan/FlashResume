import type { ResumeData, StandardSectionId } from '../types/resume';
import type { Translations } from './i18n';

export function getDefaultSectionTitle(t: Translations, sectionId: StandardSectionId): string {
  const titles: Record<StandardSectionId, string> = {
    personalInfo: t.personalInfo,
    experiences: t.experiences,
    projects: t.projects,
    educations: t.educations,
    skills: t.skills,
  };

  return titles[sectionId];
}

export function getSectionTitle(
  data: Pick<ResumeData, 'sectionTitles'>,
  t: Translations,
  sectionId: StandardSectionId,
): string {
  return data.sectionTitles?.[sectionId]?.trim() || getDefaultSectionTitle(t, sectionId);
}
