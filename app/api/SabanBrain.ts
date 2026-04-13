// SabanBrain - מנוע ההחלטות של SabanOS
import { Order, InventoryItem, DriverStatus } from '../types';

export class SabanBrain {
  /**
   * ניתוח דוח בוקר ועדכון סטטוסים
   */
  static processMorningLog(logData: any[]) {
    return logData.map(row => ({
      date: row['תאריך'],
      driver: row['נהג'],
      customer: row['לקוח'],
      status: row['סטטוס'],
      isDelivered: row['סטטוס'] === 'סופקה (✅)'
    }));
  }

  /**
   * בדיקת תקינות הזמנה לפי חוקי המלאי (מבוסס על קובץ מלאי.csv)
   */
  static validateOrderRequirements(item: InventoryItem, quantity: number) {
    // דוגמה לחוק: בטון מוכן מחייב מינימום 6 קוב
    if (item.sku === '10250' && quantity < 6) {
      return { valid: false, message: 'מינימום הזמנה לבטון הוא 6 קוב' };
    }
    
    // דוגמה לחוק: מעל 40 שקים מחייב משטח סבן פקדון
    if (item.sku === '15181' && quantity > 40) {
      return { valid: true, requiresDeposit: true, message: 'שים לב: נדרש חיוב פקדון על משטח' };
    }

    return { valid: true };
  }

  /**
   * יצירת סיכום שורת הזמנה לווטסאפ (כמו בעמודה 2 בדוח)
   */
  static generateOrderSummary(order: Order) {
    return `
סיכום הזמנה:
- נהג: ${order.driver}
- לקוח: ${order.customer}
- יעד: ${order.destination}
- תעודת משלוח: ${order.deliveryNote || 'טרם הופקה'}
- סטטוס: ${order.status}
    `.trim();
  }
}
