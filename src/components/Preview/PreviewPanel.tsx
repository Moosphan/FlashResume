import { forwardRef, useCallback, useRef, useState } from 'react';
import { useResumeStore } from '../../stores/resumeStore';
import { templateRegistry } from '../../services/templateRegistry';
import { useLocale } from '../../hooks/useLocale';

/** A4 aspect ratio: 210mm x 297mm */
const A4_WIDTH_PX = 794; // ~210mm at 96dpi
const A4_HEIGHT_PX = 1123; // ~297mm at 96dpi

const ZOOM_STEP = 10;
const ZOOM_MIN = 30;
const ZOOM_MAX = 200;
const ZOOM_DEFAULT = 60;

/**
 * PreviewPanel - 简历实时预览面板
 *
 * - 订阅 ResumeStore，实时渲染当前模板
 * - A4 纸张比例展示，缩放时居中显示
 * - 支持按钮缩放 + 触控板/鼠标滚轮手势缩放
 * - 通过 forwardRef 暴露预览内容 DOM 供 PDF 导出使用
 */
const PreviewPanel = forwardRef<HTMLDivElement>(function PreviewPanel(_props, ref) {
  const resumeData = useResumeStore((s) => s.resumeData);
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const themeColor = useResumeStore((s) => s.themeColor);
  const { locale, t } = useLocale();

  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = useCallback(() => {
    setZoom((z) => Math.min(z + ZOOM_STEP, ZOOM_MAX));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((z) => Math.max(z - ZOOM_STEP, ZOOM_MIN));
  }, []);

  // Pinch-to-zoom and Ctrl+scroll support
  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
      setZoom((z) => Math.min(Math.max(z + delta, ZOOM_MIN), ZOOM_MAX));
    }
  }, []);

  const templateDef = templateRegistry.getById(selectedTemplateId);
  const TemplateComponent = templateDef?.component;

  const scale = zoom / 100;

  return (
    <div className="relative flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* Preview area with scroll — centered */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4"
        onWheel={handleWheel}
      >
        {/* Centering wrapper: uses flex to center the scaled paper */}
        <div className="flex justify-center">
          <div
            style={{
              width: A4_WIDTH_PX * scale,
              height: A4_HEIGHT_PX * scale,
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: A4_WIDTH_PX,
                minHeight: A4_HEIGHT_PX,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              {/* A4 paper sheet */}
              <div
                ref={ref}
                className="bg-white dark:bg-gray-800 shadow-lg"
                style={{
                  width: A4_WIDTH_PX,
                  minHeight: A4_HEIGHT_PX,
                }}
              >
                {TemplateComponent ? (
                  <TemplateComponent data={resumeData} themeColor={themeColor} language={locale} />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[297mm] text-gray-400">
                    {t.templateNotFound}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating zoom controls — bottom-right, semi-transparent */}
      <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-full bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm px-2 py-1 z-10 opacity-60 hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={handleZoomOut}
          disabled={zoom <= ZOOM_MIN}
          aria-label="缩小预览"
          className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          −
        </button>
        <span className="min-w-[2.5rem] text-center text-xs font-medium text-gray-600 dark:text-gray-300 select-none">
          {zoom}%
        </span>
        <button
          type="button"
          onClick={handleZoomIn}
          disabled={zoom >= ZOOM_MAX}
          aria-label="放大预览"
          className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
});

export default PreviewPanel;
