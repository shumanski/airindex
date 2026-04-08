import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import Logo from '@/components/Logo';
import { parseGeoIdFromPath, parseNameFromPath } from '@/lib/city-url';
import { getLocationById } from '@/lib/geocode-api';
import { buildCityPath } from '@/lib/city-url';
import { headers } from 'next/headers';

export default async function NotFound() {
  const t = await getTranslations('notFound');
  const h = await headers();
  const locale = h.get('x-next-intl-locale') || 'en';

  const pathname = h.get('x-invoke-path') || h.get('next-url') || '';
  const segments = pathname.split('/').filter(Boolean);
  const citySegment = segments.find((s) => /^air-quality-index-.+-\d+$/.test(s));
  let cityLink: { href: string; label: string } | null = null;

  if (citySegment) {
    const geoId = parseGeoIdFromPath(citySegment);
    if (geoId) {
      try {
        const city = await getLocationById(geoId, locale);
        if (city) {
          const path = buildCityPath(city.name, city.id);
          cityLink = {
            href: `/${locale}/${path}`,
            label: `${city.name}, ${city.country}`,
          };
        }
      } catch {
        const name = parseNameFromPath(citySegment);
        cityLink = {
          href: `/${locale}/${citySegment}`,
          label: name,
        };
      }
    }
  }

  return (
    <main className="max-w-xl mx-auto px-4 pb-8 pt-16 text-center relative z-10">
      <div className="flex justify-center mb-6">
        <Logo size={48} />
      </div>
      <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">
        {t('heading')}
      </h1>
      <p className="text-[var(--color-text-secondary)] mb-8">
        {t('description')}
      </p>
      <div className="flex flex-col items-center gap-3">
        {cityLink && (
          <Link
            href={cityLink.href}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          >
            🌬️ {cityLink.label}
          </Link>
        )}
        <Link
          href={`/${locale}`}
          className={cityLink
            ? "text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] underline"
            : "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-white font-medium hover:opacity-90 transition-opacity"
          }
        >
          {t('goHome')}
        </Link>
      </div>
    </main>
  );
}
