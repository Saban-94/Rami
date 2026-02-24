import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, initializeFirestore, persistentLocalCache, _debugAssert } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// אתחול האפליקציה
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// פתרון השגיאה: אתחול Firestore עם הגדרות ספציפיות שמונעות בעיות ב-SSR
const db = getFirestore(app);

// אופציונלי: אם השגיאה נמשכת, השתמש ב-initializeFirestore במקום getFirestore:
/*
const db = initializeFirestore(app, {
  localCache: persistentLocalCache() 
});
*/

const auth = getAuth(app);

export { app, db, auth };
