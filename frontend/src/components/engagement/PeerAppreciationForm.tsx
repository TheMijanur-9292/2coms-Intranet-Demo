'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trophy, Users, Lightbulb, Heart, Award } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlassButton } from '@/components/ui/GlassButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

interface User {
  id: string;
  name: string;
  avatar?: string;
  designation: string;
  department: string;
}

interface PeerAppreciationFormProps {
  users: User[];
  onSubmit: (data: {
    recipientId: string;
    category: string;
    message: string;
    media?: File[];
  }) => Promise<void>;
  onCancel?: () => void;
}

const categories = [
  { id: 'teamwork', label: 'Teamwork', icon: Users, color: 'text-blue-500' },
  { id: 'innovation', label: 'Innovation', icon: Lightbulb, color: 'text-purple-500' },
  { id: 'support', label: 'Support', icon: Heart, color: 'text-red-500' },
  { id: 'excellence', label: 'Excellence', icon: Award, color: 'text-yellow-500' },
  { id: 'leadership', label: 'Leadership', icon: Trophy, color: 'text-green-500' },
];

export function PeerAppreciationForm({
  users,
  onSubmit,
  onCancel,
}: PeerAppreciationFormProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserList, setShowUserList] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !selectedCategory || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        recipientId: selectedUser.id,
        category: selectedCategory,
        message: message.trim(),
      });
      // Reset form
      setSelectedUser(null);
      setSelectedCategory('');
      setMessage('');
      setSearchQuery('');
    } catch (error) {
      console.error('Error submitting appreciation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GlassCard className="p-6" fringe>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gradient mb-2">
          Appreciate a Colleague
        </h2>
        <p className="text-text-secondary">
          Recognize someone who made a difference
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Colleague */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Who would you like to appreciate?
          </label>
          <div className="relative">
            <div className="flex items-center gap-2 glass-input px-3 py-2">
              <Search className="w-5 h-5 text-text-secondary" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowUserList(true);
                }}
                onFocus={() => setShowUserList(true)}
                placeholder="Search by name or department..."
                className="flex-1 bg-transparent outline-none"
              />
            </div>

            {showUserList && filteredUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute z-10 w-full mt-2 glass-card max-h-60 overflow-y-auto glass-scrollbar"
              >
                {filteredUsers.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => {
                      setSelectedUser(user);
                      setShowUserList(false);
                      setSearchQuery(user.name);
                    }}
                    className="w-full flex items-center gap-3 p-3 hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-text-primary">{user.name}</p>
                      <p className="text-xs text-text-secondary">
                        {user.designation} • {user.department}
                      </p>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {selectedUser && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-3 p-3 glass-card flex items-center gap-3"
            >
              <Avatar>
                <AvatarImage src={selectedUser.avatar} />
                <AvatarFallback>
                  {selectedUser.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-text-primary">{selectedUser.name}</p>
                <p className="text-xs text-text-secondary">
                  {selectedUser.designation} • {selectedUser.department}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium mb-3">
            What are you appreciating them for?
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;

              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all',
                    isSelected
                      ? 'border-primary bg-primary/20'
                      : 'border-[var(--glass-border)] hover:border-primary/50'
                  )}
                >
                  <Icon className={cn('w-6 h-6 mb-2', category.color)} />
                  <p className="text-sm font-medium">{category.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Your appreciation message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Share why you appreciate this colleague..."
            className="glass-input w-full min-h-[120px] resize-none"
            maxLength={1000}
            required
          />
          <div className="flex justify-end mt-1">
            <span className="text-xs text-text-secondary">
              {message.length} / 1000
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--glass-border)]">
          {onCancel && (
            <GlassButton type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </GlassButton>
          )}
          <GlassButton
            type="submit"
            variant="primary"
            loading={isSubmitting}
            disabled={!selectedUser || !selectedCategory || !message.trim()}
          >
            Submit Appreciation
          </GlassButton>
        </div>
      </form>
    </GlassCard>
  );
}
