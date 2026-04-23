'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import TopHeader from '@/components/TopHeader';
import { AlertTriangleIcon, MapPinIcon } from '@/components/Icons';
import { buildCityPath } from '@/lib/city-url';
import { getAqiColor, getAqiFgColor, getAqiTextColor, getAqiCategory } from '@/lib/aqi-utils';
import { countryCodeToFlag } from '@/lib/flag';
import { getWeatherIcon } from '@/lib/weather-icons';
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
function PollutantsIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
      <path d="M2 20h20" />
      <path d="M6 20v-6" /><path d="M10 20v-10" /><path d="M14 20v-4" /><path d="M18 20v-14" />
    </svg>
  );
}

function CalendarIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
      <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
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

function SatelliteIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--color-primary)]">
      <rect x="9" y="9" width="6" height="6" rx="1" />
      <path d="M4 10h5" />
      <path d="M15 10h5" />
      <path d="M4 14h5" />
      <path d="M15 14h5" />
      <path d="M12 9V5" />
      <path d="M10 5h4" />
      <path d="M12 15v4" />
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
  { Icon: PollutantsIcon, titleKey: 'aqiFocusTitle', descKey: 'aqiFocusDesc' },
  { Icon: CalendarIcon,  titleKey: 'fastTitle',      descKey: 'fastDesc'      },
  { Icon: ShieldIcon,    titleKey: 'privacyTitle',   descKey: 'privacyDesc'   },
  { Icon: SatelliteIcon, titleKey: 'dataTitle',      descKey: 'dataDesc'      },
] as const;

