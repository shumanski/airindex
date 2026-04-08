import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getAllCities } from '@/lib/cities';
import { getLocationById, getLocalizedNames } from '@/lib/geocode-api';
import { parseGeoIdFromPath, parseNameFromPath, buildCityPath } from '@/lib/city-url';
import { routing } from '@/i18n/routing';

const BASE_URL = process.env.SITE_URL || 'https://airindex.today';

export async function generateStaticParams() {
  const cities = getAllCities();
  const allNames = await Promise.all(
    cities.map((c) => getLocalizedNames(c.id, routing.locales)),
  );
  const params: Array<{ locale: string; city: string }> = [];
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const names = allNames[i];
    for (const locale of city.locales) {
      const name = names[locale]?.name ?? city.slug;
      params.push({ locale, city: buildCityPath(name, city.id) });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}): Promise<Metadata> {
  const { locale, city: cityPath } = await params;
  const geoId = parseGeoIdFromPath(cityPath);

  if (!geoId) return {};

  const cityInfo = await getLocationById(geoId, locale);
  const cityName = cityInfo?.name ?? parseNameFromPath(cityPath);
  const countryName = cityInfo?.country ?? '';

  const t = await getTranslations({ locale, namespace: 'city' });
  const title = t('title', { city: cityName });
  const description = t('description', { city: cityName, country: countryName });
  const canonicalSegment = buildCityPath(cityName, geoId);
  const canonicalPath = `/${locale}/${canonicalSegment}`;

  const localizedNames = await getLocalizedNames(geoId, routing.locales);
  const languages: Record<string, string> = {};
  for (const loc of routing.locales) {
    const locName = localizedNames[loc]?.name ?? cityName;
    languages[loc] = `${BASE_URL}/${loc}/${buildCityPath(locName, geoId)}`;
  }
  languages['x-default'] = `${BASE_URL}/en/${buildCityPath(localizedNames['en']?.name ?? cityName, geoId)}`;

  return {
    title,
    description,
    metadataBase: new URL(BASE_URL),
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${canonicalPath}`,
      siteName: 'Air Index Today',
      locale,
      type: 'website',
      images: [{
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Air Index Today',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
  };
}

export default function CityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
