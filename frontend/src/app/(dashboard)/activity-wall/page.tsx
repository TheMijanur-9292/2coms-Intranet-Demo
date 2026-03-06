'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare, Heart, Smile, ThumbsUp, Lightbulb, PartyPopper,
  Image as ImageIcon, Send, MoreHorizontal, Bookmark, Share2,
  ChevronDown, Globe, Users, Lock,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const initialPosts = [
  {
    id: '1',
    author: { name: 'Priya Nair', designation: 'Senior Designer', department: 'Design', avatar: 'P' },
    content: "Just wrapped up the brand refresh for 2COMS's new client portal! 🎨 It was an intense 3-week sprint but the results speak for themselves. Huge shoutout to the dev team for making every pixel count!",
    image: null,
    reactions: { like: 42, celebrate: 18, insightful: 7, funny: 3 },
    myReaction: null as string | null,
    comments: [
      { id: 'c1', author: 'Amit Kumar', avatar: 'A', text: 'Looks absolutely stunning! Can\'t wait for the launch.', time: '10m ago' },
      { id: 'c2', author: 'Rahul Sharma', avatar: 'R', text: 'The colour palette is on point. Great work team!', time: '5m ago' },
    ],
    time: '1h ago',
    visibility: 'company',
    tags: ['#Design', '#ProductLaunch'],
  },
  {
    id: '2',
    author: { name: 'Vikram Singh', designation: 'Sales Lead', department: 'Sales', avatar: 'V' },
    content: "Proud to announce that our team closed Q1 with 127% of target! 🏆 This wouldn't have been possible without each one of you. Let's keep the momentum going in Q2!",
    image: null,
    reactions: { like: 89, celebrate: 56, insightful: 12, funny: 1 },
    myReaction: 'like' as string | null,
    comments: [],
    time: '3h ago',
    visibility: 'company',
    tags: ['#Sales', '#Achievement', '#Q1'],
  },
  {
    id: '3',
    author: { name: 'Sneha Patel', designation: 'HR Executive', department: 'HR', avatar: 'S' },
    content: 'Reminder: The annual engagement survey closes this Friday. We\'ve had 68% responses so far — let\'s aim for 100%! Your voice shapes how we work together. Link in the announcements. 📋',
    image: null,
    reactions: { like: 34, celebrate: 5, insightful: 21, funny: 0 },
    myReaction: null as string | null,
    comments: [
      { id: 'c3', author: 'Priya Nair', avatar: 'P', text: 'Done! Took only 5 minutes. Everyone fill it up!', time: '1h ago' },
    ],
    time: '5h ago',
    visibility: 'company',
    tags: ['#HR', '#Survey'],
  },
];

const reactionConfig = [
  { type: 'like', icon: ThumbsUp, label: 'Like', color: 'text-blue-400' },
  { type: 'celebrate', icon: PartyPopper, label: 'Celebrate', color: 'text-yellow-400' },
  { type: 'insightful', icon: Lightbulb, label: 'Insightful', color: 'text-green-400' },
  { type: 'funny', icon: Smile, label: 'Funny', color: 'text-pink-400' },
];

const reactionIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  like: ThumbsUp, celebrate: PartyPopper, insightful: Lightbulb, funny: Smile,
};

const visibilityOptions = [
  { value: 'company', label: 'Company', icon: Globe },
  { value: 'department', label: 'Department', icon: Users },
  { value: 'private', label: 'Only Me', icon: Lock },
];

