'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useRole } from '@/contexts/RoleContext';
import {
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Trophy,
  UserPlus,
  Calendar,
  BookOpen,
  Image as ImageIcon,
  MessageCircle,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Announcements', icon: Megaphone, path: '/announcements' },
  { label: 'Activity Wall', icon: MessageSquare, path: '/activity-wall' },
  { label: 'Recognition', icon: Trophy, path: '/recognition' },
  { label: 'New Joinees', icon: UserPlus, path: '/new-joinees' },
  { label: 'Calendar', icon: Calendar, path: '/calendar' },
  { label: 'Knowledge Hub', icon: BookOpen, path: '/knowledge-hub' },
  { label: 'Gallery', icon: ImageIcon, path: '/gallery' },
  { label: 'Forums', icon: MessageCircle, path: '/forums' },
  { label: 'Directory', icon: Users, path: '/directory' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { isAdminMode } = useRole();

  if (isAdminMode) {
    // Admin sidebar is handled by AdminSidebar component
    return null;
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 glass-card border-r border-[var(--glass-border)] p-4">
      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');

          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                'hover:bg-[rgba(255,255,255,0.1)]',
                isActive && 'bg-primary/20 text-primary font-semibold',
                !isActive && 'text-text-primary'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-500 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
