import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRef } from 'react';

// --- Mocks ---

const mockExportToPDF = vi.fn().mockResolvedValue(new Blob(['pdf'], { type: 'application/pdf' }));
const mockExportToJSON = vi.fn().mockReturnValue('{"test":true}');
const mockDownloadFile = vi.fn();

vi.mock('../../../services/exportService', () => ({
  exportToPDF: (...args: unknown[]) => mockExportToPDF(...args),
  exportToJSON: (...args: unknown[]) => mockExportToJSON(...args),
  downloadFile: (...args: unknown[]) => mockDownloadFile(...args),
}));

const mockParseJSON = vi.fn();
vi.mock('../../../services/importService', () => ({
  parseJSON: (...args: unknown[]) => mockParseJSON(...args),
}));

const mockImportFromJSON = vi.fn();
const mockAddToast = vi.fn();

let mockResumeData = {
  personalInfo: { name: '', email: '', phone: '', address: '', website: '', avatar: '' },
  experiences: [] as unknown[],
  educations: [] as unknown[],
  skills: [] as unknown[],
  customSections: [],
  sectionOrder: ['personalInfo'],
  metadata: { templateId: 'classic', themeColor: '#2563EB', createdAt: '', updatedAt: '' },
};

vi.mock('../../../stores/resumeStore', () => ({
  useResumeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      resumeData: mockResumeData,
      importFromJSON: mockImportFromJSON,
    }),
}));

vi.mock('../../../stores/uiStore', () => ({
  useUIStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      addToast: mockAddToast,
    }),
}));

import ExportBar from '../ExportBar';

function renderBar(refEl?: HTMLDivElement | null) {
  const ref = createRef<HTMLDivElement>();
  if (refEl !== undefined) {
    (ref as { current: HTMLDivElement | null }).current = refEl;
  } else {
    (ref as { current: HTMLDivElement | null }).current = document.createElement('div');
  }
  return render(<ExportBar previewRef={ref} />);
}

describe('ExportBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResumeData = {
      personalInfo: { name: '', email: '', phone: '', address: '', website: '', avatar: '' },
      experiences: [],
      educations: [],
      skills: [],
      customSections: [],
      sectionOrder: ['personalInfo'],
      metadata: { templateId: 'classic', themeColor: '#2563EB', createdAt: '', updatedAt: '' },
    };
  });

  it('renders all three buttons', () => {
    renderBar();
    expect(screen.getByLabelText('导出 PDF')).toBeInTheDocument();
    expect(screen.getByLabelText('导出 JSON')).toBeInTheDocument();
    expect(screen.getByLabelText('导入 JSON')).toBeInTheDocument();
  });

  it('disables export buttons when resume is empty', () => {
    renderBar();
    expect(screen.getByLabelText('导出 PDF')).toBeDisabled();
    expect(screen.getByLabelText('导出 JSON')).toBeDisabled();
  });

  it('enables export buttons when resume has a name', () => {
    mockResumeData.personalInfo.name = 'Alice';
    renderBar();
    expect(screen.getByLabelText('导出 PDF')).not.toBeDisabled();
    expect(screen.getByLabelText('导出 JSON')).not.toBeDisabled();
  });

  it('enables export buttons when resume has experiences', () => {
    mockResumeData.experiences = [{ id: '1', company: 'Co', position: '', startDate: '', endDate: '', description: '' }];
    renderBar();
    expect(screen.getByLabelText('导出 PDF')).not.toBeDisabled();
  });

  it('calls exportToPDF and downloadFile on PDF export click', async () => {
    mockResumeData.personalInfo.name = 'Bob';
    renderBar();
    fireEvent.click(screen.getByLabelText('导出 PDF'));
    await waitFor(() => {
      expect(mockExportToPDF).toHaveBeenCalledTimes(1);
      expect(mockDownloadFile).toHaveBeenCalledWith(expect.any(Blob), 'resume.pdf');
    });
  });

  it('shows error toast when PDF export fails', async () => {
    mockResumeData.personalInfo.name = 'Bob';
    mockExportToPDF.mockRejectedValueOnce(new Error('fail'));
    renderBar();
    fireEvent.click(screen.getByLabelText('导出 PDF'));
    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('PDF 生成失败，请重试', 'error');
    });
  });

  it('calls exportToJSON and downloadFile on JSON export click', () => {
    mockResumeData.personalInfo.name = 'Bob';
    renderBar();
    fireEvent.click(screen.getByLabelText('导出 JSON'));
    expect(mockExportToJSON).toHaveBeenCalledWith(mockResumeData);
    expect(mockDownloadFile).toHaveBeenCalledWith(expect.any(Blob), 'resume.json');
  });

  it('import button is always enabled', () => {
    renderBar();
    expect(screen.getByLabelText('导入 JSON')).not.toBeDisabled();
  });

  it('imports JSON successfully and shows success toast', async () => {
    mockParseJSON.mockReturnValue({ success: true, data: {} });
    renderBar();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['{"test":true}'], 'resume.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockParseJSON).toHaveBeenCalled();
      expect(mockImportFromJSON).toHaveBeenCalled();
      expect(mockAddToast).toHaveBeenCalledWith('导入成功', 'success');
    });
  });

  it('shows error toast for invalid JSON import', async () => {
    mockParseJSON.mockReturnValue({ success: false, error: 'invalid_json' });
    renderBar();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['not json'], 'bad.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith('文件格式无效', 'error');
    });
  });

  it('shows error toast for missing fields import', async () => {
    mockParseJSON.mockReturnValue({ success: false, error: 'missing_fields', details: ['personalInfo', 'experiences'] });
    renderBar();

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(['{}'], 'incomplete.json', { type: 'application/json' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.stringContaining('简历数据不完整'),
        'error',
      );
    });
  });

  it('buttons have min 36x36px touch target', () => {
    renderBar();
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn.className).toContain('min-w-[36px]');
      expect(btn.className).toContain('min-h-[36px]');
    });
  });
});
