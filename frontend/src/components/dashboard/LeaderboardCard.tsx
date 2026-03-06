'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Trophy, Medal, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LeaderboardCardProps {
  rank: number;
  user: {
    name: string;
    avatar?: string;
    points: number;
    badges: string[];
  };
  isCurrentUser?: boolean;
}

export function LeaderboardCard({
  rank,
  user,
  isCurrentUser = false,
}: LeaderboardCardProps) {
  const getRankIcon = () => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-orange-500" />;
    return <span className="text-sm font-bold text-text-secondary">#{rank}</span>;
  };

  const getRankStyle = () => {
    if (rank === 1)
      return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
    if (rank === 2)
      return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3)
      return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30';
    return '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: rank * 0.05 }}
    >
      <GlassCard
        className={cn(
          'mb-2 transition-all',
          getRankStyle(),
          isCurrentUser && 'ring-2 ring-primary/50',
          'hover:scale-102'
        )}
        hover
      >
        <div className="flex items-center gap-3">
          {/* Rank */}
          <div className="flex-shrink-0 w-8 flex items-center justify-center">
            {getRankIcon()}
          </div>

          {/* Avatar */}
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h4
                className={cn(
                  'font-semibold text-text-primary truncate',
                  isCurrentUser && 'text-primary'
                )}
              >
                {user.name}
                {isCurrentUser && ' (You)'}
              </h4>
            </div>
            {user.badges.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                {user.badges.slice(0, 3).map((badge, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Points */}
          <div className="flex-shrink-0 text-right">
            <div className="text-lg font-bold text-text-primary">
              {user.points.toLocaleString()}
            </div>
            <div className="text-xs text-text-secondary">points</div>
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}
