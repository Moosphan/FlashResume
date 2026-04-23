import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import ClassicTemplate from '../templates/ClassicTemplate';
import type { ResumeData } from '../../../types/resume';

const resumeData: ResumeData = {
  personalInfo: {
    name: 'Alex Chen',
    email: '',
    phone: '',
    address: '',
    website: '',
    avatar: '',
  },
  experiences: [{
    id: 'exp-1',
    company: 'Google',
    position: 'Senior Product Manager',
    startDate: '2020-01',
    endDate: '',
    description: '',
  }],
  educations: [{
    id: 'edu-1',
    school: 'Stanford',
    degree: 'MBA',
    major: 'Business',
    startDate: '2016-09',
    endDate: '2018-06',
  }],
  skills: [{ id: 'skill-1', name: 'Strategy', level: 'advanced' }],
  projects: [{
    id: 'project-1',
    name: 'Growth Platform',
    role: 'Lead',
    startDate: '2022-01',
    endDate: '2022-06',
    description: '',
  }],
  customSections: [],
  sectionTitles: {
    experiences: '职业经历',
    educations: '学习经历',
    skills: '核心能力',
    projects: '重点项目',
  },
  sectionOrder: ['personalInfo', 'experiences', 'projects', 'educations', 'skills'],
  metadata: {
    templateId: 'classic',
    themeColor: '#2563EB',
    createdAt: '',
    updatedAt: '',
  },
};

describe('ClassicTemplate', () => {
  it('renders custom section titles in preview output', () => {
    render(<ClassicTemplate data={resumeData} themeColor="#2563EB" language="zh" />);

    expect(screen.getByText('职业经历')).toBeInTheDocument();
    expect(screen.getByText('学习经历')).toBeInTheDocument();
    expect(screen.getByText('核心能力')).toBeInTheDocument();
    expect(screen.getByText('重点项目')).toBeInTheDocument();
    expect(screen.queryByText('工作经历')).not.toBeInTheDocument();
  });
});
