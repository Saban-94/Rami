"use client";
import React from "react";
import { motion } from "framer-motion";
import { Globe, Cpu, Zap, Database, Infinity } from "lucide-react";

const services = [
  {
    title: "Google Cloud Ecosystem",
    description: "שליטה מלאה ב-Google Cloud ו-Workspace API. אוטומציה של Sheets, יומנים ופתרונות ענן מורכבים.",
    icon: <Globe className="text-blue-500" />,
    tools: ["Google Sheets API", "Apps Script", "Cloud Functions"]
  },
  {
    title: "Firebase Real-time Logic",
    description: "ניהול מסדי נתונים בזמן אמת, אימות משתמשים (Auth) ואחסון קבצים מאובטח עם ביצועים של קצה לקצה.",
    icon: <Database className="text-orange-500" />,
    tools: ["Firestore", "Cloud Messaging", "Security Rules"]
  },
  {
    title: "Microsoft 365 Mastery",
    description: "חיבור עמוק ל-Power Automate ו-Graph API. הפיכת Outlook, Teams ו-SharePoint למכונות עבודה אוטומטיות.",
    icon: <Cpu className="text-blue-600" />,
    tools: ["Power Automate", "MS Graph API", "SharePoint Logic"]
  },
  {
    title: "Vercel Edge Deployment",
    description: "אירוח אפליקציות Next.js בסטנדרט הגבוה בעולם. מהירות טעינה מקסימלית (Edge) ו-Uptime של 100%.",
    icon: <Zap className="text-slate-900 dark:text-white" />,
    tools: ["Serverless Functions", "Edge Runtime", "CI/CD Pipelines"]
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 px-6 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-64 h-64 bg-blue-500/5 blur-[120px] rounded-full" />
      
      <div className="max-w-6xl mx-auto text-right">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-6 dark:text-white"
          >
            הארסנל <span className="text-cyan-500">הטכנולוגי</span>
          </motion.h2>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg">
            אני לא רק בונה אפליקציות, אני מחבר בין עולמות. שליטה מלאה בתשתיות הענן המובילות ליצירת פתרונות בלתי שבירים.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/10 hover:border-cyan-500/50 transition-all group"
            >
              <div className="flex flex-col md:flex-row-reverse items-start gap-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-cyan-500/10 transition-colors">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-3 dark:text-white group-hover:text-cyan-400 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 justify-end">
                    {service.tools.map((tool) => (
                      <span key={tool} className="text-[10px] font-bold px-3 py-1 bg-cyan-500/5 text-cyan-500 border border-cyan-500/20 rounded-full">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-16 p-8 rounded-[3rem] bg-gradient-to-r from-cyan-600 to-blue-700 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-cyan-500/20"
        >
          <div className="flex flex-row-reverse items-center gap-6 text-right">
            <div className="p-4 bg-white/20 rounded-full backdrop-blur-md">
              <Infinity size={40} strokeWidth={1} />
            </div>
            <div>
              <h4 className="text-2xl font-bold">אינטגרציה ללא גבולות</h4>
              <p className="text-white/80 text-sm">יכולת חיבור בין פלטפורמות שונות לסנכרון מידע מושלם.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
