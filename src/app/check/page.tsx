'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/features/Header';
import { LocationInput } from '@/components/features/LocationInput';
import { ActivityPicker } from '@/components/features/ActivityPicker';
import { VerdictCalendar } from '@/components/features/VerdictCalendar';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { fetchForecast } from '@/lib/api/weather';
import { getIPLocation } from '@/lib/api/geolocate';
import { parseHourlyData, HourlyData } from '@/types/weather';
import { ActivityType, Verdict } from '@/types/rules';
import { runRules } from '@/lib/rules/engine';
import { setForecastCache, getForecastCache } from '@/lib/utils/cache';
import { ArrowRight, CloudSun } from 'lucide-react';
import Link from 'next/link';

export default function QuickCheckPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number; displayName: string } | null>(null);
  const [activity, setActivity] = useState<ActivityType>('concrete');
  const [defaultCity, setDefaultCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verdicts, setVerdicts] = useState<Verdict[] | null>(null);
  const [allHours, setAllHours] = useState<HourlyData[]>([]);
  const [days, setDays] = useState<string[]>([]);

  // Auto-detect location on mount
  useEffect(() => {
    getIPLocation().then((loc) => {
      if (loc) {
        setDefaultCity(loc.city + ', ' + loc.region);
      }
    });
  }, []);

  // Recalculate verdicts when activity changes (if we have data)
  useEffect(() => {
    if (allHours.length > 0 && days.length > 0) {
      const newVerdicts = runRules(allHours, activity, days);
      setVerdicts(newVerdicts);
    }
  }, [activity, allHours, days]);

  const handleCheck = async () => {
    if (!location) {
      setError('Please select a location first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check localStorage cache first
      const cached = getForecastCache(location.lat, location.lng);
      let data;

      if (cached) {
        data = cached;
      } else {
        data = await fetchForecast(location.lat, location.lng);
        setForecastCache(location.lat, location.lng, data);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = data as any;
      const hours = parseHourlyData(raw);
      const dailyDates: string[] = raw.daily.time;

      setAllHours(hours);
      setDays(dailyDates);

      const results = runRules(hours, activity, dailyDates);
      setVerdicts(results);
    } catch {
      setError('Failed to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-[28px] font-bold text-text-primary mb-2">Quick Weather Check</h1>
          <p className="text-text-secondary">
            Enter your job site location and activity to get a 7-day go/no-go forecast.
          </p>
        </div>

        <Card padding="lg" className="mb-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Job Site Location
              </label>
              <LocationInput
                defaultValue={defaultCity}
                onSelect={(lat, lng, displayName) =>
                  setLocation({ lat, lng, displayName })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                Activity Type
              </label>
              <ActivityPicker
                selected={activity}
                onChange={(a) => setActivity(a as ActivityType)}
              />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <Button onClick={handleCheck} disabled={loading || !location} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Spinner size={18} className="text-white" /> Checking weather...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <CloudSun size={18} /> Get 7-Day Verdict
                </span>
              )}
            </Button>
          </div>
        </Card>

        {verdicts && (
          <div className="space-y-4 animate-fade-in-up">
            <h2 className="text-[18px] font-semibold text-text-primary">
              7-Day Forecast — {location?.displayName?.split(',').slice(0, 2).join(',')}
            </h2>

            <VerdictCalendar days={verdicts} allHours={allHours} />

            <Card padding="md" className="text-center">
              <p className="text-sm text-text-secondary mb-3">
                Want to save this site and track it over time?
              </p>
              <Link href="/auth/signup?redirect=/dashboard">
                <Button variant="secondary">
                  Save This Site <ArrowRight size={16} className="ml-1" />
                </Button>
              </Link>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
