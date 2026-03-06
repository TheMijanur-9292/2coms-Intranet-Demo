'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Settings, Check } from 'lucide-react';
import { useRole, RoleMode } from '@/contexts/RoleContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';

export function RoleSwitcher() {
  const { roleMode, canSwitch, switchToEmployee, switchToAdmin, isAdminMode } = useRole();
  const [isOpen, setIsOpen] = useState(false);

  if (!canSwitch) return null;

  const modes: { id: RoleMode; label: string; icon: typeof User; description: string }[] = [
    {
      id: 'employee',
      label: 'Employee Experience',
      icon: User,
      description: 'Standard user interface',
    },
    {
      id: 'admin',
      label: 'Admin Controls',
      icon: Settings,
      description: 'Administrative tools and moderation',
    },
  ];

  const currentModeData = modes.find((m) => m.id === roleMode);
  const CurrentIcon = currentModeData?.icon || User;

  const handleModeChange = (mode: RoleMode) => {
    if (mode === 'admin') switchToAdmin();
    else switchToEmployee();
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
          'glass-card hover:scale-105',
          isAdminMode && 'ring-2 ring-orange-500/50 bg-orange-500/10'
        )}
        aria-label="Switch role mode"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <CurrentIcon className="w-4 h-4" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentModeData?.label}
        </span>
        {isAdminMode && (
          <span className="px-2 py-0.5 text-xs font-bold bg-orange-500/20 text-orange-500 rounded">
            ADMIN
          </span>
        )}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 z-50 min-w-[240px]"
            >
              <GlassCard className="p-2" fringe>
                <div className="space-y-1">
                  {modes.map((mode) => {
                    const Icon = mode.icon;
                    const isActive = roleMode === mode.id;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => handleModeChange(mode.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
                          'transition-all duration-200 text-left',
                          isActive
                            ? 'bg-primary/20 text-primary font-semibold'
                            : 'hover:bg-[rgba(255,255,255,0.1)] text-text-primary'
                        )}
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{mode.label}</div>
                          <div className="text-xs text-text-secondary">{mode.description}</div>
                        </div>
                        {isActive && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                <div className="my-2 h-px bg-[var(--glass-border)]" />
                <div className="px-3 py-2 text-xs text-text-secondary">
                  Switch between views without logging out
                </div>
              </GlassCard>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
