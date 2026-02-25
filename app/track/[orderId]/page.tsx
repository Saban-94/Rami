"use client";

import React, { useState, useEffect } from "react";
import { Truck, Package, Home, MapPin, Star, Phone, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LiveTrackingPage({ params }: { params: { orderId: string } }) {
  // סימולציה של מצב השלבים - במציאות יגיע מה-DB
  const [step, setStep] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const orderData = {
    customerName: "ראמי",
    businessName: "הובלות אבו אל ראסם",
    basePrice: 450,
    extras: [
      { label: "הורדה קומה 3 (ללא מעלית)", amount: 60 }, // 15₪ * 4 פריטים
      { label: "פירוק מקרר מקצועי", amount: 50 },
    ],
    total: 560
  };

  const steps = [
    { id: 1, label: "אריזה והכנה", detail: "אריזת ציוד ומיגון בקרטון וניילון נצמד", icon: <Package size={20} /> },
    { id: 2, label: "הורדה למשאית", detail: "הורדה מקומה 3 ללא מעלית (חיוב לפי 15₪ לפריט)", icon: <Home size={20} /> },
    { id: 3, label: "בהובלה כעת", detail: "המשאית בנסיעה מטייבה לתל אביב", icon: <Truck size={20} /> },
    { id: 4, label: "פריקה ביעד", detail: "העלאת הציוד לקומה 2 עם מעלית", icon: <MapPin size={20} /> },
    { id: 5, label: "סיום וחיוך", detail: "אישור סופי ודירוג השירות", icon: <CheckCircle2 size={20} /> },
  ];

  if (!isLoaded) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-4 md:p-8 relative overflow-hidden" dir="rtl">
      {/* אפקט ניאון רקע */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-blue-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* כותרת עליונה */}
        <header className="flex justify-between items-center mb-8 bg-slate-900/40 p-5 rounded-3xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Truck className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black leading-none">{orderData.businessName}</h1>
              <p className="text-blue-400 text-[10px] mt-1 flex items-center gap-1">
                <Zap size={10} fill="currentColor" /> מעקב הובלה חי
              </p>
            </div>
          </div>
          <div className="text-left text-xs text-slate-500">
            ID: {params.orderId || "AB-99"}
          </div>
        </header>

        {/* כרטיס סטטוס מרכזי */}
        <main className="bg-slate-900/60 border border-white/10 rounded-[2.5rem] p-6 shadow-2xl backdrop-blur-xl mb-6">
          
          {/* פס הניאון המפורסם */}
          <div className="relative h-3 w-full bg-slate-800 rounded-full mb-10 border border-white/5 p-[2px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 5) * 100}%` }}
              className="h-full bg-gradient-to-l from-blue-400 to-blue-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8),0_0_5px_#fff]"
            />
          </div>

          {/* רשימת השלבים */}
          <div className="space-y-8 relative">
            {/* קו מחבר אחורי */}
            <div className="absolute right-5 top-2 bottom-2 w-[2px] bg-slate-800" />

            {steps.map((s) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0.3 }}
                animate={{ opacity: step >= s.id ? 1 : 0.3 }}
                className="relative flex gap-5 pr-1"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center z-10 transition-all duration-500 ${
                  step >= s.id 
                    ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-110' 
                    : 'bg-slate-800 text-slate-500'
                }`}>
                  {s.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-sm ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>
                    {s.label}
                  </h3>
                  <AnimatePresence>
                    {step === s.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-xs text-slate-400 mt-1 font-light leading-relaxed">
                          {s.detail}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {step > s.id && (
                   <CheckCircle2 size={16} className="text-green-500 mt-1" />
                )}
              </motion.div>
            ))}
          </div>
        </main>

        {/* אנימציית משאית בתנועה - מופיעה רק בשלב הנסיעה */}
        <AnimatePresence>
          {step === 3 && (
            <div className="relative h-20 w-full overflow-hidden mb-6 flex items-center">
              <motion.div 
                initial={{ x: "120%" }}
                animate={{ x: "-120%" }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="text-5xl drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
              >
                🚛💨
              </motion.div>
              <div className="absolute bottom-4 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
            </div>
          )}
        </AnimatePresence>

        {/* פירוט כספי שקוף */}
        <div className="bg-slate-900/40 rounded-3xl p-6 border border-white/5 mb-6">
          <h4 className="text-[10px] uppercase tracking-widest text-slate-500 mb-4 font-bold">פירוט חשבון שקוף 💎</h4>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400 font-light">מחיר בסיס (טייבה - תל אביב)</span>
              <span className="font-mono">₪{orderData.basePrice}</span>
            </div>
            {orderData.extras.map((ex, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-slate-400 font-light">{ex.label}</span>
                <span className="text-blue-400 font-mono">+₪{ex.amount}</span>
              </div>
            ))}
            <div className="h-[1px] bg-slate-800 my-2" />
            <div className="flex justify-between items-center">
              <span className="text-white font-bold">סה"כ לתשלום</span>
              <span className="text-2xl font-black text-green-400 font-mono">₪{orderData.total}</span>
            </div>
          </div>
        </div>

        {/* כפתורי פעולה */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => window.location.href = "tel:050000000"}
            className="flex flex-col items-center justify-center gap-2 p-5 rounded-[2rem] bg-white text-black hover:bg-slate-200 transition-all active:scale-95 shadow-xl"
          >
            <Phone size={20} fill="currentColor" />
            <span className="text-xs font-black">דבר עם אבו ראסם</span>
          </button>
          
          <div className="flex flex-col items-center justify-center p-5 rounded-[2rem] bg-blue-600/20 border border-blue-500/30">
            <span className="text-[10px] text-blue-400 mb-1">מעבר הדירה הבא?</span>
            <span className="text-xs font-bold text-white italic">"תעיר אותי משינה"</span>
          </div>
        </div>

        {/* סיום ודירוג - מופיע רק בשלב 5 */}
        <AnimatePresence>
          {step === 5 && (
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mt-8 bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-[3rem] text-center shadow-[0_20px_40px_rgba(5,150,105,0.3)]"
            >
              <h2 className="text-2xl font-black mb-2">הובלה הושלמה! 🎉 😍</h2>
              <p className="text-sm text-green-100 mb-6 font-light">ראמי ידידי, תתחדשו בבית החדש בתל אביב!</p>
              
              <div className="flex justify-center gap-2 mb-8 bg-black/10 p-4 rounded-2xl">
                {[1,2,3,4,5].map(i => <Star key={i} size={28} className="text-yellow-400 fill-yellow-400 drop-shadow-md cursor-pointer" />)}
              </div>

              <p className="text-[9px] text-green-200 opacity-60 leading-tight italic">
                הפרטים והציוד שלך מאוחסנים במערכת SabanOS. <br />
                אנחנו תמיד כאן בשבילך להובלה הבאה.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* כפתור שליטה לטסטים - למחוק לפני פריסה */}
        <button 
          onClick={() => setStep(s => s < 5 ? s + 1 : 1)}
          className="w-full mt-10 py-2 text-[8px] text-slate-700 hover:text-slate-500 font-mono uppercase tracking-widest"
        >
          Dev Mode: Next Step Simulate
        </button>
      </div>
    </div>
  );
}
