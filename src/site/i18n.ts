export type SiteLocale = 'zh' | 'en';

const LOCALE_STORAGE_KEY = 'flash-resume-locale';
const CHINESE_TIME_ZONES = new Set([
  'Asia/Shanghai',
  'Asia/Chongqing',
  'Asia/Harbin',
  'Asia/Urumqi',
  'Asia/Hong_Kong',
  'Asia/Macau',
  'Asia/Taipei',
]);

function isSiteLocale(value: string | null): value is SiteLocale {
  return value === 'zh' || value === 'en';
}

function detectBrowserLocale(): SiteLocale {
  const languageSources = [
    ...((globalThis.navigator?.languages ?? []) as readonly string[]),
    globalThis.navigator?.language,
  ].filter(Boolean);

  if (languageSources.some((l) => l.toLowerCase().startsWith('zh'))) {
    return 'zh';
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (CHINESE_TIME_ZONES.has(timeZone)) {
    return 'zh';
  }

  return 'en';
}

function detectLocaleFromPathname(pathname: string): SiteLocale | null {
  if (pathname.includes('/official/zh')) {
    return 'zh';
  }
  if (pathname.includes('/official/')) {
    return 'en';
  }
  return null;
}

let currentLocale: SiteLocale = ((): SiteLocale => {
  const pathnameLocale = detectLocaleFromPathname(globalThis.location?.pathname ?? '');
  if (pathnameLocale) return pathnameLocale;
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (isSiteLocale(saved)) return saved;
  } catch { /* ignore */ }
  return detectBrowserLocale();
})();

export function getSiteLocale(): SiteLocale {
  return currentLocale;
}

export function setSiteLocale(locale: SiteLocale): void {
  currentLocale = locale;
}

// ============================================================
// Site translations
// ============================================================

type NavItem = { key: string; label: string; href: string };
type StatItem = { value: string; label: string };

interface PageContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroAlt: string;
}

interface FeatureGroup {
  title: string;
  body: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

interface CategoryItem {
  title: string;
  body: string;
}

export interface SiteTranslations {
  // Nav
  navItems: NavItem[];
  launchEditor: string;

  // Footer
  footerText: string;
  footerLinks: NavItem[];

  // Page content (per page)
  pages: {
    home: PageContent;
    features: PageContent;
    templates: PageContent;
    faq: PageContent;
  };

  // Home sections
  homeWhyTitle: string;
  homeWhyBody: string;
  stats: StatItem[];
  homeFlowTitle: string;
  homeFlowBody: string;
  homeFeatureCards: FeatureGroup[];
  homeAudienceTitle: string;
  homeAudienceBody: string;
  homeAudienceCards: FeatureGroup[];
  homeVisualTitle: string;
  homeVisualBody: string;
  homeVisualBullets: string[];
  homeHeroAlt: string;
  homeHeroImageAlt: string;
  homeDetailArtAlt: string;

  // Features sections
  featuresSetTitle: string;
  featuresSetBody: string;
  featureGroups: FeatureGroup[];
  previewTitle: string;
  previewBody: string;
  previewBullets: string[];
  featuresBannerAlt: string;
  featuresDetailArtAlt: string;
  featuresWorkflowTitle: string;
  featuresWorkflowBody: string;
  featuresWorkflowSteps: FeatureGroup[];

  // Templates sections
  templateSystemTitle: string;
  templateSystemBody: string;
  templateCategories: CategoryItem[];
  designTitle: string;
  designBody: string;
  designCards: FeatureGroup[];
  templatesBgAlt: string;
  templatesDetailArtAlt: string;
  templatesGuideTitle: string;
  templatesGuideBody: string;
  templatesGuideCards: FeatureGroup[];

