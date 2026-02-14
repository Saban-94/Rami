// lib/types.ts

export type Locale = "en" | "he" | "ar";
export type Direction = "ltr" | "rtl";

export type I18nText = string | { 
  en?: string; 
  he?: string; 
  ar?: string; 
  [k: string]: string | undefined 
};

export type Theme = {
  name: string;
  tokens: {
    radius: number;
    blurPx: number;
    glassAlpha: number;
    borderAlpha: number;
    palette: {
      primary: string;
      primaryGlass: string;
      surface: string;
      onSurface: string;
    }
  };
};

export type Block = {
  id: string;
  kind: "hero" | "pricingTable" | "featureList" | "contact";
  props: any;
};

export type Page = {
  id: string;
  name: I18nText;
  route: string;
  blocks: string[];
};

export type Navigation = {
  items: Array<{ id: string; label: I18nText; to: string }>;
};

export type AppManifest = {
  version: number;
  app: { 
    id: string; 
    nameEn: string; 
    nameHe: string; 
    nameAr?: string 
  };
  i18n?: { 
    defaultLocale: Locale; 
    supported: Locale[] 
  };
  settings?: {
    autoNav?: boolean;
    navPlacement?: "top" | "bottom";
  };
  theme: Theme;
  navigation: Navigation;
  pages: Record<string, Page>;
  blocks: Record<string, Block>;
};
