import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { fetchBatchCurrentAqi, fetchBatchMaxAqi } from '@/lib/aqi-api';
import { batchLocalizedNames } from '@/lib/geocode-api';
import {
  COUNTRY_SLUGS,
  COUNTRY_NAMES,
  COUNTRY_CODE_TO_SLUG,
  CONTINENT_KEY_TO_SLUG,
  getCitiesByCountry,
  getContinentForCountry,
  getCountriesInContinent,
} from '@/lib/popular-cities';
import CountryPageClient from './CountryPageClient';

const BASE_URL = process.env.SITE_URL || 'https://airindex.today';

export function generateStaticParams() {
  return Object.keys(COUNTRY_SLUGS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const countryCode = COUNTRY_SLUGS[slug];
  if (!countryCode) return {};

  const t = await getTranslations({ locale, namespace: 'countries' });
  const tMeta = await getTranslations({ locale, namespace: 'meta' });
  const countryName = t(countryCode as any) || COUNTRY_NAMES[countryCode] || slug;
  const title = tMeta('countryTitle', { country: countryName });
  const description = tMeta('countryDescription', { country: countryName });

  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    languages[loc] = `${BASE_URL}/${loc}/country/${slug}`;
  }
  languages['x-default'] = `${BASE_URL}/en/country/${slug}`;

  const url = `${BASE_URL}/${locale}/country/${slug}`;
  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Air Index Today',
      locale,
      type: 'website',
      images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Air Index Today' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default async function CountryPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const countryCode = COUNTRY_SLUGS[slug];
  if (!countryCode) notFound();

  const cities = getCitiesByCountry(countryCode);
  if (cities.length === 0) notFound();

  const [aqiMap, aqiMaxMap, localizedNames] = await Promise.all([
    fetchBatchCurrentAqi(cities),
    fetchBatchMaxAqi(cities),
    batchLocalizedNames(cities.map(c => c.geoId), locale),
  ]);
  const cityAqiLevels: Record<string, number> = {};
  for (const [key, val] of aqiMap) cityAqiLevels[key] = val;
  const cityAqiMax: Record<string, number> = {};
  for (const [key, val] of aqiMaxMap) cityAqiMax[key] = val;

  const continentKey = getContinentForCountry(countryCode);
  const continentSlug = continentKey ? CONTINENT_KEY_TO_SLUG[continentKey] : null;

  // Get other countries in the same continent for navigation
  const otherCountryCodes = continentKey
    ? getCountriesInContinent(continentKey).filter(cc => cc !== countryCode)
    : [];
  const otherCountries = otherCountryCodes.map(cc => ({
    code: cc,
    name: COUNTRY_NAMES[cc] || cc,
    slug: COUNTRY_CODE_TO_SLUG[cc],
  })).filter(c => c.slug);

  return (
    <CountryPageClient
      countryCode={countryCode}
      countryName={COUNTRY_NAMES[countryCode] || slug}
      slug={slug}
      cities={cities}
      cityAqiLevels={cityAqiLevels}
      cityAqiMax={cityAqiMax}
      localizedNames={localizedNames}
      continentKey={continentKey}
      continentSlug={continentSlug}
      otherCountries={otherCountries}
    />
  );
}
