"use client";

import React, { useState, useEffect } from "react";
import { Truck, Package, Home, MapPin, Star, Phone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  // בשימוש אמיתי נמשוך את הנתונים מה-Firebase לפי ה-orderId
  const [step, setStep] = useState(1);
  const [orderData, setOrderData] = useState({
    customerName: "ראמי",
    origin: "טייבה, קומה 3",
    destination: "תל אביב, קומה 2",
    items: [
      { name: "ספה 2 מטר", qty: 3, floorPrice: 15 },
      { name: "מקרר", qty: 1, floorPrice: 15, extra: 50 }
    ],
    basePrice: 450,
  });

  // חישוב מחיר דינמי לפי הלוגיקה שקבעת
  const floorSurcharge = orderData.items.reduce((acc, item) => acc + (item.qty * item.floorPrice), 0);
  const totalWeightPrice = orderData.basePrice + floorSurcharge + 50; // +50 על פירוק מקרר

  const steps = [
    { id: 1, label: "אריזה והכנה", icon: <Package size={20} />, detail: "הצוות אורז את הציוד בניילון נצמד ושומר על הפינות." },
    { id: 2, label: "הורדה מקומה 3", icon: <Home size={20} />, detail: `חיוב קומות: ${floorSurcharge}₪ התווספו למאמץ.` },
    { id: 3, label: "הובלה בדרך", icon: <Truck size={20} />, detail: "המשאית בנסיעה לכתובת היעד. המטען מבוטח." },
    { id: 4, label: "פריקה בקומה 2", icon: <MapPin size={20} />, detail: "העלאת הציוד למקום החדש בזהירות." },
    { id: 5, label: "סיום ודירוג", icon: <CheckCircle2 size={20} />, detail: "הובלה הושלמה בהצלחה! תתחדשו!" },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-4 md:p-8 overflow-hidden" dir="rtl">
      {/* Background Neon Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_20%,_#1e3a8a_0%,_transparent_50%)] opacity-30 pointer-events-none" />

      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-l from-blue-400 to-white">
            SabanOS Live Tracker
          </h1>
          <p className="text-slate-400 mt-2 italic">שלום {orderData.customerName}, הציוד שלך בידיים של אבו ראסם 🚛</p>
        </header>

        {/* Live Progress Bar (The Neon Line) */}
        <div className="bg-slate-900/50 border border-white/10 p-8 rounded-[2.5rem] shadow-2xl backdrop-blur-xl mb-8">
          <div className="relative h-4 w-full bg-slate-800 rounded-full mb-12 overflow-hidden border border-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(step / 5) * 100}%` }}
              className="absolute h-full bg-blue-500 shadow-[0_0_20px_#3b82f6,0_0_10px_#fff]"
            />
          </div>

          {/* Steps List */}
          <div className="space-y-6">
            {steps.map((s) => (
              <motion.div 
                key={s.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: step >= s.id ? 1 : 0.4, x: 0 }}
                className={`flex gap-4 p-4 rounded-2xl transition-all ${step === s.id ? 'bg-blue-600/20 border border-blue-500/30' : ''}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${step >= s.id ? 'bg-blue-500 text-white shadow-[0_0_15px_#3b82f6]' : 'bg-slate-800 text-slate-500'}`}>
                  {s.icon}
                </div>
                <div>
                  <h4 className={`font-bold ${step >= s.id ? 'text-white' : 'text-slate-500'}`}>{s.label}</h4>
                  {step === s.id && (
                    <motion.p 
                      initial={{ height: 0 }} 
                      animate={{ height: "auto" }}
                      className="text-xs text-blue-300 mt-1 leading-relaxed"
                    >
                      {s.detail}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Truck Animation (Only visible during transport) */}
        <AnimatePresence>
          {step === 3 && (
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: "-100%" }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="text-6xl my-10"
            >
              🚛💨
            </motion.div>
          )}
        </AnimatePresence>

        {/* Billing & Call Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-900/80 p-6 rounded-[2rem] border border-white/5 text-center">
            <p className="text-slate-500 text-xs">סה"כ לתשלום</p>
            <p className="text-3xl font-black text-green-400">₪{totalWeightPrice}</p>
          </div>
          
          <button 
            onClick={() => window.location.href = "tel:050000000"}
            className="bg-white text-black p-6 rounded-[2rem] font-bold flex flex-col items-center justify-center hover:bg-slate-200 transition-all"
          >
            <Phone size={24} className="mb-1" />
            <span>דבר עם אבו ראסם</span>
          </button>
        </div>

        {/* Final Step: Feedback */}
        {step === 5 && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-[2.5rem] text-center shadow-2xl shadow-green-900/20"
          >
            <h2 className="text-2xl font-bold mb-2">תתחדשו בבית החדש! 😍</h2>
            <p className="text-sm text-green-100 mb-6">איך הייתה ההובלה של אבו ראסם?</p>
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="fill-yellow-300 text-yellow-300" />)}
            </div>
            <p className="text-[10px] opacity-70">הפרטים שלך נשמרו במערכת SabanOS למעבר הבא שלך 🔒</p>
          </motion.div>
        )}

        {/* Control Button (For Demo Purposes) */}
        <button 
          onClick={() => setStep(s => s < 5 ? s + 1 : 1)}
          className="mt-10 mx-auto block text-slate-600 text-[10px] hover:text-white"
        >
          סימולציית שלב הבא (לצרכי בדיקה בלבד)
        </button>
      </div>
    </div>
  );
}
