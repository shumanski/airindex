import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { getAllCities } from '@/lib/cities';
import { getLocalizedNames } from '@/lib/geocode-api';
import { buildCityPath } from '@/lib/city-url';
import { CONTINENT_SLUGS, COUNTRY_SLUGS } from '@/lib/popular-cities';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.SITE_URL || 'https://airindex.today';

function todayMidnight(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const today = todayMidnight();

  const homePages = routing.locales.map((locale) => ({
    url: `${BASE_URL}/${locale}`,
    lastModified: today,
    changeFrequency: 'daily' as const,
    priority: locale === routing.defaultLocale ? 1.0 : 0.9,
  }));

  const cities = getAllCities();
  const allNames = await Promise.all(
    cities.map((c) => getLocalizedNames(c.id, routing.locales)),
  );

  const cityPages: MetadataRoute.Sitemap = [];
  for (let i = 0; i < cities.length; i++) {
    const city = cities[i];
    const names = allNames[i];
    for (const locale of city.locales) {
      const name = names[locale]?.name ?? city.slug;
      cityPages.push({
        url: `${BASE_URL}/${locale}/${buildCityPath(name, city.id)}`,
        lastModified: today,
        changeFrequency: 'daily' as const,
        priority: city.priority ?? 0.7,
      });
    }
  }

  const staticSince = new Date('2025-06-01');
  const staticPages = routing.locales.flatMap((locale) =>
    ['about', 'privacy'].map((page) => ({
      url: `${BASE_URL}/${locale}/${page}`,
      lastModified: staticSince,
      changeFrequency: 'monthly' as const,
      priority: 0.3,
    }))
  );

  const continentPages = routing.locales.flatMap((locale) =>
    Object.keys(CONTINENT_SLUGS).map((slug) => ({
      url: `${BASE_URL}/${locale}/continent/${slug}`,
      lastModified: today,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }))
  );

  const countryPages = routing.locales.flatMap((locale) =>
    Object.keys(COUNTRY_SLUGS).map((slug) => ({
      url: `${BASE_URL}/${locale}/country/${slug}`,
      lastModified: today,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }))
  );

  return [...homePages, ...continentPages, ...countryPages, ...cityPages, ...staticPages];
}
