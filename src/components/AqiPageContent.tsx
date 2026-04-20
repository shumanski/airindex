'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import dynamic from 'next/dynamic';
import AqiDisplay from './AqiDisplay';
import AqiChart from './AqiChart';
import PollutantBreakdown from './PollutantBreakdown';
import PollutantAqi from './PollutantAqi';
import { AlertTriangleIcon } from './Icons';
import { getAqiCategory } from '@/lib/aqi-utils';
import { slugify } from '@/lib/city-url';
import type { TempUnit } from '@/lib/storage';
import type { AqiData } from '@/lib/aqi-api';
import type { NearbyCityResult } from '@/lib/geocode-api';
import Link from 'next/link';

const AqiTrend = dynamic(() => import('./AqiTrend'));
const SeoContent = dynamic(() => import('./SeoContent'));
const FeedbackWidget = dynamic(() => import('./FeedbackWidget'), { ssr: false });
const CityMap = dynamic(() => import('./CityMap'), {
  ssr: false,
  loading: () => <div className="h-[220px] lg:h-[380px] rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)]" />,
});

export interface CityData {
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
  population?: number;
}

interface Props {
  aqiData: AqiData | null;
  loading: boolean;
  tempUnit: TempUnit;
  cityName?: string;
  geoId?: number;
  nearbyCities?: NearbyCityResult[];
  nearbyAqiCurrent?: Record<string, number>;
  nearbyAqiMax?: Record<string, number>;
  cityData?: CityData;
  showFeedback?: boolean;
}

function pickDefaultTab(aqiData: AqiData): 'now' | 'peakToday' | 'peakTomorrow' {
  if (aqiData.currentAqi > 0) return 'now';
  return 'peakToday';
}

function formatPopulation(pop: number, locale: string): string {
  if (pop < 10_000) return pop.toLocaleString(locale);
  return '≈\u2009' + new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumSignificantDigits: 3,
  }).format(pop);
}

function formatUtcOffset(tz: string): string {
  try {
    const now = new Date();
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(now);
    const offset = parts.find(p => p.type === 'timeZoneName')?.value ?? '';
    return offset.replace('GMT', 'UTC');
  } catch {
    return '';
  }
}

