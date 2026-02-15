/* lib/chat-logic.ts */
"use client";

import { useCallback, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "./firebase"; // וודא שהנתיב תואם למיקום הקובץ
import { doc, setDoc, updateDoc, onSnapshot } from "firebase/firestore";

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
  source: "local" | "rules" | "gemini";
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
  { pkg: "beauty", words: ["מספרה", "ספר", "hair", "beauty", "קוסמטיקה", "יופי"] },
  { pkg: "auto", words: ["מוסך", "רכב", "garage", "תיקון", "car", "צמיגים"] },
  { pkg: "medical", words: ["מרפאה", "רופא", "clinic", "doctor", "שיניים", "טיפול"] }
];

function runLocalRules(answer: string): Proposal | null {
  const lower = answer.toLowerCase();
  for (const entry of KEYWORDS) {
    if (entry.words.some(w => lower.includes(w))) {
      return {
        type: "patch",
        rationale: `זוהה ענף ${entry.pkg} דרך מנוע מקומי (חסכון ב-Gemini)`,
        source: "rules",
        patch: { setIndustry: entry.pkg }
      };
    }
  }
  return null;
}

/** --- Hook: useChatLogic --- **/
export function useChatLogic(trialId: string) {
  const [manifest, setManifest] = useState<ChatManifest | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (!trialId) return;
    const docRef = doc(db, "chatManifests", trialId);
    return onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        setManifest(snap.data() as ChatManifest);
      } else {
        const init: ChatManifest = {
          trialId,
          brand: { tone: "Luxury", language: "he" },
          questions: [{ id: uuidv4(), text: "מה שם העסק שלך?", field: "businessName", type: "text", required: true }],
          data: {},
          aiConfidence: 0.5,
          updatedAt: Date.now()
        };
        setDoc(docRef, init);
      }
    });
  }, [trialId]);

  const sendAnswer = async (text: string) => {
    if (!manifest) return;
    setIsProcessing(true);

    const currentQ = manifest.questions.find(q => !(q.field in manifest.data));
    const updatedData = { ...manifest.data };
    if (currentQ) updatedData[currentQ.field] = text;

    const localProp = runLocalRules(text);
    if (localProp) setProposal(localProp);

    await updateDoc(doc(db, "chatManifests", trialId), { data: updatedData, updatedAt: Date.now() });
    setIsProcessing(false);
  };

  const approveProposal = async () => {
    if (!proposal || !manifest) return;
    let next = { ...manifest };
    if (proposal.type === "question" && proposal.question) next.questions.push(proposal.question);
    if (proposal.type === "patch" && proposal.patch) {
      if (proposal.patch.setIndustry) next.industry = proposal.patch.setIndustry;
      if (proposal.patch.addQuestions) next.questions.push(...proposal.patch.addQuestions);
    }
    await updateDoc(doc(db, "chatManifests", trialId), { ...next, updatedAt: Date.now() });
    setProposal(null);
  };

  return { manifest, proposal, isProcessing, sendAnswer, approveProposal, rejectProposal: () => setProposal(null) };
}
