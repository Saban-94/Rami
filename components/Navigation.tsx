"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Home, Briefcase, Mail, Sun, Moon, MessageSquare, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // מניעת הידרציה כפולה ב-Next.js
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { name: "דף הבית", icon: <Home size={20} />, href: "/" },
    { name: "פרויקטים", icon: <Briefcase size={20} />, href: "#projects" },
    { name: "שירותים", icon: <Zap size={20} />, href: "#services" },
    { name: "צור קשר", icon: <Mail size={20} />, href: "#contact" },
  ];

  if (!mounted) return null;

  return (
    <>
      {/* --- NAVBAR ראשי --- */}
      <nav className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md bg-white/30 dark:bg-slate-900/40 border-b border-white/20 dark:border-slate-800 shadow-lg px-6 h-16 flex items-center justify-between">
        {/* לוגו יוקרתי */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
            R
          </div>
          <span className="text-lg font-bold tracking-tight dark:text-white">
            Rami <span className="text-cyan-500">Systems</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* בורר מצב כהה/בהיר */}
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-white/10 dark:bg-white/5 border border-white/20 hover:bg-white/20 transition-all shadow-inner"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? (
              <Sun size={18} className="text-yellow-400" />
            ) : (
              <Moon size={18} className="text-slate-700" />
            )}
          </button>
          
          {/* כפתור המבורגר */}
          <button 
            onClick={() => setIsOpen(true)} 
            className="p-2.5 rounded-xl bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 hover:bg-cyan-400 transition-all"
          >
            <Menu size={22} />
          </button>
        </div>
      </nav>

      {/* --- SIDEBAR תפריט צד --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* רקע מטושטש לסגירה */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            
            {/* תוכן התפריט */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-72 h-full bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl border-l border-white/20 z-[70] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10 mt-2">
                <span className="font-bold text-xl dark:text-white flex items-center gap-2">
                  תפריט ניווט
                </span>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full dark:text-white transition-all"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {menuItems.map((item, index) => (
                  <motion.a 
                    key={item.name} 
                    href={item.href}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-lg font-medium p-4 rounded-2xl hover:bg-cyan-500/10 hover:text-cyan-500 transition-all group dark:text-white"
                  >
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 group-hover:bg-cyan-500 group-hover:text-white transition-all shadow-sm">
                      {item.icon}
                    </div>
                    {item.name}
                  </motion.a>
                ))}
              </div>

              {/* Quick Actions / M365 Demo Footer */}
              <div className="absolute bottom-10 left-6 right-6 pt-6 border-t border-slate-200 dark:border-white/10">
                 <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-4 font-bold text-center">RamiSuite v2.0</p>
                 <button 
                   onClick={() => window.open('https://wa.me/9725XXXXXXXX', '_blank')}
                   className="w-full bg-green-500 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-green-400 transition-all flex items-center justify-center gap-2"
                 >
                   וואטסאפ מהיר
                 </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
