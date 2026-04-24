'use client';

import { useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import TopHeader from '@/components/TopHeader';
import AqiPageContent from '@/components/AqiPageContent';
import ModelDataNotice from '@/components/ModelDataNotice';
import { type StoredLocation } from '@/lib/storage';
import { buildCityPath } from '@/lib/city-url';
import { getAqiCategory, getAqiTextColor } from '@/lib/aqi-utils';
import { countryCodeToFlag } from '@/lib/flag';
import { getWeatherIcon } from '@/lib/weather-icons';
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
    <TopHeader
      tempUnit={tempUnit}
      theme={theme}
      onTempUnitChange={handleTempUnitChange}
      onLocaleChange={handleLocaleChange}
      onThemeChange={handleThemeChange}
      localizedPaths={localizedPaths || {}}
      onSelect={handleLocationChange}
      onDetectLocation={handleDetectLocation}
    />
    <main className="max-w-xl lg:max-w-6xl xl:max-w-7xl mx-auto px-4 pb-8 pt-4 space-y-4 relative z-10">
      {(() => {
        const continentLabel = breadcrumb ? t(`home.${breadcrumb.continentKey}` as never) : null;
        const countryLabel = breadcrumb ? t(`countries.${breadcrumb.countryCode}` as never) : null;
        const currentRounded = aqiData ? Math.round(aqiData.currentAqi) : null;
        const peakRounded = aqiData ? Math.round(aqiData.todayPeak.aqi) : null;
        const tomorrowRounded = aqiData ? Math.round(aqiData.tomorrowPeak.aqi) : null;
        return (
          <div className="a-hero">
            {breadcrumb && (
              <nav className="a-hero-eyeline" aria-label="Breadcrumb">
                <span className="truncate">
                  <Link href={`/${locale}`} className="hover:underline">airindex.today</Link>
                  {' › '}
                  <Link href={`/${locale}/continent/${breadcrumb.continentSlug}`} className="hover:underline">{continentLabel}</Link>
                  {' › '}
                  <Link href={`/${locale}/country/${breadcrumb.countrySlug}`} className="hover:underline">
                    {countryCodeToFlag(breadcrumb.countryCode) && <span className="a-flag" aria-hidden="true">{countryCodeToFlag(breadcrumb.countryCode)}</span>}
                    {countryLabel}
                  </Link>
                </span>
                {aqiData && (
                  <span className="a-hero-weather">
                    <span className="chip">
                      <Image src={getWeatherIcon(aqiData.currentWeatherCode).src} alt={getWeatherIcon(aqiData.currentWeatherCode).alt} width={22} height={22} />
                      <span>{tempUnit === 'F' ? Math.round(aqiData.currentTemp * 9 / 5 + 32) : Math.round(aqiData.currentTemp)}°{tempUnit}</span>
                    </span>
                  </span>
                )}
              </nav>
            )}
            <h2 className="a-hero-h1">
              {t('city.h1Prefix')}{' '}
              <span className="text-[var(--color-city-name)]">{cityDisplayName}</span>
            </h2>
            {aqiData && currentRounded != null && peakRounded != null && tomorrowRounded != null && (
              <p className="a-hero-sub">
                {t('city.summaryDesc', { city: cityDisplayName, country: countryDisplay })}
                {' '}
                {aqiData.currentAqi > 0 && (
                  <>
                    {t('city.summaryNow')}{' '}
                    <span className="font-semibold" style={{ color: getAqiTextColor(currentRounded) }}>
                      AQI {currentRounded} ({t(`aqi.${getAqiCategory(currentRounded)}`)})
                    </span>
                    {' · '}
                  </>
                )}
                {t('city.summaryPeak')}{' '}
                <span className="font-semibold" style={{ color: getAqiTextColor(peakRounded) }}>
                  AQI {peakRounded}
                </span>
                {' '}{t('aqi.at')} {aqiData.todayPeak.hour}
                {' · '}
                {t('aqi.tomorrow')}{': '}
                <span className="font-semibold" style={{ color: getAqiTextColor(tomorrowRounded) }}>
                  AQI {tomorrowRounded}
                </span>
                {' '}{t('aqi.at')} {aqiData.tomorrowPeak.hour}
              </p>
            )}
          </div>
        );
      })()}

      {breadcrumb && (() => {
        const continentLabel = t(`home.${breadcrumb.continentKey}` as never);
        const countryLabel = t(`countries.${breadcrumb.countryCode}` as never);
        const base = 'https://airindex.today';
        return (
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
        );
      })()}

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
