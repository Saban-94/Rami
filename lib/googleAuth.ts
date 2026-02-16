/* lib/googleAuth.ts */
import { google } from 'googleapis';

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

function getServiceAccount(): ServiceAccount {
  // בדיקה אם המפתח נמצא ב-Base64 (מומלץ ב-Vercel למניעת בעיות תווים)
  if (process.env.GOOGLE_DRIVE_CREDENTIALS_BASE64) {
    const decoded = Buffer.from(process.env.GOOGLE_DRIVE_CREDENTIALS_BASE64, 'base64').toString('utf-8');
    const json = JSON.parse(decoded);
    return {
      client_email: json.client_email,
      private_key: json.private_key,
    };
  }

  // בדיקה אם המפתח נמצא כ-JSON גולמי
  if (process.env.GOOGLE_DRIVE_CREDENTIALS) {
    const json = JSON.parse(process.env.GOOGLE_DRIVE_CREDENTIALS);
    return {
      client_email: json.client_email,
      private_key: (json.private_key as string).replace(/\\n/g, '\n'), // תיקון ירידת שורה
    };
  }

  throw new Error('Missing GOOGLE_DRIVE_CREDENTIALS or GOOGLE_DRIVE_CREDENTIALS_BASE64');
}

export function getGoogleAuth(scopes: string[]) {
  const { client_email, private_key } = getServiceAccount();
  
  return new google.auth.JWT(
    client_email,
    undefined,
    private_key,
    scopes
  );
}
