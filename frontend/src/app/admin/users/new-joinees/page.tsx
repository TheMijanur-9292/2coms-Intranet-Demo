'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Edit, Trash2, Plus, Search, Calendar } from 'lucide-react';

const mockJoinees = [
  { id: '1', name: 'Arjun Mehta', role: 'Software Engineer', department: 'Engineering', startDate: '2026-03-10', status: 'active', avatar: 'A' },
  { id: '2', name: 'Deepika Rao', role: 'HR Executive', department: 'Human Resources', startDate: '2026-03-08', status: 'active', avatar: 'D' },
  { id: '3', name: 'Kiran Joshi', role: 'Product Manager', department: 'Product', startDate: '2026-03-05', status: 'active', avatar: 'K' },
  { id: '4', name: 'Meera Singh', role: 'UX Designer', department: 'Design', startDate: '2026-02-28', status: 'completed', avatar: 'M' },
];

export default function AdminNewJoineesPage() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', department: '', startDate: '', introduction: '' });

  const filtered = mockJoinees.filter((j) =>
    j.name.toLowerCase().includes(search.toLowerCase()) ||
    j.department.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" /> New Joinees Management
          </h1>
          <p className="text-text-secondary mt-1">Manage new employee profiles for the welcome carousel</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> Add New Joinee
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-6"
        >
          <h2 className="text-lg font-semibold mb-4">Add New Joinee Profile</h2>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Full Name', key: 'name', placeholder: 'John Doe' },
              { label: 'Role / Designation', key: 'role', placeholder: 'Software Engineer' },
              { label: 'Department', key: 'department', placeholder: 'Engineering' },
              { label: 'Start Date', key: 'startDate', placeholder: '', type: 'date' },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-1">{field.label}</label>
                <input
                  type={field.type || 'text'}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder={field.placeholder}
                  value={form[field.key as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              </div>
            ))}
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Introduction</label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="Short introduction about the employee..."
                value={form.introduction}
                onChange={(e) => setForm({ ...form, introduction: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium">Save Profile</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors">Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
        <input
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
          placeholder="Search new joinees..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((joinee, i) => (
          <motion.div
            key={joinee.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-primary font-bold text-lg">
                {joinee.avatar}
              </div>
              <div>
                <p className="font-semibold text-text-primary">{joinee.name}</p>
                <p className="text-sm text-text-secondary">{joinee.role}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-text-secondary">
              <p>Department: <span className="text-text-primary">{joinee.department}</span></p>
              <p className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Start: {joinee.startDate}
              </p>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-[var(--glass-border)]">
              <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${joinee.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                {joinee.status}
              </span>
              <div className="flex gap-2">
                <button className="p-1.5 rounded hover:bg-blue-500/20 text-text-secondary hover:text-blue-400 transition-colors"><Edit className="w-4 h-4" /></button>
                <button className="p-1.5 rounded hover:bg-red-500/20 text-text-secondary hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