export default function ActivityWallPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState(initialPosts);
  const [postText, setPostText] = useState('');
  const [visibility, setVisibility] = useState('company');
  const [showVisibilityMenu, setShowVisibilityMenu] = useState(false);
  const [expandedComments, setExpandedComments] = useState<string[]>([]);
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});
  const [activeReactionMenu, setActiveReactionMenu] = useState<string | null>(null);

  const firstName = (user?.firstName || 'You').charAt(0).toUpperCase();

  const handlePost = () => {
    if (!postText.trim()) return;
    const departmentName = typeof user?.departmentId === 'object' ? user.departmentId.name : 'General';
    const newPost = {
      id: Date.now().toString(),
      author: { name: `${user?.firstName || 'You'} ${user?.lastName || ''}`, designation: user?.designation || 'Employee', department: departmentName, avatar: firstName },
      content: postText,
      image: null,
      reactions: { like: 0, celebrate: 0, insightful: 0, funny: 0 },
      myReaction: null,
      comments: [],
      time: 'Just now',
      visibility,
      tags: [],
    };
    setPosts([newPost, ...posts]);
    setPostText('');
  };

  const handleReact = (postId: string, type: string) => {
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      const already = p.myReaction === type;
      const reactions = { ...p.reactions };
      if (p.myReaction) (reactions as any)[p.myReaction] = Math.max(0, (reactions as any)[p.myReaction] - 1);
      if (!already) (reactions as any)[type] = ((reactions as any)[type] || 0) + 1;
      return { ...p, reactions, myReaction: already ? null : type };
    }));
    setActiveReactionMenu(null);
  };

  const handleComment = (postId: string) => {
    const text = commentTexts[postId];
    if (!text?.trim()) return;
    setPosts((prev) => prev.map((p) => {
      if (p.id !== postId) return p;
      return {
        ...p,
        comments: [...p.comments, { id: Date.now().toString(), author: user?.firstName || 'You', avatar: firstName, text, time: 'Just now' }],
      };
    }));
    setCommentTexts((prev) => ({ ...prev, [postId]: '' }));
  };

  const totalReactions = (r: Record<string, number>) => Object.values(r).reduce((a, b) => a + b, 0);

  const VisIcon = visibilityOptions.find((v) => v.value === visibility)?.icon || Globe;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Post composer */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4"
      >
        <div className="flex gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/40 to-secondary/40 flex items-center justify-center text-primary font-bold flex-shrink-0">
            {firstName}
          </div>
          <div className="flex-1">
            <textarea
              rows={3}
              className="w-full bg-[rgba(255,255,255,0.06)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              placeholder="Share an update, achievement, or thought..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <button className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors">
                  <ImageIcon className="w-4 h-4" />
                </button>

                {/* Visibility */}
                <div className="relative">
                  <button
                    onClick={() => setShowVisibilityMenu(!showVisibilityMenu)}
                    className="flex items-center gap-1 text-xs text-text-secondary hover:text-primary transition-colors px-2 py-1 rounded-lg hover:bg-primary/10"
                  >
                    <VisIcon className="w-3.5 h-3.5" />
                    <span className="capitalize">{visibility}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  <AnimatePresence>
                    {showVisibilityMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute left-0 top-8 z-20 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-xl shadow-lg py-1 w-36"
                      >
                        {visibilityOptions.map((opt) => {
                          const Icon = opt.icon;
                          return (
                            <button
                              key={opt.value}
                              onClick={() => { setVisibility(opt.value); setShowVisibilityMenu(false); }}
                              className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[rgba(255,255,255,0.1)] transition-colors ${visibility === opt.value ? 'text-primary' : 'text-text-primary'}`}
                            >
                              <Icon className="w-3.5 h-3.5" /> {opt.label}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <button
                onClick={handlePost}
                disabled={!postText.trim()}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-3.5 h-3.5" /> Post
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Posts */}
      {posts.map((post, i) => {
        const isCommentsOpen = expandedComments.includes(post.id);
        const MyReactIcon = post.myReaction ? reactionIcons[post.myReaction] : Heart;

        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md overflow-visible"
          >
            {/* Post header */}
            <div className="flex items-start gap-3 p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-primary font-bold flex-shrink-0">
                {post.author.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary text-sm">{post.author.name}</p>
                <p className="text-xs text-text-secondary">{post.author.designation} · {post.author.department}</p>
                <p className="text-xs text-text-secondary mt-0.5">{post.time}</p>
              </div>
              <button className="p-1.5 rounded-lg text-text-secondary hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
              <p className="text-sm text-text-primary leading-relaxed">{post.content}</p>
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs text-primary hover:underline cursor-pointer">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Reaction summary */}
            {totalReactions(post.reactions) > 0 && (
              <div className="px-4 pb-2 flex items-center justify-between text-xs text-text-secondary">
                <div className="flex items-center gap-1">
                  {reactionConfig.filter((r) => (post.reactions as any)[r.type] > 0).slice(0, 3).map((r) => {
                    const Icon = r.icon;
                    return <Icon key={r.type} className={`w-3.5 h-3.5 ${r.color}`} />;
                  })}
                  <span className="ml-1">{totalReactions(post.reactions)}</span>
                </div>
                <button
                  onClick={() => setExpandedComments((prev) => prev.includes(post.id) ? prev.filter((id) => id !== post.id) : [...prev, post.id])}
                  className="hover:underline"
                >
                  {post.comments.length} comments
                </button>
              </div>
            )}

            {/* Action bar */}
            <div className="px-4 pb-3 flex items-center gap-1 border-t border-[var(--glass-border)] pt-2 relative">
              {/* Reaction button */}
              <div className="relative flex-1">
                <button
                  onMouseEnter={() => setActiveReactionMenu(post.id)}
                  onMouseLeave={() => setActiveReactionMenu(null)}
                  onClick={() => handleReact(post.id, post.myReaction ? post.myReaction : 'like')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-[rgba(255,255,255,0.1)] ${post.myReaction ? 'text-primary' : 'text-text-secondary'}`}
                >
                  <MyReactIcon className="w-4 h-4" />
                  <span className="capitalize">{post.myReaction || 'React'}</span>
                </button>
                {/* Reaction picker popup */}
                <AnimatePresence>
                  {activeReactionMenu === post.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.85, y: 4 }}
                      onMouseEnter={() => setActiveReactionMenu(post.id)}
                      onMouseLeave={() => setActiveReactionMenu(null)}
                      className="absolute bottom-10 left-0 z-30 flex gap-1 bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] rounded-xl px-2 py-2 shadow-xl"
                    >
                      {reactionConfig.map((r) => {
                        const Icon = r.icon;
                        return (
                          <button
                            key={r.type}
                            onClick={() => handleReact(post.id, r.type)}
                            title={r.label}
                            className={`p-2 rounded-lg hover:bg-[rgba(255,255,255,0.15)] transition-all hover:scale-125 ${r.color}`}
                          >
                            <Icon className="w-5 h-5" />
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => setExpandedComments((prev) => prev.includes(post.id) ? prev.filter((id) => id !== post.id) : [...prev, post.id])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:bg-[rgba(255,255,255,0.1)] transition-colors flex-1"
              >
                <MessageSquare className="w-4 h-4" /> Comment
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
              <button className="p-1.5 rounded-lg text-text-secondary hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Comments section */}
            <AnimatePresence>
              {isCommentsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-[var(--glass-border)]"
                >
                  <div className="p-4 space-y-3">
                    {post.comments.map((c) => (
                      <div key={c.id} className="flex gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                          {c.avatar}
                        </div>
                        <div className="bg-[rgba(255,255,255,0.06)] rounded-lg px-3 py-2 flex-1">
                          <p className="text-xs font-semibold text-text-primary">{c.author}</p>
                          <p className="text-xs text-text-primary mt-0.5">{c.text}</p>
                        </div>
                        <span className="text-xs text-text-secondary self-end">{c.time}</span>
                      </div>
                    ))}
                    {/* Add comment */}
                    <div className="flex gap-2 mt-2">
                      <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                        {firstName}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          className="flex-1 bg-[rgba(255,255,255,0.06)] border border-[var(--glass-border)] rounded-lg px-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-1 focus:ring-primary/40"
                          placeholder="Write a comment..."
                          value={commentTexts[post.id] || ''}
                          onChange={(e) => setCommentTexts((prev) => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleComment(post.id); }}
                        />
                        <button onClick={() => handleComment(post.id)} className="p-1.5 rounded-lg bg-primary/20 text-primary hover:bg-primary/30 transition-colors">
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
