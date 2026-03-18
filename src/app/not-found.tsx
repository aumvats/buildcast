import Link from 'next/link';
import { CloudSun, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CloudSun size={40} className="text-text-secondary/40 mx-auto mb-4" />
        <h1 className="text-[22px] font-semibold text-text-primary mb-2">
          Page not found
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-md text-sm font-medium min-h-[44px] hover:bg-primary-hover transition-colors"
        >
          Back to Home <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
