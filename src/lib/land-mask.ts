import { LAND_MASK_B64, LAND_MASK_RES, LAND_MASK_W, LAND_MASK_H } from './land-mask-data';

let bits: Uint8Array | null = null;

function decode(): Uint8Array {
  if (bits) return bits;
  const buf = Buffer.from(LAND_MASK_B64, 'base64');
  bits = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  return bits;
}

/**
 * Returns true if (lat, lon) falls on land, using a pre-baked 0.5° bitmap
 * derived from Natural Earth 110m polygons. Accuracy is ±0.5° at coastlines,
 * which is more than sufficient for a discrete AQI overlay.
 */
export function isLand(lat: number, lon: number): boolean {
  if (lat >= 90 || lat <= -90) return false;
  const b = decode();
  // Normalise lon to [-180, 180).
  let l = lon;
  while (l >= 180) l -= 360;
  while (l < -180) l += 360;
  const x = Math.floor((l + 180) / LAND_MASK_RES);
  const y = Math.floor((90 - lat) / LAND_MASK_RES);
  if (x < 0 || x >= LAND_MASK_W || y < 0 || y >= LAND_MASK_H) return false;
  const idx = y * LAND_MASK_W + x;
  return (b[idx >> 3] & (1 << (idx & 7))) !== 0;
}
