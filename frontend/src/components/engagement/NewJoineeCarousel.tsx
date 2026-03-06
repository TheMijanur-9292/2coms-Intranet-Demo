'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { GlassButton } from '@/components/ui/GlassButton';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface NewJoinee {
  id: string;
  name: string;
  avatar?: string;
  designation: string;
  department: string;
  introduction: string;
  funFacts?: string;
  startDate: Date;
  welcomeMessages: Array<{
    from: string;
    message: string;
  }>;
}

interface NewJoineeCarouselProps {
  joinees: NewJoinee[];
  onWelcome?: (joineeId: string, message: string) => Promise<void>;
}

export function NewJoineeCarousel({
  joinees,
  onWelcome,
}: NewJoineeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [welcomeMessage, setWelcomeMessage] = useState<{ [key: string]: string }>({});

  if (joinees.length === 0) {
    return null;
  }

  const currentJoinee = joinees[currentIndex];
  const nextIndex = (currentIndex + 1) % joinees.length;
  const prevIndex = (currentIndex - 1 + joinees.length) % joinees.length;

  const goToNext = () => setCurrentIndex(nextIndex);
  const goToPrev = () => setCurrentIndex(prevIndex);

  return (
    <GlassCard className="p-6" fringe>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">
              Welcome New Team Members
            </h2>
            <p className="text-sm text-text-secondary">
              {joinees.length} new {joinees.length === 1 ? 'joinee' : 'joinees'}
            </p>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex items-center gap-2">
          {joinees.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === currentIndex
                  ? 'w-6 bg-primary'
                  : 'bg-[var(--glass-border)] hover:bg-primary/50'
              )}
              aria-label={`Go to joinee ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Carousel Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentJoinee.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Section */}
              <div className="flex-shrink-0 text-center md:text-left">
                <Avatar className="w-24 h-24 mx-auto md:mx-0 mb-4">
                  <AvatarImage src={currentJoinee.avatar} />
                  <AvatarFallback className="text-2xl">
                    {currentJoinee.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-bold text-text-primary mb-1">
                  {currentJoinee.name}
                </h3>
                <p className="text-sm text-text-secondary mb-2">
                  {currentJoinee.designation}
                </p>
                <p className="text-xs text-text-secondary mb-4">
                  {currentJoinee.department}
                </p>
                <div className="text-xs text-text-secondary">
                  Joined {formatDistanceToNow(currentJoinee.startDate, { addSuffix: true })}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1">
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-text-primary mb-2">
                    Introduction
                  </h4>
                  <p className="text-sm text-text-primary leading-relaxed">
                    {currentJoinee.introduction}
                  </p>
                </div>

                {currentJoinee.funFacts && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                      Fun Facts
                    </h4>
                    <p className="text-sm text-text-secondary">
                      {currentJoinee.funFacts}
                    </p>
                  </div>
                )}

                {/* Welcome Messages */}
                {currentJoinee.welcomeMessages.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-text-primary mb-2">
                      Welcome Messages
                    </h4>
                    <div className="space-y-2">
                      {currentJoinee.welcomeMessages.slice(0, 3).map((msg, idx) => (
                        <div key={idx} className="text-sm glass-card p-2">
                          <span className="font-medium text-text-primary">
                            {msg.from}:
                          </span>{' '}
                          <span className="text-text-secondary">{msg.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Welcome Form */}
                {onWelcome && (
                  <div className="mt-4">
                    <textarea
                      value={welcomeMessage[currentJoinee.id] || ''}
                      onChange={(e) =>
                        setWelcomeMessage({
                          ...welcomeMessage,
                          [currentJoinee.id]: e.target.value,
                        })
                      }
                      placeholder="Write a welcome message..."
                      className="glass-input w-full min-h-[80px] text-sm mb-2"
                      maxLength={500}
                    />
                    <GlassButton
                      size="sm"
                      variant="primary"
                      onClick={async () => {
                        const message = welcomeMessage[currentJoinee.id];
                        if (message && onWelcome) {
                          await onWelcome(currentJoinee.id, message);
                          setWelcomeMessage({
                            ...welcomeMessage,
                            [currentJoinee.id]: '',
                          });
                        }
                      }}
                      disabled={!welcomeMessage[currentJoinee.id]?.trim()}
                    >
                      Send Welcome
                    </GlassButton>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {joinees.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 p-2 rounded-full glass-card hover:scale-110 transition-transform"
              aria-label="Previous joinee"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 p-2 rounded-full glass-card hover:scale-110 transition-transform"
              aria-label="Next joinee"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>
    </GlassCard>
  );
}
