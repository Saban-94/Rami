// lib/types.ts
export type AppManifest = {
  version: number;
  app: { 
    id: string; 
    nameEn: string; 
    nameHe: string; 
    nameAr?: string;
    brandTag?: string; // השדה שגרם לקריסה
    logoUrl?: string;
  };
  // ... שאר השדות כפי שהיו
  theme: {
    name: string;
    tokens: any;
  };
  pages: Record<string, any>;
  blocks: Record<string, any>;
  navigation: { items: any[] };
};
