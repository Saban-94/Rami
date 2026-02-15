/* lib/chat-logic.ts */
// ... (הטייפים והלוגיקה הקודמת נשארים)

export interface AssetWebsite {
  theme: string;
  blocks: { kind: string; props: any }[];
}

export interface ChatManifest {
  // ... שדות קודמים
  assets?: {
    website?: AssetWebsite;
  };
}
/* lib/chat-logic.ts */
// ... (הטייפים הקודמים נשארים)

export async function publishManifestToProduction(trialId: string, manifest: ChatManifest) {
  if (!manifest.assets?.website) throw new Error("No website asset found to publish");

  // עדכון הדוקומנט הראשי של ה-Trial ב-Firestore
  const trialRef = doc(db, "trials", trialId);
  
  await updateDoc(trialRef, {
    manifest: {
      app: {
        nameHe: manifest.data.businessName || "עסק חדש",
        brandTag: manifest.industry || "Nielapp Build"
      },
      blocks: manifest.assets.website.blocks,
      publishedAt: Date.now(),
      status: "live"
    }
  });
}
/** --- Asset Generator: יוצר אתר מהנתונים שנאספו --- **/
export function generateWebsiteAsset(manifest: ChatManifest): AssetWebsite {
  const { data, industry, brand } = manifest;
  
  return {
    theme: brand.tone === "Luxury" ? "dark-gold" : "modern-blue",
    blocks: [
      {
        kind: "hero",
        props: {
          title: data.businessName || "העסק החדש שלך",
          subtitle: `מומחים בתחום ${industry || "השירותים"}`,
          cta: "צור קשר עכשיו"
        }
      },
      {
        kind: "services",
        props: {
          headline: "השירותים שלנו",
          items: data.services?.split(",") || ["שירות איכותי", "ליווי מקצועי"]
        }
      },
      {
        kind: "contact",
        props: {
          title: "דברו איתנו",
          phone: data.phone || ""
        }
      }
    ]
  };
}
