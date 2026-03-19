import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import SortableSectionList from '../SortableSectionList';
import { useResumeStore } from '../../../stores/resumeStore';

describe('SortableSectionList', () => {
  beforeEach(() => {
    useResumeStore.getState().clearAll();
  });

  it('renders all default sections with drag handle labels', () => {
    render(<SortableSectionList />);
    expect(screen.getAllByText('个人信息').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('工作经历').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('项目经验').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('教育背景').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('技能专长').length).toBeGreaterThanOrEqual(1);
  });

  it('renders drag handles for each section', () => {
    render(<SortableSectionList />);
    const handles = screen.getAllByLabelText('拖拽排序');
    // 5 default sections (personalInfo, experiences, projects, educations, skills)
    expect(handles.length).toBe(5);
  });

  it('drag handles have min 44x44px touch target', () => {
    render(<SortableSectionList />);
    const handles = screen.getAllByLabelText('拖拽排序');
    for (const handle of handles) {
      expect(handle.className).toContain('min-h-[44px]');
      expect(handle.className).toContain('min-w-[44px]');
    }
  });

  it('renders PersonalInfoForm content inside the personal info section', () => {
    render(<SortableSectionList />);
    // PersonalInfoForm renders a "姓名" label
    expect(screen.getByText('姓名')).toBeInTheDocument();
  });

  it('renders ExperienceForm content with add button', () => {
    render(<SortableSectionList />);
    expect(screen.getByText('+ 添加工作经历')).toBeInTheDocument();
  });

  it('renders EducationForm content with add button', () => {
    render(<SortableSectionList />);
    expect(screen.getByText('+ 添加教育背景')).toBeInTheDocument();
  });

  it('renders SkillsForm content', () => {
    render(<SortableSectionList />);
    // SkillsForm now renders a textarea
    expect(screen.getByPlaceholderText(/输入技能/)).toBeInTheDocument();
  });

  it('renders custom section when added', () => {
    useResumeStore.getState().addCustomSection();
    render(<SortableSectionList />);
    // Each custom section renders its own editor with title input
    expect(screen.getByPlaceholderText('请输入区块标题')).toBeInTheDocument();
    // The add custom section button is always visible at the bottom
    expect(screen.getByText('+ 添加自定义区块')).toBeInTheDocument();
  });

  it('section order matches store sectionOrder', () => {
    render(<SortableSectionList />);
    const sectionOrder = useResumeStore.getState().resumeData.sectionOrder;
    // Default order: personalInfo, experiences, projects, educations, skills
    expect(sectionOrder).toEqual(['personalInfo', 'experiences', 'projects', 'educations', 'skills']);
  });

  it('reorderSections updates the store sectionOrder', () => {
    useResumeStore.getState().reorderSections(0, 2);
    const newOrder = useResumeStore.getState().resumeData.sectionOrder;
    // personalInfo moved from index 0 to index 2
    expect(newOrder).toEqual(['experiences', 'projects', 'personalInfo', 'educations', 'skills']);
  });
});
