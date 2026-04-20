'use client';

import { useTranslations } from 'next-intl';
import { getAqiColor, getAqiCategory } from '@/lib/aqi-utils';

interface Props {
  aqiPm25: number;
  aqiPm10: number;
  aqiNo2: number;
  aqiO3: number;
  aqiSo2: number;
  aqiCo: number;
}

const POLLUTANTS = [
  { key: 'pm25', label: 'PM₂.₅' },
  { key: 'pm10', label: 'PM₁₀' },
  { key: 'o3',   label: 'O₃' },
  { key: 'no2',  label: 'NO₂' },
  { key: 'so2',  label: 'SO₂' },
  { key: 'co',   label: 'CO' },
] as const;

export default function PollutantAqi({ aqiPm25, aqiPm10, aqiNo2, aqiO3, aqiSo2, aqiCo }: Props) {
  const tAqi = useTranslations('aqi');

  const subAqis: Record<string, number> = {
    pm25: aqiPm25, pm10: aqiPm10, no2: aqiNo2, o3: aqiO3, so2: aqiSo2, co: aqiCo,
  };

  const items = POLLUTANTS.map(p => ({ ...p, aqi: subAqis[p.key] }))
    .sort((a, b) => b.aqi - a.aqi);

  const dominantKey = items[0]?.key;

  return (
    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[var(--color-border)]">
      {items.map(p => {
        const color = getAqiColor(p.aqi);
        const isDominant = p.key === dominantKey;
        const category = getAqiCategory(p.aqi);
        return (
          <div
            key={p.key}
            title={`${p.label}: AQI ${Math.round(p.aqi)} — ${tAqi(category)}`}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
              isDominant
                ? 'border-[var(--color-text-muted)] bg-[var(--color-surface-active)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface)]'
            }`}
          >
            <span className="text-[var(--color-text-muted)] font-normal">{p.label}</span>
            <span
              className="font-bold tabular-nums"
              style={{ color }}
            >
              {Math.round(p.aqi)}
            </span>
            {isDominant && (
              <span className="text-[10px] text-[var(--color-text-muted)]">↑</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
