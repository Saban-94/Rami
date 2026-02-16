'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, onSnapshot, doc, updateDoc, addDoc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Plus, Clock, User, Trash2, X } from 'lucide-react';

type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export default function CalendarGrid({ trialId }: { trialId: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // האזנה חיה לתורים - מחובר למלשינון
  useEffect(() => {
    if (!trialId) return;
    const q = query(collection(db, 'trials', trialId, 'appointments'));
    const unsub = onSnapshot(q, (snap) => {
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [trialId]);

  // לוגיקת בניית החודש (42 תאים)
  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const cells = [];
    // תאים מהחודש הקודם
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay; i > 0; i--) {
      cells.push({ day: prevMonthDays - i + 1, month: 'prev', fullDate: `${year}-${month}-${prevMonthDays - i + 1}` });
    }
    // תאי החודש הנוכחי
    for (let i = 1; i <= daysInMonth; i++) {
      cells.push({ day: i, month: 'current', fullDate: `${year}-${month + 1}-${i}` });
    }
    // השלמה לחודש הבא (עד 42 תאים)
    while (cells.length < 42) {
      const nextDay = cells.length - (firstDay + daysInMonth) + 1;
      cells.push({ day: nextDay, month: 'next', fullDate: `${year}-${month + 2}-${nextDay}` });
    }
    return cells;
  }, [currentDate]);

  const updateStatus = async (id: string, status: AppointmentStatus) => {
    await updateDoc(doc(db, 'trials', trialId, 'appointments', id), { status });
  };

  const deleteAppt = async (id: string) => {
    if(confirm("למחוק את התור?")) await deleteDoc(doc(db, 'trials', trialId, 'appointments', id));
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch(status) {
      case 'confirmed': return 'bg-green-500';
      case 'pending': return 'bg-amber-500';
      case 'cancelled': return 'bg-red-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
      {/* Header יומן */}
      <div className="flex items-center justify-between bg-white/5 p-6 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="flex items-center gap-4">
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
            <ChevronRight size={20} />
          </button>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">
            {currentDate.toLocaleString('he-IL', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-3 hover:bg-white/10 rounded-2xl transition-all">
            <ChevronLeft size={20} />
          </button>
        </div>
        <button className="bg-green-600 text-white px-6 py-3 rounded-2xl font-black italic flex items-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-all">
          תור חדש <Plus size={18} />
        </button>
      </div>

      {/* Grid היומן */}
      <div className="grid grid-cols-7 gap-2">
        {['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש'].map(day => (
          <div key={day} className="text-center text-[10px] font-black opacity-30 uppercase py-2">{day}</div>
        ))}
        {days.map((cell, idx) => {
          const dayAppts = appointments.filter(a => a.date === cell.fullDate);
          return (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => { setSelectedDay(cell.fullDate); setIsModalOpen(true); }}
              className={`min-h-[120px] p-2 rounded-3xl border transition-all cursor-pointer flex flex-col gap-1 
                ${cell.month === 'current' ? 'bg-white/5 border-white/10' : 'opacity-20 border-transparent'}
                ${cell.fullDate === new Date().toISOString().split('T')[0] ? 'ring-2 ring-green-500' : ''}`}
            >
              <span className="text-xs font-bold opacity-40">{cell.day}</span>
              <div className="flex flex-col gap-1 overflow-hidden">
                {dayAppts.slice(0, 3).map((a, i) => (
                  <div key={i} className={`h-1.5 w-full rounded-full ${getStatusColor(a.status)}`} title={a.clientName} />
                ))}
                {dayAppts.length > 3 && <span className="text-[8px] font-black opacity-40">+{dayAppts.length - 3} נוספים</span>}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal תצוגה יומית (בצד) */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed inset-y-0 left-0 w-96 bg-[#0f172a] border-r border-white/10 z-[100] p-8 shadow-2xl overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-2xl font-black italic uppercase tracking-tighter">תור ליום: {selectedDay}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl"><X size={20}/></button>
            </div>
            
            <div className="space-y-4">
              {appointments.filter(a => a.date === selectedDay).map((appt) => (
                <div key={appt.id} className="p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4 group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(appt.status)} shadow-lg shadow-current/20`} />
                      <span className="font-black italic text-lg">{appt.clientName}</span>
                    </div>
                    <button onClick={() => deleteAppt(appt.id)} className="opacity-0 group-hover:opacity-40 hover:text-red-500"><Trash2 size={16}/></button>
                  </div>
                  <div className="flex gap-4 text-xs opacity-50 font-bold">
                    <span className="flex items-center gap-1"><Clock size={12}/> {appt.time}</span>
                    <span className="flex items-center gap-1"><User size={12}/> {appt.service}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    {['pending', 'confirmed', 'completed'].map(s => (
                      <button 
                        key={s} 
                        onClick={() => updateStatus(appt.id, s as AppointmentStatus)}
                        className={`text-[8px] font-black uppercase px-3 py-1.5 rounded-full border transition-all
                          ${appt.status === s ? 'bg-white text-black' : 'border-white/10 opacity-30 hover:opacity-100'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="w-full py-6 border-2 border-dashed border-white/5 rounded-[2.5rem] opacity-30 hover:opacity-100 hover:border-green-500/50 transition-all font-black italic">
                + הוסף תור ידני
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
