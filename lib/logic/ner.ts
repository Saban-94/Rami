/* lib/logic/ner.ts */
export type EntityType = 'brand' | 'model' | 'population_child' | 'age_number' | 'procedure' | 'legal_term' | 'charging' | 'moving_term' | 'florist_term' | 'pet_care' | 'dental_ortho' | 'medical_derm' | 'medical_child' | 'auto_general';

export interface Entity {
  type: EntityType;
  value: string;
  start: number;
  end: number;
  weight?: number;
}

const STOPWORDS = new Set(['ה', 'של', 'עם', 'על', 'אני', 'צריך', 'מחפש', 'רוצה', 'עכשיו', 'בבקשה']);

function normalizeText(input: string): string {
  return input.toLowerCase()
    .replace(/[\u0591-\u05C7]/g, '') // הסרת ניקוד
    .replace(/[\"״׳'’]/g, ' ')
    .replace(/[^0-9a-z\u0590-\u05FF\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();
}

function stemHe(word: string): string {
  let w = word;
  const prefixes = ['ב', 'כ', 'ל', 'מ', 'ש', 'ה', 'ו'];
  for (let k = 0; k < 2; k++) {
    for (const p of prefixes) {
      if (w.startsWith(p) && w.length > 2) { w = w.slice(1); break; }
    }
  }
  return w.replace(/(ות|ים|ית)$/, '');
}

export function extractEntities(input: string) {
  const norm = normalizeText(input);
  const tokens = norm.split(' ');
  const entities: Entity[] = [];
  
  // דוגמה לזיהוי ישות טעינה (מקוצר לצורך הסדר)
  if (norm.includes('טסלה') || norm.includes('tesla')) {
    entities.push({ type: 'brand', value: 'tesla', start: 0, end: 0, weight: 0.8 });
  }
  if (norm.includes('תינוק') || norm.includes('ילד')) {
    entities.push({ type: 'population_child', value: 'child', start: 0, end: 0, weight: 0.7 });
  }

  return { tokens, entities };
}

export function entityAffinity(e: Entity) {
  switch (e.type) {
    case 'brand': return [{ industryId: 'automotive', subIndustryId: 'electric_car_specialist', weight: 0.8 }];
    case 'population_child': return [{ industryId: 'medical', subIndustryId: 'pediatrician', weight: 0.7 }];
    default: return [];
  }
}
