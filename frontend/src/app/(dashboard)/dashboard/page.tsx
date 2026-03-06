'use client';

import { StatCard } from '@/components/dashboard/StatCard';
import { PostCard } from '@/components/dashboard/PostCard';
import { AnnouncementCard } from '@/components/dashboard/AnnouncementCard';
import { LeaderboardCard } from '@/components/dashboard/LeaderboardCard';
import { GlassCard } from '@/components/ui/GlassCard';
import { MessageSquare, Users, Trophy, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Total Posts',
      value: '1,234',
      icon: <MessageSquare className="w-6 h-6 text-blue-500" />,
      trend: { value: 12, direction: 'up' as const },
    },
    {
      title: 'Active Users',
      value: '345',
      icon: <Users className="w-6 h-6 text-green-500" />,
      trend: { value: 5, direction: 'up' as const },
    },
    {
      title: 'Engagement',
      value: '89%',
      icon: <TrendingUp className="w-6 h-6 text-purple-500" />,
      trend: { value: 3, direction: 'up' as const },
    },
    {
      title: 'Your Points',
      value: user?.gamification?.points?.toString() || '0',
      icon: <Trophy className="w-6 h-6 text-yellow-500" />,
    },
  ];

  return (
    <div className="space-y-6">
      <GlassCard className="p-6 mb-6" fringe>
        <h1 className="text-3xl font-bold text-gradient mb-2">
          Welcome back, {user?.firstName || 'User'}!
        </h1>
        <p className="text-text-secondary">
          Here&apos;s what&apos;s happening in your company today.
        </p>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            delay={index * 0.1}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6" fringe>
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Latest Announcements
          </h2>
          <div className="space-y-3">
            <AnnouncementCard
              announcement={{
                id: '1',
                title: 'Important HR Policy Update',
                content: 'Please review the updated employee handbook...',
                priority: 'high',
                category: 'hr',
                author: 'HR Team',
                publishDate: new Date(),
                isRead: false,
                isPinned: true,
              }}
            />
          </div>
        </GlassCard>

        <GlassCard className="p-6" fringe>
          <h2 className="text-xl font-bold text-text-primary mb-4">
            Top Performers
          </h2>
          <div className="space-y-2">
            <LeaderboardCard
              rank={1}
              user={{
                name: 'John Doe',
                points: 1250,
                badges: ['Top Contributor'],
              }}
            />
            <LeaderboardCard
              rank={2}
              user={{
                name: 'Jane Smith',
                points: 1100,
                badges: ['Innovator'],
              }}
            />
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6" fringe>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          <PostCard
            post={{
              id: '1',
              author: {
                name: 'John Doe',
                designation: 'Software Engineer',
              },
              content: 'Excited to share our latest project milestone! 🎉',
              reactions: [{ type: 'like', count: 42 }],
              comments: 12,
              createdAt: new Date(),
            }}
          />
        </div>
      </GlassCard>
    </div>
  );
}
