declare global {
  interface Window {
    dataLayer: IArguments[];
    gtag?: (...args: unknown[]) => void;
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID?.trim();
let initialized = false;

export function isAnalyticsEnabled(): boolean {
  return Boolean(measurementId);
}

export function initializeAnalytics(): void {
  if (initialized || !measurementId || typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };

  const existingScript = document.querySelector<HTMLScriptElement>('script[data-ga4-loader="true"]');

  const configure = () => {
    if (!window.gtag) return;
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      anonymize_ip: true,
    });
  };

  if (existingScript) {
    configure();
  } else {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
    script.dataset.ga4Loader = 'true';
    script.addEventListener('load', configure, { once: true });
    document.head.appendChild(script);
  }
  initialized = true;
}
