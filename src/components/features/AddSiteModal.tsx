'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { LocationInput } from './LocationInput';
import { ActivityPicker } from './ActivityPicker';
import { Spinner } from '@/components/ui/Spinner';
import { ActivityType } from '@/types/rules';
import { createClient } from '@/lib/supabase/client';

interface AddSiteModalProps {
  open: boolean;
  onClose: () => void;
  onSiteAdded: () => void;
  siteCount: number;
  planLimit: number;
}

export function AddSiteModal({ open, onClose, onSiteAdded, siteCount, planLimit }: AddSiteModalProps) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState<{ lat: number; lng: number; displayName: string } | null>(null);
  const [activity, setActivity] = useState<ActivityType>('general');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const atLimit = siteCount >= planLimit;

  const handleSave = async () => {
    if (!name.trim()) {
      setError('Please enter a site name.');
      return;
    }
    if (!location) {
      setError('Please select a location.');
      return;
    }
    setError('');
    setSaving(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to save a site.');
        setSaving(false);
        return;
      }

      const { error: insertError } = await supabase.from('sites').insert({
        user_id: user.id,
        name: name.trim(),
        address: location.displayName,
        lat: location.lat,
        lng: location.lng,
        selected_activities: [activity],
      });

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }

      setName('');
      setLocation(null);
      setActivity('general');
      onSiteAdded();
      onClose();
    } catch {
      setError('Failed to save site. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Add Job Site">
      {atLimit ? (
        <div className="space-y-4">
          <p className="text-text-secondary text-sm">
            You&apos;ve used all {planLimit} site{planLimit === 1 ? '' : 's'} on your current plan.
          </p>
          <a href="/pricing">
            <Button>Upgrade to Add More Sites</Button>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Site Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='e.g., "Johnson Residence"'
              className="w-full px-3 py-2.5 min-h-[44px] border border-border rounded-md text-[15px] bg-surface text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-fast"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Location</label>
            <LocationInput
              onSelect={(lat, lng, displayName) => setLocation({ lat, lng, displayName })}
            />
            {location && (
              <p className="mt-1 text-xs text-success">
                Location set: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Activity Type</label>
            <ActivityPicker
              selected={activity}
              onChange={(a) => setActivity(a as ActivityType)}
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving || !name.trim() || !location} className="flex-1">
              {saving ? <Spinner size={18} className="text-white" /> : 'Save Site'}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
