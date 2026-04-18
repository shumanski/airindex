'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import LocationSearch from '@/components/LocationSearch';
import SettingsMenu from '@/components/SettingsMenu';
import Logo from '@/components/Logo';
import { AlertTriangleIcon } from '@/components/Icons';
import { buildCityPath } from '@/lib/city-url';
import { getAqiTextColor } from '@/lib/aqi-utils';
import { routing } from '@/i18n/routing';
import { loadPreferences, savePreferences, type StoredLocation, type TempUnit, type Theme } from '@/lib/storage';
import type { PopularCity } from '@/lib/popular-cities';

const MapPlaceholder = () => (
  <div>
    <div className="h-[260px] sm:h-[320px] lg:h-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]" />
    <div className="h-5" />
  </div>
);
const HomeMap = dynamic(() => import('@/components/HomeMap'), { ssr: false, loading: MapPlaceholder });

interface OtherCountry {
  code: string;
  name: string;
  slug: string;
}

interface Props {
  countryCode: string;
  countryName: string;
  slug: string;
  cities: PopularCity[];
  cityAqiLevels: Record<string, number>;
  localizedNames: Record<number, string>;
  continentKey: string | null;
  continentSlug: string | null;
  otherCountries: OtherCountry[];
}

export default function CountryPageClient({
  countryCode,
  countryName,
  slug,
  cities,
  cityAqiLevels,
  localizedNames,
  continentKey,
  continentSlug,
  otherCountries,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const prefs = loadPreferences();
    if (prefs.tempUnit) setTempUnit(prefs.tempUnit);
    if (prefs.theme) {
      setTheme(prefs.theme);
      document.documentElement.setAttribute('data-theme', prefs.theme);
    }
  }, []);

  const handleLocationSelect = useCallback((loc: StoredLocation) => {
    if (loc.geoId) {
      const cityPath = buildCityPath(loc.name.split(',')[0].trim(), loc.geoId);
      router.push(`/${locale}/${cityPath}`);
    }
  }, [locale, router]);

  function handleLocaleChange(newLocale: string) {
    savePreferences({ locale: newLocale });
  }

  function handleTempUnitChange() {
    const next = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(next);
    savePreferences({ tempUnit: next });
  }

  function handleThemeChange() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    savePreferences({ theme: next });
  }

  const cityName = (geoId: number, fallback: string) =>
    localizedNames[geoId] || fallback;

  const cityLink = (name: string, geoId: number) =>
    `/${locale}/${buildCityPath(cityName(geoId, name), geoId)}`;

  const localizedPaths: Record<string, string> = {};
  for (const loc of routing.locales) {
    localizedPaths[loc] = `/${loc}/country/${slug}`;
  }

  const continentName = continentKey ? t(`home.${continentKey}` as any) : null;
  const translatedCountryName = t(`countries.${countryCode}` as any) || countryName;

  return (
    <main className="max-w-2xl lg:max-w-5xl mx-auto px-4 pb-8 pt-4 space-y-6 relative z-10">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
          <Link href={`/${locale}`} aria-label="Air Index Today home" className="flex items-center">
            <span className="relative z-[-1]"><Logo size={34} /></span>
          </Link>
          <span>Air Quality {translatedCountryName}</span>
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={handleTempUnitChange}
            className="text-sm font-medium px-2 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
          >°{tempUnit}</button>
          <SettingsMenu
            currentLocale={locale}
            theme={theme}
            onLocaleChange={handleLocaleChange}
            onThemeChange={handleThemeChange}
            localizedPaths={localizedPaths}
          />
        </div>
      </header>

      <LocationSearch location={null} onSelect={handleLocationSelect} />

      {/* Breadcrumb */}
      {continentSlug && continentName && (() => {
        const base = 'https://airindex.today';
        return (
          <>
            <nav className="text-xs text-[var(--color-text-muted)]">
              <Link href={`/${locale}`} className="hover:underline">airindex.today</Link>
              {' › '}
              <Link href={`/${locale}/continent/${continentSlug}`} className="hover:underline">{continentName}</Link>
              {' › '}
              <span className="text-[var(--color-text-secondary)]">{translatedCountryName}</span>
            </nav>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'airindex.today', item: `${base}/${locale}` },
                { '@type': 'ListItem', position: 2, name: continentName, item: `${base}/${locale}/continent/${continentSlug}` },
                { '@type': 'ListItem', position: 3, name: translatedCountryName },
              ],
            }) }} />
          </>
        );
      })()}

      <HomeMap cities={cities.map(c => ({ ...c, name: cityName(c.geoId, c.name) }))} aqiLevels={cityAqiLevels} fitCities />

      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">
          {translatedCountryName}
        </h2>
        <div className="flex flex-wrap gap-x-1 gap-y-0.5">
          {[...cities].sort((a, b) => cityName(a.geoId, a.name).localeCompare(cityName(b.geoId, b.name))).map((city, i) => {
            const aqiKey = `${city.lat},${city.lon}`;
            const aqi = cityAqiLevels[aqiKey];
            return (
              <span key={city.geoId}>
                <Link
                  href={cityLink(city.name, city.geoId)}
                  prefetch={false}
                  className="text-sm text-[var(--color-accent)] hover:underline"
                >
                  {cityName(city.geoId, city.name)}
                  {aqi != null && (
                    <span
                      className="ml-0.5 text-xs font-medium"
                      style={{ color: getAqiTextColor(aqi) }}
                    >
                      {aqi}
                    </span>
                  )}
                </Link>
                {i < cities.length - 1 && (
                  <span className="text-[var(--color-text-muted)]"> · </span>
                )}
              </span>
            );
          })}
        </div>
      </section>

      {/* Other countries in the same continent */}
      {otherCountries.length > 0 && (
        <nav className="pt-2 border-t border-[var(--color-border)]">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">
            {continentName}
          </p>
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            {[...otherCountries].sort((a, b) => (t(`countries.${a.code}` as any) || a.name).localeCompare(t(`countries.${b.code}` as any) || b.name)).map((c) => (
              <Link
                key={c.code}
                href={`/${locale}/country/${c.slug}`}
                prefetch={false}
                className="text-sm text-[var(--color-accent)] hover:underline"
              >
                {t(`countries.${c.code}` as any) || c.name}
              </Link>
            ))}
          </div>
        </nav>
      )}

      <footer className="text-sm text-[var(--color-text-muted)] space-y-3 pt-4 border-t border-[var(--color-border)]">
        <div className="text-center text-sm space-y-1">
          <p>
            {t('sources.aqiData')}{' '}
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text-secondary)]">
              Open-Meteo.com
            </a>
            {' '}(CAMS/Copernicus)
          </p>
        </div>
        <div className="space-y-2 text-sm leading-relaxed border-t border-[var(--color-border)] pt-3">
          <div className="flex items-center justify-center gap-1.5 font-medium text-[var(--color-text-secondary)]">
            <AlertTriangleIcon size={13} />
            {t('disclaimer.heading')}
          </div>
          <p>{t('disclaimer.general')}</p>
          <p>{t('disclaimer.accuracy')}</p>
        </div>
        <div className="text-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3 space-y-2">
          <div className="flex justify-center gap-3">
            <Link href={`/${locale}/about`} prefetch={false} className="hover:underline hover:text-[var(--color-text-secondary)]">{t('footer.about')}</Link>
            <span>·</span>
            <Link href={`/${locale}/privacy`} prefetch={false} className="hover:underline hover:text-[var(--color-text-secondary)]">{t('footer.privacy')}</Link>
            <span>·</span>
            <a href="https://simplemeteo.com/contact" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--color-text-secondary)]">{t('footer.contact')}</a>
          </div>
          <div>© {new Date().getFullYear()} airindex.today — a{' '}
          <a href="https://simplemeteo.com" target="_blank" rel="noopener" className="underline hover:text-[var(--color-text-secondary)]">
            SimpleMeteo
          </a>{' '}
          project</div>
        </div>
      </footer>
    </main>
  );
}
