'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CloudSun } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { createClient } from '@/lib/supabase/client';

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { plan: 'free' },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        },
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <Card padding="lg" className="max-w-sm w-full text-center animate-scale-in">
          <CloudSun size={32} className="text-primary mx-auto mb-3" />
          <h2 className="text-[18px] font-semibold text-text-primary mb-2">Check your email</h2>
          <p className="text-sm text-text-secondary">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
          </p>
          <Link href="/" className="inline-block mt-4 text-sm text-primary hover:underline">
            Back to home
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm animate-fade-in-up">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 transition-opacity duration-fast hover:opacity-80">
            <CloudSun size={28} className="text-primary" />
            <span className="text-xl font-bold text-text-primary">BuildCast</span>
          </Link>
          <h1 className="text-[22px] font-semibold text-text-primary">Create your account</h1>
          <p className="text-sm text-text-secondary mt-1">Start tracking weather for your job sites</p>
        </div>

        <Card padding="lg">
          <form onSubmit={handleSignup} className="space-y-4">
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
                placeholder="Minimum 6 characters"
                required
                minLength={6}
                className="w-full px-3 py-2.5 min-h-[44px] border border-border rounded-md text-[15px] bg-surface text-text-primary placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-fast"
              />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Spinner size={18} className="text-white" /> : 'Create Account'}
            </Button>
          </form>

        </Card>

        <p className="text-center text-sm text-text-secondary mt-4">
          Already have an account?{' '}
          <Link href={`/auth/login?redirect=${encodeURIComponent(redirect)}`} className="text-primary hover:underline font-medium">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
