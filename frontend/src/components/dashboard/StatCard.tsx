'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
  delay?: number;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  className,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <GlassCard
        className={cn('hover:scale-102 transition-transform', className)}
        hover
        fringe
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-text-secondary mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-bold text-text-primary">{value}</h3>
              {trend && (
                <div
                  className={cn(
                    'flex items-center gap-1 text-sm',
                    trend.direction === 'up' ? 'text-green-500' : 'text-red-500'
                  )}
                >
                  {trend.direction === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{Math.abs(trend.value)}%</span>
                </div>
              )}
            </div>
          </div>
          {icon && (
            <div className="p-2 rounded-lg bg-[rgba(59,130,246,0.1)]">
              {icon}
            </div>
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
