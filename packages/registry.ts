// packages/registry.ts

// תיקון נתיבים יחסיים למניעת שגיאות Build ב-Vercel
import { AppManifest, Block } from "../lib/types";
import type { Operation } from "fast-json-patch";
import { ensureNavItemOps, ensurePageOps } from "../lib/autoNav";

// הגדרת טיפוס מקומי במידה ו-types-registry לא זמין
export type InjectionPackage = {
  id: string;
  label: string;
  kind: "ui-block" | "theme" | "nav" | "page";
  transform: (prompt: string, manifest: AppManifest) => Operation[];
};

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
          { 
            name: { en: "Basic", he: "בסיסי", ar: "أساسي" }, 
            price: "₪149", 
            features: [{ en: "Gym", he: "חדר כושר", ar: "نادي" }], 
            cta: { en: "Start", he: "התחל", ar: "ابدأ" } 
          }
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
        title: { en: "About Us", he: "עלינו", ar: "ענّא" },
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

// === Contact (i18n + Page + Nav) ===
export const pkgContactV4: InjectionPackage = {
  id: "pkg.contact.basic.v4",
  label: "Contact (i18n: en/he/ar) + AutoNav",
  kind: "ui-block",
  transform: (_prompt, manifest): Operation[] => {
    const pageId = "contact";
    const route = "/contact";
    const navId = "nav-contact";
    const blockId = `contact-${Date.now()}`;

    const contactBlock: Block = {
      kind: "contact",
      id: blockId,
      props: {
        title: { en: "Contact Us", he: "צור קשר", ar: "اتصل بنا" },
        subtitle: { en: "We are here for you", he: "אנחנו כאן בשבילך", ar: "نحن هنا من أجلك" },
        fields: {
          nameLabel: { en: "Name", he: "שם", ar: "اسم" },
          emailLabel: { en: "Email", he: "אימייל", ar: "بريد" },
          messageLabel: { en: "Message", he: "הודעה", ar: "رسالة" },
          submitLabel: { en: "Send", he: "שלח", ar: "إرسال" }
        }
      }
    };

    const ops: Operation[] = [];
    ops.push(...ensurePageOps(manifest, { id: pageId, name: { en: "Contact", he: "צור קשר", ar: "اتصل" }, route }));
    ops.push({ op: "add", path: `/blocks/${blockId}`, value: contactBlock });
    ops.push({ op: "add", path: `/pages/${pageId}/blocks/-`, value: blockId });

    if (manifest.settings?.autoNav !== false) {
      ops.push(...ensureNavItemOps(manifest, { id: navId, label: { en: "Contact", he: "צור קשר", ar: "اتصل" }, to: route }));
    }
    return ops;
  }
};

// ייצוא ה-Registry המרכזי שבו ה-AI משתמש
export const registry: InjectionPackage[] = [
  pkgPricingV4,
  pkgHeroV4,
  pkgContactV4
];
