'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, MessageSquare, Eye, Heart } from 'lucide-react';

const stats = [
  { label: 'Total Active Users', value: '345', change: '+5%', positive: true, icon: Users, color: 'text-primary' },
  { label: 'Posts This Month', value: '1,234', change: '+12%', positive: true, icon: MessageSquare, color: 'text-blue-400' },
  { label: 'Engagement Rate', value: '89%', change: '+3%', positive: true, icon: TrendingUp, color: 'text-green-400' },
  { label: 'Page Views', value: '24.5K', change: '-2%', positive: false, icon: Eye, color: 'text-purple-400' },
  { label: 'Reactions Given', value: '8,921', change: '+18%', positive: true, icon: Heart, color: 'text-red-400' },
  { label: 'New Joinees', value: '12', change: '+4', positive: true, icon: Users, color: 'text-yellow-400' },
];

const topModules = [
  { name: 'Activity Wall', usage: 88 },
  { name: 'Announcements', usage: 72 },
  { name: 'Recognition', usage: 65 },
  { name: 'Knowledge Hub', usage: 54 },
  { name: 'Forums', usage: 41 },
  { name: 'Calendar', usage: 38 },
];

const departmentActivity = [
  { dept: 'Engineering', posts: 320, reactions: 1240 },
  { dept: 'Sales', posts: 280, reactions: 980 },
  { dept: 'HR', posts: 210, reactions: 870 },
  { dept: 'Design', posts: 190, reactions: 750 },
  { dept: 'Finance', posts: 130, reactions: 520 },
];

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" /> Analytics
        </h1>
        <p className="text-text-secondary mt-1">Platform engagement metrics and usage insights</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-5 h-5 ${s.color}`} />
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                  {s.change}
                </span>
              </div>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-text-secondary mt-1">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Modules */}
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5">
          <h2 className="font-semibold text-text-primary mb-4">Module Usage</h2>
          <div className="space-y-3">
            {topModules.map((mod, i) => (
              <motion.div
                key={mod.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-primary">{mod.name}</span>
                  <span className="text-text-secondary">{mod.usage}%</span>
                </div>
                <div className="h-2 bg-[rgba(255,255,255,0.1)] rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${mod.usage}%` }}
                    transition={{ delay: i * 0.06 + 0.3, duration: 0.6 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Department Activity */}
        <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5">
          <h2 className="font-semibold text-text-primary mb-4">Department Activity</h2>
          <div className="space-y-3">
            {departmentActivity.map((dept, i) => (
              <motion.div
                key={dept.dept}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.05)]"
              >
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {dept.dept.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-text-primary text-sm">{dept.dept}</p>
                  <p className="text-xs text-text-secondary">{dept.posts} posts · {dept.reactions} reactions</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{dept.posts}</p>
                  <p className="text-xs text-text-secondary">posts</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Weekly trend placeholder */}
      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5">
        <h2 className="font-semibold text-text-primary mb-4">Weekly Engagement Trend</h2>
        <div className="flex items-end gap-2 h-32">
          {[40, 65, 50, 80, 72, 90, 85].map((val, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-primary/40 to-primary/10 rounded-t-md"
              initial={{ height: 0 }}
              animate={{ height: `${val}%` }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
            <span key={d} className="flex-1 text-center text-xs text-text-secondary">{d}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
