'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'flat';
  border?: 'none' | 'subtle' | 'prominent';
  hover?: boolean;
  onClick?: () => void;
  fringe?: boolean;
  bevel?: boolean;
}

export function GlassCard({
  children,
  className,
  variant = 'default',
  border = 'subtle',
  hover = false,
  onClick,
  fringe = false,
  bevel = false,
}: GlassCardProps) {
  const baseClasses = 'glass-card rounded-xl p-6';
  
  const variantClasses = {
    default: 'bg-[var(--glass-bg)]',
    elevated: 'bg-[var(--glass-bg)] shadow-elevated',
    flat: 'bg-[var(--glass-bg)] shadow-none',
  };

  const borderClasses = {
    none: 'border-none',
    subtle: 'border border-[var(--glass-border)]',
    prominent: 'border-2 border-[var(--glass-border)]',
  };

  const Component = hover || onClick ? motion.div : 'div';
  const motionProps = hover || onClick ? {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  } : {};

  return (
    <Component
      className={cn(
        baseClasses,
        variantClasses[variant],
        borderClasses[border],
        fringe && 'fringe-top',
        bevel && 'bevel',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}
