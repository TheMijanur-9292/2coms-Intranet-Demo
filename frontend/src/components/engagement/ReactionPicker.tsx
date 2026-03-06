'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Smile, PartyPopper, Lightbulb, ThumbsUp } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

export type ReactionType = 'like' | 'love' | 'celebrate' | 'insightful' | 'support';

interface ReactionOption {
  type: ReactionType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const reactions: ReactionOption[] = [
  { type: 'like', label: 'Like', icon: Heart, color: 'text-blue-500' },
  { type: 'love', label: 'Love', icon: Heart, color: 'text-red-500' },
  { type: 'celebrate', label: 'Celebrate', icon: PartyPopper, color: 'text-yellow-500' },
  { type: 'insightful', label: 'Insightful', icon: Lightbulb, color: 'text-purple-500' },
  { type: 'support', label: 'Support', icon: ThumbsUp, color: 'text-green-500' },
];

interface ReactionPickerProps {
  currentReaction?: ReactionType;
  onSelect: (reaction: ReactionType) => void;
  onRemove?: () => void;
  position?: 'top' | 'bottom';
}

export function ReactionPicker({
  currentReaction,
  onSelect,
  onRemove,
  position = 'top',
}: ReactionPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReactionClick = (reaction: ReactionType) => {
    if (currentReaction === reaction && onRemove) {
      onRemove();
    } else {
      onSelect(reaction);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
        aria-label="Add reaction"
      >
        <Smile className="w-5 h-5 text-text-secondary" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: position === 'top' ? 10 : -10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className={`
                absolute z-50
                ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
              `}
            >
              <GlassCard className="p-2" bevel>
                <div className="flex items-center gap-2">
                  {reactions.map((reaction) => {
                    const Icon = reaction.icon;
                    const isActive = currentReaction === reaction.type;

                    return (
                      <motion.button
                        key={reaction.type}
                        onClick={() => handleReactionClick(reaction.type)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        className={`
                          p-2 rounded-lg transition-all
                          ${isActive ? 'bg-primary/20' : 'hover:bg-[rgba(255,255,255,0.1)]'}
                        `}
                        title={reaction.label}
                      >
                        <Icon className={cn('w-6 h-6', reaction.color, isActive && 'fill-current')} />
                      </motion.button>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
