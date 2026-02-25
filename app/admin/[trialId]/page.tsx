"use client";

import React, { useState, useEffect, use } from "react";
import { Save, Users, Settings, MessageSquare, Phone, MapPin, CheckCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, collection, getDocs, orderBy, query } from "firebase/firestore";

export default function AdminDashboard({ params }: { params: Promise<{ trialId: string }> | { trialId: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const trialId = resolvedParams.trialId;

  const [data, setData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      const docRef = doc(db, "trials", trialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) setData(snap.data());

      const leadsRef = collection(db, "trials", trialId, "leads");
      const q = query(leadsRef, orderBy("createdAt", "desc"));
      const leadsSnap = await getDocs(q);
      setLeads(leadsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
    }
    loadData();
  }, [trialId]);

  const handleSave = async () => {
    setSaving(true);
    await updateDoc(doc(db, "trials", trialId), data);
    setSaving(false);
    alert("המערכת עודכנה בהצלחה! ✅");
  };

  if (!data) return <div className="p-10 text-center">טוען נתונים... 🚛</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans text-slate-800" dir="rtl">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* כותרת עסק */}
        <div className="bg-white p-8 rounded-3xl shadow-sm flex items-center justify-between border-b-4 border-green-500">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">שלום אבו ראסם 👋</h1>
            <p className="text-slate-500">כאן אתה מנהל את המוח של העסק שלך</p>
          </div>
          <button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-transform active:scale-95">
            {saving ? "שומר..." : "עדכן את המוח 🧠"}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* הגדרות חכמות */}
          <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Settings className="text-blue-500" /> הגדרות מחירון
            </h2>
            <textarea 
              value={data.pricingRules}
              onChange={(e) => setData({...data, pricingRules: e.target.value})}
              className="w-full h-64 p-4 bg-slate-50 border-none rounded-2xl focus:ring-2 ring-blue-500 outline-none text-sm leading-relaxed"
              placeholder="כתוב כאן מחירון: הובלה קטנה 250 שח, קומה 50 שח..."
            />
          </div>

          {/* לידים ולקוחות */}
          <div className="bg-white p-6 rounded-3xl shadow-sm overflow-hidden">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Users className="text-orange-500" /> לקוחות שביקשו הובלה
            </h2>
            <div className="space-y-4 overflow-y-auto max-h-[300px]">
              {leads.map(lead => (
                <div key={lead.id} className="p-4 bg-slate-50 rounded-2xl border-r-4 border-orange-400 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-900">{lead.name}</p>
                    <p className="text-sm text-blue-600">{lead.phone}</p>
                  </div>
                  <a href={`https://wa.me/${lead.phone}`} className="p-2 bg-green-100 text-green-700 rounded-full">
                    <Phone size={18} />
                  </a>
                </div>
              ))}
              {leads.length === 0 && <p className="text-slate-400 text-center py-10 italic">עוד אין לקוחות חדשים... הלינקים בדרך 🚛</p>}
            </div>
          </div>

        </div>

        {/* תצוגת סימולציה */}
        <div className="bg-[#0f172a] text-white p-8 rounded-3xl shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <MessageSquare className="text-green-400" /> איך המוח מדבר עם הלקוחות שלך
          </h2>
          <div className="space-y-6">
            <div className="flex gap-3">
              <div className="bg-slate-700 p-4 rounded-2xl rounded-tr-none max-w-[80%]">
                אהלן, אני מעוניין להוביל מקרר מטייבה. שמי יוסף.
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <div className="bg-green-600 p-4 rounded-2xl rounded-tl-none max-w-[80%]">
                נעים מאוד יוסף ידידי 🤝 הובלת מקרר בטייבה אצלנו זה עניין פשוט ומקצועי. מאיזו קומה ההובלה והאם יש מעלית בבניין? 🚛
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
