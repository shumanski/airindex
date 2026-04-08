import { LRUCache } from 'lru-cache';

const CACHE_TTL_MS = (parseInt(process.env.CACHE_TTL_MINUTES || '60', 10)) * 60 * 1000;
const CACHE_MAX = parseInt(process.env.CACHE_MAX_ENTRIES || '10000', 10);

const cache = new LRUCache<string, Record<string, unknown>>({
  max: CACHE_MAX,
  ttl: CACHE_TTL_MS,
});

export function roundCoord(v: number): number {
  return Math.round(v * 100) / 100;
}

export function getCacheKey(lat: number, lon: number): string {
  return `${roundCoord(lat)}_${roundCoord(lon)}`;
}

export function getCached<T>(key: string): T | undefined {
  return cache.get(key) as T | undefined;
}

export function setCache(key: string, value: Record<string, unknown>): void {
  cache.set(key, value);
}
