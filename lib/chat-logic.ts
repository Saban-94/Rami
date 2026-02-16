/* עדכון בתוך פונקציית sendAnswer ב-lib/chat-logic.ts */

// 1. יצירת אובייקט SEO חכם
let seoUpdate = {};

if (isBeauty) {
  seoUpdate = {
    "seo.title": `${manifest.businessName || 'מספרה'} | עיצוב שיער וטיפוח`,
    "seo.description": `מחפשים תספורת ברמה גבוהה? בואו ל${manifest.businessName || 'מספרה'} לעיצוב שיער מקצועי, זקן וטיפוח גברים.`,
    "seo.keywords": "מספרה, תספורת גברים, עיצוב זקן, ספר בחיפה, תספורת VIP"
  };
} else if (isMedical) {
  seoUpdate = {
    "seo.title": `${manifest.businessName || 'מרפאה'} | ניהול תורים וטיפול מקצועי`,
    "seo.description": `מרפאת ${manifest.businessName || 'מומחים'} מציעה טיפולים מתקדמים, קביעת תורים מהירה ושירות אישי.`,
    "seo.keywords": "מרפאה, רופא שיניים, קביעת תורים, עזרה ראשונה שיניים, קליניקה"
  };
}

// 2. הזרקת ה-SEO לתוך ההצעה (Proposal)
if (Object.keys(seoUpdate).length > 0) {
  setProposal(prev => ({
    ...prev,
    data: { 
      ...prev?.data, 
      ...seoUpdate 
    },
    rationale: prev?.rationale + " ובנוסף הכנתי עבורך כותרות SEO כדי שתופיע ראשון בגוגל."
  }));
}
