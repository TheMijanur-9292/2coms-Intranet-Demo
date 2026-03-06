'use client';

import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { StatCard } from '@/components/dashboard/StatCard';
import { AlertCircle, CheckCircle2, Clock, Flag, Megaphone, FileText, Users } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';

interface ModerationDashboardProps {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    reported: number;
  };
  pendingItems: Array<{
    id: string;
    type: 'post' | 'comment' | 'recognition';
    content: string;
    author: string;
    createdAt: Date;
    priority: 'low' | 'medium' | 'high';
  }>;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onReview: (id: string) => void;
}

export function ModerationDashboard({
  stats,
  pendingItems,
  onApprove,
  onReject,
  onReview,
}: ModerationDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Pending Review"
          value={stats.pending}
          icon={<Clock className="w-6 h-6 text-orange-500" />}
          trend={{ value: 0, direction: 'up' }}
          delay={0}
        />
        <StatCard
          title="Approved Today"
          value={stats.approved}
          icon={<CheckCircle2 className="w-6 h-6 text-green-500" />}
          trend={{ value: 0, direction: 'up' }}
          delay={0.1}
        />
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
          trend={{ value: 0, direction: 'down' }}
          delay={0.2}
        />
        <StatCard
          title="Reported Items"
          value={stats.reported}
          icon={<Flag className="w-6 h-6 text-yellow-500" />}
          trend={{ value: 0, direction: 'up' }}
          delay={0.3}
        />
      </div>

      {/* Pending Items Queue */}
      <GlassCard className="p-6" fringe>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-text-primary">
            Pending Moderation Queue
          </h2>
          <GlassButton variant="secondary" size="sm">
            View All
          </GlassButton>
        </div>

        <div className="space-y-3">
          {pendingItems.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No pending items to review</p>
            </div>
          ) : (
            pendingItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <GlassCard className="p-4 hover:scale-102 transition-transform">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`
                            px-2 py-0.5 text-xs font-semibold rounded capitalize
                            ${
                              item.priority === 'high'
                                ? 'bg-red-500/20 text-red-500'
                                : item.priority === 'medium'
                                ? 'bg-orange-500/20 text-orange-500'
                                : 'bg-blue-500/20 text-blue-500'
                            }
                          `}
                        >
                          {item.type}
                        </span>
                        <span className="text-xs text-text-secondary">
                          {item.priority} priority
                        </span>
                      </div>
                      <p className="text-sm text-text-primary mb-2 line-clamp-2">
                        {item.content}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-text-secondary">
                        <span>By: {item.author}</span>
                        <span>•</span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={() => onReview(item.id)}
                      >
                        Review
                      </GlassButton>
                      <GlassButton
                        variant="primary"
                        size="sm"
                        onClick={() => onApprove(item.id)}
                      >
                        Approve
                      </GlassButton>
                      <GlassButton
                        variant="secondary"
                        size="sm"
                        onClick={() => onReject(item.id)}
                      >
                        Reject
                      </GlassButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))
          )}
        </div>
      </GlassCard>

      {/* Quick Actions */}
      <GlassCard className="p-6" bevel>
        <h2 className="text-xl font-bold text-text-primary mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassButton
            variant="primary"
            className="h-20 flex-col"
            onClick={() => window.location.href = '/admin/announcements/create'}
          >
            <Megaphone className="w-6 h-6 mb-2" />
            <span>Create Announcement</span>
          </GlassButton>
          <GlassButton
            variant="secondary"
            className="h-20 flex-col"
            onClick={() => window.location.href = '/admin/documents/upload'}
          >
            <FileText className="w-6 h-6 mb-2" />
            <span>Upload Document</span>
          </GlassButton>
          <GlassButton
            variant="ghost"
            className="h-20 flex-col"
            onClick={() => window.location.href = '/admin/users/new-joinees'}
          >
            <Users className="w-6 h-6 mb-2" />
            <span>Manage New Joinees</span>
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
