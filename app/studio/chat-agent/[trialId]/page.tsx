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
  MessageSquare, Trash2, Link as LinkIcon, Plus, X, Sparkles
} from 'lucide-react';

import Navigation from '@/components/Navigation';
import MobilePreview from '@/components/studio/MobilePreview';
import { useToast } from '@/components/ui/ToastProvider';
import { suggestDesignFromPrompt } from '@/app/actions/gemini-brain';

// --- רכיבים פנימיים (Inline) למניעת שגיאות Build ---

const CRMView = ({ customers }: { customers: any[] }) => (
  <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
    {customers.map((c, i) => (
      <div key={i} className="bg-white/5 border border-white/10 p-5 rounded-[2rem] flex items-center justify-between group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 border border-green-500/20">
            <Users size={20} />
          </div>
          <div>
            <h3 className="font-black italic text-sm flex items-center gap-2">
              {c.name} {c.source === 'magic_link' && <LinkIcon size={12} className="text-blue-400"/>}
            </h3>
            <p className="text-[10px] opacity-40 font-bold uppercase">{c.phone}</p>
          </div>
        </div>
        <a href={`https://wa.me/${c.phone}`} target="_blank" className="p-3 bg-green-600/10 text-green-500 rounded-xl hover:bg-green-600 hover:text-white transition-all">
          <MessageSquare size={16}/>
        </a>
      </div>
    ))}
  </div>
);

const CatalogView = ({ products }: { products: any[] }) => (
  <div className="grid grid-cols-2 gap-4 animate-in zoom-in-95">
    {products.map((p, i) => (
      <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-[2.5rem] relative overflow-hidden">
        <h4 className="font-bold text-sm italic">{p.name}</h4>
        <div className="mt-2 font-black text-green-500 italic">₪{p.price}</div>
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
    const unsubManifest = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) setManifest(snap.data());
    });
    const unsubCRM = onSnapshot(collection(db, "trials", params.trialId, "customers"), (snap) => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      logAction("SYNC", "CRM Updated");
    });
    const unsubCatalog = onSnapshot(collection(db, "trials", params.trialId, "catalog"), (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      logAction("SYNC", "Catalog Updated");
    });
    return () => { unsubManifest(); unsubCRM(); unsubCatalog(); };
  }, [params.trialId, logAction]);

  const executeAiCommand = async (customPrompt?: string) => {
    const finalPrompt = customPrompt || prompt;
    if (!finalPrompt.trim()) return;

    logAction("AI_REQ", finalPrompt);
    addToast("ה-AI מעבד שינויים...", "info");
    
    try {
      const patch = await suggestDesignFromPrompt({ prompt: finalPrompt });
      await updateDoc(doc(db, "trials", params.trialId), { ...patch, updatedAt: serverTimestamp() });
      setPrompt("");
      logAction("AI_RES", "Layout Patched");
      addToast("המראה עודכן בהצלחה!", "success");
    } catch (err) {
      logAction("ERROR", "AI processing failed");
      addToast("תקלה בביצוע הפקודה", "error");
    }
  };

  const templates = [
    { label: '✨ מראה יוקרתי', prompt: 'תהפוך את האפליקציה ליוקרתית עם צבעי זהב ושחור ופונט Serif' },
    { label: '💎 מינימליזם נקי', prompt: 'שנה לעיצוב נקי מאוד, רקע לבן, פונט דק ורווחים גדולים' },
    { label: '🎁 מבצעי חג', prompt: 'הוסף אווירת חג, הדגש מוצרים במבצע ושנה צבעים לחגיגיים' }
  ];

  return (
    <main className={`h-screen flex flex-col ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      <Navigation />
      
      <div className="flex-1 grid grid-cols-12 pt-16 overflow-hidden">
        
        {/* עמודה 1: המלשינון */}
        <aside className="col-span-2 border-l border-white/5 bg-black/30 flex flex-col">
          <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-2 text-[10px] font-black uppercase text-green-500 tracking-widest">
            <Terminal size={14} /> System Auditor
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-[9px]">
            {logs.map(log => (
              <div key={log.id} className="p-2 bg-white/5 rounded-lg border border-white/5 opacity-60">
                <span className="text-blue-400">[{log.time}]</span> <span className="font-bold">{log.type}:</span> {log.details}
              </div>
            ))}
          </div>
        </aside>

        {/* עמודה 2: Workspace */}
        <section className="col-span-6 p-10 overflow-y-auto custom-scrollbar">
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
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <header className="mb-8">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                  {activeTab === 'chat' ? 'Agent Studio' : activeTab.toUpperCase()}
                </h1>
                <p className="opacity-40 text-xs font-bold mt-2 uppercase tracking-widest">Management Console: {manifest?.businessName}</p>
              </header>
              
              {activeTab === 'chat' && (
                <div className="space-y-6">
                  <div className="p-10 bg-white/5 rounded-[3.5rem] border border-white/10 relative">
                     <h2 className="text-xl font-black italic mb-6 flex items-center gap-2">
                        <Sparkles className="text-green-500" size={20} /> AI Design Command
                     </h2>
                     <div className="relative flex items-center gap-3">
                       <div className="relative flex-1">
                          <input 
                            type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && executeAiCommand()}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 pr-14 outline-none focus:border-green-500 text-sm"
                            placeholder="תאר שינוי בעיצוב או במבנה..."
                          />
                          <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-green-500 z-50 transition-colors"
                          >
                            <Paperclip size={22} />
                          </button>
                          <input type="file" ref={fileInputRef} className="hidden" />
                       </div>
                       <button onClick={() => executeAiCommand()} className="bg-green-600 p-6 rounded-2xl shadow-xl shadow-green-600/20 active:scale-95 transition-all">
                        <Send size={20}/>
                       </button>
                     </div>
                  </div>
                  
                  {/* כפתורי תבניות לחיצים ופעילים */}
                  <div className="grid grid-cols-3 gap-3">
                    {templates.map(temp => (
                      <button 
                        key={temp.label} 
                        onClick={() => executeAiCommand(temp.prompt)}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase opacity-60 hover:opacity-100 hover:bg-green-600/10 hover:border-green-500/50 transition-all active:scale-95"
                      >
                        {temp.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'crm' && <CRMView customers={customers} />}
              {activeTab === 'catalog' && <CatalogView products={products} />}
              {activeTab === 'calendar' && <div className="p-20 border-2 border-dashed border-white/5 rounded-[3rem] text-center opacity-20 italic">Monthly View Active</div>}
            </motion.div>
          </AnimatePresence>
        </section>

        {/* עמודה 3: Preview */}
        <aside className="col-span-4 flex items-center justify-center bg-black/10 border-r border-white/5">
           <div className="sticky top-0 h-full w-full flex items-center justify-center p-12">
              <MobilePreview manifest={manifest} />
           </div>
        </aside>

      </div>
    </main>
  );
}
