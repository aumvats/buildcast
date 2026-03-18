'use client';

import { useState, useEffect } from 'react';
import { VerdictCalendar } from '@/components/features/VerdictCalendar';
import { Spinner } from '@/components/ui/Spinner';
import { fetchForecast } from '@/lib/api/weather';
import { parseHourlyData, HourlyData } from '@/types/weather';
import { Verdict, ActivityType, ACTIVITY_LABELS } from '@/types/rules';
import { runRules } from '@/lib/rules/engine';
import { Badge as BadgeComponent } from '@/components/ui/Badge';

interface ShareViewClientProps {
  lat: number;
  lng: number;
  activity: string;
}

export function ShareViewClient({ lat, lng, activity }: ShareViewClientProps) {
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);
  const [allHours, setAllHours] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchForecast(lat, lng);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = data as any;
        const hours = parseHourlyData(raw);
        const dailyDates: string[] = raw.daily.time;

        setAllHours(hours);
        const results = runRules(hours, activity as ActivityType, dailyDates);
        setVerdicts(results);
      } catch {
        setError('Unable to load weather data at this time.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [lat, lng, activity]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-error">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-text-secondary">Activity:</span>
        <span className="text-sm font-medium text-text-primary">
          {ACTIVITY_LABELS[activity as ActivityType] || 'General Construction'}
        </span>
        {verdicts[0] && <BadgeComponent status={verdicts[0].status} size="sm" />}
      </div>
      <VerdictCalendar days={verdicts} allHours={allHours} />
    </div>
  );
}
