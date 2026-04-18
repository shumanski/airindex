import { LRUCache } from 'lru-cache';
import { buildCityPath } from '@/lib/city-url';

const GEO_SERVICE_URL = process.env.GEO_SERVICE_URL || 'http://geo-service:3850';

export interface GeoResult {
  id: number;
  name: string;
  country: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  population?: number;
  elevation?: number;
}

export function pickClosest<T extends { latitude: number; longitude: number }>(
  results: T[], lat: number, lon: number,
): T {
  let best = results[0];
  let bestDist = Math.abs(best.latitude - lat) + Math.abs(best.longitude - lon);
  for (const r of results) {
    const d = Math.abs(r.latitude - lat) + Math.abs(r.longitude - lon);
    if (d < bestDist) { best = r; bestDist = d; }
  }
  return best;
}

const searchCache = new LRUCache<string, GeoResult[]>({ max: 2000, ttl: 3600_000 });
const idCache = new LRUCache<string, GeoResult>({ max: 5000, ttl: 86400_000 });
const idMisses = new LRUCache<string, true>({ max: 1000, ttl: 300_000 });

export async function searchLocations(query: string, language = 'en'): Promise<GeoResult[]> {
  if (!query || query.length < 2) return [];

  const cacheKey = `${language}:${query.toLowerCase()}`;
  const cached = searchCache.get(cacheKey);
  if (cached) return cached;

  const res = await fetch(
    `${GEO_SERVICE_URL}/search?q=${encodeURIComponent(query)}&lang=${encodeURIComponent(language)}&count=5`,
    { signal: AbortSignal.timeout(3000) },
  );
  if (!res.ok) return [];

  const data = await res.json();
  const results: GeoResult[] = (data.results || []) as GeoResult[];

  searchCache.set(cacheKey, results);
  return results;
}

export async function getLocationById(id: number, language = 'en'): Promise<GeoResult | null> {
  const cacheKey = `${language}:${id}`;
  if (idMisses.has(cacheKey)) return null;
  const cached = idCache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await fetch(
      `${GEO_SERVICE_URL}/lookup?id=${id}&lang=${encodeURIComponent(language)}`,
      { signal: AbortSignal.timeout(3000) },
    );
    if (res.ok) {
      const result = await res.json() as GeoResult;
      if (result.id) {
        idCache.set(cacheKey, result);
        return result;
      }
    }
  } catch {
    // geo-service unreachable — fall through to Open-Meteo
  }

  try {
    const res = await fetch(
      `https://${process.env.OPENMETEO_API_KEY ? 'customer-geocoding-api' : 'geocoding-api'}.open-meteo.com/v1/get?id=${id}&language=${encodeURIComponent(language)}${process.env.OPENMETEO_API_KEY ? `&apikey=${process.env.OPENMETEO_API_KEY}` : ''}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) {
      if (res.status >= 400 && res.status < 500) idMisses.set(cacheKey, true);
      return null;
    }
    const r = await res.json();
    if (!r.id) { idMisses.set(cacheKey, true); return null; }
    const result: GeoResult = {
      id: r.id,
      name: r.name,
      country: r.country || '',
      latitude: r.latitude,
      longitude: r.longitude,
    };
    idCache.set(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}

const allNamesCache = new LRUCache<number, Record<string, GeoResult>>({ max: 2000, ttl: 86400_000 });

export async function getLocalizedNames(
  id: number,
  locales: readonly string[],
): Promise<Record<string, GeoResult>> {
  const cached = allNamesCache.get(id);
  if (cached) return cached;

  const results: Record<string, GeoResult> = {};
  await Promise.all(
    locales.map(async (loc) => {
      const r = await getLocationById(id, loc);
      if (r) results[loc] = r;
    }),
  );

  allNamesCache.set(id, results);
  return results;
}

const batchNamesCache = new LRUCache<string, Record<number, { name: string }>>({
  max: 50,
  ttl: 86400_000,
});

export async function batchLocalizedNames(
  geoIds: number[],
  locale: string,
): Promise<Record<number, string>> {
  const cacheKey = `${locale}:${geoIds.length}:${geoIds.slice(0, 3).join(',')}`;
  const cached = batchNamesCache.get(cacheKey);
  if (cached) {
    const out: Record<number, string> = {};
    for (const [id, v] of Object.entries(cached)) out[Number(id)] = v.name;
    return out;
  }

  try {
    const res = await fetch(
      `${GEO_SERVICE_URL}/batch-lookup?ids=${geoIds.join(',')}&lang=${encodeURIComponent(locale)}`,
      { signal: AbortSignal.timeout(5000) },
    );
    if (!res.ok) return {};
    const data = await res.json();
    const results: Record<number, string> = {};
    const cacheData: Record<number, { name: string }> = {};
    for (const [id, info] of Object.entries(data.results || {})) {
      results[Number(id)] = (info as any).name;
      cacheData[Number(id)] = { name: (info as any).name };
    }
    batchNamesCache.set(cacheKey, cacheData);
    return results;
  } catch {
    return {};
  }
}

export interface NearbyCityResult {
  id: number;
  name: string;
  slug: string;
  lat: number;
  lon: number;
}

export async function fetchNearbyCities(
  lat: number, lon: number, geoId: number, locale: string,
): Promise<NearbyCityResult[]> {
  try {
    const res = await fetch(
      `${GEO_SERVICE_URL}/nearby?lat=${lat}&lon=${lon}&lang=${encodeURIComponent(locale)}&exclude=${geoId}&count=5`,
      { signal: AbortSignal.timeout(3000) },
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (data.results || []).map((r: GeoResult) => ({
      id: r.id,
      name: r.name,
      slug: buildCityPath(r.name, r.id),
      lat: r.latitude,
      lon: r.longitude,
    }));
  } catch {
    return [];
  }
}
