import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
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

// אתחול Singleton שמונע אתחול כפול
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);

// אתחול Analytics בצורה בטוחה (רק בדפדפן)
export const initAnalytics = async () => {
  if (typeof window !== "undefined") {
    const supported = await isSupported();
    if (supported) return getAnalytics(app);
  }
  return null;
};

export { app };
