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

// Standard AirNow AQI colors (https://www.airnow.gov/aqi/aqi-basics/)
export function getAqiColor(aqi: number): string {
  if (aqi <= 50) return '#00e400';   // Green
  if (aqi <= 100) return '#ffff00';  // Yellow
  if (aqi <= 150) return '#ff7e00';  // Orange
  if (aqi <= 200) return '#ff0000';  // Red
  if (aqi <= 300) return '#8f3f97';  // Purple
  return '#7e0023';                  // Maroon
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
