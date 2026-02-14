"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Layout, Palette, Sparkles, 
  Rocket, Coffee, BookOpen, Scissors, 
  Stethoscope, Briefcase, ChevronRight, 
  CheckCircle2, Lock, Sun, Moon, Clock, Check, Calendar 
} from "lucide-react"; // הוספתי את הייבוא החסר כאן

// קטגוריות לעמאר
const CATEGORIES = [
  { id: 'food', name: 'מזון ומשקאות', icon: <Coffee size={18}/> },
  { id: 'retail', name: 'חנויות וספרים', icon: <BookOpen size={18}/> },
  { id: 'barber', name: 'יופי וטיפוח', icon: <Scissors size={18}/> },
  { id: 'medical', name: 'רפואה וקליניקות', icon: <Stethoscope size={18}/> },
  { id: 'legal', name: 'משרדים וייעוץ', icon: <Briefcase size={18}/> },
];

export default function SabanOSV2Studio({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[2]); // דיפולט למספרה
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
    // הגנה על OneSignal ומניעת קריסה
    if (typeof window !== "undefined") {
      const win = window as any;
      if (win.OneSignal) {
        win.OneSignal.push(() => {
          if (win.OneSignal.Notifications) {
            console.log("OneSignal Studio Ready");
          }
        });
      }
    }

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
      typeToCanvas(`ברוך הבא עמאר. SabanOS v2.0 Studio הופעל במצב Premium. המוח מסונכרן ליומן ולעיצוב.`);
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
    }, 25);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black italic animate-pulse">SabanOS v2.0...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-500/20"><Lock size={32} /></div>
          <h2 className="text-3xl font-black mb-6 italic tracking-tighter uppercase text-slate-900 dark:text-white">Studio Access</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg">UNLOCK V2</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans selection:bg-green-500/30 overflow-x-hidden`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1850px] mx-auto pb-10 grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* SIDEBAR: TEMPLATES & ACTIONS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-8 shadow-sm">
            <h2 className="text-xl font-black italic flex items-center gap-2 mb-8">
              <Layout size={20} className="text-green-500" /> סטודיו עיצוב
            </h2>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <button 
                  key={cat.id} 
                  onClick={() => setSelectedCat(cat)}
                  className={`w-full p-5 rounded-[2rem] flex items-center justify-between group transition-all ${selectedCat.id === cat.id ? 'bg-green-600 text-white shadow-lg' : 'bg-slate-50 dark:bg-white/5 border border-transparent hover:border-green-500/30'}`}
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
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="w-full py-5 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[2.5rem] font-black text-xs flex items-center justify-center gap-3 shadow-sm">
            {isDarkMode ? <Sun size={16} className="text-yellow-400" /> : <Moon size={16} className="text-blue-600" />} {isDarkMode ? 'מצב יום' : 'מצב לילה'}
          </button>
        </div>

        {/* CENTER: IPHONE PREVIEW WITH LUXURY ANIMATIONS */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative bg-slate-200/20 dark:bg-black/20 rounded-[5rem] border border-dashed border-slate-300 dark:border-white/5 p-10">
          <div className="absolute top-8 px-6 py-2 bg-white dark:bg-white/10 rounded-full border border-slate-200 dark:border-white/10 backdrop-blur-xl shadow-sm z-10 flex items-center gap-3">
             <CheckCircle2 size={16} className="text-green-500" />
             <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Live Sync Active</span>
          </div>

          {/* IPHONE WITH BREATHING EFFECT */}
          <motion.div 
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="w-[320px] h-[640px] bg-black rounded-[4rem] border-[12px] border-slate-800 shadow-2xl relative overflow-hidden ring-4 ring-black/10"
          >
            {/* LUXURY SHIMMER LAYER */}
            <motion.div
              className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{ x: ["-150%", "150%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
            />

            <div className={`w-full h-full p-6 pt-14 relative z-10 ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
               <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-500/10 rounded-2xl mx-auto mb-4 flex items-center justify-center text-green-600">{selectedCat.icon}</div>
                  <h3 className="text-2xl font-black italic">{businessData?.businessName}</h3>
                  <p className="text-[10px] opacity-40 font-bold uppercase tracking-tighter">Powered by SabanOS</p>
               </div>

               {/* COMPACT CALENDAR PREVIEW */}
               <div className="space-y-4">
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                     {[1,2,3,4,5].map(i => (
                        <div key={i} className={`min-w-[50px] py-3 rounded-2xl border text-center text-xs font-bold ${i === 1 ? 'bg-green-600 text-white' : 'bg-slate-50'}`}>{i+14}</div>
                     ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                     {["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"].map((time, idx) => (
                        <motion.button 
                          key={time} 
                          onClick={() => setSelectedSlot(time)}
                          animate={idx === 0 && !selectedSlot ? { scale: [1, 1.05, 1], borderColor: ["rgba(34,197,94,0.1)", "rgba(34,197,94,0.6)", "rgba(34,197,94,0.1)"] } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                          className={`py-3 rounded-xl text-[10px] font-black border transition-all ${selectedSlot === time ? 'bg-slate-900 text-white' : 'bg-white/50 border-black/5'}`}
                        >
                           {time}
                        </motion.button>
                     ))}
                  </div>
               </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: AI ORCHESTRATOR CANVAS */}
        <div className="lg:col-span-4 h-full min-h-[750px]">
           <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[4rem] p-10 h-full flex flex-col shadow-2xl relative overflow-hidden">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg"><Sparkles size={24}/></div>
                <div>
                   <h2 className="text-2xl font-black italic tracking-tighter uppercase">AI Designer</h2>
                   <div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/><p className="text-[10px] text-green-600 font-black uppercase">Studio Active</p></div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto mb-8">
                 <AnimatePresence>
                   {aiCanvasText && (
                     <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-green-600/5 dark:bg-green-600/10 border-r-4 border-green-600 rounded-l-[2rem]">
                        <p className="text-xl font-bold leading-relaxed text-green-700 dark:text-green-400 font-mono italic">
                          {aiCanvasText}
                          <span className="inline-block w-2.5 h-6 bg-green-600 animate-pulse ml-2" />
                        </p>
                     </motion.div>
                   )}
                 </AnimatePresence>
              </div>
              <div className="relative">
                 <textarea placeholder="תגיד ל-AI מה לשנות..." className="w-full h-32 bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner" />
                 <button className="absolute bottom-4 left-4 p-4 bg-green-600 text-white rounded-2xl shadow-xl hover:scale-110 transition-all"><Rocket size={20}/></button>
              </div>
           </div>
        </div>

      </div>
    </main>
  );
}
