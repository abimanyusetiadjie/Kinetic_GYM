'use client';

import React, { useState } from 'react';
import {
  CalendarCheck,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Sparkles,
  Terminal,
  Database
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AttendanceRecord {
  id: string;
  userName: string;
  phone: string;
  seatLabel: string;
  bookedAt: string;
  status: 'ATTENDED' | 'CONFIRMED' | 'NO_SHOW';
}

export default function ClassAttendancePage() {
  const [attendees, setAttendees] = useState<AttendanceRecord[]>([
    { id: 'att_1', userName: 'Budi Pratama', phone: '08119281001', seatLabel: 'A1', bookedAt: 'YESTERDAY', status: 'ATTENDED' },
    { id: 'att_2', userName: 'Jessica Tania', phone: '08129837192', seatLabel: 'A2', bookedAt: 'YESTERDAY', status: 'ATTENDED' },
    { id: 'att_3', userName: 'Reza Firmansyah', phone: '08139988112', seatLabel: 'A3', bookedAt: 'THIS_MORNING', status: 'CONFIRMED' },
    { id: 'att_4', userName: 'Siti Rahmawati', phone: '08182938192', seatLabel: 'A4', bookedAt: 'YESTERDAY', status: 'CONFIRMED' },
    { id: 'att_5', userName: 'Raditya Putra', phone: '08129991823', seatLabel: 'B1', bookedAt: 'YESTERDAY', status: 'NO_SHOW' },
  ]);

  const toggleStatus = (id: string, newStatus: 'ATTENDED' | 'NO_SHOW' | 'CONFIRMED') => {
    setAttendees((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
  };

  const attendedCount = attendees.filter((a) => a.status === 'ATTENDED').length;
  const noShowCount = attendees.filter((a) => a.status === 'NO_SHOW').length;

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 font-mono text-white">
      
      {/* Header */}
      <div className="border-b border-cyan/20 pb-6">
        <div className="inline-flex items-center gap-2 px-2 py-1 bg-cyan/10 border border-cyan/30 text-[10px] text-cyan uppercase tracking-[0.2em] mb-4">
          <CalendarCheck className="w-3 h-3" /> CLASS_ROSTER_ACTIVATE
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-white uppercase tracking-tighter leading-none mb-2">
          ROSTER: <span className="text-cyan">LES MILLS BODYPUMP.</span>
        </h1>
        <div className="text-[10px] text-cyan tracking-widest uppercase flex flex-wrap gap-4 mt-4">
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> STUDIO_01</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" /> COACH_SARAH</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 18:30 - 19:25 WIB</span>
          <span className="flex items-center gap-1"><Database className="w-3 h-3" /> CAPACITY: 12 MATS</span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-black border border-emerald-500/30 space-y-2 relative overflow-hidden group">
          <div className="text-[10px] text-emerald-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <CheckCircle2 className="w-3 h-3" /> CHECKED_IN
          </div>
          <div className="text-4xl font-display font-black text-emerald-400">
            {attendedCount} <span className="text-sm font-mono text-emerald-400/50">/ {attendees.length}</span>
          </div>
        </div>

        <div className="p-5 bg-black border border-volt/30 space-y-2 relative overflow-hidden group">
          <div className="text-[10px] text-volt uppercase tracking-[0.2em] flex items-center gap-2">
            <Clock className="w-3 h-3" /> PENDING_ARRIVAL
          </div>
          <div className="text-4xl font-display font-black text-volt">
            {attendees.length - attendedCount - noShowCount}
          </div>
        </div>

        <div className="p-5 bg-black border border-rose-500/30 space-y-2 relative overflow-hidden group">
          <div className="text-[10px] text-rose-400 uppercase tracking-[0.2em] flex items-center gap-2">
            <AlertTriangle className="w-3 h-3" /> NO_SHOW (STRIKE)
          </div>
          <div className="text-4xl font-display font-black text-rose-400">
            {noShowCount}
          </div>
        </div>
      </div>

      {/* Attendance Roster Table */}
      <div className="p-6 bg-black border border-cyan/20 space-y-6">
        <h3 className="text-[10px] text-cyan uppercase tracking-[0.2em] border-b border-cyan/20 pb-2">
          TARGET_ROSTER_MANIFEST
        </h3>

        <div className="space-y-3">
          {attendees.map((member) => (
            <motion.div
              layout
              key={member.id}
              className={`p-4 border grid grid-cols-1 md:grid-cols-12 gap-4 items-center transition-all ${
                member.status === 'ATTENDED' ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400' :
                member.status === 'NO_SHOW' ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' :
                'bg-cyan/5 border-cyan/20 text-white'
              }`}
            >
              <div className="md:col-span-1 flex justify-center">
                <div className={`w-10 h-10 flex items-center justify-center font-display font-black text-sm border ${
                  member.status === 'ATTENDED' ? 'border-emerald-500/50 bg-emerald-500/20' :
                  member.status === 'NO_SHOW' ? 'border-rose-500/50 bg-rose-500/20' :
                  'border-cyan/50 bg-cyan/20 text-cyan'
                }`}>
                  {member.seatLabel}
                </div>
              </div>
              
              <div className="md:col-span-5">
                <div className="text-sm font-bold uppercase tracking-widest">{member.userName}</div>
                <div className="text-[10px] opacity-60 tracking-widest mt-1">
                  COMMS: {member.phone} | TIME: {member.bookedAt}
                </div>
              </div>

              <div className="md:col-span-2 text-[10px] tracking-widest text-center uppercase">
                STATUS: {member.status}
              </div>

              {/* Status & Action Buttons */}
              <div className="md:col-span-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => toggleStatus(member.id, 'ATTENDED')}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    member.status === 'ATTENDED'
                      ? 'bg-emerald-500 text-black border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-black border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
                  }`}
                >
                  [ GRANT_ACCESS ]
                </button>

                <button
                  onClick={() => toggleStatus(member.id, 'NO_SHOW')}
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest border transition-all ${
                    member.status === 'NO_SHOW'
                      ? 'bg-rose-500 text-black border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-black border-rose-500/30 text-rose-500 hover:bg-rose-500/20'
                  }`}
                >
                  [ FLAG_NOSHOW ]
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
