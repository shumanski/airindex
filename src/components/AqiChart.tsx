'use client';

import { useState, useEffect } from 'react';
import { type HourlyAqi } from '@/lib/aqi-api';
import { getAqiColor } from '@/lib/aqi-utils';
import { getWeatherIcon } from '@/lib/weather-icons';
import { useTranslations, useLocale } from 'next-intl';
import type { TempUnit } from '@/lib/storage';
import { displayTemp } from './AqiDisplay';

interface Props {
  hourly: HourlyAqi[];
  currentHour?: number;
  peakAqi: number;
  peakHour: string;
  timezone: string;
  tempUnit: TempUnit;
  dayLabel?: string;
  chartId?: string;
  cityName?: string;
}

export default function AqiChart({ hourly, currentHour = -1, peakAqi, peakHour, timezone, tempUnit, dayLabel, chartId = '', cityName }: Props) {
  const t = useTranslations('aqi');
  const locale = useLocale();
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.dataset.theme === 'dark');
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  if (hourly.length === 0) return null;

  const maxAqi = Math.max(...hourly.map((h) => h.usAqi), 1);
  const yMax = Math.ceil(maxAqi / 10) * 10;

  const W = 400;
  const H = 232;
  const padTop = 10;
  const padBottom = 84;
  const padLeft = 36;
  const padRight = 8;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  const barW = chartW / hourly.length;
  const barGap = Math.max(barW * 0.1, 0.5);

  const bars = hourly.map((h, i) => {
    const hour = parseInt(h.time.slice(11, 13), 10);
    const barHeight = Math.max((h.usAqi / yMax) * chartH, 1);
    return {
      x: padLeft + i * barW,
      y: padTop + chartH - barHeight,
      w: barW - barGap,
      h: barHeight,
      hour,
      usAqi: h.usAqi,
      temperature: h.temperature,
      weatherCode: h.weatherCode,
      color: getAqiColor(h.usAqi),
      isCurrent: hour === currentHour,
    };
  });

  const yTicks: number[] = [];
  const yStep = yMax <= 50 ? 10 : yMax <= 100 ? 20 : yMax <= 200 ? 50 : yMax <= 500 ? 100 : yMax <= 1000 ? 200 : yMax <= 2000 ? 500 : 1000;
  for (let v = 0; v <= yMax; v += yStep) {
    yTicks.push(v);
  }

  const labelIndices = bars
    .map((b, i) => ({ hour: b.hour, i }))
    .filter(({ hour }) => hour % 3 === 0);

  const dateStr = hourly[0]?.time.slice(0, 10) ?? '';
  const formattedDate = dateStr
    ? new Date(dateStr + 'T12:00:00').toLocaleDateString(locale, { month: 'short', day: 'numeric' })
    : '';

  const tzAbbr = (() => {
    try {
      const parts = new Intl.DateTimeFormat('en', { timeZone: timezone, timeZoneName: 'short' }).formatToParts(new Date());
      return parts.find(p => p.type === 'timeZoneName')?.value ?? '';
    } catch {
      return '';
    }
  })();

  return (
    <div className="w-full">
      <div className="mb-2">
        <h2 className="text-base font-semibold text-[var(--color-text-secondary)]">
          {dayLabel || t('today')}{formattedDate ? `, ${formattedDate}` : ''}
          {' — '}{t('peak')} {Math.round(peakAqi)} {t('at')} {peakHour}
        </h2>
        {(cityName || tzAbbr) && (
          <p className="text-xs text-[var(--color-text-muted)]">
            {cityName ? t('chartSubtitle', { city: cityName }) : ''}{cityName && tzAbbr ? ' · ' : ''}{tzAbbr ? `${t('localTime')} (${tzAbbr})` : ''}
          </p>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet" role="img" aria-label={`${dayLabel || t('today')} AQI chart${cityName ? ` for ${cityName}` : ''}`}>
        {/* Y-axis grid */}
        {yTicks.map((v) => {
          const y = padTop + chartH - (v / yMax) * chartH;
          return (
            <g key={v}>
              <line x1={padLeft} y1={y} x2={padLeft + chartW} y2={y} stroke="var(--color-border)" strokeWidth="0.5" opacity="0.5" />
              <text x={padLeft - 6} y={y + 3} textAnchor="end" className="fill-[var(--color-text-muted)] text-[12px]">
                {v}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {bars.map((bar, i) => (
          <rect
            key={i}
            x={bar.x + barGap / 2}
            y={bar.y}
            width={bar.w}
            height={bar.h}
            rx={Math.min(bar.w / 3, 2)}
            fill={bar.color}
            opacity={bar.isCurrent ? 1 : 0.8}
            stroke={bar.isCurrent ? (isDark ? '#e2ebf5' : '#0c1826') : 'none'}
            strokeWidth={bar.isCurrent ? 1.5 : 0}
          />
        ))}

        {/* Baseline */}
        <line x1={padLeft} y1={padTop + chartH} x2={padLeft + chartW} y2={padTop + chartH} stroke="var(--color-border)" strokeWidth="1" />

        {/* X-axis labels, weather icons, temps */}
        {labelIndices.map(({ i }) => {
          const bar = bars[i];
          if (!bar) return null;
          const cx = bar.x + bar.w / 2;
          return (
            <g key={bar.hour}>
              <text x={cx} y={padTop + chartH + 14} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[12px]">
                {bar.hour}:00
              </text>
              <image
                href={getWeatherIcon(bar.weatherCode).src}
                x={cx - 14}
                y={padTop + chartH + 20}
                width="28"
                height="28"
                role="img"
                aria-label={getWeatherIcon(bar.weatherCode).alt}
              />
              <text x={cx} y={padTop + chartH + 63} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[13px]">
                {displayTemp(bar.temperature, tempUnit)}°
              </text>
            </g>
          );
        })}
      </svg>

      {/* Hourly data table */}
      <details className="mt-2 group">
        <summary className="text-xs text-[var(--color-text-muted)] cursor-pointer hover:text-[var(--color-text-secondary)] select-none">
          {t('hourlyTable')}
        </summary>
        <div className="mt-1 overflow-x-auto rounded-lg border border-[var(--color-border)]">
          <table className="w-full text-xs text-[var(--color-text-secondary)]">
            <thead>
              <tr className="bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                <th className="px-2 py-1.5 text-left font-medium text-[var(--color-text-muted)]">{t('hour')}</th>
                <th className="px-2 py-1.5 text-right font-medium text-[var(--color-text-muted)]">AQI</th>
                <th className="px-2 py-1.5 text-right font-medium text-[var(--color-text-muted)]">PM2.5</th>
                <th className="px-2 py-1.5 text-right font-medium text-[var(--color-text-muted)]">PM10</th>
                <th className="px-2 py-1.5 text-right font-medium text-[var(--color-text-muted)]">O₃</th>
                <th className="px-2 py-1.5 text-right font-medium text-[var(--color-text-muted)]">NO₂</th>
                <th className="px-2 py-1.5 text-right font-medium text-[var(--color-text-muted)]">°{tempUnit}</th>
              </tr>
            </thead>
            <tbody>
              {hourly.map((h, i) => {
                const hour = h.time.slice(11, 16);
                const isCurrent = parseInt(h.time.slice(11, 13), 10) === currentHour;
                return (
                  <tr key={i} className={`border-b border-[var(--color-border)] last:border-0 ${isCurrent ? 'bg-[var(--color-surface-active)]' : i % 2 === 0 ? 'bg-[var(--color-surface)]' : ''}`}>
                    <td className="px-2 py-1 font-medium">{hour}</td>
                    <td className="px-2 py-1 text-right">
                      <span
                        className="inline-flex items-center justify-center min-w-9 px-1.5 py-0.5 rounded-md font-semibold text-[var(--color-text-secondary)]"
                        style={{ backgroundColor: `${getAqiColor(h.usAqi)}22` }}
                      >
                        {Math.round(h.usAqi)}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-right">{h.pm25.toFixed(1)}</td>
                    <td className="px-2 py-1 text-right">{h.pm10.toFixed(1)}</td>
                    <td className="px-2 py-1 text-right">{h.o3.toFixed(1)}</td>
                    <td className="px-2 py-1 text-right">{h.no2.toFixed(1)}</td>
                    <td className="px-2 py-1 text-right">{displayTemp(h.temperature, tempUnit)}°</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
