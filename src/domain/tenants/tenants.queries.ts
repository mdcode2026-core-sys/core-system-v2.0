// src/domain/tenants/tenants.queries.ts
// React Query hooks: useTenant, useAllTenants

import { useQuery } from '@tanstack/react-query';
import type { TenantConfig } from '../../shared/store/tenantStore';

const TENANT_KEY = 'tenant';

export function useTenant(tenantId: string) {
  return useQuery({
    queryKey: [TENANT_KEY, tenantId],
    queryFn: async (): Promise<TenantConfig> => {
      // TODO: Replace with Supabase client call
      // const { data, error } = await supabase.from('master_tenants').select('*').eq('id', tenantId).single();
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!tenantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAllTenants() {
  return useQuery({
    queryKey: [TENANT_KEY, 'all'],
    queryFn: async (): Promise<TenantConfig[]> => {
      // TODO: Wire to Supabase (super_admin only)
      throw new Error('Not implemented: wire to Supabase');
    },
    staleTime: 60 * 1000,
  });
}
