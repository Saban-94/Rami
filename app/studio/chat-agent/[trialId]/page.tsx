'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { CheckCircle2, User, Phone, Mail, Sparkles, ArrowLeft } from 'lucide-react';

export default function MagicLinkPage({ params }: { params: { trialId: string } }) {
  const [manifest, setManifest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  // טעינת פרטי העסק כדי להציג לוגו ושם מותג
  useEffect(() => {
    if (!params.trialId) return;
    const unsub = onSnapshot(doc(db, "trials", params.trialId), (snap) => {
      if (snap.exists()) setManifest(snap.data());
      setLoading(false);
    });
    return () => unsub();
  }, [params.trialId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    try {
      // יצירת הלקוח בתוך הסאב-קולקשן של העסק הספציפי
      const customersRef = collection(db, 'trials', params.trialId, 'customers');
      await addDoc(customersRef, {
        ...formData,
        source: 'magic_link',
        createdAt: serverTimestamp(),
      });
      
      setSubmitted(true);
    } catch (err) {
      console.error("Join Error:", err);
    }
  };

  const primaryColor = manifest?.appConfig?.theme?.primaryColor || '#10b981';

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#020617]">
      <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#020617] text-white flex flex-col items-center p-6 font-sans overflow-hidden" dir="rtl">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] opacity-20 blur-[120px] rounded-full pointer-events-none" 
           style={{ backgroundColor: primaryColor }} />

      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md mt-12 z-10"
          >
            {/* Business Identity */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-white/10 rounded-3xl mx-auto mb-4 flex items-center justify-center border border-white/10 overflow-hidden backdrop-blur-xl">
                {manifest?.appConfig?.theme?.logo ? (
                  <img src={manifest.appConfig.theme.logo} alt="Logo" className="w-full h-full object-contain p-2" />
                ) : (
                  <Sparkles size={32} style={{ color: primaryColor }} />
                )}
              </div>
              <h1 className="text-3xl font-black italic tracking-tighter uppercase">{manifest?.businessName || 'Join Us'}</h1>
              <p className="opacity-60 text-sm mt-2 font-bold italic">הצטרפו לקהילה שלנו וקבלו עדכונים והטבות</p>
            </div>

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <User className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  type="text" required placeholder="שם מלא"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pr-14 pl-4 text-sm outline-none focus:border-white/30 transition-all"
                />
              </div>
              <div className="relative">
                <Phone className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  type="tel" required placeholder="טלפון"
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pr-14 pl-4 text-sm outline-none focus:border-white/30 transition-all"
                />
              </div>
              <div className="relative">
                <Mail className="absolute right-5 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input 
                  type="email" placeholder="אימייל (אופציונלי)"
                  value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pr-14 pl-4 text-sm outline-none focus:border-white/30 transition-all"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl font-black italic uppercase tracking-widest shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{ backgroundColor: primaryColor }}
              >
                הרשמה מהירה <CheckCircle2 size={18} />
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mt-32 space-y-6 z-10"
          >
            <div className="w-24 h-24 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(34,197,94,0.4)]">
              <CheckCircle2 size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black italic">תודה, {formData.name.split(' ')[0]}!</h2>
            <p className="opacity-60 font-bold tracking-tight">הפרטים שלך נקלטו בהצלחה במערכת של {manifest?.businessName}.</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-xs opacity-40 flex items-center gap-2 mx-auto"
            >
              <ArrowLeft size={14} /> חזרה לדף הבית
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-auto pb-8 opacity-20 text-[10px] font-black uppercase tracking-[0.2em]">
        Powered by SabanOS Pro
      </footer>
    </main>
  );
}
