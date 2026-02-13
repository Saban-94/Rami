import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCJtctJALFhWbYXQSeGaT-0Ewr_aONZhaU",
  authDomain: "rami-it.firebaseapp.com",
  projectId: "rami-it",
  storageBucket: "rami-it.firebasestorage.app",
  messagingSenderId: "796181594095",
  appId: "1:796181594095:web:46d5ed6bd44c677cc1401a",
  measurementId: "G-DRH16ZP7S1"
};

// אתחול אפליקציה - הגנה מוחלטת מפני ריצה בשרת (Build time)
const app = typeof window !== "undefined" 
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApp())
  : null;

// ייצוא שירותים בצורה בטוחה
export const db = app ? getFirestore(app) : null;
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;

export { app };
