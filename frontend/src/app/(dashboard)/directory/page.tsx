'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Mail, Phone, MapPin,
  Briefcase, X, ChevronDown, Building2, Star,
  MessageCircle, UserCheck,
} from 'lucide-react';

type Employee = {
  id: string;
  name: string;
  firstName: string;
  designation: string;
  department: string;
  location: string;
  email: string;
  phone: string;
  avatar: string;
  avatarColor: string;
  skills: string[];
  reportsTo?: string;
  isOnline: boolean;
  bio: string;
};

const employees: Employee[] = [
  { id: '1', name: 'Priya Nair', firstName: 'Priya', designation: 'Senior Designer', department: 'Design', location: 'Bangalore', email: 'priya.nair@2coms.com', phone: '+91 98765 43210', avatar: 'P', avatarColor: 'from-pink-500/40 to-rose-500/40', skills: ['Figma', 'UI/UX', 'Branding', 'Prototyping'], reportsTo: 'Design Lead', isOnline: true, bio: 'Passionate about user-centred design. 5 years of experience crafting intuitive digital experiences.' },
  { id: '2', name: 'Vikram Singh', firstName: 'Vikram', designation: 'Sales Lead', department: 'Sales', location: 'Mumbai', email: 'vikram.singh@2coms.com', phone: '+91 98765 12345', avatar: 'V', avatarColor: 'from-blue-500/40 to-cyan-500/40', skills: ['B2B Sales', 'CRM', 'Negotiation', 'Enterprise'], reportsTo: 'VP Sales', isOnline: false, bio: 'Results-driven sales professional with a knack for building lasting client relationships.' },
  { id: '3', name: 'Amit Kumar', firstName: 'Amit', designation: 'Engineering Lead', department: 'Engineering', location: 'Bangalore', email: 'amit.kumar@2coms.com', phone: '+91 87654 32109', avatar: 'A', avatarColor: 'from-purple-500/40 to-violet-500/40', skills: ['Node.js', 'React', 'MongoDB', 'AWS', 'TypeScript'], reportsTo: 'VP Engineering', isOnline: true, bio: 'Full-stack engineer and team lead. Loves solving complex problems with clean, scalable code.' },
  { id: '4', name: 'Sneha Patel', firstName: 'Sneha', designation: 'HR Executive', department: 'Human Resources', location: 'Hyderabad', email: 'sneha.patel@2coms.com', phone: '+91 76543 21098', avatar: 'S', avatarColor: 'from-orange-500/40 to-yellow-500/40', skills: ['Recruitment', 'Onboarding', 'Employee Engagement', 'L&D'], reportsTo: 'HR Manager', isOnline: true, bio: 'HR professional passionate about building great workplaces and nurturing talent.' },
  { id: '5', name: 'Kiran Joshi', firstName: 'Kiran', designation: 'Product Manager', department: 'Product', location: 'Mumbai', email: 'kiran.joshi@2coms.com', phone: '+91 65432 10987', avatar: 'K', avatarColor: 'from-green-500/40 to-teal-500/40', skills: ['Product Strategy', 'Agile', 'Analytics', 'Roadmapping'], reportsTo: 'VP Product', isOnline: false, bio: 'PM with 6 years of experience driving product-led growth in B2B SaaS.' },
  { id: '6', name: 'Deepika Rao', firstName: 'Deepika', designation: 'HR Manager', department: 'Human Resources', location: 'Bangalore', email: 'deepika.rao@2coms.com', phone: '+91 54321 09876', avatar: 'D', avatarColor: 'from-indigo-500/40 to-blue-500/40', skills: ['HR Strategy', 'Policy', 'Compliance', 'Performance Management'], reportsTo: 'CHRO', isOnline: true, bio: 'Strategic HR leader focused on creating empowered, inclusive workplace cultures.' },
  { id: '7', name: 'Rahul Sharma', firstName: 'Rahul', designation: 'Product Manager', department: 'Product', location: 'Pune', email: 'rahul.sharma@2coms.com', phone: '+91 43210 98765', avatar: 'R', avatarColor: 'from-cyan-500/40 to-sky-500/40', skills: ['Product Design', 'User Research', 'Scrum', 'Data Analysis'], reportsTo: 'VP Product', isOnline: false, bio: 'I connect user insights with business goals to build products people love.' },
  { id: '8', name: 'Arjun Mehta', firstName: 'Arjun', designation: 'Software Engineer', department: 'Engineering', location: 'Bangalore', email: 'arjun.mehta@2coms.com', phone: '+91 32109 87654', avatar: 'Ar', avatarColor: 'from-rose-500/40 to-pink-500/40', skills: ['React', 'TypeScript', 'Python', 'Docker'], reportsTo: 'Engineering Lead', isOnline: true, bio: 'Software engineer who loves crafting elegant solutions to complex technical challenges.' },
  { id: '9', name: 'Meera Singh', firstName: 'Meera', designation: 'UX Designer', department: 'Design', location: 'Pune', email: 'meera.singh@2coms.com', phone: '+91 21098 76543', avatar: 'M', avatarColor: 'from-yellow-500/40 to-orange-500/40', skills: ['UX Research', 'Wireframing', 'Accessibility', 'Design Systems'], reportsTo: 'Design Lead', isOnline: false, bio: 'User advocate and accessibility champion. I design for all humans, not just some.' },
  { id: '10', name: 'Rohit Verma', firstName: 'Rohit', designation: 'Data Analyst', department: 'Analytics', location: 'Chennai', email: 'rohit.verma@2coms.com', phone: '+91 10987 65432', avatar: 'Ro', avatarColor: 'from-emerald-500/40 to-green-500/40', skills: ['SQL', 'Python', 'Tableau', 'Power BI', 'Statistics'], reportsTo: 'Analytics Lead', isOnline: true, bio: 'Data storyteller who believes every business question has an answer hidden in the data.' },
];

