"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Layout, Palette, Sparkles, Rocket, 
  Check, ChevronLeft, Calendar, Clock, Lock, 
  Sun, Moon, Coffee, BookOpen, Scissors, 
  Stethoscope, Briefcase, ChevronRight, User, Send
} from "lucide-react";
import { format, addDays, isSameDay, startOfDay } from "date-fns";
import { he } from "date-fns/locale";

// --- קטגוריות ותבניות ---
const CATEGORIES = [
  { id: 'barber', name: 'יופי וטיפוח', icon: <Scissors size={18}/> },
  { id: 'food', name: 'מזון ומשקאות', icon: <Coffee size={18}/> },
  { id: 'retail', name: 'חנויות וספרים', icon: <BookOpen size={18}/> },
  { id: 'medical', name: 'רפואה וקליניקות', icon: <Stethoscope size={18}/> },
  { id: 'legal', name: 'משרדים וייעוץ', icon: <Briefcase size={18}/> },
];

export default function SabanOSProductionStudio({ params }: { params: { trialId: string } }) {
  // --- States ---
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [aiCanvasText, setAiCanvasText] = useState("");

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- Initial Setup ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioRef.current = new Audio("/sounds/whatsapp.mp3");
    }
    const fetchDoc = async () => {
      try {
        const docRef = doc(db, "trials", params.trialId);
        const snap = await getDoc(docRef);
        if (snap.exists()) setBusinessData(snap.data());
      } catch (err) { console.error("Firebase Error:", err); }
      setLoading(false);
    };
    fetchDoc();
  }, [params.trialId]);

  // --- AI Canvas Typing Effect ---
  const typeToCanvas = (text: string) => {
    setAiCanvasText("");
    let i = 0;
    const interval = setInterval(() => {
      setAiCanvasText((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 25);
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`מערכת SabanOS Studio באוויר. המוח מוכן לעצב עבור ${businessData?.businessName || 'העסק'}.`);
    } else {
      alert("קוד גישה לא תקין");
    }
  };

  // --- Success Handler with Dynamic Confetti (Safe for Build) ---
  const triggerSuccess = async () => {
    setIsSuccess(true);
    try {
      // טעינה דינמית לפתרון שגיאת Vercel
      const confetti = (await import("canvas-confetti")).default;
      const count = 200;
      const defaults = { origin: { y: 0.7 }, zIndex: 1000 };
      const fire = (particleRatio: number, opts: any) => {
        confetti({ ...defaults, ...opts, particleCount: Math.floor(count * particleRatio), colors: ['#22c55e', '#ffffff', '#fbbf24'] });
      };
      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    } catch (e) {
      console.log("Confetti library not installed, skipping animation.");
    }
    typeToCanvas("התור שוריין בהצלחה! שלחתי הודעת אישור ללקוח ועדכנתי את יומן גוגל.");
  };

  const weekDays = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(startOfDay(new Date()), i)), []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black animate-pulse text-2xl italic">SabanOS Studio...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-24 h-24 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-500/20"><Lock size={40} /></div>
          <h2 className="text-3xl font-black mb-6 italic tracking-tighter uppercase">Studio Access</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg hover:bg-green-700 transition-all uppercase">Open Studio</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1850px] mx-auto pb-10 grid grid-cols-1 lg:grid-cols-12 gap-10 h-[calc(100vh-120px)]">
        
        {/* --- 1. Sidebar: Templates & Theme --- */}
        <div className="lg:col-span-3 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black italic mb-8 flex items-center gap-2">
              <Layout size={20} className="text-green-500" /> ספריית הזרקה
            </h2>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => { setSelectedCat(cat); typeToCanvas(`הזרקתי את דפי ה-${cat.name} לאייפון.`); }} 
                  className={`w-full p-5 rounded-[2rem] flex items-center justify-between transition-all ${selectedCat.id === cat.id ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 hover:border-green-500/30'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl ${selectedCat.id === cat.id ? 'bg-white/20' : 'bg-white dark:bg-white/10'}`}>{cat.icon}</div>
                    <span className="text-sm font-black italic">{cat.name}</span>
                  </div>
                  <ChevronRight size={16} className={selectedCat.id === cat.id ? 'opacity-100' : 'opacity-20'} />
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full py-6 bg-slate-900 dark:bg-white text-white dark:text-black rounded-[2.5rem] font-black flex items-center justify-center gap-3 shadow-xl uppercase tracking-tighter">
            {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>

        {/* --- 2. Center: iPhone Preview Canvas --- */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-slate-200/20 dark:bg-black/20 rounded-[5rem] border border-dashed border-slate-300 dark:border-white/5">
          <div className="w-[320px] h-[640px] bg-black rounded-[4rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-black/10">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-800 rounded-b-3xl z-30" />
            <div className={`w-full h-full p-6 pt-14 transition-all duration-700 overflow-y-auto ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
              
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-black italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{businessData?.businessName}</h3>
                <p className="text-[10px] opacity-40 uppercase tracking-widest italic">Live App Preview</p>
              </div>

              {/* יומן פרימיום */}
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar mb-6">
                {weekDays.map(d => (
                  <button key={d.toISOString()} onClick={() => setSelectedDate(d)} 
                    className={`min-w-[60px] py-4 rounded-2xl border transition-all ${isSameDay(d, selectedDate) ? 'bg-green-600 text-white border-green-500 shadow-lg' : 'bg-slate-50 dark:bg-white/5 text-slate-400'}`}>
                    <span className="text-[10px] block font-bold">{format(d, "EEE", { locale: he })}</span>
                    <span className="text-lg font-black">{format(d, "d")}</span>
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {["09:00", "10:00", "11:00", "12:00", "15:00", "16:00"].map(t => (
                  <button key={t} onClick={() => setSelectedSlot(t)} 
                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${selectedSlot === t ? 'bg-slate-900 text-white dark:bg-white dark:text-black scale-105 shadow-lg' : 'bg-white/50 dark:bg-white/5 border-slate-100 dark:border-white/5'}`}>
                    {t}
                  </button>
                ))}
              </div>

              <button disabled={!selectedSlot || isSuccess} onClick={triggerSuccess} 
                className={`w-full mt-8 py-5 rounded-3xl font-black transition-all ${selectedSlot && !isSuccess ? 'bg-green-600 text-white shadow-xl' : 'bg-slate-100 text-slate-300'}`}>
                {isSuccess ? 'תור שוריין!' : `הזמן ל-${selectedSlot || '...'}`}
              </button>
            </div>

            {/* Bottom Tab Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-slate-100 dark:border-white/5 flex items-center justify-around px-4">
              <div className="flex flex-col items-center gap-1 text-green-500"><Smartphone size={18}/><span className="text-[8px] font-black uppercase tracking-tighter">דף הבית</span></div>
              <div className="flex flex-col items-center gap-1 opacity-20"><Calendar size={18}/><span className="text-[8px] font-black uppercase tracking-tighter">תורים</span></div>
              <div className="flex flex-col items-center gap-1 opacity-20"><User size={18}/><span className="text-[8px] font-black uppercase tracking-tighter">פרופיל</span></div>
            </div>
          </div>
        </div>

        {/* --- 3. Right: AI Design Studio --- */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[4rem] p-10 flex-1 flex flex-col shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-green-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg"><Sparkles size={24} /></div>
              <div>
                <h2 className="text-2xl font-black italic tracking-tighter uppercase leading-none">AI Designer</h2>
                <div className="flex items-center gap-2 mt-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Core Active</p></div>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto mb-8">
              <AnimatePresence>
                {aiCanvasText && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-green-500/5 border-r-4 border-green-600 rounded-l-[3rem] shadow-inner relative">
                    <p className="text-xl font-bold leading-relaxed text-green-700 dark:text-green-400 font-mono italic">{aiCanvasText}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="relative">
              <textarea placeholder="תגיד ל-AI מה לעצב..." className="w-full h-32 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner" />
              <button className="absolute bottom-4 left-4 p-4 bg-green-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all"><Rocket size={20}/></button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
