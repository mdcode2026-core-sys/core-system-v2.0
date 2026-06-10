// src/domain/invoicing/invoicing.mutations.ts
// Mutations: createInvoice, collectPayment, confirmDoctorPar

import { useMutation, useQueryClient } from '@tanstack/react-query';

const INVOICE_KEY = 'invoices';

export function useCreateInvoice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      sessionId: string;
      subtotal_subunits: number;
      tax_subunits?: number;
      discount_subunits?: number;
    }) => {
      // TODO: Wire to Supabase (triggers triangulation auto-verify)
      throw new Error('Not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY, 'session', variables.sessionId] });
    },
  });
}

export function useCollectPayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      invoiceId: string;
      paid_subunits: number;
      payment_method: string;
      collected_by: string;
    }) => {
      // TODO: Wire to Supabase
      throw new Error('Not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY, variables.invoiceId] });
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY, 'session'] });
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY, 'unpaid'] });
    },
  });
}

export function useConfirmDoctorPar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: { invoiceId: string; doctorId: string }) => {
      // TODO: Wire to Supabase (triggers triangulation)
      throw new Error('Not implemented');
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [INVOICE_KEY, variables.invoiceId] });
    },
  });
}
