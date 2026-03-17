import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmDialog from '../ConfirmDialog';

describe('ConfirmDialog', () => {
  const defaultProps = {
    open: true,
    title: '确认删除',
    message: '确定要删除这份简历吗？',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
  };

  it('renders nothing when closed', () => {
    const { container } = render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders title and message when open', () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText('确认删除')).toBeInTheDocument();
    expect(screen.getByText('确定要删除这份简历吗？')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    fireEvent.click(screen.getByText('确认'));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<ConfirmDialog {...defaultProps} onCancel={onCancel} />);
    fireEvent.click(screen.getByText('取消'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('has accessible dialog role and aria attributes', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
    expect(dialog).toHaveAttribute('aria-describedby');
  });

  it('buttons have min 44px touch target', () => {
    render(<ConfirmDialog {...defaultProps} />);
    const confirmBtn = screen.getByText('确认');
    const cancelBtn = screen.getByText('取消');
    expect(confirmBtn.className).toContain('min-h-[44px]');
    expect(cancelBtn.className).toContain('min-h-[44px]');
  });
});
