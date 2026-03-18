'use client';

import dynamic from 'next/dynamic';
import { Verdict } from '@/types/rules';
import { HourlyData } from '@/types/weather';
import { Spinner } from '@/components/ui/Spinner';

const HourlyCharts = dynamic(() => import('./HourlyCharts').then((m) => m.HourlyCharts), {
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <Spinner size={24} />
    </div>
  ),
  ssr: false,
});

interface DayCardProps {
  verdict: Verdict;
  hourly: HourlyData[];
}

export function DayCard({ verdict, hourly }: DayCardProps) {
  return (
    <div className="p-4 space-y-4 animate-fade-in">
      <div className="text-sm text-text-primary font-medium">
        {verdict.reason}
      </div>
      <HourlyCharts hourly={hourly} />
    </div>
  );
}
