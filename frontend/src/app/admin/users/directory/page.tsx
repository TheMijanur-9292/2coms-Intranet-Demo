'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Mail, Phone, Shield, UserCheck } from 'lucide-react';

const mockEmployees = [
  { id: '1', name: 'Admin User', email: 'admin@2coms.com', role: 'admin', department: 'Management', status: 'active', joinDate: '2025-01-01' },
  { id: '2', name: 'HR Manager', email: 'hr@2coms.com', role: 'hr', department: 'Human Resources', status: 'active', joinDate: '2025-02-15' },
  { id: '3', name: 'John Doe', email: 'employee@2coms.com', role: 'employee', department: 'Engineering', status: 'active', joinDate: '2025-03-20' },
  { id: '4', name: 'Priya Nair', email: 'priya@2coms.com', role: 'employee', department: 'Design', status: 'active', joinDate: '2025-04-01' },
  { id: '5', name: 'Vikram Singh', email: 'vikram@2coms.com', role: 'manager', department: 'Sales', status: 'inactive', joinDate: '2025-05-10' },
];

const roleColors: Record<string, string> = {
  admin: 'bg-red-500/20 text-red-400',
  hr: 'bg-purple-500/20 text-purple-400',
  manager: 'bg-blue-500/20 text-blue-400',
  employee: 'bg-green-500/20 text-green-400',
};

const roleIcons: Record<string, typeof Shield> = {
  admin: Shield,
  hr: UserCheck,
  manager: Users,
  employee: Users,
};

export default function AdminDirectoryPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filtered = mockEmployees.filter((e) => {
    const matchSearch =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || e.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
          <Users className="w-6 h-6 text-primary" /> Employee Directory
        </h1>
        <p className="text-text-secondary mt-1">View and manage all employees across the organization</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Employees', value: mockEmployees.length, color: 'text-primary' },
          { label: 'Active', value: mockEmployees.filter((e) => e.status === 'active').length, color: 'text-green-400' },
          { label: 'Managers', value: mockEmployees.filter((e) => e.role === 'manager').length, color: 'text-blue-400' },
          { label: 'HR/Admin', value: mockEmployees.filter((e) => e.role === 'hr' || e.role === 'admin').length, color: 'text-purple-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-text-secondary mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        {['all', 'admin', 'hr', 'manager', 'employee'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
              roleFilter === r ? 'bg-primary/20 text-primary' : 'text-text-secondary hover:bg-[rgba(255,255,255,0.1)]'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Employee Table */}
      <div className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-[var(--glass-border)]">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Employee</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Department</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Role</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Status</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Joined</th>
              <th className="text-left px-4 py-3 text-sm font-semibold text-text-secondary">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((emp, i) => {
              const RoleIcon = roleIcons[emp.role] || Users;
              return (
                <motion.tr
                  key={emp.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="border-b border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-primary font-bold text-sm">
                        {emp.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary text-sm">{emp.name}</p>
                        <p className="text-xs text-text-secondary flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{emp.department}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full flex items-center gap-1 w-fit ${roleColors[emp.role]}`}>
                      <RoleIcon className="w-3 h-3" /> {emp.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${emp.status === 'active' ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-400'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-secondary">{emp.joinDate}</td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 text-xs bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">
                      Manage
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-10 text-text-secondary">
            <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p>No employees found</p>
          </div>
        )}
      </div>
    </div>
  );
}
