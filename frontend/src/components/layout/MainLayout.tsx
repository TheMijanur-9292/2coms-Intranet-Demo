'use client';

import { useRole } from '@/contexts/RoleContext';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isAdminMode } = useRole();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar - fixed left */}
      {isAdminMode ? <AdminSidebar /> : <Sidebar />}

      {/* Content area: Header + main, to the right of sidebar */}
      <div className="flex-1 ml-64 flex flex-col min-w-0">
        <Header />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
