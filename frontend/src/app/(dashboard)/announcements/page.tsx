'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Megaphone, Pin, Bell, ChevronDown, ChevronUp,
  Search, Filter, Eye, Bookmark, Share2, Clock,
} from 'lucide-react';

const announcements = [
  {
    id: '1', title: 'Important HR Policy Update', category: 'hr', priority: 'urgent',
    content: 'We are updating our leave policy effective April 1st, 2026. All employees are required to review the updated employee handbook available in the Knowledge Hub. Key changes include enhanced paternity leave, flexible work-from-home norms, and revised overtime policy. Please reach out to HR if you have questions.',
    author: 'HR Team', date: '2026-03-03', views: 234, isPinned: true, isRead: false,
  },
  {
    id: '2', title: 'Q1 Town Hall – Save the Date', category: 'general', priority: 'high',
    content: 'Our Q1 All-Hands Town Hall is scheduled for March 20th, 2026 at 4:00 PM IST. Leadership will share business updates, key wins, and plans for the next quarter. All employees are encouraged to attend via the virtual link or in-person at the Mumbai HQ.',
    author: 'Admin Team', date: '2026-03-01', views: 189, isPinned: true, isRead: false,
  },
  {
    id: '3', title: 'New Office Timings – Effective March 15', category: 'operations', priority: 'medium',
    content: 'Following employee feedback, office timings will change to 9:00 AM – 6:00 PM from March 15th. The cafeteria will also operate extended hours. Please coordinate with your managers for work-from-home requests.',
    author: 'Operations', date: '2026-02-27', views: 312, isPinned: false, isRead: true,
  },
  {
    id: '4', title: 'IT System Maintenance – March 10', category: 'it', priority: 'medium',
    content: 'Planned system maintenance on Sunday, March 10th from 2:00 AM to 6:00 AM IST. Internal portals, email, and VPN will be unavailable during this window. Please plan accordingly and save your work beforehand.',
    author: 'IT Department', date: '2026-02-25', views: 156, isPinned: false, isRead: true,
  },
  {
    id: '5', title: 'Employee Referral Bonus – Extended', category: 'hr', priority: 'low',
    content: 'Great news! The Employee Referral Bonus program has been extended until June 2026. Refer a candidate and earn up to ₹50,000 on successful hiring. Check the HR portal for eligible roles.',
    author: 'HR Team', date: '2026-02-20', views: 405, isPinned: false, isRead: true,
  },
];

const categoryColors: Record<string, string> = {
  hr: 'bg-purple-500/20 text-purple-400',
  general: 'bg-blue-500/20 text-blue-400',
  operations: 'bg-orange-500/20 text-orange-400',
  it: 'bg-cyan-500/20 text-cyan-400',
  finance: 'bg-green-500/20 text-green-400',
};

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-500/20 text-red-400 border border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400',
  medium: 'bg-yellow-500/20 text-yellow-400',
  low: 'bg-gray-500/20 text-gray-400',
};

const priorityDot: Record<string, string> = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-gray-400',
};

export default function AnnouncementsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>('1');
  const [bookmarked, setBookmarked] = useState<string[]>([]);
  const [readItems, setReadItems] = useState<string[]>(['3', '4', '5']);

  const categories = ['all', 'hr', 'general', 'operations', 'it', 'finance'];

  const filtered = announcements.filter((a) => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.content.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || a.category === activeCategory;
    return matchSearch && matchCat;
  });

  const pinned = filtered.filter((a) => a.isPinned);
  const regular = filtered.filter((a) => !a.isPinned);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
    if (!readItems.includes(id)) setReadItems((prev) => [...prev, id]);
  };

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarked((prev) => prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id]);
  };

  const AnnouncementItem = ({ ann }: { ann: typeof announcements[0] }) => {
    const isExpanded = expandedId === ann.id;
    const isRead = readItems.includes(ann.id);
    const isBookmarked = bookmarked.includes(ann.id);

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border ${ann.isPinned ? 'border-primary/40' : 'border-[var(--glass-border)]'} bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden transition-all`}
      >
        {/* Header row */}
        <button
          className="w-full text-left p-4 flex items-start gap-3 hover:bg-[rgba(255,255,255,0.05)] transition-colors"
          onClick={() => toggleExpand(ann.id)}
        >
          {/* Unread dot */}
          <div className="mt-1.5 flex-shrink-0">
            {!isRead ? (
              <span className={`block w-2 h-2 rounded-full ${priorityDot[ann.priority]}`} />
            ) : (
              <span className="block w-2 h-2 rounded-full bg-transparent border border-[var(--glass-border)]" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {ann.isPinned && (
                <span className="flex items-center gap-1 text-xs text-primary font-semibold">
                  <Pin className="w-3 h-3" /> Pinned
                </span>
              )}
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColors[ann.category]}`}>
                {ann.category.toUpperCase()}
              </span>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${priorityColors[ann.priority]}`}>
                {ann.priority}
              </span>
            </div>
            <p className={`font-semibold ${isRead ? 'text-text-secondary' : 'text-text-primary'} truncate pr-4`}>
              {ann.title}
            </p>
            <div className="flex items-center gap-3 mt-1 text-xs text-text-secondary">
              <span>{ann.author}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ann.date}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{ann.views} views</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => toggleBookmark(ann.id, e)}
              className={`p-1.5 rounded-lg transition-colors ${isBookmarked ? 'text-primary bg-primary/10' : 'text-text-secondary hover:text-primary hover:bg-primary/10'}`}
            >
              <Bookmark className="w-4 h-4" />
            </button>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </div>
        </button>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 border-t border-[var(--glass-border)] pt-4 ml-5">
                <p className="text-sm text-text-primary leading-relaxed">{ann.content}</p>
                <div className="flex items-center gap-3 mt-4">
                  <button className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors">
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  <button className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary transition-colors">
                    <Bell className="w-3.5 h-3.5" /> Get Reminders
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" /> Announcements
          </h1>
          <p className="text-text-secondary mt-1">Stay updated with company news and important notices</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary bg-[var(--glass-bg)] border border-[var(--glass-border)] px-3 py-1.5 rounded-lg">
          <Bell className="w-4 h-4 text-primary" />
          <span>{announcements.filter((a) => !readItems.includes(a.id)).length} unread</span>
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? 'bg-primary/20 text-primary'
                  : 'text-text-secondary hover:bg-[rgba(255,255,255,0.1)] border border-[var(--glass-border)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3 flex items-center gap-2">
            <Pin className="w-3.5 h-3.5" /> Pinned
          </h2>
          <div className="space-y-3">
            {pinned.map((ann) => <AnnouncementItem key={ann.id} ann={ann} />)}
          </div>
        </div>
      )}

      {/* Regular */}
      {regular.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3 flex items-center gap-2">
            <Filter className="w-3.5 h-3.5" /> All Announcements
          </h2>
          <div className="space-y-3">
            {regular.map((ann) => <AnnouncementItem key={ann.id} ann={ann} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-secondary">
          <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No announcements found</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
