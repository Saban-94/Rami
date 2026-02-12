"use client";

import React from "react";
import { motion } from "framer-motion";
import TrialRegistrationForm from "../../components/TrialRegistrationForm";
import Navigation from "../../components/Navigation";
import { ShieldCheck, Zap, Clock } from "lucide-react";

export default function TrialPage() {
  return (
    <main className="min-h-screen bg-[#020617] text-white overflow-x-hidden" dir="rtl">
      <Navigation />

      {/* רקע דקורטיבי */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 pt-32 pb-20 px-4 max-w-7xl mx-auto flex flex-col items-center">
        {/* כותרת דף */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter">
            הצטרף למהפכת ה-<span className="text-green-500">AI</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto">
            10 ימי התנסות מלאה ב-SabanOS. בלי התחייבות, בלי כרטיס אשראי. 
            פשוט מחברים את העסק ומתחילים לצמוח.
          </p>
        </motion.div>

        {/* פריסת תוכן: טופס + יתרונות */}
        <div className="w-full grid lg:grid-cols-2 gap-16 items-start">
          
          {/* צד ימין: הטופס החכם */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <TrialRegistrationForm />
          </motion.div>

          {/* צד שמאל: יתרונות והמחשה */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-10 py-6"
          >
            <div className="space-y-8">
              <h3 className="text-2xl font-bold italic border-r-4 border-green-500 pr-4">מה תקבל בגרסת הניסיון?</h3>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500/10 rounded-2xl text-green-500">
                  <Zap size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl">חיבור מיידי לוואטסאפ</h4>
                  <p className="text-slate-400">בוט ה-AI ילמד את העסק שלך תוך דקות ויתחיל לענות ללקוחות.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl">זמינות 24/7</h4>
                  <p className="text-slate-400">העסק שלך עונה גם כשאתה ישן, בחופשה או באמצע עבודה.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-xl">אופטימיזציה מלאה</h4>
                  <p className="text-slate-400">אנחנו ננתח את הלידים שלך ונשפר את המרת המכירות ביומיים הראשונים.</p>
                </div>
              </div>
            </div>

            {/* אלמנט ויזואלי קטן - Badge */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-center gap-6">
              <div className="text-center border-l border-white/10 pl-6">
                <div className="text-3xl font-black text-green-500">10</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">ימי ניסיון</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white">0₪</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-widest">עלות הקמה</div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </main>
  );
}
