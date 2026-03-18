import { NextRequest, NextResponse } from 'next/server';

let lastCallTime = 0;

async function rateLimitedFetch(url: string): Promise<Response> {
  const now = Date.now();
  const timeSinceLastCall = now - lastCallTime;
  if (timeSinceLastCall < 1000) {
    await new Promise((resolve) => setTimeout(resolve, 1000 - timeSinceLastCall));
  }
  lastCallTime = Date.now();
  return fetch(url, {
    headers: { 'User-Agent': 'BuildCast/1.0 (contact@buildcast.app)' },
  });
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'q parameter required' }, { status: 400 });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`;
    const res = await rateLimitedFetch(url);

    if (!res.ok) {
      return NextResponse.json({ error: 'geocoding_unavailable' }, { status: 502 });
    }

    const data = await res.json();
    const results = data.map((item: { lat: string; lon: string; display_name: string }) => ({
      lat: parseFloat(item.lat),
      lng: parseFloat(item.lon),
      displayName: item.display_name,
    }));

    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: 'geocoding_unavailable' }, { status: 502 });
  }
}
