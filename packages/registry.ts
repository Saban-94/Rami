// packages/registry.ts
import { InjectionPackage } from "./types-registry";
import { AppManifest, Block } from "@/lib/types";
import type { Operation } from "fast-json-patch";
import { ensureNavItemOps, ensurePageOps } from "@/lib/autoNav";

// === Pricing (i18n + Page + Nav) ===
export const pkgPricingV4: InjectionPackage = {
  id: "pkg.pricing.gym.v4",
  label: "Pricing (i18n: en/he/ar) + AutoNav",
  kind: "ui-block",
  transform: (_prompt, manifest): Operation[] => {
    const pageId = "pricing";
    const route = "/pricing";
    const navId = "nav-pricing";
    const blockId = `pricing-${Date.now()}`;

    const pricingBlock: Block = {
      kind: "pricingTable",
      id: blockId,
      props: {
        headline: { en: "Membership Plans", he: "תוכניות מנוי", ar: "خطط الاشتراك" },
        plans: [
          { name: { en: "Basic", he: "בסיסי", ar: "أساسي" }, price: "₪149", features: [{ en: "Gym", he: "חדר כושר", ar: "نادي" }], cta: { en: "Start", he: "התחל", ar: "ابدأ" } }
        ]
      }
    };

    const ops: Operation[] = [];
    ops.push(...ensurePageOps(manifest, { id: pageId, name: { en: "Pricing", he: "מחירון", ar: "الأسعار" }, route }));
    ops.push({ op: "add", path: `/blocks/${blockId}`, value: pricingBlock });
    ops.push({ op: "add", path: `/pages/${pageId}/blocks/-`, value: blockId });

    if (manifest.settings?.autoNav !== false) {
      ops.push(...ensureNavItemOps(manifest, { id: navId, label: { en: "Pricing", he: "מחירון", ar: "الأسعار" }, to: route }));
    }
    return ops;
  }
};

// === Hero (i18n + Page + Nav) ===
export const pkgHeroV4: InjectionPackage = {
  id: "pkg.hero.basic.v4",
  label: "Hero (i18n: en/he/ar) + AutoNav",
  kind: "ui-block",
  transform: (_prompt, manifest): Operation[] => {
    const pageId = "about";
    const route = "/about";
    const navId = "nav-about";
    const blockId = `hero-${Date.now()}`;

    const heroBlock: Block = {
      kind: "hero",
      id: blockId,
      props: {
        title: { en: "About Us", he: "עלינו", ar: "عنّا" },
        subtitle: { en: "Premium Nile Experience", he: "חוויית ניל פרימיום", ar: "تجربة نيل الفاخرة" },
        cta: { en: "Read More", he: "קרא עוד", ar: "اقרأ المزيد" }
      }
    };

    const ops: Operation[] = [];
    ops.push(...ensurePageOps(manifest, { id: pageId, name: { en: "About", he: "אודות", ar: "حول" }, route }));
    ops.push({ op: "add", path: `/blocks/${blockId}`, value: heroBlock });
    ops.push({ op: "add", path: `/pages/${pageId}/blocks/-`, value: blockId });

    if (manifest.settings?.autoNav !== false) {
      ops.push(...ensureNavItemOps(manifest, { id: navId, label: { en: "About", he: "אודות", ar: "حول" }, to: route }));
    }
    return ops;
  }
};
