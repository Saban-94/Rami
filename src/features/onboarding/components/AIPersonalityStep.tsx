import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Shield, Heart, Zap, CheckCircle2 } from 'lucide-react';

// Store & Schema
import { AIPersonalitySchema } from '@/domain/schemas';
import { useBusinessStore } from '@/store/businessStore'; // וודא שהנתיב נכון אצלך

type AIPersonalityValues = {
  tone: 'professional' | 'friendly' | 'sales';
  greeting: string;
  systemPrompt: string;
};

interface Props {
  onNext: () => void;
}

// 1) פונקציית העזר לייצור הפרומפט (מעל 50 תווים כדי לעבור ולידציה)
const generateBasePrompt = (tone: string, businessName: string) => {
  const base = `You are the official AI representative for ${businessName}. `;
  switch (tone) {
    case 'professional':
      return base + "Your goal is to provide formal, accurate, and highly professional assistance. Maintain a sophisticated tone and ensure all information is delivered clearly and respectfully to our valued clients.";
    case 'friendly':
      return base + "You are a warm, helpful, and energetic assistant! Use a casual tone, be empathetic, and make every customer feel like they are talking to a close friend who truly cares about their needs.";
    case 'sales':
      return base + "You are a high-conversion sales specialist. Your primary objective is to highlight our unique value propositions, overcome objections with confidence, and guide users toward making a purchase or booking.";
    default:
      return base;
  }
};

const tones = [
  { id: 'professional', title: 'Professional', desc: 'Formal, stable & reliable', icon: Shield, color: 'text-blue-600', bg: 'bg-blue-50' },
  { id: 'friendly', title: 'Friendly', desc: 'Warm, casual & inviting', icon: Heart, color: 'text-pink-600', bg: 'bg-pink-50' },
  { id: 'sales', title: 'Sales-Oriented', desc: 'Direct, persuasive & bold', icon: Zap, color: 'text-amber-600', bg: 'bg-amber-50' },
];

export const AIPersonalityStep: React.FC<Props> = ({ onNext }) => {
  const { currentBusiness, updateBusiness } = useBusinessStore();
  const businessName = currentBusiness?.name || 'our business';

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<AIPersonalityValues>({
    resolver: zodResolver(AIPersonalitySchema),
    defaultValues: {
      tone: 'professional',
      greeting: 'Hello! How can I assist you today?',
      systemPrompt: generateBasePrompt('professional', businessName)
    }
  });

  const selectedTone = watch('tone');

  // עדכון הפרומפט בכל פעם שהטון משתנה
  useEffect(() => {
    const newPrompt = generateBasePrompt(selectedTone, businessName);
    setValue('systemPrompt', newPrompt);
  }, [selectedTone, businessName, setValue]);

  const onSubmit = async (data: AIPersonalityValues) => {
    // שמירה ל-Store (מותאם ל-Partial<Business> או Action ייעודי)
    updateBusiness({
      aiPersonality: {
        tone: data.tone,
        systemPrompt: data.systemPrompt,
        initialGreeting: data.greeting
      }
    });
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-gray-900">Define your AI's Voice</h2>
        <p className="text-sm text-gray-500">Choose how your AI should interact with customers.</p>
      </div>

      {/* Tone Selection Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {tones.map((t) => {
          const isSelected = selectedTone === t.id;
          return (
            <motion.div
              key={t.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setValue('tone', t.id as any)}
              className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                isSelected 
                  ? 'border-indigo-600 bg-indigo-50/50 shadow-md' 
                  : 'border-gray-100 bg-white/50 hover:border-gray-200'
              }`}
            >
              {isSelected && (
                <div className="absolute right-2 top-2 text-indigo-600">
                  <CheckCircle2 size={18} />
                </div>
              )}
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${t.bg} ${t.color}`}>
                <t.icon size={22} />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">{t.title}</h3>
              <p className="text-xs text-gray-500 leading-tight mt-1">{t.desc}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Greeting Message */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">First Greeting Message</label>
        <textarea
          {...register('greeting')}
          rows={2}
          placeholder="e.g., Hi! Welcome to Bloom Studio. How can I help you?"
          className="block w-full rounded-lg border border-gray-300 bg-white/50 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
        />
        {errors.greeting && <p className="text-xs text-red-500">{errors.greeting.message}</p>}
      </div>

      {/* System Prompt (Visible but distinct) */}
      <div className="rounded-lg bg-gray-50 p-3 border border-gray-100">
        <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">AI Logic Preview</label>
        <p className="text-xs text-gray-600 italic line-clamp-2 mt-1">
          "{watch('systemPrompt')}"
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50"
      >
        Continue to Services
      </button>
    </form>
  );
};

export default AIPersonalityStep;
