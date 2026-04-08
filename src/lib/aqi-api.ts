import { getCached, setCache, getCacheKey } from './cache';

export interface HourlyAqi {
  time: string;
  usAqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
  temperature: number;
  weatherCode: number;
}

export interface DailyAqiPeak {
  date: string;
  peakAqi: number;
  weatherCode: number;
  tempMax?: number;
  tempMin?: number;
}

export interface AqiData {
  latitude: number;
  longitude: number;
  currentAqi: number;
  currentPm25: number;
  currentPm10: number;
  currentNo2: number;
  currentO3: number;
  currentSo2: number;
  currentCo: number;
  currentTemp: number;
  currentWeatherCode: number;
  currentHour: number;
  todayHourly: HourlyAqi[];
  tomorrowHourly: HourlyAqi[];
  todayPeak: { aqi: number; hour: string };
  tomorrowPeak: { aqi: number; hour: string };
  timezone: string;
  dailyPeaks: DailyAqiPeak[];
}

export async function fetchAqiData(lat: number, lon: number): Promise<AqiData> {
  const cacheKey = getCacheKey(lat, lon);
  const cached = getCached<AqiData>(cacheKey);
  if (cached) return cached;

  const data = await fetchAqiDataFromApi(lat, lon);
  setCache(cacheKey, data as unknown as Record<string, unknown>);
  return data;
}

async function fetchAqiDataFromApi(lat: number, lon: number): Promise<AqiData> {
  const apiKey = process.env.OPENMETEO_API_KEY;
  const aqiHost = apiKey ? 'customer-air-quality-api.open-meteo.com' : 'air-quality-api.open-meteo.com';
  const weatherHost = apiKey ? 'customer-api.open-meteo.com' : 'api.open-meteo.com';

  const aqiUrl = new URL(`https://${aqiHost}/v1/air-quality`);
  aqiUrl.searchParams.set('latitude', lat.toString());
  aqiUrl.searchParams.set('longitude', lon.toString());
  aqiUrl.searchParams.set('hourly', [
    'us_aqi',
    'pm10', 'pm2_5', 'nitrogen_dioxide', 'ozone', 'sulphur_dioxide', 'carbon_monoxide',
  ].join(','));
  aqiUrl.searchParams.set('forecast_days', '5');
  aqiUrl.searchParams.set('timezone', 'auto');
  if (apiKey) aqiUrl.searchParams.set('apikey', apiKey);

  const weatherUrl = new URL(`https://${weatherHost}/v1/forecast`);
  weatherUrl.searchParams.set('latitude', lat.toString());
  weatherUrl.searchParams.set('longitude', lon.toString());
  weatherUrl.searchParams.set('hourly', 'temperature_2m,weather_code');
  weatherUrl.searchParams.set('daily', 'weather_code,temperature_2m_max,temperature_2m_min');
  weatherUrl.searchParams.set('forecast_days', '5');
  weatherUrl.searchParams.set('timezone', 'auto');
  if (apiKey) weatherUrl.searchParams.set('apikey', apiKey);

  const [aqiRes, weatherRes] = await Promise.all([
    fetch(aqiUrl.toString()),
    fetch(weatherUrl.toString()),
  ]);

  if (!aqiRes.ok) throw new Error(`AQI API error: ${aqiRes.status}`);
  if (!weatherRes.ok) throw new Error(`Weather API error: ${weatherRes.status}`);

  const [aqiData, weatherData] = await Promise.all([aqiRes.json(), weatherRes.json()]);

  if (!aqiData?.hourly?.time) throw new Error('AQI API returned unexpected structure');

  const times: string[] = aqiData.hourly.time;
  const usAqiValues: number[] = aqiData.hourly.us_aqi ?? [];
  const pm25Values: number[] = aqiData.hourly.pm2_5 ?? [];
  const pm10Values: number[] = aqiData.hourly.pm10 ?? [];
  const no2Values: number[] = aqiData.hourly.nitrogen_dioxide ?? [];
  const o3Values: number[] = aqiData.hourly.ozone ?? [];
  const so2Values: number[] = aqiData.hourly.sulphur_dioxide ?? [];
  const coValues: number[] = aqiData.hourly.carbon_monoxide ?? [];

  const wTimes: string[] = weatherData?.hourly?.time ?? [];
  const temperatures: number[] = weatherData?.hourly?.temperature_2m ?? [];
  const weatherCodes: number[] = weatherData?.hourly?.weather_code ?? [];
  const timezone: string = aqiData.timezone || weatherData?.timezone || 'UTC';

  // Build weather lookup by time
  const tempByTime = new Map<string, number>();
  const wcByTime = new Map<string, number>();
  for (let i = 0; i < wTimes.length; i++) {
    tempByTime.set(wTimes[i], temperatures[i] ?? 0);
    wcByTime.set(wTimes[i], weatherCodes[i] ?? 0);
  }

  const now = new Date();
  const nowLocal = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  const currentHour = nowLocal.getHours();
  const todayStr = times[0]?.slice(0, 10) ?? '';

  const todayHourly: HourlyAqi[] = [];
  const tomorrowHourly: HourlyAqi[] = [];
  let tomorrowStr = '';

  for (let i = 0; i < times.length; i++) {
    const dateStr = times[i].slice(0, 10);
    const entry: HourlyAqi = {
      time: times[i],
      usAqi: usAqiValues[i] ?? 0,
      pm25: pm25Values[i] ?? 0,
      pm10: pm10Values[i] ?? 0,
      no2: no2Values[i] ?? 0,
      o3: o3Values[i] ?? 0,
      so2: so2Values[i] ?? 0,
      co: coValues[i] ?? 0,
      temperature: tempByTime.get(times[i]) ?? 0,
      weatherCode: wcByTime.get(times[i]) ?? 0,
    };
    if (dateStr === todayStr) {
      todayHourly.push(entry);
    } else {
      if (!tomorrowStr) tomorrowStr = dateStr;
      if (dateStr === tomorrowStr) {
        tomorrowHourly.push(entry);
      }
    }
  }

  const dailyPeaks = buildDailyPeaks(
    times, usAqiValues,
    weatherData.daily?.time as string[] | undefined,
    weatherData.daily?.weather_code as number[] | undefined,
    weatherData.daily?.temperature_2m_max as number[] | undefined,
    weatherData.daily?.temperature_2m_min as number[] | undefined,
  );

  const todayPeak = findPeak(todayHourly);
  const tomorrowPeak = findPeak(tomorrowHourly);

  const currentIndex = Math.min(currentHour, todayHourly.length - 1);
  const cur = todayHourly[currentIndex];

  return {
    latitude: aqiData.latitude,
    longitude: aqiData.longitude,
    currentAqi: cur?.usAqi ?? 0,
    currentPm25: cur?.pm25 ?? 0,
    currentPm10: cur?.pm10 ?? 0,
    currentNo2: cur?.no2 ?? 0,
    currentO3: cur?.o3 ?? 0,
    currentSo2: cur?.so2 ?? 0,
    currentCo: cur?.co ?? 0,
    currentTemp: cur?.temperature ?? 0,
    currentWeatherCode: cur?.weatherCode ?? 0,
    currentHour,
    todayHourly,
    tomorrowHourly,
    todayPeak,
    tomorrowPeak,
    timezone,
    dailyPeaks,
  };
}

