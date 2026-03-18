'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/features/Header';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [tempUnit, setTempUnit] = useState<'fahrenheit' | 'celsius'>('fahrenheit');
  const [windUnit, setWindUnit] = useState<'mph' | 'kmh'>('mph');
  const [plan, setPlan] = useState('free');

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setEmail(user.email || '');
        setPlan(user.user_metadata?.plan || 'free');
      }
    });

    // Load unit preferences from localStorage
    if (typeof window !== 'undefined') {
      setTempUnit((localStorage.getItem('buildcast_temp_unit') as 'fahrenheit' | 'celsius') || 'fahrenheit');
      setWindUnit((localStorage.getItem('buildcast_wind_unit') as 'mph' | 'kmh') || 'mph');
    }
  }, []);

  const handleTempChange = (unit: 'fahrenheit' | 'celsius') => {
    setTempUnit(unit);
    localStorage.setItem('buildcast_temp_unit', unit);
  };

  const handleWindChange = (unit: 'mph' | 'kmh') => {
    setWindUnit(unit);
    localStorage.setItem('buildcast_wind_unit', unit);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-bg">
      <Header />

      <main className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-[28px] font-bold text-text-primary mb-6">Settings</h1>

        <div className="space-y-4">
          {/* Account */}
          <Card padding="md">
            <h2 className="text-[18px] font-semibold text-text-primary mb-3">Account</h2>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-text-secondary">Email</span>
                <p className="text-[15px] text-text-primary">{email}</p>
              </div>
              <div>
                <span className="text-sm text-text-secondary">Plan</span>
                <p className="text-[15px] text-text-primary capitalize">{plan}</p>
              </div>
            </div>
          </Card>

          {/* Units */}
          <Card padding="md">
            <h2 className="text-[18px] font-semibold text-text-primary mb-3">Units</h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-text-secondary block mb-1.5">Temperature</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTempChange('fahrenheit')}
                    className={`px-4 py-2 min-h-[44px] rounded-md text-sm font-medium border transition-all duration-fast cursor-pointer active:scale-[0.97] ${
                      tempUnit === 'fahrenheit'
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border text-text-secondary hover:bg-bg hover:border-primary/30'
                    }`}
                  >
                    °F (Fahrenheit)
                  </button>
                  <button
                    onClick={() => handleTempChange('celsius')}
                    className={`px-4 py-2 min-h-[44px] rounded-md text-sm font-medium border transition-all duration-fast cursor-pointer active:scale-[0.97] ${
                      tempUnit === 'celsius'
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border text-text-secondary hover:bg-bg hover:border-primary/30'
                    }`}
                  >
                    °C (Celsius)
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1.5">Wind Speed</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleWindChange('mph')}
                    className={`px-4 py-2 min-h-[44px] rounded-md text-sm font-medium border transition-all duration-fast cursor-pointer active:scale-[0.97] ${
                      windUnit === 'mph'
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border text-text-secondary hover:bg-bg hover:border-primary/30'
                    }`}
                  >
                    mph
                  </button>
                  <button
                    onClick={() => handleWindChange('kmh')}
                    className={`px-4 py-2 min-h-[44px] rounded-md text-sm font-medium border transition-all duration-fast cursor-pointer active:scale-[0.97] ${
                      windUnit === 'kmh'
                        ? 'border-primary bg-primary/5 text-primary shadow-sm'
                        : 'border-border text-text-secondary hover:bg-bg hover:border-primary/30'
                    }`}
                  >
                    km/h
                  </button>
                </div>
              </div>
            </div>
          </Card>

          {/* Sign Out */}
          <Button variant="secondary" onClick={handleSignOut} className="w-full">
            Sign Out
          </Button>
        </div>
      </main>
    </div>
  );
}
