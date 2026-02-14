export function validateCrossRefs(manifest: any) {
  const issues = [];
  const pageIds = Object.keys(manifest.pages || {});
  
  // בדיקת דף הבית
  if (!manifest.homePageId || !manifest.pages[manifest.homePageId]) {
    issues.push({ code: "HOME_NOT_FOUND", level: "error", message: "דף הבית המוגדר לא קיים במערכת" });
  }

  // בדיקת הפניות בבלוקים
  pageIds.forEach(pid => {
    const page = manifest.pages[pid];
    page.blocks?.forEach((block: any) => {
      if (block.actions?.primary?.actionId && !manifest.actions?.[block.actions.primary.actionId]) {
        issues.push({ code: "ACTION_NOT_FOUND", level: "error", message: `בלוק ${block.id} מפנה לפעולה לא קיימת` });
      }
    });
  });

  return { ok: issues.length === 0, issues };
}
