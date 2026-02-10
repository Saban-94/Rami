import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// את הפרטים האלו אתה לוקח מה-Firebase Console (Project Settings)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "rami-suite-2026.firebaseapp.com",
  projectId: "rami-suite-2026",
  storageBucket: "rami-suite-2026.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// מניעת אתחול כפול ב-Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
