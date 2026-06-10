// src/domain/patients/patients.mutations.ts
// Mutations: createPatient, updatePatient, softDeletePatient

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ClinicPatient } from '../../shared/types/database';

const PATIENT_KEY = 'patients';

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (patient: Omit<<ClinicPatient, 'id' | 'created_at' | 'updated_at'>) => {
      // TODO: Wire to Supabase
      throw new Error('Not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PATIENT_KEY, 'tenant', variables.tenant_id] });
    },
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { id: string; updates: Partial<<ClinicPatient> }) => {
      // TODO: Wire to Supabase
      throw new Error('Not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [PATIENT_KEY, variables.id] });
      queryClient.invalidateQueries({ queryKey: [PATIENT_KEY, 'tenant'] });
    },
  });
}
