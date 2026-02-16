"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, orderBy, where } from "firebase/firestore";
import { Calendar as CalendarIcon, Clock, User, CheckCircle2, AlertCircle, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CalendarManager({ trialId }: { trialId: string }) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    // משיכת תורים המסונכרנים ליומן של העסק
    const q = query(
      collection(db, "trials", trialId, "appointments"),
      orderBy("startTime", "asc")
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      setAppointments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [trialId]);

  const filteredAppointments = appointments.filter(app => 
    app.startTime?.startsWith(selectedDate)
  );

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* צד ימין: בחירת תאריך וסיכום */}
      <div className="col-span-4 space-y-4">
        <div className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem]">
          <h4 className="text-xs font-black uppercase text-green-500 mb-4 flex items-center gap-2">
            <CalendarIcon size={14} /> בחר תאריך
          </h4>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-green-500 transition-all"
          />
        </div>
        
        <div className="bg-green-600/10 border border-green-600/20 p-6 rounded-[2.5rem]">
          <p className="text-sm font-bold italic text-green-500">יש לך {filteredAppointments.length} תורים מתוכננים להיום</p>
        </div>
      </div>

      {/* צד שמאל: רשימת התורים (Timeline) */}
      <div className="col-span-8 space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((app, idx) => (
              <motion.div 
                key={app.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white/5 border border-white/10 p-6 rounded-[2.5rem] flex items-center justify-between group hover:border-green-500/40 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="text-center border-l border-white/10 pl-6">
                    <span className="block text-xl font-black italic">{app.startTime?.split('T')[1].slice(0,5)}</span>
                    <span className="text-[10px] opacity-40 font-bold uppercase">שעה</span>
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-lg">{app.clientName}</h3>
                    <p className="text-xs opacity-50 flex items-center gap-2">
                      <Clock size={12} /> {app.serviceName || "ייעוץ עסקי"} • {app.duration || "30"} דקות
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {app.status === 'confirmed' ? (
                    <span className="bg-green-500/20 text-green-500 p-2 rounded-full"><CheckCircle2 size={18} /></span>
                  ) : (
                    <span className="bg-amber-500/20 text-amber-500 p-2 rounded-full"><AlertCircle size={18} /></span>
                  )}
                  <button className="p-3 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Plus size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-30 italic">
              <CalendarIcon size={40} className="mb-4" />
              <p>אין תורים רשומים לתאריך זה</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
