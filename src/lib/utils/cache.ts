const FORECAST_PREFIX = 'buildcast_forecast_';
const CACHE_DURATION = 3 * 60 * 60 * 1000; // 3 hours

interface CachedForecast {
  data: unknown;
  timestamp: number;
}

export function getForecastCache(lat: number, lng: number): unknown | null {
  if (typeof window === 'undefined') return null;
  const key = `${FORECAST_PREFIX}${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const cached: CachedForecast = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      localStorage.removeItem(key);
      return null;
    }
    return cached.data;
  } catch {
    return null;
  }
}

export function setForecastCache(lat: number, lng: number, data: unknown): void {
  if (typeof window === 'undefined') return;
  const key = `${FORECAST_PREFIX}${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const cached: CachedForecast = { data, timestamp: Date.now() };
  try {
    localStorage.setItem(key, JSON.stringify(cached));
  } catch {
    // localStorage full — ignore
  }
}

export function getCacheAge(lat: number, lng: number): number | null {
  if (typeof window === 'undefined') return null;
  const key = `${FORECAST_PREFIX}${lat.toFixed(2)}_${lng.toFixed(2)}`;
  const raw = localStorage.getItem(key);
  if (!raw) return null;
  try {
    const cached: CachedForecast = JSON.parse(raw);
    return Date.now() - cached.timestamp;
  } catch {
    return null;
  }
}