const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department))).sort()];
const locations = ['All', ...Array.from(new Set(employees.map((e) => e.location))).sort()];

export default function DirectoryPage() {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [locationFilter, setLocationFilter] = useState('All');
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = employees.filter((e) => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.designation.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.skills.some((s) => s.toLowerCase().includes(search.toLowerCase()));
    const matchDept = deptFilter === 'All' || e.department === deptFilter;
    const matchLocation = locationFilter === 'All' || e.location === locationFilter;
    const matchOnline = !onlineOnly || e.isOnline;
    return matchSearch && matchDept && matchLocation && matchOnline;
  });

  const EmployeeCard = ({ emp }: { emp: Employee }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden hover:border-primary/30 transition-all cursor-pointer group"
      onClick={() => setSelectedEmployee(emp)}
    >
      {/* Header gradient */}
      <div className={`h-16 bg-gradient-to-br ${emp.avatarColor}`} />

      <div className="px-4 pb-4 -mt-8">
        {/* Avatar */}
        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${emp.avatarColor} border-2 border-[var(--glass-bg)] flex items-center justify-center text-xl font-bold text-white shadow-lg mb-3 relative`}>
          {emp.avatar}
          {emp.isOnline && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[var(--glass-bg)]" />
          )}
        </div>

        <h3 className="font-bold text-text-primary text-sm group-hover:text-primary transition-colors">{emp.name}</h3>
        <p className="text-xs text-text-secondary">{emp.designation}</p>

        <div className="flex items-center gap-1.5 mt-2 text-xs text-text-secondary">
          <Building2 className="w-3 h-3" /> {emp.department}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-xs text-text-secondary">
          <MapPin className="w-3 h-3" /> {emp.location}
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mt-3">
          {emp.skills.slice(0, 3).map((skill) => (
            <span key={skill} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">{skill}</span>
          ))}
          {emp.skills.length > 3 && <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">+{emp.skills.length - 3}</span>}
        </div>

        {/* Contact buttons */}
        <div className="flex gap-2 mt-3">
          <a href={`mailto:${emp.email}`} onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs border border-[var(--glass-border)] text-text-secondary hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
            <Mail className="w-3.5 h-3.5" /> Email
          </a>
          <a href={`tel:${emp.phone}`} onClick={(e) => e.stopPropagation()} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs border border-[var(--glass-border)] text-text-secondary hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors">
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
        </div>
      </div>
    </motion.div>
  );

  const EmployeeRow = ({ emp }: { emp: Employee }) => (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-4 p-4 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md hover:border-primary/30 transition-all cursor-pointer group"
      onClick={() => setSelectedEmployee(emp)}
    >
      <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${emp.avatarColor} flex items-center justify-center font-bold text-white flex-shrink-0 relative`}>
        {emp.avatar}
        {emp.isOnline && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-green-500 border-2 border-[var(--glass-bg)]" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">{emp.name}</p>
        <p className="text-xs text-text-secondary">{emp.designation}</p>
      </div>
      <div className="hidden md:block text-xs text-text-secondary w-36">{emp.department}</div>
      <div className="hidden md:flex items-center gap-1 text-xs text-text-secondary w-28">
        <MapPin className="w-3 h-3" /> {emp.location}
      </div>
      <div className="flex gap-2">
        <a href={`mailto:${emp.email}`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"><Mail className="w-4 h-4" /></a>
        <a href={`tel:${emp.phone}`} onClick={(e) => e.stopPropagation()} className="p-1.5 rounded-lg text-text-secondary hover:text-primary hover:bg-primary/10 transition-colors"><Phone className="w-4 h-4" /></a>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" /> Employee Directory
          </h1>
          <p className="text-text-secondary mt-1">Find and connect with colleagues across 2COMS</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-text-secondary bg-[var(--glass-bg)] border border-[var(--glass-border)] px-3 py-1.5 rounded-lg">
          <UserCheck className="w-4 h-4 text-green-400" />
          {employees.filter((e) => e.isOnline).length} online now
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            placeholder="Search by name, role, skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="px-3 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none"
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
        >
          {departments.map((d) => <option key={d}>{d}</option>)}
        </select>
        <select
          className="px-3 py-2.5 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none"
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
        >
          {locations.map((l) => <option key={l}>{l}</option>)}
        </select>
        <button
          onClick={() => setOnlineOnly(!onlineOnly)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-colors ${onlineOnly ? 'border-green-500/40 bg-green-500/10 text-green-400' : 'border-[var(--glass-border)] text-text-secondary hover:border-green-500/30'}`}
        >
          <span className={`w-2 h-2 rounded-full ${onlineOnly ? 'bg-green-400' : 'bg-gray-500'}`} />
          Online Only
        </button>
        <div className="flex items-center gap-1 p-1 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)]">
          {(['grid', 'list'] as const).map((v) => (
            <button key={v} onClick={() => setViewMode(v)} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${viewMode === v ? 'bg-primary/20 text-primary' : 'text-text-secondary'}`}>
              {v === 'grid' ? '⊞' : '≡'}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="text-xs text-text-secondary">Showing {filtered.length} of {employees.length} employees</p>

      {/* Results */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((emp, i) => (
            <motion.div key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
              <EmployeeCard emp={emp} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((emp, i) => (
            <motion.div key={emp.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
              <EmployeeRow emp={emp} />
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-text-secondary">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No employees found</p>
          <p className="text-sm mt-1">Try a different search or filter</p>
        </div>
      )}

      {/* Employee detail modal */}
      <AnimatePresence>
        {selectedEmployee && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedEmployee(null)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 20 }}
              className="max-w-md w-full rounded-2xl border border-[var(--glass-border)] bg-[rgba(15,23,42,0.95)] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Banner */}
              <div className={`h-24 bg-gradient-to-br ${selectedEmployee.avatarColor} relative`}>
                <button
                  onClick={() => setSelectedEmployee(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-6 pb-6 -mt-10">
                <div className="flex items-end gap-4 mb-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedEmployee.avatarColor} flex items-center justify-center text-2xl font-bold text-white shadow-lg border-2 border-[rgba(15,23,42,0.9)] relative`}>
                    {selectedEmployee.avatar}
                    {selectedEmployee.isOnline && (
                      <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-[rgba(15,23,42,0.9)] flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-text-primary">{selectedEmployee.name}</h2>
                    <p className="text-sm text-text-secondary">{selectedEmployee.designation}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Building2 className="w-4 h-4" /> {selectedEmployee.department}
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MapPin className="w-4 h-4" /> {selectedEmployee.location}
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Briefcase className="w-4 h-4" /> Reports to {selectedEmployee.reportsTo}
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Mail className="w-4 h-4" /> {selectedEmployee.email}
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Phone className="w-4 h-4" /> {selectedEmployee.phone}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-sm text-text-primary leading-relaxed bg-[rgba(255,255,255,0.05)] rounded-lg p-3 mb-4 italic">
                  &ldquo;{selectedEmployee.bio}&rdquo;
                </p>

                {/* Skills */}
                <div className="mb-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedEmployee.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a href={`mailto:${selectedEmployee.email}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 transition-colors font-medium text-sm">
                    <Mail className="w-4 h-4" /> Send Email
                  </a>
                  <a href={`tel:${selectedEmployee.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[var(--glass-border)] text-text-secondary hover:bg-[rgba(255,255,255,0.08)] transition-colors text-sm">
                    <Phone className="w-4 h-4" /> Call
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
