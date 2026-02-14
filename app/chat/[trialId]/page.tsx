"use client";

import React, { useState, useEffect } from "react";
import { db } from "../../../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
import { Layout, Sparkles, Rocket, Lock, Settings, Layers } from "lucide-react";

export default function SabanOSStudioV3({ params }: { params: { trialId: string } }) {
  const [businessData, setBusinessData] = useState<any>(null);
  const [activeVertical, setActiveVertical] = useState<string>("general");
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      const snap = await getDoc(doc(db, "trials", params.trialId));
      if (snap.exists()) {
        const data = snap.data();
        setBusinessData(data);
        setActiveVertical(data.industry || "general");
      }
    };
    fetchBusiness();
  }, [params.trialId]);

  // סינון כלים לפי ורטיקל - "ליטוש יהלום"
  const getAvailableTools = () => {
    const tools = {
      barber: ['Appointments', 'Gallery', 'Staff'],
      retail: ['Catalog', 'Inventory', 'Sales'],
      vet: ['Patient Records', 'Vaccines', 'Urgent Call'],
    };
    return tools[activeVertical as keyof typeof tools] || ['Basic Info', 'Contact'];
  };

  return (
    <main className="min-h-screen bg-[#0C0C0D] text-white flex">
      {/* Sidebar - Contextual UI */}
      <aside className="w-80 border-l border-white/5 bg-black/20 backdrop-blur-xl p-8 flex flex-col gap-8">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center font-black">S</div>
          <h2 className="text-xl font-black italic tracking-tighter uppercase">SabanOS Studio</h2>
        </div>

        <div className="space-y-2">
          <p className="text-[10px] font-black uppercase opacity-30 tracking-widest mb-4">ניהול ורטיקלי: {activeVertical}</p>
          {getAvailableTools().map((tool) => (
            <motion.button 
              key={tool}
              whileHover={{ x: -5 }}
              className="w-full p-4 rounded-2xl bg-white/5 border border-transparent hover:border-green-500/30 flex items-center justify-between group"
            >
              <span className="font-bold italic text-sm">{tool}</span>
              <Layers size={14} className="opacity-20 group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </aside>

      {/* Main Preview Area */}
      <section className="flex-1 p-12 flex items-center justify-center">
        {/* iPhone Preview Frame עם הזרקה נקייה */}
        <div className="w-[380px] h-[780px] bg-black rounded-[4rem] border-[12px] border-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden ring-1 ring-white/10">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-8 bg-slate-900 rounded-b-3xl z-50" />
           {/* כאן מתרנדרת האפליקציה של הלקוח */}
           <div className="w-full h-full bg-white p-8 pt-16 text-black text-center">
              <h3 className="text-2xl font-black italic mb-2">{businessData?.businessName}</h3>
              <div className="w-20 h-1 bg-green-500 mx-auto mb-10" />
              <div className="space-y-4">
                <div className="h-40 bg-slate-100 rounded-3xl animate-pulse" />
                <div className="h-20 bg-slate-100 rounded-3xl" />
              </div>
           </div>
        </div>
      </section>

      {/* AI Orchestrator Side */}
      <aside className="w-[450px] p-8 border-r border-white/5 flex flex-col">
        <div className="bg-green-600/5 border border-green-600/20 rounded-[3rem] p-8 flex-1 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <Sparkles className="text-green-500" size={24} />
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">AI Designer</h2>
          </div>
          {/* מנטור חכם מובנה */}
          <div className="text-green-700/80 dark:text-green-400 font-mono text-sm leading-relaxed italic">
            "עמאר, זיהיתי שאתה מקים מספרה. הזרקתי לך את דף התורים והקטלוג. מה הצעד הבא?"
          </div>
        </div>
      </aside>
    </main>
  );
}
