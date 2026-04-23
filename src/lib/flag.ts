/**
 * Convert ISO 3166-1 alpha-2 country code → emoji flag.
 * Returns empty string if the code is missing or malformed.
 */
export function countryCodeToFlag(cc?: string | null): string {
  if (!cc || cc.length !== 2) return '';
  const code = cc.toUpperCase();
  if (!/^[A-Z]{2}$/.test(code)) return '';
  const A = 0x1f1e6; // regional indicator A
  return String.fromCodePoint(
    A + code.charCodeAt(0) - 65,
    A + code.charCodeAt(1) - 65,
  );
}
