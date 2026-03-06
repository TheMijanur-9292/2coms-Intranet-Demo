'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { ReactionPicker, ReactionType } from './ReactionPicker';
import { MoreHorizontal, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: Date;
  reactions: Array<{ userId: string; type: ReactionType }>;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  currentUserId: string;
  onAddComment: (content: string, parentId?: string) => Promise<void>;
  onReact: (commentId: string, reaction: ReactionType) => void;
  onRemoveReaction: (commentId: string) => void;
  showReplies?: boolean;
}

export function CommentSection({
  comments,
  currentUserId,
  onAddComment,
  onReact,
  onRemoveReaction,
  showReplies = true,
}: CommentSectionProps) {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddComment(newComment.trim(), replyingTo || undefined);
      setNewComment('');
      setReplyingTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const CommentItem = ({ comment, level = 0 }: { comment: Comment; level?: number }) => {
    const userReaction = comment.reactions.find((r) => r.userId === currentUserId);
    const reactionCount = comment.reactions.length;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('mb-3', level > 0 && 'ml-8')}
      >
        <GlassCard className="p-3">
          <div className="flex items-start gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={comment.userAvatar} />
              <AvatarFallback>
                {comment.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-text-primary">
                  {comment.userName}
                </span>
                <span className="text-xs text-text-secondary">
                  {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                </span>
              </div>

              <p className="text-sm text-text-primary mb-2 whitespace-pre-wrap">
                {comment.content}
              </p>

              <div className="flex items-center gap-4">
                <ReactionPicker
                  currentReaction={userReaction?.type}
                  onSelect={(reaction) => onReact(comment.id, reaction)}
                  onRemove={() => onRemoveReaction(comment.id)}
                  position="bottom"
                />
                {reactionCount > 0 && (
                  <span className="text-xs text-text-secondary">
                    {reactionCount} {reactionCount === 1 ? 'reaction' : 'reactions'}
                  </span>
                )}

                {showReplies && (
                  <button
                    onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                    className="text-xs text-primary hover:underline flex items-center gap-1"
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </button>
                )}

                <button className="ml-auto p-1 rounded hover:bg-[rgba(255,255,255,0.1)]">
                  <MoreHorizontal className="w-4 h-4 text-text-secondary" />
                </button>
              </div>

              {/* Reply Form */}
              {replyingTo === comment.id && (
                <motion.form
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  onSubmit={handleSubmit}
                  className="mt-3"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a reply..."
                      className="flex-1 glass-input px-3 py-2 text-sm"
                      autoFocus
                    />
                    <GlassButton
                      type="submit"
                      size="sm"
                      loading={isSubmitting}
                      disabled={!newComment.trim()}
                    >
                      Reply
                    </GlassButton>
                  </div>
                </motion.form>
              )}

              {/* Nested Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-3">
                  {comment.replies.map((reply) => (
                    <CommentItem key={reply.id} comment={reply} level={level + 1} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </GlassCard>
      </motion.div>
    );
  };

  return (
    <div className="mt-4">
      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="glass-input w-full px-3 py-2 text-sm"
            />
            {newComment && (
              <div className="flex justify-end mt-2">
                <GlassButton
                  type="submit"
                  size="sm"
                  loading={isSubmitting}
                  disabled={!newComment.trim()}
                >
                  Comment
                </GlassButton>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-2">
        <AnimatePresence>
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </AnimatePresence>
      </div>

      {comments.length === 0 && (
        <div className="text-center py-8 text-text-secondary">
          <p className="text-sm">No comments yet. Be the first to comment!</p>
        </div>
      )}
    </div>
  );
}
