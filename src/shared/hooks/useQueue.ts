// src/shared/hooks/useQueue.ts
// Live queue with realtime subscription

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../../infrastructure/supabase/client';
import { useQueueChannel } from '../../core/realtime/useQueueChannel';
import { useQueueStore, type QueueItem } from '../store/queueStore';

const QUEUE_KEY = 'live-queue';

export function useQueue(tenantId: string) {
  const { setItems, setLoading } = useQueueStore();

  useQueueChannel(tenantId);

  const query = useQuery({
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

      return (data || []).map((row: Record<string, unknown>) => {
        const waitMinutes = row.wait_time_minutes as number ?? 0;
        const score = row.core_score_display as number | null;

        let priority: QueueItem['priority'] = 'medium_priority';
        if (score !== null) {
          if (score >= 80) priority = 'hot_lead';
          else if (score >= 60) priority = 'qualified';
          else if (score >= 40) priority = 'high_priority';
          else if (score < 20) priority = 'low_priority';
        }

        let slaStatus: 'green' | 'yellow' | 'red' = 'green';
        if (waitMinutes > 30) slaStatus = 'red';
        else if (waitMinutes > 15) slaStatus = 'yellow';

        return {
          sessionId: row.id as string,
          patientId: row.patient_id as string,
          patientName: (row.clinic_patients as Record<string, string>)?.full_name ?? 'Unknown',
          priority,
          slaStatus,
          waitMinutes,
          lockHolderId: row.lock_holder_id as string | null,
          lockHolderName: row.lock_holder_name as string | null,
          roomId: null,
          doctorId: null,
          procedureName: (row.clinic_procedures as Record<string, string>)?.name ?? null,
          coreScoreDisplay: score,
        };
      });
    },
    enabled: !!tenantId,
    refetchInterval: 30000,
  });

  useEffect(() => {
    setLoading(query.isLoading);
    if (query.data) {
      setItems(query.data);
    }
  }, [query.data, query.isLoading, setItems, setLoading]);

  return query;
}
