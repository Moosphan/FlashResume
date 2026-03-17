import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// --- Mocks ---

let mockAutoSaveStatus = 'idle';
let mockToasts: Array<{ id: string; message: string; type: string }> = [];
const mockRemoveToast = vi.fn();

vi.mock('../../../stores/uiStore', () => ({
  useUIStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      autoSaveStatus: mockAutoSaveStatus,
      toasts: mockToasts,
      removeToast: mockRemoveToast,
    }),
}));

vi.mock('../../../stores/resumeStore', () => ({
  useResumeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      resumeData: {
        personalInfo: { name: '', email: '', phone: '', address: '', website: '', avatar: '' },
        experiences: [],
        educations: [],
        skills: [],
        customSections: [],
        sectionOrder: ['personalInfo', 'experiences', 'educations', 'skills'],
        metadata: { templateId: 'classic', themeColor: '#2563EB', createdAt: '', updatedAt: '' },
      },
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
  exportToPDF: vi.fn(),
  exportToJSON: vi.fn().mockReturnValue('{}'),
  downloadFile: vi.fn(),
}));

vi.mock('../../../services/importService', () => ({
  parseJSON: vi.fn(),
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
    mockAutoSaveStatus = 'idle';
    mockToasts = [];
  });

  it('renders the app title', () => {
    render(<AppLayout />);
    expect(screen.getByText('简历制作器')).toBeInTheDocument();
  });

  it('renders the ThemeToggle button', () => {
    render(<AppLayout />);
    const toggleBtn = screen.getByLabelText(/切换到/);
    expect(toggleBtn).toBeInTheDocument();
  });

  it('shows auto-save status when saved', () => {
    mockAutoSaveStatus = 'saved';
    render(<AppLayout />);
    expect(screen.getByText('已自动保存')).toBeInTheDocument();
  });

  it('does not show auto-save status when idle', () => {
    mockAutoSaveStatus = 'idle';
    render(<AppLayout />);
    expect(screen.queryByText('已自动保存')).not.toBeInTheDocument();
  });

  it('renders the ExportBar with export buttons', () => {
    render(<AppLayout />);
    expect(screen.getByLabelText('导出 PDF')).toBeInTheDocument();
    expect(screen.getByLabelText('导出 JSON')).toBeInTheDocument();
    expect(screen.getByLabelText('导入 JSON')).toBeInTheDocument();
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
});
