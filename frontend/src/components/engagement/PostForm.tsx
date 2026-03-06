'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Image, Video, Smile, AtSign, Send } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface PostFormProps {
  user: {
    name: string;
    avatar?: string;
  };
  onSubmit: (data: {
    content: string;
    media?: File[];
    tags?: string[];
    mentions?: string[];
  }) => Promise<void>;
  onCancel?: () => void;
  placeholder?: string;
}

export function PostForm({
  user,
  onSubmit,
  onCancel,
  placeholder = "What's on your mind?",
}: PostFormProps) {
  const [content, setContent] = useState('');
  const [media, setMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const newMedia = [...media, ...files].slice(0, 5); // Max 5 files
    setMedia(newMedia);

    // Create previews
    const previews = newMedia.map((file) => URL.createObjectURL(file));
    setMediaPreviews(previews);
  };

  const removeMedia = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    const newPreviews = mediaPreviews.filter((_, i) => i !== index);
    setMedia(newMedia);
    setMediaPreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        content: content.trim(),
        media: media.length > 0 ? media : undefined,
      });
      // Reset form
      setContent('');
      setMedia([]);
      setMediaPreviews([]);
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Submit on Cmd/Ctrl + Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <GlassCard className="p-4 mb-4" fringe>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar>
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-text-primary">{user.name}</p>
            <p className="text-xs text-text-secondary">Create a post</p>
          </div>
        </div>

        {/* Text Input */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'glass-input w-full min-h-[120px] resize-none mb-4',
            'focus:outline-none focus:ring-2 focus:ring-primary'
          )}
          maxLength={5000}
        />

        {/* Character Count */}
        <div className="flex justify-end mb-4">
          <span className={cn(
            'text-xs',
            content.length > 4500 ? 'text-red-500' : 'text-text-secondary'
          )}>
            {content.length} / 5000
          </span>
        </div>

        {/* Media Previews */}
        <AnimatePresence>
          {mediaPreviews.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4"
            >
              {mediaPreviews.map((preview, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="relative group"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeMedia(index)}
                    className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
          <div className="flex items-center gap-2">
            {/* Media Upload */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaSelect}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              title="Add media"
            >
              <Image className="w-5 h-5 text-text-secondary" />
            </button>

            {/* Video Upload */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              title="Add video"
            >
              <Video className="w-5 h-5 text-text-secondary" />
            </button>

            {/* Emoji Picker */}
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              title="Add emoji"
            >
              <Smile className="w-5 h-5 text-text-secondary" />
            </button>

            {/* Mentions */}
            <button
              type="button"
              onClick={() => setShowMentions(!showMentions)}
              className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
              title="Mention someone"
            >
              <AtSign className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onCancel && (
              <GlassButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </GlassButton>
            )}
            <GlassButton
              type="submit"
              variant="primary"
              size="sm"
              loading={isSubmitting}
              disabled={!content.trim() && media.length === 0}
            >
              <Send className="w-4 h-4 mr-2" />
              Post
            </GlassButton>
          </div>
        </div>
      </form>
    </GlassCard>
  );
}
