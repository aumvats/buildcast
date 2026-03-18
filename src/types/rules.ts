export type VerdictStatus = 'green' | 'yellow' | 'red';

export interface Verdict {
  status: VerdictStatus;
  reason: string;
  date: string;
  details?: VerdictDetail[];
}

export interface VerdictDetail {
  metric: string;
  value: number;
  threshold: number;
  unit: string;
  violated: boolean;
}

export type ActivityType = 'concrete' | 'painting' | 'roofing' | 'crane' | 'excavation' | 'general';

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  concrete: 'Concrete Pour',
  painting: 'Exterior Painting',
  roofing: 'Roofing',
  crane: 'Crane Operations',
  excavation: 'Excavation',
  general: 'General Construction',
};
