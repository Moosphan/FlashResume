import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import type { ResumeData } from '../types/resume';

// A4 dimensions in points (1 point = 1/72 inch)
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;
// A4 at 96dpi in pixels
const A4_WIDTH_PX = 794;
const A4_HEIGHT_PX = 1123;

/**
 * 将 DOM 元素导出为 A4 尺寸的 PDF 文件（支持多页）。
 *
 * 策略：
 * 1. 克隆目标元素到一个干净的离屏容器（无 transform、无 transition）
 * 2. 使用 html-to-image 将克隆元素转为 PNG data URL
 * 3. 使用 jsPDF 将图片写入 A4 尺寸的 PDF 并返回 Blob
 */
export async function exportToPDF(element: HTMLElement): Promise<Blob> {
  // 1. 创建离屏容器
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
  ].join(';');
  offscreen.classList.add('no-theme-transition');
  document.body.appendChild(offscreen);

  // 2. 克隆元素到离屏容器
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.width = `${A4_WIDTH_PX}px`;
  clone.style.minHeight = `${A4_HEIGHT_PX}px`;
  clone.style.transform = 'none';
  clone.style.transformOrigin = 'top left';
  clone.style.background = 'white';
  offscreen.appendChild(clone);

  try {
    // 3. 用 html-to-image 生成 PNG
    const dataUrl = await toPng(clone, {
      width: A4_WIDTH_PX,
      height: Math.max(clone.scrollHeight, A4_HEIGHT_PX),
      pixelRatio: 2,
      cacheBust: true,
      style: {
        transform: 'none',
        transformOrigin: 'top left',
      },
    });

    // 4. 加载图片获取实际尺寸
    const img = await loadImage(dataUrl);

    const imgWidth = A4_WIDTH_PT;
    const imgHeight = (img.height * A4_WIDTH_PT) / img.width;

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    // 5. 分页处理
    const pageCount = Math.ceil(imgHeight / A4_HEIGHT_PT);

    for (let page = 0; page < pageCount; page++) {
      if (page > 0) pdf.addPage();

      // 通过负偏移实现分页裁切
      const yOffset = -page * A4_HEIGHT_PT;
      pdf.addImage(dataUrl, 'PNG', 0, yOffset, imgWidth, imgHeight);
    }

    return pdf.output('blob');
  } finally {
    document.body.removeChild(offscreen);
  }
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
