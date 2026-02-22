/**
 * Onboarding State Zustand Store
 * Manages multi-step onboarding flow for new businesses
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { OnboardingState } from '@/domain/types';

interface OnboardingStoreState extends OnboardingState {
  // Actions
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  completeStep: (stepId: string) => void;
  updateData: (updates: Partial<OnboardingState['data']>) => void;
  markComplete: () => void;
  reset: () => void;
}

const initialOnboardingState: OnboardingState = {
  tenantId: '',
  currentStep: 0,
  totalSteps: 5,
  completedSteps: [],
  data: {
    businessInfo: {},
    aiPersonality: {},
    services: [],
    integrations: [],
  },
  isComplete: false,
  startedAt: new Date().toISOString(),
};

export const useOnboardingStore = create<OnboardingStoreState>()(
  persist(
    (set, get) => ({
      ...initialOnboardingState,

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => set((state) => ({
        currentStep: Math.min(state.currentStep + 1, state.totalSteps - 1),
      })),

      previousStep: () => set((state) => ({
        currentStep: Math.max(state.currentStep - 1, 0),
      })),

      completeStep: (stepId) => set((state) => ({
        completedSteps: state.completedSteps.includes(stepId)
          ? state.completedSteps
          : [...state.completedSteps, stepId],
      })),

      updateData: (updates) => set((state) => ({
        data: {
          ...state.data,
          ...updates,
        },
      })),

      markComplete: () => set({
        isComplete: true,
        completedAt: new Date().toISOString(),
        currentStep: get().totalSteps,
      }),

      reset: () => set({
        ...initialOnboardingState,
        startedAt: new Date().toISOString(),
      }),
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
