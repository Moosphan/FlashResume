import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks ---

let mockToasts: Array<{ id: string; message: string; type: string }> = [];
const mockRemoveToast = vi.fn();
const mockAddToast = vi.fn();
let mockActiveTab: 'editor' | 'preview' = 'editor';
const mockSetActiveTab = vi.fn();
let mockIsMobile = false;
let mockIsTablet = false;
let mockResumeData = {
  personalInfo: { name: '', email: '', phone: '', address: '', website: '', avatar: '' },
  experiences: [] as unknown[],
  educations: [] as unknown[],
  skills: [] as unknown[],
  customSections: [],
  sectionOrder: ['personalInfo', 'experiences', 'educations', 'skills'],
  metadata: { templateId: 'classic', themeColor: '#2563EB', createdAt: '', updatedAt: '' },
};
const mockExportToPDF = vi.fn().mockResolvedValue(new Blob(['pdf'], { type: 'application/pdf' }));
const mockExportToPNG = vi.fn().mockResolvedValue(new Blob(['png'], { type: 'image/png' }));
const mockExportToJPG = vi.fn().mockResolvedValue(new Blob(['jpg'], { type: 'image/jpeg' }));
const mockDownloadFile = vi.fn();

vi.mock('../../../stores/uiStore', () => ({
  useUIStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      toasts: mockToasts,
      removeToast: mockRemoveToast,
      addToast: mockAddToast,
      activeTab: mockActiveTab,
      setActiveTab: mockSetActiveTab,
    }),
}));

vi.mock('../../../stores/resumeStore', () => ({
  useResumeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      resumeData: mockResumeData,
      selectedTemplateId: 'classic',
      themeColor: '#2563EB',
      setTemplate: vi.fn(),
      setThemeColor: vi.fn(),
      reorderSections: vi.fn(),
      importFromJSON: vi.fn(),
    }),
}));

vi.mock('../../../services/templateRegistry', () => ({
  templateRegistry: {
    getAll: () => [
      { id: 'classic', name: 'Classic', thumbnail: '', component: () => null },
    ],
    getById: () => ({ id: 'classic', name: 'Classic', thumbnail: '', component: () => null }),
  },
}));

vi.mock('../../../services/exportService', () => ({
  exportToPDF: (...args: unknown[]) => mockExportToPDF(...args),
  exportToJSON: vi.fn().mockReturnValue('{}'),
  exportToPNG: (...args: unknown[]) => mockExportToPNG(...args),
  exportToJPG: (...args: unknown[]) => mockExportToJPG(...args),
  downloadFile: (...args: unknown[]) => mockDownloadFile(...args),
}));

vi.mock('../../../services/importService', () => ({
  parseJSON: vi.fn(),
}));

vi.mock('../../../hooks/useMediaQuery', () => ({
  useIsMobile: () => mockIsMobile,
  useIsTablet: () => mockIsTablet,
}));

vi.mock('../MobileTabNav', () => ({
  default: () => <div data-testid="mobile-tab-nav">MobileTabNav</div>,
}));

vi.mock('../Sidebar', () => ({
  default: ({ open, onClose }: { open: boolean; onClose: () => void }) => (
    <div data-testid="sidebar" data-open={open}>
      <button onClick={onClose}>close-sidebar</button>
    </div>
  ),
}));

import AppLayout from '../AppLayout';

describe('AppLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockToasts = [];
    mockActiveTab = 'editor';
    mockIsMobile = false;
    mockIsTablet = false;
    mockResumeData = {
      personalInfo: { name: '', email: '', phone: '', address: '', website: '', avatar: '' },
      experiences: [],
      educations: [],
      skills: [],
      customSections: [],
      sectionOrder: ['personalInfo', 'experiences', 'educations', 'skills'],
      metadata: { templateId: 'classic', themeColor: '#2563EB', createdAt: '', updatedAt: '' },
    };
  });

  it('renders the app title', () => {
    render(<AppLayout />);
    expect(screen.getByText('Flash Resume')).toBeInTheDocument();
  });

  it('renders the ThemeToggle button', () => {
    render(<AppLayout />);
    const toggleBtn = screen.getByLabelText(/切换到/);
    expect(toggleBtn).toBeInTheDocument();
  });

  it('renders the ExportBar with menu trigger', () => {
    render(<AppLayout />);
    expect(screen.getByLabelText('导出菜单')).toBeInTheDocument();
  });

  it('renders toast notifications', () => {
    mockToasts = [
      { id: 't1', message: '保存成功', type: 'success' },
      { id: 't2', message: '出错了', type: 'error' },
    ];
    render(<AppLayout />);
    expect(screen.getByText('保存成功')).toBeInTheDocument();
    expect(screen.getByText('出错了')).toBeInTheDocument();
  });

  it('calls removeToast when toast close button is clicked', () => {
    mockToasts = [{ id: 't1', message: '测试通知', type: 'info' }];
    render(<AppLayout />);
    const closeBtn = screen.getByLabelText('关闭通知');
    fireEvent.click(closeBtn);
    expect(mockRemoveToast).toHaveBeenCalledWith('t1');
  });

  it('does not render toast container when no toasts', () => {
    mockToasts = [];
    render(<AppLayout />);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('uses full viewport height layout', () => {
    const { container } = render(<AppLayout />);
    const root = container.firstElementChild;
    expect(root?.className).toContain('h-screen');
  });

  it('has responsive flex layout classes on main area', () => {
    const { container } = render(<AppLayout />);
    const main = container.querySelector('main');
    expect(main?.className).toContain('flex-col');
    expect(main?.className).toContain('lg:flex-row');
  });

  it('exports from an offscreen preview on mobile editor tab', async () => {
    mockIsMobile = true;
    mockActiveTab = 'editor';
    mockResumeData.personalInfo.name = 'Mobile User';

    render(<AppLayout />);
    fireEvent.click(screen.getByLabelText('导出菜单'));
    fireEvent.click(screen.getByText('导出 PNG'));

    await waitFor(() => {
      expect(mockExportToPNG).toHaveBeenCalledWith(
        expect.any(HTMLDivElement),
        expect.any(Function),
      );
      expect(mockDownloadFile).toHaveBeenCalledWith(expect.any(Blob), 'resume.png');
    });
  });
});