function findPeak(hourly: HourlyAqi[]): { aqi: number; hour: string } {
  let maxAqi = 0;
  let peakEntry: HourlyAqi | null = null;
  for (const entry of hourly) {
    if (entry.usAqi > maxAqi) {
      maxAqi = entry.usAqi;
      peakEntry = entry;
    }
  }
  const hour = peakEntry?.time ? peakEntry.time.slice(11, 16) : '12:00';
  return { aqi: maxAqi, hour };
}

function buildDailyPeaks(
  times: string[], usAqi: number[],
  dailyDates: string[] | undefined,
  dailyWeatherCodes: number[] | undefined,
  dailyTempMax: number[] | undefined,
  dailyTempMin: number[] | undefined,
): DailyAqiPeak[] {
  const byDate = new Map<string, number>();
  for (let i = 0; i < times.length; i++) {
    const date = times[i].slice(0, 10);
    const prev = byDate.get(date) ?? 0;
    byDate.set(date, Math.max(prev, usAqi[i] ?? 0));
  }

  const weatherByDate = new Map<string, number>();
  const tempMaxByDate = new Map<string, number>();
  const tempMinByDate = new Map<string, number>();
  if (dailyDates) {
    for (let i = 0; i < dailyDates.length; i++) {
      if (dailyWeatherCodes) weatherByDate.set(dailyDates[i], dailyWeatherCodes[i] ?? 0);
      if (dailyTempMax) tempMaxByDate.set(dailyDates[i], dailyTempMax[i]);
      if (dailyTempMin) tempMinByDate.set(dailyDates[i], dailyTempMin[i]);
    }
  }

  const includeDates = dailyDates ? new Set(dailyDates) : null;
  const result: DailyAqiPeak[] = [];
  for (const [date, peakAqi] of byDate) {
    if (includeDates && !includeDates.has(date)) continue;
    result.push({
      date,
      peakAqi,
      weatherCode: weatherByDate.get(date) ?? 0,
      tempMax: tempMaxByDate.get(date),
      tempMin: tempMinByDate.get(date),
    });
  }
  return result;
}
