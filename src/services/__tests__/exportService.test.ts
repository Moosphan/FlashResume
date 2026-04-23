import { describe, it, expect, vi, beforeEach } from 'vitest';
import { exportToJSON, downloadFile } from '../exportService';
import { DEFAULT_RESUME_DATA } from '../../types/resume';
import type { ResumeData } from '../../types/resume';

// Mock renderEngine (html-to-image backed) for image/PDF export tests
vi.mock('../renderEngine', () => {
  const mockCanvas = {
    width: 1588,
    height: 2246,
    toDataURL: vi.fn(() => 'data:image/png;base64,mockBase64'),
    getContext: vi.fn(() => ({
      drawImage: vi.fn(),
      fillRect: vi.fn(),
    })),
  } as unknown as HTMLCanvasElement;

  return {
    renderEngine: {
      domToCanvas: vi.fn(() => Promise.resolve(mockCanvas)),
      domToDataURL: vi.fn(() => Promise.resolve('data:image/png;base64,mockBase64')),
    },
  };
});

describe('exportToJSON', () => {
  it('serializes ResumeData to formatted JSON with 2-space indentation', () => {
    const result = exportToJSON(DEFAULT_RESUME_DATA);
    expect(result).toBe(JSON.stringify(DEFAULT_RESUME_DATA, null, 2));
  });

  it('produces valid JSON that can be parsed back', () => {
    const result = exportToJSON(DEFAULT_RESUME_DATA);
    const parsed = JSON.parse(result);
    expect(parsed).toEqual(DEFAULT_RESUME_DATA);
  });

  it('handles resume data with populated fields', () => {
    const data: ResumeData = {
      ...DEFAULT_RESUME_DATA,
      personalInfo: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '+1-555-0100',
        address: '123 Main St',
        website: 'https://jane.dev',
        avatar: '',
      },
      experiences: [
        {
          id: 'exp-1',
          company: 'Acme Corp',
          position: 'Engineer',
          startDate: '2020-01',
          endDate: '2023-06',
          description: 'Built things',
        },
      ],
      skills: [
        { id: 'sk-1', name: 'TypeScript', level: 'expert' },
      ],
    };

    const result = exportToJSON(data);
    const parsed = JSON.parse(result);
    expect(parsed.personalInfo.name).toBe('Jane Doe');
    expect(parsed.experiences).toHaveLength(1);
    expect(parsed.skills[0].name).toBe('TypeScript');
  });

  it('preserves custom section titles in exported JSON', () => {
    const data: ResumeData = {
      ...DEFAULT_RESUME_DATA,
      sectionTitles: {
        experiences: 'Career Highlights',
        projects: 'Selected Projects',
      },
    };

    const result = exportToJSON(data);
    const parsed = JSON.parse(result);

    expect(parsed.sectionTitles).toEqual({
      experiences: 'Career Highlights',
      projects: 'Selected Projects',
    });
  });
});

describe('downloadFile', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('creates a link element and triggers download', () => {
    const mockClick = vi.fn();
    const mockAppendChild = vi.spyOn(document.body, 'appendChild').mockImplementation((node) => node);
    const mockRemoveChild = vi.spyOn(document.body, 'removeChild').mockImplementation((node) => node);
    const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
    const mockRevokeObjectURL = vi.fn();

    (globalThis as Record<string, unknown>).URL = {
      ...URL,
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    };

    vi.spyOn(document, 'createElement').mockReturnValue({
      href: '',
      download: '',
      click: mockClick,
    } as unknown as HTMLAnchorElement);

    const blob = new Blob(['test'], { type: 'application/json' });
    downloadFile(blob, 'resume.json');

    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
    expect(mockClick).toHaveBeenCalled();
    expect(mockAppendChild).toHaveBeenCalled();
    expect(mockRemoveChild).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });
});
