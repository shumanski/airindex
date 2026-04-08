// US AQI categories per EPA (EPA-454/B-24-002, May 2024)
export type AqiCategory = 'good' | 'moderate' | 'unhealthySensitive' | 'unhealthy' | 'veryUnhealthy' | 'hazardous';

export function getAqiCategory(aqi: number): AqiCategory {
  if (aqi <= 50) return 'good';
  if (aqi <= 100) return 'moderate';
  if (aqi <= 150) return 'unhealthySensitive';
  if (aqi <= 200) return 'unhealthy';
  if (aqi <= 300) return 'veryUnhealthy';
  return 'hazardous';
}

// ColorVision Assist AQI colors (Table 3, EPA-454/B-24-002)
export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#9eff91';   // Green  (158,255,145)
  if (aqi <= 100) return '#ffc905';  // Yellow (255,201,5)
  if (aqi <= 150) return '#ff8205';  // Orange (255,130,5)
  if (aqi <= 200) return '#f02200';  // Red    (240,34,0)
  if (aqi <= 300) return '#890997';  // Purple (137,9,151)
  return '#640015';                  // Maroon (100,0,21)
}

// Theme-adaptive text colors
export function getAqiTextColor(aqi: number): string {
  if (aqi <= 50) return 'var(--aqi-text-good)';
  if (aqi <= 100) return 'var(--aqi-text-moderate)';
  if (aqi <= 150) return 'var(--aqi-text-usg)';
  if (aqi <= 200) return 'var(--aqi-text-unhealthy)';
  if (aqi <= 300) return 'var(--aqi-text-veryUnhealthy)';
  return 'var(--aqi-text-hazardous)';
}

// Foreground color for text on AQI-colored backgrounds
export function getAqiFgColor(aqi: number): string {
  if (aqi <= 100) return '#000000'; // dark text on green/yellow
  return '#ffffff';                 // white text on orange/red/purple/maroon
}

// ── EPA Sub-AQI per pollutant (Equation 1, Table 6, EPA-454/B-24-002) ──

// Molecular weights for µg/m³ → ppb conversion at 25°C, 1 atm
const MW = { o3: 48.00, no2: 46.01, so2: 64.07, co: 28.01 } as const;

// µg/m³ → ppm (for O₃, CO)
function ugm3ToPpm(ugm3: number, mw: number): number {
  return (ugm3 * 24.45) / (mw * 1000);
}

// µg/m³ → ppb (for NO₂, SO₂)
function ugm3ToPpb(ugm3: number, mw: number): number {
  return (ugm3 * 24.45) / mw;
}

// Table 6 breakpoints: [BPLo, BPHi] for each AQI range
// AQI ranges: [0,50], [51,100], [101,150], [151,200], [201,300], [301,500]
const AQI_BP = [
  [0, 50], [51, 100], [101, 150], [151, 200], [201, 300], [301, 500],
] as const;

// Breakpoints per pollutant (in reporting units from Table 6)
const BREAKPOINTS: Record<string, readonly (readonly [number, number])[]> = {
  // O₃ 8-hour (ppm) — only up to AQI 300; above 300 use 1-hr (not supported here)
  o3:   [[0.000, 0.054], [0.055, 0.070], [0.071, 0.085], [0.086, 0.105], [0.106, 0.200], [0.201, 0.604]],
  // PM2.5 24-hour (µg/m³)
  pm25: [[0.0, 9.0], [9.1, 35.4], [35.5, 55.4], [55.5, 125.4], [125.5, 225.4], [225.5, 325.4]],
  // PM10 24-hour (µg/m³)
  pm10: [[0, 54], [55, 154], [155, 254], [255, 354], [355, 424], [425, 604]],
  // CO 8-hour (ppm)
  co:   [[0.0, 4.4], [4.5, 9.4], [9.5, 12.4], [12.5, 15.4], [15.5, 30.4], [30.5, 50.4]],
  // SO₂ 1-hour (ppb)
  so2:  [[0, 35], [36, 75], [76, 185], [186, 304], [305, 604], [605, 1004]],
  // NO₂ 1-hour (ppb)
  no2:  [[0, 53], [54, 100], [101, 360], [361, 649], [650, 1249], [1250, 2049]],
};

// Equation 1: Ip = (IHi - ILo) / (BPHi - BPLo) * (Cp - BPLo) + ILo
function epaEquation1(cp: number, bpLo: number, bpHi: number, iLo: number, iHi: number): number {
  if (bpHi === bpLo) return iLo;
  return ((iHi - iLo) / (bpHi - bpLo)) * (cp - bpLo) + iLo;
}

/**
 * Calculate sub-AQI for a single pollutant.
 * Concentrations are in µg/m³ (pm25, pm10, o3, no2, so2) or µg/m³ for co.
 * Returns AQI value (0-500+), or -1 if pollutant is unknown.
 */
export function calcSubAqi(pollutant: string, concentration: number): number {
  // Convert units: Open-Meteo gives µg/m³ for all
  let cp: number;
  switch (pollutant) {
    case 'o3':  cp = ugm3ToPpm(concentration, MW.o3); break;
    case 'co':  cp = ugm3ToPpm(concentration, MW.co); break;
    case 'no2': cp = ugm3ToPpb(concentration, MW.no2); break;
    case 'so2': cp = ugm3ToPpb(concentration, MW.so2); break;
    case 'pm25': cp = concentration; break;
    case 'pm10': cp = Math.trunc(concentration); break;
    default: return -1;
  }

  // Truncate per EPA rules
  switch (pollutant) {
    case 'o3':   cp = Math.trunc(cp * 1000) / 1000; break; // 3 decimal places
    case 'pm25': cp = Math.trunc(cp * 10) / 10; break;     // 1 decimal place
    case 'co':   cp = Math.trunc(cp * 10) / 10; break;     // 1 decimal place
    case 'so2':  cp = Math.trunc(cp); break;                // integer
    case 'no2':  cp = Math.trunc(cp); break;                // integer
    case 'pm10': cp = Math.trunc(cp); break;                // integer
  }

  const bps = BREAKPOINTS[pollutant];
  if (!bps) return -1;

  for (let i = 0; i < bps.length; i++) {
    const [bpLo, bpHi] = bps[i];
    const [iLo, iHi] = AQI_BP[i];
    if (cp >= bpLo && cp <= bpHi) {
      return Math.round(epaEquation1(cp, bpLo, bpHi, iLo, iHi));
    }
  }

  // Above max breakpoint — extrapolate from last range
  const last = bps.length - 1;
  const [bpLo, bpHi] = bps[last];
  const [iLo, iHi] = AQI_BP[last];
  return Math.round(epaEquation1(cp, bpLo, bpHi, iLo, iHi));
}
