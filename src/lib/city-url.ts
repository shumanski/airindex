/** Slugify a city name for URL path segments */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ø/g, 'o')
    .replace(/æ/g, 'ae')
    .replace(/ð/g, 'd')
    .replace(/þ/g, 'th')
    .replace(/ß/g, 'ss')
    .replace(/đ/g, 'd')
    .replace(/ł/g, 'l')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build city URL path segment: air-quality-index-{slug}-{geoId} */
export function buildCityPath(name: string, geoId: number): string {
  return `air-quality-index-${slugify(name)}-${geoId}`;
}

/** Extract geoId from a city path segment like "air-quality-index-stockholm-2673730" */
export function parseGeoIdFromPath(segment: string): number | undefined {
  const match = segment.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : undefined;
}

/** Extract display name from path: "air-quality-index-new-york-123" → "New York" */
export function parseNameFromPath(segment: string): string {
  return segment
    .replace(/^air-quality-index-/, '')
    .replace(/-\d+$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
