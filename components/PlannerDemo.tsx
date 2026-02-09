"use client";
import { CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

const demoTasks = [
  { id: 1, title: "אפיון מערכת VIP - ח. סבן", status: "בביצוע", date: "09/02/2026" },
  { id: 2, title: "סנכרון מלאי SharePoint ל-Firebase", status: "ממתין", date: "10/02/2026" },
  { id: 3, title: "הגדרת PWA ללקוח חדש", status: "בביצוע", date: "11/02/2026" },
];

export default function PlannerDemo() {
  return (
    <div className="glass p-6 rounded-3xl border border-white/10 shadow-2xl mx-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="text-cyan-400" />
          משימות Planner (דמה)
        </h3>
      </div>
      <div className="space-y-4">
        {demoTasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">{task.title}</span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock size={10} /> {task.date}
              </span>
            </div>
            <span className={`text-[10px] px-2 py-1 rounded-md font-bold ${task.status === 'בביצוע' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-500/20 text-slate-400'}`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
