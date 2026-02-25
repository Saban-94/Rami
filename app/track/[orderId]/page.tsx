"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { 
  Truck, MapPin, Package, Clock, ShieldCheck, 
  ChevronLeft, Phone, ThermometerSnowflake 
} from "lucide-react";
import { motion } from "framer-motion";
import LiveFleetMap from "@/components/LiveFleetMap";

export default function CustomerTrackingPage() {
  const { leadId } = useParams();
  const [lead, setLead] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!leadId) return;

    // האזנה בזמן אמת לסטטוס ההובלה ב-Firebase
    const unsubscribe = onSnapshot(doc(db, "leads", leadId as string), (doc) => {
      if (doc.exists()) {
        setLead(doc.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [leadId]);

  if (loading) {
    return (
      <div className="h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-blue-500 animate-bounce flex flex-col items-center gap-4">
          <Truck size={48} />
          <span className="font-bold tracking-widest text-sm uppercase">מאתר את המשאית שלך...</span>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="h-screen bg-slate-950 text-white flex items-center justify-center p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">אופס! ההובלה לא נמצאה</h1>
          <p className="text-slate-400">מומלץ ליצור קשר עם אבו ראסם ישירות.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans" dir="rtl">
      {/* Header קבוע */}
      <header className="p-6 border-b border-white/5 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Truck className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black italic leading-none">SabanOS Track</h1>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">הובלות אבו אל ראסם</p>
            </div>
          </div>
          <button className="p-2 bg-white/5 rounded-full hover:bg-white/10">
            <Phone size={18} className="text-slate-300" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6 pb-20">
        
        {/* כרטיס סטטוס נוכחי */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-600 rounded-[2.5rem] p-6 shadow-2xl shadow-blue-500/20 relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <span className="bg-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase italic">
                {lead.status === 'in_progress' ? 'בדרך אליך' : 'בטיפול'}
              </span>
              <Clock className="text-white/50" size={20} />
            </div>
            <h2 className="text-3xl font-black mb-1">המשאית בדרך!</h2>
            <p className="text-blue-100 text-sm font-medium">הגעה משוערת: עוד כ-25 דקות</p>
          </div>
          <Truck className="absolute -bottom-4 -left-4 text-white/10 w-32 h-32 rotate-12" />
        </motion.div>

        {/* מפת המעקב החיה */}
        <div className="h-80 bg-slate-900 rounded-[3rem] overflow-hidden border border-white/10 relative shadow-inner">
           <LiveFleetMap focusedLeadId={leadId as string} />
           <div className="absolute bottom-4 right-4 left-4 bg-slate-950/80 backdrop-blur-md p-3 rounded-2xl border border-white/5 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">שידור חי מהשטח</span>
           </div>
        </div>

        {/* סיכום הציוד שנסרק (הנתונים מה-AI) */}
        <div className="bg-white/5 rounded-[2.5rem] p-6 border border-white/5 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <Package className="text-blue-400" size={18} />
            <h3 className="font-bold text-sm">סיכום הציוד שנסרק ב-AI:</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            {lead.scannedItems?.map((item: string, idx: number) => (
              <div key={idx} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-sm font-medium">{item}</span>
                <ShieldCheck size={14} className="text-green-500" />
              </div>
            ))}
          </div>

          {lead.isRefrigerated && (
            <div className="flex items-center gap-2 text-blue-400 bg-blue-400/10 p-3 rounded-xl border border-blue-400/20">
              <ThermometerSnowflake size={16} />
              <span className="text-[11px] font-black uppercase">הובלה מבוקרת טמפרטורה (קירור פעיל)</span>
            </div>
          )}
        </div>

        {/* פרטי המסלול */}
        <div className="relative pl-6 py-2">
          <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-800" />
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -left-[27px] w-3 h-3 bg-slate-800 rounded-full border-2 border-slate-950" />
              <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">נקודת מוצא</p>
              <p className="text-sm font-bold">{lead.origin}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[27px] w-3 h-3 bg-blue-500 rounded-full border-2 border-slate-950 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
              <p className="text-[10px] text-blue-500 font-bold uppercase mb-1">יעד סופי</p>
              <p className="text-sm font-bold">{lead.destination}</p>
            </div>
          </div>
        </div>

      </main>

      {/* Footer צף לסגירת הובלה */}
      <footer className="fixed bottom-6 left-6 right-6 flex gap-3 max-w-md mx-auto">
        <button className="flex-1 bg-white text-slate-950 h-14 rounded-2xl font-black text-sm shadow-xl flex items-center justify-center gap-2">
          <Phone size={18} /> דבר עם המוביל
        </button>
      </footer>
    </div>
  );
}
