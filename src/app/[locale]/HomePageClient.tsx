'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import LocationSearch from '@/components/LocationSearch';
import SettingsMenu from '@/components/SettingsMenu';
import Logo from '@/components/Logo';
import { AlertTriangleIcon } from '@/components/Icons';
import { buildCityPath } from '@/lib/city-url';
import { getAqiColor, getAqiFgColor, getAqiTextColor } from '@/lib/aqi-utils';
import { routing } from '@/i18n/routing';
import { loadPreferences, savePreferences, type StoredLocation, type TempUnit, type Theme } from '@/lib/storage';
import { POPULAR_CITIES, CONTINENT_KEY_TO_SLUG } from '@/lib/popular-cities';
import type { DetectedCity } from './page';

const MapPlaceholder = () => (
  <div>
    <div className="h-[260px] sm:h-[320px] lg:h-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]" />
    <div className="h-5" />
  </div>
);
const HomeMap = dynamic(() => import('@/components/HomeMap'), { ssr: false, loading: MapPlaceholder });

interface Props {
  detectedCity: DetectedCity | null;
  cityAqiLevels?: Record<string, number>;
  cityAqiMax?: Record<string, number>;
  localizedNames?: Record<number, string>;
}

/* ── SVG icons for feature cards ── */
function AqiFocusIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" /><path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" /><path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function FeatherIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
      <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z" />
      <line x1="16" y1="8" x2="2" y2="22" />
      <line x1="17.5" y1="15" x2="9" y2="15" />
    </svg>
  );
}

function ShieldIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function FlaskIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16.5h10" />
    </svg>
  );
}

const AQI_LEVELS = [
  { key: 'good', aqi: 25 },
  { key: 'moderate', aqi: 75 },
  { key: 'unhealthySensitive', aqi: 125 },
  { key: 'unhealthy', aqi: 175 },
  { key: 'veryUnhealthy', aqi: 250 },
  { key: 'hazardous', aqi: 400 },
] as const;

const FEATURE_CARDS = [
  { Icon: AqiFocusIcon, titleKey: 'aqiFocusTitle', descKey: 'aqiFocusDesc' },
  { Icon: FeatherIcon, titleKey: 'fastTitle', descKey: 'fastDesc' },
  { Icon: ShieldIcon, titleKey: 'privacyTitle', descKey: 'privacyDesc' },
  { Icon: FlaskIcon, titleKey: 'dataTitle', descKey: 'dataDesc' },
] as const;

