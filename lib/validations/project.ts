import * as z from "zod";

export const ProjectSchema = z.object({
  title: z.string().min(3, "כותרת חייבת להכיל לפחות 3 תווים").max(100),
  slug: z.string().min(3).regex(/^[a-z0-9-]+$/, "סלאג יכול להכיל רק אותיות קטנות, מספרים ומקפים"),
  summary: z.string().min(10, "תקציר חייב להיות לפחות 10 תווים"),
  descriptionMDX: z.string().min(20),
  techStack: z.array(z.string()).min(1, "בחר לפחות טכנולוגיה אחת"),
  client: z.string().optional(),
  liveUrl: z.string().url("כתובת אתר לא תקינה").optional().or(z.literal("")),
  repoUrl: z.string().url("כתובת גיטהאב לא תקינה").optional().or(z.literal("")),
  coverImage: z.string().url("חובה להוסיף תמונת נושא"),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type ProjectFormValues = z.infer<typeof ProjectSchema>;
