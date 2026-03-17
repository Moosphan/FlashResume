import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRef } from 'react';

// Mock templateRegistry
const MockTemplate = vi.fn(({ data, themeColor }: { data: unknown; themeColor: string }) => (
  <div data-testid="mock-template" data-theme={themeColor}>
    {JSON.stringify(data)}
  </div>
));

vi.mock('../../../services/templateRegistry', () => ({
  templateRegistry: {
    getById: (id: string) => {
      if (id === 'classic') {
        return { id: 'classic', name: '经典', thumbnail: '', component: MockTemplate };
      }
      return undefined;
    },
  },
}));

// Mock resumeStore
const mockResumeData = {
  personalInfo: { name: 'Test', email: '', phone: '', address: '', website: '', avatar: '' },
  experiences: [],
  educations: [],
  skills: [],
  customSections: [],
  sectionOrder: ['personalInfo'],
  metadata: { templateId: 'classic', themeColor: '#2563EB', createdAt: '', updatedAt: '' },
};

let mockSelectedTemplateId = 'classic';
let mockThemeColor = '#2563EB';

vi.mock('../../../stores/resumeStore', () => ({
  useResumeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      resumeData: mockResumeData,
      selectedTemplateId: mockSelectedTemplateId,
      themeColor: mockThemeColor,
    }),
}));

import PreviewPanel from '../PreviewPanel';

describe('PreviewPanel', () => {
  beforeEach(() => {
    MockTemplate.mockClear();
    mockSelectedTemplateId = 'classic';
    mockThemeColor = '#2563EB';
  });

  it('renders the template component with correct props', () => {
    render(<PreviewPanel />);
    expect(screen.getByTestId('mock-template')).toBeInTheDocument();
    expect(MockTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ data: mockResumeData, themeColor: '#2563EB' }),
      undefined,
    );
  });

  it('shows fallback when template is not found', () => {
    mockSelectedTemplateId = 'nonexistent';
    render(<PreviewPanel />);
    expect(screen.getByText('未找到模板')).toBeInTheDocument();
  });

  it('displays zoom percentage at 60% by default', () => {
    render(<PreviewPanel />);
    expect(screen.getByText('60%')).toBeInTheDocument();
  });

  it('zooms in when + button is clicked', () => {
    render(<PreviewPanel />);
    const zoomInBtn = screen.getByLabelText('放大预览');
    fireEvent.click(zoomInBtn);
    expect(screen.getByText('70%')).toBeInTheDocument();
  });

  it('zooms out when − button is clicked', () => {
    render(<PreviewPanel />);
    const zoomOutBtn = screen.getByLabelText('缩小预览');
    fireEvent.click(zoomOutBtn);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('disables zoom out at minimum zoom', () => {
    render(<PreviewPanel />);
    const zoomOutBtn = screen.getByLabelText('缩小预览');
    // Click 3 times to reach 30% (60 - 30 = 30)
    for (let i = 0; i < 3; i++) {
      fireEvent.click(zoomOutBtn);
    }
    expect(screen.getByText('30%')).toBeInTheDocument();
    expect(zoomOutBtn).toBeDisabled();
  });

  it('disables zoom in at maximum zoom', () => {
    render(<PreviewPanel />);
    const zoomInBtn = screen.getByLabelText('放大预览');
    // Click 14 times to reach 200% (60 + 140 = 200)
    for (let i = 0; i < 14; i++) {
      fireEvent.click(zoomInBtn);
    }
    expect(screen.getByText('200%')).toBeInTheDocument();
    expect(zoomInBtn).toBeDisabled();
  });

  it('zoom buttons have proper size', () => {
    render(<PreviewPanel />);
    const zoomInBtn = screen.getByLabelText('放大预览');
    const zoomOutBtn = screen.getByLabelText('缩小预览');
    expect(zoomInBtn.className).toContain('w-8');
    expect(zoomInBtn.className).toContain('h-8');
    expect(zoomOutBtn.className).toContain('w-8');
    expect(zoomOutBtn.className).toContain('h-8');
  });

  it('exposes ref to the paper container for PDF export', () => {
    const ref = createRef<HTMLDivElement>();
    render(<PreviewPanel ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current?.className).toContain('shadow-lg');
  });

  it('applies scale transform based on zoom level', () => {
    render(<PreviewPanel />);
    const zoomInBtn = screen.getByLabelText('放大预览');
    fireEvent.click(zoomInBtn); // 60 + 10 = 70%
    // The scaling container wraps the paper sheet: paper -> scaling div -> sizing div
    const scalingContainer = screen.getByTestId('mock-template').parentElement?.parentElement;
    expect(scalingContainer?.style.transform).toBe('scale(0.7)');
  });
});
