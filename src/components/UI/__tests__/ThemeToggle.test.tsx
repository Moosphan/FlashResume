import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ThemeToggle from '../ThemeToggle';
import { useUIStore } from '../../../stores/uiStore';

// Mock localStorage for uiStore
beforeEach(() => {
  vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
  useUIStore.setState({ themeMode: 'light' });
});

describe('ThemeToggle', () => {
  it('renders a button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows moon icon in light mode (to switch to dark)', () => {
    useUIStore.setState({ themeMode: 'light' });
    render(<ThemeToggle />);
    expect(screen.getByLabelText('切换到深色模式')).toBeInTheDocument();
  });

  it('shows sun icon in dark mode (to switch to light)', () => {
    useUIStore.setState({ themeMode: 'dark' });
    render(<ThemeToggle />);
    expect(screen.getByLabelText('切换到浅色模式')).toBeInTheDocument();
  });

  it('toggles theme mode on click', () => {
    useUIStore.setState({ themeMode: 'light' });
    render(<ThemeToggle />);
    fireEvent.click(screen.getByRole('button'));
    expect(useUIStore.getState().themeMode).toBe('dark');
  });

  it('has min 44x44 touch target', () => {
    render(<ThemeToggle />);
    const btn = screen.getByRole('button');
    expect(btn.className).toContain('h-[44px]');
    expect(btn.className).toContain('w-[44px]');
  });
});
