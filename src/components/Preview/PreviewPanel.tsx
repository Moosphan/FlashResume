import { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
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

/** 页脚区域高度（含上方留白 + 文字 + 下方留白） */
const FOOTER_HEIGHT_PX = 40;
/** 非首页顶部内边距，防止内容紧贴上边沿 */
const PAGE_TOP_PADDING_PX = 40;
/** 第一页可用内容高度（扣除底部页脚） */
const FIRST_PAGE_CONTENT_HEIGHT = A4_HEIGHT_PX - FOOTER_HEIGHT_PX;
/** 后续页可用内容高度（扣除顶部边距 + 底部页脚） */
const LATER_PAGE_CONTENT_HEIGHT = A4_HEIGHT_PX - PAGE_TOP_PADDING_PX - FOOTER_HEIGHT_PX;

/**
 * 收集内容根元素中所有可作为分页断点的 y 坐标。
 */
function collectBreakpoints(root: HTMLElement): number[] {
  const rootRect = root.getBoundingClientRect();
  const points = new Set<number>();
  points.add(0);

  const walk = (parent: HTMLElement, depth: number) => {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i] as HTMLElement;
      if (!(child instanceof HTMLElement)) continue;
      const rect = child.getBoundingClientRect();
      points.add(Math.round(rect.top - rootRect.top));
      points.add(Math.round(rect.bottom - rootRect.top));
      if (depth < 2) walk(child, depth + 1);
    }
  };
  walk(root, 0);
  return Array.from(points).sort((a, b) => a - b);
}

/**
 * 根据候选断点计算每页的起始 y 坐标。
 * 第一页可用高度较大（无顶部边距），后续页扣除顶部边距。
 */
function computePageBreaks(breakpoints: number[], totalHeight: number): number[] {
  const pages: number[] = [0];
  let currentStart = 0;

  for (const bp of breakpoints) {
    const maxHeight = pages.length === 1 ? FIRST_PAGE_CONTENT_HEIGHT : LATER_PAGE_CONTENT_HEIGHT;
    if (bp - currentStart > maxHeight) {
      // 找到不超过可用高度的最佳断点
      let best = currentStart;
      for (let j = breakpoints.indexOf(bp) - 1; j >= 0; j--) {
        if (breakpoints[j] - currentStart <= maxHeight && breakpoints[j] > currentStart) {
          best = breakpoints[j];
          break;
        }
      }
      if (best === currentStart) best = currentStart + maxHeight;
      pages.push(best);
      currentStart = best;
    }
  }

  // 确保覆盖到底部
  while (totalHeight - currentStart > LATER_PAGE_CONTENT_HEIGHT) {
    currentStart += LATER_PAGE_CONTENT_HEIGHT;
    pages.push(currentStart);
  }

  return pages;
}

/**
 * 页脚组件：显示姓名 + 页码
 */
function PageFooter({
  name,
  pageIndex,
  totalPages,
  themeColor,
}: {
  name: string;
  pageIndex: number;
  totalPages: number;
  themeColor: string;
}) {
  return (
    <div
      className="flex items-center justify-between px-8 text-xs select-none"
      style={{
        height: FOOTER_HEIGHT_PX,
        paddingBottom: 8,
        color: '#9ca3af',
        borderTop: `1px solid ${themeColor}20`,
      }}
    >
      <span>{name}</span>
      <span>
        {pageIndex + 1} / {totalPages}
      </span>
    </div>
  );
}

/**
 * PreviewPanel - 简历实时预览面板
 *
 * - 订阅 ResumeStore，实时渲染当前模板
 * - A4 纸张比例展示，支持智能分页
 * - 每页底部显示姓名 + 页码
 * - 支持按钮缩放 + 触控板/鼠标滚轮手势缩放
 * - 通过 forwardRef 暴露预览内容 DOM 供 PDF 导出使用
 */
