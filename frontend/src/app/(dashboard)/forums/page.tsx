'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, Plus, Search, ThumbsUp, Eye,
  Clock, Tag, Pin, ChevronRight, Send, X,
  Flame, MessageSquare, Users,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const forumCategories = [
  { id: 'all', label: 'All Discussions', icon: '💬', count: 34 },
  { id: 'general', label: 'General', icon: '🌐', count: 12 },
  { id: 'technical', label: 'Technical', icon: '💻', count: 8 },
  { id: 'hr', label: 'HR & Benefits', icon: '🏢', count: 6 },
  { id: 'ideas', label: 'Ideas & Feedback', icon: '💡', count: 5 },
  { id: 'watercooler', label: 'Water Cooler', icon: '☕', count: 3 },
];

type Reply = {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
  isLiked: boolean;
};

type Thread = {
  id: string;
  title: string;
  category: string;
  content: string;
  author: string;
  avatar: string;
  designation: string;
  time: string;
  views: number;
  likes: number;
  isLiked: boolean;
  isPinned: boolean;
  tags: string[];
  replies: Reply[];
};

const threads: Thread[] = [
  {
    id: '1',
    title: 'What tools do you use for remote collaboration?',
    category: 'technical',
    content: 'With many of us working hybrid, I\'m curious what tools people find most effective for async collaboration. We use Notion + Slack but feel something is missing. Especially for design reviews and sprint planning. What\'s your team\'s stack?',
    author: 'Kiran Joshi', avatar: 'K', designation: 'Product Manager', time: '2 hours ago',
    views: 189, likes: 23, isLiked: false, isPinned: true,
    tags: ['Remote Work', 'Tools', 'Productivity'],
    replies: [
      { id: 'r1', author: 'Priya Nair', avatar: 'P', text: 'We use Figma for design reviews + Linear for issues. The combination is great for cross-team visibility.', time: '1h ago', likes: 8, isLiked: false },
      { id: 'r2', author: 'Amit Kumar', avatar: 'A', text: 'Miro works brilliantly for async brainstorming and retrospectives. Highly recommend!', time: '45m ago', likes: 5, isLiked: true },
    ],
  },
  {
    id: '2',
    title: 'Flexible work hours — your thoughts?',
    category: 'hr',
    content: 'With the new office timing change announced, I\'d love to hear feedback from everyone. Do you prefer fixed hours for better collaboration, or flexible hours for work-life balance? What works best for your team?',
    author: 'Sneha Patel', avatar: 'S', designation: 'HR Executive', time: '5 hours ago',
    views: 312, likes: 45, isLiked: true, isPinned: false,
    tags: ['HR', 'Work Hours', 'Flexibility'],
    replies: [
      { id: 'r3', author: 'Vikram Singh', avatar: 'V', text: 'Flexible hours work best for me! As long as we have a 4-hour overlap window for meetings, the rest should be free.', time: '4h ago', likes: 12, isLiked: false },
    ],
  },
  {
    id: '3',
    title: 'Idea: Internal hackathon for all departments',
    category: 'ideas',
    content: 'What if we ran a company-wide hackathon where teams across departments — not just engineering — come together to solve real business problems? 48 hours, cross-functional teams, real prizes. I think it could be huge for innovation and bonding.',
    author: 'Arjun Mehta', avatar: 'Ar', designation: 'Software Engineer', time: '1 day ago',
    views: 245, likes: 67, isLiked: false, isPinned: false,
    tags: ['Innovation', 'Hackathon', 'Idea'],
    replies: [],
  },
  {
    id: '4',
    title: 'Best places to eat near the Bangalore office?',
    category: 'watercooler',
    content: 'Just joined the Bangalore office last week! Looking for good lunch options nearby. Any recommendations for quick lunch, good dosas, or decent continental? All suggestions welcome 😄',
    author: 'Rohit Verma', avatar: 'R', designation: 'Data Analyst', time: '2 days ago',
    views: 178, likes: 34, isLiked: false, isPinned: false,
    tags: ['Bangalore', 'Food', 'New Joinee'],
    replies: [
      { id: 'r4', author: 'Deepika Rao', avatar: 'D', text: 'MTR near the office is legendary for breakfast and lunch! Sri Sagar for dosas too.', time: '2d ago', likes: 7, isLiked: false },
      { id: 'r5', author: 'Kiran Joshi', avatar: 'K', text: 'Ammini\'s Kitchen is my go-to. Small place but amazing Kerala food. 5 mins walk.', time: '1d ago', likes: 4, isLiked: false },
    ],
  },
  {
    id: '5',
    title: 'Tips for acing the annual performance review',
    category: 'general',
    content: 'Appraisal season is approaching. Would love to hear how experienced colleagues prepare — how you document your impact, handle the self-assessment, and negotiate ratings. Any templates or strategies that worked well for you?',
    author: 'Meera Singh', avatar: 'M', designation: 'UX Designer', time: '3 days ago',
    views: 423, likes: 89, isLiked: true, isPinned: false,
    tags: ['Appraisal', 'Career', 'Tips'],
    replies: [],
  },
];

