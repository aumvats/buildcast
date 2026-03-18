'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/features/Header';
import { ActivityPicker } from '@/components/features/ActivityPicker';
import { VerdictCalendar } from '@/components/features/VerdictCalendar';
import { ShareModal } from '@/components/features/ShareModal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { createClient } from '@/lib/supabase/client';
import { fetchForecast } from '@/lib/api/weather';
import { parseHourlyData, HourlyData } from '@/types/weather';
import { Site } from '@/types/site';
import { Verdict, ActivityType } from '@/types/rules';
import { runRules } from '@/lib/rules/engine';
import { getForecastCache, setForecastCache } from '@/lib/utils/cache';
import { MapPin, Share2, ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function SiteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const siteId = params.id as string;

  const [site, setSite] = useState<Site | null>(null);
  const [activity, setActivity] = useState<ActivityType>('general');
  const [verdicts, setVerdicts] = useState<Verdict[]>([]);
  const [allHours, setAllHours] = useState<HourlyData[]>([]);
  const [days, setDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [error, setError] = useState('');

  const loadForecast = useCallback(async (s: Site, forceRefresh = false) => {
    try {
      let data = forceRefresh ? null : getForecastCache(s.lat, s.lng);
      if (!data) {
        data = await fetchForecast(s.lat, s.lng);
        setForecastCache(s.lat, s.lng, data);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const raw = data as any;
      const hours = parseHourlyData(raw);
      const dailyDates: string[] = raw.daily.time;

      setAllHours(hours);
      setDays(dailyDates);

      const act = (s.selected_activities[0] || 'general') as ActivityType;
      setActivity(act);
      const results = runRules(hours, act, dailyDates);
      setVerdicts(results);
    } catch {
      setError('Failed to load weather data. Please try again.');
    }
  }, []);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('sites')
        .select('*')
        .eq('id', siteId)
        .single();

      if (!data) {
        router.push('/dashboard');
        return;
      }

      setSite(data);
      await loadForecast(data);
      setLoading(false);
    }
    load();
  }, [siteId, router, loadForecast]);

  // Recalculate when activity changes
  useEffect(() => {
    if (allHours.length > 0 && days.length > 0) {
      const results = runRules(allHours, activity, days);
      setVerdicts(results);
    }
  }, [activity, allHours, days]);

  const handleRefresh = async () => {
    if (!site) return;
    setRefreshing(true);
    await loadForecast(site, true);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <div className="flex items-center justify-center py-24">
          <Spinner size={32} />
        </div>
      </div>
    );
  }

  if (!site) return null;

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary mb-4 transition-colors duration-fast"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        {/* Site header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-text-primary">{site.name}</h1>
            <div className="flex items-center gap-1.5 text-text-secondary mt-1">
              <MapPin size={14} />
              <span className="text-sm">{site.address}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              aria-label="Refresh forecast"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </Button>
            <Button variant="secondary" size="sm" onClick={() => setShowShare(true)}>
              <Share2 size={16} className="mr-1" /> Share
            </Button>
          </div>
        </div>

        {/* Activity picker */}
        <Card padding="md" className="mb-6">
          <label className="block text-sm font-medium text-text-primary mb-2">Activity Type</label>
          <ActivityPicker
            selected={activity}
            onChange={(a) => setActivity(a as ActivityType)}
          />
        </Card>

        {/* Error state */}
        {error && (
          <Card padding="md" className="mb-6 border-error">
            <p className="text-sm text-error">{error}</p>
            <Button variant="secondary" size="sm" onClick={handleRefresh} className="mt-2">
              Retry
            </Button>
          </Card>
        )}

        {/* 7-day forecast */}
        {verdicts.length > 0 && (
          <div>
            <h2 className="text-[18px] font-semibold text-text-primary mb-3">7-Day Forecast</h2>
            <VerdictCalendar days={verdicts} allHours={allHours} />
          </div>
        )}
      </main>

      <ShareModal
        open={showShare}
        onClose={() => setShowShare(false)}
        shareToken={site.share_token}
        siteName={site.name}
      />
    </div>
  );
}
