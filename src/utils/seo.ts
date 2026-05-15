import { getPathnameLocale, type Locale } from './i18n';

export const SEO_URLS = {
  en: 'https://dorck.cn/FlashResume/',
  zh: 'https://dorck.cn/FlashResume/zh/',
  xDefault: 'https://dorck.cn/FlashResume/',
} as const;

type SeoEntry = {
  lang: string;
  title: string;
  description: string;
  ogLocale: string;
  url: string;
};

export const SEO_META: Record<Locale, SeoEntry> = {
  en: {
    lang: 'en',
    title: 'Flash Resume - Free Online Resume Builder',
    description:
      'Flash Resume is a free online resume builder with local auto-save, live preview, multi-resume management, 24 industry templates, and PDF, PNG, JPG, JSON export.',
    ogLocale: 'en_US',
    url: SEO_URLS.en,
  },
  zh: {
    lang: 'zh-CN',
    title: 'Flash Resume - 免费在线简历制作工具',
    description:
      'Flash Resume 是一个免费在线简历制作工具，支持本地自动保存、实时预览、多份简历管理、24 套行业模板，以及 PDF、PNG、JPG、JSON 导出。',
    ogLocale: 'zh_CN',
    url: SEO_URLS.zh,
  },
};

function updateMeta(selector: string, content: string): void {
  const element = document.head.querySelector<HTMLMetaElement>(selector);
  if (element) {
    element.setAttribute('content', content);
  }
}

function updateLink(selector: string, href: string): void {
  const element = document.head.querySelector<HTMLLinkElement>(selector);
  if (element) {
    element.setAttribute('href', href);
  }
}

export function syncDocumentSeo(locale: Locale): void {
  const meta = SEO_META[locale];
  const pathLocale = getPathnameLocale(globalThis.location?.pathname ?? '');
  const pageUrl = pathLocale === 'zh' ? SEO_URLS.zh : SEO_URLS.en;
  document.documentElement.lang = meta.lang;
  document.title = meta.title;
  updateMeta('meta[name="description"]', meta.description);
  updateMeta('meta[property="og:title"]', meta.title);
  updateMeta('meta[property="og:description"]', meta.description);
  updateMeta('meta[property="og:locale"]', meta.ogLocale);
  updateMeta('meta[property="og:url"]', pageUrl);
  updateMeta('meta[name="twitter:title"]', meta.title);
  updateMeta('meta[name="twitter:description"]', meta.description);
  updateLink('link[rel="canonical"]', pageUrl);
}
