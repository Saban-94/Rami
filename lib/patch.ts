// lib/patch.ts

import { applyPatch, Operation } from "fast-json-patch";
import { AppManifest } from "./types";

export function previewWithPatch(manifest: AppManifest, patch: Operation[]): AppManifest {
  const clone = JSON.parse(JSON.stringify(manifest)); // Deep clone safe for manifest
  const res = applyPatch(clone, patch, false);
  return res.newDocument as AppManifest;
}

export function validatePatchSafety(patch: Operation[]): { ok: boolean; reason?: string } {
  const forbiddenRoots = ["/pages", "/blocks", "/navigation"];
  
  for (const op of patch) {
    // מניעת מחיקה של שורשי המערכת
    if (op.op === "remove" && forbiddenRoots.includes(String(op.path))) {
      return { ok: false, reason: `Cannot remove protected system root: ${op.path}` };
    }
  }
  
  if (patch.length > 100) return { ok: false, reason: "Patch size exceeds limit" };
  
  return { ok: true };
}
