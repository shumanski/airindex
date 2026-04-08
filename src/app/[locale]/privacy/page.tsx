import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
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
  const t = await getTranslations({ locale, namespace: 'privacy' });
  return {
    title: `${t('title')} — Air Index Today`,
    description: t('metaDescription'),
    alternates: {
      canonical: `${BASE_URL}/${locale}/privacy`,
      languages: Object.fromEntries(
        [...routing.locales.map((l) => [l, `${BASE_URL}/${l}/privacy`]),
         ['x-default', `${BASE_URL}/en/privacy`]]
      ),
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'privacy' });

  return (
    <main className="max-w-xl mx-auto px-4 pb-8 pt-4 space-y-4 relative z-10">
      <Link href={`/${locale}`} className="text-sm text-[var(--color-accent)] hover:underline">← Air Index Today</Link>

      <article className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm border border-[var(--color-border)] space-y-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
        <h1 className="text-xl font-bold text-[var(--color-text)]">{t('title')}</h1>
        <p className="text-xs text-[var(--color-text-muted)]">{t('lastUpdated')}</p>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('whoWeAre_title')}</h2>
          <p>{t('whoWeAre_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('whatWeCollect_title')}</h2>

          <h3 className="font-semibold mt-2">{t('ipGeo_title')}</h3>
          <p>{t('ipGeo_text')}</p>

          <h3 className="font-semibold mt-2">{t('analytics_title')}</h3>
          <p>{t('analytics_text')}</p>

          <h3 className="font-semibold mt-2">{t('localStorage_title')}</h3>
          <p>{t('localStorage_text')}</p>

          <h3 className="font-semibold mt-2">{t('airQualityApi_title')}</h3>
          <p>{t('airQualityApi_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('whatWeDoNot_title')}</h2>
          <p>{t('whatWeDoNot_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('cookies_title')}</h2>
          <p>{t('cookies_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('thirdParties_title')}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Open-Meteo / CAMS</strong> — {t('thirdParty_openmeteo')}</li>
            <li><strong>Simple Analytics</strong> — {t('thirdParty_sa')}</li>
            <li><strong>IP2Location LITE</strong> — {t('thirdParty_ip2')}</li>
            <li><strong>Cloudflare</strong> — {t('thirdParty_cloudflare')}</li>
          </ul>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('gdpr_title')}</h2>
          <p>{t('gdpr_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('children_title')}</h2>
          <p>{t('children_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('changes_title')}</h2>
          <p>{t('changes_text')}</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-[var(--color-text)] mb-1">{t('contact_title')}</h2>
          <p>
            {t('contact_text')}{' '}
            <a href="https://simplemeteo.com/contact" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text)]">
              simplemeteo.com/contact
            </a>
          </p>
        </section>
      </article>
    </main>
  );
}
