import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  initializeFirestore, 
  memoryLocalCache,
  indexedDbLocalCache
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Singleton App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

/**
 * פתרון שגיאת Illegal constructor:
 * אנחנו מכריחים את Firestore לעבוד בלי ה-WebChannel המורכב שגורם לקריסה
 */
const db = initializeFirestore(app, {
  // השורה הזו מונעת מ-Firestore לנסות לפתוח ערוצי תקשורת מורכבים ב-Next.js
  experimentalForceLongPolling: true, 
  // אנחנו מגדירים זיכרון מקומי פשוט במקום סנכרון טאבים מורכב
  localCache: memoryLocalCache() 
});

const auth = getAuth(app);

export { app, db, auth };
