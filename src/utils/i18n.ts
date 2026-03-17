export type ResumeLanguage = 'zh' | 'en';

const labels = {
  zh: {
    experiences: '工作经历',
    educations: '教育背景',
    skills: '技能专长',
    projects: '项目经验',
    contact: '联系方式',
    namePlaceholder: '您的姓名',
    templateNotFound: '未找到模板',
  },
  en: {
    experiences: 'Work Experience',
    educations: 'Education',
    skills: 'Skills',
    projects: 'Projects',
    contact: 'Contact',
    namePlaceholder: 'Your Name',
    templateNotFound: 'Template not found',
  },
} as const;

export type SectionLabels = {
  experiences: string;
  educations: string;
  skills: string;
  projects: string;
  contact: string;
  namePlaceholder: string;
  templateNotFound: string;
};

export function getLabels(lang: ResumeLanguage): SectionLabels {
  return labels[lang];
}
