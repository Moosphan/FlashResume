import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import CustomSectionForm from '../CustomSectionForm';
import { useResumeStore } from '../../../stores/resumeStore';

describe('CustomSectionForm', () => {
  beforeEach(() => {
    useResumeStore.getState().clearAll();
  });

  it('renders section heading', () => {
    render(<CustomSectionForm />);
    expect(screen.getByText('自定义区块')).toBeInTheDocument();
  });

  it('renders add button', () => {
    render(<CustomSectionForm />);
    expect(screen.getByText('+ 添加区块')).toBeInTheDocument();
  });

  it('adds a new custom section when add button is clicked', () => {
    render(<CustomSectionForm />);
    fireEvent.click(screen.getByText('+ 添加区块'));
    expect(useResumeStore.getState().resumeData.customSections).toHaveLength(1);
    expect(screen.getByPlaceholderText('请输入区块标题')).toBeInTheDocument();
  });

  it('renders title and content fields for a custom section', () => {
    render(<CustomSectionForm />);
    fireEvent.click(screen.getByText('+ 添加区块'));
    expect(screen.getByText('区块标题')).toBeInTheDocument();
    expect(screen.getByText('内容')).toBeInTheDocument();
  });

  it('updates store when title field changes', () => {
    render(<CustomSectionForm />);
    fireEvent.click(screen.getByText('+ 添加区块'));
    const titleInput = screen.getByPlaceholderText('请输入区块标题');
    fireEvent.change(titleInput, { target: { value: '项目经历' } });
    expect(useResumeStore.getState().resumeData.customSections[0].title).toBe('项目经历');
  });

  it('updates store when content textarea changes', () => {
    render(<CustomSectionForm />);
    fireEvent.click(screen.getByText('+ 添加区块'));
    const contentInput = screen.getByPlaceholderText('请输入区块内容');
    fireEvent.change(contentInput, { target: { value: '负责核心模块开发' } });
    expect(useResumeStore.getState().resumeData.customSections[0].content).toBe('负责核心模块开发');
  });

  it('removes a custom section when delete button is clicked', () => {
    render(<CustomSectionForm />);
    fireEvent.click(screen.getByText('+ 添加区块'));
    expect(useResumeStore.getState().resumeData.customSections).toHaveLength(1);
    fireEvent.click(screen.getByText('删除'));
    expect(useResumeStore.getState().resumeData.customSections).toHaveLength(0);
  });

  it('supports multiple custom sections', () => {
    render(<CustomSectionForm />);
    fireEvent.click(screen.getByText('+ 添加区块'));
    fireEvent.click(screen.getByText('+ 添加区块'));
    expect(useResumeStore.getState().resumeData.customSections).toHaveLength(2);
    expect(screen.getAllByPlaceholderText('请输入区块标题')).toHaveLength(2);
  });

  it('shows default label for untitled section', () => {
    render(<CustomSectionForm />);
    fireEvent.click(screen.getByText('+ 添加区块'));
    expect(screen.getByText('未命名区块')).toBeInTheDocument();
  });

  it('add button has min 44px touch target', () => {
    render(<CustomSectionForm />);
    const addBtn = screen.getByText('+ 添加区块');
    expect(addBtn.className).toContain('min-h-[44px]');
  });

  it('delete button has min 44px touch target', () => {
    render(<CustomSectionForm />);
    fireEvent.click(screen.getByText('+ 添加区块'));
    const deleteBtn = screen.getByText('删除');
    expect(deleteBtn.className).toContain('min-h-[44px]');
  });
});
