// lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

// ---- בדיקת קונפיג מהסביבה ----
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
} as const;

// פונקציה עזר לבדיקה — רק בלקוח נבדוק באמת, בשרת לא נטען כלל.
function isFirebaseConfigValid() {
  return Object.values(firebaseConfig).every((v) => typeof v === "string" && v.length > 0);
}

// ---- מנגנון אתחול בטוח ----
// בשרת: לא מאתחלים ולא טוענים מודולים של Firebase כדי לא להפיל prerender.
// בלקוח: אתחול עצלני עם מניעת כפילויות (גם ב-HMR).

declare global {
  // נשתמש ב-globalThis לשמירה בפיתוח (לא מגדיר במודול גלובלי בפרודקשן)
  // נדרש כדי למנוע שגיאות TypeScript בהרחבת globalThis
  // eslint-disable-next-line no-var
  var _firebaseApp: FirebaseApp | undefined;
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

if (typeof window !== "undefined") {
  // אנחנו בצד לקוח
  if (!isFirebaseConfigValid()) {
    // לא עוצר את הביצוע, רק מזהיר (כדי לא לשבור build)
    // אפשר להחליף ל-throw אם אתה רוצה לעצור
    console.warn("[firebase] Missing NEXT_PUBLIC_* config values.");
  }

  // שמירה גלובלית בפיתוח כדי למנוע initializeApp כפול
  if (!globalThis._firebaseApp) {
    globalThis._firebaseApp =
      getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  }

  app = globalThis._firebaseApp;
  db = getFirestore(app);
}

// ייצוא מפורש עם טיפוסים — בשרת תקבל null, בלקוח מופעים תקינים
export { app, db };
export type { FirebaseApp, Firestore };
