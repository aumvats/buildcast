import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CloudSun, ArrowRight } from 'lucide-react';
import { ShareViewClient } from './ShareViewClient';

async function getSiteByShareToken(shareToken: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return null;
  }

  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, serviceKey);

  const { data } = await supabase
    .from('buildcast_sites')
    .select('*')
    .eq('share_token', shareToken)
    .single();

  return data;
}

export default async function SharedViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: shareToken } = await params;
  const site = await getSiteByShareToken(shareToken);

  if (!site) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center px-4">
        <div className="text-center">
          <CloudSun size={40} className="text-text-secondary/40 mx-auto mb-4" />
          <h1 className="text-[22px] font-semibold text-text-primary mb-2">
            Forecast no longer available
          </h1>
          <p className="text-sm text-text-secondary mb-4">
            This forecast link has expired or the site has been removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-primary hover:underline text-sm font-medium"
          >
            Get your own BuildCast <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="bg-surface/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <CloudSun size={24} className="text-primary" />
            <span className="text-lg font-bold text-text-primary">BuildCast</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-[28px] font-bold text-text-primary">{site.name}</h1>
          <p className="text-sm text-text-secondary mt-1">{site.address}</p>
        </div>

        <ShareViewClient
          lat={site.lat}
          lng={site.lng}
          activity={site.selected_activities[0] || 'general'}
        />

        {/* CTA */}
        <div className="mt-8 text-center bg-surface border border-border rounded-lg p-6 hover:border-primary/20 transition-all duration-normal">
          <p className="text-sm text-text-secondary mb-3">
            Get construction-grade weather intelligence for your own job sites.
          </p>
          <Link
            href="/check"
            className="inline-flex items-center gap-1.5 bg-primary text-white px-4 py-2.5 rounded-md text-sm font-medium min-h-[44px] hover:bg-primary-hover shadow-sm hover:shadow transition-all duration-fast active:scale-[0.98]"
          >
            Try BuildCast Free <ArrowRight size={16} />
          </Link>
        </div>
      </main>
    </div>
  );
}
