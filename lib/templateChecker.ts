export function checkTemplateCompliance(manifest: any, template: any) {
  const patches: any[] = [];
  
  // בדיקה אם חסר דף חובה מהתבנית
  template.pages?.forEach((tPage: any) => {
    const exists = Object.values(manifest.pages || {}).some((p: any) => p.type === tPage.type);
    if (tPage.required && !exists) {
      patches.push({ op: "add", path: `/pages/pg_${tPage.type}`, value: { type: tPage.type, blocks: [] } });
    }
  });

  return { compliant: patches.length === 0, suggestedPatches: patches };
}
