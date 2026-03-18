'use client';

import { useState } from 'react';
import { Verdict } from '@/types/rules';
import { HourlyData } from '@/types/weather';
import { Badge } from '@/components/ui/Badge';
import { DayCard } from './DayCard';
import { formatDayName, formatDateShort } from '@/lib/utils/format';
import { getDayHours } from '@/lib/rules/engine';

interface VerdictCalendarProps {
  days: Verdict[];
  allHours: HourlyData[];
}

export function VerdictCalendar({ days, allHours }: VerdictCalendarProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  return (
    <div className="space-y-2">
      {days.map((verdict, index) => {
        const dayHours = getDayHours(allHours, index);
        const isExpanded = expandedDay === index;

        return (
          <div key={verdict.date} className="border border-border rounded-lg overflow-hidden bg-surface transition-[border-color,box-shadow] duration-fast hover:border-primary/20">
            <button
              type="button"
              onClick={() => setExpandedDay(isExpanded ? null : index)}
              aria-expanded={isExpanded}
              className="w-full px-4 py-3 min-h-[44px] flex items-center justify-between gap-3 hover:bg-bg/50 transition-colors duration-fast cursor-pointer active:bg-bg"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-left shrink-0 w-20">
                  <div className="text-sm font-semibold text-text-primary">
                    {formatDayName(verdict.date)}
                  </div>
                  <div className="text-xs text-text-secondary">
                    {formatDateShort(verdict.date)}
                  </div>
                </div>
                <Badge status={verdict.status} size="sm" />
              </div>
              <p className="text-sm text-text-secondary text-right truncate min-w-0">
                {verdict.reason}
              </p>
            </button>

            {isExpanded && dayHours.length > 0 && (
              <div className="border-t border-border">
                <DayCard verdict={verdict} hourly={dayHours} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
