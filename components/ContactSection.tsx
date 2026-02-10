"use client";
import React, { useState } from "react";
import { db } from "../lib/firebase"; // ייבוא מסד הנתונים
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { motion } from "framer-motion";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // כתיבה ל-Firebase
      await addDoc(collection(db, "leads"), {
        ...formData,
        createdAt: serverTimestamp(),
      });
      
      setIsSent(true);
      setFormData({ name: "", phone: "", message: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("שגיאה בשליחת ההודעה, נסה שוב.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    // ... מבנה ה-JSX נשאר דומה, רק מוודאים שה-Inputs מחוברים ל-SetState ...
    <form onSubmit={handleSubmit} className="space-y-6">
      <input 
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        required 
        placeholder="שם מלא" 
        className="..." 
      />
      {/* שאר השדות באותו אופן */}
      <button type="submit" disabled={isSubmitting} className="...">
        {isSubmitting ? "שולח נתונים לענן..." : "שלח הודעה"}
      </button>
    </form>
  );
}
