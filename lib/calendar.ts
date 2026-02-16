/* lib/calendar.ts */
import { google } from 'googleapis';
import { getGoogleAuth } from './googleAuth';

export async function createBusinessCalendar(businessName: string) {
  // קבלת הרשאות לניהול יומן
  const auth = getGoogleAuth(['https://www.googleapis.com/auth/calendar']);
  const calendar = google.calendar({ version: 'v3', auth });

  // יצירת יומן משני (Secondary Calendar)
  const res = await calendar.calendars.insert({
    requestBody: {
      summary: `SabanOS: ${businessName}`,
      timeZone: 'Asia/Jerusalem',
    },
  });

  return res.data.id; // מחזיר את ה-calendarId
}
