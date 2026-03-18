'use client';

import { CloudSun, RefreshCw } from 'lucide-react';

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <CloudSun size={40} className="text-text-secondary/40 mx-auto mb-4" />
        <h1 className="text-[22px] font-semibold text-text-primary mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-text-secondary mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-md text-sm font-medium min-h-[44px] hover:bg-primary-hover transition-colors"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    </div>
  );
}
