'use client';

import { useTranslations } from 'next-intl';

interface Props {
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
}

// WHO 2021 Air Quality Guidelines (24h means unless noted)
const POLLUTANT_CONFIG: Record<string, { unit: string; guideline: number; guidelineLabel: string; max: number }> = {
  pm25: { unit: 'µg/m³', guideline: 15,  guidelineLabel: 'WHO 24h', max: 75 },
  pm10: { unit: 'µg/m³', guideline: 45,  guidelineLabel: 'WHO 24h', max: 150 },
  no2:  { unit: 'µg/m³', guideline: 25,  guidelineLabel: 'WHO 24h', max: 200 },
  o3:   { unit: 'µg/m³', guideline: 100, guidelineLabel: 'WHO 8h',  max: 240 },
  so2:  { unit: 'µg/m³', guideline: 40,  guidelineLabel: 'WHO 24h', max: 500 },
  co:   { unit: 'mg/m³', guideline: 4,   guidelineLabel: 'WHO 24h', max: 15 },
};

function getBarColor(value: number, guideline: number): string {
  const ratio = value / guideline;
  if (ratio <= 0.5) return '#4ade80';
  if (ratio <= 1.0) return '#facc15';
  if (ratio <= 1.5) return '#f97316';
  if (ratio <= 2.0) return '#ef4444';
  return '#a855f7';
}

function getStatusLabel(value: number, guideline: number): string {
  const ratio = value / guideline;
  if (ratio <= 0.5) return 'Well below limit';
  if (ratio <= 1.0) return 'Within limit';
  if (ratio <= 1.5) return 'Above limit';
  if (ratio <= 2.0) return 'High';
  return 'Very high';
}

export default function PollutantBreakdown({ pm25, pm10, no2, o3, so2, co }: Props) {
  const t = useTranslations('pollutants');

  const pollutants = [
    { key: 'pm25', label: 'PM₂.₅', value: pm25 },
    { key: 'pm10', label: 'PM₁₀', value: pm10 },
    { key: 'no2', label: 'NO₂', value: no2 },
    { key: 'o3', label: 'O₃', value: o3 },
    { key: 'so2', label: 'SO₂', value: so2 },
    { key: 'co', label: 'CO', value: co },
  ];

  return (
    <section className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
      <h2 className="text-base font-semibold text-[var(--color-text-secondary)] mb-3">{t('title')}</h2>
      <div className="space-y-3">
        {pollutants.map((p) => {
          const cfg = POLLUTANT_CONFIG[p.key];
          const displayValue = p.key === 'co' ? p.value / 1000 : p.value;
          const pct = Math.min((displayValue / cfg.max) * 100, 100);
          const guidelinePct = Math.min((cfg.guideline / cfg.max) * 100, 100);
          const color = getBarColor(displayValue, cfg.guideline);
          const status = getStatusLabel(displayValue, cfg.guideline);
          return (
            <div key={p.key}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-medium text-[var(--color-text)]">{p.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{
                    backgroundColor: color + '22',
                    color: color,
                  }}>{status}</span>
                  <span className="text-[var(--color-text-secondary)]">
                    {p.key === 'co' ? (p.value / 1000).toFixed(1) : Math.round(p.value)} {cfg.unit}
                  </span>
                </div>
              </div>
              <div className="relative h-2.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: color }}
                />
                <div
                  className="absolute top-0 h-full w-[2px] opacity-50"
                  style={{ left: `${guidelinePct}%`, backgroundColor: 'var(--color-text)' }}
                />
              </div>
              <div className="flex justify-between text-[10px] mt-0.5 text-[var(--color-text-muted)]">
                <span>0</span>
                <span>{cfg.guidelineLabel}: {cfg.guideline} {cfg.unit}</span>
                <span>{cfg.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
