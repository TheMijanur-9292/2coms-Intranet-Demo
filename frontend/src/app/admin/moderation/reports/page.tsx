'use client';

import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Clock, TrendingUp, Users, MessageSquare } from 'lucide-react';

const mockReports = [
  { id: '1', reporter: 'Anonymous', target: 'Post by Rahul S.', reason: 'Inappropriate content', status: 'open', time: '2 hours ago' },
  { id: '2', reporter: 'Priya Nair', target: 'Comment by User123', reason: 'Harassment', status: 'investigating', time: '5 hours ago' },
  { id: '3', reporter: 'Anonymous', target: 'Post by Amit K.', reason: 'Spam', status: 'resolved', time: '1 day ago' },
  { id: '4', reporter: 'Vikram Singh', target: 'Comment by Admin', reason: 'Misinformation', status: 'open', time: '2 days ago' },
];

const statusColors: Record<string, string> = {
  open: 'bg-red-500/20 text-red-500',
  investigating: 'bg-yellow-500/20 text-yellow-500',
  resolved: 'bg-green-500/20 text-green-500',
};

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-primary" /> Reports
        </h1>
        <p className="text-text-secondary mt-1">Review user-submitted reports and complaints</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Open Reports', value: 2, color: 'text-red-400', icon: AlertCircle },
          { label: 'Investigating', value: 1, color: 'text-yellow-400', icon: Clock },
          { label: 'Resolved', value: 1, color: 'text-green-400', icon: CheckCircle },
          { label: 'Total Users', value: 245, color: 'text-primary', icon: Users },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4">
              <Icon className={`w-5 h-5 ${s.color} mb-2`} />
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-secondary mt-1">{s.label}</p>
            </div>
          );
        })}
      </div>

      <div className="space-y-3">
        {mockReports.map((report, i) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="font-medium text-text-primary text-sm">{report.target}</span>
                </div>
                <p className="text-sm text-text-secondary">Reason: <span className="text-text-primary">{report.reason}</span></p>
                <p className="text-xs text-text-secondary mt-1">Reported by {report.reporter} · {report.time}</p>
              </div>
              <span className={`flex-shrink-0 px-2 py-0.5 text-xs font-bold rounded-full ${statusColors[report.status]}`}>
                {report.status}
              </span>
            </div>
            {report.status !== 'resolved' && (
              <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--glass-border)]">
                <button className="px-3 py-1.5 text-xs bg-yellow-500/20 text-yellow-500 rounded-lg hover:bg-yellow-500/30 transition-colors font-medium">Investigate</button>
                <button className="px-3 py-1.5 text-xs bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-colors font-medium">Mark Resolved</button>
                <button className="px-3 py-1.5 text-xs bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-colors">Dismiss</button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
