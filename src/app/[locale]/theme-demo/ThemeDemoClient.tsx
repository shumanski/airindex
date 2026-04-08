'use client';

import { useState, useId } from 'react';

// ─── 4 Deep Ocean Variants (progressively deeper blues) ─────────
const THEMES = [
  {
    id: 'ocean-1',
    name: 'A. Deep Ocean',
    desc: 'Rich navy→cerulean base. Clean and authoritative.',
    light: {
      bg: '#d4e2f4',
      surface: '#ffffff',
      surfaceActive: '#e0eaf6',
      border: '#a4b8d4',
      text: '#0c1826',
      textSecondary: '#243548',
      textMuted: '#4a6580',
      primary: '#1565c0',
      primaryHover: '#104d92',
      cityName: '#1259a8',
      accent: '#1976d2',
      accentHover: '#1565c0',
      cloud: 'white',
    },
    dark: {
      bg: '#08101e',
      surface: '#0e1a30',
      surfaceActive: '#142440',
      border: '#1a3055',
      text: '#e2ebf5',
      textSecondary: '#a8c0dc',
      textMuted: '#6088b0',
      primary: '#42a5f5',
      primaryHover: '#64b5f6',
      cityName: '#64b5f6',
      accent: '#42a5f5',
      accentHover: '#64b5f6',
      cloud: 'rgba(15,30,60,0.5)',
    },
    logo: {
      layers: ['#0d47a1', '#1565c0', '#1976d2', '#2196f3'],
      center: ['#e3f2fd', '#bbdefb', '#64b5f6', '#42a5f5'],
    },
  },
  {
    id: 'ocean-2',
    name: 'B. Atlantic',
    desc: 'Slightly darker. Deeper navy with stronger contrast.',
    light: {
      bg: '#ccdcf0',
      surface: '#ffffff',
      surfaceActive: '#d8e4f2',
      border: '#95aecf',
      text: '#091420',
      textSecondary: '#1e3048',
      textMuted: '#3e5878',
      primary: '#0d47a1',
      primaryHover: '#0a3880',
      cityName: '#0d47a1',
      accent: '#1565c0',
      accentHover: '#0d47a1',
      cloud: 'white',
    },
    dark: {
      bg: '#060e1a',
      surface: '#0c1628',
      surfaceActive: '#101e38',
      border: '#162a4a',
      text: '#dce6f2',
      textSecondary: '#98b4d4',
      textMuted: '#5478a0',
      primary: '#3d8ee8',
      primaryHover: '#5aa0f0',
      cityName: '#5aa0f0',
      accent: '#3d8ee8',
      accentHover: '#5aa0f0',
      cloud: 'rgba(12,24,50,0.5)',
    },
    logo: {
      layers: ['#0a2f6e', '#0d47a1', '#1565c0', '#1976d2'],
      center: ['#d6e8fc', '#a8ccf0', '#4a90d9', '#2979c4'],
    },
  },
  {
    id: 'ocean-3',
    name: 'C. Midnight',
    desc: 'Dark blue-indigo. High contrast, dramatic.',
    light: {
      bg: '#c5d5ec',
      surface: '#ffffff',
      surfaceActive: '#d0ddef',
      border: '#88a2c6',
      text: '#071020',
      textSecondary: '#1a2c44',
      textMuted: '#385270',
      primary: '#0a3d91',
      primaryHover: '#072e70',
      cityName: '#0a3d91',
      accent: '#1050a8',
      accentHover: '#0a3d91',
      cloud: 'white',
    },
    dark: {
      bg: '#050c16',
      surface: '#0a1222',
      surfaceActive: '#0e1a32',
      border: '#142442',
      text: '#d8e2f0',
      textSecondary: '#90a8cc',
      textMuted: '#4c6e98',
      primary: '#3580d8',
      primaryHover: '#4a94e4',
      cityName: '#4a94e4',
      accent: '#3580d8',
      accentHover: '#4a94e4',
      cloud: 'rgba(10,20,42,0.5)',
    },
    logo: {
      layers: ['#071e5e', '#0a3580', '#0d47a1', '#1565c0'],
      center: ['#ccdaf5', '#8aaee0', '#3d7cc4', '#1e62a8'],
    },
  },
  {
    id: 'ocean-4',
    name: 'D. Abyss',
    desc: 'Deepest navy. Nearly black-blue. Maximum depth.',
    light: {
      bg: '#bfd0e8',
      surface: '#ffffff',
      surfaceActive: '#c8d8ec',
      border: '#7e9abc',
      text: '#051020',
      textSecondary: '#162840',
      textMuted: '#304a68',
      primary: '#072e70',
      primaryHover: '#052058',
      cityName: '#072e70',
      accent: '#0a3d91',
      accentHover: '#072e70',
      cloud: 'white',
    },
    dark: {
      bg: '#040a12',
      surface: '#080e1c',
      surfaceActive: '#0c1628',
      border: '#10203a',
      text: '#d4dee8',
      textSecondary: '#88a0c0',
      textMuted: '#446488',
      primary: '#2e72c4',
      primaryHover: '#4088d8',
      cityName: '#4088d8',
      accent: '#2e72c4',
      accentHover: '#4088d8',
      cloud: 'rgba(8,16,36,0.5)',
    },
    logo: {
      layers: ['#04163e', '#072658', '#0a3580', '#0d47a1'],
      center: ['#c0d0f0', '#7898cc', '#2e68a8', '#154a88'],
    },
  },
];

