import { renderEngine } from './renderEngine';
import { assemblePdfInWorker } from './pdfWorkerClient';
import type { ResumeData } from '../types/resume';

// A4 dimensions
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;
export const A4_WIDTH_PX = 794;
export const A4_HEIGHT_PX = 1123;

export const PAGE_MARGIN_PX = 40;
export const PAGE_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAGE_MARGIN_PX * 2;
const PAGE_MARGIN_PT = (PAGE_MARGIN_PX / A4_HEIGHT_PX) * A4_HEIGHT_PT;

const EXPORT_SCALE = 3;

export type ProgressCallback = (progress: number) => void;

/** Yield to the main thread so the browser can repaint */
function yieldToMain(): Promise<void> {
  return new Promise((r) => setTimeout(r, 0));
}

/** Wait for browser layout to settle */
function waitForLayout(): Promise<void> {
  return new Promise((r) => requestAnimationFrame(() => r()));
}

/** Safely remove an offscreen container from the DOM */
function removeOffscreen(offscreen: HTMLElement): void {
  try {
    if (offscreen.parentNode) {
      offscreen.parentNode.removeChild(offscreen);
    }
  } catch {
    // Already removed or detached — ignore
  }
}

// ─── DOM 克隆 ──────────────────────────────────────────────────────

export function stripDarkClasses(el: HTMLElement): void {
  for (const cls of Array.from(el.classList)) {
    if (cls.startsWith('dark:') || cls === 'dark') el.classList.remove(cls);
  }
  for (let i = 0; i < el.children.length; i++) {
    const child = el.children[i];
    if (child instanceof HTMLElement) stripDarkClasses(child);
  }
}

function createOffscreenClone(element: HTMLElement): {
  offscreen: HTMLDivElement;
  clone: HTMLElement;
} {
  const offscreen = document.createElement('div');
  offscreen.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    `width: ${A4_WIDTH_PX}px`,
    'z-index: -9999',
    'overflow: hidden',
    'background: white',
    'pointer-events: none',
    'color-scheme: light',
  ].join(';');
  document.body.appendChild(offscreen);

  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.cssText = `
    width: ${A4_WIDTH_PX}px;
    max-width: ${A4_WIDTH_PX}px;
    min-height: ${A4_HEIGHT_PX}px;
    transform: none;
    background: white;
    color: #111827;
    overflow: visible;
  `;
  offscreen.classList.add('no-theme-transition');

  if (!clone.classList.contains('resume-preview-font')) {
    clone.classList.add('resume-preview-font');
  }

  stripDarkClasses(clone);
  offscreen.appendChild(clone);

  return { offscreen, clone };
}

// ─── DataURL → Blob 辅助函数 ──────────────────────────────────────

export function dataURLToBlob(dataURL: string): Blob {
  const [header, base64] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)?.[1] ?? 'application/octet-stream';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: mime });
}

// ─── PDF 导出 ──────────────────────────────────────────────────────

export async function exportToPDF(
  element: HTMLElement,
  personName?: string,
  onProgress?: ProgressCallback,
): Promise<Blob> {
  const report = (v: number) => onProgress?.(v);
  const { offscreen, clone } = createOffscreenClone(element);

  try {
    report(5);
    await yieldToMain();

    await waitForLayout();

    report(10);

    const totalHeight = clone.scrollHeight;

    report(15);

    // Smooth progress during DOM → Canvas (heaviest main-thread step)
    let progressTimer: ReturnType<typeof setInterval> | undefined;
    let currentProgress = 15;
    progressTimer = setInterval(() => {
      currentProgress += (55 - currentProgress) * 0.08;
      if (currentProgress < 54) report(Math.round(currentProgress));
    }, 100);

    let fullCanvas: HTMLCanvasElement;
    try {
      fullCanvas = await renderEngine.domToCanvas(clone, {
        width: A4_WIDTH_PX,
        height: totalHeight,
        pixelRatio: EXPORT_SCALE,
        backgroundColor: '#ffffff',
      });
    } finally {
      clearInterval(progressTimer);
    }

    report(60);

    // ─── Prepare page data URLs on main thread (needs Canvas API) ───
    if (totalHeight <= A4_HEIGHT_PX) {
      // Single page — send one full-page image to worker
      const dataURL = fullCanvas.toDataURL('image/png');
      report(65);

      const blob = await assemblePdfInWorker({
        pages: [{ dataURL, drawHeight: A4_HEIGHT_PT, yOffset: 0 }],
        personName: personName || '',
        singlePage: true,
        onProgress: (wp) => report(65 + (wp / 100) * 30),
      });

      report(95);
      return blob;
    }

    // Multi-page — compute breaks and extract page slices
    const breakpoints = collectBreakpoints(clone);
    const pageBreaks = computePageBreaks(breakpoints, totalHeight);

    report(62);

    const pages: Array<{ dataURL: string; drawHeight: number; yOffset: number }> = [];
    const totalPages = pageBreaks.length;

    for (let i = 0; i < pageBreaks.length; i++) {
      const pageTop = pageBreaks[i];
      const pageBottom = i + 1 < pageBreaks.length ? pageBreaks[i + 1] : totalHeight;
      const sliceHeight = pageBottom - pageTop;

      const pageCanvas = sliceCanvas(
        fullCanvas, 0, pageTop * EXPORT_SCALE,
        A4_WIDTH_PX * EXPORT_SCALE, sliceHeight * EXPORT_SCALE,
      );

      const drawHeight = (sliceHeight / A4_WIDTH_PX) * A4_WIDTH_PT;
      const yOffset = i === 0 ? 0 : PAGE_MARGIN_PT;

      pages.push({
        dataURL: pageCanvas.toDataURL('image/png'),
        drawHeight,
        yOffset,
      });

      // Report slice progress: 62% → 72%
      report(62 + ((i + 1) / totalPages) * 10);
    }

    report(72);

    // ─── Assemble PDF in Web Worker (off main thread) ───
    const blob = await assemblePdfInWorker({
      pages,
      personName: personName || '',
      singlePage: false,
      onProgress: (wp) => report(72 + (wp / 100) * 20),
    });

    report(95);
    return blob;
  } finally {
    removeOffscreen(offscreen);
  }
}

