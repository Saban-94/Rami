import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCJtctJALFhWbYXQSeGaT-0Ewr_aONZhaU",
  authDomain: "rami-it.firebaseapp.com",
  projectId: "rami-it",
  storageBucket: "rami-it.firebasestorage.app",
  messagingSenderId: "796181594095",
  appId: "1:796181594095:web:46d5ed6bd44c677cc1401a",
  measurementId: "G-DRH16ZP7S1"
};

// אתחול עצלני - קורה רק כשקוראים למי מהפונקציות ורק בדפדפן
const getFirebaseApp = () => {
  if (typeof window === "undefined") return null;
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
};

export const db = typeof window !== "undefined" ? getFirestore(getFirebaseApp()!) : null;
export const auth = typeof window !== "undefined" ? getAuth(getFirebaseApp()!) : null;
export const app = getFirebaseApp();
