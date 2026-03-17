import { toPng, toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { ResumeData } from '../types/resume';

// A4 dimensions in points (1 point = 1/72 inch)
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;
// A4 at 96dpi in pixels
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

// 分页时的上下安全边距（px），防止内容紧贴页面边缘
const PAGE_MARGIN_PX = 40; // ~15mm
// 每页实际可用内容高度
const PAGE_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAGE_MARGIN_PX * 2;
// 对应的 pt 边距（用于 PDF 绘制偏移）
const PAGE_MARGIN_PT = (PAGE_MARGIN_PX / A4_HEIGHT_PX) * A4_HEIGHT_PT;

/**
 * 递归移除元素及其子元素上所有 dark: 前缀的 Tailwind class，
 * 确保克隆元素始终以浅色模式渲染，无需操作页面级 dark class。
 */
function stripDarkClasses(el: HTMLElement): void {
  const classes = Array.from(el.classList);
  for (const cls of classes) {
    if (cls.startsWith('dark:') || cls === 'dark') {
      el.classList.remove(cls);
    }
  }
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    if (child instanceof HTMLElement) {
      stripDarkClasses(child);
    }
  }
}

/**
 * 创建用于导出的离屏克隆容器（浅色模式），不影响页面显示。
 */
function createOffscreenClone(element: HTMLElement): { offscreen: HTMLDivElement; clone: HTMLElement } {
  const offscreen = document.createElement('div');
  offscreen.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: -9999px',
    `width: ${A4_WIDTH_PX}px`,
    'z-index: -1',
    'overflow: visible',
    'background: white',
    'pointer-events: none',
    'color-scheme: light',
  ].join(';');
  document.body.appendChild(offscreen);

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${A4_WIDTH_PX}px`;
  clone.style.minHeight = `${A4_HEIGHT_PX}px`;
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'top left';
  clone.style.background = 'white';
  clone.style.color = '#111827'; // gray-900

  // 移除克隆 DOM 中所有 dark: class，强制浅色渲染
  stripDarkClasses(clone);

  offscreen.appendChild(clone);
  return { offscreen, clone };
}

/**
 * 将 DOM 元素导出为 A4 尺寸的 PDF 文件（智能分页，避免内容截断）。
 * 静默导出：不会修改页面的 dark/light 状态，不会产生闪烁。
 *
 * 策略：
 * 1. 克隆到离屏容器，收集所有块级子元素的位置
 * 2. 找到合适的分页断点（在元素之间而非元素中间）
 * 3. 为每一页分别截图并写入 PDF
 */
export async function exportToPDF(element: HTMLElement): Promise<Blob> {
  const { offscreen, clone } = createOffscreenClone(element);

  try {
    // 获取内容根元素（模板的最外层 div）
    const contentRoot = clone;
    const totalHeight = contentRoot.scrollHeight;

    // 如果内容不超过一页，直接单页导出
    if (totalHeight <= A4_HEIGHT_PX) {
      return await exportSinglePagePDF(clone);
    }

    // 收集所有可作为分页断点的元素的 bottom 位置
    const breakpoints = collectBreakpoints(contentRoot);

    // 计算分页位置
    const pageBreaks = computePageBreaks(breakpoints, totalHeight);

    // 逐页渲染
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    for (let i = 0; i < pageBreaks.length; i++) {
      if (i > 0) pdf.addPage();

      const pageTop = pageBreaks[i];
      const pageBottom = i + 1 < pageBreaks.length ? pageBreaks[i + 1] : totalHeight;
      const pageHeight = pageBottom - pageTop;

      // 通过裁切克隆元素的可视区域来截取当前页
      const dataUrl = await renderPageSlice(clone, offscreen, pageTop, pageHeight);
      const img = await loadImage(dataUrl);

      const drawWidth = A4_WIDTH_PT;
      const drawHeight = (img.height / img.width) * drawWidth;

      // 第一页不加顶部边距（模板自带 padding），后续页加顶部边距
      const yOffset = i === 0 ? 0 : PAGE_MARGIN_PT;
      pdf.addImage(dataUrl, 'PNG', 0, yOffset, drawWidth, drawHeight);
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(offscreen);
  }
}

/**
 * 收集内容根元素中所有可作为分页断点的 y 坐标（相对于内容根）。
 * 遍历 section、div 等块级子元素，取它们的 top 位置作为候选断点。
 */
function collectBreakpoints(root: HTMLElement): number[] {
  const rootRect = root.getBoundingClientRect();
  const points = new Set<number>();
  points.add(0);

  // 遍历直接子元素和 section 内的子元素（两层深度）
  const walk = (parent: HTMLElement, depth: number) => {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i] as HTMLElement;
      if (!(child instanceof HTMLElement)) continue;

      const rect = child.getBoundingClientRect();
      const top = Math.round(rect.top - rootRect.top);
      const bottom = Math.round(rect.bottom - rootRect.top);

      points.add(top);
      points.add(bottom);

      // 深入 section 和 div 容器，最多两层
      if (depth < 2) {
        walk(child, depth + 1);
      }
    }
  };

  walk(root, 0);

  return Array.from(points).sort((a, b) => a - b);
}

/**
 * 根据候选断点计算每页的起始 y 坐标。
 * 贪心策略：尽量填满每页，但只在候选断点处分页。
 * 第一页使用完整高度减去底部边距（模板自带顶部 padding），
 * 后续页使用减去上下边距的可用高度。
 */
function computePageBreaks(breakpoints: number[], totalHeight: number): number[] {
  const pages: number[] = [0];
  let currentPageStart = 0;

  // 第一页可用高度：减去底部边距（顶部由模板 padding 处理）
  // 后续页可用高度：减去上下边距
  const firstPageHeight = A4_HEIGHT_PX - PAGE_MARGIN_PX;
  const laterPageHeight = PAGE_CONTENT_HEIGHT_PX;

  for (let i = 0; i < breakpoints.length; i++) {
    const bp = breakpoints[i];
    const maxHeight = pages.length === 1 ? firstPageHeight : laterPageHeight;

    if (bp - currentPageStart > maxHeight) {
      let bestBreak = currentPageStart;
      for (let j = i - 1; j >= 0; j--) {
        if (breakpoints[j] - currentPageStart <= maxHeight && breakpoints[j] > currentPageStart) {
          bestBreak = breakpoints[j];
          break;
        }
      }

      if (bestBreak === currentPageStart) {
        bestBreak = currentPageStart + maxHeight;
      }

      pages.push(bestBreak);
      currentPageStart = bestBreak;
      if (bp - currentPageStart > laterPageHeight) {
        i--;
      }
    }
  }

  // 确保最后一页覆盖到底部
  if (totalHeight - currentPageStart > laterPageHeight) {
    let pos = currentPageStart;
    while (totalHeight - pos > laterPageHeight) {
      pos += laterPageHeight;
      pages.push(pos);
    }
  }

  return pages;
}

/**
 * 渲染克隆元素的某一页切片为 PNG data URL。
 * 通过设置容器的 clip 和偏移来截取指定区域。
 */
async function renderPageSlice(
  clone: HTMLElement,
  offscreen: HTMLDivElement,
  pageTop: number,
  pageHeight: number,
): Promise<string> {
  // 用一个 wrapper 来裁切可视区域
  const wrapper = document.createElement('div');
  wrapper.style.cssText = [
    `width: ${A4_WIDTH_PX}px`,
    `height: ${Math.min(pageHeight, A4_HEIGHT_PX)}px`,
    'overflow: hidden',
    'position: relative',
    'background: white',
  ].join(';');

  // 将 clone 从 offscreen 移到 wrapper 中，设置偏移
  clone.style.position = 'relative';
  clone.style.top = `${-pageTop}px`;

  offscreen.innerHTML = '';
  wrapper.appendChild(clone);
  offscreen.appendChild(wrapper);

  const renderHeight = Math.min(pageHeight, A4_HEIGHT_PX);

  const dataUrl = await toPng(wrapper, {
    width: A4_WIDTH_PX,
    height: renderHeight,
    pixelRatio: 2,
    cacheBust: true,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  });

  // 恢复 clone 到 offscreen
  clone.style.top = '0px';
  offscreen.innerHTML = '';
  offscreen.appendChild(clone);

  return dataUrl;
}

/** 单页 PDF 导出（内容不超过一页时使用） */
async function exportSinglePagePDF(clone: HTMLElement): Promise<Blob> {
  const dataUrl = await toPng(clone, {
    width: A4_WIDTH_PX,
    height: A4_HEIGHT_PX,
    pixelRatio: 2,
    cacheBust: true,
    style: {
      transform: 'none',
      transformOrigin: 'top left',
    },
  });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
  });

  pdf.addImage(dataUrl, 'PNG', 0, 0, A4_WIDTH_PT, A4_HEIGHT_PT);
  return pdf.output('blob');
}

/** 辅助：将 data URL 加载为 HTMLImageElement */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Serializes ResumeData to a formatted JSON string.
 */
export function exportToJSON(data: ResumeData): string {
  return JSON.stringify(data, null, 2);
}

/**
 * 将 DOM 元素导出为 PNG Blob
 */
export async function exportToPNG(element: HTMLElement): Promise<Blob> {
  return exportToImageBlob(element, 'png');
}

/**
 * 将 DOM 元素导出为 JPG Blob
 */
export async function exportToJPG(element: HTMLElement): Promise<Blob> {
  return exportToImageBlob(element, 'jpeg');
}

async function exportToImageBlob(element: HTMLElement, format: 'png' | 'jpeg'): Promise<Blob> {
  const { offscreen, clone } = createOffscreenClone(element);

  try {
    const toFn = format === 'png' ? toPng : toJpeg;
    const options = {
      width: A4_WIDTH_PX,
      height: Math.max(clone.scrollHeight, A4_HEIGHT_PX),
      pixelRatio: 2,
      cacheBust: true,
      quality: format === 'jpeg' ? 0.95 : undefined,
      style: { transform: 'none', transformOrigin: 'top left' },
    };
    const dataUrl = await toFn(clone, options);
    const res = await fetch(dataUrl);
    return await res.blob();
  } finally {
    document.body.removeChild(offscreen);
  }
}

/**
 * Triggers a file download in the browser.
 */
export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
