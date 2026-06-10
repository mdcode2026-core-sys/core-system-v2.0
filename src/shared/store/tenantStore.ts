// src/shared/store/tenantStore.ts
// Zustand: tenant config + feature flags + currency context

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SubscriptionTier = 'trial' | 'essential' | 'professional' | 'enterprise' | 'suspended';

export interface TenantConfig {
  id: string;
  slug: string;
  name: string;
  nameAr: string | null;
  subscriptionTier: SubscriptionTier;
  currency: string; // ISO 4217
  currencySubunit: number;
  timezone: string;
  primaryColor: string;
  logoUrl: string | null;
  maxUsers: number;
  maxPatients: number;
  maxProceduresPerMonth: number;
  maxDevices: number;
}

export interface FeatureFlags {
  aiScheduling: boolean;
  advancedAnalytics: boolean;
  mobileNotifications: boolean;
  patientSelfService: boolean;
  inventoryModule: boolean;
  telehealth: boolean;
}

export interface TenantState {
  config: TenantConfig | null;
  features: FeatureFlags;
  isLoading: boolean;

  // Actions
  setConfig: (config: TenantConfig) => void;
  setFeatures: (features: Partial<<FeatureFlags>) => void;
  setLoading: (loading: boolean) => void;
  clearTenant: () => void;
  getCurrencyContext: () => { code: string; subunit: number } | null;
}

export const useTenantStore = create<TenantState>()(
  persist(
    (set, get) => ({
      config: null,
      features: {
        aiScheduling: false,
        advancedAnalytics: true,
        mobileNotifications: true,
        patientSelfService: true,
        inventoryModule: false,
        telehealth: false,
      },
      isLoading: true,

      setConfig: (config) => set({ config, isLoading: false }),

      setFeatures: (partial) =>
        set((state) => ({
          features: { ...state.features, ...partial },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      clearTenant: () =>
        set({
          config: null,
          features: {
            aiScheduling: false,
            advancedAnalytics: true,
            mobileNotifications: true,
            patientSelfService: true,
            inventoryModule: false,
            telehealth: false,
          },
          isLoading: false,
        }),

      getCurrencyContext: () => {
        const { config } = get();
        if (!config) return null;
        return {
          code: config.currency,
          subunit: config.currencySubunit,
        };
      },
    }),
    {
      name: 'core-tenant-storage',
      partialize: (state) => ({
        config: state.config,
        features: state.features,
      }),
    }
  )
);
