/* lib/logic/packages.ts */
export const LOGIC_PACKAGES = [
  {
    id: 'automotive',
    displayName: 'רכב',
    subIndustries: [
      { id: 'general_garage', displayName: 'מוסך כללי', keywords: ['מוסך', 'מכונאי', 'טיפול 10000'] },
      { id: 'electric_car_specialist', displayName: 'רכב חשמלי', keywords: ['טעינה', 'סוללה', 'טסלה'] }
    ]
  },
  {
    id: 'medical',
    displayName: 'רפואה',
    subIndustries: [
      { id: 'pediatrician', displayName: 'רופא ילדים', keywords: ['תינוק', 'ילד', 'חום'] },
      { id: 'dermatologist', displayName: 'רופא עור', keywords: ['אקנה', 'פריחה', 'עור'] }
    ]
  }
  // ניתן להוסיף כאן את כל ה-70 שייצרנו
];
