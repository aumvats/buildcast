'use client';

import { ActivityType, ACTIVITY_LABELS } from '@/types/rules';
import { Hammer, Paintbrush, Home, TowerControl, Shovel, HardHat } from 'lucide-react';

const ACTIVITY_ICONS: Record<ActivityType, typeof Hammer> = {
  concrete: Hammer,
  painting: Paintbrush,
  roofing: Home,
  crane: TowerControl,
  excavation: Shovel,
  general: HardHat,
};

const ACTIVITIES: ActivityType[] = ['concrete', 'painting', 'roofing', 'crane', 'excavation', 'general'];

interface ActivityPickerProps {
  selected: ActivityType | ActivityType[];
  multi?: boolean;
  onChange: (activity: ActivityType | ActivityType[]) => void;
}

export function ActivityPicker({ selected, multi = false, onChange }: ActivityPickerProps) {
  const selectedArray = Array.isArray(selected) ? selected : [selected];

  const handleClick = (activity: ActivityType) => {
    if (multi) {
      const currentArray = Array.isArray(selected) ? selected : [selected];
      if (currentArray.includes(activity)) {
        const filtered = currentArray.filter((a) => a !== activity);
        onChange(filtered.length > 0 ? filtered : [activity]);
      } else {
        onChange([...currentArray, activity]);
      }
    } else {
      onChange(activity);
    }
  };

  return (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {ACTIVITIES.map((activity) => {
        const Icon = ACTIVITY_ICONS[activity];
        const isSelected = selectedArray.includes(activity);
        return (
          <button
            key={activity}
            type="button"
            onClick={() => handleClick(activity)}
            className={`flex flex-col items-center gap-1.5 p-3 rounded-lg border min-h-[44px] transition-all duration-fast cursor-pointer active:scale-[0.97]
              ${
                isSelected
                  ? 'border-primary bg-primary/5 text-primary shadow-sm'
                  : 'border-border bg-surface text-text-secondary hover:border-primary/30 hover:bg-bg hover:text-text-primary'
              }`}
          >
            <Icon size={22} />
            <span className="text-xs font-medium text-center leading-tight">
              {ACTIVITY_LABELS[activity]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
