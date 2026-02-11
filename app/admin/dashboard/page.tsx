"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Users, Clock, MessageCircle, Trash2, ExternalLink, ShieldCheck } from "lucide-react";

export default function AdminDashboard() {
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // האזנה חיה לכל ה-Trials ב-Firebase
    const q = query(collection(db, "trials"), orderBy("lastUpdate", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const trialsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setTrials(trialsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const calculateDaysLeft = (createdAt: any) => {
    if (!createdAt) return 0;
    const created = createdAt.seconds * 1000;
    const now = Date.now();
    const diff = now - created;
    const tenDaysInMs = 10 * 24 * 60 * 60 * 1000;
    const remaining = Math.max(0, Math.ceil((tenDaysInMs - diff) / (1000 * 60 * 60 * 24)));
    return remaining;
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("למחוק את תקופת הניסיון הזו?")) {
      await deleteDoc(doc(db, "trials", id));
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-sans">טוען נתונים...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans" dir="rtl">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={36} />
            RamiOS Control Panel
          </h1>
          <p className="text-slate-500 mt-1">ניהול תקופות ניסיון ולקוחות AI</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex items-center gap-4">
            <div className="bg-emerald-500/10 p-2 rounded-lg text-emerald-500"><Users size={24} /></div>
            <div>
              <p className="text-xs text-slate-400">סה"כ לקוחות</p>
              <p className="text-xl font-bold dark:text-white">{trials.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-sm">
                <th className="p-5 font-bold">לקוח / ID</th>
                <th className="p-5 font-bold">הודעה אחרונה</th>
                <th className="p-5 font-bold">זמן נותר</th>
                <th className="p-5 font-bold">סטטוס</th>
                <th className="p-5 font-bold">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {trials.map((trial) => {
                const daysLeft = calculateDaysLeft(trial.createdAt);
                const lastMsg = trial.messages?.[trial.messages.length - 1];

                return (
                  <motion.tr 
                    layout
                    key={trial.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-5">
                      <div className="font-bold text-slate-900 dark:text-white">{trial.name || "לקוח ללא שם"}</div>
                      <div className="text-xs text-slate-400 font-mono">{trial.id}</div>
                    </td>
                    <td className="p-5">
                      <div className="text-sm text-slate-600 dark:text-slate-300 max-w-xs truncate">
                        {lastMsg ? `"${lastMsg.content}"` : "אין הודעות עדיין"}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock size={10} /> {trial.lastUpdate?.toDate().toLocaleString('he-IL')}
                      </div>
                    </td>
                    <td className="p-5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                        daysLeft > 3 ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-600"
                      }`}>
                        {daysLeft} ימים נותרו
                      </div>
                    </td>
                    <td className="p-5">
                      <span className="flex items-center gap-2 text-xs font-medium text-emerald-500">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        פעיל
                      </span>
                    </td>
                    <td className="p-5 flex items-center gap-3">
                      <a 
                        href={`/chat/${trial.id}`} 
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-emerald-500 transition-colors"
                        title="צפה בצ'אט"
                      >
                        <ExternalLink size={20} />
                      </a>
                      <button 
                        onClick={() => handleDelete(trial.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                        title="מחק"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {trials.length === 0 && (
            <div className="p-20 text-center text-slate-400">
              <MessageCircle size={48} className="mx-auto mb-4 opacity-20" />
              <p>אין תקופות ניסיון פעילות כרגע</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
