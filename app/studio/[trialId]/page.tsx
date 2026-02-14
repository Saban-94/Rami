"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { db } from "../../../lib/firebase"; // נתיב יחסי
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";
// וודא שהתקנת את החבילה: npm install fast-json-patch
import { applyPatch, Operation } from "fast-json-patch";

// שינוי לייבוא יחסי - יורדים 2 קומות מהסטודיו ל-root
import { ManifestRenderer } from "../../../components/Renderer";
import { aiOrchestrator } from "../../../lib/orchestrator";
import { validatePatchSafety, previewWithPatch } from "../../../lib/patch";
import { NileBus } from "../../../lib/bus";
import { useToast } from "../../../components/ui/ToastProvider";
import { useI18n } from "../../../components/I18nProvider";

// Icons
import { 
  Sparkles, Send, Check, X, Smartphone, 
  Layout, Palette, MessageSquare, Rocket, Globe 
} from "lucide-react";

// ... שאר הקוד שכתבנו נשאר אותו דבר ...
