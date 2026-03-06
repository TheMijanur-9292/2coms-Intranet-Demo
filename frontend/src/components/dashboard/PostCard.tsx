'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/GlassCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { GlassButton } from '@/components/ui/GlassButton';
import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: string;
    author: {
      name: string;
      avatar?: string;
      designation: string;
    };
    content: string;
    media?: Array<{ url: string; type: string }>;
    reactions: Array<{ type: string; count: number }>;
    comments: number;
    createdAt: Date;
  };
  onReact?: (reaction: string) => void;
  onComment?: () => void;
  onShare?: () => void;
}

export function PostCard({
  post,
  onReact,
  onComment,
  onShare,
}: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const likeCount = post.reactions.find((r) => r.type === 'like')?.count || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard className="mb-4" hover>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-text-primary">
                {post.author.name}
              </h4>
              <p className="text-sm text-text-secondary">
                {post.author.designation}
              </p>
            </div>
          </div>
          <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors">
            <MoreHorizontal className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <p className="text-text-primary mb-4 whitespace-pre-wrap">
          {post.content}
        </p>

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <img
              src={post.media[0].url}
              alt="Post media"
              className="w-full h-auto max-h-96 object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center gap-4 text-sm text-text-secondary mb-4">
          <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
          {likeCount > 0 && <span>{likeCount} reactions</span>}
          {post.comments > 0 && <span>{post.comments} comments</span>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-[var(--glass-border)]">
          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsLiked(!isLiked);
              onReact?.('like');
            }}
            className={isLiked ? 'text-red-500' : ''}
          >
            <Heart className={cn('w-4 h-4 mr-2', isLiked && 'fill-current')} />
            Like
          </GlassButton>
          <GlassButton variant="ghost" size="sm" onClick={onComment}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Comment
          </GlassButton>
          <GlassButton variant="ghost" size="sm" onClick={onShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </GlassButton>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function cn(...classes: (string | undefined | boolean)[]): string {
  return classes.filter(Boolean).join(' ');
}
