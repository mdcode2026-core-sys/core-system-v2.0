// src/domain/sessions/sessions.queries.ts
// React Query hooks: useSession, useSessionsByTenant, useSessionsByDoctor

import { useQuery } from '@tanstack/react-query';
import type { SessionStatus } from '../../shared/types/database';

export interface SessionRow {
  id: string;
  tenant_id: string;
  patient_id: string;
  patient_name: string;
  doctor_id: string;
  doctor_name: string;
  room_id: string | null;
  room_name: string | null;
  session_status: SessionStatus;
  actual_check_in: string | null;
  actual_start: string | null;
  actual_end: string | null;
  core_score_display: number | null;
  payment_status: string;
  is_insured: boolean;
}

const SESSION_KEY = 'sessions';

export function useSession(sessionId: string) {
  return useQuery({
    queryKey: [SESSION_KEY, sessionId],
    queryFn: async (): Promise<<SessionRow> => {
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!sessionId,
  });
}

export function useSessionsByTenant(tenantId: string, status?: SessionStatus) {
  return useQuery({
    queryKey: [SESSION_KEY, 'tenant', tenantId, status],
    queryFn: async (): Promise<<SessionRow[]> => {
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!tenantId,
  });
}

export function useSessionsByDoctor(doctorId: string) {
  return useQuery({
    queryKey: [SESSION_KEY, 'doctor', doctorId],
    queryFn: async (): Promise<<SessionRow[]> => {
      throw new Error('Not implemented: wire to Supabase');
    },
    enabled: !!doctorId,
  });
}
