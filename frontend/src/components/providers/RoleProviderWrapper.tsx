'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { RoleProvider, UserRole } from '@/contexts/RoleContext';

export function RoleProviderWrapper({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userRole: UserRole = (user?.role as UserRole) || 'employee';

  return <RoleProvider userRole={userRole}>{children}</RoleProvider>;
}
