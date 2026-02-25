"use client";

import React, { useState, useEffect, use } from "react";
import { 
  Save, Users, Settings, Phone, Truck, LayoutDashboard, 
  ChevronRight, Package, MapPin, CheckCircle2, Zap 
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, getDocs, query, orderBy, setDoc } from "firebase/firestore";

export default function AdminDashboard({ params }: { params: Promise<{ trialId: string }> | { trialId: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const trialId = resolvedParams.trialId;

  const [businessData, setBusinessData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'settings' | 'leads'>('leads');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      // טעינת הגדרות העסק
      const snap = await getDoc(doc(db, "trials", trialId));
      if (snap.exists()) setBusinessData(snap.data());

      // טעינת הלידים והזמנות פעילות
      const q = query(collection(db, "trials", trialId, "leads"), orderBy("createdAt", "desc"));
      const lSnap = await getDocs(q);
      setLeads(lSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    loadData();
  }, [trialId]);

  // פונקציה לעדכון סטטוס ההובלה עבור הלקוח
  const updateOrderStatus = async (leadId: string, newStep: number) => {
    try {
      const leadRef = doc(db, "trials", trialId, "leads", leadId);
      await updateDoc(leadRef, { currentStep: newStep });
      
      // עדכון ה-State המקומי כדי לראות את השינוי מיד
      setLeads(leads.map(l => l.id === leadId ? { ...l, currentStep: newStep } : l));
      
      // כאן בעתיד נוסיף שליחת הודעת וואטסאפ אוטומטית ללקוח: "המשאית יצאה לדרך!"
      console.log(`Status updated to step ${newStep}`);
    } catch (e) {
      console.error("Error updating status", e);
    }
  };

  if (!businessData) return <div className="h-screen flex items-center justify-center font-mono text-blue-500 animate-pulse">טוען מערכת SabanOS... 🚛</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans" dir="rtl">
      {/* Sidebar / Header */}
      <nav className="bg-slate-900 text-white p-6 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-[0_0_15px_rgba(37,99,235,0.5)]">
            <Truck size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-black italic">אבו ראסם - Control Center</h1>
            <p className="text-blue-400 text-xs font-mono">SabanOS Business Intelligence</p>
          </div>
        </div>

        <div className="flex bg-slate-800 p-1 rounded-2xl">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'leads' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            ניהול הובלות
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
          >
            הגדרות מוח
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {activeTab === 'leads' ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <Zap className="text-yellow-500 fill-yellow-500" /> הובלות פעילות בזמן אמת
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {leads.map((lead) => (
                <div key={lead.id} className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-8 items-start lg:items-center">
                  {/* פרטי לקוח */}
                  <div className="min-w-[200px]">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">לקוח</p>
                    <h3 className="text-xl font-black text-slate-900">{lead.name || "לקוח ללא שם"}</h3>
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-blue-600 font-bold mt-2 hover:underline">
                      <Phone size={16} /> {lead.phone}
                    </a>
                  </div>

                  {/* בקרת סטטוס - הניאון של אבו ראסם */}
                  <div className="flex-1 w-full">
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-4 text-center lg:text-right">עדכן סטטוס מעקב (מה שהלקוח רואה)</p>
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          onClick={() => updateOrderStatus(lead.id, s)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                            (lead.currentStep || 1) >= s 
                              ? 'border-blue-500 bg-blue-50 text-blue-700' 
                              : 'border-slate-100 bg-slate-50 text-slate-400 opacity-50'
                          } ${(lead.currentStep || 1) === s ? 'ring-4 ring-blue-100' : ''}`}
                        >
                          <div className="text-[10px] font-black italic">שלב {s}</div>
                          {s === 1 && <Package size={18} />}
                          {s === 2 && <Home size={18} />}
                          {s === 3 && <Truck size={18} className={(lead.currentStep || 1) === 3 ? "animate-bounce" : ""} />}
                          {s === 4 && <MapPin size={18} />}
                          {s === 5 && <CheckCircle2 size={18} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* כפתור וואטסאפ מהיר */}
                  <button 
                    onClick={() => window.open(`https://wa.me/${lead.phone}?text=שלום ${lead.name}, הובלות אבו ראסם כאן! הסטטוס שלך עודכן ל${stepsMap[lead.currentStep || 1]}`, '_blank')}
                    className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-3xl shadow-lg shadow-green-100 transition-all active:scale-95"
                  >
                    שלח הודעה 📲
                  </button>
                </div>
              ))}
              {leads.length === 0 && (
                <div className="text-center py-20 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 italic">ממתין להזמנות חדשות מהצ'אט... ⏳</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* הגדרות מוח - ה-Pricing Rules */
          <div className="max-w-3xl mx-auto">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border-t-8 border-blue-600">
              <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                <Settings className="text-blue-600" /> המוח של אבו ראסם
              </h3>
              <p className="text-slate-500 mb-6 text-sm">כאן אתה קובע את חוקי המשחק. כל מה שתכתוב כאן, הבוט ידע לענות ללקוח.</p>
              
              <textarea 
                className="w-full h-80 p-8 bg-slate-50 rounded-[2rem] border-2 border-slate-100 focus:border-blue-500 focus:ring-0 outline-none transition-all text-lg"
                value={businessData.pricingRules || ""}
                onChange={(e) => setBusinessData({...businessData, pricingRules: e.target.value})}
                placeholder="למשל: הובלה קטנה 450₪, כל קומה בלי מעלית 15₪ לפריט..."
              />
              
              <button 
                onClick={async () => {
                  setSaving(true);
                  await updateDoc(doc(db, "trials", trialId), businessData);
                  setSaving(false);
                }}
                className="w-full mt-8 bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl transition-all flex items-center justify-center gap-3"
              >
                {saving ? "מעדכן מערכת..." : <><Save /> שמור הגדרות מוח</>}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const stepsMap: Record<number, string> = {
  1: "אריזה והכנה",
  2: "הורדה למשאית",
  3: "נסיעה ליעד",
  4: "פריקה בכתובת החדשה",
  5: "סיום מוצלח"
};
