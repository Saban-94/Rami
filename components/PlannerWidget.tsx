"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function PlannerWidget({ tasks }: { tasks: any[] }) {
  return (
    <div className="glass p-6 rounded-3xl border border-white/20 shadow-2xl overflow-hidden relative group">
      {/* Background Glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/20 blur-3xl rounded-full group-hover:bg-cyan-500/30 transition-all" />
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <CheckCircle2 className="text-cyan-400" />
          משימות Planner
        </h3>
        <span className="text-xs bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full font-bold">
          {tasks.length} פתוחות
        </span>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <motion.div 
            key={task.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className="flex flex-col gap-1">
              <span className="font-medium text-sm">{task.title}</span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock size={12} />
                {task.dueDateTime ? new Date(task.dueDateTime).toLocaleDateString('he-IL') : 'ללא תאריך'}
              </span>
            </div>
            <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
