import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import SiteApp from './SiteApp';
import { getSiteLocale } from './i18n';
import { syncSiteDocumentSeo } from './seo';

type SitePage = 'home' | 'features' | 'templates' | 'faq';

function getPage(): SitePage {
  const page = document.documentElement.dataset.sitePage;
  if (page === 'features' || page === 'templates' || page === 'faq') {
    return page;
  }
  return 'home';
}

// Sync html lang attribute with detected locale
const page = getPage();
const locale = getSiteLocale();
syncSiteDocumentSeo(page, locale);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SiteApp page={page} />
  </StrictMode>,
);
