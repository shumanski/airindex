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
import { CONTINENT_SLUGS, COUNTRY_CODE_TO_SLUG } from '@/lib/popular-cities';
import type { PopularCity } from '@/lib/popular-cities';

const MapPlaceholder = () => (
  <div>
    <div className="h-[260px] sm:h-[320px] lg:h-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]" />
    <div className="h-5" />
  </div>
);
const HomeMap = dynamic(() => import('@/components/HomeMap'), { ssr: false, loading: MapPlaceholder });
const SeoContent = dynamic(() => import('@/components/SeoContent'));

interface Props {
  continentKey: string;
  slug: string;
  cities: PopularCity[];
  cityAqiLevels: Record<string, number>;
  cityAqiMax?: Record<string, number>;
  localizedNames: Record<number, string>;
  byCountry: Record<string, PopularCity[]>;
  countryNames: Record<string, string>;
  view: { center: [number, number]; zoom: number };
}

export default function ContinentPageClient({
  continentKey,
  slug,
  cities,
  cityAqiLevels,
  cityAqiMax,
  localizedNames,
  byCountry,
  countryNames,
  view,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const continentName = t(`home.${continentKey}` as any);
  const [aqiMode, setAqiMode] = useState<'now' | 'max'>('now');
  const activeAqi = aqiMode === 'max' && cityAqiMax ? cityAqiMax : cityAqiLevels;

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
    localizedPaths[loc] = `/${loc}/continent/${slug}`;
  }

  const otherContinents = Object.entries(CONTINENT_SLUGS).filter(
    ([s]) => s !== slug,
  );

  return (
    <main className="max-w-2xl lg:max-w-5xl mx-auto px-4 pb-8 pt-4 space-y-6 relative z-10">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
          <Link href={`/${locale}`} aria-label="Air Index Today home" className="flex items-center">
            <span className="relative z-[-1]"><Logo size={34} /></span>
          </Link>
          <span>Air Quality {continentName}</span>
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

      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
        {t(`home.continentIntro_${continentKey}` as any)}
      </p>

      <div className="flex gap-1">
          <button
            onClick={() => setAqiMode('now')}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
              aqiMode === 'now'
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
            }`}
          >
            {t('aqi.now')}
          </button>
          <button
            onClick={() => setAqiMode('max')}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
              aqiMode === 'max'
                ? 'bg-[var(--color-accent)] text-white border-[var(--color-accent)]'
                : 'border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'
            }`}
          >
            {t('aqi.todayMax')}
          </button>
        </div>

      <HomeMap cities={cities.map(c => ({ ...c, name: cityName(c.geoId, c.name) }))} aqiLevels={activeAqi} center={view.center} zoom={view.zoom} fitCities />

      <section className="space-y-4">
        {Object.entries(byCountry)
          .sort(([a], [b]) => (t(`countries.${a}` as any) || countryNames[a] || a).localeCompare(t(`countries.${b}` as any) || countryNames[b] || b))
          .map(([cc, countryCities]) => (
          <div key={cc}>
            <h2 className="text-sm font-semibold text-[var(--color-text)] mb-1">
              {COUNTRY_CODE_TO_SLUG[cc] ? (
                <Link
                  href={`/${locale}/country/${COUNTRY_CODE_TO_SLUG[cc]}`}
                  prefetch={false}
                  className="text-[var(--color-accent)] hover:underline"
                >
                  {t(`countries.${cc}` as any) || countryNames[cc] || cc} →
                </Link>
              ) : (
                t(`countries.${cc}` as any) || countryNames[cc] || cc
              )}
            </h2>
            <div className="flex flex-wrap gap-x-1 gap-y-0.5">
              {[...countryCities].sort((a, b) => cityName(a.geoId, a.name).localeCompare(cityName(b.geoId, b.name))).map((city, i) => {
                const aqiKey = `${city.lat},${city.lon}`;
                const aqi = activeAqi[aqiKey];
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
                    {i < countryCities.length - 1 && (
                      <span className="text-[var(--color-text-muted)]"> · </span>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <nav className="pt-2 border-t border-[var(--color-border)]">
        <p className="text-xs font-semibold text-[var(--color-text-muted)] mb-1">
          {t('home.citiesTitle')}
        </p>
        <div className="flex flex-wrap gap-x-2 gap-y-1">
          {otherContinents.map(([s, key]) => (
            <Link
              key={s}
              href={`/${locale}/continent/${s}`}
              prefetch={false}
              className="text-sm text-[var(--color-accent)] hover:underline"
            >
              {t(`home.${key}` as any)}
            </Link>
          ))}
        </div>
      </nav>

      <SeoContent />

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
