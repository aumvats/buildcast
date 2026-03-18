'use client';

import Link from 'next/link';
import { Site } from '@/types/site';
import { Verdict } from '@/types/rules';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { MapPin } from 'lucide-react';
import { ACTIVITY_LABELS, ActivityType } from '@/types/rules';

interface SiteCardProps {
  site: Site;
  verdict: Verdict | null;
}

export function SiteCard({ site, verdict }: SiteCardProps) {
  const primaryActivity = site.selected_activities[0] as ActivityType;
  const truncatedAddress =
    site.address.length > 50 ? site.address.slice(0, 50) + '...' : site.address;

  return (
    <Link href={`/site/${site.id}`}>
      <Card className="hover:border-primary/30 hover:shadow-md transition-all duration-normal cursor-pointer h-full group">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-text-primary text-[15px] truncate group-hover:text-primary transition-colors duration-fast">{site.name}</h3>
            {verdict && <Badge status={verdict.status} size="sm" />}
          </div>

          <div className="flex items-center gap-1.5 text-text-secondary">
            <MapPin size={14} className="shrink-0" />
            <span className="text-sm truncate">{truncatedAddress}</span>
          </div>

          {verdict && (
            <p className="text-sm text-text-secondary line-clamp-2">{verdict.reason}</p>
          )}

          <div className="text-xs text-text-secondary/70">
            {ACTIVITY_LABELS[primaryActivity] || 'General Construction'}
          </div>
        </div>
      </Card>
    </Link>
  );
}
