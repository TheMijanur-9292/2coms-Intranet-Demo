'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { RoleSwitcher } from '@/components/admin/RoleSwitcher';
import { ThemeSwitcher } from '@/components/layout/ThemeSwitcher';
import { Search, Bell, Menu } from 'lucide-react';
import { GlassButton } from '@/components/ui/GlassButton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-header border-b border-[var(--glass-border)]">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-xl font-bold text-gradient"
            >
              Intranet
            </button>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/activity-wall')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Activity Wall
              </button>
              <button
                onClick={() => router.push('/announcements')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Announcements
              </button>
            </nav>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors">
              <Search className="w-5 h-5 text-text-secondary" />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors relative">
              <Bell className="w-5 h-5 text-text-secondary" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Role Switcher */}
            {user && (user.role === 'hr' || user.role === 'admin') && (
              <RoleSwitcher />
            )}

            {/* User Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.firstName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline text-sm font-medium">
                    {user.displayName || user.firstName}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 top-full mt-2 glass-card p-2 min-w-[200px]">
                    <div className="px-3 py-2 border-b border-[var(--glass-border)] mb-2">
                      <p className="font-semibold text-sm">{user.displayName}</p>
                      <p className="text-xs text-text-secondary">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[rgba(255,255,255,0.1)] rounded"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        router.push('/settings');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[rgba(255,255,255,0.1)] rounded"
                    >
                      Settings
                    </button>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-[rgba(255,255,255,0.1)] rounded text-red-500"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu */}
            <button className="md:hidden p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)]">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