const PreviewPanel = forwardRef<HTMLDivElement>(function PreviewPanel(_props, ref) {
  const resumeData = useResumeStore((s) => s.resumeData);
  const selectedTemplateId = useResumeStore((s) => s.selectedTemplateId);
  const themeColor = useResumeStore((s) => s.themeColor);
  const { locale, t } = useLocale();

  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  const [pageBreaks, setPageBreaks] = useState<number[]>([0]);
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);

  // 将 forwardRef 和 measureRef 合并：外部 ref 指向完整内容（供导出使用）
  const setMeasureRef = useCallback(
    (node: HTMLDivElement | null) => {
      measureRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }
    },
    [ref],
  );

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

  // 测量内容高度并计算分页
  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;

    // 使用 requestAnimationFrame 确保 DOM 已渲染
    const raf = requestAnimationFrame(() => {
      const totalHeight = el.scrollHeight;
      if (totalHeight <= FIRST_PAGE_CONTENT_HEIGHT) {
        setPageBreaks([0]);
        return;
      }
      const bps = collectBreakpoints(el);
      const breaks = computePageBreaks(bps, totalHeight);
      setPageBreaks(breaks);
    });

    return () => cancelAnimationFrame(raf);
  }, [resumeData, selectedTemplateId, themeColor, locale]);

  const templateDef = templateRegistry.getById(selectedTemplateId);
  const TemplateComponent = templateDef?.component;

  const scale = zoom / 100;
  const totalPages = pageBreaks.length;
  const personName = resumeData.personalInfo.name || '';

  return (
    <div className="relative flex flex-col h-full bg-gray-100 dark:bg-gray-900">
      {/* 隐藏的测量容器：用于计算内容高度和分页断点，同时作为导出源 */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: -9999,
          width: A4_WIDTH_PX,
          visibility: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div
          ref={setMeasureRef}
          className="bg-white"
          style={{ width: A4_WIDTH_PX, minHeight: A4_HEIGHT_PX }}
        >
          {TemplateComponent && (
            <TemplateComponent data={resumeData} themeColor={themeColor} language={locale} />
          )}
        </div>
      </div>

      {/* Preview area with scroll — centered */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4"
        onWheel={handleWheel}
      >
        <div className="flex flex-col items-center gap-4 pb-16 pt-2">
          {pageBreaks.map((pageTop, idx) => {
            // 当前页实际内容高度 = 下一页起点 - 当前页起点（最后一页取到内容末尾）
            const nextPageTop = idx + 1 < totalPages ? pageBreaks[idx + 1] : undefined;
            // 用实际内容跨度做裁切，而非最大允许高度，避免截断/重复
            const maxClip = idx === 0 ? FIRST_PAGE_CONTENT_HEIGHT : LATER_PAGE_CONTENT_HEIGHT;
            const contentSpan = nextPageTop !== undefined
              ? Math.min(nextPageTop - pageTop, maxClip)
              : maxClip;

            return (
              <div
                key={idx}
                style={{
                  width: A4_WIDTH_PX * scale,
                  height: A4_HEIGHT_PX * scale,
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: A4_WIDTH_PX,
                    height: A4_HEIGHT_PX,
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <div
                    className="bg-white dark:bg-gray-800 shadow-lg flex flex-col"
                    style={{
                      width: A4_WIDTH_PX,
                      height: A4_HEIGHT_PX,
                    }}
                  >
                    {/* 非首页顶部留白 */}
                    {idx > 0 && (
                      <div style={{ height: PAGE_TOP_PADDING_PX, flexShrink: 0 }} />
                    )}

                    {/* 内容区域：用实际内容跨度裁切，精确匹配分页断点 */}
                    <div
                      style={{
                        height: contentSpan,
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <div
                        style={{
                          marginTop: -pageTop,
                          width: A4_WIDTH_PX,
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

                    {/* 页脚固定在底部 */}
                    <div style={{ marginTop: 'auto' }}>
                      <PageFooter
                        name={personName}
                        pageIndex={idx}
                        totalPages={totalPages}
                        themeColor={themeColor}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
