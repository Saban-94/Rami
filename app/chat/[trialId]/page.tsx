"use client";

import React, { useState, useEffect, useRef } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import ChatInterface from "../../../components/ChatInterface";
import Navigation from "../../../components/Navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Sparkles, Lock, MessageSquare, 
  Paperclip, Image as ImageIcon, Send, 
  Trash2, Edit3, CheckCircle2, History 
} from "lucide-react";

export default function ProtectedChatPage({ params }: { params: { trialId: string } }) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [inputCode, setInputCode] = useState("");
  const [businessData, setBusinessData] = useState<any>(null);
  const [extraContext, setExtraContext] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showAiFeedback, setShowAiFeedback] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleVerify = () => {
    if (inputCode === businessData?.accessCode) {
      new Audio("/sounds/whatsapp.mp3").play().catch(() => {});
      setIsAuthorized(true);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // כאן נשתמש ב-URL זמני להמחשה (במציאות תעלה ל-Storage)
    const fakeUrl = URL.createObjectURL(file);
    const docRef = doc(db, "trials", params.trialId);
    await updateDoc(docRef, { logoUrl: fakeUrl });
    setBusinessData({ ...businessData, logoUrl: fakeUrl });
    
    typeMessage("וואו! הלוגו החדש נראה מדהים. עדכנתי אותו בראש המערכת שלך.");
  };

  const typeMessage = (text: string) => {
    setAiMessage("");
    setShowAiFeedback(true);
    let i = 0;
    const interval = setInterval(() => {
      setAiMessage((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        setTimeout(() => setShowAiFeedback(false), 5000);
      }
    }, 40);
  };

  const saveAITraining = async () => {
    setIsSaving(true);
    const docRef = doc(db, "trials", params.trialId);
    const timestamp = new Date().toLocaleString('he-IL');
    
    await updateDoc(docRef, { 
      businessContext: extraContext,
      trainingHistory: arrayUnion({ text: extraContext, date: timestamp })
    });

    setBusinessData({
      ...businessData,
      trainingHistory: [...(businessData.trainingHistory || []), { text: extraContext, date: timestamp }]
    });

    new Audio("/sounds/whatsapp.mp3").play().catch(() => {});
    typeMessage(`היי ${businessData.fullName}, עדכנתי את המוח בנתונים החדשים. שמרתי אותם גם בטבלת הזיכרון שלי למטה.`);
    setIsSaving(false);
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-green-500 animate-pulse text-2xl italic font-black">SabanOS...</div>;

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4" dir="rtl">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white/5 border border-white/10 p-10 rounded-[3rem] max-w-sm w-full text-center backdrop-blur-3xl">
          <div className="w-20 h-20 bg-green-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-2xl">
            <Lock className="text-black" size={32} />
          </div>
          <h2 className="text-2xl font-black text-white italic mb-8">כניסת עסק מורשה</h2>
          <input 
            type="password" 
            maxLength={4}
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-5 text-center text-3xl tracking-[15px] text-green-500 outline-none focus:border-green-500 mb-6"
            placeholder="****"
          />
          <button onClick={handleVerify} className="w-full bg-green-500 text-black font-black py-4 rounded-2xl">פתח מערכת</button>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#020617] text-white" dir="rtl">
      <Navigation />
      
      {/* HEADER עסקי דינמי */}
      <div className="pt-24 px-6 max-w-7xl mx-auto flex items-center justify-between mb-12">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 rounded-[2rem] bg-green-500/20 border-2 border-green-500/30 overflow-hidden shadow-2xl transition-transform group-hover:scale-105">
              {businessData?.logoUrl ? (
                <img src={businessData.logoUrl} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-3xl font-black italic text-green-500">
                  {businessData?.businessName?.[0]}
                </div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 bg-white text-black p-2 rounded-full shadow-xl hover:bg-green-500 transition-colors"
            >
              <Paperclip size={14} />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter">{businessData?.businessName}</h1>
            <p className="text-green-500 font-bold text-sm">ה-AI שלך מחובר ומוכן לעבודה ✅</p>
          </div>
        </div>
      </div>

      <div className="px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
        
        {/* מרכז האימון והזיכרון */}
        <div className="lg:col-span-7 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <Brain className="text-green-500" size={24} />
              <h2 className="text-xl font-black italic">עדכון המוח של {businessData?.fullName}</h2>
            </div>
            <textarea 
              value={extraContext}
              onChange={(e) => setExtraContext(e.target.value)}
              className="w-full h-48 bg-black/40 border border-white/10 rounded-3xl p-6 text-white outline-none focus:border-green-500 mb-6 transition-all"
              placeholder="למשל: תספורת עולה 60 ש''ח, ימי שלישי סגור..."
            />
            <button onClick={saveAITraining} className="w-full bg-green-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 hover:shadow-2xl transition-all">
              {isSaving ? "מעבד נתונים..." : "עדכן מוח וזיכרון"} <Sparkles size={20} />
            </button>
          </div>

          {/* טבלת היסטוריית למידה */}
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6 text-white/50">
              <History size={20} />
              <h3 className="font-bold">מה ה-AI שלי כבר יודע?</h3>
            </div>
            <div className="space-y-4">
              {businessData?.trainingHistory?.map((item: any, i: number) => (
                <div key={i} className="flex items-start justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group">
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-relaxed mb-2 opacity-80">{item.text}</p>
                    <span className="text-[10px] uppercase tracking-widest opacity-30">{item.date}</span>
                  </div>
                  <button onClick={() => setExtraContext(item.text)} className="p-2 opacity-0 group-hover:opacity-100 transition-opacity text-green-500">
                    <Edit3 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* סימולטור וואטסאפ חי */}
        <div className="lg:col-span-5 h-[700px]">
          <div className="bg-[#0b141a] border-[12px] border-slate-900 rounded-[3.5rem] h-full flex flex-col shadow-2xl relative overflow-hidden">
            <div className="bg-[#1f2c34] p-4 pt-10 flex items-center gap-3 border-b border-white/5">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-black text-black">AI</div>
              <div>
                <p className="text-white text-sm font-bold">סוכן המכירות של {businessData?.businessName}</p>
                <p className="text-[10px] text-green-500">מחובר ומוכן לעבודה</p>
              </div>
            </div>
            <div className="flex-1 overflow-hidden relative">
              <ChatInterface trialId={params.trialId} />
              
              <AnimatePresence>
                {showAiFeedback && (
                  <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="absolute bottom-4 left-4 right-4 z-50">
                    <div className="bg-green-500 text-black p-4 rounded-2xl shadow-2xl text-xs font-bold leading-tight">
                      {aiMessage}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
