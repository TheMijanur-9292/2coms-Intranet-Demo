'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, ChevronLeft, ChevronRight, Clock, MapPin,
  Users, Tag, Bell, Plus, ExternalLink,
} from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const eventColors: Record<string, { bg: string; text: string; dot: string }> = {
  holiday: { bg: 'bg-green-500/20', text: 'text-green-400', dot: 'bg-green-500' },
  meeting: { bg: 'bg-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-500' },
  training: { bg: 'bg-purple-500/20', text: 'text-purple-400', dot: 'bg-purple-500' },
  celebration: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-500' },
  deadline: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-500' },
  social: { bg: 'bg-pink-500/20', text: 'text-pink-400', dot: 'bg-pink-500' },
};

const allEvents = [
  { id: '1', title: 'Holi Celebration', date: '2026-03-14', type: 'holiday', time: 'All Day', location: 'Office Campus', description: 'Company-wide Holi celebration with colours, food, and fun activities for all employees.', attendees: 245, isRegistered: false },
  { id: '2', title: 'Q1 All-Hands Town Hall', date: '2026-03-20', type: 'meeting', time: '4:00 PM – 6:00 PM', location: 'Main Auditorium + Virtual', description: 'Leadership will share Q1 results, business updates, and plans for Q2. All employees are encouraged to attend.', attendees: 312, isRegistered: true },
  { id: '3', title: 'React.js Workshop', date: '2026-03-22', type: 'training', time: '10:00 AM – 1:00 PM', location: 'Training Room A', description: 'Hands-on workshop on React 19 features. Suitable for frontend developers and UI designers.', attendees: 28, isRegistered: false },
  { id: '4', title: 'Annual Awards Ceremony', date: '2026-03-28', type: 'celebration', time: '6:00 PM – 9:00 PM', location: 'Grand Ballroom, Hotel Taj', description: 'Celebrating excellence! Annual awards for top performers, best teams, and innovation champions.', attendees: 180, isRegistered: true },
  { id: '5', title: 'Project Atlas Deadline', date: '2026-03-31', type: 'deadline', time: '11:59 PM', location: 'Remote', description: 'Final submission deadline for Project Atlas deliverables. Coordinate with your team leads.', attendees: 34, isRegistered: true },
  { id: '6', title: 'Team Outing – Lonavala', date: '2026-04-05', type: 'social', time: '7:00 AM – 8:00 PM', location: 'Lonavala, Maharashtra', description: 'Annual team outing! A full-day trip to Lonavala with team activities, adventure sports, and dinner.', attendees: 90, isRegistered: false },
  { id: '7', title: 'Leadership Development Program', date: '2026-04-10', type: 'training', time: '9:00 AM – 5:00 PM', location: 'Conference Hall B', description: '2-day leadership skills program for senior employees and managers.', attendees: 40, isRegistered: false },
  { id: '8', title: 'Good Friday', date: '2026-04-03', type: 'holiday', time: 'All Day', location: 'N/A', description: 'National public holiday.', attendees: 0, isRegistered: false },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events, setEvents] = useState(allEvents);
  const [activeView, setActiveView] = useState<'month' | 'list'>('month');

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const getDateStr = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const getEventsForDate = (dateStr: string) => events.filter((e) => e.date === dateStr);

  const handleRegister = (id: string) => {
    setEvents((prev) => prev.map((e) =>
      e.id === id ? { ...e, isRegistered: !e.isRegistered, attendees: e.isRegistered ? e.attendees - 1 : e.attendees + 1 } : e
    ));
  };

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Upcoming events sorted
  const upcomingEvents = [...events]
    .filter((e) => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 6);

  const EventBadge = ({ type }: { type: string }) => {
    const c = eventColors[type] || eventColors.meeting;
    return <span className={`inline-block w-2 h-2 rounded-full ${c.dot} flex-shrink-0`} />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Calendar className="w-6 h-6 text-primary" /> Engagement Calendar
          </h1>
          <p className="text-text-secondary mt-1">Company events, holidays, and important dates</p>
        </div>
        <div className="flex items-center gap-2">
          {(['month', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                activeView === v ? 'bg-primary/20 text-primary' : 'text-text-secondary border border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.08)]'
              }`}
            >
              {v === 'month' ? '📅 Month' : '📋 List'}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(eventColors).map(([type, c]) => (
          <span key={type} className="flex items-center gap-1.5 text-xs text-text-secondary capitalize">
            <span className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
            {type}
          </span>
        ))}
      </div>

      {activeView === 'month' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <div className="lg:col-span-2 rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors text-text-primary">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h2 className="font-bold text-text-primary text-lg">{MONTHS[month]} {year}</h2>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors text-text-primary">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAYS.map((d) => (
                <div key={d} className="text-center text-xs font-semibold text-text-secondary py-1">{d}</div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = getDateStr(day);
                const dayEvents = getEventsForDate(dateStr);
                const isToday = dateStr === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                const isSelected = selectedDate === dateStr;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                    className={`relative aspect-square flex flex-col items-center justify-start p-1 rounded-lg transition-all text-sm ${
                      isSelected ? 'bg-primary/20 ring-1 ring-primary' :
                      isToday ? 'bg-primary/10 ring-1 ring-primary/40' :
                      'hover:bg-[rgba(255,255,255,0.08)]'
                    }`}
                  >
                    <span className={`font-medium ${isToday ? 'text-primary' : 'text-text-primary'}`}>{day}</span>
                    {dayEvents.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                        {dayEvents.slice(0, 3).map((e) => (
                          <EventBadge key={e.id} type={e.type} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side panel: selected day events or upcoming */}
          <div className="space-y-4">
            {selectedDate && selectedEvents.length > 0 ? (
              <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
                <div className="space-y-3">
                  {selectedEvents.map((ev) => {
                    const c = eventColors[ev.type] || eventColors.meeting;
                    return (
                      <motion.div
                        key={ev.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-4`}
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                          <div>
                            <p className="font-semibold text-text-primary text-sm">{ev.title}</p>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${c.bg} ${c.text} capitalize`}>{ev.type}</span>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs text-text-secondary ml-4">
                          <p className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</p>
                          <p className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</p>
                          {ev.attendees > 0 && <p className="flex items-center gap-1"><Users className="w-3 h-3" />{ev.attendees} attendees</p>}
                        </div>
                        <p className="text-xs text-text-secondary mt-2 ml-4 leading-relaxed">{ev.description}</p>
                        {ev.type !== 'holiday' && ev.type !== 'deadline' && (
                          <button
                            onClick={() => handleRegister(ev.id)}
                            className={`mt-3 w-full py-1.5 rounded-lg text-xs font-medium transition-colors ${
                              ev.isRegistered ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary hover:bg-primary/30'
                            }`}
                          >
                            {ev.isRegistered ? '✓ Registered' : 'Register'}
                          </button>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-sm font-semibold text-text-secondary mb-3">Upcoming Events</h3>
                <div className="space-y-2">
                  {upcomingEvents.map((ev, i) => {
                    const c = eventColors[ev.type] || eventColors.meeting;
                    return (
                      <motion.button
                        key={ev.id}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.06 }}
                        onClick={() => setSelectedDate(ev.date)}
                        className="w-full text-left flex items-start gap-3 p-3 rounded-lg border border-[var(--glass-border)] bg-[var(--glass-bg)] hover:bg-[rgba(255,255,255,0.08)] transition-colors"
                      >
                        <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{ev.title}</p>
                          <p className="text-xs text-text-secondary mt-0.5">{new Date(ev.date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {ev.time}</p>
                        </div>
                        {ev.isRegistered && <span className="text-xs text-green-400 flex-shrink-0">✓</span>}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* LIST VIEW */}
      {activeView === 'list' && (
        <div className="space-y-4">
          {allEvents
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map((ev, i) => {
              const c = eventColors[ev.type] || eventColors.meeting;
              return (
                <motion.div
                  key={ev.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] backdrop-blur-md p-5 flex gap-5"
                >
                  {/* Date block */}
                  <div className={`w-14 h-14 rounded-xl ${c.bg} flex flex-col items-center justify-center flex-shrink-0`}>
                    <p className={`text-lg font-bold leading-none ${c.text}`}>
                      {new Date(ev.date + 'T00:00:00').getDate()}
                    </p>
                    <p className={`text-xs ${c.text} opacity-80`}>
                      {MONTHS[new Date(ev.date + 'T00:00:00').getMonth()].slice(0, 3)}
                    </p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-text-primary">{ev.title}</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${c.bg} ${c.text} capitalize`}>{ev.type}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-xs text-text-secondary flex-wrap">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</span>
                      {ev.attendees > 0 && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{ev.attendees}</span>}
                    </div>
                    <p className="text-xs text-text-secondary mt-2 leading-relaxed">{ev.description}</p>
                  </div>
                  {ev.type !== 'holiday' && ev.type !== 'deadline' && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => handleRegister(ev.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          ev.isRegistered ? 'bg-green-500/20 text-green-400' : 'bg-primary/20 text-primary hover:bg-primary/30'
                        }`}
                      >
                        {ev.isRegistered ? '✓ Registered' : 'Register'}
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
        </div>
      )}
    </div>
  );
}
