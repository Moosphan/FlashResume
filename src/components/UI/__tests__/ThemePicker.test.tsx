import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock react-colorful
vi.mock('react-colorful', () => ({
  HexColorPicker: ({ color, onChange }: { color: string; onChange: (c: string) => void }) => (
    <input
      data-testid="hex-color-picker"
      type="text"
      value={color}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

// Mock resumeStore
const mockSetThemeColor = vi.fn();
let mockThemeColor = '#2563EB';

vi.mock('../../../stores/resumeStore', () => ({
  useResumeStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      themeColor: mockThemeColor,
      setThemeColor: mockSetThemeColor,
    }),
}));

import ThemePicker from '../ThemePicker';

describe('ThemePicker', () => {
  beforeEach(() => {
    mockSetThemeColor.mockClear();
    mockThemeColor = '#2563EB';
  });

  it('renders at least 6 preset color swatches', () => {
    render(<ThemePicker />);
    const swatches = screen.getAllByRole('button');
    expect(swatches.length).toBeGreaterThanOrEqual(6);
  });

  it('highlights the currently selected preset', () => {
    render(<ThemePicker />);
    const blueBtn = screen.getByLabelText('选择主题颜色：蓝色');
    expect(blueBtn).toHaveAttribute('aria-pressed', 'true');
    const redBtn = screen.getByLabelText('选择主题颜色：红色');
    expect(redBtn).toHaveAttribute('aria-pressed', 'false');
  });

  it('calls setThemeColor when a preset is clicked', () => {
    render(<ThemePicker />);
    fireEvent.click(screen.getByLabelText('选择主题颜色：红色'));
    expect(mockSetThemeColor).toHaveBeenCalledWith('#DC2626');
  });

  it('renders the HexColorPicker after clicking custom toggle', () => {
    render(<ThemePicker />);
    // Picker is hidden by default
    expect(screen.queryByTestId('hex-color-picker')).not.toBeInTheDocument();
    // Click the custom color toggle
    fireEvent.click(screen.getByLabelText('自定义颜色'));
    expect(screen.getByTestId('hex-color-picker')).toBeInTheDocument();
  });

  it('calls setThemeColor from custom picker', () => {
    render(<ThemePicker />);
    fireEvent.click(screen.getByLabelText('自定义颜色'));
    const picker = screen.getByTestId('hex-color-picker');
    fireEvent.change(picker, { target: { value: '#FF0000' } });
    expect(mockSetThemeColor).toHaveBeenCalledWith('#FF0000');
  });

  it('preset swatches meet min 44x44 touch target', () => {
    render(<ThemePicker />);
    const btn = screen.getByLabelText('选择主题颜色：蓝色');
    expect(btn.className).toContain('h-[44px]');
    expect(btn.className).toContain('w-[44px]');
  });
});
