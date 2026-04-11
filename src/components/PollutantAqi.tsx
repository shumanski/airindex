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
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
}

const POLLUTANTS = [
  { key: 'pm25', label: 'PM₂.₅', unit: 'µg/m³' },
  { key: 'pm10', label: 'PM₁₀', unit: 'µg/m³' },
  { key: 'o3',   label: 'O₃', unit: 'µg/m³' },
  { key: 'no2',  label: 'NO₂', unit: 'µg/m³' },
  { key: 'so2',  label: 'SO₂', unit: 'µg/m³' },
  { key: 'co',   label: 'CO', unit: 'mg/m³' },
] as const;

export default function PollutantAqi({ aqiPm25, aqiPm10, aqiNo2, aqiO3, aqiSo2, aqiCo, pm25, pm10, no2, o3, so2, co }: Props) {
  const t = useTranslations('pollutantAqi');
  const tAqi = useTranslations('aqi');

  const aqiValues: Record<string, number> = { pm25: aqiPm25, pm10: aqiPm10, no2: aqiNo2, o3: aqiO3, so2: aqiSo2, co: aqiCo };
  const concValues: Record<string, number> = { pm25, pm10, no2, o3, so2, co };

  const items = POLLUTANTS.map(p => {
    const subAqi = aqiValues[p.key];
    const conc = p.key === 'co' ? concValues[p.key] / 1000 : concValues[p.key];
    return { ...p, subAqi, conc, category: getAqiCategory(subAqi) };
  }).sort((a, b) => b.subAqi - a.subAqi);

  const dominant = items[0];
  const maxAqi = Math.max(dominant.subAqi, 50);

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
          const concDisplay = p.key === 'co' ? p.conc.toFixed(1) : Math.round(p.conc);
          return (
            <div key={p.key} title={`${p.label}: AQI ${p.subAqi}`}>
              <div className="flex items-center justify-between mb-0.5">
                <span className={`text-sm ${isDominant ? 'font-semibold text-[var(--color-text)]' : 'text-[var(--color-text-secondary)]'}`}>
                  {p.label}
                  <span className="text-xs text-[var(--color-text-muted)] ml-1">{concDisplay} {p.unit}</span>
                </span>
                <span className="text-xs font-medium" style={{ color }}>
                  {Math.round(p.subAqi)} · {tAqi(p.category)}
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
