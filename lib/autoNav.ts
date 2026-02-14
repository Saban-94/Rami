// lib/autoNav.ts

import { AppManifest, I18nText } from "./types";
import { Operation } from "fast-json-patch";

export function ensureNavItemOps(
  manifest: AppManifest, 
  opts: { id: string; label: I18nText; to: string }
): Operation[] {
  const exists = manifest.navigation.items.some(
    it => it.id === opts.id || it.to === opts.to
  );
  if (exists) return [];
  
  return [
    { op: "add", path: `/navigation/items/-`, value: { id: opts.id, label: opts.label, to: opts.to } }
  ];
}

export function ensurePageOps(
  manifest: AppManifest, 
  page: { id: string; name: I18nText; route: string }
): Operation[] {
  if (manifest.pages[page.id]) return [];
  
  return [
    { 
      op: "add", 
      path: `/pages/${page.id}`, 
      value: { ...page, blocks: [] } 
    }
  ];
}
