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

// WHO 2021 Air Quality Guidelines
// https://www.who.int/publications/i/item/9789240034228
const WHO_LINK = 'https://www.who.int/publications/i/item/9789240034228';

interface PollutantCfg {
  unit: string;
  guideline: number;
  guidelineLabel: string;
}

const POLLUTANT_CONFIG: Record<string, PollutantCfg> = {
  pm25: { unit: 'µg/m³', guideline: 15,  guidelineLabel: '24h' },
  pm10: { unit: 'µg/m³', guideline: 45,  guidelineLabel: '24h' },
  no2:  { unit: 'µg/m³', guideline: 25,  guidelineLabel: '24h' },
  o3:   { unit: 'µg/m³', guideline: 100, guidelineLabel: '8h'  },
  so2:  { unit: 'µg/m³', guideline: 40,  guidelineLabel: '24h' },
  co:   { unit: 'mg/m³', guideline: 4,   guidelineLabel: '24h' },
};

function getBarColor(ratio: number): string {
  if (ratio <= 0.5)  return '#22a855';
  if (ratio <= 1.0)  return '#d4a500';
  if (ratio <= 1.5)  return '#e06000';
  if (ratio <= 2.5)  return '#d12020';
  return '#8f3f97';
}

function getRatioLabel(ratio: number): { text: string; color: string } {
  if (ratio < 0.5)  return { text: '✓ Well below', color: '#22a855' };
  if (ratio < 1.0)  return { text: '✓ Within limit', color: '#22a855' };
  if (ratio < 1.5)  return { text: `${ratio.toFixed(1)}× limit`, color: '#e06000' };
  return { text: `${ratio.toFixed(1)}× limit`, color: '#d12020' };
}

export default function PollutantBreakdown({ pm25, pm10, no2, o3, so2, co }: Props) {
  const t = useTranslations('pollutants');

  const pollutants = [
    { key: 'pm25', label: 'PM₂.₅', value: pm25 },
    { key: 'pm10', label: 'PM₁₀',  value: pm10 },
    { key: 'no2',  label: 'NO₂',   value: no2  },
    { key: 'o3',   label: 'O₃',    value: o3   },
    { key: 'so2',  label: 'SO₂',   value: so2  },
    { key: 'co',   label: 'CO',    value: co   },
  ];

  return (
    <section className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border border-[var(--color-border)]">
      <div className="flex items-baseline justify-between mb-1">
        <h2 className="text-base font-semibold text-[var(--color-text-secondary)]">{t('title')}</h2>
        <a
          href={WHO_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] text-[var(--color-text-muted)] underline hover:text-[var(--color-text-secondary)]"
        >
          WHO 2021
        </a>
      </div>
      <p className="text-[11px] text-[var(--color-text-muted)] mb-3 leading-tight">
        Instantaneous readings vs. 24h WHO guidelines (8h for O₃).
      </p>

      <div className="space-y-3.5">
        {pollutants.map((p) => {
          const cfg = POLLUTANT_CONFIG[p.key];
          const displayValue = p.key === 'co' ? p.value / 1000 : p.value;
          const ratio = displayValue / cfg.guideline;
          // Scale: WHO guideline sits at exactly 50% of the bar.
          // Bar spans 0 → 2× guideline; values beyond 2× are capped visually
          // but the ratio label still shows the true multiplier.
          const barMax = cfg.guideline * 2;
          const barPct = Math.min((displayValue / barMax) * 100, 100);
          const barColor = getBarColor(ratio);
          const ratioLabel = getRatioLabel(ratio);
          const formattedVal = p.key === 'co'
            ? (p.value / 1000).toFixed(2)
            : displayValue < 10
              ? displayValue.toFixed(1)
              : Math.round(displayValue).toString();

          return (
            <div key={p.key}>
              {/* Label row */}
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[var(--color-text)] min-w-[40px]">
                  {p.label}
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium shrink-0" style={{ color: ratioLabel.color }}>
                    {ratioLabel.text}
                  </span>
                  <span className="text-sm font-medium text-[var(--color-text-secondary)] tabular-nums shrink-0">
                    {formattedVal} <span className="text-[11px] font-normal text-[var(--color-text-muted)]">{cfg.unit}</span>
                  </span>
                </div>
              </div>

              {/* Bar */}
              <div className="relative h-3 rounded-full bg-[var(--color-border)]">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(barPct, 1.5)}%`, backgroundColor: barColor }}
                />
                {/* WHO guideline marker at 50% = guideline value */}
                <div
                  className="absolute top-0 bottom-0 w-[2px] rounded-full opacity-60"
                  style={{ left: 'calc(50% - 1px)', backgroundColor: 'var(--color-text)' }}
                />
              </div>

              {/* Scale ticks */}
              <div className="relative flex justify-between text-[10px] text-[var(--color-text-muted)] mt-0.5">
                <span>0</span>
                <span className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
                  WHO {cfg.guidelineLabel}: {cfg.guideline} {cfg.unit}
                </span>
                <span>{cfg.guideline * 2}+</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

