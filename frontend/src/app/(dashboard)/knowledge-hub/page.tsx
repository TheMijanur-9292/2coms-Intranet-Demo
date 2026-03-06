'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Search, FileText, Download, Eye,
  Star, Clock, Tag, ChevronRight, Folder,
} from 'lucide-react';

const categories = [
  { id: 'all', label: 'All Documents', icon: '📚', count: 24 },
  { id: 'policy', label: 'HR Policies', icon: '📋', count: 8 },
  { id: 'onboarding', label: 'Onboarding', icon: '🚀', count: 5 },
  { id: 'it', label: 'IT & Security', icon: '🔒', count: 4 },
  { id: 'compliance', label: 'Compliance', icon: '⚖️', count: 3 },
  { id: 'training', label: 'Training', icon: '🎓', count: 4 },
];

const documents = [
  { id: '1', title: 'Employee Handbook 2026', category: 'policy', description: 'Comprehensive guide covering all company policies, code of conduct, benefits, and procedures for 2026.', fileType: 'PDF', size: '2.4 MB', downloads: 456, views: 1240, isStarred: true, updatedAt: '2026-03-01', tags: ['Policy', 'HR', 'Mandatory'] },
  { id: '2', title: 'Leave Policy & Procedures', category: 'policy', description: 'Detailed breakdown of leave types, application process, approval workflow, and carry-forward rules.', fileType: 'PDF', size: '890 KB', downloads: 312, views: 890, isStarred: false, updatedAt: '2026-02-20', tags: ['Leave', 'Policy'] },
  { id: '3', title: 'Onboarding Checklist', category: 'onboarding', description: 'Step-by-step checklist for new employees to complete during their first 30 days at 2COMS.', fileType: 'DOCX', size: '340 KB', downloads: 189, views: 567, isStarred: true, updatedAt: '2026-02-15', tags: ['New Joinee', 'Onboarding'] },
  { id: '4', title: 'IT Security Guidelines', category: 'it', description: 'Mandatory security practices, password policy, device usage guidelines, and data handling procedures.', fileType: 'PDF', size: '650 KB', downloads: 234, views: 678, isStarred: false, updatedAt: '2026-02-10', tags: ['IT', 'Security', 'Mandatory'] },
  { id: '5', title: 'Code of Conduct', category: 'compliance', description: 'Expected standards of professional behaviour, ethics, and workplace conduct for all 2COMS employees.', fileType: 'PDF', size: '1.1 MB', downloads: 445, views: 1102, isStarred: false, updatedAt: '2026-01-30', tags: ['Compliance', 'Ethics'] },
  { id: '6', title: 'Performance Review Guide', category: 'policy', description: 'How appraisals work at 2COMS — timelines, evaluation criteria, self-assessment templates, and rating scales.', fileType: 'PPTX', size: '1.8 MB', downloads: 278, views: 745, isStarred: true, updatedAt: '2026-01-25', tags: ['Appraisal', 'HR'] },
  { id: '7', title: 'React & Next.js Best Practices', category: 'training', description: 'Internal training guide for frontend developers — covers React patterns, Next.js App Router, and TypeScript.', fileType: 'PDF', size: '2.1 MB', downloads: 145, views: 398, isStarred: false, updatedAt: '2026-01-20', tags: ['Training', 'Engineering'] },
  { id: '8', title: 'Travel & Expense Policy', category: 'policy', description: 'Business travel reimbursement rules, expense limits, claim submission process, and approval hierarchy.', fileType: 'PDF', size: '560 KB', downloads: 167, views: 489, isStarred: false, updatedAt: '2026-01-15', tags: ['Travel', 'Finance'] },
  { id: '9', title: 'New Employee Welcome Kit', category: 'onboarding', description: 'Everything a new employee needs to know — office tour, key contacts, tools setup, and first-week schedule.', fileType: 'PDF', size: '3.2 MB', downloads: 201, views: 612, isStarred: true, updatedAt: '2026-01-10', tags: ['New Joinee', 'Welcome'] },
];

