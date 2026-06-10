// src/domain/sessions/sessions.mutations.ts
// Mutations: status transitions, score writes, lock acquire/release

import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { SessionStatus } from '../../shared/types/database';

const SESSION_KEY = 'sessions';

export function useUpdateSessionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      sessionId: string;
      newStatus: SessionStatus;
      actualTimestampField?: 'actual_check_in' | 'actual_start' | 'actual_end' | 'actual_check_out';
      timestamp?: string;
    }) => {
      // TODO: Wire to Supabase with RLS + trigger awareness
      throw new Error('Not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SESSION_KEY, variables.sessionId] });
      queryClient.invalidateQueries({ queryKey: [SESSION_KEY, 'tenant'] });
      queryClient.invalidateQueries({ queryKey: [SESSION_KEY, 'doctor'] });
    },
  });
}

export function useWriteSessionScore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      sessionId: string;
      indicators: {
        score_aps?: number;
        score_dri?: number;
        score_tsi?: number;
        score_uri?: number;
        score_pqs?: number;
        score_rvs?: number;
      };
    }) => {
      // TODO: Wire to Supabase (triggers ghost evaluation honeypot)
      throw new Error('Not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [SESSION_KEY, variables.sessionId] });
    },
  });
}
