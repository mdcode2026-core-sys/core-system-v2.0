// src/domain/patients/patients.queries.ts
// React Query hooks: usePatient, usePatientsByTenant, usePatientSearch

import { useQuery } from '@tanstack/react-query';
import type { ClinicPatient } from '../../shared/types/database';

const PATIENT_KEY = 'patients';

export function usePatient(patientId: string) {
  return useQuery({
    queryKey: [PATIENT_KEY, patientId],
    queryFn: async (): Promise<<ClinicPatient> => {
      // TODO: Wire to Supabase
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!patientId,
  });
}

export function usePatientsByTenant(tenantId: string) {
  return useQuery({
    queryKey: [PATIENT_KEY, 'tenant', tenantId],
    queryFn: async (): Promise<<ClinicPatient[]> => {
      // TODO: Wire to Supabase
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!tenantId,
  });
}

export function usePatientSearch(tenantId: string, query: string) {
  return useQuery({
    queryKey: [PATIENT_KEY, 'search', tenantId, query],
    queryFn: async (): Promise<<ClinicPatient[]> => {
      // TODO: Wire to Supabase (full-text or phone search)
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!tenantId && query.length >= 2,
  });
}
