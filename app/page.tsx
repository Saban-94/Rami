"use client";
import React from "react";
import Link from "next/link";
import { Truck, MessageSquare, Map, History, LayoutDashboard, UserCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function HomeGateway() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center" dir="rtl">
      {/* לוגו אבו אל ראסם */}
      <motion.img 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }}
        src="https://your-logo-link-here.com/logo.png" // שים כאן את הלינק ללוגו
        alt="אבו אל ראסם"
        className="w-32 h-32 object-contain mb-8 shadow-2xl rounded-full border-2 border-blue-500/50"
      />

      <h1 className="text-4xl font-black italic mb-2 tracking-tighter">SabanOS v3.0</h1>
      <p className="text-blue-400 font-bold mb-12 uppercase tracking-widest text-xs">הובלות אבו אל ראסם - מערכת ניהול חכמה</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* פורטל לקוח */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-slate-500 uppercase flex items-center gap-2">
            <UserCircle size={16} /> אזור לקוחות
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <NavButton icon={<MessageSquare />} label="צ'אט AI" href="/chat" color="bg-blue-600" />
            <NavButton icon={<Map />} label="מעקב חי" href="/track" color="bg-indigo-600" />
            <NavButton icon={<History />} label="היסטוריה" href="/history" color="bg-slate-800" />
            <NavButton icon={<Truck />} label="הצעות מחיר" href="/quotes" color="bg-slate-800" />
          </div>
        </div>

        {/* פורטל אבו ראסם */}
        <div className="space-y-4">
          <h2 className="text-sm font-black text-red-500 uppercase flex items-center gap-2">
            <LayoutDashboard size={16} /> ניהול אבו ראסם
          </h2>
          <Link href="/admin/abu-rassem/dashboard" className="block w-full h-full">
            <div className="h-full bg-red-600/10 border-2 border-red-600/30 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 hover:bg-red-600/20 transition-all group">
              <LayoutDashboard size={48} className="text-red-500 group-hover:scale-110 transition-transform" />
              <span className="text-xl font-black italic text-red-500">דשבורד מרכזי</span>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

function NavButton({ icon, label, href, color }: any) {
  return (
    <Link href={href}>
      <div className={`${color} p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:scale-105 transition-all shadow-xl active:scale-95 border border-white/10`}>
        <div className="text-white">{icon}</div>
        <span className="text-xs font-black italic">{label}</span>
      </div>
    </Link>
  );
}
