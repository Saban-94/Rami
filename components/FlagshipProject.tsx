"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Bell, ShieldCheck, Zap, MessageCircle, 
  TrendingUp, EyeOff, Smartphone, Gift
} from "lucide-react";

export default function FlagshipProject() {
  return (
    <section className="py-24 relative overflow-hidden bg-slate-950 text-white rounded-[3rem] border border-white/5 shadow-2xl mx-4 md:mx-0">
      {/* רקע יוקרתי */}
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(34,197,94,0.15),transparent)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- באנר הנחה בולט --- */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          className="flex justify-center mb-12"
        >
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-green-500/20 animate-pulse">
            <Gift size={24} className="text-white" />
            <span className="text-xl font-black text-white tracking-tighter">
              הטבת השקה: 15% הנחה לזמן מוגבל!
            </span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* ויזואל האייפון עם סימולציה */}
          <div className="flex-1 relative">
            <div className="relative mx-auto border-[10px] border-slate-900 rounded-[3.5rem] h-[640px] w-[320px] shadow-2xl overflow-hidden bg-black">
              {/* Notch */}
              <div className="absolute top-0 w-full h-8 bg-black z-30 flex justify-center">
                <div className="w-24 h-5 bg-slate-900 rounded-b-2xl" />
              </div>

              {/* תוכן אפליקציית הדגל */}
              <div className="p-5 pt-12 space-y-6">
                <div className="flex items-center gap-3 bg-green-500/10 p-3 rounded-2xl border border-green-500/20">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-black">
                    <MessageCircle size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black uppercase">WhatsApp Hybrid</h4>
                    <p className="text-[8px] text-green-500">Connected to Firebase</p>
                  </div>
                </div>

                {/* התראת OneSignal */}
                <motion.div 
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.5, repeat: Infinity, repeatDelay: 4 }}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 relative"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Bell size={12} className="text-yellow-400 animate-bounce" />
                    <span className="text-[10px] font-bold text-white">OneSignal Push</span>
                  </div>
                  <p className="text-[11px] text-slate-300 italic">"רמי, התקבלה הזמנת חומרים חדשה מחנות 'הקבלן'!"</p>
                </motion.div>
              </div>
            </div>
            
            {/* Badge מכירות */}
            <div className="absolute -bottom-6 -right-6 bg-white text-black p-6 rounded-3xl shadow-2xl border border-slate-200 text-center">
              <p className="text-3xl font-black leading-none">135+</p>
              <p className="text-[10px] font-bold uppercase text-slate-500">עסקים פעילים</p>
            </div>
          </div>

          {/* תוכן שיווקי */}
          <div className="flex-1 text-right space-y-8">
            <div className="inline-block px-4 py-1 rounded-md bg-green-500 text-black text-[10px] font-black uppercase">
              אפליקציית הדגל הנמכרת ביותר
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic">
              הכוח של <br />
              <span className="text-green-500 underline decoration-white/20 underline-offset-8">WhatsApp</span>
              <br /> בתוך הארגון
            </h2>

            <p className="text-xl text-slate-400 leading-relaxed max-w-xl ml-auto">
              מערכת היברידית המשלבת את חוויית המשתמש המוכרת של וואטסאפ עם כוח המחשוב של Firebase ו-OneSignal. ניהול הזמנות, סנכרון נציגים בשקט (עין עיוורת) ואבטחה מקסימלית.
            </p>

            {/* רשימת פיצ'רים יוקרתית */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="flex items-start gap-4 justify-end group">
                <div className="text-right">
                  <h5 className="font-bold text-lg group-hover:text-green-500 transition-colors">עין עיוורת</h5>
                  <p className="text-sm text-slate-500">תיאום פנימי בין נציגים מבלי שהלקוח יראה את השיח התפעולי.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10"><EyeOff size={20} className="text-purple-400" /></div>
              </div>
              <div className="flex items-start gap-4 justify-end group">
                <div className="text-right">
                  <h5 className="font-bold text-lg group-hover:text-green-500 transition-colors">Firebase Vault</h5>
                  <p className="text-sm text-slate-500">כל דאטה נשמר בתוך מאגר מאובטח בענן של Google.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10"><ShieldCheck size={20} className="text-blue-400" /></div>
              </div>
            </div>

            {/* כפתור רכישה והנחה */}
            <div className="pt-10 flex flex-col items-end gap-6">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="group relative bg-green-500 hover:bg-green-400 text-black px-12 py-6 rounded-3xl font-black text-2xl transition-all shadow-2xl shadow-green-500/20 flex items-center gap-4"
              >
                רכוש עכשיו וקבל 15% הנחה
                <Zap size={24} fill="currentColor" />
              </button>
              <p className="text-slate-500 font-bold text-sm italic">
                * המבצע בתוקף ל-48 השעות הקרובות בלבד
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
