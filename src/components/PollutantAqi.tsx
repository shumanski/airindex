'use client';

import { useTranslations } from 'next-intl';
import { calcSubAqi, getAqiColor, getAqiCategory } from '@/lib/aqi-utils';

interface Props {
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
}

const POLLUTANTS = [
  { key: 'pm25', label: 'PM₂.₅' },
  { key: 'pm10', label: 'PM₁₀' },
  { key: 'o3',   label: 'O₃' },
  { key: 'no2',  label: 'NO₂' },
  { key: 'so2',  label: 'SO₂' },
  { key: 'co',   label: 'CO' },
] as const;

export default function PollutantAqi({ pm25, pm10, no2, o3, so2, co }: Props) {
  const t = useTranslations('pollutantAqi');
  const tAqi = useTranslations('aqi');

  const values: Record<string, number> = { pm25, pm10, no2, o3, so2, co };

  const items = POLLUTANTS.map(p => {
    const subAqi = calcSubAqi(p.key, values[p.key]);
    return { ...p, subAqi, category: getAqiCategory(subAqi) };
  }).sort((a, b) => b.subAqi - a.subAqi);

  const dominant = items[0];
  const maxAqi = Math.max(dominant.subAqi, 50); // scale bars relative to worst

  return (
    <section className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
      <h2 className="text-base font-semibold text-[var(--color-text-secondary)] mb-1">{t('title')}</h2>
      <p className="text-xs text-[var(--color-text-muted)] mb-3">
        {t('dominantNote', { pollutant: dominant.label })}
      </p>

      <div className="space-y-2">
        {items.map(p => {
          const color = getAqiColor(p.subAqi);
          const pct = Math.max((p.subAqi / maxAqi) * 100, 4);
          const isDominant = p.key === dominant.key;
          return (
            <div key={p.key} title={`${p.label}: AQI ${p.subAqi}`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm ${isDominant ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {p.label}
                </span>
                <span className="text-xs font-medium" style={{ color }}>
                  {tAqi(p.category)}
                </span>
              </div>
              <div className="h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, backgroundColor: color, opacity: isDominant ? 1 : 0.7 }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
