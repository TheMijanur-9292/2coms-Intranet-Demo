'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, Trash2, Eye, Search } from 'lucide-react';

const mockMedia = [
  { id: '1', name: 'Team Outing 2026', type: 'image', uploader: 'HR Team', date: '2026-03-01', status: 'approved' },
  { id: '2', name: 'Annual Day Celebration', type: 'image', uploader: 'Admin', date: '2026-02-25', status: 'approved' },
  { id: '3', name: 'Product Launch Video', type: 'video', uploader: 'Marketing', date: '2026-02-20', status: 'pending' },
  { id: '4', name: 'Office Inauguration', type: 'image', uploader: 'Admin', date: '2026-02-15', status: 'approved' },
  { id: '5', name: 'Training Session', type: 'video', uploader: 'HR Team', date: '2026-02-10', status: 'pending' },
  { id: '6', name: 'CSR Activity', type: 'image', uploader: 'HR Team', date: '2026-02-05', status: 'approved' },
];

const statusColors: Record<string, string> = {
  approved: 'bg-green-500/20 text-green-500',
  pending: 'bg-yellow-500/20 text-yellow-500',
  rejected: 'bg-red-500/20 text-red-500',
};

export default function AdminGalleryPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = mockMedia.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || m.type === filter || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-primary" /> Media Gallery Management
          </h1>
          <p className="text-text-secondary mt-1">Manage images and videos across the platform</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium cursor-pointer">
          <Upload className="w-4 h-4" /> Upload Media
          <input type="file" className="hidden" accept="image/*,video/*" multiple />
        </label>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Media', value: '142', color: 'text-primary' },
          { label: 'Images', value: '98', color: 'text-blue-400' },
          { label: 'Videos', value: '44', color: 'text-purple-400' },
          { label: 'Pending Review', value: '7', color: 'text-yellow-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="pl-10 pr-4 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {['all', 'image', 'video', 'pending', 'approved'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((media, i) => (
          <motion.div
            key={media.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden group"
          >
            {/* Thumbnail placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
              <ImageIcon className="w-8 h-8 text-primary/50" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button className="p-1.5 rounded-full bg-white/20 hover:bg-white/40 transition-colors">
                  <Eye className="w-4 h-4 text-white" />
                </button>
                <button className="p-1.5 rounded-full bg-red-500/40 hover:bg-red-500/60 transition-colors">
                  <Trash2 className="w-4 h-4 text-white" />
                </button>
              </div>
              <span className="absolute top-2 left-2 px-1.5 py-0.5 text-xs bg-black/50 text-white rounded capitalize">
                {media.type}
              </span>
            </div>
            <div className="p-3">
              <p className="text-sm font-medium text-text-primary truncate">{media.name}</p>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-text-secondary">{media.date}</p>
                <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${statusColors[media.status]}`}>
                  {media.status}
                </span>
              </div>
              {media.status === 'pending' && (
                <div className="flex gap-2 mt-2">
                  <button className="flex-1 py-1 text-xs bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition-colors">Approve</button>
                  <button className="flex-1 py-1 text-xs bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors">Reject</button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