type ThemeColors = typeof THEMES[0]['light'];

// ─── Logo Component (UVI.today hexagonal shape in blue) ─────────
function HexLogo({ logo, size = 80, uid = '' }: { logo: typeof THEMES[0]['logo']; size?: number; uid?: string }) {
  const reactId = useId();
  const id = uid || reactId.replace(/:/g, '');
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={size} height={size}>
      <defs>
        <linearGradient id={`${id}-a`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={logo.layers[0]} /><stop offset="100%" stopColor={logo.layers[1]} />
        </linearGradient>
        <linearGradient id={`${id}-b`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={logo.layers[1]} /><stop offset="100%" stopColor={logo.layers[2]} />
        </linearGradient>
        <linearGradient id={`${id}-c`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={logo.layers[2]} /><stop offset="100%" stopColor={logo.layers[3]} />
        </linearGradient>
        <linearGradient id={`${id}-d`} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={logo.layers[3]} /><stop offset="100%" stopColor={logo.center[2]} />
        </linearGradient>
        <radialGradient id={`${id}-e`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={logo.center[0]} />
          <stop offset="25%" stopColor={logo.center[1]} />
          <stop offset="55%" stopColor={logo.center[2]} />
          <stop offset="100%" stopColor={logo.center[3]} />
        </radialGradient>
      </defs>
      <g transform="translate(100,100)">
        <polygon points="0,-94 81.4,-47 81.4,47 0,94 -81.4,47 -81.4,-47" fill={`url(#${id}-a)`} />
        <polygon points="0,-94 81.4,-47 81.4,47 0,94 -81.4,47 -81.4,-47" fill={`url(#${id}-a)`} transform="rotate(30)" />
        <polygon points="0,-74 64.1,-37 64.1,37 0,74 -64.1,37 -64.1,-37" fill={`url(#${id}-b)`} />
        <polygon points="0,-74 64.1,-37 64.1,37 0,74 -64.1,37 -64.1,-37" fill={`url(#${id}-b)`} transform="rotate(30)" />
        <polygon points="0,-54 46.8,-27 46.8,27 0,54 -46.8,27 -46.8,-27" fill={`url(#${id}-c)`} />
        <polygon points="0,-54 46.8,-27 46.8,27 0,54 -46.8,27 -46.8,-27" fill={`url(#${id}-c)`} transform="rotate(30)" />
        <polygon points="0,-38 32.9,-19 32.9,19 0,38 -32.9,19 -32.9,-19" fill={`url(#${id}-d)`} />
        <polygon points="0,-38 32.9,-19 32.9,19 0,38 -32.9,19 -32.9,-19" fill={`url(#${id}-d)`} transform="rotate(30)" />
        <circle cx="0" cy="0" r="24" fill={`url(#${id}-e)`} />
        <circle cx="0" cy="0" r="8" fill="#FFF" opacity=".4" />
        <circle cx="0" cy="0" r="3.5" fill="#FFF" opacity=".95" />
      </g>
    </svg>
  );
}

// ─── AQI Level Gauge ─────────────────────────────────────────────
function AqiGauge({ aqi, colors }: { aqi: number; colors: ThemeColors }) {
  const AQI_LEVELS = [
    { label: 'Good', max: 50, color: '#9eff91' },
    { label: 'Moderate', max: 100, color: '#ffc905' },
    { label: 'USG', max: 150, color: '#ff8205' },
    { label: 'Unhealthy', max: 200, color: '#f02200' },
    { label: 'Very Unhealthy', max: 300, color: '#890997' },
    { label: 'Hazardous', max: 500, color: '#7e0023' },
  ];

  function renderScale(value: number, levels: typeof AQI_LEVELS, label: string) {
    const activeIdx = levels.findIndex(l => value <= l.max);
    const idx = activeIdx >= 0 ? activeIdx : levels.length - 1;
    const activeLevel = levels[idx];
    const prevMax = idx > 0 ? levels[idx - 1].max : 0;
    const rangeWidth = activeLevel.max - prevMax;
    const segWidth = 100 / levels.length;
    const segProgress = rangeWidth > 0 ? Math.min((value - prevMax) / rangeWidth, 1) : 1;
    const indicatorPos = idx * segWidth + segProgress * segWidth;

    return (
      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: colors.textMuted }}>{label}</span>
          <span className="text-2xl font-bold" style={{ color: activeLevel.color }}>{Math.round(value)}</span>
          <span className="text-sm font-semibold" style={{ color: activeLevel.color }}>{activeLevel.label}</span>
        </div>
        <div className="relative">
          <div className="flex h-3 rounded-full overflow-hidden gap-[2px]">
            {levels.map((level, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm"
                style={{
                  backgroundColor: level.color,
                  opacity: i <= idx ? 1 : 0.2,
                }}
              />
            ))}
          </div>
          <div
            className="absolute -bottom-1 transition-all duration-500"
            style={{ left: `${Math.min(indicatorPos, 98)}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-l-transparent border-r-transparent"
              style={{ borderBottomColor: activeLevel.color }} />
          </div>
        </div>
        <div className="flex text-[10px] mt-1.5" style={{ color: colors.textMuted }}>
          {levels.map((_, i) => (
            <div key={i} className="flex-1 text-center">{i === 0 ? '0' : levels[i - 1].max}</div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl p-4 border" style={{ borderColor: colors.border, background: colors.surface }}>
      <div className="flex gap-6 flex-col sm:flex-row">
        {renderScale(aqi, AQI_LEVELS, 'AQI')}
      </div>
    </div>
  );
}

// ─── Pollutant Bars (with WHO guideline context) ─────────────────
function PollutantBars({ colors }: { colors: ThemeColors }) {
  const pollutants = [
    { key: 'PM2.5', value: 18, unit: 'ug/m3', guideline: 15, guidelineLabel: 'WHO 24h', max: 75 },
    { key: 'PM10', value: 32, unit: 'ug/m3', guideline: 45, guidelineLabel: 'WHO 24h', max: 150 },
    { key: 'NO2', value: 45, unit: 'ug/m3', guideline: 25, guidelineLabel: 'WHO annual', max: 200 },
    { key: 'O3', value: 68, unit: 'ug/m3', guideline: 100, guidelineLabel: 'WHO 8h', max: 240 },
    { key: 'SO2', value: 12, unit: 'ug/m3', guideline: 40, guidelineLabel: 'WHO 24h', max: 500 },
    { key: 'CO', value: 0.4, unit: 'mg/m3', guideline: 4, guidelineLabel: 'WHO 24h', max: 15 },
  ];

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

  return (
    <div className="rounded-2xl p-4 border space-y-3" style={{ borderColor: colors.border, background: colors.surface }}>
      <h3 className="text-sm font-bold" style={{ color: colors.textSecondary }}>Pollutant Levels vs. WHO Guidelines</h3>
      {pollutants.map((p) => {
        const pct = Math.min((p.value / p.max) * 100, 100);
        const guidelinePct = Math.min((p.guideline / p.max) * 100, 100);
        const color = getBarColor(p.value, p.guideline);
        const status = getStatusLabel(p.value, p.guideline);
        return (
          <div key={p.key}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-semibold" style={{ color: colors.text }}>{p.key}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs px-1.5 py-0.5 rounded font-bold" style={{
                  backgroundColor: color + '22',
                  color: color,
                }}>{status}</span>
                <span className="font-medium" style={{ color: colors.textSecondary }}>
                  {p.value} {p.unit}
                </span>
              </div>
            </div>
            <div className="relative h-2.5 rounded-full overflow-hidden" style={{ background: colors.border }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
              <div
                className="absolute top-0 h-full w-[2px]"
                style={{ left: `${guidelinePct}%`, backgroundColor: colors.text, opacity: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-0.5" style={{ color: colors.textMuted }}>
              <span>0</span>
              <span>{p.guidelineLabel}: {p.guideline} {p.unit}</span>
              <span>{p.max}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Hourly Pollutant Table ──────────────────────────────────────
function HourlyPollutantTable({ colors }: { colors: ThemeColors }) {
  // Deterministic fake data (no Math.random to avoid hydration mismatch)
  const fakeNoise = [2, 3, 1, 4, 0, 3, 2, 1, 4, 3, 0, 2];
  const hours = Array.from({ length: 12 }, (_, i) => {
    const h = 6 + i;
    const n = fakeNoise[i];
    return {
      hour: `${h.toString().padStart(2, '0')}:00`,
      pm25: Math.round(12 + Math.sin(i * 0.5) * 8 + n),
      pm10: Math.round(25 + Math.sin(i * 0.4) * 15 + n),
      no2: Math.round(30 + Math.cos(i * 0.6) * 20 + n),
      o3: Math.round(40 + i * 5 + n * 2),
    };
  });

  function cellColor(value: number, thresholds: number[]): string {
    if (value <= thresholds[0]) return '#4ade8033';
    if (value <= thresholds[1]) return '#facc1533';
    if (value <= thresholds[2]) return '#f9731633';
    return '#ef444433';
  }

  return (
    <div className="rounded-2xl p-4 border overflow-x-auto" style={{ borderColor: colors.border, background: colors.surface }}>
      <h3 className="text-sm font-bold mb-3" style={{ color: colors.textSecondary }}>Hourly Pollutant Levels</h3>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ color: colors.textMuted }}>
            <th className="text-left py-1 pr-3 font-semibold text-xs">Hour</th>
            <th className="text-center py-1 px-2 font-semibold text-xs">PM2.5</th>
            <th className="text-center py-1 px-2 font-semibold text-xs">PM10</th>
            <th className="text-center py-1 px-2 font-semibold text-xs">NO2</th>
            <th className="text-center py-1 px-2 font-semibold text-xs">O3</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((row) => (
            <tr key={row.hour} className="border-t" style={{ borderColor: colors.border }}>
              <td className="py-1.5 pr-3 font-semibold text-sm" style={{ color: colors.textSecondary }}>{row.hour}</td>
              <td className="text-center py-1.5 px-2 rounded font-medium" style={{ background: cellColor(row.pm25, [10, 25, 50]), color: colors.text }}>{row.pm25}</td>
              <td className="text-center py-1.5 px-2 rounded font-medium" style={{ background: cellColor(row.pm10, [20, 50, 100]), color: colors.text }}>{row.pm10}</td>
              <td className="text-center py-1.5 px-2 rounded font-medium" style={{ background: cellColor(row.no2, [40, 90, 120]), color: colors.text }}>{row.no2}</td>
              <td className="text-center py-1.5 px-2 rounded font-medium" style={{ background: cellColor(row.o3, [60, 120, 180]), color: colors.text }}>{row.o3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Demo Page ──────────────────────────────────────────────
export default function ThemeDemo() {
  const [activeTheme, setActiveTheme] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  const theme = THEMES[activeTheme];
  const colors = darkMode ? theme.dark : theme.light;

  return (
    <div style={{ background: colors.bg, color: colors.text, minHeight: '100vh' }} className="transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">

        {/* Theme Switcher */}
        <div className="rounded-2xl p-4 border" style={{ borderColor: colors.border, background: colors.surface }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-bold" style={{ color: colors.text }}>AirIndex — Deep Ocean Variants</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="text-sm px-3 py-1.5 rounded-lg border font-semibold transition-colors"
              style={{ borderColor: colors.border, color: colors.textSecondary, background: colors.surfaceActive }}
            >
              {darkMode ? 'Light' : 'Dark'}
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {THEMES.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setActiveTheme(i)}
                className={`rounded-xl p-3 border-2 transition-all text-left ${i === activeTheme ? 'scale-[1.02]' : ''}`}
                style={{
                  borderColor: i === activeTheme ? colors.primary : colors.border,
                  background: i === activeTheme ? colors.surfaceActive : colors.surface,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <HexLogo logo={t.logo} size={28} uid={`sw-${t.id}`} />
                  <span className="text-xs font-bold" style={{ color: colors.text }}>{t.name}</span>
                </div>
                <div className="flex gap-1">
                  {t.logo.layers.map((c, j) => (
                    <div key={j} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                  ))}
                </div>
              </button>
            ))}
          </div>
          <p className="text-sm mt-3 font-medium" style={{ color: colors.textSecondary }}>{theme.desc}</p>
        </div>

        {/* Header Preview */}
        <div className="rounded-2xl p-4 border" style={{ borderColor: colors.border, background: colors.surface }}>
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: colors.text }}>
              <HexLogo logo={theme.logo} size={34} uid="header" />
              <span>Air Quality in <span style={{ color: colors.cityName }}>Stockholm</span></span>
            </h2>
            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold px-2 py-1 rounded-lg border" style={{ borderColor: colors.border, color: colors.textSecondary, background: colors.surfaceActive }}>C</span>
            </div>
          </header>
          <div className="text-sm mt-2 space-y-0.5">
            <p style={{ color: colors.textSecondary }}>Current AQI, hourly chart, peak times and 5-day forecast for Stockholm, Sweden.</p>
            <p style={{ color: colors.text }}>
              Now: <span className="font-bold" style={{ color: '#4ade80' }}>AQI 15 (Good)</span> | Peak today: <span className="font-bold" style={{ color: '#facc15' }}>AQI 35</span> at 14:00
            </p>
          </div>
        </div>

        {/* Search bar preview */}
        <div className="rounded-2xl p-3 border flex items-center gap-3" style={{ borderColor: colors.border, background: colors.surface }}>
          <div className="flex items-center gap-2 flex-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={colors.textMuted} strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span className="text-sm" style={{ color: colors.textMuted }}>Search for a location...</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold" style={{ color: colors.text }}>18 C</span>
          </div>
        </div>

        {/* AQI Gauge */}
        <AqiGauge aqi={45} colors={colors} />

        {/* Pollutant Bars */}
        <PollutantBars colors={colors} />

        {/* Hourly Pollutant Table */}
        <HourlyPollutantTable colors={colors} />

        {/* All 4 Logos comparison */}
        <div className="rounded-2xl p-4 border" style={{ borderColor: colors.border, background: colors.surface }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: colors.textSecondary }}>Logo Comparison</h3>
          <div className="flex items-center justify-around">
            {THEMES.map((t) => (
              <div key={t.id} className="text-center">
                <HexLogo logo={t.logo} size={64} uid={`cmp-${t.id}`} />
                <p className="text-[11px] mt-1 font-semibold" style={{ color: colors.textMuted }}>{t.name}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t flex items-center justify-center gap-6" style={{ borderColor: colors.border }}>
            <div className="text-center">
              <p className="text-[10px] mb-1 font-medium" style={{ color: colors.textMuted }}>UVI.today (reference)</p>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width={64} height={64}>
                <defs>
                  <linearGradient id="ref-a" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stopColor="#D84315"/><stop offset="100%" stopColor="#E65100"/></linearGradient>
                  <linearGradient id="ref-b" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stopColor="#E65100"/><stop offset="100%" stopColor="#FF6D00"/></linearGradient>
                  <linearGradient id="ref-c" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stopColor="#FF6D00"/><stop offset="100%" stopColor="#FF8F00"/></linearGradient>
                  <linearGradient id="ref-d" x1="50%" y1="0%" x2="50%" y2="100%"><stop offset="0%" stopColor="#FF8F00"/><stop offset="100%" stopColor="#FFB300"/></linearGradient>
                  <radialGradient id="ref-e" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFF"/><stop offset="25%" stopColor="#FFF9C4"/><stop offset="55%" stopColor="#FFD600"/><stop offset="100%" stopColor="#FFAB00"/></radialGradient>
                </defs>
                <g transform="translate(100,100)">
                  <polygon points="0,-94 81.4,-47 81.4,47 0,94 -81.4,47 -81.4,-47" fill="url(#ref-a)"/>
                  <polygon points="0,-94 81.4,-47 81.4,47 0,94 -81.4,47 -81.4,-47" fill="url(#ref-a)" transform="rotate(30)"/>
                  <polygon points="0,-74 64.1,-37 64.1,37 0,74 -64.1,37 -64.1,-37" fill="url(#ref-b)"/>
                  <polygon points="0,-74 64.1,-37 64.1,37 0,74 -64.1,37 -64.1,-37" fill="url(#ref-b)" transform="rotate(30)"/>
                  <polygon points="0,-54 46.8,-27 46.8,27 0,54 -46.8,27 -46.8,-27" fill="url(#ref-c)"/>
                  <polygon points="0,-54 46.8,-27 46.8,27 0,54 -46.8,27 -46.8,-27" fill="url(#ref-c)" transform="rotate(30)"/>
                  <polygon points="0,-38 32.9,-19 32.9,19 0,38 -32.9,19 -32.9,-19" fill="url(#ref-d)"/>
                  <polygon points="0,-38 32.9,-19 32.9,19 0,38 -32.9,19 -32.9,-19" fill="url(#ref-d)" transform="rotate(30)"/>
                  <circle cx="0" cy="0" r="24" fill="url(#ref-e)"/>
                  <circle cx="0" cy="0" r="8" fill="#FFF" opacity=".4"/>
                  <circle cx="0" cy="0" r="3.5" fill="#FFF" opacity=".95"/>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs space-x-4 font-medium py-4" style={{ color: colors.textMuted }}>
          <span>About</span>
          <span>Privacy</span>
          <span>Contact</span>
          <span>© Air Index Today</span>
        </div>
      </div>
    </div>
  );
}