const fileTypeColors: Record<string, string> = {
  PDF: 'bg-red-500/20 text-red-400',
  DOCX: 'bg-blue-500/20 text-blue-400',
  PPTX: 'bg-orange-500/20 text-orange-400',
  XLSX: 'bg-green-500/20 text-green-400',
};

const fileTypeIcons: Record<string, string> = {
  PDF: '📄', DOCX: '📝', PPTX: '📊', XLSX: '📈',
};

export default function KnowledgeHubPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'downloads'>('popular');
  const [starredDocs, setStarredDocs] = useState<string[]>(documents.filter((d) => d.isStarred).map((d) => d.id));

  const toggleStar = (id: string) => {
    setStarredDocs((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const filtered = documents
    .filter((d) => {
      const matchSearch = d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.description.toLowerCase().includes(search.toLowerCase()) ||
        d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = activeCategory === 'all' || d.category === activeCategory;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      if (sortBy === 'downloads') return b.downloads - a.downloads;
      return b.views - a.views;
    });

  const starred = filtered.filter((d) => starredDocs.includes(d.id));
  const nonStarred = filtered.filter((d) => !starredDocs.includes(d.id));

  const DocCard = ({ doc }: { doc: typeof documents[0] }) => {
    const isStarred = starredDocs.includes(doc.id);
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4 hover:border-primary/30 transition-all group"
      >
        <div className="flex items-start gap-3">
          {/* File icon */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${fileTypeColors[doc.fileType] || 'bg-gray-500/20'}`}>
            {fileTypeIcons[doc.fileType] || '📄'}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-primary transition-colors">
                {doc.title}
              </h3>
              <button
                onClick={() => toggleStar(doc.id)}
                className={`flex-shrink-0 transition-colors ${isStarred ? 'text-yellow-400' : 'text-text-secondary hover:text-yellow-400'}`}
              >
                <Star className={`w-4 h-4 ${isStarred ? 'fill-current' : ''}`} />
              </button>
            </div>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed line-clamp-2">{doc.description}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {doc.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">{tag}</span>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
              <span className={`px-1.5 py-0.5 rounded font-mono font-bold text-xs ${fileTypeColors[doc.fileType]}`}>
                {doc.fileType}
              </span>
              <span>{doc.size}</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{doc.views}</span>
              <span className="flex items-center gap-1"><Download className="w-3 h-3" />{doc.downloads}</span>
              <span className="flex items-center gap-1 ml-auto"><Clock className="w-3 h-3" />{doc.updatedAt}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3 pt-3 border-t border-[var(--glass-border)]">
          <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium border border-[var(--glass-border)] text-text-secondary hover:bg-[rgba(255,255,255,0.08)] transition-colors">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-primary" /> Knowledge Hub
        </h1>
        <p className="text-text-secondary mt-1">Company policies, guides, and resources — all in one place</p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Search documents, policies, guides..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
        >
          <option value="popular">Most Viewed</option>
          <option value="downloads">Most Downloaded</option>
          <option value="recent">Most Recent</option>
        </select>
      </div>

      <div className="flex gap-6">
        {/* Sidebar categories */}
        <div className="w-52 flex-shrink-0 space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeCategory === cat.id
                  ? 'bg-primary/20 text-primary font-semibold'
                  : 'text-text-secondary hover:bg-[rgba(255,255,255,0.08)] hover:text-text-primary'
              }`}
            >
              <span>{cat.icon}</span>
              <span className="flex-1 text-left">{cat.label}</span>
              <span className="text-xs opacity-60">{cat.count}</span>
            </button>
          ))}
        </div>

        {/* Documents */}
        <div className="flex-1 space-y-6">
          {starred.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3 flex items-center gap-2">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" /> Starred
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {starred.map((doc) => <DocCard key={doc.id} doc={doc} />)}
              </div>
            </div>
          )}

          <div>
            {starred.length > 0 && (
              <h2 className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3 flex items-center gap-2">
                <Folder className="w-3.5 h-3.5" /> All Documents
              </h2>
            )}
            {nonStarred.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nonStarred.map((doc) => <DocCard key={doc.id} doc={doc} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-text-secondary">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No documents found</p>
                <p className="text-sm mt-1">Try a different search or category</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
