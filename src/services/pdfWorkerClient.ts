/**
 * PDF Worker Client
 *
 * Provides a promise-based API to assemble PDFs in a Web Worker.
 * Falls back to main-thread assembly if workers are unavailable.
 */
import type { PdfWorkerRequest, PdfWorkerResponse } from './pdfWorker';

export interface AssemblePdfOptions {
  pages: PdfWorkerRequest['pages'];
  personName: string;
  singlePage: boolean;
  onProgress?: (workerProgress: number) => void;
}

let cachedWorker: Worker | null = null;

function getWorker(): Worker | null {
  if (cachedWorker) return cachedWorker;
  try {
    cachedWorker = new Worker(
      new URL('./pdfWorker.ts', import.meta.url),
      { type: 'module' },
    );
    cachedWorker.onerror = () => {
      // Worker failed to load — clear cache so we fall back
      cachedWorker = null;
    };
    return cachedWorker;
  } catch {
    return null;
  }
}

export function assemblePdfInWorker(opts: AssemblePdfOptions): Promise<Blob> {
  const worker = getWorker();

  if (!worker) {
    // Fallback: assemble on main thread
    return assemblePdfMainThread(opts);
  }

  return new Promise<Blob>((resolve, reject) => {
    const handler = (e: MessageEvent<PdfWorkerResponse>) => {
      const msg = e.data;
      if (msg.type === 'progress') {
        opts.onProgress?.(msg.progress ?? 0);
      } else if (msg.type === 'done') {
        worker.removeEventListener('message', handler);
        if (msg.blob) {
          resolve(msg.blob);
        } else {
          reject(new Error('Worker returned no blob'));
        }
      } else if (msg.type === 'error') {
        worker.removeEventListener('message', handler);
        reject(new Error(msg.error ?? 'PDF worker error'));
      }
    };

    worker.addEventListener('message', handler);

    const request: PdfWorkerRequest = {
      type: 'assemble',
      pages: opts.pages,
      personName: opts.personName,
      singlePage: opts.singlePage,
    };
    worker.postMessage(request);
  });
}

/** Main-thread fallback when Worker is unavailable */
async function assemblePdfMainThread(opts: AssemblePdfOptions): Promise<Blob> {
  const { jsPDF } = await import('jspdf');

  const A4_WIDTH_PT = 595.28;
  const A4_HEIGHT_PT = 841.89;

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
  const { pages, personName, singlePage } = opts;
  const totalPages = pages.length;

  const drawFooter = (cur: number, total: number) => {
    pdf.setFontSize(9);
    pdf.setTextColor(156, 163, 175);
    if (personName) pdf.text(personName, 40, A4_HEIGHT_PT - 14);
    pdf.text(`${cur} / ${total}`, A4_WIDTH_PT - 40, A4_HEIGHT_PT - 14, { align: 'right' });
  };

  if (singlePage && pages.length === 1) {
    pdf.addImage(pages[0].dataURL, 'PNG', 0, 0, A4_WIDTH_PT, A4_HEIGHT_PT);
    drawFooter(1, 1);
  } else {
    for (let i = 0; i < pages.length; i++) {
      if (i > 0) pdf.addPage();
      const page = pages[i];
      pdf.addImage(page.dataURL, 'PNG', 0, page.yOffset, A4_WIDTH_PT, page.drawHeight);
      drawFooter(i + 1, totalPages);
      opts.onProgress?.(Math.round(((i + 1) / totalPages) * 100));
    }
  }

  return pdf.output('blob');
}