export default function HomePageClient({ detectedCity, cityAqiLevels, cityAqiMax, localizedNames }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [tempUnit, setTempUnit] = useState<TempUnit>('C');
  const [theme, setTheme] = useState<Theme>('light');
  const [aqiMode, setAqiMode] = useState<'now' | 'max'>('now');
  const [expandedRegions, setExpandedRegions] = useState<Record<string, boolean>>({});
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

  const handleDetectLocation = useCallback(async () => {
    try {
      const res = await fetch('/api/geo');
      const data = await res.json();
      if (data.detected && data.city) {
        const geoRes = await fetch(`/api/geocode?q=${encodeURIComponent(data.city)}&lang=${locale}`);
        if (geoRes.ok) {
          const results = await geoRes.json();
          if (Array.isArray(results) && results.length > 0) {
            const best = results[0];
            router.push(`/${locale}/${buildCityPath(best.name, best.id)}`);
          }
        }
      }
    } catch { /* silent */ }
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

  const homeMapCities = useMemo(() => {
    const out: Array<{ name: string; geoId: number; lat: number; lon: number; country?: string }> = [];
    for (const region of Object.keys(POPULAR_CITIES) as Array<keyof typeof POPULAR_CITIES>) {
      for (const c of POPULAR_CITIES[region]) {
        out.push({ ...c, name: cityName(c.geoId, c.name) });
      }
    }
    return out;
  }, [localizedNames]);

  const homePaths: Record<string, string> = {};
  for (const loc of routing.locales) {
    homePaths[loc] = loc === 'en' ? '/' : `/${loc}`;
  }

  const allCitiesFlat = useMemo(() => {
    const out: Array<{ geoId: number; name: string; lat: number; lon: number; country?: string }> = [];
    for (const region of Object.keys(POPULAR_CITIES) as Array<keyof typeof POPULAR_CITIES>) {
      for (const c of POPULAR_CITIES[region]) out.push(c);
    }
    return out;
  }, []);

  return (
    <>
      <TopHeader
        tempUnit={tempUnit}
        theme={theme}
        onTempUnitChange={handleTempUnitChange}
        onLocaleChange={handleLocaleChange}
        onThemeChange={handleThemeChange}
        localizedPaths={homePaths}
        onSelect={handleLocationSelect}
        onDetectLocation={handleDetectLocation}
      />
      <main className="max-w-2xl lg:max-w-7xl xl:max-w-[88rem] 2xl:max-w-[96rem] mx-auto px-4 pb-8 pt-4 space-y-8 relative z-10">
        {/* Hero section */}
        <section className="space-y-4">
          <div className="a-hero">
            <div className="a-hero-meta" aria-hidden="true">
              <span><span className="dot" />{t('home.metaLive', { total: allCitiesFlat.length })}</span>
              <span>{t('home.metaSources')}</span>
            </div>
            <h2 className="a-hero-h1">{t('home.hero')}</h2>
            <p className="a-hero-sub">{t('home.heroSub')}</p>
          </div>
        </section>

        {/* Snapshot: (optional detected) + map + leaderboard */}
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="a-section-h">{t('home.citiesTitle')}</h2>
            <div className="inline-flex rounded-lg border border-[var(--color-border)] overflow-hidden text-xs font-medium">
              <button
                onClick={() => setAqiMode('now')}
                className={`px-2.5 py-1 transition-colors ${aqiMode === 'now' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}
              >{t('aqi.now')}</button>
              <button
                onClick={() => setAqiMode('max')}
                className={`px-2.5 py-1 transition-colors ${aqiMode === 'max' ? 'bg-[var(--color-primary)] text-white' : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]'}`}
              >{t('aqi.todayMax')}</button>
            </div>
          </div>
          <div className="a-snapshot">
            {detectedCity ? (
              <Link
                href={cityLink(detectedCity.name, detectedCity.geoId)}
                prefetch={false}
                className="a-detected-panel"
              >
                <span className="auto-tag">{t('home.detectedTag')}</span>
                <div className="head-row">
                  <h3>{detectedCity.name}</h3>
                  {detectedCity.currentTemp != null && detectedCity.currentWeatherCode != null && (
                    <span className="weather-chips">
                      <span className="chip">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getWeatherIcon(detectedCity.currentWeatherCode).src}
                          alt=""
                          width={18}
                          height={18}
                        />
                        <span>
                          {tempUnit === 'F'
                            ? Math.round(detectedCity.currentTemp * 9 / 5 + 32)
                            : Math.round(detectedCity.currentTemp)}°{tempUnit}
                        </span>
                      </span>
                    </span>
                  )}
                </div>
                <div className="country">{detectedCity.country}</div>
                {(() => {
                  // Respect the Now / Today-max toggle.
                  const raw = aqiMode === 'max' ? detectedCity.peakAqi : detectedCity.currentAqi;
                  if (raw == null) return null;
                  const aqi = raw;
                  const color = getAqiTextColor(aqi);
                  // Gauge scales to aqi/500 (full EPA scale).
                  const pct = Math.max(0, Math.min(1, aqi / 500));
                  const CIRC = 2 * Math.PI * 62; // r=62
                  const cat = getAqiCategory(aqi);
                  const category = t(`aqi.${cat}` as never);
                  const adviceText = t(`aqi.advice_${cat}` as never) as string;
                  const items = adviceText.split('|').map(s => s.trim()).filter(Boolean);
                  return (
                    <>
                      <div className="gauge-col">
                        <div className="gauge">
                          <svg viewBox="0 0 144 144" aria-hidden="true">
                            <circle className="track" cx="72" cy="72" r="62" />
                            <circle
                              className="bar"
                              cx="72"
                              cy="72"
                              r="62"
                              stroke={color}
                              strokeDasharray={CIRC}
                              strokeDashoffset={CIRC * (1 - pct)}
                            />
                          </svg>
                          <div className="center">
                            <span className="n" style={{ color }}>{aqi}</span>
                            <span className="lbl-now">{aqiMode === 'max' ? t('aqi.todayMax') : t('aqi.now')}</span>
                          </div>
                        </div>
                        <div className="category" style={{ color }}>{category}</div>
                      </div>
                      <ul className="advice-list">
                        {items.map((item, i) => (
                          <li key={i}>
                            <span className="sw" style={{ backgroundColor: getAqiColor(aqi) }} />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="peak-row">
                        {aqiMode !== 'max' && detectedCity.peakAqi != null && detectedCity.peakHour && (
                          <span>
                            <span className="k">{t('city.summaryPeak')}</span>{' '}
                            <span className="v" style={{ color: getAqiTextColor(detectedCity.peakAqi) }}>AQI {detectedCity.peakAqi}</span>
                            {' · '}{detectedCity.peakHour}
                          </span>
                        )}
                        {aqiMode === 'max' && detectedCity.peakHour && (
                          <span>
                            <span className="k">{t('city.summaryPeak')}</span>{' · '}{detectedCity.peakHour}
                          </span>
                        )}
                        {detectedCity.tomorrowPeakAqi != null && detectedCity.tomorrowPeakHour && (
                          <span>
                            <span className="k">{t('aqi.tomorrow')}</span>{' '}
                            <span className="v" style={{ color: getAqiTextColor(detectedCity.tomorrowPeakAqi) }}>AQI {detectedCity.tomorrowPeakAqi}</span>
                            {' · '}{detectedCity.tomorrowPeakHour}
                          </span>
                        )}
                      </div>
                    </>
                  );
                })()}
                <div className="cta">
                  <span>{t('home.viewForecast', { city: detectedCity.name })}</span>
                  <span className="hint">{t('home.detectedHint')}</span>
                </div>
              </Link>
            ) : (
              <div className="a-detected-panel empty">
                <MapPinIcon size={28} className="text-[var(--color-primary)] mx-auto" />
                <p className="prompt">{t('home.detectPrompt')}</p>
                <button
                  type="button"
                  className="detect-btn"
                  onClick={handleDetectLocation}
                >
                  {t('location.detectMyLocation')}
                </button>
              </div>
            )}
            <div className="a-snap-panel">
              <h3>{t('home.liveWorldMap')}</h3>
              <div className="-mx-2 -mb-2 rounded-lg overflow-hidden">
                <HomeMap cities={homeMapCities} aqiLevels={activeAqi} />
              </div>
            </div>
            <div className="a-snap-panel">
              <h3>{t('home.highestNow')}</h3>
              <table className="a-leaderboard">
                <thead>
                  <tr><th>#</th><th>{t('home.cityCol')}</th><th className="num">AQI</th></tr>
                </thead>
                <tbody>
                  {(() => {
                    const ranked = allCitiesFlat
                      .map((c) => ({ c, aqi: activeAqi?.[`${c.lat},${c.lon}`] }))
                      .filter((x): x is { c: typeof allCitiesFlat[number]; aqi: number } => typeof x.aqi === 'number')
                      .sort((a, b) => b.aqi - a.aqi)
                      .slice(0, 10);
                    return ranked.map(({ c, aqi }, i) => {
                      const flag = countryCodeToFlag(c.country);
                      return (
                        <tr key={c.geoId}>
                          <td className="rank">{i + 1}</td>
                          <td>
                            <Link href={cityLink(c.name, c.geoId)} prefetch={false}>
                              {flag && <span className="a-flag" aria-hidden="true">{flag}</span>}
                              {cityName(c.geoId, c.name)}
                            </Link>
                          </td>
                          <td className="num" style={{ color: getAqiTextColor(aqi) }}>{aqi}</td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
              <p className="caveat">{t('ticker.caveat', { total: allCitiesFlat.length })}</p>
            </div>
          </div>
        </section>

      {/* Why airindex */}
      <section className="space-y-3">
        <h2 className="a-section-h">{t('home.whyTitle')}</h2>
        <div className="a-features">
          {FEATURE_CARDS.map(({ Icon, titleKey, descKey }) => (
            <div key={titleKey} className="a-feat">
              <div className="ico"><Icon size={18} /></div>
              <h3>{t(`home.${titleKey}`)}</h3>
              <p>{t(`home.${descKey}`)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AQI Scale */}
      <section className="space-y-3">
        <h2 className="a-section-h">{t('home.scaleTitle')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {t('home.scaleIntro')}
        </p>
        <div className="a-scale">
          {AQI_LEVELS.map(({ key, aqi }) => (
            <div key={key} className="a-scale-row">
              <span className="sw" style={{ backgroundColor: getAqiColor(aqi), color: getAqiFgColor(aqi) }} />
              <span className="k">{t(`aqi.${key}`)}</span>
              <span className="r">{t(`home.${key}Range`)}</span>
              <span className="d">{t(`home.${key}Desc`)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">{t('home.scaleSrc')}</p>
      </section>

      {/* Why check AQI daily */}
      <section className="space-y-3">
        <h2 className="a-section-h">{t('home.whyMattersTitle')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {t('home.whyMattersText')}
        </p>
      </section>

      {/* How the AQI is calculated */}
      <section className="space-y-3">
        <h2 className="a-section-h">{t('home.whatTitle')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {t('home.whatText')}
        </p>
      </section>

      {/* Popular Cities — browse by continent */}
      <section className="space-y-4">
        <h2 className="a-section-h">{t('home.browseTitle')}</h2>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {t('home.citiesIntro')}
        </p>
        {(Object.keys(POPULAR_CITIES) as Array<keyof typeof POPULAR_CITIES>).map((region) => {
          const sorted = [...POPULAR_CITIES[region]].sort((a, b) => cityName(a.geoId, a.name).localeCompare(cityName(b.geoId, b.name)));
          const isExpanded = !!expandedRegions[region];
          const visible = isExpanded ? sorted : sorted.slice(0, 20);
          const hasMore = sorted.length > 20;
          return (
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
              {visible.map((city, i) => {
                const aqiKey = `${city.lat},${city.lon}`;
                const aqi = activeAqi?.[aqiKey];
                const flag = countryCodeToFlag(city.country);
                return (
                <span key={city.geoId}>
                  <Link
                    href={cityLink(city.name, city.geoId)}
                    prefetch={false}
                    className="text-sm text-[var(--color-accent)] hover:underline"
                  >
                    {flag && <span className="a-flag" aria-hidden="true">{flag}</span>}
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
                  {i < visible.length - 1 && (
                    <span className="text-[var(--color-text-muted)]"> · </span>
                  )}
                </span>
                );
              })}
              {hasMore && (
                <span>
                  <span className="text-[var(--color-text-muted)]"> · </span>
                  <button
                    type="button"
                    className="a-expand-link"
                    onClick={() => setExpandedRegions(prev => ({ ...prev, [region]: !prev[region] }))}
                    aria-expanded={isExpanded}
                  >
                    {isExpanded
                      ? t('home.showLess')
                      : t('home.showAllCities', { count: sorted.length })}
                  </button>
                </span>
              )}
            </div>
          </div>
          );
        })}
      </section>

      {/* About the site */}
      <section className="space-y-3">
        <h2 className="a-section-h">{t('home.siteDescTitle')}</h2>
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
    </>
  );
}
