// Zustand: tenant config + feature flags

import { create } from 'zustand';

interface TenantState {
  tenantId: string | null;
  tenantName: string | null;
  primaryColor: string;
  subscriptionTier: string | null;
  setTenantId: (id: string | null) => void;
  setTenantName: (name: string | null) => void;
  setPrimaryColor: (color: string) => void;
  setSubscriptionTier: (tier: string | null) => void;
}

export const useTenantStore = create<TenantState>()((set) => ({
  tenantId: null,
  tenantName: null,
  primaryColor: '#1B2A4A',
  subscriptionTier: null,
  setTenantId: (id) => set({ tenantId: id }),
  setTenantName: (name) => set({ tenantName: name }),
  setPrimaryColor: (color) => set({ primaryColor: color }),
  setSubscriptionTier: (tier) => set({ subscriptionTier: tier }),
}));
