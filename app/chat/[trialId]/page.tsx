"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Calendar, Plus, Sun, Moon, 
  Layout, Palette, Eye, Rocket, Check,
  MessageSquare, UserPlus, Share2, Activity, Sparkles, Lock 
} from "lucide-react";

// הגדרת תבניות העיצוב (היסוד ל-Mini Wix)
const TEMPLATES = [
  { id: 'urban', name: 'אורבן ניאון', color: 'bg-green-500', text: 'text-green-500', border: 'border-green-500/20' },
  { id: 'luxury', name: 'יוקרה זהב', color: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500/20' },
  { id: 'minimal', name: 'מינימל נקי', color: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500/20' }
];

export default function SabanOSDesignerStudio({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'brain' | 'design' | 'customers'>('brain');
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0]);
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
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
      typeToCanvas(`ברוך הבא למעבדת העיצוב, עמאר. המוח מוכן להלביש את המותג שלך על התבניות החדשות. איזה סטייל נבחר היום?`);
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

  const saveTemplateSelection = async (tpl: any) => {
    setSelectedTemplate(tpl);
    const docRef = doc(db, "trials", params.trialId);
    await updateDoc(docRef, { activeTemplate: tpl.id });
    typeToCanvas(`מעולה! בחרת בסטייל "${tpl.name}". אני מעדכן את דף הנחיתה והקטלוג שלך ברגע זה...`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#020617] text-green-600 font-black animate-pulse">SabanOS Designer...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[4rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2rem] mx-auto mb-8 flex items-center justify-center text-white"><Lock size={32} /></div>
          <h2 className="text-3xl font-black mb-6 italic uppercase tracking-tighter">Enter Designer</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-100 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-3xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-3xl text-xl shadow-lg">OPEN STUDIO</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1800px] mx-auto pb-20">
        
        {/* DESIGNER TOOLBAR */}
        <div className="flex items-center justify-between mb-10 bg-white dark:bg-white/5 p-6 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-3xl ${selectedTemplate.color} flex items-center justify-center shadow-lg transition-all duration-500`}>
              <Layout className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">{businessData?.businessName} DESIGNER</h1>
              <div className="flex gap-4 mt-2">
                {['brain', 'design', 'customers'].map((tab) => (
                  <button 
                    key={tab} 
                    onClick={() => setActiveTab(tab as any)}
                    className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full transition-all ${activeTab === tab ? 'bg-green-500 text-black shadow-lg' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}
                  >
                    {tab === 'brain' ? 'ניהול מוח' : tab === 'design' ? 'סטודיו עיצוב' : 'לקוחות'}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-4 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10">
            {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-600" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* סרגל הכלים של עמאר (ה-Sidebar של Wix) */}
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-8 shadow-sm">
              <h3 className="text-lg font-black mb-6 flex items-center gap-3 italic"><Palette className="text-green-500" /> בחר תבנית דף</h3>
              <div className="space-y-4">
                {TEMPLATES.map((tpl) => (
                  <button 
                    key={tpl.id} 
                    onClick={() => saveTemplateSelection(tpl)}
                    className={`w-full p-6 rounded-[2rem] border-2 transition-all flex items-center justify-between group ${selectedTemplate.id === tpl.id ? 'border-green-500 bg-green-500/5' : 'border-transparent bg-slate-50 dark:bg-black/20'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-4 h-4 rounded-full ${tpl.color}`} />
                      <span className="font-black italic text-sm">{tpl.name}</span>
                    </div>
                    {selectedTemplate.id === tpl.id && <Check size={18} className="text-green-500" />}
                  </button>
                ))}
              </div>

              <div className="mt-10 pt-10 border-t border-slate-100 dark:border-white/5">
                <h3 className="text-lg font-black mb-6 flex items-center gap-3 italic"><Sparkles className="text-green-500" /> כלים חכמים</h3>
                <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-black font-black py-4 rounded-2xl mb-4 flex items-center justify-center gap-2 hover:scale-105 transition-all">
                  <Rocket size={18} /> פרסם דף נחיתה
                </button>
                <button className="w-full border-2 border-slate-200 dark:border-white/10 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all">
                  <Eye size={18} /> תצוגה מקדימה
                </button>
              </div>
            </div>
          </div>

          {/* קנבס התצוגה המקדימה (המרכז) */}
          <div className="lg:col-span-5">
            <div className={`bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[4rem] p-2 shadow-2xl h-full min-h-[700px] flex flex-col transition-all duration-700 overflow-hidden`}>
              <div className="p-6 text-center border-b border-slate-100 dark:border-white/5">
                <div className="flex gap-1 justify-center mb-2">
                  <div className="w-2 h-2 rounded-full bg-red-400" />
                  <div className="w-2 h-2 rounded-full bg-yellow-400" />
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <p className="text-[10px] font-mono opacity-30 italic">PREVIEW MODE: MOBILE RESPONSIVE</p>
              </div>

              {/* גוף התצוגה המקדימה - המוח מלביש את הנתונים כאן */}
              <div className="flex-1 overflow-y-auto p-10 bg-slate-50 dark:bg-black/40 m-4 rounded-[3rem] shadow-inner">
                <div className="max-w-xs mx-auto space-y-8">
                  <div className="text-center">
                    <div className={`w-20 h-20 mx-auto rounded-3xl ${selectedTemplate.color} mb-6 shadow-2xl flex items-center justify-center text-3xl font-black text-white italic`}>
                      {businessData?.logoUrl ? <img src={businessData.logoUrl} className="w-full h-full object-cover rounded-3xl" /> : businessData?.businessName?.[0]}
                    </div>
                    <h2 className={`text-2xl font-black italic ${selectedTemplate.text}`}>{businessData?.businessName}</h2>
                    <p className="text-xs opacity-50 mt-2">מספרה וטיפוח ברמה הגבוהה ביותר</p>
                  </div>

                  <div className={`p-6 rounded-3xl border ${selectedTemplate.border} bg-white dark:bg-white/5`}>
                    <h4 className="text-xs font-black uppercase tracking-widest mb-4 opacity-40 italic">מחירון שירותים</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm font-bold"><span>תספורת גבר</span><span>₪60</span></div>
                      <div className="flex justify-between text-sm font-bold"><span>עיצוב זקן</span><span>₪40</span></div>
                      <div className={`h-1 w-10 ${selectedTemplate.color} rounded-full`} />
                    </div>
                  </div>

                  <button className={`w-full py-4 rounded-2xl ${selectedTemplate.color} text-white font-black shadow-lg shadow-current/20`}>
                    קבע תור בוואטסאפ
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* המוח המאזין (ימין) */}
          <div className="lg:col-span-4 h-full">
            <div className="bg-white dark:bg-[#0b141a] border-4 border-slate-200 dark:border-white/10 rounded-[5rem] h-full shadow-2xl flex flex-col relative overflow-hidden">
              <div className="bg-slate-50 dark:bg-[#1f2c34] p-10 flex items-center gap-5 border-b border-slate-200 dark:border-white/5">
                <div className={`w-16 h-16 rounded-[2rem] ${selectedTemplate.color} flex items-center justify-center font-black text-white text-3xl italic transition-all duration-700`}>AI</div>
                <div>
                  <h3 className="font-black text-2xl italic tracking-tighter uppercase leading-none mb-1">AI Designer</h3>
                  <div className="flex items-center gap-2 italic"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-[10px] text-green-600 font-black uppercase tracking-widest">Live Sync</p></div>
                </div>
              </div>
              <div className="flex-1 p-12 overflow-y-auto">
                <AnimatePresence>
                  {aiCanvasText && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`p-10 bg-white dark:bg-white/5 border-r-4 ${selectedTemplate.border} rounded-l-[3rem] shadow-sm`}>
                      <p className={`text-2xl font-bold leading-snug ${selectedTemplate.text} font-mono italic tracking-tight`}>
                        {aiCanvasText}
                        <span className={`inline-block w-2.5 h-8 ${selectedTemplate.color} animate-pulse ml-3 align-middle`} />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="mt-10 opacity-30"><MessageSquare size={40} /></div>
              </div>
              <div className="p-10 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5 flex gap-4">
                <div className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-[2rem] p-5 text-xs font-black opacity-20 uppercase tracking-widest italic">AI Studio Syncing...</div>
                <div className={`p-5 rounded-[2rem] ${selectedTemplate.color} text-white shadow-xl shadow-current/20`}><Plus size={24} /></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
