"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  ExternalLink, Zap, Box, ShieldCheck, 
  Smartphone, Database, MessageSquare, Search, Camera 
} from "lucide-react";

const portfolioProjects = [
  {
    id: "smart-logic",
    title: "SmartLogic OS",
    subtitle: "ניהול לוגיסטי וחומרי בניין",
    description: "פלטפורמת All-in-One המנהלת מלאי, שינוע והזמנות וואטסאפ ב-AI. הופכת מחסן מסורתי לארגון חכם.",
    impact: "חיסכון של 40% בזמן תפעול ידני",
    icon: <Box className="text-cyan-400" />,
    tech: ["Next.js", "AI Analysis", "PWA"],
    color: "from-blue-600/20 to-cyan-500/20"
  },
  {
    id: "vision-scan",
    title: "VisionScan Pro",
    subtitle: "אימות מסמכי שטח ב-AI",
    description: "ראייה ממוחשבת (Computer Vision) לסריקה ואימות תעודות משלוח בזמן אמת. תיוק אוטומטי לענן בלחיצת כפתור.",
    impact: "אפס טעויות הקלדה בדיווחי שטח",
    icon: <Camera className="text-emerald-400" />,
    tech: ["Gemini Vision", "Cloud Sync", "OCR"],
    color: "from-emerald-600/20 to-teal-500/20"
  },
  {
    id: "beauty-boutique",
    title: "EliteCommerce Boutique",
    subtitle: "מסחר יוקרתי ואסתטיקה",
    description: "חנות בוטיק דיגיטלית בעיצוב Glassmorphism. חוויית קנייה חלקה ב-100% מובייל עם קטלוג ויזואלי מהפנט.",
    impact: "גידול של 25% ביחס המרה במובייל",
    icon: <Database className="text-pink-400" />,
    tech: ["E-commerce", "UX Design", "Animations"],
    color: "from-pink-600/20 to-rose-500/20"
  },
  {
    id: "smart-cat",
    title: "SmartCat AI",
    subtitle: "מנוע קטלוגים אינטראקטיבי",
    description: "חיפוש מוצרים בשפה חופשית. הלקוח שואל את ה-AI על חומרים טכניים ומקבל המלצה מדויקת מהמלאי.",
    impact: "קיצור זמן חיפוש מוצר ב-60%",
    icon: <Search className="text-purple-400" />,
    tech: ["AI Search", "Dynamic JSON", "Chat-Bot"],
    color: "from-purple-600/20 to-indigo-500/20"
  },
  {
    id: "omni-kiosk",
    title: "OmniKiosk Core",
    subtitle: "עמדות שירות עצמי חכמות",
    description: "ממשק קיוסק למסכי מגע בנקודות מכירה. הדרכות טכניות וביצוע הזמנות ללא המתנה לנציג.",
    impact: "שיפור חוויית לקוח בנקודת המכירה",
    icon: <Smartphone className="text-orange-400" />,
    tech: ["Touch UI", "Real-time Sync", "Kiosk Mode"],
    color: "from-orange-600/20 to-amber-500/20"
  },
  {
    id: "shark-crm",
    title: "Shark30 CRM",
    subtitle: "לוח בקרה לביצועי מכירות",
    description: "מערכת אגרסיבית לניהול לידים וסוכנים. השוואה ויזואלית של נתונים עסקיים בזמן אמת (War Room).",
    impact: "שליטה מוחלטת ברווחים וב-KPI",
    icon: <Zap className="text-yellow-400" />,
    tech: ["CRM", "Data Visualization", "Sales Logic"],
    color: "from-yellow-600/20 to-orange-500/20"
  }
];

export default function ProjectsShowcase() {
  return (
    <section id="projects" className="py-20 px-6 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-right">
            <h2 className="text-4xl md:text-5xl font-black dark:text-white mb-4 italic tracking-tight">
              הפתרונות <span className="text-cyan-500">שלנו</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl">
              ארכיטקטורת תוכנה מתקדמת שתפורה לצרכים עסקיים מדויקים. כל פרויקט הוא מנוע צמיחה.
            </p>
          </div>
          <div className="flex gap-4 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
             <div className="flex flex-col items-center px-4 py-2 border-l border-white/10">
                <span className="text-2xl font-bold text-cyan-500">6</span>
                <span className="text-[10px] uppercase text-slate-500 font-bold">מערכות ליבה</span>
             </div>
             <div className="flex flex-col items-center px-4 py-2">
                <span className="text-2xl font-bold text-emerald-500">100%</span>
                <span className="text-[10px] uppercase text-slate-500 font-bold">אוטומציה</span>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {portfolioProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`group relative rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br ${project.color} p-px`}
            >
              <div className="bg-slate-950/90 dark:bg-slate-900/90 backdrop-blur-3xl p-8 h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                    {project.icon}
                  </div>
                  <span className="text-[10px] font-black text-cyan-500/50 uppercase tracking-widest pt-2">
                    {project.subtitle}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.tech.map((t) => (
                    <span key={t} className="text-[9px] font-bold px-2 py-1 bg-white/5 border border-white/10 rounded-md text-slate-400">
                      {t}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-400 italic">
                    {project.impact}
                  </span>
                  <ExternalLink size={16} className="text-slate-600 group-hover:text-white transition-colors" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
