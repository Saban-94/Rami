import "server-only"; // זה יבטיח שהקובץ לא יזלוג לצד הלקוח
import admin from 'firebase-admin';
// ... שאר הקוד
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // טיפול קריטי בתווי ירידת שורה במפתח הפרטי
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error('Firebase admin initialization error', error);
  }
}

export const db = admin.firestore();
