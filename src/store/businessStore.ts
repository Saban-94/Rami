/**
 * Business Configuration Zustand Store
 * Manages business settings, AI personality, and service catalog state
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Business,
  AIPersonality,
  Service,
  ServiceCategory,
  AutomationRule,
  Integration
} from '@/domain/types';

interface BusinessState {
  // Current Business
  currentBusiness: Business | null;
  businesses: Business[];

  // AI Personality
  aiPersonality: AIPersonality | null;

  // Service Catalog
  services: Service[];
  serviceCategories: ServiceCategory[];

  // Automation Rules
  automationRules: AutomationRule[];

  // Integrations
  integrations: Integration[];

  // Loading States
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentBusiness: (business: Business) => void;
  updateBusiness: (updates: Partial<Business>) => void;

  setAIPersonality: (personality: AIPersonality) => void;
  updateAIPersonality: (updates: Partial<AIPersonality>) => void;

  setServices: (services: Service[]) => void;
  addService: (service: Service) => void;
  updateService: (id: string, updates: Partial<Service>) => void;
  removeService: (id: string) => void;

  setServiceCategories: (categories: ServiceCategory[]) => void;
  addServiceCategory: (category: ServiceCategory) => void;
  updateServiceCategory: (id: string, updates: Partial<ServiceCategory>) => void;
  removeServiceCategory: (id: string) => void;

  setAutomationRules: (rules: AutomationRule[]) => void;
  addAutomationRule: (rule: AutomationRule) => void;
  updateAutomationRule: (id: string, updates: Partial<AutomationRule>) => void;
  removeAutomationRule: (id: string) => void;
  toggleAutomationRule: (id: string) => void;

  setIntegrations: (integrations: Integration[]) => void;
  updateIntegration: (id: string, updates: Partial<Integration>) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  reset: () => void;
}

const initialState = {
  currentBusiness: null,
  businesses: [],
  aiPersonality: null,
  services: [],
  serviceCategories: [],
  automationRules: [],
  integrations: [],
  isLoading: false,
  error: null,
};

export const useBusinessStore = create<BusinessState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Business Actions
      setCurrentBusiness: (business) => set({ currentBusiness: business }),

      updateBusiness: (updates) => set((state) => ({
        currentBusiness: state.currentBusiness
          ? { ...state.currentBusiness, ...updates, updatedAt: new Date().toISOString() }
          : null,
      })),

      // AI Personality Actions
      setAIPersonality: (personality) => set({ aiPersonality: personality }),

      updateAIPersonality: (updates) => set((state) => ({
        aiPersonality: state.aiPersonality
          ? { ...state.aiPersonality, ...updates, updatedAt: new Date().toISOString() }
          : null,
      })),

      // Service Actions
      setServices: (services) => set({ services }),

      addService: (service) => set((state) => ({
        services: [...state.services, service],
      })),

      updateService: (id, updates) => set((state) => ({
        services: state.services.map((service) =>
          service.id === id
            ? { ...service, ...updates, updatedAt: new Date().toISOString() }
            : service
        ),
      })),

      removeService: (id) => set((state) => ({
        services: state.services.filter((service) => service.id !== id),
      })),

      // Service Category Actions
      setServiceCategories: (categories) => set({ serviceCategories: categories }),

      addServiceCategory: (category) => set((state) => ({
        serviceCategories: [...state.serviceCategories, category],
      })),

      updateServiceCategory: (id, updates) => set((state) => ({
        serviceCategories: state.serviceCategories.map((cat) =>
          cat.id === id ? { ...cat, ...updates } : cat
        ),
      })),

      removeServiceCategory: (id) => set((state) => ({
        serviceCategories: state.serviceCategories.filter((cat) => cat.id !== id),
      })),

      // Automation Rule Actions
      setAutomationRules: (rules) => set({ automationRules: rules }),

      addAutomationRule: (rule) => set((state) => ({
        automationRules: [...state.automationRules, rule],
      })),

      updateAutomationRule: (id, updates) => set((state) => ({
        automationRules: state.automationRules.map((rule) =>
          rule.id === id
            ? { ...rule, ...updates, updatedAt: new Date().toISOString() }
            : rule
        ),
      })),

      removeAutomationRule: (id) => set((state) => ({
        automationRules: state.automationRules.filter((rule) => rule.id !== id),
      })),

      toggleAutomationRule: (id) => set((state) => ({
        automationRules: state.automationRules.map((rule) =>
          rule.id === id
            ? { ...rule, isActive: !rule.isActive, updatedAt: new Date().toISOString() }
            : rule
        ),
      })),

      // Integration Actions
      setIntegrations: (integrations) => set({ integrations }),

      updateIntegration: (id, updates) => set((state) => ({
        integrations: state.integrations.map((integration) =>
          integration.id === id
            ? { ...integration, ...updates, updatedAt: new Date().toISOString() }
            : integration
        ),
      })),

      // Utility Actions
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'business-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentBusiness: state.currentBusiness,
        aiPersonality: state.aiPersonality,
      }),
    }
  )
);
