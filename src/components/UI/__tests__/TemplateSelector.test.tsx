import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const MockTemplatePreview = ({ label }: { label: string }) => <div>{label}</div>;

// Mock templateRegistry
vi.mock('../../../services/templateRegistry', () => ({
  templateRegistry: {
    getAll: () => [
      {
        id: 'classic',
        name: '经典',
        nameEn: 'Classic',
        thumbnail: '',
        component: () => <MockTemplatePreview label="classic-preview" />,
      },
      {
        id: 'modern',
        name: '现代',
        nameEn: 'Modern',
        thumbnail: '',
        component: () => <MockTemplatePreview label="modern-preview" />,
      },
      {
        id: 'minimal',
        name: '极简',
        nameEn: 'Minimal',
        thumbnail: '',
        component: () => <MockTemplatePreview label="minimal-preview" />,
      },
    ],
    getById: (id: string) =>
      [
        {
          id: 'classic',
          name: '经典',
          nameEn: 'Classic',
          thumbnail: '',
          component: () => <MockTemplatePreview label="classic-preview" />,
        },
        {
          id: 'modern',
          name: '现代',
          nameEn: 'Modern',
          thumbnail: '',
          component: () => <MockTemplatePreview label="modern-preview" />,
        },
        {
          id: 'minimal',
          name: '极简',
          nameEn: 'Minimal',
          thumbnail: '',
          component: () => <MockTemplatePreview label="minimal-preview" />,
        },
      ].find((tpl) => tpl.id === id),
  },
}));

// Mock resumeStore
const mockSetTemplate = vi.fn();
let mockSelectedTemplateId = 'classic';
const mockResumeData = {
  personalInfo: {},
  experiences: [],
  educations: [],
  skills: [],
  projects: [],
  customSections: [],
  sectionTitles: {},
  sectionOrder: [],
  metadata: {
    templateId: 'classic',
    themeColor: '#2563EB',
    createdAt: '',
    updatedAt: '',
  },
};

vi.mock('../../../stores/resumeStore', () => ({
  useResumeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      selectedTemplateId: mockSelectedTemplateId,
      setTemplate: mockSetTemplate,
      resumeData: mockResumeData,
      themeColor: '#2563EB',
    }),
}));

vi.mock('../../../stores/uiStore', () => ({
  useUIStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      openGallery: vi.fn(),
    }),
}));

vi.mock('../../../hooks/useLocale', () => ({
  useLocale: () => ({
    locale: 'zh',
    t: {
      selectTemplate: '选择模板',
      browseMoreTemplates: '浏览更多模板',
    },
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

  it('renders live template previews inside fixed-size frames', () => {
    render(<TemplateSelector />);
    expect(screen.getByText('classic-preview')).toBeInTheDocument();
    const preview = screen.getByTestId('template-preview-classic');
    expect(preview.className).toContain('h-20');
    expect(preview.className).toContain('w-16');
  });

  it('shows template name below the preview', () => {
    render(<TemplateSelector />);
    expect(screen.getByText('经典')).toBeInTheDocument();
  });
});
