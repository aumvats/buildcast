export interface GeocodeSuggestion {
  lat: number;
  lng: number;
  displayName: string;
}

export async function geocodeAddress(query: string): Promise<GeocodeSuggestion[]> {
  const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
  if (!res.ok) {
    throw new Error('Geocoding failed');
  }
  const data = await res.json();
  if (data.error) throw new Error(data.error);
  return data.results;
}
