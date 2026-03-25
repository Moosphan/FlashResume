/**
 * PDF Assembly Web Worker
 *
 * Receives page image data URLs and assembles them into a PDF using jsPDF.
 * This runs off the main thread to avoid UI jank during PDF generation.
 */
import { jsPDF } from 'jspdf';

// A4 dimensions in PDF points
const A4_WIDTH_PT = 595.28;
const A4_HEIGHT_PT = 841.89;

export interface PdfWorkerRequest {
  type: 'assemble';
  /** Data URL for each page (image/png) */
  pages: Array<{
    dataURL: string;
    /** Draw height in PDF points */
    drawHeight: number;
    /** Y offset in PDF points */
    yOffset: number;
  }>;
  personName: string;
  /** Whether this is a single-page PDF (uses full A4 height) */
  singlePage: boolean;
}

export interface PdfWorkerResponse {
  type: 'done' | 'progress' | 'error';
  /** PDF blob (only for 'done') */
  blob?: Blob;
  /** Progress value 0-100 (only for 'progress') */
  progress?: number;
  /** Error message (only for 'error') */
  error?: string;
}

function drawPageFooter(pdf: jsPDF, name: string, cur: number, total: number): void {
  pdf.setFontSize(9);
  pdf.setTextColor(156, 163, 175);
  if (name) pdf.text(name, 40, A4_HEIGHT_PT - 14);
  pdf.text(`${cur} / ${total}`, A4_WIDTH_PT - 40, A4_HEIGHT_PT - 14, { align: 'right' });
}

self.onmessage = (e: MessageEvent<PdfWorkerRequest>) => {
  const { pages, personName, singlePage } = e.data;

  try {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
    const totalPages = pages.length;

    if (singlePage && pages.length === 1) {
      pdf.addImage(pages[0].dataURL, 'PNG', 0, 0, A4_WIDTH_PT, A4_HEIGHT_PT);
      drawPageFooter(pdf, personName, 1, 1);
    } else {
      for (let i = 0; i < pages.length; i++) {
        if (i > 0) pdf.addPage();

        const page = pages[i];
        pdf.addImage(page.dataURL, 'PNG', 0, page.yOffset, A4_WIDTH_PT, page.drawHeight);
        drawPageFooter(pdf, personName, i + 1, totalPages);

        // Report per-page progress
        const resp: PdfWorkerResponse = {
          type: 'progress',
          progress: Math.round(((i + 1) / totalPages) * 100),
        };
        self.postMessage(resp);
      }
    }

    const blob = pdf.output('blob');
    const resp: PdfWorkerResponse = { type: 'done', blob };
    self.postMessage(resp);
  } catch (err) {
    const resp: PdfWorkerResponse = {
      type: 'error',
      error: err instanceof Error ? err.message : String(err),
    };
    self.postMessage(resp);
  }
};
