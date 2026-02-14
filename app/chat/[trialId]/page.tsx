"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import Navigation from "../../../components/Navigation";
import ChatInterface from "../../../components/ChatInterface";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Calendar, Save, Plus, Sun, Moon, 
  MessageSquare, UserPlus, Share2, Trash2, 
  User, Smartphone, Activity, Sparkles 
} from "lucide-react";

export default function SabanOSStudio({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [extraContext, setExtraContext] = useState("");
  const [aiCanvasText, setAiCanvasText] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State ללקוח חדש
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", service: "תספורת" });
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  useEffect(() => {
    const fetchDoc = async () => {
      const docRef = doc(db, "trials", params.trialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const data = snap.data();
        setBusinessData(data);
        setExtraContext(data.businessContext || "");
      }
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
      typeToCanvas(`מערכת SabanOS Studio הופעלה. שלום עמאר, בוא נצרף את הלקוח הראשון שלך למערכת!`);
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

  // הוספת לקוח ל-Firestore
  const addFirstCustomer = async () => {
    if (!newCustomer.name || !newCustomer.phone) return alert("מלא שם וטלפון");
    setIsAddingCustomer(true);
    
    const docRef = doc(db, "trials", params.trialId);
    const customerObj = { ...newCustomer, id: Date.now() };
    
    await updateDoc(docRef, {
      customers: arrayUnion(customerObj)
    });
    
    setBusinessData({
      ...businessData,
      customers: [...(businessData.customers || []), customerObj]
    });
    
    setIsAddingCustomer(false);
    setNewCustomer({ name: "", phone: "", service: "תספורת" });
    typeToCanvas(`מעולה עמאר! הלקוח ${customerObj.name} נוסף בהצלחה. עכשיו אתה יכול לשתף לו את הקישור לתיאום תור.`);
  };

  const shareToCustomer = (customer: any) => {
    const message = encodeURIComponent(`היי ${customer.name}, כאן ${businessData.businessName}.\nשמרתי אותך במערכת שלי! מעכשיו אפשר לקבוע תור בקלות כאן: ${window.location.origin}/trial`);
    window.open(`https://wa.me/972${customer.phone.substring(1)}?text=${message}`, "_blank");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center dark:bg-[#020617] text-green-500 font-black italic animate-pulse">SabanOS Studio...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-12 rounded-[3.5rem] max-w-md w-full text-center shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-xl text-white"><Lock size={32} /></div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6 italic">SabanOS Studio</h2>
          <input type="password" maxLength={4} value={inputCode} onChange={(e) => setInputCode(e.target.value)} className="w-full bg-slate-100 dark:bg-black/40 border-2 border-slate-200 dark:border-white/10 rounded-2xl p-6 text-center text-4xl tracking-[15px] text-green-600 outline-none focus:border-green-500 mb-8" placeholder="****" />
          <button onClick={handleVerify} className="w-full bg-green-600 text-white font-black py-5 rounded-2xl text-xl">כניסה לסטודיו</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-[#F8FAFC] text-slate-900'} transition-colors duration-500 font-sans`} dir="rtl">
      <Navigation />
      
      <div className="pt-28 px-8 max-w-[1700px] mx-auto pb-20">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10 bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-[2rem] bg-green-500/10 border-2 border-green-500/20 overflow-hidden flex items-center justify-center">
              {businessData?.logoUrl ? <img src={businessData.logoUrl} className="w-full h-full object-cover" /> : <span className="text-4xl font-black italic text-green-600">{businessData?.businessName?.[0]}</span>}
            </div>
            <div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase">מספרת {businessData?.businessName}</h1>
              <p className="text-green-600 font-bold flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> SabanOS AI: ONLINE
              </p>
            </div>
          </div>
          <button onClick={toggleTheme} className="p-4 rounded-3xl bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 shadow-inner">
            {isDarkMode ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-600" />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* צד ימין: ניהול לקוחות (חדש!) */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2 italic"><UserPlus className="text-green-600" /> הוספת לקוח ראשון</h2>
              <div className="space-y-4">
                <input value={newCustomer.name} onChange={(e) => setNewCustomer({...newCustomer, name: e.target.value})} placeholder="שם הלקוח" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-green-500" />
                <input value={newCustomer.phone} onChange={(e) => setNewCustomer({...newCustomer, phone: e.target.value})} placeholder="מספר טלפון (05...)" className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl p-4 outline-none focus:border-green-500" />
                <button onClick={addFirstCustomer} disabled={isAddingCustomer} className="w-full bg-green-600 text-white font-black py-4 rounded-2xl hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Plus size={20} /> הוסף למערכת
                </button>
              </div>
            </div>

            {/* טבלת לקוחות חיה */}
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 shadow-sm overflow-hidden">
              <h3 className="text-lg font-black mb-6 opacity-50 flex items-center gap-2 italic"><Activity size={18}/> רשימת לקוחות</h3>
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {businessData?.customers?.map((customer: any) => (
                  <div key={customer.id} className="p-5 bg-slate-50 dark:bg-white/5 rounded-[2rem] border border-slate-100 dark:border-white/5 flex justify-between items-center group transition-all hover:border-green-500/30">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 font-bold italic">{customer.name[0]}</div>
                      <div>
                        <p className="font-black text-sm">{customer.name}</p>
                        <p className="text-[10px] opacity-40">{customer.phone}</p>
                      </div>
                    </div>
                    <button onClick={() => shareToCustomer(customer)} className="p-3 bg-green-600/10 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all shadow-sm">
                      <Share2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* מרכז: יומן חכם */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-[3.5rem] p-10 shadow-sm h-full">
              <div className="flex items-center justify-between mb-10 italic">
                <h2 className="text-2xl font-black flex items-center gap-3"><Calendar className="text-green-600" /> יומן סטודיו</h2>
                <div className="text-xs bg-green-600/10 text-green-600 px-3 py-1 rounded-full font-bold">FEBRUARY</div>
              </div>
              <div className="grid grid-cols-7 gap-3">
                {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                  <button key={day} onClick={() => typeToCanvas(`עמאר, בחרת את ה-${day} בחודש. יש לך כבר לקוח אחד שמתעניין בתאריך זה.`)} className="aspect-square rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center font-black text-lg hover:bg-green-600 hover:text-white transition-all">
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* צד שמאל: ה-Live AI Canvas */}
          <div className="lg:col-span-4">
            <div className="bg-white dark:bg-[#0b141a] border-4 border-slate-200 dark:border-white/10 rounded-[4.5rem] h-full shadow-2xl flex flex-col relative overflow-hidden">
              <div className="bg-slate-100 dark:bg-[#1f2c34] p-8 flex items-center gap-4 border-b border-slate-200 dark:border-white/5">
                <div className="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center font-black text-white text-2xl italic shadow-2xl">AI</div>
                <div>
                  <h3 className="font-black text-xl italic uppercase">Studio AI Live</h3>
                  <div className="flex items-center gap-2"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /><p className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Active Listening</p></div>
                </div>
              </div>

              <div className="flex-1 p-10 overflow-y-auto">
                <AnimatePresence>
                  {aiCanvasText && (
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-8 bg-green-600/5 dark:bg-green-600/10 border-r-4 border-green-600 rounded-l-[2rem] shadow-inner">
                      <p className="text-xl font-bold leading-relaxed text-green-700 dark:text-green-400 font-mono italic">
                        {aiCanvasText}
                        <span className="inline-block w-2 h-6 bg-green-600 animate-pulse ml-2" />
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-white/5 border-t border-slate-200 dark:border-white/5">
                <div className="flex gap-4">
                  <div className="flex-1 bg-white dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl p-4 text-sm font-bold italic opacity-30 italic">ה-AI מסנכרן נתונים...</div>
                  <div className="bg-green-600 p-4 rounded-2xl text-white shadow-lg"><MessageSquare size={20} /></div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
