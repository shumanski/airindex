'use client';

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import LocationSearch from '@/components/LocationSearch';
import SettingsMenu from '@/components/SettingsMenu';
import Link from 'next/link';
import Logo from '@/components/Logo';
import AqiPageContent from '@/components/AqiPageContent';
import { type StoredLocation } from '@/lib/storage';
import { buildCityPath } from '@/lib/city-url';
import { getAqiCategory, getAqiTextColor } from '@/lib/aqi-utils';
import { pickClosest } from '@/lib/geocode-api';
import { useAqiPage } from '@/lib/useAqiPage';
import type { AqiData } from '@/lib/aqi-api';
import type { NearbyCityResult } from '@/lib/geocode-api';

export interface CityData {
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  population?: number;
  elevation?: number;
}

export interface Breadcrumb {
  continentKey: string;
  continentSlug: string;
  countryCode: string;
  countrySlug: string;
}

interface Props {
  initialLocation: StoredLocation | null;
  fallbackName: string;
  initialAqiData?: AqiData | null;
  localizedPaths?: Record<string, string>;
  nearbyCities?: NearbyCityResult[];
  nearbyAqiCurrent?: Record<string, number>;
  nearbyAqiMax?: Record<string, number>;
  cityData?: CityData;
  breadcrumb?: Breadcrumb | null;
}

export default function CityPageClient({ initialLocation, fallbackName, initialAqiData, localizedPaths, nearbyCities, nearbyAqiCurrent, nearbyAqiMax, cityData, breadcrumb }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const {
    location, aqiData, loading, tempUnit, theme,
    handleLocationChange,
    handleLocaleChange, handleTempUnitChange, handleThemeChange,
  } = useAqiPage({ initialLocation, initialAqiData });

  const handleDetectLocation = useCallback(async () => {
    try {
      const res = await fetch('/api/geo');
      const data = await res.json();
      if (data.detected && data.city) {
        const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(data.city)}&lang=${locale}`);
        if (geoRes.ok) {
          const results = await geoRes.json();
          if (Array.isArray(results) && results.length > 0) {
            const best = pickClosest(results, data.lat, data.lon);
            router.push(`/${locale}/${buildCityPath(best.name, best.id)}`);
          }
        }
      }
    } catch {
      // Detection failed silently
    }
  }, [locale, router]);

  const cityDisplayName = location
    ? location.name.split(',')[0]
    : fallbackName;

  const countryDisplay = location?.name.includes(',')
    ? location.name.split(',').slice(1).join(',').trim()
    : '';

  return (
    <>
    <main className="max-w-xl lg:max-w-5xl mx-auto px-4 pb-8 pt-4 space-y-4 relative z-10">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
          <Link href="/" aria-label="Air Index Today home" className="flex items-center"><span className="relative z-[-1]"><Logo size={34} /></span></Link>
          <span>{t('city.h1Prefix')}{' '}<span className="text-[var(--color-city-name)]">{cityDisplayName}</span></span>
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

      {breadcrumb && (() => {
        const continentLabel = t(`home.${breadcrumb.continentKey}` as any);
        const countryLabel = t(`countries.${breadcrumb.countryCode}` as any);
        const base = 'https://airindex.today';
        return (
          <>
            <nav aria-label="Breadcrumb" className="text-xs text-[var(--color-text-muted)] -mt-2">
              <Link href={`/${locale}`} className="hover:underline">airindex.today</Link>
              {' › '}
              <Link href={`/${locale}/continent/${breadcrumb.continentSlug}`} className="hover:underline">{continentLabel}</Link>
              {' › '}
              <Link href={`/${locale}/country/${breadcrumb.countrySlug}`} className="hover:underline">{countryLabel}</Link>
              {' › '}
              <span className="text-[var(--color-text-secondary)]">{cityDisplayName}</span>
            </nav>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  '@context': 'https://schema.org',
                  '@type': 'BreadcrumbList',
                  itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'airindex.today', item: `${base}/${locale}` },
                    { '@type': 'ListItem', position: 2, name: continentLabel, item: `${base}/${locale}/continent/${breadcrumb.continentSlug}` },
                    { '@type': 'ListItem', position: 3, name: countryLabel, item: `${base}/${locale}/country/${breadcrumb.countrySlug}` },
                    { '@type': 'ListItem', position: 4, name: cityDisplayName },
                  ],
                }).replace(/</g, '\\u003c').replace(/>/g, '\\u003e'),
              }}
            />
          </>
        );
      })()}

      {aqiData && (() => {
        const aqiRounded = Math.round(aqiData.currentAqi);
        const peakAqi = Math.round(aqiData.todayPeak.aqi);
        const tomorrowAqi = Math.round(aqiData.tomorrowPeak.aqi);
        return (
          <div className="text-sm leading-relaxed -mt-2 space-y-0.5">
            <p className="text-[var(--color-text-muted)]">
              {t('city.summaryDesc', { city: cityDisplayName, country: countryDisplay })}
            </p>
            <p className="text-[var(--color-text-secondary)]">
              {aqiData.currentAqi > 0 && (
                <>
                  {t('city.summaryNow')}{' '}
                  <span className="font-medium" style={{ color: getAqiTextColor(aqiRounded) }}>
                    AQI {aqiRounded} ({t(`aqi.${getAqiCategory(aqiRounded)}`)})
                  </span>
                  {' · '}
                </>
              )}
              {t('city.summaryPeak')}{' '}
              <span className="font-medium" style={{ color: getAqiTextColor(peakAqi) }}>
                AQI {peakAqi}
              </span>
              {' '}{t('aqi.at')} {aqiData.todayPeak.hour}
            </p>
            <p className="text-[var(--color-text-secondary)]">
              {t('aqi.tomorrow')}{': '}
              <span className="font-medium" style={{ color: getAqiTextColor(tomorrowAqi) }}>
                AQI {tomorrowAqi}
              </span>
              {' '}{t('aqi.at')} {aqiData.tomorrowPeak.hour}
            </p>
          </div>
        );
      })()}

      <LocationSearch location={location} onSelect={handleLocationChange} onDetectLocation={handleDetectLocation} tempUnit={tempUnit} weather={aqiData ? { weatherCode: aqiData.currentWeatherCode, temperature: aqiData.currentTemp } : undefined} />

      <AqiPageContent
        aqiData={aqiData}
        loading={loading}
        tempUnit={tempUnit}
        cityName={cityDisplayName}
        geoId={location?.geoId}
        nearbyCities={nearbyCities}
        nearbyAqiCurrent={nearbyAqiCurrent}
        nearbyAqiMax={nearbyAqiMax}
        cityData={cityData}
        showFeedback
      />
    </main>
    </>
  );
}
