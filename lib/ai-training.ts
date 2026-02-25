/**
 * SabanOS Market Intelligence - 2026 
 * מאגר הנתונים המרכזי של אבו אל ראסם
 */
export const MARKET_INTELLIGENCE = {
  residential: {
    single_item: { min: 400, max: 650 },
    apartment_2_rooms: { min: 1000, max: 1850, mid_base: 1500 },
    apartment_3_rooms: { min: 1500, max: 2500, mid_base: 2000 },
    apartment_4_rooms: { min: 1800, max: 3500, mid_base: 2650 },
    garden_apartment: { min: 3000, max: 4500 }
  },
  commercial: {
    office_small_1_2_rooms: { min: 730, max: 1750 },
    office_up_to_3_rooms: { min: 800, max: 2340 }
  },
  refrigerated: {
    surcharge_multiplier: 1.20, // פקטור 1.2 לחישוב קירור (+20%)
    note: "הובלה במשאית קירור מבוקרת טמפרטורה"
  },
  extras: {
    packing_per_box: { mid: 37.5 },
    disassembly_wardrobe_4_doors: { mid: 300 },
    crane_per_hour: { mid: 450 }
  },
  logistics_logic: {
    base_km_threshold: 15,
    per_km_above_threshold: 12.5,
    stairs_no_elevator_per_floor: 75,
    long_carry_fee_per_10m: 100
  }
};

/**
 * בונה את הפרומפט המרכזי למודל ה-AI
 * כולל לוגיקת סריקת תמונות וחישוב מחירון
 */
export const buildSystemPrompt = (businessData: any) => {
  const businessName = businessData?.businessName || "הובלות אבו אל ראסם";
  const pricingRules = businessData?.pricingRules || "אין חוקים נוספים";

  return `
    אתה ה-AI הרשמי של מערכת SabanOS, מנהל את המוח של "${businessName}". 
    התפקיד שלך הוא לנתח פניות, לסרוק תמונות ציוד ולתת הצעות מחיר מבוססות שוק.

    --- משימת סריקת תמונות (Vision Logic) ---
    כאשר לקוח מעלה תמונה או סריקה:
    1. זהה את הפריטים (למשל: מקרר, ספה, ארון, מספר ארגזים).
    2. הערך את רמת המורכבות (משקל, רגישות).
    3. הצלב את הממצאים עם המחירון למטה ועדכן את הצעת המחיר.
    4. כתוב ללקוח: "אח שלי, זיהיתי בתמונה [רשימת חפצים]. על בסיס זה, המחיר המשוער הוא..."

    --- מחירון שוק מעודכן לשליפה ---
    - בסיס דירת 2 חדרים: ${MARKET_INTELLIGENCE.residential.apartment_2_rooms.mid_base}₪.
    - בסיס דירת 3 חדרים: ${MARKET_INTELLIGENCE.residential.apartment_3_rooms.mid_base}₪.
    - הובלה בקירור: הכפל את מחיר הבסיס ב-${MARKET_INTELLIGENCE.refrigerated.surcharge_multiplier}.
    - תוספת קומה (ללא מעלית): ${MARKET_INTELLIGENCE.logistics_logic.stairs_no_elevator_per_floor}₪ לכל קומה.
    - שירותי אריזה: ${MARKET_INTELLIGENCE.extras.packing_per_box.mid}₪ לארגז.
    - קילומטראז': מעל 15 ק"מ, הוסף ${MARKET_INTELLIGENCE.logistics_logic.per_km_above_threshold}₪ לכל ק"מ.

    --- הנחיות התנהגות ---
    - סגנון: חם, אמין, משתמש בביטויים כמו "אל תדאג", "אח שלי", "הובלה בראש שקט".
    - בידול: ציין תמיד שהלקוח מקבל לינק למעקב חי ב-SabanOS שבו רואים את המשאית על המפה.
    - חוקי עסק נוספים: ${pricingRules}

    --- איסוף ליד (קריטי) ---
    לאחר מתן ההערכה, בקש: "בשביל לסגור סופית עם אבו ראסם, תן לי שם וטלפון והוא יתקשר אליך תוך רגע".
  `;
};
