"use client";

import React, { useState, useEffect, use } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { 
  Phone, Calendar, MapPin, Truck, ChevronRight, 
  Trash2, CheckCircle2, MessageSquare, Zap, IceCream
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LeadsManager({ params }: { params: Promise<{ trialId: string }> | { trialId: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const trialId = resolvedParams.trialId;

  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // האזנה בזמן אמת ללידים חדשים מהצ'אט
    const q = query(collection(db, "trials", trialId, "leads"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setLeads(leadsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [trialId]);

  const deleteLead = async (id: string) => {
    if (confirm("בטוח שרוצים למחוק את הליד?")) {
      await deleteDoc(doc(db, "trials", trialId, "leads", id));
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-black text-blue-600 animate-pulse">טוען לידים חמים... 🔥</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-slate-900 italic">לידים חמים 🔥</h1>
            <p className="text-slate-500 mt-2 font-medium">כאן מופיעים הלקוחות שדיברו עם SabanOS AI בדקות האחרונות</p>
          </div>
          <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl font-bold shadow-lg">
            {leads.length} פניות פעילות
          </div>
        </header>

        <div className="grid gap-6">
          <AnimatePresence>
            {leads.map((lead) => (
              <motion.div
                key={lead.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
              >
                {/* אינדיקטור הובלה בקירור */}
                {lead.isRefrigerated && (
                  <div className="absolute top-0 left-0 bg-blue-500 text-white px-6 py-1 rounded-br-2xl text-[10px] font-black flex items-center gap-1 shadow-md">
                    <IceCream size={12} /> הובלה בקירור
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-between gap-6">
                  {/* פרטי לקוח בסיסיים */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-black text-slate-900">{lead.name || "לקוח בבדיקה..."}</h2>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded-lg font-mono">
                        {lead.createdAt?.toDate().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-slate-600 font-medium">
                      <div className="flex items-center gap-1"><MapPin size={16} className="text-blue-500" /> {lead.origin} ➔ {lead.destination}</div>
                      <div className="flex items-center gap-1 text-green-600 font-bold"><Zap size={16} /> הערכת מחיר AI: ₪{lead.estimatedPrice || "טרם חושב"}</div>
                    </div>

                    {/* סיכום הבקשה מהצ'אט */}
                    <div className="mt-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 italic text-slate-700 text-sm">
                      "{lead.summary || "הלקוח עדיין בשיחה עם הבוט..."}"
                    </div>
                  </div>

                  {/* כפתורי פעולה מהירים */}
                  <div className="flex flex-row md:flex-col gap-3 justify-center">
                    <a 
                      href={`tel:${lead.phone}`}
                      className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-2xl font-black hover:bg-blue-600 transition-colors shadow-lg active:scale-95"
                    >
                      <Phone size={20} /> התקשר עכשיו
                    </a>
                    
                    <button 
                      onClick={() => deleteLead(lead.id)}
                      className="p-4 text-slate-300 hover:text-red-500 transition-colors rounded-2xl hover:bg-red-50"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                {/* פס התקדמות סטטוס */}
                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                   <div className="flex items-center gap-1 text-blue-500"><MessageSquare size={12}/> שיחה בצ'אט</div>
                   <ChevronRight size={12}/>
                   <div className={lead.phone ? "text-green-500" : ""}>השארת פרטים</div>
                   <ChevronRight size={12}/>
                   <div>תיאום הובלה</div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {leads.length === 0 && (
            <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <Truck size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-400 font-bold italic">אין פניות חדשות כרגע... המוסך שקט.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
