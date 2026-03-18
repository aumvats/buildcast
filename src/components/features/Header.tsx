'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CloudSun, Plus, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function Header({ onAddSite }: { onAddSite?: () => void }) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <header className="bg-surface/95 backdrop-blur-sm border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity duration-fast hover:opacity-80">
          <CloudSun size={28} className="text-primary" />
          <span className="text-xl font-bold text-text-primary">BuildCast</span>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
          <Link
            href="/check"
            className={`text-sm font-medium min-h-[44px] flex items-center transition-colors duration-fast ${
              pathname === '/check' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Quick Check
          </Link>
          {user && (
            <Link
              href="/dashboard"
              className={`text-sm font-medium min-h-[44px] flex items-center transition-colors duration-fast ${
                pathname === '/dashboard' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Dashboard
            </Link>
          )}
          <Link
            href="/pricing"
            className={`text-sm font-medium min-h-[44px] flex items-center transition-colors duration-fast ${
              pathname === '/pricing' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {onAddSite && (
                <Button size="sm" onClick={onAddSite}>
                  <Plus size={16} className="mr-1" /> Add Site
                </Button>
              )}
              <Link href="/settings">
                <Button variant="ghost" size="sm">Settings</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Log In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer rounded-md hover:bg-bg active:scale-95 transition-all duration-fast"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-1 animate-slide-down">
          <Link href="/check" className="block py-2.5 px-2 text-sm font-medium text-text-secondary rounded-md hover:bg-bg transition-colors duration-fast" onClick={() => setMobileMenuOpen(false)}>
            Quick Check
          </Link>
          {user && (
            <Link href="/dashboard" className="block py-2.5 px-2 text-sm font-medium text-text-secondary rounded-md hover:bg-bg transition-colors duration-fast" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
          )}
          <Link href="/pricing" className="block py-2.5 px-2 text-sm font-medium text-text-secondary rounded-md hover:bg-bg transition-colors duration-fast" onClick={() => setMobileMenuOpen(false)}>
            Pricing
          </Link>
          {user ? (
            <>
              {onAddSite && (
                <button onClick={() => { onAddSite(); setMobileMenuOpen(false); }} className="block py-2.5 px-2 text-sm font-medium text-primary cursor-pointer rounded-md hover:bg-bg transition-colors duration-fast w-full text-left">
                  + Add Site
                </button>
              )}
              <Link href="/settings" className="block py-2.5 px-2 text-sm font-medium text-text-secondary rounded-md hover:bg-bg transition-colors duration-fast" onClick={() => setMobileMenuOpen(false)}>
                Settings
              </Link>
            </>
          ) : (
            <div className="flex gap-2 pt-3">
              <Link href="/auth/login"><Button variant="secondary" size="sm">Log In</Button></Link>
              <Link href="/auth/signup"><Button size="sm">Sign Up</Button></Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
