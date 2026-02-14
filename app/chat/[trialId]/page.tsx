"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, Layout, Palette, Sparkles, 
  Rocket, Coffee, BookOpen, Scissors, 
  CheckCircle2, Lock, Sun, Moon,
  Home, Send, Plus, Box, MessageSquare, Megaphone, Zap, TrendingUp
} from "lucide-react";

// תוספת של המודלים מהקופיילוט
import { UnlockModal } from "../../../components/UnlockModal";
import { PricingSheet } from "../../../components/PricingSheet";

export default function SabanOSStudioV2_5({ params }: { params: { trialId: string } }) {
  // States לניהול המערכת
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [loading, setLoading] = useState(true);
  
  // States לניהול ה-Trial והשדרוגים
  const [showUnlock, setShowUnlock] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [usage, setUsage] = useState({ pages: 1, maxPages: 3, images: 4, maxImages: 10 });

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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      setIsAuthorized(true);
      typeToCanvas(`ברוך הבא עמאר. סרגל הכלים של SabanOS v2.5 הופעל. שים לב: נותרו לך עוד ${usage.maxPages - usage.pages} דפים בחבילת הניסיון.`);
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black animate-pulse">SabanOS v2.5...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center text-white shadow-xl shadow-green-500/20"><Lock size={32} /></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 italic uppercase tracking-tighter">Enter Studio v2.5</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-50 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg">UNLOCK TOOLS</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans selection:bg-green-500/30 overflow-x-hidden`} dir="rtl">
      <Navigation />
      
      <div className="pt-24 px-8 max-w-[1850px] mx-auto pb-32">
        
        {/* TOP STATUS BAR */}
        <div className="flex items-center justify-between mb-8 bg-white dark:bg-white/5 p-6 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-green-500/10 rounded-2xl text-green-600"><TrendingUp size={20}/></div>
             <div>
                <p className="text-[10px] font-black uppercase text-slate-400">סטטוס חבילה</p>
                <p className="text-sm font-bold">10 ימי ניסיון (Trial Mode)</p>
             </div>
          </div>
          
          {/* USAGE PROGRESS */}
          <div className="flex items-center gap-8">
             <div className="hidden md:block">
                <div className="flex justify-between text-[10px] font-black mb-1 opacity-40 uppercase italic">
                   <span>דפים פנימיים</span>
                   <span>{usage.pages}/{usage.maxPages}</span>
                </div>
                <div className="w-48 h-1.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${(usage.pages / usage.maxPages) * 100}%` }} className="h-full bg-green-500" />
                </div>
             </div>
             <button onClick={() => setShowPricing(true)} className="px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl text-xs font-black hover:scale-105 transition-all shadow-lg">שדרג עכשיו</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* ה-iPhone וה-AI Canvas נשארים במרכז ובצדדים כפי שהיה */}
          <div className="lg:col-span-8 bg-white/50 dark:bg-black/20 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-white/5 min-h-[600px] flex items-center justify-center relative overflow-hidden">
             {/* iPhone Preview (המקום שבו האפליקציה נבנית) */}
             <div className="w-[300px] h-[600px] bg-black rounded-[4rem] border-[10px] border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-800 rounded-b-3xl z-30" />
                <div className={`w-full h-full p-6 pt-12 ${isDarkMode ? 'bg-[#0b141a]' : 'bg-white'}`}>
                   <h3 className="text-xl font-black italic text-center mb-8">{businessData?.businessName}</h3>
                   <div className="h-40 bg-slate-100 dark:bg-white/5 rounded-3xl mb-4 border border-dashed border-slate-300 flex items-center justify-center opacity-30 italic text-xs uppercase font-black">App Content Here</div>
                   <button className="w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg">קבע תור</button>
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 h-full">
            <div className="bg-white dark:bg-[#0b141a] border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 h-full flex flex-col shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <Sparkles className="text-green-500" size={24} />
                <h2 className="text-2xl font-black italic uppercase tracking-tighter">AI Designer</h2>
              </div>
              <div className="flex-1 overflow-y-auto mb-8 bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/5">
                <p className="text-lg font-bold leading-relaxed text-green-700 dark:text-green-400 font-mono italic">
                  {aiCanvasText || "ממתין לפקודה שלך, עמאר..."}
                </p>
              </div>
              <div className="relative">
                <textarea 
                  placeholder="למשל: 'תעצב לי את האפליקציה בסטייל יוקרתי'..."
                  className="w-full h-32 bg-white dark:bg-black/60 border border-slate-200 dark:border-white/10 rounded-[2rem] p-6 text-sm outline-none focus:ring-2 ring-green-500 transition-all resize-none shadow-inner"
                />
                <button className="absolute bottom-4 left-4 p-4 bg-green-600 text-white rounded-2xl shadow-xl hover:scale-105 transition-all"><Send size={20}/></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ה-GLASS TOOLBAR - הלב של הסטודיו v2.5 */}
      <motion.div 
        initial={{ y: 100 }} 
        animate={{ y: 0 }} 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/60 dark:bg-black/60 backdrop-blur-2xl border border-white/30 dark:border-white/10 px-6 py-3 rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center gap-4"
      >
        <button onClick={() => typeToCanvas("פותח את בונה הדפים... מה תרצה להוסיף היום?")} className="flex flex-col items-center gap-1 group">
          <div className="p-3 bg-white dark:bg-white/10 rounded-2xl group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm"><Box size={20}/></div>
          <span className="text-[8px] font-black uppercase opacity-40">Builder</span>
        </button>

        <button onClick={() => typeToCanvas("עורך צ'אטבוט: רשום לי חוקים חדשים לבוט ואני אעדכן אותו.")} className="flex flex-col items-center gap-1 group">
          <div className="p-3 bg-white dark:bg-white/10 rounded-2xl group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm"><MessageSquare size={20}/></div>
          <span className="text-[8px] font-black uppercase opacity-40">Chatbot</span>
        </button>

        <button onClick={() => typeToCanvas("מנוע קמפיינים: שלח מבצע החודש לכל הלקוחות בוואטסאפ.")} className="flex flex-col items-center gap-1 group">
          <div className="p-3 bg-white dark:bg-white/10 rounded-2xl group-hover:bg-purple-500 group-hover:text-white transition-all shadow-sm"><Megaphone size={20}/></div>
          <span className="text-[8px] font-black uppercase opacity-40">Campaigns</span>
        </button>

        <div className="w-px h-8 bg-slate-300 dark:bg-white/10 mx-2" />

        <button onClick={() => {
          if (usage.pages >= usage.maxPages) setShowUnlock(true);
          else setUsage({...usage, pages: usage.pages + 1});
        }} className="flex flex-col items-center gap-1 group">
          <div className="p-3 bg-green-600 text-white rounded-2xl hover:scale-110 transition-all shadow-lg shadow-green-500/30"><Plus size={20}/></div>
          <span className="text-[8px] font-black uppercase text-green-500">Add Page</span>
        </button>

        <button onClick={() => setShowPricing(true)} className="flex flex-col items-center gap-1 group">
          <div className="p-3 bg-slate-900 dark:bg-white text-white dark:text-black rounded-2xl hover:scale-110 transition-all shadow-lg"><Rocket size={20}/></div>
          <span className="text-[8px] font-black uppercase opacity-40">Publish</span>
        </button>
      </motion.div>

      {/* מודלים של ה-Paywall */}
      <UnlockModal 
        open={showUnlock} 
        type="pages" 
        limits={{ pages: 3, images: 10 }} 
        current={{ pages: 3, images: usage.images }} 
        plan="trial" 
        onClose={() => setShowUnlock(false)} 
        onUpgrade={() => { setShowUnlock(false); setShowPricing(true); }} 
      />
      <PricingSheet 
        open={showPricing} 
        currentPlan="trial" 
        onClose={() => setShowPricing(false)} 
        onCheckout={(plan) => {
          alert(`שדרוג ל-${plan} יופעל בקרוב!`);
          setShowPricing(false);
        }} 
      />
    </main>
  );
}
