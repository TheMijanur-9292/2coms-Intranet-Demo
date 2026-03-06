'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';

export type RoleMode = 'employee' | 'admin';
export type UserRole = 'employee' | 'manager' | 'hr' | 'admin';

interface RoleContextValue {
  roleMode: RoleMode;
  userRole: UserRole;
  canSwitch: boolean;
  isAdminMode: boolean;
  switchToEmployee: () => void;
  switchToAdmin: () => void;
  toggleMode: () => void;
}

const RoleContext = createContext<RoleContextValue | null>(null);

const ROLE_MODE_KEY = 'intranet_role_mode';

export function RoleProvider({
  children,
  userRole,
}: {
  children: ReactNode;
  userRole: UserRole;
}) {
  const canSwitch = userRole === 'hr' || userRole === 'admin';

  const [roleMode, setRoleMode] = useState<RoleMode>(() => {
    if (typeof window === 'undefined') return 'employee';
    const saved = localStorage.getItem(ROLE_MODE_KEY) as RoleMode | null;
    return saved && canSwitch ? saved : 'employee';
  });

  // Persist mode changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(ROLE_MODE_KEY, roleMode);
    }
  }, [roleMode]);

  // Reset to employee mode if role no longer allows admin
  useEffect(() => {
    if (!canSwitch && roleMode === 'admin') setRoleMode('employee');
  }, [canSwitch, roleMode]);

  const switchToEmployee = useCallback(() => setRoleMode('employee'), []);
  const switchToAdmin = useCallback(() => {
    if (canSwitch) setRoleMode('admin');
  }, [canSwitch]);
  const toggleMode = useCallback(() => {
    if (!canSwitch) return;
    setRoleMode((prev) => (prev === 'employee' ? 'admin' : 'employee'));
  }, [canSwitch]);

  return (
    <RoleContext.Provider
      value={{
        roleMode,
        userRole,
        canSwitch,
        isAdminMode: roleMode === 'admin',
        switchToEmployee,
        switchToAdmin,
        toggleMode,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole(): RoleContextValue {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error('useRole must be used inside <RoleProvider>');
  return ctx;
}