export default function HomePageClient({ detectedCity, cityAqiLevels, cityAqiMax, localizedNames }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [theme, setTheme] = useState<Theme>('light');
  const [aqiMode, setAqiMode] = useState<'now' | 'max'>('now');
  const activeAqi = aqiMode === 'max' ? cityAqiMax : cityAqiLevels;

  useEffect(() => {
    const prefs = loadPreferences();
    if (prefs.tempUnit) setTempUnit(prefs.tempUnit);
    if (prefs.theme) {
      setTheme(prefs.theme);
      document.documentElement.setAttribute('data-theme', prefs.theme);
    }
  }, []);

  const handleLocationSelect = useCallback((loc: StoredLocation) => {
    if (loc.geoId) {
      const cityPath = buildCityPath(loc.name.split(',')[0].trim(), loc.geoId);
      router.push(`/${locale}/${cityPath}`);
    }
  }, [locale, router]);

  function handleLocaleChange(newLocale: string) {
    savePreferences({ locale: newLocale });
  }

  function handleTempUnitChange() {
    const next = tempUnit === 'C' ? 'F' : 'C';
    setTempUnit(next);
    savePreferences({ tempUnit: next });
  }

  function handleThemeChange() {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    savePreferences({ theme: next });
  }

  const cityName = (geoId: number, fallback: string) =>
    localizedNames?.[geoId] || fallback;

  const cityLink = (name: string, geoId: number) =>
    `/${locale}/${buildCityPath(cityName(geoId, name), geoId)}`;

  const homePaths: Record<string, string> = {};
  for (const loc of routing.locales) {
    homePaths[loc] = loc === 'en' ? '/' : `/${loc}`;
  }

  return (
    <main className="max-w-2xl lg:max-w-5xl mx-auto px-4 pb-8 pt-4 space-y-8 relative z-10">
      {/* Header */}
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[var(--color-text)] flex items-center gap-2">
          <Link href="/" aria-label="Air Index Today home" className="flex items-center"><span className="relative z-[-1]"><Logo size={34} /></span></Link>
          <span>{t('meta.h1')}</span>
        </h1>
        <div className="flex items-center gap-1">
          <button
            onClick={handleTempUnitChange}
            className="text-sm font-medium px-2 py-1 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-border)] transition-colors"
          >°{tempUnit}</button>
          <SettingsMenu
            currentLocale={locale}
            theme={theme}
            onLocaleChange={handleLocaleChange}
            onThemeChange={handleThemeChange}
            localizedPaths={homePaths}
          />
        </div>
      </header>

      {/* Hero section */}
      <section className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-base sm:text-lg font-semibold text-[var(--color-text-secondary)]">
            {t('home.hero')}
          </p>
          <p className="text-sm text-[var(--color-text-muted)] max-w-lg mx-auto">
            {t('home.heroSub')}
          </p>
        </div>

        <LocationSearch
          location={null}
          onSelect={handleLocationSelect}
        />

        {detectedCity && (
          <Link
            href={cityLink(detectedCity.name, detectedCity.geoId)}
            prefetch={false}
            className="block p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors"
          >
            <p className="font-semibold text-[var(--color-text)]">
              {detectedCity.name}, {detectedCity.country}
            </p>
            {detectedCity.currentAqi != null && (
              <p className="text-sm text-[var(--color-text-secondary)] mt-0.5">
                {t('city.summaryNow')}{' '}
                <span className="font-medium" style={{ color: getAqiTextColor(detectedCity.currentAqi) }}>AQI {detectedCity.currentAqi}</span>
                {detectedCity.peakAqi != null && (
                  <> · {t('city.summaryPeak')}{' '}
                    <span className="font-medium" style={{ color: getAqiTextColor(detectedCity.peakAqi) }}>AQI {detectedCity.peakAqi}</span>
                    {' '}{t('aqi.at')} {detectedCity.peakHour}
                  </>
                )}
              </p>
            )}
            <p className="text-sm font-semibold text-[var(--color-accent)] mt-1.5">
              {t('home.viewForecast', { city: detectedCity.name })}
            </p>
          </Link>
        )}
      </section>

      {/* Why Air Index Today */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--color-text)]">{t('home.whyTitle')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURE_CARDS.map(({ Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon size={18} />
                <h3 className="font-semibold text-sm text-[var(--color-text)]">
                  {t(`home.${titleKey}`)}
                </h3>
              </div>
              <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                {t(`home.${descKey}`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* AQI Scale */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--color-text)]">{t('home.scaleTitle')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {t('home.scaleIntro')}
        </p>
        <div className="space-y-2">
          {AQI_LEVELS.map(({ key, aqi }) => (
            <div
              key={key}
              className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
            >
              <span
                className="shrink-0 min-w-[4.5rem] px-2 py-1.5 rounded-lg flex items-center justify-center font-bold text-xs whitespace-nowrap"
                style={{ backgroundColor: getAqiColor(aqi), color: getAqiFgColor(aqi) }}
              >
                {t(`home.${key}Range`)}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-[var(--color-text)]">
                  {t(`aqi.${key}`)}
                </p>
                <p className="text-xs text-[var(--color-text-secondary)]">
                  {t(`home.${key}Desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">{t('home.scaleSrc')}</p>
      </section>

      {/* Why check AQI daily */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--color-text)]">{t('home.whyMattersTitle')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {t('home.whyMattersText')}
        </p>
      </section>

      {/* How AQI is calculated */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--color-text)]">{t('home.whatTitle')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {t('home.whatText')}
        </p>
      </section>

      {/* Popular Cities */}
      <section className="space-y-4">
        <h2 className="text-base font-bold text-[var(--color-text)]">{t('home.citiesTitle')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {t('home.citiesIntro')}
        </p>
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden text-xs font-medium">
            <button
              onClick={() => setAqiMode('now')}
              className={`px-2.5 py-1 transition-colors ${aqiMode === 'now' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}
            >{t('aqi.now')}</button>
            <button
              onClick={() => setAqiMode('max')}
              className={`px-2.5 py-1 transition-colors ${aqiMode === 'max' ? 'bg-[var(--color-accent)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}
            >{t('aqi.todayMax')}</button>
          </div>
        </div>
        <HomeMap cities={Object.values(POPULAR_CITIES).flat().map(c => ({ ...c, name: cityName(c.geoId, c.name) }))} aqiLevels={activeAqi} />
        {(Object.keys(POPULAR_CITIES) as Array<keyof typeof POPULAR_CITIES>).map((region) => (
          <div key={region}>
            <h3 className="text-sm font-semibold mb-1.5">
              <Link
                href={`/${locale}/continent/${CONTINENT_KEY_TO_SLUG[region]}`}
                prefetch={false}
                className="text-[var(--color-accent)] hover:underline"
              >
                {t(`home.${region}`)} →
              </Link>
            </h3>
            <div className="flex flex-wrap gap-x-1 gap-y-0.5">
              {[...POPULAR_CITIES[region]].sort((a, b) => cityName(a.geoId, a.name).localeCompare(cityName(b.geoId, b.name))).map((city, i) => {
                const aqiKey = `${city.lat},${city.lon}`;
                const aqi = activeAqi?.[aqiKey];
                return (
                <span key={city.geoId}>
                  <Link
                    href={cityLink(city.name, city.geoId)}
                    prefetch={false}
                    className="text-sm text-[var(--color-accent)] hover:underline"
                  >
                    {cityName(city.geoId, city.name)}
                    {aqi != null && (
                      <span
                        className="ml-0.5 text-xs font-medium"
                        style={{ color: getAqiTextColor(aqi) }}
                      >
                        {aqi}
                      </span>
                    )}
                  </Link>
                  {i < POPULAR_CITIES[region].length - 1 && (
                    <span className="text-[var(--color-text-muted)]"> · </span>
                  )}
                </span>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* About the site */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-[var(--color-text)]">{t('home.siteDescTitle')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {t('home.siteDescText')}
        </p>
      </section>

      {/* Footer */}
      <footer className="text-sm text-[var(--color-text-muted)] space-y-3 pt-4 border-t border-[var(--color-border)]">
        <div className="text-center text-sm space-y-1">
          <p>
            {t('sources.aqiData')}{' '}
            <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text-secondary)]">
              Open-Meteo.com
            </a>
            {' '}(CAMS/Copernicus)
          </p>
          <p>
            {t('sources.geodata')}{' '}
            <a href="https://www.geonames.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text-secondary)]">
              GeoNames
            </a>
            {' '}(CC BY 4.0)
          </p>
          <p>
            airindex.today uses the IP2Location LITE database for{' '}
            <a href="https://lite.ip2location.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[var(--color-text-secondary)]">
              IP geolocation
            </a>.
          </p>
        </div>
        <div className="space-y-2 text-sm leading-relaxed border-t border-[var(--color-border)] pt-3">
          <div className="flex items-center justify-center gap-1.5 font-medium text-[var(--color-text-secondary)]">
            <AlertTriangleIcon size={13} />
            {t('disclaimer.heading')}
          </div>
          <p>{t('disclaimer.general')}</p>
          <p>{t('disclaimer.accuracy')}</p>
          <p>{t('disclaimer.externalApi')}</p>
        </div>
        <div className="text-center text-xs text-[var(--color-text-muted)] border-t border-[var(--color-border)] pt-3 space-y-2">
          <div className="flex justify-center gap-3">
            <Link href={`/${locale}/about`} prefetch={false} className="hover:underline hover:text-[var(--color-text-secondary)]">{t('footer.about')}</Link>
            <span>·</span>
            <Link href={`/${locale}/privacy`} prefetch={false} className="hover:underline hover:text-[var(--color-text-secondary)]">{t('footer.privacy')}</Link>
            <span>·</span>
            <a href="https://simplemeteo.com/contact" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-[var(--color-text-secondary)]">{t('footer.contact')}</a>
          </div>
          <div>© {new Date().getFullYear()} airindex.today — a{' '}
          <a href="https://simplemeteo.com" target="_blank" rel="noopener" className="underline hover:text-[var(--color-text-secondary)]">
            SimpleMeteo
          </a>{' '}
          project</div>
        </div>
      </footer>
    </main>
  );
}
