'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirect)}`,
      },
    });
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 transition-opacity duration-fast hover:opacity-80">
            <CloudSun size={28} className="text-primary" />
            <span className="text-xl font-bold text-text-primary">BuildCast</span>
          </Link>
          <h1 className="text-[22px] font-semibold text-text-primary">Welcome back</h1>
          <p className="text-sm text-text-secondary mt-1">Log in to access your dashboard</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3 py-2.5 min-h-[44px] border border-border rounded-md text-[15px] bg-surface text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-fast"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3 py-2.5 min-h-[44px] border border-border rounded-md text-[15px] bg-surface text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-fast"
              />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner size={18} className="text-white" /> : 'Log In'}
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-secondary">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <Button variant="secondary" onClick={handleGoogleLogin} className="w-full">
            Continue with Google
          </Button>
        </Card>

        <p className="text-center text-sm text-text-secondary mt-4">
          Don&apos;t have an account?{' '}
          <Link href={`/auth/signup?redirect=${encodeURIComponent(redirect)}`} className="text-primary hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
