"use client";
import React, { useState } from "react";
import { db } from "../lib/firebase"; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Phone, Mail } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // שליחת הנתונים ל-Firebase
      await addDoc(collection(db, "leads"), {
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        source: "Rami Portfolio PWA",
        status: "new",
        createdAt: serverTimestamp(), // זמן שליחה אחיד מהשרת
      });

      setIsSent(true);
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      console.error("Firebase Error:", error);
      alert("חלה שגיאה בחיבור לענן. נסה שנית.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 text-right">
        
        {/* פרטי התקשרות (ראמי מסארוה) */}
        <div className="space-y-8 order-2 lg:order-1">
           <div className="glass p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
              <h3 className="text-2xl font-black mb-8 dark:text-white">בוא נדבר</h3>
              <div className="space-y-6">
                 <a href="https://wa.me/972508861080" className="flex items-center justify-end gap-4 group">
                    <span className="text-lg font-bold dark:text-white group-hover:text-green-500 transition-colors">050-8861080</span>
                    <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><Phone size={20} /></div>
                 </a>
                 <a href="mailto:ramims2026@gmail.com" className="flex items-center justify-end gap-4 group">
                    <span className="text-lg font-bold dark:text-white group-hover:text-cyan-500 transition-colors">ramims2026@gmail.com</span>
                    <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-500"><Mail size={20} /></div>
                 </a>
              </div>
           </div>
        </div>

        {/* הטופס החכם */}
        <div className="order-1 lg:order-2">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="שם מלא"
                required
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="tel" 
                placeholder="טלפון"
                required
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white transition-all"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
              <textarea 
                placeholder="איך אני יכול לעזור לך?"
                rows={4}
                required
                className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none text-white transition-all"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
              <button 
                disabled={isSubmitting}
                className="w-full py-5 bg-cyan-500 hover:bg-cyan-400 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? "מבצע סנכרון לענן..." : "שלח הצעה לפרויקט"}
                <Send size={18} />
              </button>
            </form>
          ) : (
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center py-10 glass rounded-[2.5rem] border-green-500/30">
              <CheckCircle2 size={60} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">הליד התקבל במערכת!</h3>
              <p className="text-slate-400">רמי קיבל את ההודעה ויחזור אליך בהקדם.</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
