"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Bell, ShieldCheck, Zap, MessageCircle, 
  TrendingUp, Users, EyeOff, Smartphone 
} from "lucide-react";

export default function FlagshipProject() {
  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-900 to-black text-white">
      {/* אפקט תאורה יוקרתי */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-green-500/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* --- ויזואל: סימולציית מכשיר (Canvas-like) --- */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="flex-1 relative"
          >
            {/* מסגרת אייפון יוקרתית */}
            <div className="relative mx-auto border-[8px] border-slate-800 rounded-[3rem] h-[600px] w-[300px] shadow-2xl overflow-hidden bg-black">
              {/* סרגל עליון */}
              <div className="absolute top-0 w-full h-6 bg-black z-20 flex justify-center">
                <div className="w-20 h-4 bg-slate-900 rounded-b-xl" />
              </div>
              
              {/* תוכן האפליקציה (סימולציה) */}
              <div className="p-4 pt-10 space-y-4">
                <div className="flex items-center gap-3 bg-green-500/20 p-3 rounded-2xl border border-green-500/30">
                  <MessageCircle className="text-green-500" size={20} />
                  <span className="text-[10px] font-bold">WhatsApp Business Engine</span>
                </div>
                
                {/* הודעה נכנסת - אנימציה */}
                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1, repeat: Infinity, repeatDelay: 3 }}
                  className="bg-slate-800 p-3 rounded-2xl rounded-tr-none ml-8 text-xs relative"
                >
                  "שלום, אני מעוניין להזמין 5 מכולות חומר לבנייה"
                  <div className="absolute -top-6 -right-2 flex items-center gap-1 text-[8px] text-green-400 bg-black/50 px-2 py-1 rounded-full border border-green-400/30">
                    <Bell size={8} className="animate-swing" />
                    התקבלה הזמנה חדשה!
                  </div>
                </motion.div>

                {/* פיצ'ר עין עיוורת */}
                <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20 mt-20">
                  <div className="flex items-center gap-2 mb-2 text-blue-400">
                    <EyeOff size={14} />
                    <span className="text-[10px] font-bold italic">Blind-Eye Mode ON</span>
                  </div>
                  <div className="w-full h-2 bg-blue-500/20 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-1/2 h-full bg-blue-500"
                    />
                  </div>
                  <p className="text-[8px] mt-2 opacity-60">סנכרון שקט בין נציגים ללא הפרעה ללקוח</p>
                </div>
              </div>
            </div>

            {/* תגיות צפות */}
            <div className="absolute -top-6 -right-6 bg-green-500 text-black px-4 py-2 rounded-xl font-black text-sm rotate-12 shadow-xl">
              BEST SELLER 2025
            </div>
          </motion.div>

          {/* --- תוכן שיווקי מקצועי --- */}
          <div className="flex-1 text-right space-y-8">
            <div className="space-y-4">
              <h2 className="text-5xl md:text-6xl font-black leading-tight italic">
                WhatsApp <br />
                <span className="text-green-500">Business Hybrid</span>
              </h2>
              <div className="flex items-center justify-end gap-3 text-2xl font-bold text-slate-400">
                <span>מעל <span className="text-white">135</span> התקנות פעילות</span>
                <TrendingUp className="text-green-500" />
              </div>
            </div>

            <p className="text-lg text-slate-400 leading-relaxed">
              אפליקציית הדגל הנמכרת ביותר מבית ראמי מסארוה. המערכת שמחברת את ה-Frontend של וואטסאפ ללוגיסטיקה הכבדה של הארגון שלך. זהו פתרון היברידי המשלב חוויית משתמש מוכרת עם כלי שליטה ארגוניים חסרי תקדים.
            </p>

            {/* פיצ'רים טכנולוגיים */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 justify-end">
                <div className="text-right">
                  <h4 className="font-bold text-white">OneSignal Push</h4>
                  <p className="text-xs text-slate-500">מערכת ההתראות המתקדמת בעולם - אפס זמן שיהוי.</p>
                </div>
                <Bell className="text-yellow-500 shrink-0" />
              </div>
              <div className="flex items-start gap-4 justify-end">
                <div className="text-right">
                  <h4 className="font-bold text-white">Firebase Vault</h4>
                  <p className="text-xs text-slate-500">כל הזמנה נשמרת במאגר נתונים מאובטח ומוצפן.</p>
                </div>
                <ShieldCheck className="text-blue-500 shrink-0" />
              </div>
              <div className="flex items-start gap-4 justify-end">
                <div className="text-right">
                  <h4 className="font-bold text-white">כלי "עין עיוורת"</h4>
                  <p className="text-xs text-slate-500">ניהול הזמנות שקט בקבוצות נציגים ללא ידיעת הלקוח.</p>
                </div>
                <EyeOff className="text-purple-500 shrink-0" />
              </div>
              <div className="flex items-start gap-4 justify-end">
                <div className="text-right">
                  <h4 className="font-bold text-white">סנכרון PWA מלא</h4>
                  <p className="text-xs text-slate-500">עובד כמערכת מובנית על אייפון ואנדרואיד.</p>
                </div>
                <Smartphone className="text-green-500 shrink-0" />
              </div>
            </div>

            {/* הנעה לפעולה */}
            <div className="pt-8">
              <button 
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full md:w-auto px-12 py-5 bg-green-500 hover:bg-green-400 text-black font-black rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-4 text-xl"
              >
                אני רוצה את מערכת הדגל בעסק שלי
                <Zap size={24} fill="currentColor" />
              </button>
              <p className="text-[10px] text-slate-600 mt-4 font-bold uppercase tracking-widest">
                אספקה והטמעה תוך 7 ימי עסקים | תמיכה טכנית 24/7
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
