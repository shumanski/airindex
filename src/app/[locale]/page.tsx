import { fetchAqiData } from '@/lib/aqi-api';
import { roundCoord } from '@/lib/cache';
import HomePageClient from './HomePageClient';

const DEFAULT_LAT = 48.86;
const DEFAULT_LON = 2.35;

export default async function HomePage() {
  const initialAqiData = await fetchAqiData(roundCoord(DEFAULT_LAT), roundCoord(DEFAULT_LON)).catch(() => null);

  return <HomePageClient initialAqiData={initialAqiData} />;
}
