"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ChevronLeft, Check, Rocket, Briefcase, Phone, User, Lock } from "lucide-react";

const steps = [
  { id: 1, title: "מי אתה?", icon: <User size={20} /> },
  { id: 2, title: "העסק שלך", icon: <Briefcase size={20} /> },
  { id: 3, title: "פרטי התקשרות", icon: <Phone size={20} /> },
  { id: 4, title: "אבטחה", icon: <Lock size={20} /> },
];

export default function TrialRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    businessName: "",
    businessType: "beauty",
    whatsapp: "",
    email: "",
    goals: "",
    accessCode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    // מניעת מעבר אם לא מולאו פרטים בשלבים קריטיים
    if (currentStep === 1 && !formData.fullName) return alert("אנא מלא שם מלא");
    if (currentStep === 3 && !formData.whatsapp) return alert("אנא מלא מספר וואטסאפ");
    
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };
  
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ולידציה אחרונה לקוד גישה
    if (formData.accessCode.length !== 4) {
      alert("נא לבחור קוד גישה בן 4 ספרות בדיוק");
      return;
    }

    if (!db) return;
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "trials"), {
        ...formData,
        status: "active",
        createdAt: serverTimestamp(),
      });

      // הצלחה! העברה לדף הצ'אט האישי
      window.location.href = `/chat/${docRef.id}`;
    } catch (error) {
      console.error("Error:", error);
      alert("משהו השתבש ברישום, נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4" dir="rtl">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
        
        {/* Progress Stepper */}
        <div className="flex justify-between mb-12 relative z-10">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                currentStep >= step.id 
                ? "bg-green-500 border-green-500 text-black shadow-[0_0_20px_rgba(34,197,94,0.4)]" 
                : "bg-[#0b141a] border-white/20 text-white/40"
              }`}
            >
              {currentStep > step.id ? <Check size={18} /> : step.icon}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative z-10">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-black italic text-white">נעים להכיר, מה שמך?</h2>
                <input required type="text" name="fullName" placeholder="שם מלא" value={formData.fullName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none transition-all" />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-black italic text-white">איך קוראים לעסק שלך?</h2>
                <input required type="text" name="businessName" placeholder="שם העסק" value={formData.businessName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none mb-4" />
                <select name="businessType" value={formData.businessType} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none">
                  <option value="beauty" className="text-black">יופי וטיפוח</option>
                  <option value="health" className="text-black">בריאות ומרפאות</option>
                  <option value="service" className="text-black">מתן שירותים</option>
                  <option value="other" className="text-black">אחר</option>
                </select>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-black italic text-white">איפה נחבר את ה-AI?</h2>
                <input required type="tel" name="whatsapp" placeholder="מספר וואטסאפ (05...)" value={formData.whatsapp} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none" />
                <textarea name="goals" placeholder="מה המטרה העיקרית שלך? (למשל: קביעת תורים אוטומטית)" value={formData.goals} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none h-24" />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 text-center">
                <h2 className="text-2xl font-black italic text-green-500">בחר קוד גישה אישי</h2>
                <p className="text-white/40 text-sm">הקוד שישמש אותך לכניסה לאפליקציה שלך</p>
                <input 
                  required 
                  type="text" 
                  name="accessCode" 
                  maxLength={4}
                  placeholder="0000"
                  value={formData.accessCode}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, ""); // רק מספרים
                    setFormData({ ...formData, accessCode: val });
                  }}
                  className="w-48 bg-black/40 border-2 border-green-500/50 rounded-2xl p-5 text-center text-4xl font-bold tracking-[10px] text-green-500 outline-none focus:border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)] mx-auto block"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 mt-12">
            {currentStep < 4 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className="flex-1 bg-green-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-400 transition-all active:scale-95"
              >
                הבא <ChevronLeft size={20} />
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 bg-green-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] transition-all disabled:opacity-50 active:scale-95"
              >
                {loading ? "מייצר מערכת..." : "סיים והתחל עבודה"} <Rocket size={20} />
              </button>
            )}
            
            {currentStep > 1 && (
              <button 
                type="button" 
                onClick={prevStep} 
                className="px-8 bg-white/5 text-white border border-white/10 rounded-2xl hover:bg-white/10 transition-all"
              >
                חזור
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
