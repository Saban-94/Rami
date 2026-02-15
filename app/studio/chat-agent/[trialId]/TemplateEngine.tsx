"use client";

import React from 'react';
import { Sparkles, Phone, MapPin, Calendar, CheckCircle2, MessageSquare, Star } from 'lucide-react';

export default function TemplateEngine({ manifest }: { manifest: any }) {
  if (!manifest) return null;

  const theme = manifest.appConfig?.theme || {};
  const isPro = manifest.activeTemplate === "luxury" || manifest.activeTemplate === "pro";
  
  // הגדרות צבעים דינמיות לתבנית ה-Pro
  const primaryColor = isPro ? "#D4AF37" : (theme.primaryColor || "#3b82f6"); // זהב ל-Pro, כחול ל-Free
  const bgColor = isPro ? "#020617" : "#ffffff";
  const textColor = isPro ? "#ffffff" : "#0f172a";
  const cardBg = isPro ? "rgba(255,255,255,0.05)" : "#f8fafc";
  const borderRadius = theme.borderRadius || (isPro ? "40px" : "12px");

  return (
    <div 
      className="flex-1 overflow-y-auto flex flex-col h-full transition-colors duration-700" 
      style={{ 
        backgroundColor: bgColor, 
        color: textColor,
        fontFamily: theme.fontFamily || 'Inter, sans-serif' 
      }}
    >
      
      {/* Badge Pro - מוצג רק בתבנית היוקרה */}
      {isPro && (
        <div className="pt-12 px-8">
           <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-[8px] font-black text-black px-3 py-1 rounded-full w-fit uppercase tracking-widest flex items-center gap-1 mx-auto">
             <Star size={8} fill="currentColor"/> Premium Member
           </div>
        </div>
      )}

      {/* Hero Section */}
      <section className={`p-8 ${isPro ? 'pt-6' : 'pt-12'} text-center relative`}>
        <div 
          style={{ 
            backgroundColor: isPro ? `${primaryColor}20` : `${primaryColor}15`, 
            color: primaryColor,
            border: isPro ? `1px solid ${primaryColor}40` : 'none'
          }}
          className="w-20 h-20 rounded-[2.5rem] mx-auto mb-8 flex items-center justify-center shadow-2xl"
        >
          <Sparkles size={40} className={isPro ? "animate-pulse" : ""} />
        </div>
        
        <h1 className={`text-3xl font-black mb-4 tracking-tight leading-tight ${isPro ? 'bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent' : 'text-slate-900'}`}>
          {manifest.businessName || "העסק שלך"}
        </h1>
        
        <p className={`${isPro ? 'text-slate-400' : 'text-slate-500'} text-sm font-medium leading-relaxed mb-8 max-w-[240px] mx-auto`}>
          {manifest.appConfig?.blocks?.[0]?.subtitle || "חווית שירות בסטנדרט אחר"}
        </p>

        <button 
          style={{ 
            backgroundColor: primaryColor, 
            borderRadius: borderRadius,
            boxShadow: isPro ? `0 10px 30px -10px ${primaryColor}80` : 'none'
          }}
          className={`w-full py-5 ${isPro ? 'text-black font-black' : 'text-white font-bold'} text-xs uppercase tracking-[0.2em] active:scale-95 transition-all`}
        >
          {isPro ? "Book Private Session" : "קבע תור עכשיו"}
        </button>
      </section>

      {/* Services Section */}
      <section className={`p-8 ${isPro ? 'bg-white/5' : 'bg-slate-50/50'} flex-1 rounded-t-[3rem]`}>
        <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-6 flex items-center gap-2 ${isPro ? 'text-amber-500/60' : 'text-slate-400'}`}>
          <CheckCircle2 size={12} /> {isPro ? "Premium Services" : "השירותים שלנו"}
        </h2>
        
        <div className="grid grid-cols-1 gap-3">
          {manifest.trainingHistory?.slice(0, 3).map((item: any, i: number) => (
            <div 
              key={i} 
              style={{ backgroundColor: cardBg, borderColor: isPro ? 'rgba(255,255,255,0.1)' : '#f1f5f9' }}
              className="p-5 rounded-3xl border flex items-center justify-between group transition-all"
            >
               <span className="text-xs font-bold">{item.text.split(' ')[0]} ...</span>
               <div style={{ color: primaryColor }} className="opacity-50 group-hover:opacity-100 transition-opacity">
                 <Calendar size={14}/>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer Contact */}
      <section className={`p-6 ${isPro ? 'bg-black' : 'bg-white'} border-t ${isPro ? 'border-white/5' : 'border-slate-100'}`}>
        <div className="flex gap-3">
          <div className={`flex-1 ${isPro ? 'bg-white text-black' : 'bg-slate-900 text-white'} p-5 rounded-[1.5rem] flex items-center justify-center gap-2 font-black text-[10px] uppercase`}>
            <Phone size={14} /> WhatsApp
          </div>
          <div 
            style={{ border: `1px solid ${isPro ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}` }}
            className="p-5 rounded-[1.5rem] flex items-center justify-center"
          >
            <MapPin size={16} style={{ color: primaryColor }} />
          </div>
        </div>
      </section>
    </div>
  );
}
