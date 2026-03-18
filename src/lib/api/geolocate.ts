export interface IPLocation {
  city: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

const STORAGE_KEY = 'buildcast_location';

export async function getIPLocation(): Promise<IPLocation | null> {
  if (typeof window === 'undefined') return null;

  const cached = localStorage.getItem(STORAGE_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch {
      // ignore
    }
  }

  try {
    const res = await fetch('/api/geolocate');
    if (!res.ok) return null;
    const data = await res.json();
    if (data.error) return null;
    // QA: fixed — localStorage.setItem was inside the outer try, so a QuotaExceededError
    // would be caught and return null even though the fetch succeeded; now isolated
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Storage full — skip caching, still return the successfully fetched data
    }
    return data;
  } catch {
    return null;
  }
}
