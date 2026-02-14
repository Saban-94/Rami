// lib/orchestrator.ts
import { Operation } from "fast-json-patch";
import { registry } from "../packages/registry";

export const aiOrchestrator = {
  async generatePatch(prompt: string, manifest: AppManifest): Promise<Operation[]> {
    const ops: Operation[] = [];

    // --- Settings: Nav Placement ---
    if (/(move|place|set).*(nav|navigation).*(bottom|down)|שים.*ניווט.*למטה|מטה/i.test(prompt)) {
      ops.push({ op: "add", path: "/settings/navPlacement", value: "bottom" });
    }
    if (/(move|place|set).*(nav|navigation).*(top|up)|שים.*ניווט.*למעלה|מעלה/i.test(prompt)) {
      ops.push({ op: "add", path: "/settings/navPlacement", value: "top" });
    }

    // --- Feature Injections (V4) ---
    if (/pricing.*gym|מחיר.*חדר כושר|أسعار/i.test(prompt)) {
      const pkg = registry.find(p => p.id === "pkg.pricing.gym.v4");
      if (pkg) ops.push(...pkg.transform(prompt, manifest));
    }

    if (/hero|הירו|הוסף.*אודות|عنّا/i.test(prompt)) {
      const pkg = registry.find(p => p.id === "pkg.hero.basic.v4");
      if (pkg) ops.push(...pkg.transform(prompt, manifest));
    }

    // ... שאר ה-matchers ל-Contact ו-Language
    return ops;
  }
};
