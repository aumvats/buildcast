import { OpenMeteoResponse } from '@/types/weather';

export async function fetchForecast(lat: number, lng: number): Promise<OpenMeteoResponse> {
  const res = await fetch(
    `/api/weather?lat=${lat.toFixed(2)}&lng=${lng.toFixed(2)}`
  );
  if (!res.ok) {
    throw new Error('Failed to fetch weather data');
  }
  return res.json();
}
