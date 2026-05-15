import { useSyncExternalStore, useCallback } from 'react';
import {
  getLocale,
  setLocale,
  subscribeLocale,
  getTranslations,
  type Locale,
  type Translations,
} from '../utils/i18n';
import { SEO_URLS } from '../utils/seo';

/**
 * Hook to access the current locale and translations.
 * Triggers re-render when locale changes.
 */
export function useLocale(): {
  locale: Locale;
  t: Translations;
  toggleLocale: () => void;
} {
  const locale = useSyncExternalStore(subscribeLocale, getLocale, getLocale);
  const t = getTranslations(locale);
  const toggleLocale = useCallback(() => {
    const nextLocale = locale === 'zh' ? 'en' : 'zh';
    setLocale(nextLocale);

    const targetUrl = nextLocale === 'zh' ? SEO_URLS.zh : SEO_URLS.en;
    if (globalThis.location?.href !== targetUrl) {
      globalThis.location.assign(targetUrl);
    }
  }, [locale]);
  return { locale, t, toggleLocale };
}
