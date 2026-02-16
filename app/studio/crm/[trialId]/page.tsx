'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Palette, Users, Calendar as CalendarIcon, 
  ShoppingBag, Activity, Zap, Terminal 
} from 'lucide-react';

// רכיבי ה-Enterprise
import MobilePreview from '@/components/studio/MobilePreview';
import CRMManager from '@/components/studio/CRMManager';
import CalendarGrid from '@/components/studio/CalendarGrid';
import CatalogManager from '@/components/studio/CatalogManager';
import { useToast } from '@/components/ui/ToastProvider';

export default function SabanOSProductionMaster({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"studio" | "crm" | "calendar" | "catalog">("studio");
  const [manifest, setManifest] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [logs, setLogs] = useState<any[]>([]);
  const { addToast } = useToast();

  // --- המלשינון (System Auditor) ---
  const logAction = useCallback((type: string, details: string) => {
    const newLog = { id: Date.now(), type, details, time: new Date().toLocaleTimeString() };
    setLogs(prev => [newLog, ...prev].slice(0, 15));
  }, []);

  // --- סנכרון נתונים חי (Production Sync) ---
  useEffect(() => {
    if (!params.trialId) return;
    logAction("SYSTEM", "Initializing Real-time Sync...");
    
    const unsub = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) {
        setManifest(snap.data());
        logAction("DB_SYNC", "Manifest updated via Firestore");
      }
    }, (error) => {
      logAction("ERROR", `Sync failed: ${error.message}`);
    });
    
    return () => unsub();
  }, [params.trialId, logAction]);

  // --- עדכון חכם (Smart Update) למניעת דריסות ---
  const smartUpdate = async (path: string, value: any) => {
    try {
      const docRef = doc(db, "trials", params.trialId);
      await updateDoc(docRef, { [path]: value, updatedAt: serverTimestamp() });
      logAction("UPDATE", `Field [${path}] updated successfully`);
      addToast("השינוי נשמר בהצלחה", "success");
    } catch (err: any) {
      logAction("ERROR", `Update failed: ${err.message}`);
      addToast("שגיאה בעדכון הנתונים", "error");
    }
  };

  return (
    <div className={`h-screen flex flex-col font-sans transition-colors duration-500 ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'}`} dir="rtl">
      
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-8 z-[100]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center shadow-lg shadow-green-600/20">
            <ShieldCheck size={20} className="text-white" />
          </div>
          <span className="font-black italic text-xl tracking-tighter uppercase">SabanOS Studio <span className="text-green-500">Pro</span></span>
        </div>

        <div className="flex gap-2 bg-white/5 p-1 rounded-2xl border border-white/5">
          {[
            { id: 'studio', icon: <Palette size={16}/>, label: 'סטודיו' },
            { id: 'crm', icon: <Users size={16}/>, label: 'CRM' },
            { id: 'calendar', icon: <CalendarIcon size={16}/>, label: 'יומן' },
            { id: 'catalog', icon: <ShoppingBag size={16}/>, label: 'חנות' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all
                ${activeTab === tab.id ? 'bg-green-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
          {isDarkMode ? <Zap size={18} className="text-yellow-400" /> : <Moon size={18} />}
        </button>
      </header>

      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        
        {/* עמודה 1: המלשינון (The Auditor) */}
        <aside className="col-span-2 border-l border-white/5 bg-black/20 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2 text-[10px] font-black uppercase text-green-500">
            <Activity size={14} /> System Auditor
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            <AnimatePresence>
              {logs.map((log) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  key={log.id} 
                  className="p-3 bg-white/5 rounded-xl border border-white/5 font-mono text-[9px] leading-tight"
                >
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-400 font-bold">{log.type}</span>
                    <span className="opacity-30">{log.time}</span>
                  </div>
                  <p className="opacity-70 break-all">{log.details}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <div className="p-4 bg-green-600/10 border-t border-green-600/20 text-[9px] font-black text-center text-green-500 uppercase italic">
            SabanOS v2.9.0-Stable
          </div>
        </aside>

        {/* עמודה 2: Workspace */}
        <section className="col-span-6 p-10 overflow-y-auto custom-scrollbar relative bg-transparent">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'studio' && (
                <div className="space-y-10">
                  <header>
                    <h1 className="text-6xl font-black italic tracking-tighter uppercase mb-2">Design Hub</h1>
                    <p className="opacity-50 text-sm font-bold">ניהול חזותי עבור {manifest?.businessName}</p>
                  </header>
                  {/* כאן יבואו הכלים של ה-Design Studio המקורי שבנינו */}
                  <div className="p-8 bg-white/5 rounded-[3rem] border border-white/10 italic text-center opacity-30">
                    השתמש ב-AI Command למטה כדי לערוך את המראה
                  </div>
                </div>
              )}

              {activeTab === 'crm' && <CRMManager trialId={params.trialId} />}
              {activeTab === 'calendar' && <CalendarGrid trialId={params.trialId} />}
              {activeTab === 'catalog' && <CatalogManager trialId={params.trialId} />}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* עמודה 3: Sticky Preview */}
        <aside className="col-span-4 flex items-center justify-center bg-black/5 border-r border-white/5">
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>

      </div>

      {/* Footer: AI Command Bar (Locked) */}
      <footer className="h-24 bg-black/60 backdrop-blur-2xl border-t border-white/10 flex items-center px-10 gap-6 z-[100]">
        <div className="relative flex-1">
          <input 
            type="text" 
            placeholder="SabanOS AI: פקד על המערכת (למשל: 'שנה את צבע הלוגו לזהב'...)"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-8 pr-16 text-sm outline-none focus:border-green-500/50 transition-all italic font-medium"
          />
          <button className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 transition-colors">
            <Zap size={20} />
          </button>
        </div>
        <button className="bg-green-600 hover:bg-green-500 px-10 py-5 rounded-2xl font-black italic uppercase tracking-widest text-sm shadow-2xl shadow-green-600/20 active:scale-95 transition-all">
          Execute Command
        </button>
      </footer>
    </div>
  );
}
