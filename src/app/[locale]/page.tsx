import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { fetchAqiData, fetchBatchCurrentAqi, fetchBatchMaxAqi } from '@/lib/aqi-api';
import { batchLocalizedNames } from '@/lib/geocode-api';
import { POPULAR_CITIES } from '@/lib/popular-cities';
import HomePageClient from './HomePageClient';

const BASE_URL = process.env.SITE_URL || 'https://airindex.today';
const IP_GEO_URL = process.env.IP_GEO_URL || 'http://ip-geo:3849';
const GEO_SERVICE_URL = process.env.GEO_SERVICE_URL || 'http://geo-service:3850';

export interface DetectedCity {
  name: string;
  country: string;
  geoId: number;
  currentAqi?: number;
  currentTemp?: number;       // °C
  currentWeatherCode?: number;
  peakAqi?: number;
  peakHour?: string;
  tomorrowPeakAqi?: number;
  tomorrowPeakHour?: string;
}

async function detectCity(locale: string): Promise<DetectedCity | null> {
  try {
    const h = await headers();
    const ip =
      h.get('cf-connecting-ip') ||
      h.get('x-forwarded-for')?.split(',')[0]?.trim();
    if (!ip) return null;

    const geoRes = await fetch(
      `${IP_GEO_URL}/lookup?ip=${encodeURIComponent(ip)}`,
      { signal: AbortSignal.timeout(2000) },
    );
    if (!geoRes.ok) return null;
    const geoData = await geoRes.json();
    if (!geoData.detected || !geoData.lat || !geoData.lon || !geoData.city) return null;

    const geoSvcRes = await fetch(
      `${GEO_SERVICE_URL}/search?q=${encodeURIComponent(geoData.city)}&lang=${locale}&count=3`,
      { signal: AbortSignal.timeout(2000) },
    );
    if (!geoSvcRes.ok) return null;
    const geoSvcData = await geoSvcRes.json();
    if (!geoSvcData.results?.length) return null;

    const results: Array<{ latitude: number; longitude: number; name: string; id: number; country: string }> = geoSvcData.results;
    let best = results[0];
    let bestDist = Math.abs(best.latitude - geoData.lat) + Math.abs(best.longitude - geoData.lon);
    for (const r of results) {
      const d = Math.abs(r.latitude - geoData.lat) + Math.abs(r.longitude - geoData.lon);
      if (d < bestDist) { best = r; bestDist = d; }
    }

    const city: DetectedCity = {
      name: best.name,
      country: best.country || geoData.country,
      geoId: best.id,
    };

    try {
      const aqi = await fetchAqiData(best.latitude, best.longitude);
      city.currentAqi = Math.round(aqi.currentAqi);
      city.currentTemp = aqi.currentTemp;
      city.currentWeatherCode = aqi.currentWeatherCode;
      city.peakAqi = Math.round(aqi.todayPeak.aqi);
      city.peakHour = aqi.todayPeak.hour;
      city.tomorrowPeakAqi = Math.round(aqi.tomorrowPeak.aqi);
      city.tomorrowPeakHour = aqi.tomorrowPeak.hour;
    } catch { /* AQI fetch failed — card still works without data */ }

    return city;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'meta' });

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = loc === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${loc}`;
  }
  languages['x-default'] = `${BASE_URL}/`;

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: locale === 'en' ? `${BASE_URL}/` : `${BASE_URL}/${locale}`,
      languages,
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  // Temporary: exclude Saudi Arabia cities from homepage ranking.
  // Open-Meteo (our data source) computes US AQI via CAMS PM10 × a formula that
  // linearly extrapolates past EPA's 500-cap (see Sources/App/Helper/AirQuality.swift
  // positionExtrapolated). Over the Arabian Peninsula CAMS forecasts very high dust
  // (PM10 > 1000 µg/m³), producing AQI 1000+ while ground stations report AQI < 50.
  // Until we clamp at 500 and/or switch data source, hide these cities from rankings.
  const EXCLUDED_COUNTRIES = new Set(['SA']);
  const allCities = Object.values(POPULAR_CITIES)
    .flat()
    .filter(c => !c.country || !EXCLUDED_COUNTRIES.has(c.country));
  const [detectedCity, aqiMap, aqiMaxMap, localizedNames] = await Promise.all([
    detectCity(locale),
    fetchBatchCurrentAqi(allCities),
    fetchBatchMaxAqi(allCities),
    batchLocalizedNames(allCities.map(c => c.geoId), locale),
  ]);
  const cityAqiLevels: Record<string, number> = {};
  for (const [key, val] of aqiMap) cityAqiLevels[key] = val;
  const cityAqiMax: Record<string, number> = {};
  for (const [key, val] of aqiMaxMap) cityAqiMax[key] = val;
  return <HomePageClient detectedCity={detectedCity} cityAqiLevels={cityAqiLevels} cityAqiMax={cityAqiMax} localizedNames={localizedNames} />;
}
