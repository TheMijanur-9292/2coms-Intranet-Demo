'use client';

import { motion } from 'framer-motion';
import { Trophy, Medal, Award, TrendingUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  badges: string[];
  change: number; // Rank change from previous period
  isCurrentUser?: boolean;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  period: 'daily' | 'weekly' | 'monthly' | 'alltime';
  currentUserId?: string;
  onPeriodChange?: (period: 'daily' | 'weekly' | 'monthly' | 'alltime') => void;
}

export function Leaderboard({
  entries,
  period,
  currentUserId,
  onPeriodChange,
}: LeaderboardProps) {
  const getRankIcon = (rank: number) => {
    if (rank === 1)
      return <Trophy className="w-6 h-6 text-yellow-500 fill-current" />;
    if (rank === 2)
      return <Medal className="w-6 h-6 text-gray-400 fill-current" />;
    if (rank === 3)
      return <Award className="w-6 h-6 text-orange-500 fill-current" />;
    return (
      <span className="text-lg font-bold text-text-secondary">#{rank}</span>
    );
  };

  const getRankStyle = (rank: number, isCurrentUser: boolean) => {
    if (rank === 1)
      return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
    if (rank === 2)
      return 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border-gray-400/30';
    if (rank === 3)
      return 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30';
    if (isCurrentUser)
      return 'ring-2 ring-primary/50 bg-primary/10';
    return '';
  };

  const periods = [
    { id: 'daily' as const, label: 'Today' },
    { id: 'weekly' as const, label: 'This Week' },
    { id: 'monthly' as const, label: 'This Month' },
    { id: 'alltime' as const, label: 'All Time' },
  ];

  return (
    <GlassCard className="p-6" fringe>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gradient mb-1">Leaderboard</h2>
          <p className="text-sm text-text-secondary">
            Top performers this {period}
          </p>
        </div>

        {/* Period Selector */}
        {onPeriodChange && (
          <div className="flex items-center gap-2 glass-card p-1">
            {periods.map((p) => (
              <button
                key={p.id}
                onClick={() => onPeriodChange(p.id)}
                className={cn(
                  'px-3 py-1 rounded text-sm font-medium transition-all',
                  period === p.id
                    ? 'bg-primary/20 text-primary'
                    : 'text-text-secondary hover:text-text-primary'
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Top 3 Podium */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[entries[1], entries[0], entries[2]].map((entry, idx) => {
            const actualRank = entry.rank;
            const height = idx === 1 ? 'h-32' : 'h-24';

            return (
              <motion.div
                key={entry.userId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn('text-center', height)}
              >
                <div className="mb-2">{getRankIcon(actualRank)}</div>
                <Avatar className="w-16 h-16 mx-auto mb-2">
                  <AvatarImage src={entry.avatar} />
                  <AvatarFallback>
                    {entry.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-sm font-semibold text-text-primary truncate">
                  {entry.name}
                </p>
                <p className="text-lg font-bold text-primary">
                  {entry.points.toLocaleString()}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Leaderboard List */}
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <motion.div
            key={entry.userId}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <GlassCard
              className={cn(
                'p-3 transition-all hover:scale-102',
                getRankStyle(entry.rank, entry.isCurrentUser || false)
              )}
            >
              <div className="flex items-center gap-3">
                {/* Rank */}
                <div className="flex-shrink-0 w-8 flex items-center justify-center">
                  {getRankIcon(entry.rank)}
                </div>

                {/* Avatar */}
                <Avatar className="w-10 h-10">
                  <AvatarImage src={entry.avatar} />
                  <AvatarFallback>
                    {entry.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4
                      className={cn(
                        'font-semibold text-text-primary truncate',
                        entry.isCurrentUser && 'text-primary'
                      )}
                    >
                      {entry.name}
                      {entry.isCurrentUser && ' (You)'}
                    </h4>
                    {entry.change !== 0 && (
                      <div
                        className={cn(
                          'flex items-center gap-1 text-xs',
                          entry.change > 0 ? 'text-green-500' : 'text-red-500'
                        )}
                      >
                        <TrendingUp
                          className={cn(
                            'w-3 h-3',
                            entry.change < 0 && 'rotate-180'
                          )}
                        />
                        {Math.abs(entry.change)}
                      </div>
                    )}
                  </div>

                  {/* Badges */}
                  {entry.badges.length > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      {entry.badges.slice(0, 3).map((badge, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary"
                        >
                          {badge}
                        </span>
                      ))}
                      {entry.badges.length > 3 && (
                        <span className="text-xs text-text-secondary">
                          +{entry.badges.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Points */}
                <div className="flex-shrink-0 text-right">
                  <div className="text-lg font-bold text-text-primary">
                    {entry.points.toLocaleString()}
                  </div>
                  <div className="text-xs text-text-secondary">points</div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>No leaderboard data available</p>
        </div>
      )}
    </GlassCard>
  );
}
