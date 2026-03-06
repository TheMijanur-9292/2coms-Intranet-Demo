'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserPlus, ChevronLeft, ChevronRight, MapPin,
  Briefcase, Calendar, Mail, Heart, MessageSquare, Sparkles,
} from 'lucide-react';

const joinees = [
  {
    id: '1',
    name: 'Arjun Mehta',
    role: 'Software Engineer',
    department: 'Engineering',
    location: 'Bangalore',
    startDate: 'March 10, 2026',
    email: 'arjun.mehta@2coms.com',
    avatar: 'A',
    color: 'from-blue-500/30 to-cyan-500/30',
    borderColor: 'border-blue-500/30',
    interests: ['Coding', 'Gaming', 'Music'],
    intro: 'Excited to join the 2COMS family! I love building scalable systems and exploring new technologies. Looking forward to collaborating with everyone!',
    welcomes: 14,
    isWelcomed: false,
  },
  {
    id: '2',
    name: 'Deepika Rao',
    role: 'HR Executive',
    department: 'Human Resources',
    location: 'Hyderabad',
    startDate: 'March 8, 2026',
    email: 'deepika.rao@2coms.com',
    avatar: 'D',
    color: 'from-pink-500/30 to-rose-500/30',
    borderColor: 'border-pink-500/30',
    interests: ['People Management', 'Yoga', 'Travel'],
    intro: 'Thrilled to be part of such a dynamic organisation. I bring 4 years of HR experience and am passionate about employee well-being. Happy to connect!',
    welcomes: 22,
    isWelcomed: true,
  },
  {
    id: '3',
    name: 'Kiran Joshi',
    role: 'Product Manager',
    department: 'Product',
    location: 'Mumbai',
    startDate: 'March 5, 2026',
    email: 'kiran.joshi@2coms.com',
    avatar: 'K',
    color: 'from-purple-500/30 to-violet-500/30',
    borderColor: 'border-purple-500/30',
    interests: ['Product Strategy', 'Reading', 'Cricket'],
    intro: 'Glad to be joining 2COMS! With a background in product strategy, I\'m here to help turn ideas into impactful features. Looking forward to the journey!',
    welcomes: 18,
    isWelcomed: false,
  },
  {
    id: '4',
    name: 'Meera Singh',
    role: 'UX Designer',
    department: 'Design',
    location: 'Pune',
    startDate: 'February 28, 2026',
    email: 'meera.singh@2coms.com',
    avatar: 'M',
    color: 'from-orange-500/30 to-yellow-500/30',
    borderColor: 'border-orange-500/30',
    interests: ['UI/UX', 'Photography', 'Cooking'],
    intro: 'Design enthusiast with a passion for user-centred experiences. Super excited to craft meaningful interfaces for 2COMS. Let\'s build something beautiful!',
    welcomes: 31,
    isWelcomed: false,
  },
  {
    id: '5',
    name: 'Rohit Verma',
    role: 'Data Analyst',
    department: 'Analytics',
    location: 'Chennai',
    startDate: 'February 25, 2026',
    email: 'rohit.verma@2coms.com',
    avatar: 'R',
    color: 'from-green-500/30 to-teal-500/30',
    borderColor: 'border-green-500/30',
    interests: ['Data Science', 'Chess', 'Cycling'],
    intro: 'Data tells a story, and I love uncovering it! Joining 2COMS as a Data Analyst — excited to turn numbers into insights that drive decisions.',
    welcomes: 9,
    isWelcomed: false,
  },
];

