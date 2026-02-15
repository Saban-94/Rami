/* lib/chat-logic.ts */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

/** --- Types --- **/
export type QuestionType = "text" | "choice" | "number" | "email" | "phone" | "boolean";

export interface Question {
  id: string;
  text: string;
  field: string;
  type: QuestionType;
  options?: string[];
  required?: boolean;
}

export interface LogicPatch {
  addQuestions?: Question[];
  setIndustry?: string;
  setTone?: string;
}

export interface Proposal {
  type: "question" | "patch";
  question?: Question;
  patch?: LogicPatch;
  rationale: string;
  source: "local" | "rules" | "gemini" | "cache";
}

export interface ChatManifest {
  trialId: string;
  industry?: string;
  brand: { tone: string; language: "he" | "en" };
  questions: Question[];
  data: Record<string, any>;
  aiConfidence: number;
  updatedAt: number;
}

/** --- Smart AI Router: Local Rules Engine --- **/
const KEYWORDS = [
  { pkg: "beauty", words: ["מספרה", "ספר", "hair", "beauty", "קוסמטיקה"] },
  { pkg: "auto", words: ["מוסך", "רכב", "garage", "תיקון", "car"] },
  { pkg: "medical", words: ["מרפאה", "רופא", "clinic", "doctor", "שיניים"] }
];

function runLocalRules(answer: string, manifest: ChatManifest): Proposal | null {
  const lower = answer.toLowerCase();
  
  // בדיקה אם המילה קיימת במאגר המקומי
  for (const entry of KEYWORDS) {
    if (entry.words.some(w => lower.includes(w))) {
      return {
        type: "patch",
        rationale: `זוהה ענף ${entry.pkg} דרך מנוע מקומי (0 עלות API)`,
        source: "rules",
        patch: { setIndustry: entry.pkg }
      };
    }
  }
  return null;
}

/** --- Initial State --- **/
export function createEmptyManifest(trialId: string): ChatManifest {
  return {
    trialId,
    brand: { tone: "Luxury", language: "he" },
    questions: [
      { id: uuidv4(), text: "מה שם העסק שלך?", field: "businessName", type: "text", required: true }
    ],
    data: {},
    aiConfidence: 0.5,
    updatedAt: Date.now()
  };
}

/** --- Hook: useChatLogic with Firestore Sync --- **/
export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<ChatManifest | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // סינכרון Firestore בזמן אמת
  useEffect(() => {
    if (!trialId) return;
    const docRef = doc(db, "chatManifests", trialId);
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setManifest(snap.data() as ChatManifest);
      } else {
        const init = createEmptyManifest(trialId);
        setDoc(docRef, init);
      }
    });
    return unsub;
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    if (!manifest) return;
    setIsProcessing(true);

    // 1. עדכון הנתונים המקומיים (Data Extraction)
    const currentQ = manifest.questions.find(q => !(q.field in manifest.data));
    const updatedData = { ...manifest.data };
    if (currentQ) updatedData[currentQ.field] = text;

    // 2. הפעלת ה-Smart Router
    const localProp = runLocalRules(text, manifest);
    
    if (localProp) {
      setProposal(localProp);
    } else {
      // כאן תבוא הקריאה ל-Gemini אם ה-Confidence נמוך
      console.log("Calling Gemini Brain...");
    }

    // עדכון מקומי זמני של הנתונים
    await updateDoc(doc(db, "chatManifests", trialId), { 
      data: updatedData,
      updatedAt: Date.now()
    });
    
    setIsProcessing(false);
  };

  const approveProposal = async () => {
    if (!proposal || !manifest) return;
    const docRef = doc(db, "chatManifests", trialId);
    
    let updatedManifest = { ...manifest };
    
    if (proposal.type === "question" && proposal.question) {
      updatedManifest.questions.push(proposal.question);
    } else if (proposal.type === "patch" && proposal.patch) {
      if (proposal.patch.setIndustry) updatedManifest.industry = proposal.patch.setIndustry;
      if (proposal.patch.addQuestions) updatedManifest.questions.push(...proposal.patch.addQuestions);
    }

    await updateDoc(docRef, { ...updatedManifest, updatedAt: Date.now() });
    setProposal(null);
  };

  return { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal: () => setProposal(null) };
}
