import { toCanvas, toPng, toJpeg } from 'html-to-image';

export interface RenderOptions {
  width: number;
  height: number;
  pixelRatio: number;
  backgroundColor: string;
  /** Optional filter to exclude DOM nodes before rendering */
  filter?: (node: HTMLElement) => boolean;
}

export interface RenderEngine {
  domToCanvas(element: HTMLElement, options: RenderOptions): Promise<HTMLCanvasElement>;
  domToDataURL(
    element: HTMLElement,
    options: RenderOptions,
    format?: 'png' | 'jpeg',
    quality?: number,
  ): Promise<string>;
}

const htiOptions = (options: RenderOptions) => ({
  width: options.width,
  height: options.height,
  pixelRatio: options.pixelRatio,
  backgroundColor: options.backgroundColor,
  filter: options.filter,
  skipAutoScale: true,
  includeQueryParams: false,
  fetchRequestInit: { mode: 'cors', credentials: 'omit' } as RequestInit,
});

export const renderEngine: RenderEngine = {
  async domToCanvas(
    element: HTMLElement,
    options: RenderOptions,
  ): Promise<HTMLCanvasElement> {
    return toCanvas(element, htiOptions(options));
  },

  async domToDataURL(
    element: HTMLElement,
    options: RenderOptions,
    format: 'png' | 'jpeg' = 'png',
    quality?: number,
  ): Promise<string> {
    // Use toPng/toJpeg directly — avoids the intermediate Canvas step
    const opts = htiOptions(options);
    if (format === 'jpeg') {
      return toJpeg(element, { ...opts, quality: quality ?? 0.92 });
    }
    return toPng(element, opts);
  },
};