export default function AqiPageContent({
  aqiData,
  loading,
  tempUnit,
  cityName,
  geoId,
  nearbyCities,
  nearbyAqiCurrent,
  nearbyAqiMax,
  cityData,
  showFeedback,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'now' | 'peakToday' | 'peakTomorrow'>(
    aqiData ? pickDefaultTab(aqiData) : 'now'
  );
  const [hasAutoSelected, setHasAutoSelected] = useState(!!aqiData);

  useEffect(() => {
    if (aqiData && !hasAutoSelected) {
      setActiveTab(pickDefaultTab(aqiData));
      setHasAutoSelected(true);
    }
  }, [aqiData, hasAutoSelected]);

  function formatShortDate(isoTime: string): string {
    const date = new Date(isoTime.length <= 16 ? isoTime + ':00' : isoTime);
    return date.toLocaleDateString(locale, { month: 'short', day: 'numeric' });
  }

  const tabAqi = !aqiData ? 0
    : activeTab === 'peakToday' ? aqiData.todayPeak.aqi
    : activeTab === 'peakTomorrow' ? aqiData.tomorrowPeak.aqi
    : aqiData.currentAqi;

  const tabLabel = !aqiData ? ''
    : activeTab === 'peakToday' ? `${t('aqi.todayMax')}, ${formatShortDate(aqiData.todayHourly[0].time)}`
    : activeTab === 'peakTomorrow' ? `${t('aqi.tomorrowMax')}, ${formatShortDate(aqiData.tomorrowHourly[0].time)}`
    : `${t('aqi.now')}, ${formatShortDate(aqiData.todayHourly[0].time)}`;

  const tabPeakTime = activeTab === 'peakToday' ? aqiData?.todayPeak.hour
    : activeTab === 'peakTomorrow' ? aqiData?.tomorrowPeak.hour
    : aqiData ? `${String(aqiData.currentHour).padStart(2, '0')}:00` : undefined;

  return (
    <>
      {loading && !aqiData && (
        <div className="flex justify-center py-12 min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-[var(--color-border)] border-t-[var(--color-accent)] rounded-full animate-spin" />
        </div>
      )}

      {!loading && !aqiData && (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          <p>{t('aqi.loadError')}</p>
        </div>
      )}

      {aqiData && (
        <>
          <div className="flex flex-col gap-4 lg:grid lg:grid-cols-[2fr_3fr] lg:items-start">
            <div className="contents lg:flex lg:flex-col lg:gap-4">
              {/* AQI Display */}
              <section className="order-1 lg:order-none bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
                <div className="flex border-b border-[var(--color-border)] mb-2">
                  {(['now', 'peakToday', 'peakTomorrow'] as const).map((key) => (
                    <button
                      key={key}
                      onClick={() => setActiveTab(key)}
                      className={`flex-1 px-2 py-2 text-sm font-medium transition-colors relative ${
                        activeTab === key
                          ? 'text-[var(--color-text)]'
                          : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]'
                      }`}
                    >
                      {key === 'now' ? t('aqi.now') : key === 'peakToday' ? t('aqi.todayMax') : t('aqi.tomorrowMax')}
                      {activeTab === key && (
                        <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-[var(--color-accent)] rounded-full" />
                      )}
                    </button>
                  ))}
                </div>
                <AqiDisplay
                  aqi={tabAqi}
                  label={tabLabel}
                  peakTime={tabPeakTime}
                  isPeak={activeTab !== 'now'}
                />
                <p className="text-xs text-[var(--color-text-muted)] text-center -mt-1 mb-1">{t('aqi.modelNote')}</p>
                {/* Pollutant sub-AQI inline */}
                <PollutantAqi
                  aqiPm25={aqiData.currentAqiPm25}
                  aqiPm10={aqiData.currentAqiPm10}
                  aqiNo2={aqiData.currentAqiNo2}
                  aqiO3={aqiData.currentAqiO3}
                  aqiSo2={aqiData.currentAqiSo2}
                  aqiCo={aqiData.currentAqiCo}
                />
                {/* Health advice */}
                {(() => {
                  const category = getAqiCategory(Math.round(tabAqi));
                  const adviceText = t(`aqi.advice_${category}`);
                  const items = adviceText.split('|').map(s => s.trim());
                  return (
                    <div className="flex flex-col items-start gap-1 pt-2 border-t border-[var(--color-border)] mt-2">
                      {items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm">
                          <span className="w-1.5 h-1.5 mt-1.5 rounded-full flex-shrink-0 bg-[var(--color-text-muted)]" />
                          <span className="text-[var(--color-text-secondary)]">{item}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </section>

              {/* WHO Guidelines */}
              <div className="order-2 lg:order-none">
                <PollutantBreakdown
                  pm25={aqiData.currentPm25}
                  pm10={aqiData.currentPm10}
                  no2={aqiData.currentNo2}
                  o3={aqiData.currentO3}
                  so2={aqiData.currentSo2}
                  co={aqiData.currentCo}
                />
              </div>

              {/* 5-Day Trend */}
              {aqiData.dailyPeaks.length >= 3 && (
                <div className="order-6 lg:order-none">
                  <AqiTrend dailyPeaks={aqiData.dailyPeaks} tempUnit={tempUnit} cityName={cityName} />
                </div>
              )}
            </div>

            <div className="contents lg:flex lg:flex-col lg:gap-4">
              {/* Today Chart - order-3 on mobile, right after pollutant contributions */}
              <section className="order-3 lg:order-none bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
                <AqiChart
                  hourly={aqiData.todayHourly}
                  currentHour={aqiData.currentHour}
                  peakAqi={aqiData.todayPeak.aqi}
                  peakHour={aqiData.todayPeak.hour}
                  timezone={aqiData.timezone}
                  tempUnit={tempUnit}
                  cityName={cityName}
                />
              </section>

              {/* Tomorrow Chart */}
              <section className="order-4 lg:order-none bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
                <AqiChart
                  hourly={aqiData.tomorrowHourly}
                  peakAqi={aqiData.tomorrowPeak.aqi}
                  peakHour={aqiData.tomorrowPeak.hour}
                  timezone={aqiData.timezone}
                  tempUnit={tempUnit}
                  dayLabel={t('aqi.tomorrow')}
                  chartId="-tomorrow"
                  cityName={cityName}
                />
              </section>

              {/* City info */}
              {cityData && cityName && (
                <section className="order-7 lg:order-none bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
                  <h2 className="text-base font-semibold text-[var(--color-text-secondary)] mb-3">{t('cityInfo.heading', { city: cityName })}</h2>
                  <div className="space-y-2 text-sm text-[var(--color-text-secondary)]">
                    <div className="flex justify-between">
                      <span>{t('cityInfo.country')}</span>
                      <span className="font-medium">{cityData.country}{cityData.admin1 ? `, ${cityData.admin1}` : ''}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('cityInfo.timezone')}</span>
                      <span className="font-medium">{aqiData.timezone.replace(/_/g, ' ')} ({formatUtcOffset(aqiData.timezone)})</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('cityInfo.coordinates')}</span>
                      <span className="font-medium">{Math.abs(cityData.latitude).toFixed(2)}° {cityData.latitude >= 0 ? 'N' : 'S'}, {Math.abs(cityData.longitude).toFixed(2)}° {cityData.longitude >= 0 ? 'E' : 'W'}</span>
                    </div>
                    {cityData.population && cityData.population > 0 && (
                      <div className="flex justify-between">
                        <span>{t('cityInfo.population')}</span>
                        <span className="font-medium">{formatPopulation(cityData.population, locale)}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        </>
      )}

      {nearbyCities && nearbyCities.length > 0 && cityData && (
        <CityMap
          lat={cityData.latitude}
          lon={cityData.longitude}
          cityName={cityName || ''}
          currentAqi={aqiData ? Math.round(aqiData.currentAqi) : undefined}
          todayPeakAqi={aqiData ? Math.round(aqiData.todayPeak.aqi) : undefined}
          nearbyCities={nearbyCities}
          nearbyAqiCurrent={nearbyAqiCurrent}
          nearbyAqiMax={nearbyAqiMax}
        />
      )}

      {nearbyCities && nearbyCities.length > 0 && (
        <p className="text-xs text-[var(--color-text-muted)] text-center">
          {t('city.nearbyLabel')}{' '}
          {nearbyCities.map((c, i) => (
            <span key={c.id}>
              {i > 0 && ' · '}
              <Link href={`/${locale}/${c.slug}`} prefetch={false} className="underline hover:text-[var(--color-text-secondary)]">{c.name}</Link>
            </span>
          ))}
        </p>
      )}

      {cityName && geoId && (
        <p className="text-sm text-[var(--color-text-muted)] text-center">
          {t('crossPromo.uvPrefix')}{' '}
          <a
            href={`https://uvi.today/${locale}/uv-index-${slugify(cityName)}-${geoId}`}
            target="_blank"
            rel="noopener"
            className="underline hover:text-[var(--color-text-secondary)]"
          >
            {t('crossPromo.uvLink', { city: cityName })}
          </a>
        </p>
      )}

      <SeoContent />

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

      {showFeedback && <FeedbackWidget />}
    </>
  );
}
