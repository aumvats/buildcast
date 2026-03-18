import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) {
      return NextResponse.json({ error: 'unavailable' }, { status: 502 });
    }
    const data = await res.json();
    // QA: fixed — ipapi.co returns HTTP 200 with {error: true} on failures (rate limit, private IP)
    // The if (!res.ok) guard above doesn't catch these; check the error field explicitly
    if (data.error) {
      return NextResponse.json({ error: 'unavailable' }, { status: 502 });
    }
    return NextResponse.json({
      city: data.city,
      region: data.region,
      country: data.country_name,
      latitude: data.latitude,
      longitude: data.longitude,
      timezone: data.timezone,
    });
  } catch {
    return NextResponse.json({ error: 'unavailable' }, { status: 502 });
  }
}
