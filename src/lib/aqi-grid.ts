/**
 * AQI grid builder — produces a regularly-spaced grid of AQI values over
 * a bbox, suitable for a discrete colored overlay on a map.
 *
 * - Land cells only (uses Natural Earth 110m land mask at 0.5° resolution).
 * - Ocean cells are marked NO_DATA and skipped on the client.
 * - Results are cached in the shared LRU cache for ~1 h (matches OM forecast freshness).
 * - A small in-process semaphore prevents many parallel grid builds from
 *   saturating the OM server during cold-start bursts.
 */
import { getCached, setCache } from './cache';
import { isLand } from './land-mask';

const omHost = process.env.OPENMETEO_HOST;
const apiKey = !omHost ? process.env.OPENMETEO_API_KEY : undefined;
const AQI_BASE = omHost ? `${omHost}/v1/air-quality`
  : apiKey ? 'https://customer-air-quality-api.open-meteo.com/v1/air-quality'
  : 'https://air-quality-api.open-meteo.com/v1/air-quality';

export const NO_DATA = -1;

export interface GridRequest {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  spacing: number; // degrees
}

export interface GridResult {
  minLat: number;
  maxLat: number;
  minLon: number;
  maxLon: number;
  width: number;
  height: number;
  spacing: number;
  /** width * height values, row-major (top row = maxLat). -1 = no data (ocean / API miss). */
  aqi: Int16Array;
}

const CHUNK = 100;                // coords per OM batch request
const MAX_CELLS = 20_000;         // hard safety cap
const CACHE_TTL_HOURS = 1;

// Single-flight in-process dedupe: concurrent identical requests await the same promise.
const inflight = new Map<string, Promise<GridResult>>();

// Concurrency limit for building grids (not served from cache).
let active = 0;
const MAX_CONCURRENT_BUILDS = 3;
const waitQueue: Array<() => void> = [];

function acquire(): Promise<void> {
  if (active < MAX_CONCURRENT_BUILDS) {
    active++;
    return Promise.resolve();
  }
  return new Promise((resolve) => { waitQueue.push(() => { active++; resolve(); }); });
}
function release(): void {
  active--;
  const next = waitQueue.shift();
  if (next) next();
}

function keyFor(req: GridRequest): string {
  const hour = Math.floor(Date.now() / 3600_000); // per-UTC-hour bucket
  const r = (v: number) => v.toFixed(2);
  return `grid:v1:${r(req.minLat)}:${r(req.maxLat)}:${r(req.minLon)}:${r(req.maxLon)}:${req.spacing}:${hour}`;
}

function roundDeg(v: number): number { return Math.round(v * 100) / 100; }

export function normaliseRequest(req: GridRequest): GridRequest {
  return {
    minLat: roundDeg(Math.max(-85, req.minLat)),
    maxLat: roundDeg(Math.min(85, req.maxLat)),
    minLon: roundDeg(Math.max(-180, req.minLon)),
    maxLon: roundDeg(Math.min(180, req.maxLon)),
    spacing: Math.max(0.1, Math.min(5, req.spacing)),
  };
}

export async function buildAqiGrid(rawReq: GridRequest): Promise<GridResult> {
  const req = normaliseRequest(rawReq);
  const cacheKey = keyFor(req);

  const cached = getCached<Record<string, unknown>>(cacheKey);
  if (cached) return inflateCached(cached, req);

  const existing = inflight.get(cacheKey);
  if (existing) return existing;

  const promise = (async () => {
    await acquire();
    try {
      const result = await buildUncached(req);
      // Store compact representation in LRU.
      setCache(cacheKey, {
        minLat: result.minLat,
        maxLat: result.maxLat,
        minLon: result.minLon,
        maxLon: result.maxLon,
        width: result.width,
        height: result.height,
        spacing: result.spacing,
        aqi: Array.from(result.aqi),
      });
      return result;
    } finally {
      release();
      inflight.delete(cacheKey);
    }
  })();

  inflight.set(cacheKey, promise);
  return promise;
}

