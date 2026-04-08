import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import Logo from '@/components/Logo';
import Link from 'next/link';

const BASE_URL = process.env.SITE_URL || 'https://airindex.today';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: `${t('title')} — Air Index Today`,
    description: t('metaDescription'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/about`,
      languages: Object.fromEntries(
        [...routing.locales.map((l) => [l, `${BASE_URL}/${l}/about`]),
         ['x-default', `${BASE_URL}/en/about`]]
      ),
    },
    robots: { index: true, follow: true },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });

  return (
    <main className="max-w-xl mx-auto px-4 pb-8 pt-4 space-y-4 relative z-10">
      <Link href={`/${locale}`} className="text-sm text-[var(--color-accent)] hover:underline">← Air Index Today</Link>

      <article className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm border border-[var(--color-border)] space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <h1 className="text-xl font-bold text-[var(--color-text)]">{t('title')}</h1>
        </div>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('whatIs_title')}</h2>
          <p>{t('whatIs_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('dataSources_title')}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>CAMS (Copernicus)</strong> — {t('dataSources_cams')}{' '}
              <a href="https://air-quality-api.open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text)]">Open-Meteo</a>
            </li>
            <li>
              <strong>US EPA / AirNow</strong> — {t('dataSources_epa')}
            </li>
            <li>
              <strong>Yr/NRK</strong> — Weather symbols{' '}
              <a href="https://github.com/nrkno/yr-weather-symbols" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text)]">
                © Yr/NRK
              </a>,{' '}
              <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text)]">
                CC BY 4.0
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('howItWorks_title')}</h2>
          <p>{t('howItWorks_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('free_title')}</h2>
          <p>{t('free_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('contact_title')}</h2>
          <p>
            {t('contact_text')}{' '}
            <a href="https://simplemeteo.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text)]">
              SimpleMeteo
            </a>.{' '}
            <a href="https://simplemeteo.com/contact" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text)]">
              {t('contact_link')}
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
