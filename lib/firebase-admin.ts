import admin from 'firebase-admin';

// בדיקה אם האפליקציה כבר אותחלה כדי למנוע שגיאות בשלבי ה-Hot Reload של Next.js
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // טיפול קריטי בתווי ירידת שורה במפתח הפרטי שמגיע ממשתני הסביבה
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log("✅ Firebase Admin Initialized Successfully");
  } catch (error) {
    console.error('❌ Firebase admin initialization error:', error);
  }
}

// ייצוא ה-Database לשימוש ב-Server Actions
export const db = admin.firestore();
