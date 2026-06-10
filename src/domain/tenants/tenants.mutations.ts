// src/domain/tenants/tenants.mutations.ts
// Mutations: updateTier, toggleFlag, activateTenant

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SubscriptionTier } from '../../shared/store/tenantStore';

const TENANT_KEY = 'tenant';

export function useUpdateTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { tenantId: string; newTier: SubscriptionTier }) => {
      // TODO: Wire to Supabase
      throw new Error('Not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [TENANT_KEY, variables.tenantId] });
      queryClient.invalidateQueries({ queryKey: [TENANT_KEY, 'all'] });
    },
  });
}

export function useActivateTenant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tenantId: string) => {
      // TODO: Wire to Supabase
      throw new Error('Not implemented');
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [TENANT_KEY, 'all'] });
    },
  });
}