function sliceCanvas(
  src: HTMLCanvasElement,
  sx: number, sy: number, sw: number, sh: number,
): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = sw;
  c.height = sh;
  c.getContext('2d')!.drawImage(src, sx, sy, sw, sh, 0, 0, sw, sh);
  return c;
}

export function collectBreakpoints(root: HTMLElement): number[] {
  const rootRect = root.getBoundingClientRect();
  const pts = new Set<number>();
  pts.add(0);
  const walk = (parent: HTMLElement, depth: number) => {
    for (let i = 0; i < parent.children.length; i++) {
      const child = parent.children[i] as HTMLElement;
      if (!(child instanceof HTMLElement)) continue;
      const r = child.getBoundingClientRect();
      pts.add(Math.round(r.top - rootRect.top));
      pts.add(Math.round(r.bottom - rootRect.top));
      if (depth < 2) walk(child, depth + 1);
    }
  };
  walk(root, 0);
  return Array.from(pts).sort((a, b) => a - b);
}

export function computePageBreaks(bps: number[], totalHeight: number): number[] {
  const pages: number[] = [0];
  let cur = 0;
  const first = A4_HEIGHT_PX - PAGE_MARGIN_PX;
  const later = PAGE_CONTENT_HEIGHT_PX;
  for (let i = 0; i < bps.length; i++) {
    const bp = bps[i];
    const max = pages.length === 1 ? first : later;
    if (bp - cur > max) {
      let best = cur;
      for (let j = i - 1; j >= 0; j--) {
        if (bps[j] - cur <= max && bps[j] > cur) { best = bps[j]; break; }
      }
      if (best === cur) best = cur + max;
      pages.push(best);
      cur = best;
      if (bp - cur > later) i--;
    }
  }
  if (totalHeight - cur > later) {
    let pos = cur;
    while (totalHeight - pos > later) { pos += later; pages.push(pos); }
  }
  return pages;
}

// ─── 其他导出 ──────────────────────────────────────────────────────

export function exportToJSON(data: ResumeData): string {
  return JSON.stringify(data, null, 2);
}

export async function exportToPNG(
  element: HTMLElement,
  onProgress?: ProgressCallback,
): Promise<Blob> {
  return exportToImageBlob(element, 'png', onProgress);
}

export async function exportToJPG(
  element: HTMLElement,
  onProgress?: ProgressCallback,
): Promise<Blob> {
  return exportToImageBlob(element, 'jpeg', onProgress);
}

async function exportToImageBlob(
  element: HTMLElement,
  format: 'png' | 'jpeg',
  onProgress?: ProgressCallback,
): Promise<Blob> {
  const report = (v: number) => onProgress?.(v);
  const { offscreen, clone } = createOffscreenClone(element);
  try {
    report(5);

    await waitForLayout();

    report(10);

    const height = Math.max(clone.scrollHeight, A4_HEIGHT_PX);

    report(15);

    // Simulate smooth progress during the heavy rendering step
    let progressTimer: ReturnType<typeof setInterval> | undefined;
    let currentProgress = 15;
    progressTimer = setInterval(() => {
      // Ease toward 75 but never exceed it — the real completion will jump to 80
      currentProgress += (75 - currentProgress) * 0.08;
      if (currentProgress < 74) report(Math.round(currentProgress));
    }, 100);

    let dataURL: string;
    try {
      dataURL = await renderEngine.domToDataURL(
        clone,
        {
          width: A4_WIDTH_PX,
          height,
          pixelRatio: EXPORT_SCALE,
          backgroundColor: '#ffffff',
        },
        format,
        format === 'jpeg' ? 0.92 : undefined,
      );
    } finally {
      clearInterval(progressTimer);
    }

    report(80);

    const blob = dataURLToBlob(dataURL);

    report(90);
    report(95);

    return blob;
  } finally {
    removeOffscreen(offscreen);
  }
}

export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
