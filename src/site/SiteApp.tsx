import { useState, type CSSProperties, type ReactNode } from 'react';
import officialHomeHero from './assets/official-home-hero-v3.webp';
import officialHomeDetail from './assets/official-home-hero-v1.webp';
import officialFeaturesBanner from './assets/official-features-banner-v3.webp';
import officialFeaturesDetail from './assets/official-features-banner-v1.webp';
import officialFaqDetail from './assets/official-faq-banner-v1.webp';
import officialTemplatesBg from './assets/official-templates-bg-v3.webp';
import officialTemplatesDetail from './assets/official-templates-bg-v1.webp';
import '../index.css';
import './site.css';
import { getSiteLocale, getSiteTranslations, type SiteLocale, type SiteTranslations } from './i18n';

type SitePage = 'home' | 'features' | 'templates' | 'faq';

const base = import.meta.env.BASE_URL;
const editorUrl = `${base}`;
const siteRoot = `${base}official/`;

const detailImageConfig: Record<'workflow' | 'preview' | 'templates' | 'faq', {
  src: string;
  mobilePosition: string;
  desktopPosition: string;
}> = {
  workflow: {
    src: officialHomeDetail,
    mobilePosition: '70% 50%',
    desktopPosition: '50% 50%',
  },
  preview: {
    src: officialFeaturesDetail,
    mobilePosition: '66% 50%',
    desktopPosition: '50% 50%',
  },
  templates: {
    src: officialTemplatesDetail,
    mobilePosition: '52% 50%',
    desktopPosition: '50% 50%',
  },
  faq: {
    src: officialFaqDetail,
    mobilePosition: '66% 50%',
    desktopPosition: '56% 50%',
  },
};

const heroImageConfig: Record<SitePage, {
  src: string;
  mobilePosition: string;
  desktopPosition: string;
}> = {
  home: {
    src: officialHomeHero,
    mobilePosition: '74% 50%',
    desktopPosition: '50% 50%',
  },
  features: {
    src: officialFeaturesBanner,
    mobilePosition: '70% 50%',
    desktopPosition: '50% 50%',
  },
  templates: {
    src: officialTemplatesBg,
    mobilePosition: '58% 50%',
    desktopPosition: '50% 50%',
  },
  faq: {
    src: officialFaqDetail,
    mobilePosition: '68% 50%',
    desktopPosition: '58% 50%',
  },
};

function SectionHeader({
  eyebrow,
  title,
  body,
  inverse = false,
}: {
  eyebrow: string;
  title: string;
  body: string;
  inverse?: boolean;
}) {
  const showEyebrow = eyebrow.trim() !== '' && eyebrow !== title;

  return (
    <div className="max-w-3xl">
      {showEyebrow && (
        <p className={`text-xs font-semibold uppercase tracking-[0.12em] ${inverse ? 'text-blue-300' : 'text-blue-600'}`}>{eyebrow}</p>
      )}
      <h2 className={`mt-2 text-2xl font-semibold sm:text-3xl ${inverse ? 'text-white' : 'text-slate-950'}`}>{title}</h2>
      <p className={`mt-3 text-sm leading-7 sm:text-base ${inverse ? 'text-slate-300' : 'text-slate-600'}`}>{body}</p>
    </div>
  );
}

function DetailImage({
  variant,
  alt,
  inverse = false,
}: {
  variant: 'workflow' | 'preview' | 'templates' | 'faq';
  alt: string;
  inverse?: boolean;
}) {
  const config = detailImageConfig[variant];
  const imageStyle = {
    '--site-detail-mobile-position': config.mobilePosition,
    '--site-detail-desktop-position': config.desktopPosition,
  } as CSSProperties;

  return (
    <div className={`site-frame-shadow overflow-hidden rounded-[28px] border ${
      inverse ? 'border-white/10 bg-slate-900/30' : 'border-white/70 bg-white'
    }`}
    >
      <img
        src={config.src}
        alt={alt}
        loading="lazy"
        style={imageStyle}
        className="site-detail-image block h-full min-h-[320px] w-full object-cover sm:min-h-[380px]"
      />
    </div>
  );
}