export default function NewJoineesPage() {
  const [active, setActive] = useState(0);
  const [items, setItems] = useState(joinees);
  const [direction, setDirection] = useState(1);
  const [activeTab, setActiveTab] = useState<'carousel' | 'grid'>('carousel');

  const prev = () => {
    setDirection(-1);
    setActive((a) => (a - 1 + items.length) % items.length);
  };

  const next = () => {
    setDirection(1);
    setActive((a) => (a + 1) % items.length);
  };

  const handleWelcome = (id: string) => {
    setItems((prev) => prev.map((j) =>
      j.id === id ? { ...j, isWelcomed: !j.isWelcomed, welcomes: j.isWelcomed ? j.welcomes - 1 : j.welcomes + 1 } : j
    ));
  };

  const current = items[active];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-primary" /> New Joinees
          </h1>
          <p className="text-text-secondary mt-1">Welcome the newest members of our 2COMS family</p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]">
          {(['carousel', 'grid'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveTab(v)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-colors ${
                activeTab === v ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {v === 'carousel' ? '🎠 Carousel' : '⊞ Grid'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4">
        {[
          { label: 'This Month', value: items.length, color: 'text-primary' },
          { label: 'Departments', value: new Set(items.map((j) => j.department)).size, color: 'text-purple-400' },
          { label: 'Cities', value: new Set(items.map((j) => j.location)).size, color: 'text-green-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md px-5 py-3 flex items-center gap-3">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-text-secondary">{s.label}</p>
          </div>
        ))}
      </div>

      {/* CAROUSEL VIEW */}
      {activeTab === 'carousel' && (
        <div className="relative">
          {/* Card */}
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction * 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -60 }}
              transition={{ duration: 0.3 }}
              className={`rounded-2xl border ${current.borderColor} bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden`}
            >
              {/* Hero gradient top */}
              <div className={`h-28 bg-gradient-to-br ${current.color} flex items-center justify-center relative`}>
                <Sparkles className="absolute top-3 right-4 w-5 h-5 text-white/30" />
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {current.avatar}
                </div>
              </div>

              {/* Info */}
              <div className="p-6">
                <div className="text-center mb-4">
                  <h2 className="text-xl font-bold text-text-primary">{current.name}</h2>
                  <p className="text-sm text-text-secondary mt-0.5">{current.role}</p>
                  <div className="flex items-center justify-center gap-2 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <Briefcase className="w-3.5 h-3.5" /> {current.department}
                    </span>
                    <span className="text-text-secondary">·</span>
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <MapPin className="w-3.5 h-3.5" /> {current.location}
                    </span>
                    <span className="text-text-secondary">·</span>
                    <span className="flex items-center gap-1 text-xs text-text-secondary">
                      <Calendar className="w-3.5 h-3.5" /> Joined {current.startDate}
                    </span>
                  </div>
                </div>

                {/* Intro quote */}
                <div className="rounded-lg bg-[rgba(255,255,255,0.06)] border border-[var(--glass-border)] p-4 mb-4">
                  <p className="text-sm text-text-primary italic leading-relaxed">&ldquo;{current.intro}&rdquo;</p>
                </div>

                {/* Interests */}
                <div className="flex flex-wrap gap-2 justify-center mb-4">
                  {current.interests.map((interest) => (
                    <span key={interest} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => handleWelcome(current.id)}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                      current.isWelcomed
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${current.isWelcomed ? 'fill-current' : ''}`} />
                    {current.isWelcomed ? 'Welcomed!' : 'Welcome'} · {current.welcomes}
                  </button>
                  <a
                    href={`mailto:${current.email}`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-text-secondary border border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                  >
                    <Mail className="w-4 h-4" /> Say Hi
                  </a>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] flex items-center justify-center text-text-primary hover:bg-[rgba(255,255,255,0.15)] transition-colors shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-[var(--glass-bg)] backdrop-blur-md border border-[var(--glass-border)] flex items-center justify-center text-text-primary hover:bg-[rgba(255,255,255,0.15)] transition-colors shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > active ? 1 : -1); setActive(i); }}
                className={`rounded-full transition-all duration-300 ${i === active ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-[var(--glass-border)]'}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* GRID VIEW */}
      {activeTab === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((j, i) => (
            <motion.div
              key={j.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl border ${j.borderColor} bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden`}
            >
              <div className={`h-16 bg-gradient-to-br ${j.color} flex items-center justify-center`}>
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/40 flex items-center justify-center text-xl font-bold text-white">
                  {j.avatar}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-text-primary">{j.name}</h3>
                <p className="text-xs text-text-secondary">{j.role} · {j.department}</p>
                <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
                  <MapPin className="w-3 h-3" /> {j.location}
                </div>
                <p className="text-xs text-text-primary mt-2 leading-relaxed line-clamp-2 italic">&ldquo;{j.intro}&rdquo;</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => handleWelcome(j.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      j.isWelcomed ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary hover:bg-primary/30'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${j.isWelcomed ? 'fill-current' : ''}`} />
                    {j.welcomes}
                  </button>
                  <a
                    href={`mailto:${j.email}`}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs text-text-secondary border border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" /> Email
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
