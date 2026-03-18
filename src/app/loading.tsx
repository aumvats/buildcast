import { CloudSun } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center">
        <CloudSun size={32} className="text-primary mx-auto mb-3 animate-pulse" />
        <p className="text-sm text-text-secondary">Loading...</p>
      </div>
    </div>
  );
}