const categoryColor: Record<string, string> = {
  general: 'bg-blue-500/20 text-blue-400',
  technical: 'bg-purple-500/20 text-purple-400',
  hr: 'bg-pink-500/20 text-pink-400',
  ideas: 'bg-yellow-500/20 text-yellow-400',
  watercooler: 'bg-green-500/20 text-green-400',
};

export default function ForumsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState(threads);
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedThread, setSelectedThread] = useState<Thread | null>(null);
  const [replyText, setReplyText] = useState('');
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThread, setNewThread] = useState({ title: '', content: '', category: 'general', tags: '' });

  const firstName = (user?.firstName || 'Y').charAt(0).toUpperCase();

  const filtered = items.filter((t) => {
    const matchCat = activeCategory === 'all' || t.category === activeCategory;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.content.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const pinned = filtered.filter((t) => t.isPinned);
  const regular = filtered.filter((t) => !t.isPinned);

  const handleLikeThread = (id: string) => {
    setItems((prev) => prev.map((t) =>
      t.id === id ? { ...t, isLiked: !t.isLiked, likes: t.isLiked ? t.likes - 1 : t.likes + 1 } : t
    ));
    if (selectedThread?.id === id) {
      setSelectedThread((prev) => prev ? { ...prev, isLiked: !prev.isLiked, likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1 } : null);
    }
  };

  const handleLikeReply = (threadId: string, replyId: string) => {
    const update = (t: Thread) => t.id !== threadId ? t : {
      ...t,
      replies: t.replies.map((r) =>
        r.id === replyId ? { ...r, isLiked: !r.isLiked, likes: r.isLiked ? r.likes - 1 : r.likes + 1 } : r
      ),
    };
    setItems((prev) => prev.map(update));
    if (selectedThread?.id === threadId) setSelectedThread((prev) => prev ? update(prev) : null);
  };

  const handleReply = () => {
    if (!replyText.trim() || !selectedThread) return;
    const newReply: Reply = {
      id: Date.now().toString(),
      author: `${user?.firstName || 'You'} ${user?.lastName || ''}`,
      avatar: firstName,
      text: replyText,
      time: 'Just now',
      likes: 0,
      isLiked: false,
    };
    const update = (t: Thread) => t.id !== selectedThread.id ? t : { ...t, replies: [...t.replies, newReply] };
    setItems((prev) => prev.map(update));
    setSelectedThread((prev) => prev ? update(prev) : null);
    setReplyText('');
  };

  const handleCreateThread = () => {
    if (!newThread.title.trim() || !newThread.content.trim()) return;
    const thread: Thread = {
      id: Date.now().toString(),
      title: newThread.title,
      category: newThread.category,
      content: newThread.content,
      author: `${user?.firstName || 'You'} ${user?.lastName || ''}`,
      avatar: firstName,
      designation: user?.designation || 'Employee',
      time: 'Just now',
      views: 0,
      likes: 0,
      isLiked: false,
      isPinned: false,
      tags: newThread.tags.split(',').map((t) => t.trim()).filter(Boolean),
      replies: [],
    };
    setItems([thread, ...items]);
    setNewThread({ title: '', content: '', category: 'general', tags: '' });
    setShowNewThread(false);
  };

  const ThreadCard = ({ thread }: { thread: Thread }) => {
    const c = categoryColor[thread.category] || categoryColor.general;
    return (
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4 hover:border-primary/30 transition-all cursor-pointer group"
        onClick={() => { setSelectedThread(thread); setReplyText(''); }}
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {thread.isPinned && <span className="flex items-center gap-0.5 text-xs text-primary font-semibold"><Pin className="w-3 h-3" /> Pinned</span>}
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${c}`}>{thread.category}</span>
            </div>
            <h3 className="font-semibold text-text-primary text-sm leading-snug group-hover:text-primary transition-colors">{thread.title}</h3>
            <p className="text-xs text-text-secondary mt-1 line-clamp-2 leading-relaxed">{thread.content}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {thread.tags.map((tag) => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">{tag}</span>
              ))}
            </div>

            {/* Meta */}
            <div className="flex items-center gap-3 mt-3 text-xs text-text-secondary">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">{thread.avatar}</div>
                <span>{thread.author}</span>
              </div>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{thread.time}</span>
              <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{thread.views}</span>
              <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" />{thread.likes}</span>
              <span className="flex items-center gap-1"><MessageSquare className="w-3 h-3" />{thread.replies.length}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-secondary group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
        </div>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-primary" /> Forum Discussions
          </h1>
          <p className="text-text-secondary mt-1">Ask questions, share ideas, and start conversations</p>
        </div>
        <button
          onClick={() => setShowNewThread(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" /> New Discussion
        </button>
      </div>

      {/* New thread form */}
      <AnimatePresence>
        {showNewThread && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="rounded-xl border border-primary/30 bg-[var(--glass-bg)] backdrop-blur-md p-5 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-text-primary">Start a New Discussion</h2>
              <button onClick={() => setShowNewThread(false)} className="text-text-secondary hover:text-text-primary">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Title</label>
              <input
                className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                placeholder="What would you like to discuss?"
                value={newThread.title}
                onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none"
                  value={newThread.category}
                  onChange={(e) => setNewThread({ ...newThread, category: e.target.value })}
                >
                  {forumCategories.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Tags (comma separated)</label>
                <input
                  className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="e.g. HR, Tools, Remote"
                  value={newThread.tags}
                  onChange={(e) => setNewThread({ ...newThread, tags: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">Your message</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
                placeholder="Share your thoughts, question, or idea..."
                value={newThread.content}
                onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreateThread}
                disabled={!newThread.title.trim() || !newThread.content.trim()}
                className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium text-sm disabled:opacity-40"
              >
                Post Discussion
              </button>
              <button onClick={() => setShowNewThread(false)} className="px-4 py-2 text-text-secondary text-sm">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 flex-shrink-0 space-y-1">
          {forumCategories.map((cat) => (
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

          {/* Trending */}
          <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-widest mb-2 flex items-center gap-1">
              <Flame className="w-3 h-3 text-orange-400" /> Trending
            </p>
            {items.sort((a, b) => b.likes - a.likes).slice(0, 3).map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedThread(t)}
                className="w-full text-left px-2 py-2 rounded-lg text-xs text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors line-clamp-2 mb-1"
              >
                {t.title}
              </button>
            ))}
          </div>
        </div>

        {/* Thread list or detail */}
        <div className="flex-1">
          {!selectedThread ? (
            <>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                <input
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                  placeholder="Search discussions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              {pinned.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2 flex items-center gap-1"><Pin className="w-3 h-3" /> Pinned</p>
                  <div className="space-y-2">{pinned.map((t) => <ThreadCard key={t.id} thread={t} />)}</div>
                </div>
              )}

              <div className="space-y-2">
                {regular.map((t) => <ThreadCard key={t.id} thread={t} />)}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-12 text-text-secondary">
                  <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p>No discussions found</p>
                </div>
              )}
            </>
          ) : (
            /* Thread detail */
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <button
                onClick={() => setSelectedThread(null)}
                className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                ← Back to discussions
              </button>

              {/* Thread body */}
              <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${categoryColor[selectedThread.category] || ''}`}>
                    {selectedThread.category}
                  </span>
                  {selectedThread.isPinned && <span className="text-xs text-primary flex items-center gap-0.5"><Pin className="w-3 h-3" />Pinned</span>}
                </div>
                <h2 className="text-lg font-bold text-text-primary mb-3">{selectedThread.title}</h2>
                <p className="text-sm text-text-primary leading-relaxed">{selectedThread.content}</p>

                <div className="flex flex-wrap gap-1 mt-3">
                  {selectedThread.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">{tag}</span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--glass-border)]">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {selectedThread.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{selectedThread.author}</p>
                      <p className="text-xs text-text-secondary">{selectedThread.designation} · {selectedThread.time}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLikeThread(selectedThread.id)}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      selectedThread.isLiked ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-primary/10 hover:text-primary'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${selectedThread.isLiked ? 'fill-current' : ''}`} />
                    {selectedThread.likes}
                  </button>
                </div>
              </div>

              {/* Replies */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-3">
                  {selectedThread.replies.length} Replies
                </p>
                <div className="space-y-3">
                  {selectedThread.replies.map((reply) => (
                    <motion.div
                      key={reply.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                        {reply.avatar}
                      </div>
                      <div className="flex-1 rounded-xl bg-[rgba(255,255,255,0.05)] border border-[var(--glass-border)] p-3">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-semibold text-text-primary">{reply.author}</p>
                          <p className="text-xs text-text-secondary">{reply.time}</p>
                        </div>
                        <p className="text-sm text-text-primary leading-relaxed">{reply.text}</p>
                        <button
                          onClick={() => handleLikeReply(selectedThread.id, reply.id)}
                          className={`mt-2 flex items-center gap-1 text-xs transition-colors ${
                            reply.isLiked ? 'text-primary' : 'text-text-secondary hover:text-primary'
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${reply.isLiked ? 'fill-current' : ''}`} />
                          {reply.likes}
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Reply composer */}
                <div className="flex gap-3 mt-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                    {firstName}
                  </div>
                  <div className="flex-1 flex gap-2">
                    <input
                      className="flex-1 px-3 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleReply(); }}
                    />
                    <button
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className="px-3 py-2 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
