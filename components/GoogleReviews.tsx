'use client';

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "ד״ר שן - Nile App",
    role: "מרפאת שיניים",
    text: "המערכת שינתה לנו את הדינמיקה במרפאה. ה-AI סוגר תורים בשעות הלילה כשהמרפאה סגורה, והמטופלים מגיעים בבוקר כשהכל כבר ביומן. חסכנו חצי משרה של פקידת קבלה.",
    avatar: "https://i.pravatar.cc/150?img=11",
    stars: 5,
    date: "לפני שבוע"
  },
  {
    name: "עמאר אומן - Glow Hair",
    role: "מעצב שיער",
    text: "כל ספר יודע שהכי קשה זה לענות לטלפונים תוך כדי תספורת. היום הלקוחות שלי פשוט שולחים הודעה לצ'אט והתור נסגר לבד. המלשינון בסטודיו נותן לי שקט שאף תור לא מתפספס.",
    avatar: "https://i.pravatar.cc/150?img=12",
    stars: 5,
    date: "לפני יומיים"
  },
  {
    name: "רוני שמש - TurboFix",
    role: "בעל מוסך",
    text: "הלקוחות במוסך אוהבים שקיפות. כשהם מקבלים אישור אוטומטי בווטסאפ עם לינק קסם להרשמה, זה נראה להם כמו הייטק. המערכת הכי יציבה שעבדתי איתה.",
    avatar: "https://i.pravatar.cc/150?img=13",
    stars: 5,
    date: "לפני חודש"
  },
  {
    name: "מיטל כהן",
    role: "מכון קוסמטיקה",
    text: "הקטלוג הדינמי פשוט גאוני. אני מעדכנת מבצע על טיפול פנים דרך ה-AI בסטודיו, ותוך דקה כל הלקוחות רואות את זה באפליקציה שלהן. פשוט וגאוני.",
    avatar: "https://i.pravatar.cc/150?img=25",
    stars: 5,
    date: "לפני 3 ימים"
  }
];

export default function GoogleReviews() {
  return (
    <section className="py-24 bg-white dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center mb-16 text-center">
          <div className="flex items-center gap-2 mb-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_Logo.svg" className="w-8 h-8" alt="Google" />
            <h2 className="text-3xl font-black italic dark:text-white uppercase tracking-tighter">דירוג עסקים SabanOS</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold dark:text-white">4.9</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
            </div>
            <span className="text-sm opacity-50 dark:text-slate-400">(124 ביקורות מאומתות)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#f8f9fa] dark:bg-white/5 p-6 rounded-3xl border border-slate-200 dark:border-white/10 flex flex-col hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-center gap-3 mb-4">
                <img src={rev.avatar} className="w-12 h-12 rounded-full border-2 border-green-500" alt={rev.name} />
                <div className="text-right">
                  <h4 className="text-sm font-black dark:text-white leading-none">{rev.name}</h4>
                  <p className="text-[10px] text-green-500 font-bold uppercase mt-1">{rev.role}</p>
                </div>
              </div>

              <div className="flex text-yellow-400 mb-3">
                {[...Array(rev.stars)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
              </div>

              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed flex-1">
                "{rev.text}"
              </p>

              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 flex justify-between items-center text-[10px] opacity-40">
                <span>{rev.date}</span>
                <span className="font-bold">Verified ✅</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
