"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../../lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, deleteDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Clock, MessageCircle, Trash2, ExternalLink, ShieldCheck, Plus, X, Copy, Check } from "lucide-react";

export default function AdminDashboard() {
  const [trials, setTrials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBizName, setNewBizName] = useState("");
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    const q = query(collection(db, "trials"), orderBy("lastUpdate", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTrials(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const createTrial = async () => {
    if (!newBizName.trim()) return;
    const id = newBizName.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 7);
    const docRef = doc(db, "trials", id);
    await setDoc(docRef, {
      name: newBizName,
      status: "active",
      createdAt: serverTimestamp(),
      lastUpdate: serverTimestamp(),
      messages: []
    });
    setNewBizName("");
    setIsModalOpen(false);
  };

  const copyToClipboard = (id: string) => {
    const url = `${window.location.origin}/chat/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 2000);
  };

  const calculateDaysLeft = (createdAt: any) => {
    if (!createdAt) return 10;
    const diff = Date.now() - (createdAt.seconds * 1000);
    return Math.max(0, Math.ceil((10 * 24 * 60 * 60 * 1000 - diff) / (1000 * 60 * 60 * 24)));
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-sans">טוען RamiOS...</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 md:p-8 font-sans" dir="rtl">
      <div className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldCheck className="text-emerald-500" size={36} />
            RamiOS Control
          </h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
        >
          <Plus size={20} /> צור לינק חדש
        </button>
      </div>

      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs">
            <tr>
              <th className="p-5 font-bold uppercase">עסק / לקוח</th>
              <th className="p-5 font-bold uppercase text-center">ימים</th>
              <th className="p-5 font-bold uppercase">הודעה אחרונה</th>
              <th className="p-5 font-bold uppercase">פעולות</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {trials.map((trial) => (
              <tr key={trial.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-5">
                  <div className="font-bold dark:text-white">{trial.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{trial.id}</div>
                </td>
                <td className="p-5 text-center">
                   <span className={`px-3 py-1 rounded-full text-[10px] font-black ${calculateDaysLeft(trial.createdAt) > 3 ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {calculateDaysLeft(trial.createdAt)}d
                   </span>
                </td>
                <td className="p-5">
                  <div className="text-sm text-slate-600 dark:text-slate-300 truncate max-w-xs italic">
                    {trial.messages?.[trial.messages.length - 1]?.content || "טרם התחילו צ'אט"}
                  </div>
                </td>
                <td className="p-5 flex items-center gap-2">
                  <button onClick={() => copyToClipboard(trial.id)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    {copiedId === trial.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} className="text-slate-400" />}
                  </button>
                  <a href={`/chat/${trial.id}`} target="_blank" className="p-2 text-slate-400 hover:text-emerald-500"><ExternalLink size={18} /></a>
                  <button onClick={async () => { if(confirm("למחוק?")) await deleteDoc(doc(db, "trials", trial.id)) }} className="p-2 text-slate-400 hover:text-rose-500"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal מחולל לינקים */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black dark:text-white">יצירת לינק קסם</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
              </div>
              <input 
                autoFocus
                value={newBizName} 
                onChange={(e) => setNewBizName(e.target.value)}
                placeholder="שם העסק (למשל: דוגי סטייל)" 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl mb-6 outline-none focus:ring-2 ring-emerald-500 transition-all dark:text-white"
              />
              <button onClick={createTrial} className="w-full bg-slate-900 dark:bg-emerald-500 text-white p-4 rounded-2xl font-bold hover:opacity-90 transition-opacity">הנפק לינק ניסיון</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
