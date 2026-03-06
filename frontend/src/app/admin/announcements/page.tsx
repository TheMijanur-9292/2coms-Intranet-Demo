'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Pin, Eye, Megaphone } from 'lucide-react';

const mockAnnouncements = [
  { id: '1', title: 'Q1 Town Hall Meeting', category: 'general', priority: 'high', status: 'published', author: 'HR Team', date: '2026-03-01', views: 234 },
  { id: '2', title: 'Updated Leave Policy', category: 'hr', priority: 'urgent', status: 'published', author: 'Admin', date: '2026-02-28', views: 189 },
  { id: '3', title: 'New Office Timings', category: 'operations', priority: 'medium', status: 'draft', author: 'Admin', date: '2026-02-25', views: 0 },
];

const priorityColors: Record<string, string> = {
  urgent: 'bg-red-500/20 text-red-500',
  high: 'bg-orange-500/20 text-orange-500',
  medium: 'bg-yellow-500/20 text-yellow-500',
  low: 'bg-green-500/20 text-green-500',
};

const statusColors: Record<string, string> = {
  published: 'bg-green-500/20 text-green-500',
  draft: 'bg-gray-500/20 text-gray-400',
  scheduled: 'bg-blue-500/20 text-blue-500',
};

export default function AdminAnnouncementsPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', priority: 'medium', category: 'general' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-primary" /> Announcements Management
          </h1>
          <p className="text-text-secondary mt-1">Create and manage company announcements</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Create Announcement</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Announcement title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Write your announcement..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="general">General</option>
                  <option value="hr">HR</option>
                  <option value="it">IT</option>
                  <option value="operations">Operations</option>
                  <option value="finance">Finance</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium">
                Publish Now
              </button>
              <button className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-colors">
                Save Draft
              </button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Announcements Table */}
      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-[var(--glass-border)]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Title</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Priority</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Author</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Views</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockAnnouncements.map((ann, i) => (
              <motion.tr
                key={ann.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="border-b border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-text-primary">{ann.title}</p>
                  <p className="text-xs text-text-secondary">{ann.category} · {ann.date}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${priorityColors[ann.priority]}`}>
                    {ann.priority}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${statusColors[ann.status]}`}>
                    {ann.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-text-secondary">{ann.author}</td>
                <td className="px-4 py-3 text-sm text-text-secondary flex items-center gap-1">
                  <Eye className="w-3 h-3" /> {ann.views}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded hover:bg-primary/20 text-text-secondary hover:text-primary transition-colors"><Pin className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded hover:bg-blue-500/20 text-text-secondary hover:text-blue-400 transition-colors"><Edit className="w-4 h-4" /></button>
                    <button className="p-1.5 rounded hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
