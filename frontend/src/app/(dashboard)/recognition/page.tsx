'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Star, Heart, Award, Sparkles, Send,
  ChevronDown, Search, Crown, Zap, Target, Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const badges = [
  { id: 'star', label: 'Star Performer', icon: Star, color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  { id: 'teamplayer', label: 'Team Player', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  { id: 'innovator', label: 'Innovator', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  { id: 'leader', label: 'Leader', icon: Crown, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  { id: 'achiever', label: 'Achiever', icon: Target, color: 'text-green-400', bg: 'bg-green-500/20' },
  { id: 'champion', label: 'Champion', icon: Award, color: 'text-red-400', bg: 'bg-red-500/20' },
];

const employees = [
  'Priya Nair', 'Vikram Singh', 'Amit Kumar', 'Sneha Patel',
  'Rahul Sharma', 'Deepika Rao', 'Kiran Joshi', 'Arjun Mehta',
];

const recognitions = [
  {
    id: '1',
    from: { name: 'Vikram Singh', avatar: 'V', designation: 'Sales Lead' },
    to: { name: 'Priya Nair', avatar: 'P', designation: 'Senior Designer' },
    badge: 'star',
    message: 'Priya delivered an absolutely stunning brand refresh for our biggest client. Her attention to detail, creativity, and commitment to deadlines is truly extraordinary. The client was blown away! 🌟',
    likes: 34,
    time: '2 hours ago',
    isLiked: false,
  },
  {
    id: '2',
    from: { name: 'Sneha Patel', avatar: 'S', designation: 'HR Executive' },
    to: { name: 'Amit Kumar', avatar: 'A', designation: 'Engineering Lead' },
    badge: 'leader',
    message: 'Amit led the Q1 product launch with exceptional composure under pressure. He rallied the entire engineering team, solved blockers in real-time, and delivered on time. A true leader! 💪',
    likes: 56,
    time: '5 hours ago',
    isLiked: true,
  },
  {
    id: '3',
    from: { name: 'Rahul Sharma', avatar: 'R', designation: 'Product Manager' },
    to: { name: 'Kiran Joshi', avatar: 'K', designation: 'Backend Engineer' },
    badge: 'innovator',
    message: 'Kiran single-handedly built the new caching layer that cut our API response time by 60%. This kind of proactive innovation is exactly what drives us forward. Hat tip! 🚀',
    likes: 41,
    time: '1 day ago',
    isLiked: false,
  },
  {
    id: '4',
    from: { name: 'Deepika Rao', avatar: 'D', designation: 'HR Manager' },
    to: { name: 'Arjun Mehta', avatar: 'Ar', designation: 'Sales Executive' },
    badge: 'achiever',
    message: 'Arjun closed 3 enterprise deals in a single week — a record in our team\'s history! Incredible persistence, great client relationship skills. So proud of this achievement! 🏆',
    likes: 78,
    time: '2 days ago',
    isLiked: false,
  },
];

const leaderboard = [
  { name: 'Priya Nair', avatar: 'P', points: 1250, badge: 'star', recognitions: 8 },
  { name: 'Amit Kumar', avatar: 'A', points: 1100, badge: 'leader', recognitions: 6 },
  { name: 'Arjun Mehta', avatar: 'Ar', points: 980, badge: 'achiever', recognitions: 5 },
  { name: 'Kiran Joshi', avatar: 'K', points: 870, badge: 'innovator', recognitions: 4 },
  { name: 'Vikram Singh', avatar: 'V', points: 750, badge: 'teamplayer', recognitions: 3 },
];

export default function RecognitionPage() {
  const { user } = useAuth();
  const [items, setItems] = useState(recognitions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ to: '', badge: '', message: '' });
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'leaderboard'>('feed');

  const firstName = (user?.firstName || 'Y').charAt(0).toUpperCase();

  const handleLike = (id: string) => {
    setItems((prev) => prev.map((r) =>
      r.id === id ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r
    ));
  };

  const handleSubmit = () => {
    if (!form.to || !form.badge || !form.message.trim()) return;
    const badgeObj = badges.find((b) => b.id === form.badge)!;
    setItems([{
      id: Date.now().toString(),
      from: { name: `${user?.firstName || 'You'} ${user?.lastName || ''}`, avatar: firstName, designation: user?.designation || 'Employee' },
      to: { name: form.to, avatar: form.to.charAt(0), designation: '' },
      badge: form.badge,
      message: form.message,
      likes: 0,
      time: 'Just now',
      isLiked: false,
    }, ...items]);
    setForm({ to: '', badge: '', message: '' });
    setShowForm(false);
  };

  const filtered = items.filter((r) =>
    search === '' ||
    r.to.name.toLowerCase().includes(search.toLowerCase()) ||
    r.from.name.toLowerCase().includes(search.toLowerCase())
  );

  const rankColors = ['text-yellow-400', 'text-gray-300', 'text-orange-400'];
  const rankBg = ['bg-yellow-500/20', 'bg-gray-500/20', 'bg-orange-500/20'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" /> Recognition & Appreciation
          </h1>
          <p className="text-text-secondary mt-1">Celebrate your colleagues' achievements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium text-sm"
        >
          <Sparkles className="w-4 h-4" /> Recognise Someone
        </button>
      </div>

      {/* Recognise form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-primary/30 bg-[var(--glass-bg)] backdrop-blur-md p-5 space-y-4"
          >
            <h2 className="font-semibold text-text-primary flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" /> Give Recognition
            </h2>

            {/* Select person */}
            <div className="relative">
              <label className="block text-xs font-medium text-text-secondary mb-1">Recognise</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
              >
                <option value="">Select a colleague...</option>
                {employees.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>

            {/* Badge selector */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-2">Badge</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {badges.map((b) => {
                  const Icon = b.icon;
                  return (
                    <button
                      key={b.id}
                      onClick={() => setForm({ ...form, badge: b.id })}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-all text-xs ${
                        form.badge === b.id
                          ? `border-primary ${b.bg} ${b.color}`
                          : 'border-[var(--glass-border)] text-text-secondary hover:border-primary/40'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="leading-tight text-center">{b.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Message</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                placeholder="Share why this person deserves recognition..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!form.to || !form.badge || !form.message.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium text-sm disabled:opacity-40"
              >
                <Send className="w-4 h-4" /> Submit
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary text-sm transition-colors">
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-[var(--glass-border)]">
        {(['feed', 'leaderboard'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
              activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab === 'feed' ? '🏅 Recognition Feed' : '🏆 Leaderboard'}
          </button>
        ))}
      </div>

      {activeTab === 'feed' && (
        <>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              placeholder="Search recognitions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Recognition cards */}
          <div className="space-y-4">
            {filtered.map((rec, i) => {
              const badgeObj = badges.find((b) => b.id === rec.badge) || badges[0];
              const BadgeIcon = badgeObj.icon;
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5"
                >
                  {/* Badge banner */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${badgeObj.bg} ${badgeObj.color} text-xs font-bold mb-4`}>
                    <BadgeIcon className="w-3.5 h-3.5" />
                    {badgeObj.label}
                  </div>

                  {/* From → To */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                        {rec.from.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{rec.from.name}</p>
                        <p className="text-xs text-text-secondary">{rec.from.designation}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary">
                      <Sparkles className="w-4 h-4" />
                      <span className="text-xs font-semibold">recognised</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-full ${badgeObj.bg} flex items-center justify-center ${badgeObj.color} font-bold text-sm`}>
                        {rec.to.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{rec.to.name}</p>
                        <p className="text-xs text-text-secondary">{rec.to.designation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="mt-3 text-sm text-text-primary leading-relaxed italic border-l-2 border-primary/30 pl-3">
                    &ldquo;{rec.message}&rdquo;
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--glass-border)]">
                    <button
                      onClick={() => handleLike(rec.id)}
                      className={`flex items-center gap-1.5 text-sm transition-colors ${rec.isLiked ? 'text-red-400' : 'text-text-secondary hover:text-red-400'}`}
                    >
                      <Heart className={`w-4 h-4 ${rec.isLiked ? 'fill-current' : ''}`} />
                      {rec.likes}
                    </button>
                    <span className="text-xs text-text-secondary">{rec.time}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'leaderboard' && (
        <div className="space-y-3">
          {leaderboard.map((person, i) => {
            const badgeObj = badges.find((b) => b.id === person.badge) || badges[0];
            const BadgeIcon = badgeObj.icon;
            return (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-4 p-4 rounded-xl border ${i === 0 ? 'border-yellow-500/40 bg-yellow-500/5' : 'border-[var(--glass-border)] bg-[var(--glass-bg)]'} backdrop-blur-md`}
              >
                {/* Rank */}
                <div className={`w-9 h-9 rounded-full ${i < 3 ? rankBg[i] : 'bg-gray-500/20'} flex items-center justify-center font-bold text-sm ${i < 3 ? rankColors[i] : 'text-gray-400'}`}>
                  {i === 0 ? <Crown className="w-5 h-5" /> : `#${i + 1}`}
                </div>
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full ${badgeObj.bg} flex items-center justify-center ${badgeObj.color} font-bold`}>
                  {person.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary text-sm">{person.name}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <BadgeIcon className={`w-3.5 h-3.5 ${badgeObj.color}`} />
                    <span className={`text-xs ${badgeObj.color}`}>{badgeObj.label}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-text-primary">{person.points.toLocaleString()}</p>
                  <p className="text-xs text-text-secondary">{person.recognitions} recognitions</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
