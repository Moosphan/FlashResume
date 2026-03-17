import { useSyncExternalStore, useCallback } from 'react';
import {
  getLocale,
  setLocale,
  subscribeLocale,
  getTranslations,
  type Locale,
  type Translations,
} from '../utils/i18n';

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
    setLocale(locale === 'zh' ? 'en' : 'zh');
  }, [locale]);
  return { locale, t, toggleLocale };
}
