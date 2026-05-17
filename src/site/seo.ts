import type { SiteLocale } from './i18n';

type SitePage = 'home' | 'features' | 'templates' | 'faq';

const BASE_URL = 'https://dorck.cn/FlashResume/';
const OG_IMAGE_URL = `${BASE_URL}og-cover.png`;

const PAGE_URLS: Record<SiteLocale, Record<SitePage, string>> = {
  en: {
    home: `${BASE_URL}official/`,
    features: `${BASE_URL}official/features/`,
    templates: `${BASE_URL}official/templates/`,
    faq: `${BASE_URL}official/faq/`,
  },
  zh: {
    home: `${BASE_URL}official/zh/`,
    features: `${BASE_URL}official/zh/features/`,
    templates: `${BASE_URL}official/zh/templates/`,
    faq: `${BASE_URL}official/zh/faq/`,
  },
};

type SiteSeoEntry = {
  lang: string;
  ogLocale: string;
  title: string;
  description: string;
  imageAlt: string;
};

const SITE_SEO_META: Record<SiteLocale, Record<SitePage, SiteSeoEntry>> = {
  en: {
    home: {
      lang: 'en',
      ogLocale: 'en_US',
      title: 'Flash Resume - Online Resume Builder for Real Job Applications',
      description: 'Write, preview, tailor, and export resumes in one focused workspace with live A4 preview, 24 templates, and local-first drafts.',
      imageAlt: 'Flash Resume branded social card showing a resume workspace, polished layout preview, and export-ready visuals.',
    },
    features: {
      lang: 'en',
      ogLocale: 'en_US',
      title: 'Flash Resume Features - Live Preview, Templates, and Export Workflow',
      description: 'Explore the editing, preview, template switching, and export workflow that helps candidates move from draft to submission with less friction.',
      imageAlt: 'Flash Resume feature overview social card with workspace panels, resume preview, and export cues.',
    },
    templates: {
      lang: 'en',
      ogLocale: 'en_US',
      title: 'Flash Resume Templates - Professional Layouts by Industry and Style',
      description: 'Browse resume templates designed for readability, controlled visual tone, and dependable export across industries and communication styles.',
      imageAlt: 'Flash Resume template library social card with structured resume layouts and brand styling.',
    },
    faq: {
      lang: 'en',
      ogLocale: 'en_US',
      title: 'Flash Resume FAQ - Storage, Export, and Resume Workflow',
      description: 'Get clear answers about local storage, export formats, bilingual support, multi-resume management, and how Flash Resume fits real job applications.',
      imageAlt: 'Flash Resume FAQ social card with branded interface preview and resume workflow highlights.',
    },
  },
  zh: {
    home: {
      lang: 'zh-CN',
      ogLocale: 'zh_CN',
      title: 'Flash Resume - 面向真实投递场景的在线简历编辑器',
      description: '在一个专注的工作区中完成简历撰写、预览、定向调整与导出，支持实时 A4 预览、24 套模板和本地优先草稿。',
      imageAlt: 'Flash Resume 品牌分享图，展示简历工作区、版式预览与导出能力。',
    },
    features: {
      lang: 'zh-CN',
      ogLocale: 'zh_CN',
      title: 'Flash Resume 功能 - 实时预览、模板切换与导出工作流',
      description: '更完整地了解 Flash Resume 的编辑、预览、模板切换与导出链路，帮助候选人更顺滑地从起稿走到投递。',
      imageAlt: 'Flash Resume 功能概览分享图，展示编辑区、预览区与导出提示。',
    },
    templates: {
      lang: 'zh-CN',
      ogLocale: 'zh_CN',
      title: 'Flash Resume 模板 - 按行业与风格构建的专业简历布局',
      description: '浏览强调可读性、专业克制与导出稳定性的模板布局，覆盖不同行业和表达风格。',
      imageAlt: 'Flash Resume 模板库分享图，展示多种结构化简历布局与品牌视觉。',
    },
    faq: {
      lang: 'zh-CN',
      ogLocale: 'zh_CN',
      title: 'Flash Resume 常见问题 - 存储方式、导出能力与简历工作流',
      description: '集中回答本地存储、导出格式、中英双语支持、多简历管理，以及 Flash Resume 的产品定位。',
      imageAlt: 'Flash Resume 常见问题分享图，展示品牌界面预览与简历工作流亮点。',
    },
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

function updateAlternate(locale: SiteLocale, page: SitePage): void {
  updateLink('link[rel="alternate"][hreflang="en"]', PAGE_URLS.en[page]);
  updateLink('link[rel="alternate"][hreflang="zh-CN"]', PAGE_URLS.zh[page]);
  updateLink('link[rel="alternate"][hreflang="x-default"]', PAGE_URLS.en[page]);
  updateLink('link[rel="canonical"]', PAGE_URLS[locale][page]);
}

export function syncSiteDocumentSeo(page: SitePage, locale: SiteLocale): void {
  const meta = SITE_SEO_META[locale][page];
  const pageUrl = PAGE_URLS[locale][page];

  document.documentElement.lang = meta.lang;
  document.title = meta.title;

  updateMeta('meta[name="description"]', meta.description);
  updateMeta('meta[property="og:title"]', meta.title);
  updateMeta('meta[property="og:description"]', meta.description);
  updateMeta('meta[property="og:locale"]', meta.ogLocale);
  updateMeta('meta[property="og:url"]', pageUrl);
  updateMeta('meta[property="og:image"]', OG_IMAGE_URL);
  updateMeta('meta[property="og:image:alt"]', meta.imageAlt);
  updateMeta('meta[property="og:image:width"]', '1200');
  updateMeta('meta[property="og:image:height"]', '630');
  updateMeta('meta[name="twitter:title"]', meta.title);
  updateMeta('meta[name="twitter:description"]', meta.description);
  updateMeta('meta[name="twitter:image"]', OG_IMAGE_URL);
  updateMeta('meta[name="twitter:image:alt"]', meta.imageAlt);

  updateAlternate(locale, page);
}
