'use client';

import { useTranslations, useLocale } from 'next-intl';
import { getAqiColor } from '@/lib/aqi-utils';
import type { DailyAqiPeak } from '@/lib/aqi-api';
import type { TempUnit } from '@/lib/storage';
import { displayTemp } from './AqiDisplay';
import { getWeatherIcon } from '@/lib/weather-icons';

interface Props {
  dailyPeaks: DailyAqiPeak[];
  tempUnit: TempUnit;
  cityName?: string;
}

export default function AqiTrend({ dailyPeaks, tempUnit, cityName }: Props) {
  const t = useTranslations('aqi');
  const locale = useLocale();

  if (dailyPeaks.length < 3) return null;

  const maxAqi = Math.max(...dailyPeaks.map((d) => d.peakAqi), 1);

  return (
    <section className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
      <h2 className="text-base font-semibold text-[var(--color-text-secondary)] mb-1">
        {cityName ? t('trendCity', { city: cityName }) : t('trend')}
      </h2>
      <p className="text-xs text-[var(--color-text-muted)] mb-3">{t('trendPeakNote')}</p>
      <div className="flex gap-1 items-end">
        {dailyPeaks.map((day, i) => {
          const barHeight = Math.max((day.peakAqi / maxAqi) * 80, 8);
          const dateLabel = new Date(day.date + 'T12:00:00').toLocaleDateString(locale, { weekday: 'short' });
          const icon = getWeatherIcon(day.weatherCode);
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs font-medium text-[var(--color-text-secondary)]">
                {Math.round(day.peakAqi)}
              </span>
              <div
                className="w-full rounded-t-lg transition-all"
                style={{
                  height: `${barHeight}px`,
                  backgroundColor: getAqiColor(day.peakAqi),
                  opacity: 0.8,
                }}
              />
              <img src={icon.src} alt={icon.alt} width={20} height={20} className="w-5 h-5" />
              {day.tempMax != null && day.tempMin != null && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  {displayTemp(day.tempMax, tempUnit)}° / {displayTemp(day.tempMin, tempUnit)}°
                </span>
              )}
              <span className="text-xs text-[var(--color-text-muted)]">{dateLabel}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
