import * as admin from 'firebase-admin';

// מניעת אתחול כפול של ה-Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        // שימוש במשתני הסביבה שהגדרת ב-Vercel
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        // טיפול קריטי בתווי ירידת שורה במפתח הפרטי
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

// ייצוא ה-Firestore של ה-Admin לשימוש ב-Server Actions
export const dbAdmin = admin.firestore();
