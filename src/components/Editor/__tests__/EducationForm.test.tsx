import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import EducationForm from '../EducationForm';
import { useResumeStore } from '../../../stores/resumeStore';

describe('EducationForm', () => {
  beforeEach(() => {
    useResumeStore.getState().clearAll();
  });

  it('renders section heading', () => {
    render(<EducationForm />);
    expect(screen.getByText('教育背景')).toBeInTheDocument();
  });

  it('renders add button', () => {
    render(<EducationForm />);
    expect(screen.getByText('+ 添加教育背景')).toBeInTheDocument();
  });

  it('adds a new education when add button is clicked', () => {
    render(<EducationForm />);
    fireEvent.click(screen.getByText('+ 添加教育背景'));
    expect(useResumeStore.getState().resumeData.educations).toHaveLength(1);
    expect(screen.getByPlaceholderText('请输入学校名称')).toBeInTheDocument();
  });

  it('renders all fields for an education entry', () => {
    render(<EducationForm />);
    fireEvent.click(screen.getByText('+ 添加教育背景'));
    expect(screen.getByText('学校名称')).toBeInTheDocument();
    expect(screen.getByText('学位')).toBeInTheDocument();
    expect(screen.getByText('专业')).toBeInTheDocument();
    expect(screen.getByText('开始日期')).toBeInTheDocument();
    expect(screen.getByText('结束日期')).toBeInTheDocument();
  });

  it('updates store when school field changes', () => {
    render(<EducationForm />);
    fireEvent.click(screen.getByText('+ 添加教育背景'));
    const schoolInput = screen.getByPlaceholderText('请输入学校名称');
    fireEvent.change(schoolInput, { target: { value: '北京大学' } });
    expect(useResumeStore.getState().resumeData.educations[0].school).toBe('北京大学');
  });

  it('updates store when degree field changes', () => {
    render(<EducationForm />);
    fireEvent.click(screen.getByText('+ 添加教育背景'));
    const degreeInput = screen.getByPlaceholderText('请输入学位');
    fireEvent.change(degreeInput, { target: { value: '学士' } });
    expect(useResumeStore.getState().resumeData.educations[0].degree).toBe('学士');
  });

  it('updates store when major field changes', () => {
    render(<EducationForm />);
    fireEvent.click(screen.getByText('+ 添加教育背景'));
    const majorInput = screen.getByPlaceholderText('请输入专业');
    fireEvent.change(majorInput, { target: { value: '计算机科学' } });
    expect(useResumeStore.getState().resumeData.educations[0].major).toBe('计算机科学');
  });

  it('removes an education when delete button is clicked', () => {
    render(<EducationForm />);
    fireEvent.click(screen.getByText('+ 添加教育背景'));
    expect(useResumeStore.getState().resumeData.educations).toHaveLength(1);
    fireEvent.click(screen.getByText('删除'));
    expect(useResumeStore.getState().resumeData.educations).toHaveLength(0);
  });

  it('shows date range error when end date is before start date', () => {
    useResumeStore.getState().addEducation();
    const eduId = useResumeStore.getState().resumeData.educations[0].id;
    useResumeStore.getState().updateEducation(eduId, { startDate: '2024-06' });

    render(<EducationForm />);

    const monthInputs = document.querySelectorAll('input[type="month"]');
    const endDateInput = monthInputs[1] as HTMLInputElement;

    fireEvent.change(endDateInput, { target: { value: '2024-01' } });
    fireEvent.blur(endDateInput);

    expect(screen.getByText('结束日期不能早于开始日期')).toBeInTheDocument();
  });

  it('does not show date error when end date is after start date', () => {
    useResumeStore.getState().addEducation();
    const eduId = useResumeStore.getState().resumeData.educations[0].id;
    useResumeStore.getState().updateEducation(eduId, { startDate: '2024-01' });

    render(<EducationForm />);

    const monthInputs = document.querySelectorAll('input[type="month"]');
    const endDateInput = monthInputs[1] as HTMLInputElement;

    fireEvent.change(endDateInput, { target: { value: '2024-06' } });
    fireEvent.blur(endDateInput);

    expect(screen.queryByText('结束日期不能早于开始日期')).not.toBeInTheDocument();
  });

  it('supports multiple education entries', () => {
    render(<EducationForm />);
    fireEvent.click(screen.getByText('+ 添加教育背景'));
    fireEvent.click(screen.getByText('+ 添加教育背景'));
    expect(useResumeStore.getState().resumeData.educations).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('请输入学校名称')).toHaveLength(2);
  });

  it('add button has min 44px touch target', () => {
    render(<EducationForm />);
    const addBtn = screen.getByText('+ 添加教育背景');
    expect(addBtn.className).toContain('min-h-[44px]');
  });

  it('delete button has min 44px touch target', () => {
    render(<EducationForm />);
    fireEvent.click(screen.getByText('+ 添加教育背景'));
    const deleteBtn = screen.getByText('删除');
    expect(deleteBtn.className).toContain('min-h-[44px]');
  });
});
