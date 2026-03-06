'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, Clock } from 'lucide-react';

const mockRecognitions = [
  { id: '1', from: 'Amit Kumar', to: 'Priya Nair', message: 'Outstanding work on the client presentation! Your dedication truly made the difference.', badge: 'Star Performer', status: 'pending', time: '1 hour ago' },
  { id: '2', from: 'Rahul Sharma', to: 'Vikram Singh', message: 'Thank you for helping me with the project. Your support was invaluable!', badge: 'Team Player', status: 'approved', time: '3 hours ago' },
  { id: '3', from: 'Sneha Patel', to: 'Amit Kumar', message: 'Great leadership during the product launch. Proud to be on this team!', badge: 'Leader', status: 'pending', time: '5 hours ago' },
  { id: '4', from: 'HR Team', to: 'All Employees', message: 'Recognizing the entire team for achieving 100% project delivery this quarter!', badge: 'Excellence', status: 'approved', time: '1 day ago' },
];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-500',
  approved: 'bg-green-500/20 text-green-500',
  rejected: 'bg-red-500/20 text-red-500',
};

const badgeColors: Record<string, string> = {
  'Star Performer': 'bg-yellow-500/20 text-yellow-500',
  'Team Player': 'bg-blue-500/20 text-blue-400',
  'Leader': 'bg-purple-500/20 text-purple-400',
  'Excellence': 'bg-green-500/20 text-green-500',
};

export default function AdminModerationRecognitionPage() {
  const [items, setItems] = useState(mockRecognitions);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? items : items.filter((r) => r.status === filter);

  const updateStatus = (id: string, status: string) => {
    setItems((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Trophy className="w-6 h-6 text-primary" /> Recognition Posts Moderation
        </h1>
        <p className="text-text-secondary mt-1">Review and approve peer recognition posts</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Pending Approval', value: items.filter((r) => r.status === 'pending').length, color: 'text-yellow-400', icon: Clock },
          { label: 'Approved', value: items.filter((r) => r.status === 'approved').length, color: 'text-green-400', icon: CheckCircle },
          { label: 'Rejected', value: items.filter((r) => r.status === 'rejected').length, color: 'text-red-400', icon: XCircle },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4 text-center">
              <Icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-secondary mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'rejected'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Recognition Cards */}
      <div className="space-y-4">
        {filtered.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-semibold text-text-primary">{rec.from}</span>
                      <span className="text-text-secondary"> recognized </span>
                      <span className="font-semibold text-text-primary">{rec.to}</span>
                    </p>
                    <p className="text-xs text-text-secondary">{rec.time}</p>
                  </div>
                  <span className={`ml-auto px-2 py-0.5 text-xs font-bold rounded-full ${badgeColors[rec.badge] || 'bg-primary/20 text-primary'}`}>
                    {rec.badge}
                  </span>
                </div>
                <p className="text-sm text-text-primary italic">&ldquo;{rec.message}&rdquo;</p>
              </div>
              <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-bold rounded-full ${statusColors[rec.status]}`}>
                {rec.status}
              </span>
            </div>

            {rec.status === 'pending' && (
              <div className="flex gap-2 mt-4 pt-3 border-t border-[var(--glass-border)]">
                <button
                  onClick={() => updateStatus(rec.id, 'approved')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors font-medium"
                >
                  <CheckCircle className="w-3.5 h-3.5" /> Approve
                </button>
                <button
                  onClick={() => updateStatus(rec.id, 'rejected')}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors font-medium"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