  // FAQ sections
  faqTitle: string;
  faqBody: string;
  faqs: FaqItem[];
  faqCtaTitle: string;
  faqCtaBody: string;
  faqCtaButton: string;
  faqCtaBack: string;
  faqHeroAlt: string;
  faqDetailArtAlt: string;
}

const siteTranslations: Record<SiteLocale, SiteTranslations> = {
  en: {
    navItems: [
      { key: 'home', label: 'Overview', href: 'official/' },
      { key: 'features', label: 'Features', href: 'official/features/' },
      { key: 'templates', label: 'Templates', href: 'official/templates/' },
      { key: 'faq', label: 'FAQ', href: 'official/faq/' },
    ],
    launchEditor: 'Launch Editor',

    footerText: 'Flash Resume official website covering the current product experience, workflow, and template system.',
    footerLinks: [
      { key: 'home', label: 'Overview', href: 'official/' },
      { key: 'features', label: 'Features', href: 'official/features/' },
      { key: 'templates', label: 'Templates', href: 'official/templates/' },
      { key: 'faq', label: 'FAQ', href: 'official/faq/' },
    ],

    pages: {
      home: {
        eyebrow: 'Official website',
        title: 'An online resume builder built for real job applications',
        subtitle:
          'Flash Resume brings writing, live layout review, template switching, and export into one calm workflow for students, professionals, and career changers.',
        ctaPrimary: 'Launch Editor',
        ctaSecondary: 'Explore Features',
        heroAlt: 'Generated minimal hero artwork for the Flash Resume official site overview page',
      },
      features: {
        eyebrow: 'Feature overview',
        title: 'Professional resume workflow without the usual friction',
        subtitle:
          'Draft faster, keep multiple targeted versions, review an A4 preview as you edit, and export application-ready files from the same workspace.',
        ctaPrimary: 'Open the Product',
        ctaSecondary: 'Browse Templates',
        heroAlt: 'Generated horizontal artwork for the Flash Resume features page',
      },
      templates: {
        eyebrow: 'Template library',
        title: 'Resume templates designed for clarity, not decoration',
        subtitle:
          'Explore layouts suited to different industries and communication styles while keeping typography, spacing, and export reliability consistent.',
        ctaPrimary: 'View Templates in App',
        ctaSecondary: 'Read FAQ',
        heroAlt: 'Generated gallery-style artwork for the Flash Resume templates page',
      },
      faq: {
        eyebrow: 'FAQ',
        title: 'Questions visitors ask before trusting a resume tool',
        subtitle:
          'Storage, export, multi-resume management, bilingual support, and product positioning explained in plain language.',
        ctaPrimary: 'Launch Editor',
        ctaSecondary: 'Back to Overview',
        heroAlt: 'Generated Flash Resume hero artwork reused on the FAQ page',
      },
    },

    homeWhyTitle: 'Why Flash Resume',
    homeWhyBody:
      'Flash Resume is built for people who need to move from first draft to final submission without getting lost in formatting overhead. It keeps editing, preview, template switching, and export in one browser-based workspace.',
    stats: [
      { value: '24', label: 'industry-ready templates' },
      { value: '4', label: 'export formats' },
      { value: '2', label: 'interface languages' },
    ],
    homeFlowTitle: 'Built around the application workflow',
    homeFlowBody:
      'Keep separate resumes for different roles, refine layout and theme as needed, and export a polished version only when the document already feels settled on screen.',
    homeFeatureCards: [
      { title: 'Multi-resume workspace', body: 'Maintain separate versions for campus hiring, experienced-role applications, freelance profiles, or industry pivots.' },
      { title: 'Live A4 preview', body: 'Review spacing, hierarchy, and section balance while editing instead of discovering issues after export.' },
      { title: 'Local-first drafting', body: 'Resume content is stored in the browser by default, keeping the workflow fast and privacy-friendly.' },
      { title: 'Structured backup', body: 'Export JSON when you need a portable backup or want to move your data between devices.' },
    ],
    homeAudienceTitle: 'Who it is built for',
    homeAudienceBody:
      'The product is broad enough for different job-search stages, but focused enough to stay practical for everyday resume work.',
    homeAudienceCards: [
      { title: 'Students and graduates', body: 'Build a first resume quickly, then adapt it for internships, campus recruiting, and early-career applications.' },
      { title: 'Experienced professionals', body: 'Maintain role-specific versions for promotions, company changes, and industry transitions without duplicating work.' },
      { title: 'Freelancers and independent operators', body: 'Present projects, outcomes, and skills in a cleaner format when responding to clients or short-term opportunities.' },
    ],
    homeVisualTitle: 'Template coverage with professional restraint',
    homeVisualBody:
      'The library is designed to help candidates adapt tone and structure to different industries without turning resume creation into layout micromanagement.',
    homeVisualBullets: [
      'Technology, finance, consulting, healthcare, legal, operations, education, and more',
      'Layouts optimized for readability, document hierarchy, and dependable PDF output',
      'Theme color adjustments for personal branding without breaking the layout',
    ],
    homeHeroAlt: 'Generated minimal homepage hero artwork for Flash Resume',
    homeHeroImageAlt: 'Generated minimal hero artwork for the Flash Resume official site overview page',
    homeDetailArtAlt: 'Flash Resume overview detail image showing the official website visual style for resume workflow and multi-version drafting',

    featuresSetTitle: 'Core capabilities',
    featuresSetBody:
      'Every capability maps to a real step in the resume workflow: drafting content, comparing layouts, maintaining variants, and exporting a version ready to send.',
    featureGroups: [
      { title: 'Local auto-save', body: 'Editing progress is stored in the browser automatically, so users can pause and return without account setup.' },
      { title: 'A4-accurate live preview', body: 'The preview closely mirrors the final export target, making layout checks faster and more reliable.' },
      { title: 'PDF, PNG, JPG, and JSON export', body: 'Formal applications, quick sharing, and structured backup are all covered by the current export set.' },
      { title: 'Multi-resume management', body: 'Maintain separate resume versions for different roles, companies, or language contexts in one workspace.' },
      { title: 'Template gallery by industry and style', body: 'Switch layouts without rebuilding content, then compare which structure fits the application best.' },
      { title: 'Chinese and English interface', body: 'The product already supports bilingual UI, which helps with domestic and international job-search scenarios.' },
    ],
    previewTitle: 'Preview-first editing',
    previewBody:
      'The editor and preview are meant to stay in conversation. You can revise content, evaluate the page immediately, and make layout decisions before exporting.',
    previewBullets: [
      'Update content blocks without losing sight of final page balance.',
      'See sections respond as content expands, shrinks, or changes order.',
      'Export only after the on-screen document already looks ready to send.',
    ],
    featuresBannerAlt: 'Generated features banner artwork for Flash Resume',
    featuresDetailArtAlt: 'Flash Resume features detail image showing the official website visual style for editor and preview workflow',
    featuresWorkflowTitle: 'From draft to delivery',
    featuresWorkflowBody:
      'Flash Resume is most useful when it reduces the small frictions between writing, reviewing, and sending a resume. The workflow is designed around that sequence.',
    featuresWorkflowSteps: [
      { title: '1. Start with structure', body: 'Begin with personal details, experience, projects, education, and skills in a content-first editor.' },
      { title: '2. Tailor for the role', body: 'Duplicate a version, revise emphasis, and align the document to a specific job description or industry context.' },
      { title: '3. Check the page live', body: 'Use the preview to validate spacing, reading rhythm, and overall one-page or multi-page balance before export.' },
      { title: '4. Export with confidence', body: 'Generate PDF for formal applications, image formats for quick sharing, or JSON for backup and migration.' },
    ],

    templateSystemTitle: 'Template system',
    templateSystemBody:
      'Templates are practical starting points rather than decorative skins. The same resume data can move across layouts with minimal rework.',
    templateCategories: [
      { title: 'Professional and classic', body: 'For conservative hiring contexts where readability, order, and document discipline matter most.' },
      { title: 'Modern and compact', body: 'Useful when the candidate needs a cleaner one-page presentation with stronger scanning rhythm.' },
      { title: 'Creative and personal-brand', body: 'For roles that benefit from more character while staying within professional boundaries.' },
      { title: 'Industry-oriented variants', body: 'Layouts tuned for finance, healthcare, legal, government, consulting, operations, and related fields.' },
    ],
    designTitle: 'Design principles',
    designBody:
      'The system favors readable typography, disciplined spacing, and controlled color usage so resumes still feel credible after export, printing, or ATS review.',
    designCards: [
      { title: 'Readable typography', body: 'Headings, dates, and body copy stay easy to scan at PDF size and on common screen widths.' },
      { title: 'Controlled accent color', body: 'Users can personalize the primary color while keeping the document visually stable and professional.' },
      { title: 'Reusable content structure', body: 'The same resume data can move between templates without manual rebuilding or layout drift.' },
    ],
    templatesBgAlt: 'Generated artwork representing the Flash Resume template system',
    templatesDetailArtAlt: 'Flash Resume templates detail image showing the official website visual style for the template library',
    templatesGuideTitle: 'How to choose the right template',
    templatesGuideBody:
      'A good template is not the most decorative one. It is the layout that matches the hiring context, supports fast scanning, and lets the strongest evidence stand out.',
    templatesGuideCards: [
      { title: 'Match the audience', body: 'Choose more conservative layouts for formal industries and more expressive ones only where personal brand matters.' },
      { title: 'Respect information density', body: 'Use compact layouts when content is strong but concise, and more spacious layouts when hierarchy needs room to breathe.' },
      { title: 'Optimize for final delivery', body: 'Pick the template that remains clean after export, printing, and recruiter review rather than only on the editing screen.' },
    ],

    faqTitle: 'Frequently asked questions',
    faqBody:
      'A resume tool earns trust by being explicit about how it works. These are the questions visitors usually ask before they decide to start editing.',
    faqs: [
      {
        question: 'Do users need an account before they can start editing?',
        answer: 'No. The current product is designed to open directly in the browser, with local storage handling everyday drafts and revisions by default.',
      },
      {
        question: 'What export formats does Flash Resume support?',
        answer: 'The editor supports PDF, PNG, JPG, and JSON export. That covers formal applications, quick visual sharing, and structured backup or migration.',
      },
      {
        question: 'Can users maintain different resumes for different roles?',
        answer: 'Yes. Multi-resume management is part of the current product, so users can keep tailored versions for different roles, companies, or career directions.',
      },
      {
        question: 'Is Flash Resume meant to be a design tool?',
        answer: 'Not really. It is better understood as a focused resume workflow product that offers enough template range to feel adaptable without turning editing into layout micromanagement.',
      },
      {
        question: 'How does this support international job-search use cases?',
        answer: 'The product already supports Chinese and English UI, and the official site now has separate localized pages to make cross-language discovery and usage clearer.',
      },
    ],
    faqCtaTitle: 'See the editor in context',
    faqCtaBody:
      'Landing pages can explain the workflow, but the editor is still the clearest proof. Open Flash Resume to test templates, preview behavior, and export options with your own content.',
    faqCtaButton: 'Open Editor',
    faqCtaBack: 'Back to Overview',
    faqHeroAlt: 'Generated Flash Resume hero artwork used on the FAQ page',
    faqDetailArtAlt: 'Flash Resume FAQ detail image reusing the official features visual style',
  },

  zh: {
    navItems: [
      { key: 'home', label: '概览', href: 'official/zh/' },
      { key: 'features', label: '功能', href: 'official/zh/features/' },
      { key: 'templates', label: '模板', href: 'official/zh/templates/' },
      { key: 'faq', label: '常见问题', href: 'official/zh/faq/' },
    ],
    launchEditor: '打开编辑器',

    footerText: 'Flash Resume 官方网站，介绍当前产品体验、工作流设计与模板体系。',
    footerLinks: [
      { key: 'home', label: '概览', href: 'official/zh/' },
      { key: 'features', label: '功能', href: 'official/zh/features/' },
      { key: 'templates', label: '模板', href: 'official/zh/templates/' },
      { key: 'faq', label: '常见问题', href: 'official/zh/faq/' },
    ],

    pages: {
      home: {
        eyebrow: '官方网站',
        title: '面向真实投递场景的在线简历编辑器',
        subtitle:
          'Flash Resume 将内容编辑、版式预览、模板切换和文件导出放进同一条工作流，适合校招、社招、转岗与自由职业场景。',
        ctaPrimary: '打开编辑器',
        ctaSecondary: '了解功能',
        heroAlt: 'Flash Resume 官网首页主视觉',
      },
      features: {
        eyebrow: '功能概览',
        title: '更贴近求职流程的专业简历工作台',
        subtitle:
          '更快起稿，维护多个定向版本，边编辑边查看 A4 预览，并从同一工作区导出可直接投递的文件。',
        ctaPrimary: '进入产品',
        ctaSecondary: '浏览模板',
        heroAlt: 'Flash Resume 功能页横幅',
      },
      templates: {
        eyebrow: '模板库',
        title: '为可读性而设计，而不是为装饰而设计的简历模板',
        subtitle:
          '覆盖不同行业与表达风格，同时保持排版秩序、信息层级和导出稳定性。',
        ctaPrimary: '在应用中查看模板',
        ctaSecondary: '查看常见问题',
        heroAlt: 'Flash Resume 模板库展示',
      },
      faq: {
        eyebrow: '常见问题',
        title: '用户在信任一款简历工具前最常问的问题',
        subtitle:
          '关于存储方式、导出能力、多简历管理、中英双语支持和产品定位的说明，都在这里。',
        ctaPrimary: '打开编辑器',
        ctaSecondary: '返回概览',
        heroAlt: 'Flash Resume 常见问题页主视觉',
      },
    },

    homeWhyTitle: '为什么选择 Flash Resume',
    homeWhyBody:
      'Flash Resume 面向真正需要完成投递的人，而不是只想做一张好看的页面。它把编辑、预览、模板切换和导出整合在同一个浏览器工作区中，并默认以本地存储承载日常草稿。',
    stats: [
      { value: '24', label: '套行业模板' },
      { value: '4', label: '种导出格式' },
      { value: '2', label: '种界面语言' },
    ],
    homeFlowTitle: '围绕真实投递流程组织，而不是围绕表单堆砌',
    homeFlowBody:
      '你可以为不同岗位维护不同版本的简历，按需调整模板和主题色，并在版式确认无误后再导出正式文件，减少重复劳动。',
    homeFeatureCards: [
      { title: '多简历工作区', body: '为校招、社招、转岗、自由职业或不同行业岗位分别维护版本。' },
      { title: '实时 A4 预览', body: '在编辑过程中同步检查留白、层级和版面平衡，而不是等导出后返工。' },
      { title: '本地优先起稿', body: '简历内容默认保存在浏览器本地，启动轻量，也更适合隐私敏感场景。' },
      { title: '结构化备份', body: '可导出 JSON 作为备份，方便在不同设备或会话之间迁移。' },
    ],
    homeAudienceTitle: '适合哪些用户',
    homeAudienceBody:
      '产品覆盖的场景足够广，但仍然保持在“真正好用的简历工作流”这个边界里，不会变成笨重的排版工具。',
    homeAudienceCards: [
      { title: '应届生与校招生', body: '快速搭建第一份可投递简历，并针对实习、校招和早期岗位做版本调整。' },
      { title: '有经验的求职者', body: '为不同岗位方向、目标公司或行业转换维护多个定向版本，减少重复劳动。' },
      { title: '自由职业者与独立从业者', body: '更清晰地整理项目、成果和技能，用于客户沟通或短期机会申请。' },
    ],
    homeVisualTitle: '覆盖广，但保持专业克制',
    homeVisualBody:
      '模板库的目标不是把用户变成设计师，而是帮助不同背景的候选人更快找到合适的表达方式。',
    homeVisualBullets: [
      '覆盖科技、金融、咨询、医疗、法律、运营、教育等常见求职方向',
      '强调可读性、信息层级与 PDF 输出稳定性',
      '支持主题色微调，兼顾个人识别度与整体专业度',
    ],
    homeHeroAlt: 'Flash Resume 官网首页主视觉图',
    homeHeroImageAlt: 'Flash Resume 官网首页主视觉',
    homeDetailArtAlt: 'Flash Resume 官网概览页详情配图，展示简历工作流与多版本编辑场景',

    featuresSetTitle: '核心能力',
    featuresSetBody:
      '每项能力都对应真实求职流程中的一步：起稿、改稿、比对版式、维护多版本，以及导出最终投递文件。',
    featureGroups: [
      { title: '本地自动保存', body: '编辑内容自动保存在浏览器中，临时离开或关闭页面后仍可继续。' },
      { title: '实时 A4 预览', body: '预览尽量贴近最终导出页，便于在投递前完成版式确认。' },
      { title: '导出 PDF、PNG、JPG 与 JSON', body: '既覆盖正式投递，也兼顾分享、备份和迁移。' },
      { title: '多简历管理', body: '可为不同岗位、公司或语言版本分别维护内容。' },
      { title: '按行业和风格浏览模板', body: '切换布局时无需重填信息，适合快速比较不同表达方式。' },
      { title: '中英双语界面', body: '便于在国内外招聘场景下准备不同版本的简历。' },
    ],
    previewTitle: '预览优先的工作流',
    previewBody:
      '编辑器与预览区不是分离的两个阶段，而是同一条工作流。内容修改后，页面效果会立刻反馈，减少反复导出试错。',
    previewBullets: [
      '更新内容时，始终能同步看到最终页面的平衡感。',
      '随着内容增减或顺序调整，预览即时响应。',
      '确认页面稳定后再导出，减少投递前的返工。',
    ],
    featuresBannerAlt: 'Flash Resume 功能页横幅图',
    featuresDetailArtAlt: 'Flash Resume 功能页详情配图，展示编辑区与 A4 预览协同工作流',
    featuresWorkflowTitle: '从起稿到投递的完整链路',
    featuresWorkflowBody:
      'Flash Resume 最有价值的地方，不只是能编辑内容，而是把写、改、看、导出几件事尽量顺滑地连在一起。',
    featuresWorkflowSteps: [
      { title: '1. 先完成内容结构', body: '从个人信息、经历、项目、教育和技能开始，以内容优先的方式快速起稿。' },
      { title: '2. 再针对岗位定向调整', body: '复制一份版本，重新组织重点内容，让简历更贴近具体岗位或行业语境。' },
      { title: '3. 在预览里确认页面质量', body: '通过实时预览检查留白、阅读节奏和一页或多页之间的版面平衡。' },
      { title: '4. 最后导出正式文件', body: '导出 PDF 用于正式投递，导出图片用于分享，导出 JSON 用于备份与迁移。' },
    ],

    templateSystemTitle: '模板系统',
    templateSystemBody:
      '这些模板被设计成可直接投入求职使用的起点，而不是只适合展示的样稿。同一份简历数据可以在多个布局之间快速切换。',
    templateCategories: [
      { title: '专业经典', body: '适合强调稳重、规范和信息清晰度的岗位与行业。' },
      { title: '紧凑现代', body: '适合需要在一页内高效呈现关键信息的候选人。' },
      { title: '创意与个人品牌', body: '适合需要保留一定个性表达、但仍需专业边界的岗位。' },
      { title: '行业导向变体', body: '覆盖金融、医疗、法律、政府、咨询、运营等常见方向。' },
    ],
    designTitle: '设计原则',
    designBody:
      '整体设计优先服务于可读性、导出稳定性和招聘场景中的可信度，而不是追求过度装饰。',
    designCards: [
      { title: '清晰排版', body: '标题、日期和正文在 PDF 尺寸和常见屏幕宽度下都保持易读。' },
      { title: '克制配色', body: '允许微调主色调，同时保持整体视觉稳定和专业感。' },
      { title: '可复用内容结构', body: '同一份简历数据可以在多个模板之间切换，无需手动重建。' },
    ],
    templatesBgAlt: 'Flash Resume 模板系统展示图',
    templatesDetailArtAlt: 'Flash Resume 模板页详情配图，展示模板库与版式系统视觉',
    templatesGuideTitle: '如何选择更合适的模板',
    templatesGuideBody:
      '最好的模板未必是最显眼的，而是最适合目标岗位、最利于快速扫描、也最能稳定输出正式文档的那一套。',
    templatesGuideCards: [
      { title: '先看目标受众', body: '正式行业更适合克制稳重的布局，强调个人品牌的岗位再考虑更有识别度的样式。' },
      { title: '再看内容密度', body: '内容多但精炼时适合更紧凑的结构，层级复杂时则需要更舒展的排版空间。' },
      { title: '最后看最终投递效果', body: '优先选择导出后依然整洁、打印后依然清晰的模板，而不是只在编辑界面里好看。' },
    ],

    faqTitle: '常见问题',
    faqBody:
      '一款简历工具是否值得信任，往往取决于它是否把关键问题讲清楚。这里整理的是用户最常关心的几点。',
    faqs: [
      {
        question: '用户需要注册账号才能开始编辑吗？',
        answer: '不需要。当前版本默认将数据保存在浏览器本地，日常编辑不依赖登录和后端服务。',
      },
      {
        question: 'Flash Resume 支持哪些导出格式？',
        answer: '编辑器支持 PDF、PNG、JPG 和 JSON 导出，覆盖正式投递、快速分享、备份和迁移场景。',
      },
      {
        question: '用户可以为不同岗位维护不同版本的简历吗？',
        answer: '可以。多简历管理已是当前功能的一部分，用户可以为不同岗位、公司或语言版本分别维护内容。',
      },
      {
        question: 'Flash Resume 更像设计工具，还是求职工作流工具？',
        answer: '它更适合被理解为一个专注的简历工作流产品，提供足够的模板灵活性，但不会让编辑变成布局微操。',
      },
      {
        question: '如何适配国际求职场景？',
        answer: '产品已支持中英双语界面，官网也提供中英文页面，便于跨语言访问、分享和搜索引擎理解产品能力。',
      },
    ],
    faqCtaTitle: '直接看看编辑器',
    faqCtaBody:
      '官网适合解释产品逻辑，但真正的判断标准还是亲手试用。打开 Flash Resume，用自己的内容体验模板、预览和导出流程，会更直观。',
    faqCtaButton: '打开编辑器',
    faqCtaBack: '返回概览',
    faqHeroAlt: 'Flash Resume 常见问题页主视觉图',
    faqDetailArtAlt: 'Flash Resume 常见问题页详情配图，复用功能页官方视觉风格',
  },
};

/** Get all site translations for a locale */
export function getSiteTranslations(locale: SiteLocale): SiteTranslations {
  return siteTranslations[locale];
}
