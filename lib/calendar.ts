/* lib/calendar.ts */
import { google } from 'googleapis';
import { getGoogleAuth } from './googleAuth';

/**
 * יוצר יומן חדש (Secondary Calendar) עבור לקוח
 */
export async function createBusinessCalendar(businessName: string) {
  const auth = getGoogleAuth(['https://www.googleapis.com/auth/calendar']);
  const calendar = google.calendar({ version: 'v3', auth });

  const res = await calendar.calendars.insert({
    requestBody: {
      summary: `SabanOS: ${businessName}`,
      timeZone: 'Asia/Jerusalem',
    },
  });

  return res.data.id; // זה ה-calendarId שנשמור ב-Manifest
}
