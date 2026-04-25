'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import TopHeader from '@/components/TopHeader';
import { AlertTriangleIcon } from '@/components/Icons';
import { buildCityPath } from '@/lib/city-url';
import { getAqiTextColor } from '@/lib/aqi-utils';
import { countryCodeToFlag } from '@/lib/flag';
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
  const continentName = t(`home.${continentKey}` as never);

  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [theme, setTheme] = useState<Theme>('light');
  const [aqiMode, setAqiMode] = useState<'now' | 'max'>('now');
  const activeAqi = aqiMode === 'max' && cityAqiMax ? cityAqiMax : cityAqiLevels;

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

  const handleDetectLocation = useCallback(async () => {
    try {
      const res = await fetch('/api/geo');
      const data = await res.json();
      if (data.detected && data.city) {
        const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(data.city)}&lang=${locale}`);
        if (geoRes.ok) {
          const results = await geoRes.json();
          if (Array.isArray(results) && results.length > 0) {
            const best = results[0];
            router.push(`/${locale}/${buildCityPath(best.name, best.id)}`);
          }
        }
      }
    } catch { /* silent */ }
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
    <>
    <TopHeader
      tempUnit={tempUnit}
      theme={theme}
      onTempUnitChange={handleTempUnitChange}
      onLocaleChange={handleLocaleChange}
      onThemeChange={handleThemeChange}
      localizedPaths={localizedPaths}
      onSelect={handleLocationSelect}
      onDetectLocation={handleDetectLocation}
    />
    <main className="max-w-2xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-8 pt-4 space-y-6 relative z-10">

      <div className="a-hero">
        <nav className="a-hero-eyeline" aria-label="Breadcrumb">
          <span>
            <Link href={`/${locale}`} prefetch={false} className="hover:underline">airindex.today</Link>
            {' › '}{continentName}
          </span>
        </nav>
        <h1 className="a-hero-h1">{t('city.h1Prefix')} <span className="text-[var(--color-city-name)]">{continentName}</span></h1>
        <p className="a-hero-sub">{t(`home.continentIntro_${continentKey}` as never)}</p>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'airindex.today', item: `https://airindex.today/${locale}` },
              { '@type': 'ListItem', position: 2, name: continentName, item: `https://airindex.today/${locale}/continent/${slug}` },
            ],
          }).replace(/</g, '\\u003c').replace(/>/g, '\\u003e'),
        }}
      />

      <div className="flex items-center gap-2">
        <div className="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden text-xs font-medium">
          <button
            onClick={() => setAqiMode('now')}
            className={`px-2.5 py-1 transition-colors ${aqiMode === 'now' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}
          >{t('aqi.now')}</button>
          <button
            onClick={() => setAqiMode('max')}
            className={`px-2.5 py-1 transition-colors ${aqiMode === 'max' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}
          >{t('aqi.todayMax')}</button>
        </div>
      </div>

      <HomeMap cities={cities.map(c => ({ ...c, name: cityName(c.geoId, c.name) }))} aqiLevels={activeAqi} center={view.center} zoom={view.zoom} fitCities />

      <section className="space-y-2">
        <h2 className="a-section-h">{t('home.browseTitle')}</h2>
        <div className="a-country-grid">
          {Object.entries(byCountry)
            .sort(([a], [b]) => (t(`countries.${a}` as never) || countryNames[a] || a).localeCompare(t(`countries.${b}` as never) || countryNames[b] || b))
            .map(([cc, countryCities]) => {
              const flag = countryCodeToFlag(cc);
              const label = (t(`countries.${cc}` as never) as string) || countryNames[cc] || cc;
              const sortedCities = [...countryCities].sort((a, b) => cityName(a.geoId, a.name).localeCompare(cityName(b.geoId, b.name)));
              return (
                <div key={cc} className="a-country-card">
                  <h3>
                    {flag && <span className="a-flag" aria-hidden="true">{flag}</span>}
                    {COUNTRY_CODE_TO_SLUG[cc] ? (
                      <Link href={`/${locale}/country/${COUNTRY_CODE_TO_SLUG[cc]}`} prefetch={false}>
                        {label} <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>({countryCities.length})</span>
                      </Link>
                    ) : (<>{label} <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>({countryCities.length})</span></>)}
                  </h3>
                  <div className="cities">
                    {sortedCities.slice(0, 12).map((city, i) => {
                      const aqiKey = `${city.lat},${city.lon}`;
                      const aqi = activeAqi[aqiKey];
                      return (
                        <span key={city.geoId}>
                          <Link href={cityLink(city.name, city.geoId)} prefetch={false}>
                            {cityName(city.geoId, city.name)}
                            {aqi != null && (
                              <span className="ml-0.5 text-xs font-medium" style={{ color: getAqiTextColor(aqi) }}>{aqi}</span>
                            )}
                          </Link>
                          {i < Math.min(sortedCities.length, 12) - 1 && (
                            <span className="text-[var(--color-text-muted)]"> · </span>
                          )}
                        </span>
                      );
                    })}
                    {sortedCities.length > 12 && COUNTRY_CODE_TO_SLUG[cc] && (
                      <>
                        <span className="text-[var(--color-text-muted)]"> · </span>
                        <Link href={`/${locale}/country/${COUNTRY_CODE_TO_SLUG[cc]}`} prefetch={false} className="text-[var(--color-primary)] font-semibold">
                          +{sortedCities.length - 12} →
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      <nav className="pt-2 border-t border-[var(--color-border)]">
        <p className="a-section-h mb-2">
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
              {t(`home.${key}` as never)}
            </Link>
          ))}
        </div>
      </nav>

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
    </>
  );
}
