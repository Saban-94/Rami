"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ChevronLeft, Check, Rocket, Briefcase, Phone, User } from "lucide-react";

const steps = [
  { id: 1, title: "מי אתה?", icon: <User size={20} /> },
  { id: 2, title: "העסק שלך", icon: <Briefcase size={20} /> },
  { id: 3, title: "פרטי התקשרות", icon: <Phone size={20} /> },
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
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // בתוך פונקציית ה-handleSubmit
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!db) {
    console.error("Firebase not initialized");
    return;
  }

  setLoading(true);
  try {
    // ... הקוד הקיים שלך ...
  } catch (err) {
    // ...
  }
};

      window.location.href = `/chat/${docRef.id}`;
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("משהו השתבש ברישום, נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4" dir="rtl">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        
        {/* Progress Stepper */}
        <div className="flex justify-between mb-10 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          {steps.map((step) => (
            <div 
              key={step.id} 
              className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${
                currentStep >= step.id ? "bg-green-500 border-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "bg-[#0b141a] border-white/20 text-white/40"
              }`}
            >
              {currentStep > step.id ? <Check size={18} /> : step.icon}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <h2 className="text-2xl font-black text-white italic">בוא נתחיל, איך קוראים לך?</h2>
                <input required type="text" name="fullName" placeholder="שם מלא" value={formData.fullName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none transition-all" />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <h2 className="text-2xl font-black text-white italic">ספר לנו על העסק</h2>
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
              <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-6">
                <h2 className="text-2xl font-black text-white italic">איפה נחבר את ה-AI?</h2>
                <input required type="tel" name="whatsapp" placeholder="מספר וואטסאפ (05...)" value={formData.whatsapp} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none" />
                <textarea name="goals" placeholder="מה המטרה העיקרית שלך?" value={formData.goals} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-green-500 outline-none h-24" />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-4 mt-10">
            {currentStep < steps.length ? (
              <button type="button" onClick={nextStep} className="flex-1 bg-green-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-400 transition-all">הבא <ChevronLeft size={20} /></button>
            ) : (
              <button type="submit" disabled={loading} className="flex-1 bg-green-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-green-400 transition-all disabled:opacity-50">
                {loading ? "מייצר מערכת..." : "התחל 10 ימי ניסיון"} <Rocket size={20} />
              </button>
            )}
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="px-6 bg-white/5 text-white border border-white/10 rounded-2xl">חזור</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
