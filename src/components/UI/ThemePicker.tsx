import { useEffect, useRef, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useResumeStore } from '../../stores/resumeStore';

const PRESET_COLORS = [
  { hex: '#2563EB', label: '蓝色' },
  { hex: '#DC2626', label: '红色' },
  { hex: '#059669', label: '绿色' },
  { hex: '#7C3AED', label: '紫色' },
  { hex: '#D97706', label: '琥珀色' },
  { hex: '#0891B2', label: '青色' },
];

export default function ThemePicker() {
  const themeColor = useResumeStore((s) => s.themeColor);
  const setThemeColor = useResumeStore((s) => s.setThemeColor);
  const [showPicker, setShowPicker] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const isPreset = PRESET_COLORS.some(
    (p) => p.hex.toUpperCase() === themeColor.toUpperCase(),
  );

  // Close popover on outside click
  useEffect(() => {
    if (!showPicker) return;
    const handleClick = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(e.target as Node)
      ) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showPicker]);

  return (
    <div className="flex flex-wrap items-center gap-2">
      {PRESET_COLORS.map(({ hex, label }) => {
        const isSelected = themeColor.toUpperCase() === hex.toUpperCase();
        return (
          <button
            key={hex}
            type="button"
            onClick={() => setThemeColor(hex)}
            className={`flex h-[44px] w-[44px] items-center justify-center rounded-full border-2 transition-all duration-200 ${
              isSelected
                ? 'border-gray-800 ring-2 ring-gray-400 dark:border-white dark:ring-gray-500'
                : 'border-transparent hover:scale-110'
            }`}
            aria-label={`选择主题颜色：${label}`}
            aria-pressed={isSelected}
          >
            <span className="block h-8 w-8 rounded-full" style={{ backgroundColor: hex }} />
          </button>
        );
      })}

      {/* Custom color toggle + popover */}
      <div className="relative">
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setShowPicker((v) => !v)}
          className={`flex h-[44px] items-center gap-1.5 rounded-full border-2 px-3 text-xs font-medium transition-all duration-200 ${
            showPicker || !isPreset
              ? 'border-gray-800 dark:border-white text-gray-800 dark:text-white'
              : 'border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-400'
          }`}
          aria-label="自定义颜色"
          aria-expanded={showPicker}
        >
          <span
            className="block h-5 w-5 rounded-full border border-gray-300 dark:border-gray-500"
            style={{ backgroundColor: themeColor }}
          />
          <span>自定义</span>
        </button>

        {showPicker && (
          <div
            ref={popoverRef}
            className="no-theme-transition absolute left-0 top-full z-50 mt-2 rounded-lg border border-gray-200 bg-white p-3 shadow-xl dark:border-gray-600 dark:bg-gray-800"
            style={{ width: 220 }}
          >
            <HexColorPicker
              color={themeColor}
              onChange={setThemeColor}
              style={{ width: '100%', height: 150 }}
            />
            <div className="mt-2 flex items-center gap-2">
              <span
                className="block h-5 w-5 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: themeColor }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                {themeColor.toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
