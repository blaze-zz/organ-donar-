import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'primary' | 'accent' | 'success' | 'warning';
}

export function StatCard({ title, value, icon: Icon, trend, variant = 'default' }: StatCardProps) {
  const variants = {
    default: 'bg-card',
    primary: 'gradient-primary text-primary-foreground',
    accent: 'gradient-accent text-accent-foreground',
    success: 'bg-success text-success-foreground',
    warning: 'bg-warning text-warning-foreground',
  };

  const iconBg = {
    default: 'bg-primary/10 text-primary',
    primary: 'bg-white/20 text-primary-foreground',
    accent: 'bg-white/20 text-accent-foreground',
    success: 'bg-white/20 text-success-foreground',
    warning: 'bg-white/20 text-warning-foreground',
  };

  return (
    <div className={cn(
      'rounded-2xl p-6 shadow-card transition-all hover:shadow-lg hover:-translate-y-1',
      variants[variant]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className={cn(
            'text-sm font-medium mb-1',
            variant === 'default' ? 'text-muted-foreground' : 'opacity-80'
          )}>
            {title}
          </p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <p className={cn(
              'text-xs mt-2',
              variant === 'default' ? 'text-muted-foreground' : 'opacity-70'
            )}>
              <span className={trend.value >= 0 ? 'text-green-500' : 'text-red-500'}>
                {trend.value >= 0 ? '+' : ''}{trend.value}%
              </span>{' '}
              {trend.label}
            </p>
          )}
        </div>
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', iconBg[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
