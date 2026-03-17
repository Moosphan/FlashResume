import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import ExperienceForm from '../ExperienceForm';
import { useResumeStore } from '../../../stores/resumeStore';

describe('ExperienceForm', () => {
  beforeEach(() => {
    useResumeStore.getState().clearAll();
  });

  it('renders section heading', () => {
    render(<ExperienceForm />);
    expect(screen.getByText('工作经历')).toBeInTheDocument();
  });

  it('renders add button', () => {
    render(<ExperienceForm />);
    expect(screen.getByText('+ 添加工作经历')).toBeInTheDocument();
  });

  it('adds a new experience when add button is clicked', () => {
    render(<ExperienceForm />);
    fireEvent.click(screen.getByText('+ 添加工作经历'));
    expect(useResumeStore.getState().resumeData.experiences).toHaveLength(1);
    expect(screen.getByPlaceholderText('请输入公司名称')).toBeInTheDocument();
  });

  it('renders all fields for an experience entry', () => {
    render(<ExperienceForm />);
    fireEvent.click(screen.getByText('+ 添加工作经历'));
    expect(screen.getByText('公司名称')).toBeInTheDocument();
    expect(screen.getByText('职位')).toBeInTheDocument();
    expect(screen.getByText('开始日期')).toBeInTheDocument();
    expect(screen.getByText('结束日期')).toBeInTheDocument();
    expect(screen.getByText('工作描述')).toBeInTheDocument();
  });

  it('updates store when company field changes', () => {
    render(<ExperienceForm />);
    fireEvent.click(screen.getByText('+ 添加工作经历'));
    const companyInput = screen.getByPlaceholderText('请输入公司名称');
    fireEvent.change(companyInput, { target: { value: '腾讯' } });
    expect(useResumeStore.getState().resumeData.experiences[0].company).toBe('腾讯');
  });

  it('updates store when position field changes', () => {
    render(<ExperienceForm />);
    fireEvent.click(screen.getByText('+ 添加工作经历'));
    const positionInput = screen.getByPlaceholderText('请输入职位');
    fireEvent.change(positionInput, { target: { value: '前端工程师' } });
    expect(useResumeStore.getState().resumeData.experiences[0].position).toBe('前端工程师');
  });

  it('updates store when description textarea changes', () => {
    render(<ExperienceForm />);
    fireEvent.click(screen.getByText('+ 添加工作经历'));
    const descEditor = document.querySelector('[aria-placeholder="请描述工作内容和成就"]') as HTMLElement;
    descEditor.innerHTML = '负责前端开发';
    fireEvent.input(descEditor);
    expect(useResumeStore.getState().resumeData.experiences[0].description).toBe('负责前端开发');
  });

  it('removes an experience when delete button is clicked', () => {
    render(<ExperienceForm />);
    fireEvent.click(screen.getByText('+ 添加工作经历'));
    expect(useResumeStore.getState().resumeData.experiences).toHaveLength(1);
    fireEvent.click(screen.getByText('删除'));
    expect(useResumeStore.getState().resumeData.experiences).toHaveLength(0);
  });

  it('shows date range error when end date is before start date', () => {
    // Pre-populate store with an experience that has a start date
    useResumeStore.getState().addExperience();
    const expId = useResumeStore.getState().resumeData.experiences[0].id;
    useResumeStore.getState().updateExperience(expId, { startDate: '2024-06' });

    render(<ExperienceForm />);

    // Find the end date input by its type="month" — the second one is endDate
    const monthInputs = document.querySelectorAll('input[type="month"]');
    const endDateInput = monthInputs[1] as HTMLInputElement;

    fireEvent.change(endDateInput, { target: { value: '2024-01' } });
    fireEvent.blur(endDateInput);

    expect(screen.getByText('结束日期不能早于开始日期')).toBeInTheDocument();
  });

  it('does not show date error when end date is after start date', () => {
    useResumeStore.getState().addExperience();
    const expId = useResumeStore.getState().resumeData.experiences[0].id;
    useResumeStore.getState().updateExperience(expId, { startDate: '2024-01' });

    render(<ExperienceForm />);

    const monthInputs = document.querySelectorAll('input[type="month"]');
    const endDateInput = monthInputs[1] as HTMLInputElement;

    fireEvent.change(endDateInput, { target: { value: '2024-06' } });
    fireEvent.blur(endDateInput);

    expect(screen.queryByText('结束日期不能早于开始日期')).not.toBeInTheDocument();
  });

  it('supports multiple experience entries', () => {
    render(<ExperienceForm />);
    fireEvent.click(screen.getByText('+ 添加工作经历'));
    fireEvent.click(screen.getByText('+ 添加工作经历'));
    expect(useResumeStore.getState().resumeData.experiences).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('请输入公司名称')).toHaveLength(2);
  });

  it('add button has min 44px touch target', () => {
    render(<ExperienceForm />);
    const addBtn = screen.getByText('+ 添加工作经历');
    expect(addBtn.className).toContain('min-h-[44px]');
  });

  it('delete button has min 44px touch target', () => {
    render(<ExperienceForm />);
    fireEvent.click(screen.getByText('+ 添加工作经历'));
    const deleteBtn = screen.getByText('删除');
    expect(deleteBtn.className).toContain('min-h-[44px]');
  });
});
