'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Bell, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface AnnouncementCardProps {
  announcement: {
    id: string;
    title: string;
    content: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    author: string;
    publishDate: Date;
    isRead: boolean;
    isPinned: boolean;
  };
  onMarkAsRead?: () => void;
  onClick?: () => void;
}

export function AnnouncementCard({
  announcement,
  onMarkAsRead,
  onClick,
}: AnnouncementCardProps) {
  const priorityConfig = {
    urgent: {
      icon: AlertCircle,
      color: 'text-red-500',
      bg: 'bg-red-500/10',
      border: 'border-red-500/30',
    },
    high: {
      icon: Bell,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/30',
    },
    medium: {
      icon: Info,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
    },
    low: {
      icon: CheckCircle2,
      color: 'text-gray-500',
      bg: 'bg-gray-500/10',
      border: 'border-gray-500/30',
    },
  };

  const config = priorityConfig[announcement.priority];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard
        className={cn(
          'mb-3 cursor-pointer transition-all',
          !announcement.isRead && 'ring-2 ring-primary/50',
          announcement.isPinned && 'border-l-4 border-l-primary'
        )}
        onClick={onClick}
        hover
      >
        <div className="flex items-start gap-3">
          {/* Priority Icon */}
          <div
            className={cn(
              'p-2 rounded-lg flex-shrink-0',
              config.bg,
              config.border,
              'border'
            )}
          >
            <Icon className={cn('w-5 h-5', config.color)} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h4
                className={cn(
                  'font-semibold text-text-primary',
                  !announcement.isRead && 'font-bold'
                )}
              >
                {announcement.title}
                {announcement.isPinned && (
                  <span className="ml-2 text-xs text-primary">📌 Pinned</span>
                )}
              </h4>
            </div>
            <p className="text-sm text-text-secondary line-clamp-2 mb-2">
              {announcement.content}
            </p>
            <div className="flex items-center gap-3 text-xs text-text-secondary">
              <span>{announcement.author}</span>
              <span>•</span>
              <span>{formatDistanceToNow(announcement.publishDate, { addSuffix: true })}</span>
              <span>•</span>
              <span className="capitalize">{announcement.category}</span>
            </div>
          </div>

          {/* Read Indicator */}
          {!announcement.isRead && (
            <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
          )}
        </div>
      </GlassCard>
    </motion.div>
  );
}
