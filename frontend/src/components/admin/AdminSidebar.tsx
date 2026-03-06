'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Megaphone,
  FileText,
  Shield,
  Users,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Image as ImageIcon,
} from 'lucide-react';
import { useRole } from '@/contexts/RoleContext';
import { GlassCard } from '@/components/ui/GlassCard';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface AdminModule {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
  children?: AdminModule[];
}

const adminModules: AdminModule[] = [
  {
    id: 'dashboard',
    label: 'Moderation Dashboard',
    icon: LayoutDashboard,
    path: '/admin/dashboard',
  },
  {
    id: 'content',
    label: 'Content Management',
    icon: FileText,
    path: '/admin/content',
    children: [
      {
        id: 'announcements',
        label: 'Announcements',
        icon: Megaphone,
        path: '/admin/announcements',
        badge: 3,
      },
      {
        id: 'documents',
        label: 'Documents',
        icon: FileText,
        path: '/admin/documents',
      },
      {
        id: 'gallery',
        label: 'Media Gallery',
        icon: ImageIcon,
        path: '/admin/gallery',
      },
    ],
  },
  {
    id: 'moderation',
    label: 'Moderation',
    icon: Shield,
    path: '/admin/moderation',
    badge: 12,
    children: [
      {
        id: 'posts',
        label: 'Activity Wall',
        icon: FileText,
        path: '/admin/moderation/posts',
        badge: 8,
      },
      {
        id: 'recognition',
        label: 'Recognition Posts',
        icon: FileText,
        path: '/admin/moderation/recognition',
        badge: 4,
      },
      {
        id: 'reports',
        label: 'Reports',
        icon: AlertCircle,
        path: '/admin/moderation/reports',
      },
    ],
  },
  {
    id: 'users',
    label: 'User Management',
    icon: Users,
    path: '/admin/users',
    children: [
      {
        id: 'new-joinees',
        label: 'New Joinees',
        icon: Users,
        path: '/admin/users/new-joinees',
      },
      {
        id: 'directory',
        label: 'Employee Directory',
        icon: Users,
        path: '/admin/users/directory',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/admin/analytics',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/admin/settings',
  },
];

export function AdminSidebar() {
  const { isAdminMode } = useRole();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedModules, setExpandedModules] = useState<string[]>(['content', 'moderation', 'users']);
  const pathname = usePathname();

  if (!isAdminMode) return null;

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  const renderModule = (module: AdminModule, level: number = 0) => {
    const Icon = module.icon;
    const hasChildren = module.children && module.children.length > 0;
    const isExpanded = expandedModules.includes(module.id);
    const active = isActive(module.path);

    return (
      <div key={module.id}>
        <Link
          href={module.path}
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              toggleModule(module.id);
            }
          }}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-200',
            'hover:bg-[rgba(255,255,255,0.1)]',
            active && 'bg-primary/20 text-primary font-semibold',
            !active && 'text-text-primary',
            level > 0 && 'pl-6'
          )}
        >
          <Icon className={cn('w-5 h-5 flex-shrink-0', isCollapsed && 'mx-auto')} />
          {!isCollapsed && (
            <>
              <span className="flex-1 text-sm">{module.label}</span>
              {module.badge && (
                <span className="px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-500 rounded-full">
                  {module.badge}
                </span>
              )}
              {hasChildren && (
                <motion.div
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.div>
              )}
            </>
          )}
        </Link>

        {/* Children */}
        {hasChildren && !isCollapsed && (
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-4 pl-4 border-l border-[var(--glass-border)]">
                  {module.children!.map((child) => renderModule(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    );
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed left-0 top-0 h-full z-30 transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      <GlassCard
        className={cn(
          'h-full rounded-none border-r border-[var(--glass-border)]',
          'flex flex-col p-4'
        )}
        fringe
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-bold text-text-primary">Admin Panel</h2>
              <p className="text-xs text-text-secondary">HR Controls</p>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto glass-scrollbar">
          <div className="space-y-1">
            {adminModules.map((module) => renderModule(module))}
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="mt-4 pt-4 border-t border-[var(--glass-border)]">
            <div className="text-xs text-text-secondary">
              <div className="font-semibold mb-1">Admin Mode Active</div>
              <div>You're viewing admin controls</div>
            </div>
          </div>
        )}
      </GlassCard>
    </motion.aside>
  );
}
