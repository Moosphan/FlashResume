import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import SkillsForm from '../SkillsForm';
import { useResumeStore } from '../../../stores/resumeStore';

describe('SkillsForm', () => {
  beforeEach(() => {
    useResumeStore.getState().clearAll();
  });

  it('renders section heading', () => {
    render(<SkillsForm />);
    expect(screen.getByText('技能专长')).toBeInTheDocument();
  });

  it('renders textarea with placeholder', () => {
    render(<SkillsForm />);
    expect(screen.getByPlaceholderText(/输入技能/)).toBeInTheDocument();
  });

  it('syncs skills to store on blur with separator', () => {
    render(<SkillsForm />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'React、Vue、TypeScript' } });
    fireEvent.blur(textarea);
    const skills = useResumeStore.getState().resumeData.skills;
    expect(skills).toHaveLength(3);
    expect(skills.map((s) => s.name)).toEqual(['React', 'Vue', 'TypeScript']);
  });

  it('allows free typing without immediate sync', () => {
    render(<SkillsForm />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: 'React、' } });
    // Store should not update yet (no blur)
    expect(useResumeStore.getState().resumeData.skills).toHaveLength(0);
    // Text should be preserved as-is
    expect(textarea.value).toBe('React、');
  });

  it('removes skills on blur when text is cleared', () => {
    useResumeStore.getState().addSkill('React');
    useResumeStore.getState().addSkill('Vue');
    render(<SkillsForm />);
    const textarea = screen.getByRole('textbox');
    fireEvent.focus(textarea);
    fireEvent.change(textarea, { target: { value: 'React' } });
    fireEvent.blur(textarea);
    const skills = useResumeStore.getState().resumeData.skills;
    expect(skills).toHaveLength(1);
    expect(skills[0].name).toBe('React');
  });

  it('displays existing skills as text', () => {
    useResumeStore.getState().addSkill('JavaScript');
    useResumeStore.getState().addSkill('CSS');
    render(<SkillsForm />);
    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    expect(textarea.value).toContain('JavaScript');
    expect(textarea.value).toContain('CSS');
  });
});
