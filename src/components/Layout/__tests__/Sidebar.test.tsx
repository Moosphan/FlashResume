import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreateResume = vi.fn();
const mockLoadResume = vi.fn();
const mockDeleteResume = vi.fn();
let mockResumeList: Array<{ id: string; name: string; updatedAt: string }> = [];
let mockCurrentResumeId: string | null = null;

vi.mock('../../../stores/resumeStore', () => ({
  useResumeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      resumeList: mockResumeList,
      currentResumeId: mockCurrentResumeId,
      createResume: mockCreateResume,
      loadResume: mockLoadResume,
      deleteResume: mockDeleteResume,
    }),
}));

import Sidebar from '../Sidebar';

describe('Sidebar', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockResumeList = [];
    mockCurrentResumeId = null;
  });

  it('renders empty state when no resumes', () => {
    render(<Sidebar open={true} onClose={onClose} />);
    expect(screen.getByText('暂无简历，点击上方按钮创建')).toBeInTheDocument();
  });

  it('renders resume list items', () => {
    mockResumeList = [
      { id: '1', name: '前端简历', updatedAt: '2024-01-15T10:00:00Z' },
      { id: '2', name: '后端简历', updatedAt: '2024-02-20T10:00:00Z' },
    ];
    render(<Sidebar open={true} onClose={onClose} />);
    expect(screen.getByText('前端简历')).toBeInTheDocument();
    expect(screen.getByText('后端简历')).toBeInTheDocument();
  });

  it('highlights the currently selected resume', () => {
    mockResumeList = [
      { id: '1', name: '前端简历', updatedAt: '2024-01-15T10:00:00Z' },
    ];
    mockCurrentResumeId = '1';
    render(<Sidebar open={true} onClose={onClose} />);
    const item = screen.getByText('前端简历').closest('[role="button"]');
    expect(item).toHaveAttribute('aria-current', 'true');
  });

  it('calls loadResume and onClose when clicking a resume item', () => {
    mockResumeList = [
      { id: '1', name: '前端简历', updatedAt: '2024-01-15T10:00:00Z' },
    ];
    render(<Sidebar open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('前端简历'));
    expect(mockLoadResume).toHaveBeenCalledWith('1');
    expect(onClose).toHaveBeenCalled();
  });

  it('calls createResume when confirming with a valid name', () => {
    render(<Sidebar open={true} onClose={onClose} />);
    // Click the new resume button to show the input
    fireEvent.click(screen.getByText('+ 新建简历'));
    const input = screen.getByPlaceholderText('请输入简历名称');
    fireEvent.change(input, { target: { value: '新简历' } });
    fireEvent.click(screen.getByText('确认'));
    expect(mockCreateResume).toHaveBeenCalledWith('新简历');
  });

  it('does not call createResume and shows error when name is empty', () => {
    render(<Sidebar open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('+ 新建简历'));
    // Click confirm without entering a name
    fireEvent.click(screen.getByText('确认'));
    expect(mockCreateResume).not.toHaveBeenCalled();
    expect(screen.getByText('请输入简历名称')).toBeInTheDocument();
    // Input should still be visible
    expect(screen.getByPlaceholderText('请输入简历名称')).toBeInTheDocument();
  });

  it('does not call createResume and shows error when name is only spaces', () => {
    render(<Sidebar open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('+ 新建简历'));
    const input = screen.getByPlaceholderText('请输入简历名称');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.click(screen.getByText('确认'));
    expect(mockCreateResume).not.toHaveBeenCalled();
    expect(screen.getByText('请输入简历名称')).toBeInTheDocument();
  });

  it('hides input when cancel is clicked', () => {
    render(<Sidebar open={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('+ 新建简历'));
    expect(screen.getByPlaceholderText('请输入简历名称')).toBeInTheDocument();
    fireEvent.click(screen.getByText('取消'));
    expect(screen.queryByPlaceholderText('请输入简历名称')).not.toBeInTheDocument();
    expect(screen.getByText('+ 新建简历')).toBeInTheDocument();
  });

  it('shows confirm dialog when delete button is clicked', () => {
    mockResumeList = [
      { id: '1', name: '前端简历', updatedAt: '2024-01-15T10:00:00Z' },
    ];
    render(<Sidebar open={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('删除简历 前端简历'));
    expect(screen.getByText('删除简历')).toBeInTheDocument();
    expect(screen.getByText(/确定要删除简历「前端简历」吗/)).toBeInTheDocument();
  });

  it('calls deleteResume on confirm', () => {
    mockResumeList = [
      { id: '1', name: '前端简历', updatedAt: '2024-01-15T10:00:00Z' },
    ];
    render(<Sidebar open={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('删除简历 前端简历'));
    fireEvent.click(screen.getAllByText('确认')[0]);
    expect(mockDeleteResume).toHaveBeenCalledWith('1');
  });

  it('closes confirm dialog on cancel', () => {
    mockResumeList = [
      { id: '1', name: '前端简历', updatedAt: '2024-01-15T10:00:00Z' },
    ];
    render(<Sidebar open={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('删除简历 前端简历'));
    fireEvent.click(screen.getAllByText('取消')[0]);
    expect(mockDeleteResume).not.toHaveBeenCalled();
  });

  it('is hidden off-screen when open is false', () => {
    render(<Sidebar open={false} onClose={onClose} />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.className).toContain('-translate-x-full');
  });

  it('is visible when open is true', () => {
    render(<Sidebar open={true} onClose={onClose} />);
    const sidebar = screen.getByTestId('sidebar');
    expect(sidebar.className).toContain('translate-x-0');
    expect(sidebar.className).not.toContain('-translate-x-full');
  });

  it('calls onClose when mobile close button is clicked', () => {
    render(<Sidebar open={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('关闭侧边栏'));
    expect(onClose).toHaveBeenCalled();
  });
});
