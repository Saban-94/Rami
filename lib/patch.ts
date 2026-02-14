// lib/patch.ts

import { applyPatch, Operation } from "fast-json-patch";
import { AppManifest } from "./types";

export function previewWithPatch(manifest: AppManifest, patch: Operation[]): AppManifest {
  // יצירת עותק עמוק בטוח
  const clone = JSON.parse(JSON.stringify(manifest));
  const res = applyPatch(clone, patch, false);
  return res.newDocument as AppManifest;
}

export function validatePatchSafety(patch: Operation[]): { ok: boolean; reason?: string } {
  const forbiddenRoots = ["/pages", "/blocks", "/navigation"];
  
  for (const op of patch) {
    if (op.op === "remove" && forbiddenRoots.includes(String(op.path))) {
      return { ok: false, reason: `מחיקת שורש מערכת חסומה: ${op.path}` };
    }
  }
  
  if (patch.length > 100) return { ok: false, reason: "השינוי גדול מדי לעיבוד בבת אחת" };
  
  return { ok: true };
}
