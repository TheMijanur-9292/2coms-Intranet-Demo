'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon, Video, Play, X, Heart,
  Download, Share2, Search, Eye, ZoomIn,
} from 'lucide-react';

const albums = [
  { id: 'all', label: 'All Media', count: 24 },
  { id: 'events', label: 'Events', count: 8 },
  { id: 'team', label: 'Team', count: 6 },
  { id: 'celebration', label: 'Celebrations', count: 5 },
  { id: 'csr', label: 'CSR', count: 3 },
  { id: 'awards', label: 'Awards', count: 2 },
];

type MediaItem = {
  id: string;
  type: 'image' | 'video';
  title: string;
  album: string;
  date: string;
  likes: number;
  views: number;
  isLiked: boolean;
  gradient: string;
  aspectRatio: string;
  description: string;
  uploadedBy: string;
  duration?: string;
};

const mediaItems: MediaItem[] = [
  { id: '1', type: 'image', title: 'Q1 Town Hall 2026', album: 'events', date: '2026-03-20', likes: 48, views: 234, isLiked: false, gradient: 'from-blue-500/40 to-cyan-500/40', aspectRatio: 'aspect-[4/3]', description: 'All-hands Q1 Town Hall at the main auditorium. Leadership presented highlights and roadmap.', uploadedBy: 'HR Team' },
  { id: '2', type: 'image', title: 'Holi Celebration', album: 'celebration', date: '2026-03-14', likes: 92, views: 456, isLiked: true, gradient: 'from-pink-500/40 to-yellow-500/40', aspectRatio: 'aspect-square', description: 'Colours, laughter, and togetherness! Our annual Holi celebration was a blast.', uploadedBy: 'Admin Team' },
  { id: '3', type: 'video', title: 'Product Launch Highlights', album: 'events', date: '2026-03-10', likes: 67, views: 389, isLiked: false, gradient: 'from-purple-500/40 to-violet-500/40', aspectRatio: 'aspect-video', description: 'Recap video from our major product launch event. Watch the excitement unfold!', uploadedBy: 'Marketing', duration: '3:24' },
  { id: '4', type: 'image', title: 'Engineering Team Outing', album: 'team', date: '2026-02-25', likes: 54, views: 201, isLiked: false, gradient: 'from-green-500/40 to-teal-500/40', aspectRatio: 'aspect-[4/3]', description: 'A fun day out for the engineering team — adventure activities and team bonding.', uploadedBy: 'Priya Nair' },
  { id: '5', type: 'image', title: 'Annual Awards Ceremony', album: 'awards', date: '2026-02-20', likes: 134, views: 678, isLiked: true, gradient: 'from-yellow-500/40 to-orange-500/40', aspectRatio: 'aspect-square', description: 'Celebrating our stars! Annual awards ceremony recognising top performers.', uploadedBy: 'HR Team' },
  { id: '6', type: 'image', title: 'Tree Plantation Drive', album: 'csr', date: '2026-02-15', likes: 71, views: 312, isLiked: false, gradient: 'from-emerald-500/40 to-lime-500/40', aspectRatio: 'aspect-[4/3]', description: '2COMS employees plant 500 trees as part of our green initiative at Aarey Forest.', uploadedBy: 'CSR Team' },
  { id: '7', type: 'video', title: 'New Office Inauguration', album: 'events', date: '2026-02-10', likes: 88, views: 521, isLiked: false, gradient: 'from-rose-500/40 to-red-500/40', aspectRatio: 'aspect-video', description: 'Grand opening of our new Bangalore office. A milestone moment for team 2COMS!', uploadedBy: 'Admin Team', duration: '5:12' },
  { id: '8', type: 'image', title: 'Sales Team Celebration', album: 'team', date: '2026-02-05', likes: 45, views: 189, isLiked: false, gradient: 'from-indigo-500/40 to-blue-500/40', aspectRatio: 'aspect-[4/3]', description: 'Sales team celebrating after smashing Q1 targets. 127% achievement!', uploadedBy: 'Vikram Singh' },
  { id: '9', type: 'image', title: 'Republic Day Celebration', album: 'celebration', date: '2026-01-26', likes: 61, views: 298, isLiked: true, gradient: 'from-orange-500/40 to-green-500/40', aspectRatio: 'aspect-square', description: 'Flag hoisting and cultural programme to celebrate Republic Day 2026.', uploadedBy: 'HR Team' },
];

