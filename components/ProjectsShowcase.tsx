"use client";
import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Zap, Box, ShieldCheck, Database } from "lucide-react";

const projects = [
  {
    id: "saban-logistics",
    title: "מערכת ניהול לוגיסטיקה - ח. סבן",
    description: "אקו-סיסטם מלא המנהל מלאי, מכולות ותנועות סחורה בזמן אמת. הפרויקט שחיבר בין השטח למשרד.",
    tech: ["PWA", "Firebase", "Google Sheets API"],
    impact: "חיסכון של 40% בזמן דיווח ידני",
    icon: <Box className="text-cyan-400" />,
    color: "from-cyan-500/20 to-blue-500/20"
  },
  {
    id: "cross-cloud-sync",
    title: "גשר האוטומציה: M365 ↔ Google",
    description: "פיתוח מנוע סנכרון דו-כיווני בין יומנים, משימות פלנר ומסדי נתונים ארגוניים ללא צורך בשרת חיצוני.",
    tech: ["Power Automate", "Next.js", "MS Graph"],
    impact: "סנכרון מלא ב-0 שניות שיהוי",
    icon: <Zap className="text-yellow-400" />,
    color: "from-yellow-500/20 to-orange-500/20"
  },
  {
    id: "security-gate",
    title: "מערכת בקרת כניסה וניהול VIP",
    description: "אפליקציית ניהול מאובטחת לאישור כניסות, רישום מבקרים והנפקת אישורים דיגיטליים מיידיים.",
    tech: ["NextAuth", "Firestore", "Tailwind"],
    impact: "אבטחה מקסימלית וחוויית משתמש יוקרתית",
    icon: <ShieldCheck className="text-green-400" />,
    color: "from-green-500/20 to-emerald-500/20"
  }
];

export default function ProjectsShowcase() {
  return (
    <section id="projects" className="py-12 px-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1.5 bg-cyan-500 rounded-full" />
        <h2 className="text-3xl font-extrabold tracking-tight">הפרויקטים שלנו</h2>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className={`group relative p-1 rounded-[2.5rem] bg-gradient-to-br ${project.color} border border-white/10`}
          >
            <div className="bg-slate-900/90 dark:bg-[#0F172A]/90 backdrop-blur-2xl rounded-[2.4rem] p-8 h-full transition-all group-hover:bg-transparent">
              <div className="flex items-start justify-between mb-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  {project.icon}
                </div>
                <ExternalLink className="text-slate-500 group-hover:text-cyan-400 transition-colors" size={20} />
              </div>

              <h3 className="text-2xl font-bold mb-3">{project.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {project.tech.map((t) => (
                  <span key={t} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-white/5 border border-white/10 rounded-full text-slate-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-medium text-cyan-400/80 italic">{project.impact}</span>
                <button className="text-xs font-bold underline decoration-cyan-500/50 underline-offset-4 hover:text-cyan-400 transition-colors">
                  לפרטים נוספים
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
