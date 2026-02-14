"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Layout, Palette, Sparkles, 
  Rocket, Smartphone as MobileIcon, Coffee,
  BookOpen, Scissors, Stethoscope, Briefcase, 
  ChevronRight, Search, CheckCircle2, Lock, Sun, Moon
} from "lucide-react";

// רשימת קטגוריות לתצוגה בסטודיו
const CATEGORIES = [
  { id: 'food', name: 'מזון ומשקאות', icon: <Coffee size={18}/>, tpl: 'coffee-shop-basic' },
  { id: 'retail', name: 'חנויות וספרים', icon: <BookOpen size={18}/>, tpl: 'bookstore-basic' },
  { id: 'barber', name: 'יופי וטיפוח', icon: <Scissors size={18}/>, tpl: 'barber-basic' },
  { id: 'medical', name: 'רפואה וקליניקות', icon: <Stethoscope size={18}/>, tpl: 'medical-clinic' },
  { id: 'legal', name: 'משרדים וייעוץ', icon: <Briefcase size={18}/>, tpl: 'law-firm-basic' },
];

export default function SabanOSV2Studio({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const docRef = doc(db, "trials", params.trialId);
        const snap = await getDoc(docRef);
        if (snap.exists()) setBusinessData(snap.data());
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`ברוך הבא ל-SabanOS v2.0. המוח זיהה שאתה בתחום ה-${businessData?.industry || 'כללי'}. הנה תבניות מומלצות עבורך:`);
    }
  };

  const typeToCanvas = (text: string) => {
    setAiCanvasText("");
    let i = 0;
    const interval = setInterval(() => {
      setAiCanvasText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black animate-pulse">SabanOS v2.0 Loading...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-500/20"><Lock size={32} /></div>
          <h2 className="text-3xl font-black mb-6 italic">Enter Studio V2</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg">UNLOCK STUDIO</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1850px] mx-auto pb-10 grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-120px)]">
        
        {/* סרגל בחירת קטגוריות ותבניות (שמאל) */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black italic flex items-center gap-2">
                <Layout size={20} className="text-green-500" />
                ספריית תבניות
              </h2>
            </div>
            
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCat(cat)}
                  className={`w-full p-5 rounded-[2rem] flex items-center justify-between group transition-all ${selectedCat.id === cat.id ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border border-transparent hover:border-green-500/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${selectedCat.id === cat.id ? 'bg-white/20' : 'bg-white dark:bg-white/10 shadow-sm'}`}>
                      {cat.icon}
                    </div>
                    <span className="text-sm font-black italic">{cat.name}</span>
                  </div>
                  <ChevronRight size={16} className={selectedCat.id === cat.id ? 'opacity-100' : 'opacity-20'} />
                </button>
              ))}
            </div>
          </div>

          {/* כלי עריכה מהירים */}
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-8 shadow-sm">
             <h3 className="text-sm font-black uppercase tracking-widest opacity-30 mb-6 italic">Quick Actions</h3>
             <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs mb-3 flex items-center justify-center gap-2 hover:scale-105 transition-all">
                <Rocket size={14}/> פרסם שינויים
             </button>
             <button onClick={toggleTheme} className="w-full py-4 border-2 border-slate-100 dark:border-white/10 rounded-2xl font-black text-xs flex items-center justify-center gap-2">
                {isDarkMode ? <Sun size={14}/> : <Moon size={14}/>} {isDarkMode ? 'מצב יום' : 'מצב לילה'}
             </button>
          </div>
        </div>

        {/* קנבס התצוגה - ה-iPhone (מרכז) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-slate-200/20 dark:bg-black/20 rounded-[5rem] border border-dashed border-slate-300 dark:border-white/5">
          <div className="absolute top-8 px-6 py-2 bg-white dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm z-10 flex items-center gap-3">
             <CheckCircle2 size={16} className="text-green-500" />
             <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Live Sync Active</span>
          </div>

          <div className="w-[320px] h-[640px] bg-black rounded-[4rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-black/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-30" />
            
            {/* תוכן האפליקציה לפי התבנית שנבחרה */}
            <div className={`w-full h-full p-6 pt-14 transition-all duration-700 ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
              <div className="text-center mb-10">
                <div className="w-16 h-16 bg-green-500/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  {selectedCat.icon}
                </div>
                <h3 className={`text-2xl font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{businessData?.businessName}</h3>
                <p className="text-[10px] opacity-40 uppercase mt-1 tracking-tighter">Powered by SabanOS Studio</p>
              </div>

              {/* בלוקים דמה לפי קטגוריה */}
              <div className="space-y-4">
                <div className="h-32 bg-slate-100 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-black opacity-20 uppercase tracking-widest">Hero Block: {selectedCat.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl" />
                   <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl" />
                </div>
                <button className="w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                  קבע תור עכשיו
                </button>
              </div>
            </div>

            {/* Tab Bar (התפריט הדינמי תחתון) */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 flex items-center justify-around px-4 z-20">
              <div className="flex flex-col items-center gap-1 text-green-500"><Home size={18}/><span className="text-[8px] font-black uppercase">בית</span></div>
              <div className="flex flex-col items-center gap-1 opacity-30 text-slate-400"><Scissors size={18}/><span className="text-[8px] font-black uppercase">קטלוג</span></div>
              <div className="flex flex-col items-center gap-1 opacity-30 text-slate-400"><BookOpen size={18}/><span className="text-[8px] font-black uppercase">בלוג</span></div>
            </div>
          </div>
        </div>

        {/* AI Orchestrator (ימין) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[4rem] p-10 flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-green-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">AI Designer</h2>
                <div className="flex items-center gap-2 mt-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Active Listening</p></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-8">
              <AnimatePresence mode="wait">
                {aiCanvasText && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-green-500/5 border-r-4 border-green-600 rounded-l-[3rem] shadow-inner relative">
                    <p className="text-xl font-bold leading-relaxed text-green-700 dark:text-green-400 font-mono italic">
                      {aiCanvasText}
                      <span className="inline-block w-2.5 h-6 bg-green-600 animate-pulse ml-2 align-middle" />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 text-center italic opacity-40 text-xs font-black uppercase tracking-widest mb-6">
              AI Orchestrator: Waiting for user command
            </div>
            
            <div className="relative">
              <textarea 
                placeholder="תכתוב ל-AI: 'תעצב לי דף מבצעים לחג'..."
                className="w-full h-32 bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner"
              />
              <button className="absolute bottom-4 left-4 p-4 bg-green-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all">
                <Sparkles size={20}/>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
