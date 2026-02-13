import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Analytics עובד רק בדפדפן, לכן נייבא אותו בזהירות
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCJtctJALFhWbYXQSeGaT-0Ewr_aONZhaU",
  authDomain: "rami-it.firebaseapp.com",
  projectId: "rami-it",
  storageBucket: "rami-it.firebasestorage.app",
  messagingSenderId: "796181594095",
  appId: "1:796181594095:web:46d5ed6bd44c677cc1401a",
  measurementId: "G-DRH16ZP7S1"
};

// אתחול אפליקציה - הגנה מפני ריצה בשרת (Vercel Build)
const app = typeof window !== "undefined" 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

// ייצוא Firestore - זה מה שהיה חסר לך!
export const db = app ? getFirestore(app) : null;

// אתחול Analytics רק אם נתמך (בדפדפן)
if (typeof window !== "undefined" && app) {
  isSupported().then((supported) => {
    if (supported) getAnalytics(app);
  });
}

export { app };
