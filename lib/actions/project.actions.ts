"use server";


import { dbAdmin } from "@/lib/firebase-admin";
import { ProjectSchema, ProjectFormValues } from "@/lib/validations/project";
import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs"; // או Firebase Auth context

export async function createProject(values: ProjectFormValues) {
  // 1. בדיקת הרשאות (לוודא שזה רמי)
  // הערה: כאן תוסיף את הלוגיקה שבודקת ADMIN_UID
  
  // 2. ולידציה של הנתונים
  const validatedFields = ProjectSchema.safeParse(values);
  
  if (!validatedFields.success) {
    return { error: "נתונים לא תקינים. בדוק את השדות שוב." };
  }

  const data = validatedFields.data;

  try {
    // 3. שמירה ב-Firestore
    await dbAdmin.collection("projects").doc(data.slug).set({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 4. ניקוי ה-Cache של Next.js כדי שהפרויקט יופיע מיד באתר
    revalidatePath("/projects");
    revalidatePath(`/[locale]/projects`, "layout");

    return { success: true };
  } catch (error) {
    console.error("Firestore Error:", error);
    return { error: "שגיאה בשמירת הפרויקט במסד הנתונים." };
  }
}
