import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Clouds from '@/components/Clouds';
import FeedbackWidget from '@/components/FeedbackWidget';
import '../globals.css';

const BASE_URL = process.env.SITE_URL || 'https://airindex.today';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const title = t('title');
  const description = t('description');
  const url = `${BASE_URL}/${locale}`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${BASE_URL}/${loc}`;
  }
  languages['x-default'] = `${BASE_URL}/en`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Air Index Today',
      locale,
      type: 'website',
      images: [{
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Air Index Today',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var p=JSON.parse(localStorage.getItem('airindex-prefs')||'null');if(p&&p.theme==='dark')document.documentElement.setAttribute('data-theme','dark')}catch(e){}})()`+`;if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}` }} />
        <style dangerouslySetInnerHTML={{ __html: 'html{background:#d4e2f4}html[data-theme="dark"]{background:#08101e}' }} />
        <meta name="theme-color" content="#d4e2f4" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#08101e" media="(prefers-color-scheme: dark)" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta property="og:logo" content={`${BASE_URL}/icon-512.png`} />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon-96.png" type="image/png" sizes="96x96" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="preload" href="/fonts/TwemojiCountryFlags.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://scripts.simpleanalyticscdn.com" />
        <link rel="preconnect" href="https://scripts.simpleanalyticscdn.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://queue.simpleanalyticscdn.com" crossOrigin="anonymous" />
        <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Organization',
                  '@id': `${BASE_URL}/#org`,
                  name: 'SimpleMeteo',
                  url: 'https://simplemeteo.com',
                  logo: 'https://simplemeteo.com/favicon.svg',
                  description: 'SimpleMeteo builds free environmental weather apps — UV index tracking, pollen forecasting, and air quality monitoring — powered by open atmospheric data.',
                  contactPoint: {
                    '@type': 'ContactPoint',
                    email: 'hello@simplemeteo.com',
                    contactType: 'customer support',
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': `${BASE_URL}/#website`,
                  url: BASE_URL,
                  name: 'Air Index Today',
                  publisher: { '@id': `${BASE_URL}/#org` },
                },
                {
                  '@type': 'WebApplication',
                  '@id': `${BASE_URL}/#app`,
                  name: 'Air Index Today',
                  url: BASE_URL,
                  applicationCategory: 'HealthApplication',
                  operatingSystem: 'Web',
                  offers: {
                    '@type': 'Offer',
                    price: '0',
                    priceCurrency: 'USD',
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-dvh">
        <Clouds />
        <div className="relative" style={{ zIndex: 'auto' }}>
          <NextIntlClientProvider messages={messages}>
            {children}
            <FeedbackWidget />
          </NextIntlClientProvider>
        </div>
        <noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="Analytics" referrerPolicy="no-referrer-when-downgrade" /></noscript>
      </body>
    </html>
  );
}
