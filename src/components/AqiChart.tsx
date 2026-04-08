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
  const padRight = 24;
  const chartW = W - padLeft - padRight;
  const chartH = H - padTop - padBottom;

  const points = hourly.map((h, i) => ({
    x: padLeft + (i / (hourly.length - 1)) * chartW,
    y: padTop + chartH - (h.usAqi / yMax) * chartH,
    hour: parseInt(h.time.slice(11, 13), 10),
    usAqi: h.usAqi,
    temperature: h.temperature,
    weatherCode: h.weatherCode,
  }));

  function smoothPath(pts: { x: number; y: number }[]): string {
    if (pts.length < 2) return '';
    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(pts.length - 1, i + 2)];
      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
    return d;
  }

  const linePts = points.map((p) => ({ x: p.x, y: p.y }));
  const linePath = smoothPath(linePts);
  const filledPath = `${linePath} L ${points[points.length - 1].x},${padTop + chartH} L ${points[0].x},${padTop + chartH} Z`;

  const currentPt = currentHour >= 0 ? points.find((p) => p.hour === currentHour) : undefined;

  const labelIndices = hourly
    .map((h, i) => ({ hour: parseInt(h.time.slice(11, 13), 10), i }))
    .filter(({ hour }) => hour % 3 === 0);

  const yTicks: number[] = [];
  const yStep = yMax <= 50 ? 10 : yMax <= 100 ? 20 : yMax <= 200 ? 50 : 100;
  for (let v = 0; v <= yMax; v += yStep) {
    yTicks.push(v);
  }

  const gradId = `aqiGrad${chartId}`;

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
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={isDark ? '#1e3a5f' : '#93c5fd'} stopOpacity={isDark ? 0.5 : 0.35} />
            <stop offset="100%" stopColor={isDark ? '#0c1929' : '#dbeafe'} stopOpacity={isDark ? 0.15 : 0.08} />
          </linearGradient>
        </defs>

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

        <path d={filledPath} fill={`url(#${gradId})`} />

        {/* AQI line */}
        <path d={linePath} fill="none" stroke={isDark ? '#94a3b8' : '#64748b'} strokeWidth="2" strokeLinecap="round" />

        {currentPt && (
          <>
            <line x1={currentPt.x} y1={padTop} x2={currentPt.x} y2={padTop + chartH} stroke="var(--color-text-muted)" strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
            <circle cx={currentPt.x} cy={currentPt.y} r="4" fill={isDark ? '#cbd5e1' : '#475569'} stroke="var(--color-surface)" strokeWidth="2" />
          </>
        )}

        <line x1={padLeft} y1={padTop + chartH} x2={padLeft + chartW} y2={padTop + chartH} stroke="var(--color-border)" strokeWidth="1" />

        {labelIndices.map(({ i }) => {
          const pt = points[i];
          if (!pt) return null;
          return (
            <g key={pt.hour}>
              <text x={pt.x} y={padTop + chartH + 14} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[12px]">
                {pt.hour}:00
              </text>
              <image
                href={getWeatherIcon(pt.weatherCode).src}
                x={pt.x - 14}
                y={padTop + chartH + 20}
                width="28"
                height="28"
                role="img"
                aria-label={getWeatherIcon(pt.weatherCode).alt}
              />
              <text x={pt.x} y={padTop + chartH + 63} textAnchor="middle" className="fill-[var(--color-text-muted)] text-[13px]">
                {displayTemp(pt.temperature, tempUnit)}°
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
                    <td className="px-2 py-1 text-right font-semibold" style={{ color: getAqiColor(h.usAqi) }}>{Math.round(h.usAqi)}</td>
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
