"use client";

import React, { useState, useEffect, use } from "react";
import { Save, Link as LinkIcon, Truck, Brain, DollarSign, ExternalLink } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function AdminDashboard({ params }: { params: Promise<{ trialId: string }> | { trialId: string } }) {
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const trialId = resolvedParams.trialId;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      const docRef = doc(db, "trials", trialId);
      const snap = await getDoc(docRef);
      if (snap.exists()) setData(snap.data());
      setLoading(false);
    }
    load();
  }, [trialId]);

  const saveSettings = async () => {
    setSaving(true);
    const docRef = doc(db, "trials", trialId);
    await updateDoc(docRef, data);
    setSaving(false);
    alert("המוח עודכן בהצלחה! 🧠🚛");
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50">טוען מערכת ניהול...</div>;

  const clientLink = `https://rami-seven.vercel.app/chat/${trialId}`;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-green-600 p-3 rounded-lg text-white">
              <Truck size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">ניהול עסק: {data.businessName}</h1>
              <p className="text-slate-500 text-sm">Trial ID: {trialId}</p>
            </div>
          </div>
          <button 
            onClick={saveSettings}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-green-200"
          >
            {saving ? "שומר..." : <><Save size={20} /> שמור שינויים</>}
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* הלינק ללקוח */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <LinkIcon size={20} />
              <h2 className="font-bold text-lg">לינק לאפליקציה של הלקוחות</h2>
            </div>
            <div className="bg-slate-100 p-3 rounded-lg flex items-center justify-between break-all">
              <code className="text-xs text-slate-600">{clientLink}</code>
            </div>
            <a 
              href={clientLink} 
              target="_blank" 
              className="mt-4 flex items-center justify-center gap-2 w-full py-2 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition-all font-bold"
            >
              <ExternalLink size={18} /> פתח תצוגת לקוח
            </a>
          </div>

          {/* הגדרות מוח */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-4 text-purple-600">
              <Brain size={20} />
              <h2 className="font-bold text-lg">הגדרות המוח (AI)</h2>
            </div>
            <label className="block text-sm text-slate-600 mb-1 font-medium">שם העסק שיוצג:</label>
            <input 
              className="w-full p-2 border border-slate-300 rounded-lg mb-4"
              value={data.businessName}
              onChange={(e) => setData({...data, businessName: e.target.value})}
            />
          </div>

          {/* מחירון והנחיות - רוחב מלא */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 text-orange-600">
              <DollarSign size={20} />
              <h2 className="font-bold text-lg">מחירון והנחיות לוגיסטיות ל-AI</h2>
            </div>
            <p className="text-xs text-slate-500 mb-2">כל מה שתכתוב כאן, המוח ידע וישתמש בו כדי לענות ללקוחות:</p>
            <textarea 
              className="w-full h-48 p-4 border border-slate-300 rounded-xl font-sans text-sm leading-relaxed"
              placeholder="לדוגמה: מחיר בסיס 300 שח, תוספת קומה 50 שח..."
              value={data.pricingRules || ""}
              onChange={(e) => setData({...data, pricingRules: e.target.value})}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
