'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Bell, Shield, Globe, Mail, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: '2COMS Intranet',
    siteTagline: 'Connecting People, Driving Growth',
    maintenanceMode: false,
    allowRegistration: false,
    emailNotifications: true,
    pushNotifications: true,
    moderationAutoApprove: false,
    postCooldownMinutes: 5,
    maxPostLength: 2000,
    allowGuestView: false,
  });

  const toggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof settings] }));
  };

  const ToggleSwitch = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-11 h-6 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-gray-600'}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  );

  const sections = [
    {
      title: 'General',
      icon: Globe,
      items: [
        {
          label: 'Site Name',
          description: 'Display name for the intranet platform',
          control: (
            <input
              className="px-3 py-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-48"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          ),
        },
        {
          label: 'Maintenance Mode',
          description: 'Put the platform under maintenance — only admins can access',
          control: <ToggleSwitch value={settings.maintenanceMode} onToggle={() => toggle('maintenanceMode')} />,
        },
        {
          label: 'Allow Self Registration',
          description: 'Allow employees to self-register without admin invite',
          control: <ToggleSwitch value={settings.allowRegistration} onToggle={() => toggle('allowRegistration')} />,
        },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        {
          label: 'Email Notifications',
          description: 'Send email alerts for important events',
          control: <ToggleSwitch value={settings.emailNotifications} onToggle={() => toggle('emailNotifications')} />,
        },
        {
          label: 'Push Notifications',
          description: 'Enable browser push notifications',
          control: <ToggleSwitch value={settings.pushNotifications} onToggle={() => toggle('pushNotifications')} />,
        },
      ],
    },
    {
      title: 'Moderation',
      icon: Shield,
      items: [
        {
          label: 'Auto-Approve Posts',
          description: 'Automatically approve all new posts without manual review',
          control: <ToggleSwitch value={settings.moderationAutoApprove} onToggle={() => toggle('moderationAutoApprove')} />,
        },
        {
          label: 'Post Cooldown (minutes)',
          description: 'Minimum time between posts per user',
          control: (
            <input
              type="number"
              min={0}
              max={60}
              className="px-3 py-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-20"
              value={settings.postCooldownMinutes}
              onChange={(e) => setSettings({ ...settings, postCooldownMinutes: Number(e.target.value) })}
            />
          ),
        },
        {
          label: 'Max Post Length',
          description: 'Maximum characters allowed per post',
          control: (
            <input
              type="number"
              min={100}
              max={10000}
              step={100}
              className="px-3 py-1.5 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-24"
              value={settings.maxPostLength}
              onChange={(e) => setSettings({ ...settings, maxPostLength: Number(e.target.value) })}
            />
          ),
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Settings className="w-6 h-6 text-primary" /> Platform Settings
          </h1>
          <p className="text-text-secondary mt-1">Configure global platform behavior and preferences</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors font-medium">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      {sections.map((section, si) => {
        const SectionIcon = section.icon;
        return (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: si * 0.08 }}
            className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-[var(--glass-border)]">
              <SectionIcon className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-text-primary">{section.title}</h2>
            </div>
            <div className="divide-y divide-[var(--glass-border)]">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between px-5 py-4 gap-4">
                  <div>
                    <p className="font-medium text-text-primary text-sm">{item.label}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{item.description}</p>
                  </div>
                  <div className="flex-shrink-0">{item.control}</div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
