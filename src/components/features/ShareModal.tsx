'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Copy, Check, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  shareToken: string;
  siteName: string;
}

export function ShareModal({ open, onClose, shareToken, siteName }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://buildcast-app.vercel.app';
  const shareUrl = `${appUrl}/site/${shareToken}/share`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="Share Forecast">
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          Share the forecast for <strong>{siteName}</strong> with your team or clients. No login needed to view.
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={shareUrl}
            className="flex-1 px-3 py-2.5 min-h-[44px] border border-border rounded-md text-sm bg-bg text-text-primary font-mono"
          />
          <Button onClick={handleCopy} variant="secondary" size="md" aria-label={copied ? 'Copied' : 'Copy link'}>
            {copied ? <Check size={18} className="text-success" /> : <Copy size={18} />}
          </Button>
        </div>

        <a
          href={shareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          Open preview <ExternalLink size={14} />
        </a>
      </div>
    </Modal>
  );
}
