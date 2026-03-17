import type { ResumeData } from '../types/resume';

/**
 * 预设简历数据 — 国外大厂产品经理履历
 * 用于首次打开页面时展示简历效果
 */
export const PRESET_RESUME_DATA: ResumeData = {
  personalInfo: {
    name: 'Alex Chen',
    email: 'alex.chen@email.com',
    phone: '+1 (415) 555-0192',
    address: 'San Francisco, CA',
    website: 'https://alexchen.pm',
    avatar: '',
  },
  experiences: [
    {
      id: 'exp-1',
      company: 'Google',
      position: 'Senior Product Manager',
      startDate: '2021-03',
      endDate: '',
      description:
        'Led the Google Maps local search experience redesign, driving a 23% increase in user engagement across 40+ markets.\nManaged a cross-functional team of 12 engineers, 3 designers, and 2 data scientists.\nDefined product roadmap and OKRs aligned with company-level growth objectives.\nShipped 3 major features from 0→1 including real-time crowd density and neighborhood guides.',
    },
    {
      id: 'exp-2',
      company: 'Meta',
      position: 'Product Manager',
      startDate: '2018-06',
      endDate: '2021-02',
      description:
        'Owned the Facebook Marketplace trust & safety product area, reducing fraud reports by 35%.\nLaunched AI-powered listing quality scoring system processing 2M+ listings daily.\nCollaborated with policy, legal, and engineering teams across 3 time zones.\nConducted 50+ user research sessions to identify pain points in the buyer journey.',
    },
    {
      id: 'exp-3',
      company: 'Amazon',
      position: 'Associate Product Manager',
      startDate: '2016-07',
      endDate: '2018-05',
      description:
        'Drove the Prime Video content discovery experience for emerging markets.\nA/B tested 15+ recommendation algorithm variants, improving click-through rate by 18%.\nPartnered with content acquisition teams to inform regional licensing strategy.',
    },
  ],
  educations: [
    {
      id: 'edu-1',
      school: 'Stanford University',
      degree: 'MBA',
      major: 'Technology & Innovation',
      startDate: '2014-09',
      endDate: '2016-06',
    },
    {
      id: 'edu-2',
      school: 'UC Berkeley',
      degree: 'B.S.',
      major: 'Computer Science',
      startDate: '2010-09',
      endDate: '2014-06',
    },
  ],
  skills: [
    { id: 'sk-1', name: 'Product Strategy', level: 'expert' },
    { id: 'sk-2', name: 'User Research', level: 'expert' },
    { id: 'sk-3', name: 'A/B Testing', level: 'advanced' },
    { id: 'sk-4', name: 'SQL & Data Analysis', level: 'advanced' },
    { id: 'sk-5', name: 'Agile / Scrum', level: 'expert' },
    { id: 'sk-6', name: 'Figma & Prototyping', level: 'intermediate' },
    { id: 'sk-7', name: 'Technical Architecture', level: 'intermediate' },
    { id: 'sk-8', name: 'Stakeholder Management', level: 'expert' },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'Maps Neighborhood Guides',
      role: 'Product Lead',
      startDate: '2022-01',
      endDate: '2023-06',
      description:
        'Built a community-driven local content platform from scratch, reaching 5M monthly active users within 6 months of launch.\nDesigned the contributor incentive system and content moderation pipeline.\nCoordinated with Google Cloud AI team to implement auto-translation for 12 languages.',
    },
    {
      id: 'proj-2',
      name: 'Marketplace Trust Score',
      role: 'Product Owner',
      startDate: '2019-08',
      endDate: '2020-12',
      description:
        'Developed a real-time seller trust scoring system using ML models trained on transaction history and user behavior signals.\nReduced buyer-reported scams by 42% and increased repeat purchase rate by 15%.\nPresented results at internal Meta ML Summit, adopted by 2 other product teams.',
    },
  ],
  customSections: [
    {
      id: 'cs-1',
      title: 'Certifications & Awards',
      content:
        'Pragmatic Institute Certified Product Manager (PMC-VI) · 2020<br/>Google Spot Bonus for Maps Search Excellence · 2022<br/>Meta Hackathon Winner — AI Safety Category · 2019',
    },
  ],
  sectionOrder: ['personalInfo', 'experiences', 'projects', 'educations', 'skills', 'cs-1'],
  metadata: {
    templateId: 'classic',
    themeColor: '#2563EB',
    createdAt: '2024-01-15T08:00:00.000Z',
    updatedAt: '2024-01-15T08:00:00.000Z',
  },
};
