import { VerdictStatus } from '@/types/rules';
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

interface BadgeProps {
  status: VerdictStatus;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const statusStyles: Record<VerdictStatus, string> = {
  green: 'bg-emerald-50 text-success border-emerald-200',
  yellow: 'bg-amber-50 text-accent border-amber-200',
  red: 'bg-red-50 text-error border-red-200',
};

const statusLabels: Record<VerdictStatus, string> = {
  green: 'Go',
  yellow: 'Caution',
  red: 'No-Go',
};

const icons: Record<VerdictStatus, typeof CheckCircle> = {
  green: CheckCircle,
  yellow: AlertTriangle,
  red: XCircle,
};

const sizeConfig: Record<string, { icon: number; text: string; padding: string }> = {
  sm: { icon: 14, text: 'text-xs', padding: 'px-2 py-0.5' },
  md: { icon: 16, text: 'text-sm', padding: 'px-2.5 py-1' },
  lg: { icon: 18, text: 'text-base', padding: 'px-3 py-1.5' },
};

export function Badge({ status, size = 'md', label }: BadgeProps) {
  const Icon = icons[status];
  const config = sizeConfig[size];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border
        ${statusStyles[status]} ${config.padding} ${config.text}`}
    >
      <Icon size={config.icon} />
      {label ?? statusLabels[status]}
    </span>
  );
}
