'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/features/Header';
import { SiteCard } from '@/components/features/SiteCard';
import { AddSiteModal } from '@/components/features/AddSiteModal';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import { fetchForecast } from '@/lib/api/weather';
import { parseHourlyData } from '@/types/weather';
import { Site } from '@/types/site';
import { Verdict, ActivityType } from '@/types/rules';
import { runRules } from '@/lib/rules/engine';
import { getForecastCache, setForecastCache, getCacheAge } from '@/lib/utils/cache';
import { MapPin, Plus, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [verdicts, setVerdicts] = useState<Record<string, Verdict>>({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [staleData, setStaleData] = useState(false);
  const [userPlan, setUserPlan] = useState<'free' | 'pro'>('free');

  const loadSites = useCallback(async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const plan = (user.user_metadata?.plan as 'free' | 'pro') || 'free';
    setUserPlan(plan);

    const { data } = await supabase
      .from('buildcast_sites')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setSites(data);
      await loadVerdicts(data);
    }
    setLoading(false);
  }, []);

  const loadVerdicts = async (sitesToLoad: Site[]) => {
    const newVerdicts: Record<string, Verdict> = {};
    let hasStale = false;

    await Promise.all(
      sitesToLoad.map(async (site) => {
        try {
          const cacheAge = getCacheAge(site.lat, site.lng);
          if (cacheAge && cacheAge > 3 * 60 * 60 * 1000) hasStale = true;

          let data = getForecastCache(site.lat, site.lng);
          if (!data) {
            data = await fetchForecast(site.lat, site.lng);
            setForecastCache(site.lat, site.lng, data);
          }

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const raw = data as any;
          const hours = parseHourlyData(raw);
          const dailyDates: string[] = raw.daily.time;
          const activity = (site.selected_activities[0] || 'general') as ActivityType;
          const dayVerdicts = runRules(hours, activity, dailyDates);
          newVerdicts[site.id] = dayVerdicts[0]; // Today's verdict
        } catch {
          newVerdicts[site.id] = {
            status: 'yellow',
            reason: 'Weather data temporarily unavailable',
            date: new Date().toISOString().split('T')[0],
          };
        }
      })
    );

    setVerdicts(newVerdicts);
    setStaleData(hasStale);
  };

  useEffect(() => {
    loadSites();
  }, [loadSites]);

  const planLimit = userPlan === 'pro' ? 10 : 1;

  if (loading) {
    return (
      <div className="min-h-screen bg-bg">
        <Header onAddSite={() => setShowAddModal(true)} />
        <div className="flex items-center justify-center py-24">
          <Spinner size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <Header onAddSite={() => setShowAddModal(true)} />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[28px] font-bold text-text-primary">Dashboard</h1>
          <Button onClick={() => setShowAddModal(true)} size="sm">
            <Plus size={16} className="mr-1" /> Add Site
          </Button>
        </div>

        {staleData && (
          <div className="flex items-center gap-2 bg-warning/5 border border-warning/20 rounded-md px-4 py-2.5 mb-4 animate-fade-in">
            <AlertTriangle size={16} className="text-accent shrink-0" />
            <p className="text-sm text-accent">
              Some forecasts are using cached data. Refresh to get the latest.
            </p>
          </div>
        )}

        {sites.length === 0 ? (
          <Card padding="lg" className="text-center py-16">
            <MapPin size={40} className="text-text-secondary/40 mx-auto mb-4" />
            <h2 className="text-[18px] font-semibold text-text-primary mb-2">No job sites yet</h2>
            <p className="text-sm text-text-secondary mb-4">
              Add your first job site to get weather verdicts.
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus size={16} className="mr-1" /> Add Your First Site
            </Button>
            <p className="text-xs text-text-secondary mt-4">
              Or try a <Link href="/check" className="text-primary hover:underline">quick check</Link> without signing up.
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sites.map((site) => (
              <SiteCard key={site.id} site={site} verdict={verdicts[site.id] || null} />
            ))}
          </div>
        )}
      </main>

      <AddSiteModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSiteAdded={loadSites}
        siteCount={sites.length}
        planLimit={planLimit}
      />
    </div>
  );
}
