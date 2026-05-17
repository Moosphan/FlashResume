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
  imageAlt: string;
};

export const SEO_META: Record<Locale, SeoEntry> = {
  en: {
    lang: 'en',
    title: 'Flash Resume - Online Resume Builder with Live Preview',
    description:
      'Write, preview, tailor, and export resumes in one local-first workspace with 24 templates and PDF, PNG, JPG, JSON export.',
    ogLocale: 'en_US',
    url: SEO_URLS.en,
    imageAlt: 'Flash Resume branded social card showing a resume workspace, polished layout preview, and export-ready visuals.',
  },
  zh: {
    lang: 'zh-CN',
    title: 'Flash Resume - 支持实时预览的在线简历编辑器',
    description:
      '在一个本地优先的工作区中完成简历撰写、预览、定向调整与导出，支持 24 套模板和 PDF、PNG、JPG、JSON 导出。',
    ogLocale: 'zh_CN',
    url: SEO_URLS.zh,
    imageAlt: 'Flash Resume 品牌分享图，展示简历工作区、版式预览与导出能力。',
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
  updateMeta('meta[property="og:image"]', 'https://dorck.cn/FlashResume/og-cover.png');
  updateMeta('meta[property="og:image:alt"]', meta.imageAlt);
  updateMeta('meta[name="twitter:title"]', meta.title);
  updateMeta('meta[name="twitter:description"]', meta.description);
  updateMeta('meta[name="twitter:image"]', 'https://dorck.cn/FlashResume/og-cover.png');
  updateMeta('meta[name="twitter:image:alt"]', meta.imageAlt);
  updateLink('link[rel="canonical"]', pageUrl);
}
