import { notFound } from 'next/navigation';
import { getLocationById, getLocalizedNames, fetchNearbyCities } from '@/lib/geocode-api';
import { parseGeoIdFromPath, parseNameFromPath, buildCityPath } from '@/lib/city-url';
import { fetchAqiData, fetchBatchCurrentAqi, fetchBatchMaxAqi } from '@/lib/aqi-api';
import { roundCoord } from '@/lib/cache';
import { routing } from '@/i18n/routing';
import CityPageClient from './CityPageClient';

export default async function CityPage({
  params,
}: {
  params: Promise<{ locale: string; city: string }>;
}) {
  const { locale, city: cityPath } = await params;
  const geoId = parseGeoIdFromPath(cityPath);

  if (!geoId) notFound();

  const cityInfo = await getLocationById(geoId, locale);
  if (!cityInfo) notFound();

  const fallbackName = parseNameFromPath(cityPath);
  const initialLocation = {
    lat: cityInfo.latitude,
    lon: cityInfo.longitude,
    name: `${cityInfo.name}, ${cityInfo.country}`,
    geoId: cityInfo.id,
  };

  const [initialAqiData, nearbyCities, localizedNames] = await Promise.all([
    fetchAqiData(roundCoord(cityInfo.latitude), roundCoord(cityInfo.longitude)).catch(() => null),
    fetchNearbyCities(cityInfo.latitude, cityInfo.longitude, geoId, locale),
    getLocalizedNames(geoId, routing.locales),
  ]);

  // Fetch AQI for nearby cities
  let nearbyAqiCurrent: Record<string, number> = {};
  let nearbyAqiMax: Record<string, number> = {};
  if (nearbyCities && nearbyCities.length > 0) {
    const nearbyLocs = nearbyCities.map(c => ({ lat: c.lat, lon: c.lon, geoId: c.id, name: c.name, country: '' }));
    const [curMap, maxMap] = await Promise.all([
      fetchBatchCurrentAqi(nearbyLocs),
      fetchBatchMaxAqi(nearbyLocs),
    ]);
    for (const [key, val] of curMap) nearbyAqiCurrent[key] = val;
    for (const [key, val] of maxMap) nearbyAqiMax[key] = val;
  }

  const localizedPaths: Record<string, string> = {};
  for (const loc of routing.locales) {
    const locName = localizedNames[loc]?.name ?? cityInfo.name;
    localizedPaths[loc] = `/${loc}/${buildCityPath(locName, geoId)}`;
  }

  return (
    <CityPageClient
      initialLocation={initialLocation}
      fallbackName={fallbackName}
      initialAqiData={initialAqiData}
      localizedPaths={localizedPaths}
      nearbyCities={nearbyCities}
      nearbyAqiCurrent={nearbyAqiCurrent}
      nearbyAqiMax={nearbyAqiMax}
      cityData={{
        latitude: cityInfo.latitude,
        longitude: cityInfo.longitude,
        country: cityInfo.country,
        admin1: cityInfo.admin1,
        population: cityInfo.population,
      }}
    />
  );
}
