'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { InfoIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';
import { getAqiColor, getAqiTextColor, getAqiCategory } from '@/lib/aqi-utils';

const AQI_LEVELS = [
  { key: 'good', range: '0–50', aqi: 25 },
  { key: 'moderate', range: '51–100', aqi: 75 },
  { key: 'unhealthySensitive', range: '101–150', aqi: 125 },
  { key: 'unhealthy', range: '151–200', aqi: 175 },
  { key: 'veryUnhealthy', range: '201–300', aqi: 250 },
  { key: 'hazardous', range: '301–500', aqi: 400 },
] as const;

const linkCls = 'underline hover:text-[var(--color-text-secondary)]';
const linkProps = { target: '_blank' as const, rel: 'noopener noreferrer', className: linkCls };

export interface SeoContentCityProps {
  cityName: string;
  country: string;
  admin1?: string;
  latitude: number;
  currentAqi: number;
  todayPeakAqi: number;
  todayPeakHour: string;
  tomorrowPeakAqi: number;
  dominantPollutant?: string;
  timezone: string;
}

export default function SeoContent({ city }: { city?: SeoContentCityProps }) {
  const t = useTranslations('seo');
  const tAqi = useTranslations('aqi');

  const tags = {
    cams: (c: ReactNode) => <a href="https://atmosphere.copernicus.eu/" {...linkProps}>{c}</a>,
    epa: (c: ReactNode) => <a href="https://www.airnow.gov/" {...linkProps}>{c}</a>,
    openmeteo: (c: ReactNode) => <a href="https://open-meteo.com/" {...linkProps}>{c}</a>,
    who: (c: ReactNode) => <a href="https://www.who.int/news-room/fact-sheets/detail/ambient-(outdoor)-air-quality-and-health" {...linkProps}>{c}</a>,
    airnow: (c: ReactNode) => <a href="https://www.airnow.gov/aqi/aqi-basics/" {...linkProps}>{c}</a>,
  };

  const faqKeys = [
    'whatIsAqi', 'howToRead', 'sensitiveGroups', 'pollutants',
    'dataSource', 'healthEffects', 'forecastUpdate',
  ] as const;

  const stripTags = (s: string) => s.replace(/<\/?[a-z]+>/gi, '');

  const textFaqs = faqKeys.map(key => ({
    q: t(key),
    a: stripTags(t.raw(`${key}Answer`) as string),
    rich: t.rich(`${key}Answer`, tags),
  }));

  const cityFaqs: { q: string; a: string }[] = [];
  if (city) {
    const { cityName, country, admin1, latitude, currentAqi, todayPeakAqi, todayPeakHour, tomorrowPeakAqi, dominantPollutant, timezone } = city;
    const location = admin1 ? `${cityName}, ${admin1}, ${country}` : `${cityName}, ${country}`;
    const aqiCat = tAqi(getAqiCategory(Math.round(currentAqi)));
    const peakCat = tAqi(getAqiCategory(Math.round(todayPeakAqi)));
    const hemisphere = latitude >= 0 ? 'Northern' : 'Southern';
    const tz = timezone.replace(/_/g, ' ');
    const peakHourNum = parseInt(todayPeakHour.slice(0, 2), 10);
    const timeOfDay = peakHourNum < 6 ? 'night' : peakHourNum < 12 ? 'morning' : peakHourNum < 18 ? 'afternoon' : 'evening';

    cityFaqs.push({
      q: `What is the air quality in ${cityName} right now?`,
      a: `The current air quality index (AQI) in ${cityName} is ${Math.round(currentAqi)} and the category is ${aqiCat}. Today's forecast peak is AQI ${Math.round(todayPeakAqi)} (${peakCat}) at ${todayPeakHour} local time. Tomorrow's forecast peak is AQI ${Math.round(tomorrowPeakAqi)}. These values come from the CAMS forecast model and are not station measurements.`,
    });

    cityFaqs.push({
      q: `What time of day is air quality worst in ${cityName}?`,
      a: `According to today's forecast, air quality in ${cityName} is expected to be worst at ${todayPeakHour} in the ${timeOfDay}, reaching a peak AQI of ${Math.round(todayPeakAqi)}. ${dominantPollutant ? `The strongest contributor right now is ${dominantPollutant}. ` : ''}Daily air quality changes with traffic, wind, atmospheric mixing, and sunlight, so the hourly chart is the best way to track the latest pattern.`,
    });

    cityFaqs.push({
      q: `How is air quality forecast for ${location}?`,
      a: `Air quality for ${cityName} is forecast using the Copernicus Atmosphere Monitoring Service (CAMS), operated by ECMWF. CAMS provides hourly predictions for PM2.5, PM10, ozone, nitrogen dioxide, sulfur dioxide, and carbon monoxide. The location at ${Math.abs(latitude).toFixed(1)}° ${latitude >= 0 ? 'N' : 'S'} in the ${hemisphere} Hemisphere and timezone ${tz} affects seasonal weather patterns, sunlight, and pollutant dispersion. AQI values on this page follow the US EPA scale.`,
    });
  }

  return (
    <div className="w-full">
      <details className="group">
        <summary className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-text-muted)] transition-colors cursor-pointer list-none">
          <span className="flex items-center gap-2 text-base font-semibold text-[var(--color-text-secondary)]">
            <InfoIcon size={16} />
            {t('aboutTitle')}
          </span>
          <span className="text-[var(--color-text-muted)] group-open:hidden"><ChevronDownIcon size={14} /></span>
          <span className="text-[var(--color-text-muted)] hidden group-open:block"><ChevronUpIcon size={14} /></span>
        </summary>

        <div className="mt-2 p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-4">
          {cityFaqs.map((faq) => (
            <div key={faq.q}>
              <h2 className="text-base font-semibold text-[var(--color-text-secondary)] mb-1">
                {faq.q}
              </h2>
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
          {cityFaqs.length > 0 && <hr className="border-[var(--color-border)]" />}
          {textFaqs.map((faq) => (
            <div key={faq.q}>
              <h2 className="text-base font-semibold text-[var(--color-text-secondary)] mb-1">
                {faq.q}
              </h2>
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                {faq.rich}
              </p>
            </div>
          ))}

          {/* US AQI Levels table */}
          <div>
            <h2 className="text-base font-semibold text-[var(--color-text-secondary)] mb-2">
              {t('aqiLevelsTitle')}
            </h2>
            <div className="space-y-1.5">
              {AQI_LEVELS.map((level) => (
                <div key={level.key} className="flex items-start gap-2 text-sm">
                  <span
                    className="mt-1 w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getAqiColor(level.aqi) }}
                  />
                  <div>
                    <span className="font-semibold" style={{ color: getAqiTextColor(level.aqi) }}>
                      {tAqi(level.key)} ({level.range})
                    </span>
                    <span className="text-[var(--color-text-secondary)]">
                      {' — '}{tAqi(`advice_${level.key}`).split('|').map(s => s.trim()).join('. ')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div className="text-xs text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)]">
            <p>{t('sources')}</p>
          </div>
        </div>
      </details>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [...cityFaqs, ...textFaqs].map((faq) => ({
              '@type': 'Question',
              name: faq.q,
              acceptedAnswer: {
                '@type': 'Answer',
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
