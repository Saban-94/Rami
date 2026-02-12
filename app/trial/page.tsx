"use client";

import React from "react";
import { motion } from "framer-motion";
import Navigation from "../../components/Navigation";
import TrialRegistrationForm from "../../components/TrialRegistrationForm";
import { Zap, Clock, ShieldCheck } from "lucide-react";

export default function TrialPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />

      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
            הצטרף למהפכת ה-<span className="text-green-500">AI</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            10 ימי התנסות מלאה ב-SabanOS. בלי כרטיס אשראי. 
            פשוט מחברים את העסק ומתחילים לצמוח.
          </p>
        </motion.div>

        <div className="w-full grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <TrialRegistrationForm />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="space-y-10 py-6">
            <h3 className="text-2xl font-bold italic border-r-4 border-green-500 pr-4">מה תקבל בגרסת הניסיון?</h3>
            <div className="space-y-6">
               {[
                 { icon: <Zap />, title: "חיבור מיידי לוואטסאפ", desc: "בוט ה-AI ילמד את העסק שלך ויתחיל לענות ללקוחות." },
                 { icon: <Clock />, title: "זמינות 24/7", desc: "העסק שלך עונה גם כשאתה ישן או באמצע עבודה." },
                 { icon: <ShieldCheck />, title: "סגירת פניות אוטומטית", desc: "אנחנו נשפר את אחוז סגירת העסקאות כבר ביומיים הראשונים." }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-start gap-4">
                   <div className="p-3 bg-white/5 rounded-2xl text-green-500">{item.icon}</div>
                   <div>
                     <h4 className="font-bold text-xl">{item.title}</h4>
                     <p className="text-slate-400">{item.desc}</p>
                   </div>
                 </div>
               ))}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
