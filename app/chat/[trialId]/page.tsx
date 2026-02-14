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
  ChevronRight, CheckCircle2, Lock, Sun, Moon,
  Home, Send, Plus
} from "lucide-react";

const CATEGORIES = [
  { id: 'food', name: 'מזון ומשקאות', icon: <Coffee size={18}/>, tpl: 'coffee-shop-basic' },
  { id: 'retail', name: 'חנויות וספרים', icon: <BookOpen size={18}/>, tpl: 'bookstore-basic' },
  { id: 'barber', name: 'יופי וטיפוח', icon: <Scissors size={18}/>, tpl: 'barber-basic' },
  { id: 'medical', name: 'רפואה וקליניקות', icon: <Stethoscope size={18}/>, tpl: 'medical-clinic' },
  { id: 'legal', name: 'משרדים וייעוץ', icon: <Briefcase size={18}/>, tpl: 'law-firm-basic' },
];

export default function SabanOSStudioV2({ params }: { params: { trialId: string } }) {
  // States
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [aiInput, setAiInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // אתחול אודיו בטוח
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/whatsapp.mp3");
    }

    const fetchDoc = async () => {
      try {
        const docRef = doc(db, "trials", params.trialId);
        const snap = await getDoc(docRef);
        if (snap.exists()) setBusinessData(snap.data());
      } catch (err) { console.error("Firestore Error:", err); }
      setLoading(false);
    };
    fetchDoc();

    // הגנה על OneSignal מפני שגיאת 'reading on'
    const win = window as any;
    if (win.OneSignal) {
      win.OneSignal.push(() => {
        if (win.OneSignal.Notifications) {
          console.log("OneSignal Studio Ready");
        }
      });
    }
  }, [params.trialId]);

  // פונקציית שינוי ערכת נושא - תוקן!
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      if (audioRef.current) audioRef.current.play().catch(() => {});
      typeToCanvas(`מערכת SabanOS v2.0 פתוחה. שלום ${businessData?.fullName || 'עמאר'}, בוא נעצב את האפליקציה של ${businessData?.businessName}.`);
    } else {
      alert("קוד שגוי");
    }
  };

  const typeToCanvas = (text: string) => {
    setAiCanvasText("");
    let i = 0;
    const interval = setInterval(() => {
      setAiCanvasText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 20);
  };

  const saveChanges = async () => {
    setIsSaving(true);
    // לוגיקת שמירה עתידית ל-Firestore
    setTimeout(() => {
      setIsSaving(false);
      typeToCanvas("השינויים פורסמו בהצלחה! האפליקציה של הלקוחות עודכנה.");
    }, 1500);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black animate-pulse text-2xl">SabanOS v2.0...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-500/20"><Lock size={32} /></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 italic">Enter Studio V2</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg">UNLOCK STUDIO</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans selection:bg-green-500/30 overflow-x-hidden`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1850px] mx-auto pb-10 grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-120px)]">
        
        {/* SIDEBAR (שמאל) */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black italic flex items-center gap-2 mb-8">
              <Layout size={20} className="text-green-500" />
              ספריית תבניות
            </h2>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => {
                    setSelectedCat(cat);
                    typeToCanvas(`החלפת תבנית: ${cat.name}. מעדכן את מבנה הדפים והאייקונים...`);
                  }}
                  className={`w-full p-5 rounded-[2rem] flex items-center justify-between group transition-all ${selectedCat.id === cat.id ? 'bg-green-600 text-white shadow-lg shadow-green-500/20' : 'bg-slate-50 dark:bg-white/5 border border-transparent hover:border-green-500/30'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${selectedCat.id === cat.id ? 'bg-white/20' : 'bg-white dark:bg-white/10 shadow-sm'}`}>{cat.icon}</div>
                    <span className="text-sm font-black italic">{cat.name}</span>
                  </div>
                  <ChevronRight size={16} className={selectedCat.id === cat.id ? 'opacity-100' : 'opacity-20'} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-8 shadow-sm">
             <h3 className="text-sm font-black uppercase opacity-30 mb-6 italic">Quick Settings</h3>
             <button onClick={saveChanges} disabled={isSaving} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl font-black text-xs mb-3 flex items-center justify-center gap-2 hover:scale-105 transition-all">
                <Rocket size={14}/> {isSaving ? 'מפרסם...' : 'פרסם אפליקציה'}
             </button>
             <button onClick={toggleTheme} className="w-full py-4 border-2 border-slate-100 dark:border-white/10 rounded-2xl font-black text-xs flex items-center justify-center gap-2">
                {isDarkMode ? <Sun size={14}/> : <Moon size={14}/>} {isDarkMode ? 'מצב יום' : 'מצב לילה'}
             </button>
          </div>
        </div>

        {/* CANVAS (iPhone) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-slate-200/20 dark:bg-black/20 rounded-[5rem] border border-dashed border-slate-300 dark:border-white/5">
          <div className="absolute top-8 px-6 py-2 bg-white dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm z-10 flex items-center gap-3">
             <CheckCircle2 size={16} className="text-green-500" />
             <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Studio Live Sync</span>
          </div>

          <div className="w-[315px] h-[630px] bg-black rounded-[4rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-black/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-30" />
            
            <div className={`w-full h-full p-6 pt-14 transition-all duration-700 ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
              <div className="text-center mb-10">
                <div className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${isDarkMode ? 'bg-white/5' : 'bg-slate-50 shadow-inner'}`}>
                  {selectedCat.icon}
                </div>
                <h3 className={`text-2xl font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{businessData?.businessName || 'העסק שלי'}</h3>
                <p className="text-[9px] opacity-40 uppercase mt-1 tracking-widest">SabanOS Premium Experience</p>
              </div>

              <div className="space-y-4">
                <div className="h-32 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center">
                  <span className="text-[10px] font-black opacity-20 uppercase tracking-widest text-center px-6">מקום לתוכן: {selectedCat.name}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                   <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl" />
                   <div className="aspect-square bg-slate-50 dark:bg-white/5 rounded-2xl" />
                </div>
                <button className="w-full py-5 bg-green-600 text-white rounded-[1.8rem] font-black shadow-lg shadow-green-500/20 active:scale-95 transition-all">
                  קבע תור עכשיו
                </button>
              </div>
            </div>

            {/* Nav Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 flex items-center justify-around px-4 z-20">
              <div className="flex flex-col items-center gap-1 text-green-500"><Home size={18}/><span className="text-[8px] font-black uppercase">בית</span></div>
              <div className="flex flex-col items-center gap-1 opacity-30 text-slate-400"><Scissors size={18}/><span className="text-[8px] font-black uppercase">קטלוג</span></div>
              <div className="flex flex-col items-center gap-1 opacity-30 text-slate-400"><BookOpen size={18}/><span className="text-[8px] font-black uppercase">בלוג</span></div>
            </div>
          </div>
        </div>

        {/* AI ORCHESTRATOR (ימין) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[4rem] p-10 flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-green-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                <Sparkles size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">Studio AI</h2>
                <div className="flex items-center gap-2 mt-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Listening</p></div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mb-8">
              <AnimatePresence mode="wait">
                {aiCanvasText && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-green-500/5 border-r-4 border-green-600 rounded-l-[2.5rem] shadow-inner">
                    <p className="text-xl font-bold leading-relaxed text-green-700 dark:text-green-400 font-mono italic">
                      {aiCanvasText}
                      <span className="inline-block w-2.5 h-6 bg-green-600 animate-pulse ml-2" />
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <textarea 
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  placeholder="כתוב הוראה לעיצוב..."
                  className="w-full h-32 bg-slate-50 dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner"
                />
                <button className="absolute bottom-4 left-4 p-4 bg-green-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all">
                  <Send size={20}/>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
