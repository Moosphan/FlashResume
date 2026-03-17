import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TagInput from '../TagInput';

describe('TagInput', () => {
  it('renders existing tags', () => {
    render(<TagInput tags={['React', 'TypeScript']} onAdd={vi.fn()} onRemove={vi.fn()} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('adds a tag on Enter', () => {
    const onAdd = vi.fn();
    render(<TagInput tags={[]} onAdd={onAdd} onRemove={vi.fn()} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Vue' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAdd).toHaveBeenCalledWith('Vue');
  });

  it('does not add empty tags', () => {
    const onAdd = vi.fn();
    render(<TagInput tags={[]} onAdd={onAdd} onRemove={vi.fn()} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '   ' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('does not add duplicate tags', () => {
    const onAdd = vi.fn();
    render(<TagInput tags={['React']} onAdd={onAdd} onRemove={vi.fn()} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'React' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(onAdd).not.toHaveBeenCalled();
  });

  it('removes a tag when close button is clicked', () => {
    const onRemove = vi.fn();
    render(<TagInput tags={['React', 'Vue']} onAdd={vi.fn()} onRemove={onRemove} />);
    const removeBtn = screen.getByLabelText('删除标签 React');
    fireEvent.click(removeBtn);
    expect(onRemove).toHaveBeenCalledWith(0);
  });

  it('clears input after adding a tag', () => {
    render(<TagInput tags={[]} onAdd={vi.fn()} onRemove={vi.fn()} />);
    const input = screen.getByRole('textbox') as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'Go' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(input.value).toBe('');
  });

  it('shows placeholder when no tags exist', () => {
    render(<TagInput tags={[]} onAdd={vi.fn()} onRemove={vi.fn()} placeholder="添加技能" />);
    expect(screen.getByPlaceholderText('添加技能')).toBeInTheDocument();
  });

  it('remove buttons have min 44x44 touch target', () => {
    render(<TagInput tags={['React']} onAdd={vi.fn()} onRemove={vi.fn()} />);
    const removeBtn = screen.getByLabelText('删除标签 React');
    expect(removeBtn.className).toContain('h-[44px]');
    expect(removeBtn.className).toContain('w-[44px]');
  });
});
