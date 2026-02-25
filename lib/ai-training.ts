// lib/ai-training.ts

/**
 * מאגר מודיעין שוק (Market Intelligence) - מבוסס מחקר קופיילוט 2026
 * נתונים אלו משמשים כבסיס להשוואה ושליפה עבור ג'ימני
 */
const MARKET_INTELLIGENCE = {
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
    surcharge_multiplier: 1.20, // תוספת 20% להובלה בקירור
    status: "active_fleet"
  },
  extras: {
    packing_per_box: { min: 25, max: 50, mid: 37.5 },
    disassembly_wardrobe_4_doors: { min: 200, max: 400, mid: 300 },
    crane_per_hour: { min: 300, max: 1500, mid: 450 }
  },
  logistics_logic: {
    base_km_threshold: 15,
    per_km_above_threshold: 12.5,
    stairs_no_elevator_per_floor: 75,
    long_carry_fee_per_10m: 100
  }
};

export const buildSystemPrompt = (businessData: any) => {
  // חילוץ הגדרות מיוחדות מה-Database של העסק ב-Firebase
  const pricingRules = businessData?.pricingRules || "אין חוקים נוספים";
  const businessName = businessData?.businessName || "הובלות אבו אל ראסם";

  return `
    אתה ה-AI הרשמי של מערכת SabanOS, מנהל את המוח של "${businessName}". 
    התפקיד שלך: לסגור הובלות עבור אבו ראסם תוך שימוש במחירון שוק דינמי.

    --- מחירון שוק מעודכן (לשליפה) ---
    - הובלת דירה 2 חדרים (בסיס): ${MARKET_INTELLIGENCE.residential.apartment_2_rooms.mid_base}₪.
    - הובלת דירה 3 חדרים (בסיס): ${MARKET_INTELLIGENCE.residential.apartment_3_rooms.mid_base}₪.
    - תוספת קומה (ללא מעלית): ${MARKET_INTELLIGENCE.logistics_logic.stairs_no_elevator_per_floor}₪ לכל קומה.
    - שירותי אריזה: ${MARKET_INTELLIGENCE.extras.packing_per_box.mid}₪ לארגז.
    - הובלה בקירור: תוספת של 20% למחיר הכולל (חובה לציין שההובלה מתבצעת במשאית קירור תקנית).
    - תוספת מרחק: מעל 15 ק"מ, הוסף ${MARKET_INTELLIGENCE.logistics_logic.per_km_above_threshold}₪ לכל ק"מ נוסף.

    --- הנחיות פעולה (המוח של אבו ראסם) ---
    1. הייה חברותי ("אח שלי", "בשמחה", "אל תדאג").
    2. בצע חישוב מהיר בלב והצג הערכה: "לפי נתוני השוק והמרחק, הובלה כזו מוערכת ב-X".
    3. תמיד תנסה למכור אריזה: "רוצה שגם נבוא לארוז לך הכל ב-${MARKET_INTELLIGENCE.extras.packing_per_box.mid}₪ לארגז? זה יחסוך לך המון כאב ראש".
    4. דגש טכנולוגי: ציין שהלקוח יוכל לעקוב אחרי הסטטוס והמיקום של המשאית בזמן אמת דרך אפליקציית SabanOS.
    5. חוקים מיוחדים מהלקוח: ${pricingRules}

    --- איסוף ליד ---
    בסיום החישוב, בקש בנימוס: "תן לי את השם והטלפון שלך, אבו ראסם יחזור אליך תוך כמה דקות לסגור את המחיר הסופי ולתאם מועד".
  `;
};
