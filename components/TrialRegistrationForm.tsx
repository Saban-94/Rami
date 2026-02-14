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
    if (!db) return;
    setLoading(true);

    try {
      // יצירת קוד גישה אקראי בן 4 ספרות
      const accessCode = Math.floor(1000 + Math.random() * 9000).toString();

      const docRef = await addDoc(collection(db, "trials"), {
        ...formData,
        accessCode,
        status: "active",
        createdAt: serverTimestamp(),
      });

      // העברה לדף הצ'אט המוגן
      window.location.href = `/chat/${docRef.id}`;
    } catch (error) {
      console.error("Error:", error);
      alert("שגיאה ברישום, נסה שנית.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4" dir="rtl">
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
        <div className="flex justify-between mb-10 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
          {steps.map((step) => (
            <div key={step.id} className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-500 ${currentStep >= step.id ? "bg-green-500 border-green-500 text-black" : "bg-[#0b141a] border-white/20 text-white/40"}`}>
              {currentStep > step.id ? <Check size={18} /> : step.icon}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-2xl font-black mb-6 italic">איך קוראים לך?</h2>
                <input required name="fullName" placeholder="שם מלא" value={formData.fullName} onChange={handleChange} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 outline-none focus:border-green-500" />
              </motion.div>
            )}
            {/* ... שאר השלבים (2 ו-3) דומים למה שכתבנו קודם ... */}
          </AnimatePresence>
          <div className="flex gap-4 mt-10">
            {currentStep < 3 ? (
              <button type="button" onClick={nextStep} className="flex-1 bg-green-500 text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2">הבא <ChevronLeft size={20} /></button>
            ) : (
              <button type="submit" disabled={loading} className="flex-1 bg-green-500 text-black font-black py-4 rounded-2xl disabled:opacity-50">
                {loading ? "מייצר מערכת..." : "התחל 10 ימי ניסיון"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
