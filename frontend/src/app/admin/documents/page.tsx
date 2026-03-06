'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Trash2, Download, Search, FolderOpen } from 'lucide-react';

const mockDocs = [
  { id: '1', name: 'Employee Handbook 2026.pdf', category: 'Policy', size: '2.4 MB', uploadedBy: 'HR Team', date: '2026-03-01', downloads: 45 },
  { id: '2', name: 'Leave Policy.pdf', category: 'Policy', size: '890 KB', uploadedBy: 'HR Team', date: '2026-02-20', downloads: 78 },
  { id: '3', name: 'Code of Conduct.pdf', category: 'Compliance', size: '1.1 MB', uploadedBy: 'Admin', date: '2026-02-15', downloads: 102 },
  { id: '4', name: 'IT Security Guidelines.pdf', category: 'IT', size: '650 KB', uploadedBy: 'IT Team', date: '2026-02-10', downloads: 33 },
  { id: '5', name: 'Onboarding Checklist.docx', category: 'HR', size: '340 KB', uploadedBy: 'HR Team', date: '2026-01-30', downloads: 67 },
];

const categories = ['All', 'Policy', 'Compliance', 'IT', 'HR', 'Finance'];

export default function AdminDocumentsPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = mockDocs.filter((d) => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || d.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-primary" /> Documents Management
          </h1>
          <p className="text-text-secondary mt-1">Upload and manage company policies and documents</p>
        </div>
        <label className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium cursor-pointer">
          <Upload className="w-4 h-4" /> Upload Document
          <input type="file" className="hidden" accept=".pdf,.doc,.docx,.xlsx" />
        </label>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-primary/20 text-primary'
                  : 'text-text-secondary hover:bg-[rgba(255,255,255,0.1)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((doc, i) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4 hover:border-primary/30 transition-colors"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-text-primary truncate">{doc.name}</p>
                <p className="text-xs text-text-secondary mt-0.5">{doc.size} · {doc.date}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">{doc.category}</span>
                  <span className="text-xs text-text-secondary">{doc.downloads} downloads</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--glass-border)]">
              <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button className="flex items-center gap-1 text-xs text-text-secondary hover:text-red-400 transition-colors ml-auto">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-text-secondary">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No documents found</p>
        </div>
      )}
    </div>
  );
}
