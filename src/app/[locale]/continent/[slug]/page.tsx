import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { fetchBatchCurrentAqi, fetchBatchMaxAqi } from '@/lib/aqi-api';
import { batchLocalizedNames } from '@/lib/geocode-api';
import {
  POPULAR_CITIES,
  CONTINENT_SLUGS,
  CONTINENT_VIEW,
  COUNTRY_NAMES,
  groupByCountry,
  getAllCitiesForContinent,
} from '@/lib/popular-cities';
import ContinentPageClient from './ContinentPageClient';

const BASE_URL = process.env.SITE_URL || 'https://airindex.today';

export function generateStaticParams() {
  return Object.keys(CONTINENT_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const continentKey = CONTINENT_SLUGS[slug];
  if (!continentKey) return {};

  const t = await getTranslations({ locale, namespace: 'home' });
  const continentName = t(continentKey as any);
  const title = `Air Quality ${continentName} – AQI for Top Cities`;
  const description = `Current air quality index for major cities in ${continentName}. Real-time AQI data, pollutant levels, and health advice.`;

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${BASE_URL}/${loc}/continent/${slug}`;
  }
  languages['x-default'] = `${BASE_URL}/en/continent/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}/${locale}/continent/${slug}`,
      languages,
    },
  };
}

export default async function ContinentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const continentKey = CONTINENT_SLUGS[slug];
  if (!continentKey) notFound();

  const cities = getAllCitiesForContinent(continentKey);
  if (!cities || cities.length === 0) notFound();

  const view = CONTINENT_VIEW[continentKey];
  const [aqiMap, aqiMaxMap, localizedNames] = await Promise.all([
    fetchBatchCurrentAqi(cities),
    fetchBatchMaxAqi(cities),
    batchLocalizedNames(cities.map(c => c.geoId), locale),
  ]);
  const cityAqiLevels: Record<string, number> = {};
  for (const [key, val] of aqiMap) cityAqiLevels[key] = val;
  const cityAqiMax: Record<string, number> = {};
  for (const [key, val] of aqiMaxMap) cityAqiMax[key] = val;

  const byCountry = groupByCountry(cities);

  return (
    <ContinentPageClient
      continentKey={continentKey}
      slug={slug}
      cities={cities}
      cityAqiLevels={cityAqiLevels}
      cityAqiMax={cityAqiMax}
      localizedNames={localizedNames}
      byCountry={byCountry}
      countryNames={COUNTRY_NAMES}
      view={view}
    />
  );
}