export default function GalleryPage() {
  const [activeAlbum, setActiveAlbum] = useState('all');
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<'all' | 'image' | 'video'>('all');
  const [items, setItems] = useState(mediaItems);
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) => prev.map((m) =>
      m.id === id ? { ...m, isLiked: !m.isLiked, likes: m.isLiked ? m.likes - 1 : m.likes + 1 } : m
    ));
  };

  const filtered = items.filter((m) => {
    const matchAlbum = activeAlbum === 'all' || m.album === activeAlbum;
    const matchType = activeType === 'all' || m.type === activeType;
    const matchSearch = m.title.toLowerCase().includes(search.toLowerCase());
    return matchAlbum && matchType && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-primary" /> Media Gallery
        </h1>
        <p className="text-text-secondary mt-1">Company moments, events, and memories</p>
      </div>

      {/* Search + Type filter */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Search media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]">
          {(['all', 'image', 'video'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize flex items-center gap-1.5 transition-colors ${
                activeType === t ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t === 'image' ? <ImageIcon className="w-3.5 h-3.5" /> : t === 'video' ? <Video className="w-3.5 h-3.5" /> : null}
              {t === 'all' ? '🎞️ All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Albums sidebar */}
        <div className="w-44 flex-shrink-0 space-y-1">
          {albums.map((a) => (
            <button
              key={a.id}
              onClick={() => setActiveAlbum(a.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                activeAlbum === a.id
                  ? 'bg-primary/20 text-primary font-semibold'
                  : 'text-text-secondary hover:bg-[rgba(255,255,255,0.08)] hover:text-text-primary'
              }`}
            >
              <span>{a.label}</span>
              <span className="text-xs opacity-60">{a.count}</span>
            </button>
          ))}
        </div>

        {/* Masonry-style grid */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-text-secondary">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No media found</p>
            </div>
          ) : (
            <div className="columns-2 md:columns-3 gap-3 space-y-3">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="break-inside-avoid group relative rounded-xl overflow-hidden border border-[var(--glass-border)] cursor-pointer"
                  onClick={() => setLightbox(item)}
                >
                  {/* Thumbnail */}
                  <div className={`${item.aspectRatio} bg-gradient-to-br ${item.gradient} flex items-center justify-center relative`}>
                    {item.type === 'video' ? (
                      <div className="flex flex-col items-center gap-2 text-white/70">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play className="w-5 h-5 fill-current" />
                        </div>
                        <span className="text-xs bg-black/40 px-2 py-0.5 rounded">{item.duration}</span>
                      </div>
                    ) : (
                      <ImageIcon className="w-10 h-10 text-white/30" />
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <div className="flex justify-end">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-semibold truncate">{item.title}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="flex items-center gap-0.5 text-white/70 text-xs">
                            <Eye className="w-3 h-3" /> {item.views}
                          </span>
                          <span className="flex items-center gap-0.5 text-white/70 text-xs">
                            <Heart className="w-3 h-3" /> {item.likes}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Like button */}
                    <button
                      onClick={(e) => handleLike(item.id, e)}
                      className={`absolute top-2 left-2 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all ${
                        item.isLiked ? 'bg-red-500/80 text-white' : 'bg-black/40 text-white hover:bg-red-500/60'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.isLiked ? 'fill-current' : ''}`} />
                    </button>

                    {/* Type badge */}
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 text-xs bg-black/50 text-white rounded capitalize opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.type}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-2xl w-full rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-[rgba(15,23,42,0.95)]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Media preview */}
              <div className={`aspect-video bg-gradient-to-br ${lightbox.gradient} flex items-center justify-center`}>
                {lightbox.type === 'video' ? (
                  <div className="flex flex-col items-center gap-3 text-white/80">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <Play className="w-8 h-8 fill-current" />
                    </div>
                    <p className="text-sm">{lightbox.duration}</p>
                  </div>
                ) : (
                  <ImageIcon className="w-16 h-16 text-white/30" />
                )}
              </div>

              {/* Info */}
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-text-primary text-lg">{lightbox.title}</h3>
                    <p className="text-xs text-text-secondary mt-0.5">By {lightbox.uploadedBy} · {lightbox.date}</p>
                  </div>
                  <button
                    onClick={() => setLightbox(null)}
                    className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors text-text-secondary"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-text-secondary mt-3 leading-relaxed">{lightbox.description}</p>
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--glass-border)]">
                  <button
                    onClick={() => handleLike(lightbox.id, { stopPropagation: () => {} } as React.MouseEvent)}
                    className={`flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg transition-colors ${
                      lightbox.isLiked ? 'bg-red-500/20 text-red-400' : 'text-text-secondary hover:bg-red-500/10 hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${lightbox.isLiked ? 'fill-current' : ''}`} />
                    {items.find((m) => m.id === lightbox.id)?.likes}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10">
                    <Download className="w-4 h-4" /> Download
                  </button>
                  <button className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-primary/10">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
