"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageSquare, Send, CheckCircle2, Github, Linkedin } from "lucide-react";

export default function ContactSection() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // כאן נכנסת הלוגיקה לחיבור ל-Firebase בעתיד
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 2000);
  };

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-6 dark:text-white"
          >
            בוא נבנה את ה-<span className="text-cyan-500">עתיד שלך</span>
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            מוכן להפוך את העסק שלך למערכת חכמה ואוטומטית? אני כאן כדי להפוך את החזון שלך למציאות טכנולוגית.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* --- פרטי התקשרות --- */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass p-8 rounded-[2.5rem] border border-white/10 space-y-8">
              <h3 className="text-2xl font-bold dark:text-white mb-6">פרטי התקשרות</h3>
              
              <div className="flex items-center gap-6 group">
                <div className="p-4 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">טלפון / WhatsApp</p>
                  <a href="https://wa.me/972508861080" className="text-xl font-bold dark:text-white hover:text-cyan-500 transition-colors">
                    050-8861080
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="p-4 bg-blue-500/10 rounded-2xl border border-blue-500/20 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">אימייל ישיר</p>
                  <a href="mailto:ramims2026@gmail.com" className="text-xl font-bold dark:text-white hover:text-blue-500 transition-colors">
                    ramims2026@gmail.com
                  </a>
                </div>
              </div>

              <div className="pt-8 border-t border-white/10 flex gap-4 justify-center md:justify-start">
                 <button className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-cyan-500 transition-all">
                    <Github size={20} className="dark:text-white" />
                 </button>
                 <button className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-blue-600 transition-all">
                    <Linkedin size={20} className="dark:text-white" />
                 </button>
              </div>
            </div>
          </motion.div>

          {/* --- טופס ליצירת קשר --- */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-[2.5rem] border border-white/10"
          >
            {!isSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-bold text-slate-500 px-2 uppercase">שם מלא</label>
                    <input type="text" required className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none transition-all dark:text-white" placeholder="ישראל ישראלי" />
                  </div>
                  <div className="space-y-2 text-right">
                    <label className="text-xs font-bold text-slate-500 px-2 uppercase">טלפון</label>
                    <input type="tel" required className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none transition-all dark:text-white" placeholder="050-0000000" />
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <label className="text-xs font-bold text-slate-500 px-2 uppercase">הודעה</label>
                  <textarea rows={4} required className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 focus:border-cyan-500 outline-none transition-all dark:text-white" placeholder="ספר לי על הפרויקט שלך..." />
                </div>
                <button 
                  disabled={isSubmitting}
                  className="w-full py-5 bg-gradient-to-l from-cyan-600 to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "שולח..." : "שלח הודעה"}
                  <Send size={18} />
                </button>
              </form>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="py-12 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto border border-green-500/20">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold dark:text-white">ההודעה נשלחה בהצלחה!</h3>
                <p className="text-slate-500">תודה רמי, אני אחזור אליך בהקדם האפשרי.</p>
                <button onClick={() => setIsSent(false)} className="text-cyan-500 font-bold underline">שלח הודעה נוספת</button>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
      
      {/* Footer קרדיט */}
      <footer className="mt-24 pt-8 border-t border-white/5 text-center">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          © 2026 Rami Masarwa - Advanced Automation Architect
        </p>
      </footer>
    </section>
  );
}
