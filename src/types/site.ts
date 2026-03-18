import { Verdict } from './rules';

export interface Site {
  id: string;
  user_id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  selected_activities: string[];
  share_token: string;
  created_at: string;
}

export interface SiteWithVerdicts extends Site {
  verdicts: Verdict[];
  lastUpdated: string;
}
