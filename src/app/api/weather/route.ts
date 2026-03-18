import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!lat || !lng) {
    return NextResponse.json({ error: 'lat and lng required' }, { status: 400 });
  }

  const roundedLat = parseFloat(parseFloat(lat).toFixed(2));
  const roundedLng = parseFloat(parseFloat(lng).toFixed(2));

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${roundedLat}&longitude=${roundedLng}&hourly=temperature_2m,precipitation_probability,precipitation,windspeed_10m,windgusts_10m,relativehumidity_2m,dewpoint_2m,cloudcover,visibility,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&temperature_unit=fahrenheit&windspeed_unit=mph&timezone=auto`;

  try {
    const res = await fetch(url, { next: { revalidate: 10800 } });
    if (!res.ok) {
      return NextResponse.json({ error: 'Weather service unavailable' }, { status: 502 });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: 'Weather service unavailable' }, { status: 502 });
  }
}
