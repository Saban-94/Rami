"use client";

import React from 'react';
import { Sparkles, Phone, MapPin, Calendar, CheckCircle2, MessageSquare } from 'lucide-react';

export default function TemplateEngine({ manifest }: { manifest: any }) {
  if (!manifest) return null;

  const theme = manifest.appConfig?.theme || {};
  const primaryColor = theme.primaryColor || "#3b82f6";
  const borderRadius = theme.borderRadius || "12px";
  const blocks = manifest.appConfig?.blocks || [];

  const hero = blocks.find((b: any) => b.id === 'hero') || blocks[0];
  const cta = blocks.find((b: any) => b.type === 'button') || { label: "קבע תור" };

  return (
    <div className="flex-1 bg-white overflow-y-auto flex flex-col h-full" style={{ fontFamily: theme.fontFamily || 'Inter, sans-serif' }}>
      
      {/* Hero Section */}
      <section className="p-8 pt-12 text-center relative overflow-hidden">
        <div 
          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
          className="w-20 h-20 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center shadow-sm"
        >
          <Sparkles size={40} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight leading-tight">
          {manifest.businessName || "העסק שלך"}
        </h1>
        <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8 max-w-[240px] mx-auto">
          {hero?.subtitle || hero?.title || "פתרונות מתקדמים בהתאמה אישית"}
        </p>
        <button 
          style={{ backgroundColor: primaryColor, borderRadius: borderRadius }}
          className="w-full py-5 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          {cta?.label}
        </button>
      </section>

      {/* Services Grid (Dynamic from Training) */}
      <section className="p-8 bg-slate-50/50 flex-1">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
          <CheckCircle2 size={12} style={{ color: primaryColor }} /> שירותים פופולריים
        </h2>
        <div className="grid grid-cols-1 gap-3">
          {manifest.trainingHistory?.length > 0 ? (
            manifest.trainingHistory.slice(0, 4).map((item: any, i: number) => (
              <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm">
                 <span className="text-xs font-bold text-slate-700">{item.text.length > 30 ? item.text.substring(0,30) + '...' : item.text}</span>
                 <div style={{ color: primaryColor }}><Calendar size={14}/></div>
              </div>
            ))
          ) : (
            <div className="p-8 border-2 border-dashed border-slate-200 rounded-3xl text-center text-slate-400 text-[10px] font-bold uppercase">
              המערכת לומדת את השירותים שלך...
            </div>
          )}
        </div>
      </section>

      {/* Modern Footer Contact */}
      <section className="p-6 bg-white">
        <div className="flex gap-2">
          <a 
            href={`tel:${manifest.customers?.[0]?.phone}`}
            className="flex-1 bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Phone size={16} />
            <span className="text-[10px] font-black uppercase">התקשר</span>
          </a>
          <div 
            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
            className="p-4 rounded-2xl transition-transform active:scale-95"
          >
            <MessageSquare size={18} />
          </div>
        </div>
      </section>
    </div>
  );
}
