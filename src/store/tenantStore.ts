/**
 * Tenant Management Zustand Store
 * Handles multi-tenancy, workspace switching, and tenant-level settings
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Tenant } from '@/domain/types';

interface TenantState {
  // Current Tenant
  currentTenant: Tenant | null;
  tenants: Tenant[];

  // Loading State
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentTenant: (tenant: Tenant) => void;
  setTenants: (tenants: Tenant[]) => void;
  addTenant: (tenant: Tenant) => void;
  updateTenant: (id: string, updates: Partial<Tenant>) => void;
  removeTenant: (id: string) => void;
  switchTenant: (tenantId: string) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  reset: () => void;
}

const initialState = {
  currentTenant: null,
  tenants: [],
  isLoading: false,
  error: null,
};

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentTenant: (tenant) => set({ currentTenant: tenant }),

      setTenants: (tenants) => set({ tenants }),

      addTenant: (tenant) => set((state) => ({
        tenants: [...state.tenants, tenant],
      })),

      updateTenant: (id, updates) => set((state) => ({
        tenants: state.tenants.map((tenant) =>
          tenant.id === id ? { ...tenant, ...updates } : tenant
        ),
        currentTenant:
          state.currentTenant?.id === id
            ? { ...state.currentTenant, ...updates }
            : state.currentTenant,
      })),

      removeTenant: (id) => set((state) => ({
        tenants: state.tenants.filter((tenant) => tenant.id !== id),
        currentTenant: state.currentTenant?.id === id ? null : state.currentTenant,
      })),

      switchTenant: (tenantId) => {
        const tenant = get().tenants.find((t) => t.id === tenantId);
        if (tenant) {
          set({ currentTenant: tenant });
        }
      },

      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: 'tenant-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentTenant: state.currentTenant,
      }),
    }
  )
);
