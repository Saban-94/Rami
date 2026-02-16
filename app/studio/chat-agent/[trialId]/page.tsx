'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { 
  doc, onSnapshot, updateDoc, collection, query, orderBy, 
  addDoc, serverTimestamp, deleteDoc 
} from 'firebase/firestore';
import { 
  ShieldCheck, Palette, Users, Calendar as CalendarIcon, 
  ShoppingBag, Activity, Zap, Terminal, Send, Paperclip,
  MessageSquare, Trash2, Link as LinkIcon, Plus, X, CheckCircle2
} from 'lucide-react';

import Navigation from '@/components/Navigation';
import MobilePreview from '@/components/studio/MobilePreview';
import { useToast } from '@/components/ui/ToastProvider';
import { suggestDesignFromPrompt } from '@/app/actions/gemini-brain';

// --- רכיב פנימי: ניהול לקוחות (CRM) ---
const CRMView = ({ customers }: { customers: any[] }) => (
  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
    {customers.map((c, i) => (
      <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex items-center justify-between group hover:border-green-500/30 transition-all">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 border border-green-500/20">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-black italic flex items-center gap-2 text-sm">
              {c.name} {c.source === 'magic_link' && <LinkIcon size={12} className="text-blue-400" title="מקור: לינק קסם"/>}
            </h3>
            <p className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">{c.phone} • {c.email || 'No Email'}</p>
          </div>
        </div>
        <a href={`https://wa.me/${c.phone}`} target="_blank" className="p-3 bg-green-600/10 text-green-500 rounded-xl hover:bg-green-600 hover:text-white transition-all">
          <MessageSquare size={16}/>
        </a>
      </div>
    ))}
    {customers.length === 0 && <div className="p-10 border-2 border-dashed border-white/5 rounded-[2rem] text-center opacity-20 italic">אין לקוחות רשומים</div>}
  </div>
);