function HomeSections({ t }: { t: SiteTranslations }) {
  return (
    <>
      <section className="px-6 py-18 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={t.homeWhyTitle}
            title={t.homeWhyTitle}
            body={t.homeWhyBody}
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {t.stats.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-white px-5 py-6">
                <div className="text-3xl font-semibold text-slate-950">{item.value}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-6 py-18 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={t.homeFlowTitle}
              title={t.homeFlowTitle}
              body={t.homeFlowBody}
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {t.homeFeatureCards.map((card) => (
                <div key={card.title} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4">
                  <h3 className="text-sm font-semibold text-slate-950">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
          <DetailImage variant="workflow" alt={t.homeDetailArtAlt} />
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-18 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={t.homeAudienceTitle}
            title={t.homeAudienceTitle}
            body={t.homeAudienceBody}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {t.homeAudienceCards.map((card) => (
              <div key={card.title} className="rounded-lg border border-slate-200 bg-white px-5 py-5">
                <h3 className="text-base font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-18 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <DetailImage variant="templates" alt={t.templatesDetailArtAlt} />
          <div>
            <SectionHeader
              eyebrow={t.homeVisualTitle}
              title={t.homeVisualTitle}
              body={t.homeVisualBody}
            />
            <div className="mt-8 space-y-4">
              {t.homeVisualBullets.map((item) => (
                <div key={item} className="flex gap-3">
                  <div className="mt-2 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <p className="text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FeaturesSections({ t }: { t: SiteTranslations }) {
  return (
    <>
      <section className="px-6 py-18 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={t.featuresSetTitle}
            title={t.featuresSetTitle}
            body={t.featuresSetBody}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {t.featureGroups.map((item) => (
              <div key={item.title} className="rounded-lg border border-slate-200 bg-white px-5 py-5">
                <h3 className="text-base font-semibold text-slate-950">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-950 px-6 py-18 text-white sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={t.previewTitle}
              title={t.previewTitle}
              body={t.previewBody}
              inverse
            />
            <div className="mt-8 space-y-3 text-sm leading-7 text-slate-300">
              {t.previewBullets.map((bullet) => (
                <p key={bullet}>{bullet}</p>
              ))}
            </div>
          </div>
          <DetailImage variant="preview" alt={t.featuresDetailArtAlt} inverse />
        </div>
      </section>

      <section className="bg-white px-6 py-18 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={t.featuresWorkflowTitle}
            title={t.featuresWorkflowTitle}
            body={t.featuresWorkflowBody}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {t.featuresWorkflowSteps.map((step) => (
              <div key={step.title} className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-5">
                <h3 className="text-sm font-semibold text-slate-950">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function TemplatesSections({ t }: { t: SiteTranslations }) {
  return (
    <>
      <section className="px-6 py-18 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={t.templateSystemTitle}
              title={t.templateSystemTitle}
              body={t.templateSystemBody}
            />
            <div className="mt-8 space-y-4">
              {t.templateCategories.map((cat) => (
                <div key={cat.title} className="rounded-lg border border-slate-200 bg-white px-5 py-4">
                  <h3 className="text-sm font-semibold text-slate-950">{cat.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{cat.body}</p>
                </div>
              ))}
            </div>
          </div>
          <DetailImage variant="templates" alt={t.templatesDetailArtAlt} />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white px-6 py-18 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={t.designTitle}
            title={t.designTitle}
            body={t.designBody}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {t.designCards.map((card) => (
              <div key={card.title} className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-5">
                <h3 className="text-sm font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 px-6 py-18 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            eyebrow={t.templatesGuideTitle}
            title={t.templatesGuideTitle}
            body={t.templatesGuideBody}
          />
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {t.templatesGuideCards.map((card) => (
              <div key={card.title} className="rounded-lg border border-slate-200 bg-white px-5 py-5">
                <h3 className="text-sm font-semibold text-slate-950">{card.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function FaqSections({ t, locale }: { t: SiteTranslations; locale: SiteLocale }) {
  return (
    <>
      <section className="px-6 py-18 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <SectionHeader
            eyebrow={t.faqTitle}
            title={t.faqTitle}
            body={t.faqBody}
          />
          <div className="mt-10 space-y-3">
            {t.faqs.map((faq) => (
              <details key={faq.question} className="rounded-lg border border-slate-200 bg-white px-5 py-4">
                <summary className="cursor-pointer list-none text-base font-semibold text-slate-950">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50 px-6 py-18 sm:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <SectionHeader
              eyebrow={t.faqCtaTitle}
              title={t.faqCtaTitle}
              body={t.faqCtaBody}
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={editorUrl}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                {t.faqCtaButton}
              </a>
              <a
                href={`${siteRoot}${locale === 'zh' ? 'zh/' : ''}`}
                className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-white"
              >
                {t.faqCtaBack}
              </a>
            </div>
          </div>
          <DetailImage variant="faq" alt={t.faqDetailArtAlt} />
        </div>
      </section>
    </>
  );
}

function Hero({ page, currentPage, t, locale }: { page: SitePage; currentPage: SitePage; t: SiteTranslations; locale: SiteLocale }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pageCopy = t.pages[page];
  const ctaSecondaryHrefs: Record<SitePage, string> = {
    home: `${siteRoot}${locale === 'zh' ? 'zh/' : ''}features/`,
    features: `${siteRoot}${locale === 'zh' ? 'zh/' : ''}templates/`,
    templates: `${siteRoot}${locale === 'zh' ? 'zh/' : ''}faq/`,
    faq: `${siteRoot}${locale === 'zh' ? 'zh/' : ''}`,
  };
  const localeSwitchHref = `${siteRoot}${locale === 'zh' ? '' : 'zh/'}${page === 'home' ? '' : `${page}/`}`;
  const localeSwitchLabel = locale === 'zh' ? 'EN' : '中文';
  const localeSwitchLang = locale === 'zh' ? 'en' : 'zh-CN';
  const heroImage = heroImageConfig[page];
  const heroStyle = {
    backgroundImage: `url(${heroImage.src})`,
    '--site-hero-mobile-position': heroImage.mobilePosition,
    '--site-hero-desktop-position': heroImage.desktopPosition,
  } as CSSProperties;

  return (
    <section className="relative min-h-[72vh] overflow-hidden border-b border-slate-200 sm:min-h-[78vh]">
      <div
        className="site-hero-bg absolute inset-0 bg-cover"
        style={heroStyle}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-slate-950/56" aria-hidden="true" />
      <div className="site-frost absolute inset-x-4 top-4 z-30 rounded-2xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-white sm:left-10 sm:right-10 sm:top-6 sm:rounded-lg sm:px-6 sm:py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <a href={`${siteRoot}${locale === 'zh' ? 'zh/' : ''}`} className="text-[13px] font-semibold tracking-[0.08em] text-white sm:text-sm">
            Flash Resume
          </a>
          <nav className="hidden items-center gap-2 text-sm sm:flex">
            {t.navItems.map((item) => (
              <a
                key={item.key}
                href={`${base}${item.href}`}
                className={item.key === currentPage
                  ? 'rounded-full border border-white/20 bg-white/16 px-3 py-1.5 text-white'
                  : 'rounded-full px-3 py-1.5 text-white/78 hover:text-white'}
                aria-current={item.key === currentPage ? 'page' : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 sm:flex">
            <a
              href={localeSwitchHref}
              lang={localeSwitchLang}
              hrefLang={localeSwitchLang}
              className="rounded-lg border border-white/24 bg-white/8 px-3 py-2 text-xs font-semibold tracking-[0.08em] text-white/88 hover:bg-white/14"
            >
              {localeSwitchLabel}
            </a>
            <a
              href={editorUrl}
              className="rounded-lg border border-white/30 bg-white/14 px-4 py-2 text-sm font-medium text-white hover:bg-white/20"
            >
              {t.launchEditor}
            </a>
          </div>
          <div className="flex items-center gap-2 sm:hidden">
            <a
              href={localeSwitchHref}
              lang={localeSwitchLang}
              hrefLang={localeSwitchLang}
              className="rounded-lg border border-white/24 bg-white/8 px-3 py-2 text-[11px] font-semibold tracking-[0.08em] text-white/88 hover:bg-white/14"
            >
              {localeSwitchLabel}
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/24 bg-white/8 text-white/88 hover:bg-white/14"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileMenuOpen ? (
                  <path d="M6 6 18 18M18 6 6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="absolute inset-x-0 top-full z-50 mt-3 px-2 pb-2 sm:hidden">
            <div className="mx-auto max-w-6xl rounded-2xl border border-white/16 bg-slate-950/92 p-3 shadow-[0_30px_80px_rgba(2,6,23,0.48)] backdrop-blur-xl">
              <nav className="space-y-2">
              {t.navItems.map((item) => (
                <a
                  key={item.key}
                  href={`${base}${item.href}`}
                  className={item.key === currentPage
                    ? 'block rounded-lg border border-white/20 bg-white/16 px-4 py-3 text-sm font-medium text-white'
                    : 'block rounded-lg px-4 py-3 text-sm text-white/82 hover:bg-white/10 hover:text-white'}
                  aria-current={item.key === currentPage ? 'page' : undefined}
                >
                  {item.label}
                </a>
              ))}
              </nav>
              <a
                href={editorUrl}
                className="mt-3 block rounded-lg bg-white px-4 py-3 text-center text-sm font-medium text-slate-900 hover:bg-slate-100"
              >
                {t.launchEditor}
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="relative z-10 flex min-h-[72vh] items-center px-5 pb-14 pt-28 sm:min-h-[78vh] sm:px-10 sm:pb-20 sm:pt-32">
        <div className="mx-auto flex max-w-6xl flex-col justify-end">
          <div className="site-hero-copy max-w-3xl text-white">
            <h1 className="text-[2rem] font-semibold leading-tight sm:text-5xl lg:text-6xl">
              {pageCopy.title}
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-6 text-white/86 sm:mt-5 sm:text-lg sm:leading-7">
              {pageCopy.subtitle}
            </p>
            <div className="mt-7 flex flex-col gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:gap-3">
              <a
                href={editorUrl}
                className="w-full rounded-lg bg-white px-5 py-3 text-center text-sm font-medium text-slate-900 hover:bg-slate-100 sm:w-auto"
              >
                {pageCopy.ctaPrimary}
              </a>
              <a
                href={ctaSecondaryHrefs[page]}
                className="w-full rounded-lg border border-white/30 bg-white/10 px-5 py-3 text-center text-sm font-medium text-white hover:bg-white/18 sm:w-auto"
              >
                {pageCopy.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </div>
      <img src={heroImage.src} alt={pageCopy.heroAlt} className="sr-only" />
    </section>
  );
}

function Footer({ t }: { t: SiteTranslations }) {
  return (
    <footer className="border-t border-slate-200 bg-white px-6 py-8 sm:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{t.footerText}</p>
        <div className="flex flex-wrap gap-4">
          {t.footerLinks.map((link) => (
            <a key={link.key} href={`${base}${link.href}`} className="hover:text-slate-900">{link.label}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default function SiteApp({ page }: { page: SitePage }) {
  const locale = getSiteLocale();
  const t = getSiteTranslations(locale);

  const sections: Record<SitePage, ReactNode> = {
    home: <HomeSections t={t} />,
    features: <FeaturesSections t={t} />,
    templates: <TemplatesSections t={t} />,
    faq: <FaqSections t={t} locale={locale} />,
  };

  return (
    <div className="site-shell min-h-screen">
      <Hero page={page} currentPage={page} t={t} locale={locale} />
      <main>{sections[page]}</main>
      <Footer t={t} />
    </div>
  );
}
