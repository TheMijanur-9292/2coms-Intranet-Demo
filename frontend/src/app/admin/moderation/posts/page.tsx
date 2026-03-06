'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Flag, CheckCircle, XCircle, Eye, MessageSquare, Clock } from 'lucide-react';

const mockPosts = [
  { id: '1', author: 'Rahul Sharma', content: 'Great work by the sales team this quarter! Amazing results.', reports: 0, status: 'pending', time: '2 hours ago', type: 'post' },
  { id: '2', author: 'Priya Nair', content: 'This policy change is really unfair to employees...', reports: 3, status: 'flagged', time: '4 hours ago', type: 'post' },
  { id: '3', author: 'Amit Kumar', content: 'Congratulations to the entire team for the product launch!', reports: 0, status: 'approved', time: '6 hours ago', type: 'post' },
  { id: '4', author: 'Sneha Patel', content: 'Why was my request rejected without any explanation?', reports: 2, status: 'flagged', time: '1 day ago', type: 'post' },
  { id: '5', author: 'Vikram Singh', content: 'Looking forward to the team outing next week!', reports: 0, status: 'pending', time: '1 day ago', type: 'post' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  approved: 'bg-green-500/20 text-green-500',
  flagged: 'bg-red-500/20 text-red-500',
  rejected: 'bg-gray-500/20 text-gray-400',
};

export default function AdminModerationPostsPage() {
  const [filter, setFilter] = useState('all');
  const [posts, setPosts] = useState(mockPosts);

  const filtered = filter === 'all' ? posts : posts.filter((p) => p.status === filter);

  const updateStatus = (id: string, status: string) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
  };

  const counts = {
    all: posts.length,
    pending: posts.filter((p) => p.status === 'pending').length,
    flagged: posts.filter((p) => p.status === 'flagged').length,
    approved: posts.filter((p) => p.status === 'approved').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-primary" /> Activity Wall Moderation
        </h1>
        <p className="text-text-secondary mt-1">Review and moderate user posts on the activity wall</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Posts', value: counts.all, icon: MessageSquare, color: 'text-primary' },
          { label: 'Pending Review', value: counts.pending, icon: Clock, color: 'text-yellow-400' },
          { label: 'Flagged', value: counts.flagged, icon: Flag, color: 'text-red-400' },
          { label: 'Approved', value: counts.approved, icon: CheckCircle, color: 'text-green-400' },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4">
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${s.color}`} />
                <span className="text-xs text-text-secondary">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 border-b border-[var(--glass-border)] pb-2">
        {['all', 'pending', 'flagged', 'approved'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg capitalize transition-colors ${
              filter === f
                ? 'text-primary border-b-2 border-primary'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {f} {f !== 'all' && <span className="ml-1 text-xs opacity-70">({counts[f as keyof typeof counts]})</span>}
          </button>
        ))}
      </div>

      {/* Posts List */}
      <div className="space-y-3">
        {filtered.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {post.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary text-sm">{post.author}</p>
                    <p className="text-xs text-text-secondary">{post.time}</p>
                  </div>
                  {post.reports > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs bg-red-500/20 text-red-500 rounded-full flex items-center gap-1">
                      <Flag className="w-3 h-3" /> {post.reports} reports
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-primary">{post.content}</p>
              </div>
              <div className="flex-shrink-0 text-right space-y-2">
                <span className={`block px-2 py-0.5 text-xs font-bold rounded-full ${statusColors[post.status]}`}>
                  {post.status}
                </span>
              </div>
            </div>

            {post.status !== 'approved' && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--glass-border)]">
                <button
                  onClick={() => updateStatus(post.id, 'approved')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors font-medium"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => updateStatus(post.id, 'rejected')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors font-medium"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 text-xs bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                  <Eye className="w-3.5 h-3.5" /> View Full
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
