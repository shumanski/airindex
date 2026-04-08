// WMO Weather interpretation codes → Yr weather symbol SVGs
// Source: WMO Code Table 4677, used by Open-Meteo API
// Icons: Yr/NRK weather symbols (CC BY 4.0) — https://github.com/nrkno/yr-weather-symbols

export interface WeatherIcon {
  src: string;   // path to SVG in /public/weather-icons/
  alt: string;   // descriptive alt text for SEO & accessibility
}

// Map WMO code → Yr symbol filename + English alt text
const weatherIcons: Record<number, WeatherIcon> = {
  0:  { src: '/weather-icons/01d.svg', alt: 'Clear sky' },
  1:  { src: '/weather-icons/02d.svg', alt: 'Mainly clear' },
  2:  { src: '/weather-icons/03d.svg', alt: 'Partly cloudy' },
  3:  { src: '/weather-icons/04.svg',  alt: 'Overcast' },
  45: { src: '/weather-icons/15.svg',  alt: 'Fog' },
  48: { src: '/weather-icons/15.svg',  alt: 'Fog' },
  51: { src: '/weather-icons/46.svg',  alt: 'Light drizzle' },
  53: { src: '/weather-icons/46.svg',  alt: 'Drizzle' },
  55: { src: '/weather-icons/09.svg',  alt: 'Dense drizzle' },
  56: { src: '/weather-icons/47.svg',  alt: 'Freezing drizzle' },
  57: { src: '/weather-icons/12.svg',  alt: 'Dense freezing drizzle' },
  61: { src: '/weather-icons/46.svg',  alt: 'Light rain' },
  63: { src: '/weather-icons/09.svg',  alt: 'Rain' },
  65: { src: '/weather-icons/10.svg',  alt: 'Heavy rain' },
  66: { src: '/weather-icons/47.svg',  alt: 'Freezing rain' },
  67: { src: '/weather-icons/12.svg',  alt: 'Heavy freezing rain' },
  71: { src: '/weather-icons/49.svg',  alt: 'Light snow' },
  73: { src: '/weather-icons/49.svg',  alt: 'Snow' },
  75: { src: '/weather-icons/13.svg',  alt: 'Heavy snow' },
  77: { src: '/weather-icons/13.svg',  alt: 'Snow grains' },
  80: { src: '/weather-icons/40d.svg', alt: 'Light rain showers' },
  81: { src: '/weather-icons/05d.svg', alt: 'Rain showers' },
  82: { src: '/weather-icons/41d.svg', alt: 'Heavy rain showers' },
  85: { src: '/weather-icons/44d.svg', alt: 'Snow showers' },
  86: { src: '/weather-icons/08d.svg', alt: 'Heavy snow showers' },
  95: { src: '/weather-icons/22.svg',  alt: 'Thunderstorm' },
  96: { src: '/weather-icons/11.svg',  alt: 'Thunderstorm with hail' },
  99: { src: '/weather-icons/11.svg',  alt: 'Heavy thunderstorm with hail' },
};

const fallback: WeatherIcon = { src: '/weather-icons/02d.svg', alt: 'Fair weather' };

export function getWeatherIcon(code: number): WeatherIcon {
  return weatherIcons[code] ?? fallback;
}
