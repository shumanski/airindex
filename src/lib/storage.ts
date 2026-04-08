export interface StoredLocation {
  lat: number;
  lon: number;
  name: string;
  geoId?: number;
}

export type TempUnit = 'C' | 'F';
export type Theme = 'light' | 'dark';

export interface StoredPreferences {
  locale: string | null;
  tempUnit: TempUnit;
  theme: Theme;
}

const STORAGE_KEY = 'airindex-prefs';

function detectTempUnit(): TempUnit {
  if (typeof navigator === 'undefined') return 'C';
  const lang = navigator.language || '';
  return /^en-(US|BS|KY|PW|MH|BZ)$/i.test(lang) ? 'F' : 'C';
}

function detectTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function loadPreferences(): StoredPreferences {
  if (typeof window === 'undefined') {
    return { locale: null, tempUnit: 'C', theme: 'light' };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        locale: parsed.locale || null,
        tempUnit: parsed.tempUnit || detectTempUnit(),
        theme: parsed.theme || detectTheme(),
      };
    }
  } catch {
    // Corrupted data, reset
  }
  return { locale: null, tempUnit: detectTempUnit(), theme: detectTheme() };
}

export function savePreferences(prefs: Partial<StoredPreferences>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadPreferences();
    const merged = { ...current, ...prefs };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // localStorage might be full or disabled
  }
}
