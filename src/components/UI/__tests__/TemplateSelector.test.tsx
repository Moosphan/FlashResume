import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock templateRegistry
vi.mock('../../../services/templateRegistry', () => ({
  templateRegistry: {
    getAll: () => [
      { id: 'classic', name: '经典', thumbnail: '', component: () => null },
      { id: 'modern', name: '现代', thumbnail: '', component: () => null },
      { id: 'minimal', name: '极简', thumbnail: '', component: () => null },
    ],
  },
}));

// Mock resumeStore
const mockSetTemplate = vi.fn();
let mockSelectedTemplateId = 'classic';

vi.mock('../../../stores/resumeStore', () => ({
  useResumeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      selectedTemplateId: mockSelectedTemplateId,
      setTemplate: mockSetTemplate,
    }),
}));

import TemplateSelector from '../TemplateSelector';

describe('TemplateSelector', () => {
  beforeEach(() => {
    mockSetTemplate.mockClear();
    mockSelectedTemplateId = 'classic';
  });

  it('renders all templates', () => {
    render(<TemplateSelector />);
    expect(screen.getByLabelText('选择模板：经典')).toBeInTheDocument();
    expect(screen.getByLabelText('选择模板：现代')).toBeInTheDocument();
    expect(screen.getByLabelText('选择模板：极简')).toBeInTheDocument();
  });

  it('highlights the selected template', () => {
    render(<TemplateSelector />);
    const classicBtn = screen.getByLabelText('选择模板：经典');
    expect(classicBtn).toHaveAttribute('aria-pressed', 'true');
    const modernBtn = screen.getByLabelText('选择模板：现代');
    expect(modernBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls setTemplate on click', () => {
    render(<TemplateSelector />);
    fireEvent.click(screen.getByLabelText('选择模板：现代'));
    expect(mockSetTemplate).toHaveBeenCalledWith('modern');
  });

  it('template buttons meet min 44x44 touch target', () => {
    render(<TemplateSelector />);
    const btn = screen.getByLabelText('选择模板：经典');
    expect(btn.className).toContain('min-h-[44px]');
    expect(btn.className).toContain('min-w-[44px]');
  });

  it('shows template name below placeholder', () => {
    render(<TemplateSelector />);
    // Each template name appears twice: once in the placeholder, once as label
    const classicTexts = screen.getAllByText('经典');
    expect(classicTexts.length).toBeGreaterThanOrEqual(2);
  });
});
