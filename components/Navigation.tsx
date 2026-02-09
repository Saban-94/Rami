"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Menu, X, Home, Briefcase, Mail, Sun, Moon, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const menuItems = [
    { name: "דף הבית", icon: <Home size={20} />, href: "/" },
    { name: "פרויקטים", icon: <Briefcase size={20} />, href: "#projects" },
    { name: "שירותים", icon: <MessageSquare size={20} />, href: "#services" },
    { name: "צור קשר", icon: <Mail size={20} />, href: "#contact" },
  ];

  return (
    <>
      <nav className="fixed top-0 right-0 left-0 z-50 backdrop-blur-md bg-white/10 dark:bg-slate-900/50 border-b border-white/20 dark:border-slate-800 shadow-lg px-6 h-16 flex items-center justify-between">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-cyan-400 to-blue-500 font-hebrew">
          רמי מסארוה
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <Sun size={20} className="hidden dark:block text-yellow-400" />
            <Moon size={20} className="block dark:hidden text-slate-700" />
          </button>
          
          <button onClick={() => setIsOpen(true)} className="p-2 text-cyan-400">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-72 h-full bg-white dark:bg-slate-900 backdrop-blur-xl border-l border-white/20 z-[70] p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="font-bold text-lg dark:text-white">תפריט</span>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full dark:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {menuItems.map((item) => (
                  <a 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 text-lg font-medium hover:text-cyan-400 transition-colors group dark:text-white"
                  >
                    <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 group-hover:bg-cyan-500/20 transition-colors">
                      {item.icon}
                    </div>
                    {item.name}
                  </a>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