function inflateCached(obj: Record<string, unknown>, req: GridRequest): GridResult {
  const aqiArr = obj.aqi as number[];
  return {
    minLat: obj.minLat as number,
    maxLat: obj.maxLat as number,
    minLon: obj.minLon as number,
    maxLon: obj.maxLon as number,
    width: obj.width as number,
    height: obj.height as number,
    spacing: (obj.spacing as number) ?? req.spacing,
    aqi: Int16Array.from(aqiArr),
  };
}

async function buildUncached(req: GridRequest): Promise<GridResult> {
  const { minLat, maxLat, minLon, maxLon, spacing } = req;
  const width = Math.max(1, Math.floor((maxLon - minLon) / spacing) + 1);
  const height = Math.max(1, Math.floor((maxLat - minLat) / spacing) + 1);

  if (width * height > MAX_CELLS) {
    throw new Error(`grid too large: ${width * height} cells (max ${MAX_CELLS})`);
  }

  const aqi = new Int16Array(width * height).fill(NO_DATA);

  // Collect land-only coords to query. Keep track of their target cell indices.
  interface Cell { lat: number; lon: number; idx: number }
  const toFetch: Cell[] = [];
  for (let y = 0; y < height; y++) {
    const lat = maxLat - y * spacing; // top row = maxLat
    for (let x = 0; x < width; x++) {
      const lon = minLon + x * spacing;
      if (!isLand(lat, lon)) continue;
      toFetch.push({ lat, lon, idx: y * width + x });
    }
  }

  if (toFetch.length === 0) return { ...req, width, height, aqi };

  // Batch requests to OM.
  const chunks: Cell[][] = [];
  for (let i = 0; i < toFetch.length; i += CHUNK) chunks.push(toFetch.slice(i, i + CHUNK));

  await Promise.all(chunks.map(async (chunk) => {
    const url = new URL(AQI_BASE);
    url.searchParams.set('latitude', chunk.map(c => c.lat.toFixed(2)).join(','));
    url.searchParams.set('longitude', chunk.map(c => c.lon.toFixed(2)).join(','));
    url.searchParams.set('current', 'us_aqi');
    if (apiKey) url.searchParams.set('apikey', apiKey);
    try {
      const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
      if (!res.ok) return;
      const data = await res.json();
      const items = Array.isArray(data) ? data : [data];
      items.forEach((item: { current?: { us_aqi?: number } }, i: number) => {
        const v = item?.current?.us_aqi;
        const cell = chunk[i];
        if (typeof v === 'number' && cell) {
          aqi[cell.idx] = Math.max(0, Math.min(9999, Math.round(v)));
        }
      });
    } catch (e) {
      console.error('[aqi-grid] chunk failed:', e);
    }
  }));

  return { ...req, width, height, aqi };
}

/** Encode grid as compact binary for network transport.
 *  Layout (little-endian):
 *    u8   version = 1
 *    f32  minLat, maxLat, minLon, maxLon
 *    f32  spacing
 *    u16  width, height
 *    i16[width*height]  aqi values (-1 = no data)
 */
export function encodeGrid(g: GridResult): Uint8Array {
  const headerLen = 1 + 4 * 4 + 4 + 2 + 2;
  const bodyLen = g.width * g.height * 2;
  const out = new ArrayBuffer(headerLen + bodyLen);
  const view = new DataView(out);
  let p = 0;
  view.setUint8(p, 1); p += 1;
  view.setFloat32(p, g.minLat, true); p += 4;
  view.setFloat32(p, g.maxLat, true); p += 4;
  view.setFloat32(p, g.minLon, true); p += 4;
  view.setFloat32(p, g.maxLon, true); p += 4;
  view.setFloat32(p, g.spacing, true); p += 4;
  view.setUint16(p, g.width, true); p += 2;
  view.setUint16(p, g.height, true); p += 2;
  for (let i = 0; i < g.aqi.length; i++) {
    view.setInt16(p, g.aqi[i], true);
    p += 2;
  }
  return new Uint8Array(out);
}
