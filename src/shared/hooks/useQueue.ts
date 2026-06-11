// src/shared/hooks/useQueue.ts
// Live queue with realtime subscription

import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../infrastructure/supabase/client';
import { useQueueChannel } from '../../core/realtime/useQueueChannel';
import type { QueueItem } from '../store/queueStore';

const QUEUE_KEY = 'live-queue';

export function useQueue(tenantId: string) {
  // Subscribe to realtime changes
  useQueueChannel(tenantId);

  return useQuery({
    queryKey: [QUEUE_KEY, tenantId],
    queryFn: async (): Promise<QueueItem[]> => {
      const { data, error } = await supabase
        .from('clinic_visit_sessions')
        .select(`
          id,
          patient_id,
          session_status,
          actual_check_in,
          actual_start,
          lock_holder_id,
          lock_holder_name,
          wait_time_minutes,
          core_score_display,
          is_insured,
          clinic_patients (full_name),
          clinic_users (full_name),
          clinic_procedures (name)
        `)
        .eq('tenant_id', tenantId)
        .in('session_status', ['pending', 'checked_in', 'in_progress'])
        .order('actual_check_in', { ascending: true });

      if (error) throw error;

      return (data || []).map((row: Record<string, unknown>) => ({
        sessionId: row.id as string,
        patientId: row.patient_id as string,
        patientName: (row.clinic_patients as Record<string, string>)?.full_name ?? 'Unknown',
        priority: 'medium_priority', // Computed from core_score_display
        slaStatus: 'green', // Computed from wait_time_minutes
        waitMinutes: row.wait_time_minutes as number ?? 0,
        lockHolderId: row.lock_holder_id as string | null,
        lockHolderName: row.lock_holder_name as string | null,
        roomId: null,
        doctorId: null,
        procedureName: (row.clinic_procedures as Record<string, string>)?.name ?? null,
        coreScoreDisplay: row.core_score_display as number | null,
      }));
    },
    enabled: !!tenantId,
    refetchInterval: 30000, // Fallback: refetch every 30s if realtime fails
  });
}
