/* lib/logic/industry-detection.ts */
import { LOGIC_PACKAGES } from './packages';
import { extractEntities, entityAffinity } from './ner';

export function detectIndustry(input: string) {
  const { tokens, entities } = extractEntities(input);
  let candidates: any[] = [];

  LOGIC_PACKAGES.forEach(pack => {
    pack.subIndustries.forEach(sub => {
      let score = 0;
      // חישוב מילות מפתח
      sub.keywords.forEach(kw => {
        if (input.includes(kw)) score += 1;
      });
      // חישוב בוסט מ-NER
      entities.forEach(ent => {
        const aff = entityAffinity(ent);
        aff.forEach(a => {
          if (a.subIndustryId === sub.id) score += a.weight;
        });
      });

      if (score > 0.3) {
        candidates.push({ industryId: pack.id, subIndustryId: sub.id, score });
      }
    });
  });

  candidates.sort((a, b) => b.score - a.score);
  return { 
    primary: candidates[0] || null, 
    alternatives: candidates.slice(1, 3),
    clarificationProposal: candidates.length > 1 && (candidates[0].score - candidates[1].score < 0.05)
  };
}