// --- רכיב פנימי: קטלוג מוצרים ---
const CatalogView = ({ products }: { products: any[] }) => (
  <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95 duration-500">
    {products.map((p, i) => (
      <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
        {p.onSale && <div className="absolute top-3 left-3 bg-red-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase">Sale</div>}
        <h4 className="font-bold text-sm mb-1 italic">{p.name}</h4>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-black ${p.onSale ? 'line-through opacity-30' : ''}`}>₪{p.price}</span>
          {p.onSale && <span className="text-green-500 font-black italic">₪{p.salePrice}</span>}
        </div>
      </div>
    ))}
    <button className="border-2 border-dashed border-white/5 rounded-[2.5rem] p-8 opacity-20 hover:opacity-100 transition-all flex flex-col items-center gap-2">
      <Plus size={20} /> <span className="text-[9px] font-black uppercase">הוסף מוצר</span>
    </button>
  </div>
);

// --- הדף המרכזי המאוחד ---
export default function SabanOSAgentStudio({ params }: { params: { trialId: string } }) {
  const [activeTab, setActiveTab] = useState<"chat" | "crm" | "calendar" | "catalog">("chat");
  const [manifest, setManifest] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [prompt, setPrompt] = useState("");
  const [logs, setLogs] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const logAction = useCallback((type: string, details: string) => {
    setLogs(prev => [{ id: Date.now(), type, details, time: new Date().toLocaleTimeString() }, ...prev].slice(0, 12));
  }, []);

  useEffect(() => {
    if (!params.trialId) return;
    
    // סנכרון נתוני מניפסט
    const unsubManifest = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) setManifest(snap.data());
    });

    // סנכרון CRM
    const unsubCRM = onSnapshot(collection(db, "trials", params.trialId, "customers"), (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      logAction("SYNC", "Customer Data Received");
    });

    // סנכרון קטלוג
    const unsubCatalog = onSnapshot(collection(db, "trials", params.trialId, "catalog"), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      logAction("SYNC", "Product Catalog Updated");
    });

    return () => { unsubManifest(); unsubCRM(); unsubCatalog(); };
  }, [params.trialId, logAction]);

  const executeAiCommand = async () => {
    if (!prompt.trim()) return;
    logAction("AI_REQ", `Prompt: ${prompt.substring(0, 20)}...`);
    addToast("מעבד פקודה...", "info");
    
    try {
      const patch = await suggestDesignFromPrompt({ prompt });
      await updateDoc(doc(db, "trials", params.trialId), { ...patch, updatedAt: serverTimestamp() });
      setPrompt("");
      logAction("AI_RES", "Layout Patched Successfully");
      addToast("בוצע בהצלחה!", "success");
    } catch (err) {
      logAction("ERROR", "AI processing failed");
      addToast("תקלה בביצוע הפקודה", "error");
    }
  };

  return (
    <main className={`h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      <Navigation />
      
      <div className="flex-1 grid grid-cols-12 pt-16 overflow-hidden">
        
        {/* עמודה 1: המלשינון (Audit Terminal) */}
        <aside className="col-span-2 border-l border-white/5 bg-black/30 flex flex-col">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2 text-[10px] font-black uppercase text-green-500 tracking-widest">
            <Terminal size={14} /> System Auditor
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[9px] custom-scrollbar">
            {logs.map(log => (
              <div key={log.id} className="p-2 bg-white/5 rounded-lg border border-white/5 opacity-60">
                <span className="text-blue-400">[{log.time}]</span> <span className="font-bold">{log.type}:</span> {log.details}
              </div>
            ))}
          </div>
          <div className="p-4 bg-green-500/5 text-[9px] font-black uppercase text-center text-green-500 italic opacity-50">
            SabanOS v3.0 Agent
          </div>
        </aside>

        {/* עמודה 2: Workspace Core */}
        <section className="col-span-6 p-10 overflow-y-auto custom-scrollbar flex flex-col">
          <div className="flex gap-2 mb-10 bg-white/5 p-1 rounded-2xl w-fit border border-white/5">
            {[
              { id: 'chat', icon: <Zap size={14}/>, label: 'AI Agent' },
              { id: 'crm', icon: <Users size={14}/>, label: 'CRM' },
              { id: 'calendar', icon: <CalendarIcon size={14}/>, label: 'יומן' },
              { id: 'catalog', icon: <ShoppingBag size={14}/>, label: 'חנות' }
            ].map((t) => (
              <button 
                key={t.id} onClick={() => setActiveTab(t.id as any)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 transition-all 
                  ${activeTab === t.id ? 'bg-green-600 text-white shadow-lg' : 'opacity-40 hover:opacity-100'}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="flex-1"
            >
              <header className="mb-8">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                  {activeTab === 'chat' ? 'Agent Studio' : activeTab.toUpperCase()}
                </h1>
                <p className="opacity-40 text-xs font-bold mt-2 uppercase tracking-widest">
                   Management Console: {manifest?.businessName}
                </p>
              </header>
              
              {activeTab === 'chat' && (
                <div className="space-y-6">
                  <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10 relative overflow-hidden group">
                     <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Zap size={200} />
                     </div>
                     <h2 className="text-xl font-black italic mb-6 flex items-center gap-2">
                        <Zap className="text-green-500" size={20} /> AI Design Command
                     </h2>
                     <div className="relative flex items-center gap-3 z-10">
                       <div className="relative flex-1">
                          <input 
                            type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && executeAiCommand()}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 pr-14 outline-none focus:border-green-500 text-sm italic"
                            placeholder="תאר שינוי בעיצוב, תוכן או מבנה..."
                          />
                          {/* ה"סיכה" - נשארת כאן קבוע */}
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 z-50 transition-colors"
                          >
                            <Paperclip size={22} />
                          </button>
                          <input type="file" ref={fileInputRef} className="hidden" />
                       </div>
                       <button onClick={executeAiCommand} className="bg-green-600 p-6 rounded-2xl shadow-xl shadow-green-600/20 hover:scale-105 active:scale-95 transition-all text-white">
                        <Send size={20}/>
                       </button>
                     </div>
                  </div>
                  
                  {/* Quick Templates */}
                  <div className="grid grid-cols-3 gap-3">
                    {['מראה יוקרתי', 'מינימליזם נקי', 'מבצעי חג'].map(temp => (
                      <button key={temp} className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase opacity-50 hover:opacity-100 transition-all">
                        {temp}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'crm' && <CRMView customers={customers} />}
              {activeTab === 'catalog' && <CatalogView products={products} />}
              {activeTab === 'calendar' && (
                <div className="h-96 border-2 border-dashed border-white/5 rounded-[3.5rem] flex flex-col items-center justify-center opacity-20 italic">
                   <CalendarIcon size={48} className="mb-4" />
                   <p className="text-sm">Monthly Schedule Connected</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* עמודה 3: Live Preview הסימולטור */}
        <aside className="col-span-4 flex items-center justify-center bg-black/10 border-r border-white/5 relative">
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
           {/* מחוון סטטוס סנכרון */}
           <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-md">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[8px] font-black uppercase opacity-50 tracking-widest">Live Sync Active</span>
           </div>
        </aside>

      </div>
    </main>
  );
}
